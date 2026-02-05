/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */

import { HelpData } from "../typedefs/common";
import { LegalValue, PDJ, Property, Section } from "../typedefs/pdj";
import {
  Datum,
  PropertyValue,
  PropertyValueArrayMember,
  PropertyValueHolder,
  RDJ,
  Reference,
} from "../typedefs/rdj";
import { Model } from "./common";
import { extractHelpData, parseIfJson } from "./model-utils";
import { TableContentModel } from "./tablecontentmodel";
import { doUpdate, getData } from "./transport";

export type ModelPropertyValue = PropertyValue | PropertyValue[] | File;
export type TokenValue = string;
export type UnresolvedReference = string;

enum ENTRY_TYPE { REGULAR, UNRESOLVED_REF, MODEL_TOKEN };
  
export class FormContentModel extends Model {
  getTypedPropertyValue(propertyName: string, value: ModelPropertyValue) {
    const fieldDescription = this.getPropertyDescription(propertyName);

    if (typeof value === "string") {
      switch (fieldDescription?.type) {
        case "int":
        case "long":
          value = parseInt(value);
          break;
        case "boolean":
          value = Boolean(value);
          break;
        case "double":
          value = parseFloat(value as string);
          break;
      }
    }
    return value;
  }

  /**
   * Updates the bean with the pending changes. It is the caller's responsibility
   * to handle the server response: Displaying any messages, clearing the pending
   * changes and refreshing on success, forwarding to a new page
   *
   * @returns {Promise<Response>} A promise that resolves to the response from the server.
   */
  update(): Promise<Response> {
    // get a copy of the current changes so any edits are made only on a temp
    // object that will become the payload..
    // that way if the request fails the user won't see the transient edits.
    // This mostly affects forms that rely on usedIf as invisible properties will
    // be dropped
    const changes = { ...this.getChanges() };
    // The changes object only contains edits the user has explicitly made..
    // if the user is doing a create there may be required fields
    // that may not have been edited but they still need to be sent. Fill
    // these in with default values.
    // Also delete any readonly properties...
    this._getAllProperties().forEach((property) => {
      if (
        (this.isActionInput() || (this.isCreate() && property.required)) &&
        typeof changes[property.name] === "undefined"
      ) {
        const propertyValue = this.getProperty(property.name) || '';

        changes[property.name] = {
          value: this.getTypedPropertyValue(property.name, propertyValue),
        } as PropertyValueHolder;
      }

      if (property.readOnly) {
        delete changes[property.name];
      }
    });

    // Delete any changes that don't exist in the currently-displayed properties
    // This might happen if there are some usedIfs that the user has
    // used to toggle some properties on/off
    Object.keys(changes).forEach((changeKey) => {
      if (!this._getAllProperties().find((p) => p.name === changeKey)) {
        delete changes[changeKey];
      }
    });

    const files: Record<string, File> = {};

    // Take out any File types from the changeset and store them in a separate structure
    // This is because the inclusion of a File turns the post request into a multipart form
    // with the form data as one part and files as subsequent parts
    for (const key in changes) {
      const data = changes[key];

      if (data?.value instanceof File) {
        files[key] = data.value;
        delete changes[key];
      }
    }

    // convert all of the int properties from strings...
    Object.keys(changes).forEach((propertyName) => {
      const propertyDescription = this.getPropertyDescription(propertyName);

      if (propertyDescription && this.isFieldNumber(propertyDescription)) {
        if (typeof changes[propertyName].value === "string") {
          changes[propertyName].value =
            this.getTypedPropertyValue(
              propertyName,
              changes[propertyName].value as string,
            ) || changes[propertyName].value;
        }
      }
    });

    // choose between modelTokens and values -- the value is being implicitly set
    // by the onrawValueChanged event and would result in a error from cbe...
    Object.keys(changes).forEach((propertyName) => {
      if (changes[propertyName].modelToken && changes[propertyName].value)
        delete changes[propertyName].value;
    });

    if (this.rdj?.invoker?.resourceData) {
      const rows: PropertyValueHolder | undefined = {
        value: this.rowsSelectedForActionInput?.map((r) => {
          return { value: parseIfJson(r as string) };
        }),
      };

      //TODO: Can action input forms contain files?
      return this.invokeActionInputAction(changes, rows, files);
    } else {
      return doUpdate(this.rdjUrl, changes, files);
    }
  }

  rowsSelectedForActionInput: Array<string | Reference> | undefined;

  /**
   * Refreshes the form data by fetching the latest data from the server.
   *
   * @async
   * @returns {Promise<void>} A promise that resolves when the data has been refreshed.
   */
  async refresh(): Promise<void> {
    if (this.rdjUrl) {
      let reloadRdjUrl = new URL(this.rdjUrl, window.location.href);
      reloadRdjUrl.searchParams.set('reload', 'true');
      return getData(
        reloadRdjUrl.pathname + reloadRdjUrl.search + reloadRdjUrl.hash,
        undefined
      ).then(([rdj, pdj]) => {
        this.rdj = rdj;

        if (pdj) {
          this.pdj = pdj;
        }
        this.pdj.form = this.pdj.createForm || this.pdj.sliceForm;
      });
    }
  }

  /**
   * Changes the current slice for the current rdj, refreshing the form data.
   * Note this does not change the pdj.
   *
   * @param sliceName
   * @returns {Promise<void>} A promise that resolves when the data has been refreshed.
   */
  async changeSlice(sliceName: string): Promise<void> {
    if (this.rdjUrl) {
      const u = new URL(this.rdjUrl);
      u.searchParams.set("slice", sliceName);
      this.rdjUrl = u.toString();

      return this.refresh();
    }
  }

  showAdvanced: boolean = false;
  showInstructions: boolean = true;

  readonly titlesBeforeProperties = new Map<string, string>();
  changes = new Map<string, PropertyValueHolder>();
  messages = new Map<string, string[]>();

  /**
   * whether this is a form used for action inputs
   * @returns {boolean} true if form is an action input form
   */
  isActionInput(): boolean {
    return this.pdj.actionInputForm !== undefined;
  }

  /**
   * whether this is a form used to create a new bean
   * @returns {boolean} true if form will create a new bean
   */
  isCreate(): boolean {
    return this.pdj.createForm !== undefined;
  }

  /**
   * whether this is a form used to edit an existing bean
   * @returns {boolean} true if form will edit an existing bean
   */
  isEdit(): boolean {
    return !this.isCreate();
  }

  /**
   * Determine if the RDJ response has no data payload.
   * Returns true when rdj.data is undefined/null, an empty object, or an empty array.
   */
  isDataMissing(): boolean {
    const d = this.rdj?.data as Record<string, unknown> | Array<unknown> | undefined;
    if (d === undefined || d === null) return true;
    if (Array.isArray(d)) return d.length === 0;
    return Object.keys(d as Record<string, unknown>).length === 0;
  }

  /**
   * Determine if the current bean is a creatable optional singleton.
   * Mirrors legacy behavior of checking self.kind === "creatableOptionalSingleton".
   */
  isCreatableOptionalSingleton(): boolean {
    const kind = (this.rdj?.self as any)?.kind as string | undefined;
    return kind === 'creatableOptionalSingleton';
  }

  /**
   * Determine if the current bean is a non-creatable optional singleton.
   * Checks self.kind === "nonCreatableOptionalSingleton".
   */
  isNonCreatableOptionalSingleton(): boolean {
    const kind = (this.rdj?.self as any)?.kind as string | undefined;
    return kind === 'nonCreatableOptionalSingleton';
  }

  /**
   * whether a dashboard can be created from this form
   * @returns {boolean} true if a dashboard can be created
   */
  canCreateDashboard() {
    return this.getDashboardCreateForm() !== undefined;
  }

  getDashboardCreateForm() {
    return this.rdj.dashboardCreateForm;
  }

  /**
   * Return the createForm reference for this form, if present.
   * Consumers should not access RDJ directly.
   */
  getCreateForm() {
    return this.rdj.createForm;
  }

  /**
   * Return this bean's self.resourceData path, if present.
   * Consumers should not access RDJ directly.
   */
  getSelfResourceData(): string | undefined {
    return (this.rdj?.self as any)?.resourceData as string | undefined;
  }

  /**
   * get slices for a page
   *
   * @returns {Slice[]} array of slices
   */
  getSlices() {
    return this.pdj.sliceForm?.slices || this.pdj.sliceTable?.slices;
  }

  /**
   * get number of columns that are recommended to render form content
   * @returns {number} columns
   */
  getNumberOfColumns(): number {
    return this.pdj.form?.presentation?.singleColumn /*||
      this.pdj.createForm ||
      this.pdj.actionInputForm*/
      ? 1
      : 2;
  }

  /**
   * certain fields are modifiable only if a certain condition of another
   * field is met. For example, a switch for 'listen port enabled'
   * that is on might cause the field for 'listen port' to become enabled.
   * as any property gets set or unset the enabled status of every field needs
   * to be reevaluated.
   *
   * @param {Property} fieldDescription - the field
   * @returns {boolean} true if field is disabled
   */
  isDisabled(fieldDescription: Property): boolean {
    let disabled = false;

    let usedIf;

    if ((usedIf = fieldDescription.usedIf)) {
      const valueUsedIfDependsOn = this.getProperty(usedIf.property);

      if (
        typeof valueUsedIfDependsOn !== "object" &&
        typeof valueUsedIfDependsOn !== "undefined"
      ) {
        disabled = usedIf.values.indexOf(valueUsedIfDependsOn) === -1;
      }
    }

    return disabled;
  }

  /**
   * Certain fields will require a server to be restarted for the change to take effect.
   * This is purely informational, this function can be used to control whether to display
   * a message or indicator to the end user.
   * @param {Property} fieldDescription - the field
   * @returns {boolean} true if a server restart is required for change to take effect
   */
  isRestartNeeded(fieldDescription: Property): boolean {
    return fieldDescription.restartNeeded || false;
  }

  /**
   * Whether a value for a field is considered to be required for the bean to be submitted.
   * Any field that is required that does not have a value provided will result in
   * a validation failure once the bean is submitted. The frontend may use this for
   * informational purposes, to block form submission, etc.
   * @param {Property} fieldDescription - the field
   * @returns {boolean} true if this field is required
   */
  isRequired(fieldDescription: Property): boolean {
    return fieldDescription.required || false;
  }

  /**
   * Whether the value of a field is readonly as some fields (such as usually the
   * name of a bean) are immutable and should not be allowed to be edited by the
   * frontend.
   *
   * @param {Property} fieldDescription - the field
   * @returns {boolean} true if the field is read only
   */
  isReadOnly(fieldDescription: Property): boolean {
    return fieldDescription.readOnly || false;
  }



  /**
   * Get the width hint for a property (e.g., 'xxl', 'lg')
   * Indirect fields default to 'xxl' width if no width is specified
   *
   * @param {Property} fieldDescription - the field
   * @returns {string|undefined} width hint if present
   */
  getWidth(fieldDescription: Property): string | undefined {
    const width = fieldDescription.presentation?.width || fieldDescription.width;

    // Check if this field is indirect and has no width specified
    if (!width) {
      const isIndirectField = (() => {
        if (this.rdj?.data && !Array.isArray(this.rdj.data)) {
          const propertyData = (this.rdj.data as any)[fieldDescription.name] as PropertyValueHolder;
          return propertyData?.indirect === true;
        }
        return false;
      })();

      if (isIndirectField) {
        return 'xxl';
      }
    }

    return width;
  }

  /**
   * Whether entire form is read only
   * 
   * @returns {boolean} true if the form is readonly 
   */
  isFormReadOnly(): boolean {
    return this.pdj.sliceForm?.readOnly || false;
  }

  /**
   * whether a field is a boolean
   * @param {Property} fieldDescription - the field
   * @returns {boolean} true if field is boolean
   */
  isFieldBoolean(fieldDescription: Property): boolean {
    return fieldDescription.type === "boolean";
  }

  /**
   * whether a field is a properties (List of key/value pairs)
   *
   * @param {Property} fieldDescription - the field
   * @returns {boolean} true if field is properties
   */
  isFieldProperties(fieldDescription: Property): boolean {
    return fieldDescription.type === "properties";
  }

  /**
   * whether a field is a policy expression (entitleNetExpression)
   *
   * @param {Property} fieldDescription - the field
   * @returns {boolean} true if field is a policy expression
   */
  isPolicyExpression(fieldDescription: Property): boolean {
    return fieldDescription.type === "entitleNetExpression";
  }

  /**
   * whether a field is a file to be uploaded
   *
   * @param fieldDescription - the field
   * @returns {boolean} true if field is a file
   */
  isFieldFileContents(fieldDescription: Property): boolean {
    return fieldDescription.type === "fileContents";
  }

    /**
   * whether a field is a file to be uploaded
   *
   * @param fieldDescription - the field
   * @returns {boolean} true if field is a file
   */
  isFieldFilename(fieldDescription: Property): boolean {
    return fieldDescription.type === "filename";
  }

  /**
   * whether a field is a file to be created
   *
   * @param fieldDescription - the field
   * @returns {boolean} true if field is a file
   */
  isFieldNewFilename(fieldDescription: Property): boolean {
    return fieldDescription.type === "newFilename";
  }

  /**
   * whether a field is a secret
   *
   * @param {Property} fieldDescription - the field
   * @returns {boolean} true if field is secret
   */
  isSecretField(fieldDescription: Property) {
    return fieldDescription.type === "secret";
  }

  /** Check if the property is one of the number types */
  isFieldNumber(fieldDescription: Property): boolean {
    let result = false;
    switch (fieldDescription.type) {
      case "int":
      case "long":
      case "double":
        result = true;
        break;
      default:
        result = false;
        break;
    }
    return result;
  }

  isFieldArray(fieldDescription: Property) {
    return fieldDescription.array;
  }

  /**
   * whether a field involves choosing from a list of options
   * (e.g. an html select)
   * @param {Property} fieldDescription - the field
   * @returns {boolean} true if field is a select from a list of options
   */
  isFieldSelect(fieldDescription: Property): boolean {
    return (
      fieldDescription.array !== true &&
      (fieldDescription.type?.startsWith("reference") ||
        fieldDescription.legalValues !== undefined)
    );
  }

  /**
   * whether a field is a multi-select (i.e. reference-dynamic-enum)
   *
   * @param fieldDescription - the field
   * @returns {boolean} true if field is a multi-select
   */
  isFieldMultiSelect(fieldDescription: Property): boolean {
    return (
      fieldDescription.array === true &&
      (fieldDescription.type?.startsWith("reference") === true)
    );
  }

  /**
   * get a list of options for a select field
   *
   * @param {Property} fieldDescription - the field
   * @returns list of options
   */
  getSelectionsForProperty(fieldDescription: Property) {
    if (fieldDescription.legalValues) {
      return fieldDescription.legalValues;
    } else if (fieldDescription.type === "reference-dynamic-enum") {
      return this.getOptionsForReferenceDynamicEnum(fieldDescription.name)
        ?.options;
    } else if (fieldDescription.type === "reference") { 
      return this.getOptionForReference(fieldDescription.name)
        ?.options;
    } else {
      return [] as LegalValue[];
    }
  }

  /**
   * get the options source for a select field
   * @param {Property} fieldDescription - the field
   * @returns
   */

  getOptionsSources(fieldDescription: Property) {
    if (fieldDescription.type === "reference-dynamic-enum") {
      return this.getOptionsForReferenceDynamicEnum(fieldDescription.name)
        ?.optionSources;
    }
  }

  constructor(rdj: RDJ, pdj: PDJ) {
    super(rdj, pdj);

    // form is a synthetic property that is a union of the types of forms...
    this.pdj.form = pdj.createForm || pdj.sliceForm || pdj.actionInputForm;
  }

  /**
   * Get the field descriptor for a given property
   *
   * @param {string} propertyName - name of property
   * @returns {Property|undefined} field descriptor if property exists
   */
  getPropertyDescription(propertyName: string) {
    // gather all the properties... can't use _getAllProperties here because that causes a cycle
    // when it tries to evaluate usedIfs
    const allProperties = [
      ...(this.pdj.form?.properties || []),
      ...((this.showAdvanced ? this.pdj.form?.advancedProperties : []) || []),
    ];

    const getPropertiesFromSections = (sections: Section[]) => {
      const properties: Property[] = [];
      sections.forEach((section) => {
        if (section.properties) {
          properties.push(...section.properties);
        }

        if (section.sections) {
          properties.push(...getPropertiesFromSections(section.sections));
        }
      });

      return properties;
    };

    if (this.pdj.form?.sections) {
      allProperties.push(...getPropertiesFromSections(this.pdj.form.sections));
    }

    const property = allProperties.find((p) => p.name === propertyName);

    return property;
  }

  /**
   * Get a list of Properties to be displayed. This will take into account
   * whether or not to show advanced properties and what properties get shown/hidden
   * based on usedIfs
   *
   * @returns {Property[]} properties
   */
  getPropertyDescriptions() {
    return this._getAllProperties();
  }

  /**
   * Get a placeholder value for a property
   *
   * @param {Property} fieldDescription - the property
   * @returns {string|undefined} string to display
   */

  getPlaceHolder(fieldDescription: Property): string | undefined {
    return fieldDescription.presentation?.inlineFieldHelp;
  }

  /**
   * Get the display label for a property
   *
   * @param fieldDescription - the property
   * @returns {string} string to display
   */
  getTitle(fieldDescription: Property) {
    return fieldDescription.label || fieldDescription.name;
  }

  getHint(fieldDescription: Property) {
    return (
      this.getProperty(fieldDescription.name) || this.getTitle(fieldDescription)
    );
  }

  getIntroductionHTML() {
    return this.rdj.introductionHTML || this.pdj.introductionHTML;
  }

  getHelpTopics() {
    return this.pdj.helpTopics;
  }

  getDetailedHelp(): HelpData[] {
    return extractHelpData(this._getAllProperties());
  }

  private getOptionForReference(propertyName: string) { 
    if (this.rdj.data) {
      let data;

      if (!Array.isArray(this.rdj.data)) {
        data = (this.rdj.data as any)[propertyName] as PropertyValueHolder;

        return {
          options: [{ label: (data.value as Reference) ?.label, value: data.value }],
          optionSources: [],
        };
       }
    }

  }

  private getOptionsForReferenceDynamicEnum(propertyName: string) {
    if (this.rdj.data) {
      let data;

      if (!Array.isArray(this.rdj.data)) {
        data = (this.rdj.data as any)[propertyName] as PropertyValueHolder;
        return {
          options: data?.options,
          optionSources: data?.optionsSources,
        };
      } else {
        data = this.rdj.data.map((d) => {
          return {
            label: (d as any).identity.value?.label as string,
            value: (d as any).identity.value as string,
          };
        });

        return { options: data };
      }
    }
  }

  /**
   * get (e.g. validation) messages for a field to display to end user.
   * @param {string} propertyName - property name
   * @returns {string[]} messages associated with the field
   */
  getMessages(propertyName: string): string[] {
    return this.messages.get(propertyName) ?? ([] as string[]);
  }

  /**
   * get a list of all the property names in this bean that should be shown.
   * it will include regular properties plus advanced properties only if the showAdvanced
   * property has been set to true.
   * any property that is conditional (i.e. guarded by a usedIf) that evaluates to false
   * will be supressed. because of this, this list should be considered dynamic as it can
   * change between every field edit.
   * @returns {string[]} visible properties
   */
  getPropertyList(): string[] {
    const allProperties = this._getAllProperties();

    return allProperties.map((p) => p.name);
  }

  hasAdvancedProperties(): boolean {
    return (
      (this.pdj.form?.advancedProperties &&
        this.pdj.form?.advancedProperties.length > 0) ||
      false
    );
  }

  getTitleToInsertBeforePropertie(propertyName: string) {
    return this.titlesBeforeProperties.get(propertyName);
  }

  /**
   * Whether the current form defines sections
   * @returns {boolean} true if the PDJ form has sections
   */
  hasSections(): boolean {
    return Array.isArray(this.pdj.form?.sections) && (this.pdj.form?.sections?.length || 0) > 0;
  }

  /**
   * Return top-level property names defined directly under form.properties (not inside sections)
   * Useful to render non-sectioned properties when sections are present.
   */
  getTopLevelPropertyNames(): string[] {
    return (this.pdj.form?.properties || []).map((p) => p.name);
  }

  /**
   * Return the visible sections tree after applying section-level usedIf filtering.
   * Properties are left intact; property-level usedIf still controls enablement/visibility at render-time.
   * @returns {Section[]} filtered sections
   */
  getVisibleSections(): Section[] {
    const sections = this.pdj.form?.sections || [];

    const evaluateUsedIf = (usedIf?: { property: string; values: PropertyValue[] }) => {
      if (!usedIf) return true;
      const valueUsedIfDependsOn = this.getProperty(usedIf.property);
      if (typeof valueUsedIfDependsOn === "object" || typeof valueUsedIfDependsOn === "undefined") {
        return false;
      }
      return usedIf.values.indexOf(valueUsedIfDependsOn) !== -1;
    };

    const filterSection = (section: Section): Section | undefined => {
      if (!evaluateUsedIf(section.usedIf)) return undefined;

      const childSections =
        (section.sections || [])
          .map((s) => filterSection(s as Section))
          .filter((s): s is Section => !!s) || [];

      // Keep properties as-is; do not filter by property.usedIf here
      const props = section.properties ? [...section.properties] : undefined;

      const filtered: Section = {
        ...section,
        sections: childSections.length ? childSections : undefined,
        properties: props
      };

      return filtered;
    };

    return sections
      .map((s) => filterSection(s as Section))
      .filter((s): s is Section => !!s);
  }

  // Get all properties that have not been ignored due to usedIf
  private _getAllProperties() {
    const allProperties = [
      ...(this.pdj.form?.properties || []),
      ...((this.showAdvanced ? this.pdj.form?.advancedProperties : []) || []),
    ];

    let usedProperties: Property[] = [];

    const addSectionsProperties = (sections: Section[]) =>
      sections?.forEach((section) => {
        let ignore = false;

        if (section.usedIf) {
          const valueUsedIfDependsOn = this.getProperty(
            section.usedIf.property,
          );

          if (
            typeof valueUsedIfDependsOn !== "object" &&
            typeof valueUsedIfDependsOn !== "undefined"
          ) {
            ignore = section.usedIf.values.indexOf(valueUsedIfDependsOn) === -1;
          }
        }

        if (!ignore) {
          if (section.title && section.properties?.length) {
            const firstPropertyOfSection = section.properties[0].name;
            this.titlesBeforeProperties.set(
              firstPropertyOfSection,
              section.title,
            );
          }

          usedProperties.push(...(section.properties || []));

          if (section.sections) {
            addSectionsProperties(section.sections);
          }
        }
      });

    if (this.pdj.form?.sections) {
      addSectionsProperties(this.pdj.form?.sections);
    } else {
      usedProperties = allProperties;
    }

    return usedProperties;
  }

  getDefaultValueForProperty(propertyName: string) {
    if (this.pdj.createForm?.sections) {
      const checkSectionsForDefault = (sections: Section[]) => {
        sections.forEach((section) => {
          const property = section.properties?.find(
            (property) => propertyName === property.name,
          );
          if (property?.defaultValue) {
            return property.defaultValue;
          } else if (!property && section.sections) {
            checkSectionsForDefault(section.sections);
          }
        });
      };

      checkSectionsForDefault(this.pdj.createForm?.sections);
    }
    return undefined;
  }

  /**
   * Whether a property has been restored to default value (prior to updating)
   * 
   * @param {string} propertyName - property to check 
   * @returns {boolean} true if the property has been restored to default 
   */
  isPropertyDefaulted(propertyName: string) {
    return !this.isCreate() && !this.isActionInput() && typeof this.getProperty(propertyName) === 'undefined';
  }

  /**
   * Get the value of a property, either edited (pending change) or from server
   *
   * @param {string} propertyName - property to get
   * @returns {PropertyValue|undefined} value that has been set or original value from server or undefined if property is unknown
   */
  getProperty(
    propertyName: string,
  ) /*: PropertyValue[] | PropertyValue | Reference | UnresolvedReference |File | undefined */ {
    let data: PropertyValueHolder | undefined = undefined;

    if (this.rdj.data && !Array.isArray(this.rdj.data))
      data = this.rdj.data[propertyName]; //as PropertyValueHolder;

    let rdjValue = data?.value;

    if (typeof rdjValue === "undefined") rdjValue = data?.modelToken;

    if (Array.isArray(rdjValue)) {
      const unmarshall = (propertyValues: PropertyValue[]) =>
        propertyValues.map((v) => (v as PropertyValueArrayMember)?.value);

      if (this.changes.get(propertyName)?.modelToken) {
        return this.changes.get(propertyName)?.modelToken;
      }

      // Check if the property has been restored to default
      if (this.changes.get(propertyName) && typeof this.changes.get(propertyName)?.value === 'undefined') {
        return undefined;
      }

      return this.changes.get(propertyName)
        ? unmarshall(this.changes.get(propertyName)?.value as PropertyValue[])
        : unmarshall(rdjValue);
    } else {
      let retVal;

      const change = this.changes.get(propertyName);
      if (change) {
        if (typeof change?.value !== 'undefined') {
          retVal = change.value;
        } else {
          retVal = change.modelToken;
        }
      } else {
        retVal = rdjValue;
      }

      // check if this field has been reset to default and return
      if (typeof retVal === 'undefined') {
        return retVal;
      }

      const property = this.getPropertyDescription(propertyName);

      if (property?.array && Array.isArray(retVal)) {
        retVal = retVal.map((m) => (m as PropertyValueArrayMember).value);
      }

      if (property && this.isFieldBoolean(property) && !retVal) return false;

      return retVal;
    }
  }

  setPropertyAsTokenValue(
    propertyName: string,
    tokenValue: TokenValue,
  ): TokenValue {
    return this._setProperty(
      ENTRY_TYPE.MODEL_TOKEN,
      propertyName,
      tokenValue,
    ) as TokenValue;
  }

  setPropertyAsUnresolvedReference(
    propertyName: string,
    unresolvedReference: UnresolvedReference,
  ): UnresolvedReference {
    return this._setProperty(
      ENTRY_TYPE.UNRESOLVED_REF,
      propertyName,
      unresolvedReference,
    ) as UnresolvedReference;
  }

  setProperty(
    propertyName: string,
    propertyValue?: ModelPropertyValue,
  ): ModelPropertyValue | undefined {
    return this._setProperty(ENTRY_TYPE.REGULAR, propertyName, propertyValue);
  }
  /**
   * edit a field
   * @param {string} propertyName - name of property
   * @param {PropertyValue} propertyValue - new value for property
   * @returns {PropertyValue} - the new value for this property
   */
  _setProperty(
    entryType: ENTRY_TYPE,
    propertyName: string,
    propertyValue?: ModelPropertyValue,
  ): ModelPropertyValue | undefined {

    // check if this is an unset operation...
    if (typeof propertyValue === 'undefined') {
      this.changes.delete(propertyName);
      this.changes.set(propertyName, {
        set: false
      });

      return propertyValue;
    }

    // null may be legal for a reference-dynamic-enum
    if (
      propertyValue === null &&
      this.getPropertyDescription(propertyName)?.type !==
        "reference-dynamic-enum"
    ) {
      propertyValue = "";
    }

    // oj-c-input-text will turn everything into a string, convert it back for comparison...
    // When setting a model token, do NOT coerce the token string to a boolean/number
    let compareValue: any;
    if (entryType === ENTRY_TYPE.MODEL_TOKEN) {
      compareValue = propertyValue;
    } else {
      compareValue = this.getTypedPropertyValue(propertyName, propertyValue!);
    }

    const data = (this.rdj.data as any)?.[propertyName] as PropertyValueHolder;
    let rdjValue = data?.value;

    if (typeof rdjValue === "undefined") rdjValue = data?.modelToken;

    if (typeof rdjValue !== "number" && typeof rdjValue === "undefined") {
      rdjValue = this.getDefaultValueForProperty(propertyName);

      if (rdjValue === undefined) {
        const fieldDescription = this.getPropertyDescription(propertyName);

        if (fieldDescription && this.isFieldArray(fieldDescription)) {
          rdjValue = [{ value: "" }];
        } else {
          rdjValue = "";
        }
      }
    }

    if (rdjValue === null) {
      rdjValue = "";
    }

    if (!Array.isArray(propertyValue)) {
      if (
        typeof compareValue === "object" &&
        JSON.stringify(compareValue) === JSON.stringify(rdjValue)
      ) {
        this.changes.delete(propertyName);
      } else if (
        typeof compareValue !== "object" &&
        compareValue === rdjValue
      ) {
        this.changes.delete(propertyName);
      } else {
        const propertyValueHolder =
          this.changes.get(propertyName) ?? ({} as PropertyValueHolder);

        if (entryType === ENTRY_TYPE.REGULAR) {
          propertyValueHolder.value = propertyValue;
          delete propertyValueHolder.modelToken;
        } else if (entryType === ENTRY_TYPE.MODEL_TOKEN) {
          if (typeof propertyValue !== "string") {
            throw new Error("modelToken is not a string");
          }
          propertyValueHolder.modelToken = propertyValue;
          delete propertyValueHolder.value;
        } else if (entryType === ENTRY_TYPE.UNRESOLVED_REF) {
          if (typeof propertyValue !== "string") {
            throw new Error("unresolvedReference is not a string");
          }
          propertyValueHolder.value = {
            label: propertyValue,
            unresolvedReference: propertyValue,
          };
          delete propertyValueHolder.modelToken;
        }

        this.changes.set(propertyName, propertyValueHolder);
      }
    } else {
      const newPropertyValue = propertyValue.map((pv) => {
        return { value: pv };
      });

      if (JSON.stringify(newPropertyValue) === JSON.stringify(rdjValue)) {
        this.changes.delete(propertyName);
      } else {
        const propertyValueHolder =
          this.changes.get(propertyName) ?? ({} as PropertyValueHolder);
        propertyValueHolder.value = newPropertyValue;
        delete propertyValueHolder.modelToken;

        this.changes.set(propertyName, propertyValueHolder);
      }
    }

    return propertyValue;
  }

  resetProperty(propertyName: string) {
    //
    //  let p: PropertyValue = this.pdj.
    //  this.setProperty(propertyName, );
  }

  clear() {
    this.clearChanges();
    this.clearMessages();
  }

  /**
   * delete all pending changes
   */
  clearChanges() {
    this.changes.clear();
  }

  /**
   * remove all field level informational messages
   */
  clearMessages() {
    this.messages.clear();
  }

  /**
   * get all of the pending changes for this bean
   * @returns {Record<string,PropertyValueHolder>} object containing changes
   */
  getChanges(): Record<string, PropertyValueHolder> {
    // filter out disabled properties
    return Object.fromEntries(this.changes.entries());
  }

  /**
   * whether the bean has been edited and has pending changes for the server
   * @returns {boolean} true if there are changes
   */
  hasChanges(): boolean {
    return Object.entries(this.getChanges()).length > 0;
  }

  /**
   * whether an individual property has been changed
   *
   * @param propertName name of property
   * @returns true is there are pending changes
   */
  hasPropertyChanged(propertyName: string): boolean {
    // if there is a change that has not yet been submitted to the cbe...
    if (this.getChanges()[propertyName] !== undefined && this.getChanges()[propertyName].set !== false) {
      return true;
    }

    // look to see if the cbe has marked the property as set (implying that it is set in config.xml)
    if (this.rdj.data) {
      let data: Array<Datum> = [];
      if (!Array.isArray(this.rdj.data)) {
        data = [this.rdj.data];
      } else {
        data = this.rdj.data as Datum[];
      }

      for (const datum of data) {
        if (datum[propertyName]?.set) {
          return true;
        }
      }
    }
    return false;
  }

  //TODO
  getCompensatingPayload() {}

  clone() {
    const clonedModel = Object.create(Object.getPrototypeOf(this));
    Object.assign(clonedModel, this);
    return clonedModel;
  }
}
