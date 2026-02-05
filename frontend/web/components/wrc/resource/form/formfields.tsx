/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import { h } from 'preact';
import { ComponentChildren, ComponentProps } from "preact";
import { Dispatch, useContext, useEffect, useRef, useState } from "preact/hooks";
import MutableArrayDataProvider = require("ojs/ojmutablearraydataprovider");

import { ItemContext } from "@oracle/oraclejet/ojcommontypes";
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import { ojInputText, ojInputTextEventMap } from "ojs/ojinputtext";
import { ojSwitch } from "ojs/ojswitch";
import * as Translations from "ojs/ojtranslation";
import MultiSelect, { ChangeEvent, SelectOption } from "wrc/multiselect";
import { requireAsset } from "wrc/shared/url";
import { FormContentModel } from "../../shared/model/formcontentmodel";
import { Property } from "../../shared/typedefs/pdj";
import { PropertyValue, PropertyValueHolder, Reference } from "../../shared/typedefs/rdj";
import { UserContext } from "../resource";
import { KebabMenu } from "./kebab-menu";
import PolicyExpression from "./policy-expression";

import "oj-c/input-password";
import { ojDialog } from "ojs/ojdialog";
import { ojRadioset } from "ojs/ojradioset";
import { ComponentMessageItem } from '@oracle/oraclejet-preact/UNSAFE_ComponentMessage';
import ListDataProviderView = require("ojs/ojlistdataproviderview");
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import { ojTable } from "ojs/ojtable";
import "oj-c/button";
import "oj-c/input-text";

import { CButtonElement } from "oj-c/button";
import { ElectronAPI } from 'wrc/shared/typedefs/electron';
import { ojPopup } from 'ojs/ojpopup';
import { getDataComponentText } from "wrc/shared/model/transport";
import "css!wrc/shared/shared-styles.css";
import * as Logger from "ojs/ojlogger";

const _UNUSED = h;

type TextAreaProps = ComponentProps<"oj-text-area">;

type FieldProps = {
  fieldDescription: Property;
  formModel: FormContentModel;
};

type InputFieldProps = {
  fieldDescription: Property;
  formModel: FormContentModel;
  valueChangedHandler: (event: ojInputText.valueChanged) => void;
};

export const getLabel = (
  fieldDescription: Property,
  formModel: FormContentModel,
) => {
  const widthHint = formModel.getWidth(fieldDescription);

  // For 'lg' and 'xxl' width fields, the label is rendered within getInputField instead
  if (widthHint === 'lg' || widthHint === 'xxl') {
    return null;
  }

  const labelText: string = `${fieldDescription.label}${formModel.isRequired(fieldDescription) ? "*" : ""}`;

  // oj-label doesn't support stylized help -- so convert the helpSummaryHTML to a text string

  let help: { definition: string } | undefined;
  let helpSummaryText: string | undefined;

  if (fieldDescription.helpSummaryHTML) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = fieldDescription.helpSummaryHTML;

    helpSummaryText = tempDiv.innerText;
    help = { definition: helpSummaryText };
  }

  const popupRef = useRef<ojPopup>(null);
  const buttonRef = useRef<CButtonElement>(null);
  const [tooltipText, setTooltipText] = useState<string | undefined>(
    helpSummaryText,
  );

  const showHelpCallback = () => {
    if (fieldDescription.detailedHelpHTML) {
      // Hide tooltip immediately to avoid overlap with popup
      setTooltipText(undefined);
      popupRef.current!.open(buttonRef.current!);
    }
  };

  const labelGroupClass = "oj-flex-item oj-flex-bar-start oj-flex oj-sm-flex-wrap-nowrap oj-sm-align-items-center wrc-label-group";

  return (
    <>
      <div class='oj-flex oj-flex-bar oj-sm-align-items-center'>
        <div class={labelGroupClass}>
          {helpSummaryText ? (<>
            <oj-popup
              ref={popupRef}
              onojOpen={() => setTooltipText(undefined)}
              onojClose={() => setTooltipText(helpSummaryText)}
            >
              <span
                dangerouslySetInnerHTML={{
                  __html: fieldDescription.detailedHelpHTML,
                }}
              ></span>
            </oj-popup>

            <oj-c-button
              ref={buttonRef}
              onojAction={showHelpCallback}
              chroming="ghost"
              tooltip={tooltipText}
              aria-label={t?.["wrc-form-toolbar"]?.icons?.help?.tooltip}
              class="oj-sm-margin-0 oj-sm-padding-0"
            >
              <span slot="startIcon" class="oj-ux-ico-help" style="font-size:0.8em;line-height:1;display:inline-block"></span>
            </oj-c-button>

          </>) : (
            // Invisible placeholder to prevent label text shifting when no help is available.
            // Uses same component and icon structure to occupy identical space.
            <oj-c-button
              chroming="ghost"
              class="oj-sm-margin-0 oj-sm-padding-0"
              style="visibility:hidden"
              aria-hidden="true"
              disabled={true}
              tabindex={-1 as any}
            >
              <span slot="startIcon" class="oj-ux-ico-help" style="font-size:0.8em;line-height:1;display:inline-block"></span>
              </oj-c-button>
          )}
          <oj-label id={fieldDescription.name + '_LABEL'} class="oj-sm-align-self-center oj-sm-margin-0 oj-sm-padding-0">
            <span class="wrc-label-text">{labelText}</span>
          </oj-label>
        </div>
      <div class="oj-flex-bar-end"></div>
      </div>
    </>
  );
};

enum FIELD_SETTINGS_ENTRY_TYPE {
  "unset",
  "regular",
  "token",
  "unresolvedRef",
}

const isAToken = (value: any) =>
  typeof value === "string" && value.startsWith("@@") && value.endsWith("@@");

const RestartNeededImage = ({ fieldDescription, formModel }: FieldProps) => {
  const visibility = formModel.isRestartNeeded(fieldDescription)
    ? "visible"
    : "hidden";

  const imgSrc = requireAsset("wrc/assets/images/restart-required-org_24x24.png");

  return !formModel.canSupportTokens ? (
    <img
      className="restart-required-icon"
      src={imgSrc}
      style={{ visibility }}
      title="Server or App Restart Required"
    ></img>
  ) : (
    <></>
  );
};

// What to display when a field has been 'Restored to default'
const DefaultedField = () => (
  <oj-input-text
    id="why"
    class="cfe-form-input-integer-sm"
    value={t["wrc-pdj-unset"].placeholder.value}
    disabled={true}
    readonly={true}
    labelEdge="none"
    aria-disabled="true"
  />
);

const FieldSettingsLauncher = ({
  fieldDescription,
  formModel,
}: {
  fieldDescription: Property;
  formModel: FormContentModel;
}) => {
  const isDisabled = formModel.isDisabled(fieldDescription);
  let iconStyle = "";
  if (isDisabled) iconStyle += " visibility: hidden;";

  const open = () => {
    const evt = new CustomEvent("open-field-settings", {
      detail: { fieldDescription },
    });
    document.dispatchEvent(evt);
  };

  return (
    <oj-c-button
      chroming="ghost"
      onojAction={open}
      tooltip={t["wrc-form"].icons.wdtIcon.tooltip}
      aria-label={t["wrc-form"].icons.wdtIcon.tooltip}
      style={iconStyle}
    >
      <span slot="startIcon" class="oj-ux-ico-target cfe-button-icon"></span>
    </oj-c-button>
  );
};

export const getArrayInputField = (
  fieldDescription: Property,
  formModel: FormContentModel,
  valueChangedHandler: (event: ojInputText.valueChanged) => void,
  setModel?: Dispatch<FormContentModel>,
) => {
  const renderRow = (
    row: ojTable.RowTemplateContext<string, TableRow>,
    data: TableRow[],
    dataProvider: MutableArrayDataProvider<string, TableRow>,
    saveDataToModel: (event: ojInputText.valueChanged) => void,
    isReadOnly: boolean,
    fieldDescription: Property,
    formModel: FormContentModel,
    setModel?: Dispatch<FormContentModel>
  ) => {
    const updateValue = (event: ojInputText.valueChanged) => {
      if (event.detail.updatedFrom === "internal") {
        row.data["value"] = event.detail.value;
        saveDataToModel(event);
      }
    };

    const deleteRow = () => {
      const index = data.indexOf(row.data);
      if (index > -1) {
        data.splice(index, 1);
        dataProvider.data = data;
        const newValue = data.map(d => d.value);
        formModel.setProperty(fieldDescription.name, newValue);
        setModel?.(formModel.clone());
      }
    };

    return (
      <>
        <tr>
          {row.mode == "navigation" && (
            <td>{row.data["value"]}</td>
          )}
          {row.mode == "edit" && (
            <td>
              <oj-input-text
                data-property={fieldDescription.name}
                value={row.data["value"]}
                class="editable"
                onvalueChanged={updateValue}
              ></oj-input-text>
            </td>
          )}
          {!isReadOnly && (
            <td>
              <oj-c-button
                display="icons"
                chroming="borderless"
                data-property={fieldDescription.name}
                label={t["wrc-pdj-fields"]?.["cfe-property-list-editor"]?.labels.deleteButtonTooltip}
                onojAction={deleteRow}
              >
                <span slot="endIcon" class="oj-ux-ico-trash"></span>
                {
                  t["wrc-pdj-fields"]?.["cfe-property-list-editor"]?.labels
                    .deleteButtonTooltip
                }
              </oj-c-button>
            </td>
          )}
        </tr>
      </>
    );
  };

  let idCounter = 0;

  return getTableEditor({
    fieldDescription,
    formModel,
    valueChangedHandler,
    setModel,
    columns: [
      {
        headerText: "Value",
        field: "value",
        resizable: "enabled",
        width: "93%"
      },
    ],
    getData: (modelValue) => {
      idCounter = 0;
      return (modelValue || []).map((v: any) => ({ id: idCounter++, value: v }));
    },
    saveData: (data) => data.map(d => d.value),
    newRow: (data) => {
      const maxId = data.length > 0 ? Math.max(...data.map((d: any) => d.id)) + 1 : 0;
      return { id: maxId, value: "" };
    },
    keyField: "id",
    renderRow,
  });
};

export const getSecretInputField = (
  fieldDescription: Property,
  formModel: FormContentModel,
  valueChangedHandler: (event: ojInputText.valueChanged) => void,
  setModel?: Dispatch<FormContentModel>,
) => {
  type InputPasswordProps = ComponentProps<"oj-c-input-password">;

  let clazz: InputPasswordProps["class"] = formModel.isFieldNumber(
    fieldDescription,
  )
    ? "cfe-form-input-integer-sm"
    : "cfe-form-input-text";

  const disabled: InputPasswordProps["disabled"] =
    formModel.isDisabled(fieldDescription);
  const id: InputPasswordProps["id"] = fieldDescription.name;
  const messages: InputPasswordProps["messagesCustom"] = formModel
    .getMessages(fieldDescription.name)
    .map((c) => {
      return { detail: c };
    });
  const readonly: InputPasswordProps["readonly"] =
    formModel.isReadOnly(fieldDescription);
  const required: InputPasswordProps["required"] =
    formModel.isRequired(fieldDescription);
  const title: InputPasswordProps["title"] =
    formModel.getTitle(fieldDescription);


  const untypedValue = formModel.getProperty(fieldDescription.name);

  if (
    untypedValue &&
    typeof formModel.getProperty(fieldDescription.name) !== "string"
  ) {
    throw new Error(
      `Expected ${fieldDescription.name} type to be string, got ${typeof formModel.getProperty(fieldDescription.name)}`,
    );
  }

  const value: InputPasswordProps["value"] = formModel.getProperty(
    fieldDescription.name,
  ) as string;

  const isDefaulted = formModel.isPropertyDefaulted(fieldDescription.name);

  /*
        class={attrs.class}
      disabled={attrs.disabled}
      displayOptions={{ messages: "none" }}
      label-edge="none"
      // messagesCustom={attrs.messagesCustom as ComponentMessageItem[]}
      onrawValueChanged={valueChangedHandler}
      placeholder=""
      readonly={attrs.readonly}
      required={attrs.required}
      title={attrs.title}
      user-assistance-density="reflow"
      value={attrs.value}
      data-property={fieldDescription.name}
      id={attrs.id}
      columnSpan={2}
      style={{width:"80%"}}
  */
  const getOjInputPassword = (
    clazz: string,
    valueChangedHandler: (event: ojInputText.valueChanged) => void,
    showAsDefaulted?: boolean
  ) =>
    !showAsDefaulted ? (
      <oj-c-input-password
        id={id}
        class={clazz}
        disabled={disabled}
        displayOptions={{ messages: "none" }}
        label-edge="none"
        label-hint={fieldDescription.label}
        // messagesCustom={messages}
        onrawValueChanged={valueChangedHandler}
        placeholder=""
        readonly={readonly}
        required={required}
        title={title}
        user-assistance-density="reflow"
        value={value}
        data-property={fieldDescription.name}
      />
    ) : (
      <DefaultedField/>
    );
  
  // if is a wdt token -- display as a read only plain text field
  const isWDTToken =
    formModel.canSupportTokens &&
    value.startsWith("@@") &&
    value.endsWith("@@");

  return (
    <div class="OLDcfe-form-field oj-flex oj-flex-item">
      <span class={`wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? 'wrc-field-changed' : ''} ${formModel.isReadOnly(fieldDescription) ? 'wrc-align-center' : ''}`}>
        <RestartNeededImage
          fieldDescription={fieldDescription}
          formModel={formModel}
        />
        <FieldSettingsLauncher
          fieldDescription={fieldDescription}
          formModel={formModel}
        />
        {isWDTToken ? (
          <oj-input-text
            class={clazz}
            readonly={true}
            aria-label={fieldDescription.label}
            value={value}
          ></oj-input-text>
        ) : (
          getOjInputPassword(clazz, valueChangedHandler, isDefaulted)
        )}
      </span>
    </div>
  );
};

// Component for indirect fields that fetches data from a URL
const IndirectField = ({
  fieldDescription,
  formModel,
}: {
  fieldDescription: Property;
  formModel: FormContentModel;
}) => {
  const [displayValue, setDisplayValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true; // Track if component is still mounted

    const fetchIndirectValue = async () => {
      try {
        // Safely get the URL value directly from RDJ data
        const rdjData = formModel?.rdj?.data;
        let urlValue: string | undefined;

        if (rdjData && typeof rdjData === 'object' && !Array.isArray(rdjData)) {
          const propertyData = (rdjData as Record<string, PropertyValueHolder>)[fieldDescription?.name];
          if (propertyData && typeof propertyData === 'object' && 'value' in propertyData) {
            urlValue = propertyData.value as string;
          }
        }

        if (typeof urlValue === "string" && urlValue && isMounted) {
          const data = await getDataComponentText(urlValue);
          // Assuming the response has a value or label field to display
          if (isMounted) {
            setDisplayValue(data);
          }
        } else if (isMounted) {
          // No URL value found
          setDisplayValue("");
        }
      } catch (error) {
        Logger.error("Failed to fetch indirect field value:", error);
        if (isMounted) {
          setDisplayValue(t["wrc-indirect-field"].error.value);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Only fetch if we have the necessary data to work with
    if (formModel?.rdj?.data && fieldDescription?.name) {
      fetchIndirectValue();
    } else if (isMounted) {
      setDisplayValue("");
      setLoading(false);
    }

    return () => {
      isMounted = false; // Cleanup function to prevent state updates on unmounted component
    };
  }, [fieldDescription?.name]); // Simplified dependency to avoid issues with RDJ data changes

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(displayValue);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000); // Show success feedback for 2 seconds
    } catch (error) {
      Logger.error("Failed to copy to clipboard:", error);
    }
  };

  const value = loading ? t["wrc-indirect-field"].loading.value : displayValue;

  // Always return a valid element, never throw
  return (
    <div class="wrc-indirect-field-container">
      <oj-text-area
        class="wrc-indirect-field-value"
        value={value}
        readonly={true}
        rows={Math.min(10, Math.max(3, (value?.split('\n').length || 1)))}
        title={fieldDescription?.label || ""}
      />
      {!loading && displayValue && (
        <oj-c-button
          chroming="ghost"
          onojAction={handleCopyToClipboard}
          class="wrc-indirect-field-copy-btn"
          tooltip={copySuccess ? t["wrc-indirect-field"].copy.success.tooltip : t["wrc-indirect-field"].copy.button.tooltip}
          aria-label={copySuccess ? t["wrc-indirect-field"].copy.success.tooltip : t["wrc-indirect-field"].copy.button.tooltip}
        >
          <span slot="startIcon" class={`oj-ux-ico-copy ${copySuccess ? 'wrc-copy-success' : ''}`}></span>
        </oj-c-button>
      )}
    </div>
  );
};

export const getInputField = (
  fieldDescription: Property,
  formModel: FormContentModel,
  valueChangedHandler: (event: ojInputText.valueChanged) => void,
  setModel?: Dispatch<FormContentModel>,
) => {
  // Check if this is an indirect field (indirect flag is in RDJ data, not PDJ)
  const isIndirectField = (() => {
    if (formModel.rdj?.data && !Array.isArray(formModel.rdj.data)) {
      const propertyData = (formModel.rdj.data as any)[fieldDescription.name] as PropertyValueHolder;
      return propertyData?.indirect === true;
    }
    return false;
  })();

  if (isIndirectField) {
    // Indirect fields should appear on their own line like 'lg'/'xxl' fields
    const labelText: string = `${fieldDescription.label}${formModel.isRequired(fieldDescription) ? "*" : ""}`;

    let help: { definition: string } | undefined;
    let helpSummaryText: string | undefined;

    if (fieldDescription.helpSummaryHTML) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = fieldDescription.helpSummaryHTML;
      helpSummaryText = tempDiv.innerText;
      help = { definition: helpSummaryText };
    }

    const popupRef = useRef<ojPopup>(null);
    const buttonRef = useRef<CButtonElement>(null);
    const [tooltipText, setTooltipText] = useState<string | undefined>(helpSummaryText);

    const showHelpCallback = () => {
      if (fieldDescription.detailedHelpHTML) {
        setTooltipText(undefined);
        popupRef.current!.open(buttonRef.current!);
      }
    };

    const labelGroupClass = "oj-flex-item oj-flex-bar-start oj-flex oj-sm-flex-wrap-nowrap oj-sm-align-items-center wrc-label-group";

    return (
      <div class='wrc-lg-width-field oj-sm-12'>
        <div class='oj-flex oj-flex-bar oj-sm-align-items-center'>
          <div class={labelGroupClass}>
            {helpSummaryText ? (<>
              <oj-popup
                ref={popupRef}
                onojOpen={() => setTooltipText(undefined)}
                onojClose={() => setTooltipText(helpSummaryText)}
              >
                <span dangerouslySetInnerHTML={{ __html: fieldDescription.detailedHelpHTML }}></span>
              </oj-popup>

              <oj-c-button
                ref={buttonRef}
                onojAction={showHelpCallback}
                chroming="ghost"
                tooltip={tooltipText}
                aria-label={t?.["wrc-form-toolbar"]?.icons?.help?.tooltip}
                class="oj-sm-margin-0 oj-sm-padding-0"
              >
                <span slot="startIcon" class="oj-ux-ico-help" style="font-size:0.8em;line-height:1;display:inline-block"></span>
              </oj-c-button>

            </>) : (
              // Invisible placeholder to prevent label text shifting when no help is available.
              <oj-c-button
                chroming="ghost"
                class="oj-sm-margin-0 oj-sm-padding-0"
                style="visibility:hidden"
                aria-hidden="true"
                disabled={true}
                tabindex={-1 as any}
              >
                <span slot="startIcon" class="oj-ux-ico-help" style="font-size:0.8em;line-height:1;display:inline-block"></span>
              </oj-c-button>
            )}
            <oj-label id={fieldDescription.name + '_LABEL'} class="oj-sm-align-self-center oj-sm-margin-0 oj-sm-padding-0">
              <span class="wrc-label-text">{labelText}</span>
            </oj-label>
          </div>
        </div>
        <div class='oj-flex'>
          <div class='oj-sm-12'>
            <span class={`wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? 'wrc-field-changed' : ''} ${formModel.isReadOnly(fieldDescription) ? 'wrc-align-center' : ''}`}>
              <RestartNeededImage
                fieldDescription={fieldDescription}
                formModel={formModel}
              />
              <FieldSettingsLauncher
                fieldDescription={fieldDescription}
                formModel={formModel}
              />
              <IndirectField
                fieldDescription={fieldDescription}
                formModel={formModel}
              />
            </span>
          </div>
        </div>
      </div>
    );
  }

  let clazz = formModel.isFieldNumber(fieldDescription)
    ? "cfe-form-input-integer-sm"
    : ""; // "cfe-form-input-text";


  const value = formModel.getProperty(fieldDescription.name);

  const isDefaulted = formModel.isPropertyDefaulted(fieldDescription.name);

  const attrs:ComponentProps<'oj-input-text'> = {
    class: clazz,
    disabled: formModel.isDisabled(fieldDescription),
    id: fieldDescription.name,
    messagesCustom: formModel.getMessages(fieldDescription.name).map((c) => {
      return { detail: c, severity: 'info', summary: c };
    })||[],
    readonly: formModel.isReadOnly(fieldDescription),
    required: formModel.isRequired(fieldDescription),
    title: `${formModel.getHint(fieldDescription)}`,
    value,
  };

  const restoreToDefault = () => {
    formModel.setProperty(fieldDescription.name);
    setModel?.(formModel.clone());
   }

  const getOjInputTextWithClass = (
    clazz: string,
    valueChangedHandler: (event: ojInputText.valueChanged) => void,
  ) => (
      <oj-c-input-text
        class={attrs.class}
        disabled={attrs.disabled}
        displayOptions={{ messages: "none" }}
        label-edge="none"
        label-hint={fieldDescription.label}
        // messagesCustom={attrs.messagesCustom as ComponentMessageItem[]}
        onrawValueChanged={valueChangedHandler}
        placeholder=""
        readonly={attrs.readonly}
        required={attrs.required}
        title={attrs.title}
        user-assistance-density="reflow"
        value={attrs.value}
        data-property={fieldDescription.name}
        id={attrs.id}
      >
      <oj-menu slot="contextMenu" onojAction={restoreToDefault}>
        <oj-option>
          <span>{ t['wrc-pdj-unset'].menu.label }</span>
        </oj-option>
      </oj-menu>
    </oj-c-input-text>
  );

  const widthHint = formModel.getWidth(fieldDescription);

  if (widthHint === 'lg' || widthHint === 'xxl') {
    // For 'lg' width, render label and input in block layout
    const labelText: string = `${fieldDescription.label}${formModel.isRequired(fieldDescription) ? "*" : ""}`;

    let help: { definition: string } | undefined;
    let helpSummaryText: string | undefined;

    if (fieldDescription.helpSummaryHTML) {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = fieldDescription.helpSummaryHTML;
      helpSummaryText = tempDiv.innerText;
      help = { definition: helpSummaryText };
    }

    const popupRef = useRef<ojPopup>(null);
    const buttonRef = useRef<CButtonElement>(null);
    const [tooltipText, setTooltipText] = useState<string | undefined>(helpSummaryText);

    const showHelpCallback = () => {
      if (fieldDescription.detailedHelpHTML) {
        setTooltipText(undefined);
        popupRef.current!.open(buttonRef.current!);
      }
    };

    const labelGroupClass = "oj-flex-item oj-flex-bar-start oj-flex oj-sm-flex-wrap-nowrap oj-sm-align-items-center wrc-label-group";

    return (
      <div class='wrc-lg-width-field'>
        <div class='oj-flex oj-flex-bar oj-sm-align-items-center'>
          <div class={labelGroupClass}>
            {helpSummaryText ? (<>
              <oj-popup
                ref={popupRef}
                onojOpen={() => setTooltipText(undefined)}
                onojClose={() => setTooltipText(helpSummaryText)}
              >
                <span dangerouslySetInnerHTML={{ __html: fieldDescription.detailedHelpHTML }}></span>
              </oj-popup>

              <oj-c-button
                ref={buttonRef}
                onojAction={showHelpCallback}
                chroming="ghost"
                tooltip={tooltipText}
                aria-label={t?.["wrc-form-toolbar"]?.icons?.help?.tooltip}
                class="oj-sm-margin-0 oj-sm-padding-0"
              >
                <span slot="startIcon" class="oj-ux-ico-help" style="font-size:0.8em;line-height:1;display:inline-block"></span>
              </oj-c-button>

            </>) : (
              // Invisible placeholder to prevent label text shifting when no help is available.
              // Uses same component and icon structure to occupy identical space.
              <oj-c-button
                chroming="ghost"
                class="oj-sm-margin-0 oj-sm-padding-0"
                style="visibility:hidden"
                aria-hidden="true"
                disabled={true}
                tabindex={-1 as any}
              >
                <span slot="startIcon" class="oj-ux-ico-help" style="font-size:0.8em;line-height:1;display:inline-block"></span>
              </oj-c-button>
            )}
            <oj-label id={fieldDescription.name + '_LABEL'} class="oj-sm-align-self-center oj-sm-margin-0 oj-sm-padding-0">
              <span class="wrc-label-text">{labelText}</span>
            </oj-label>
          </div>
        </div>
        <div class='oj-flex'>
          <div class='oj-sm-12'>
            <span class={`wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? 'wrc-field-changed' : ''} ${attrs.readonly ? 'wrc-align-center' : ''}`}>
              <RestartNeededImage
                fieldDescription={fieldDescription}
                formModel={formModel}
              />
              <FieldSettingsLauncher
                fieldDescription={fieldDescription}
                formModel={formModel}
              />
              {!isDefaulted ? getOjInputTextWithClass(attrs.class || '', valueChangedHandler) : <DefaultedField/>}
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    // Normal layout
    return (
      <div class='oj-flex oj-flex-item'>
        <span class={`wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? 'wrc-field-changed' : ''} ${attrs.readonly ? 'wrc-align-center' : ''}`}>
          <RestartNeededImage
            fieldDescription={fieldDescription}
            formModel={formModel}
          />
          <FieldSettingsLauncher
            fieldDescription={fieldDescription}
            formModel={formModel}
          />
          {!isDefaulted ? getOjInputTextWithClass(attrs.class || '', valueChangedHandler) : <DefaultedField/>}
        </span>
      </div>
    );
  }
};

interface TableRow {
  [key: string]: any;
}

interface TableEditorOptions {
  fieldDescription: Property;
  formModel: FormContentModel;
  valueChangedHandler: (event: ojInputText.valueChanged) => void;
  setModel?: Dispatch<FormContentModel>;
  columns: any[];
  getData: (modelValue: any) => TableRow[];
  saveData: (data: TableRow[]) => any;
  newRow: (data: TableRow[]) => TableRow;
  keyField: string;
  renderRow: (
    row: ojTable.RowTemplateContext<string, TableRow>,
    data: TableRow[],
    dataProvider: MutableArrayDataProvider<string, TableRow>,
    saveDataToModel: (event: ojInputText.valueChanged) => void,
    isReadOnly: boolean,
    fieldDescription: Property,
    formModel: FormContentModel,
    setModel?: Dispatch<FormContentModel>
  ) => ComponentChildren;
}

const getTableEditor = (options: TableEditorOptions) => {
  const { fieldDescription, formModel, valueChangedHandler, setModel, columns, getData, saveData, newRow, keyField, renderRow } = options;

  const getTableElement = () => {
    const clazz = "cfe-model-properties-table";

    const isReadOnly = formModel.isReadOnly(fieldDescription);

    const modelValue = formModel.getProperty(fieldDescription.name);

    const data = getData(modelValue);

    const dataProvider = new MutableArrayDataProvider<string, TableRow>(data, {
      keyAttributes: keyField,
    });

    let tableColumns: any[] = columns ? columns.slice() : []; // copy

    // if edit is enabled, add a control column (with an add button, and a place for delete icons)
    if (!isReadOnly) {
      tableColumns.push({
        className: "cfe-table-delete-cell",
        headerClassName: "cfe-table-add-header",
        headerTemplate: "addColumnTemplate",
        template: "actionTemplate",
        sortable: "disabled",
        // width of delete button column in tables.
        // ideally this could be specified as 'auto', but oj-table will not set below 100px.
        width: "7%",
      });
    }

    const attrs: ComponentProps<"oj-table"> = {
      class: clazz,
      editMode: isReadOnly ? "none" : "rowEdit",
      data: dataProvider,
      columns: tableColumns,
    };

    const addButtonHandler = () => {
      data.push(newRow(data));
      dataProvider.data = data;
    };

    const addColumn = (
      cell: ojTable.CellTemplateContext<string, TableRow>,
    ) => {
      return (
        <oj-c-button
          data-testid="add"
          display="icons"
          chroming="borderless"
          label={t["wrc-pdj-fields"]?.["cfe-property-list-editor"]?.labels.addButtonTooltip}
          onojAction={addButtonHandler}
        >
          <span slot="endIcon" class="oj-ux-ico-plus"></span>
          {
            t["wrc-pdj-fields"]?.["cfe-property-list-editor"]?.labels
              .addButtonTooltip
          }
        </oj-c-button>
      );
    };

    const tableRenderRow = (
      row: ojTable.RowTemplateContext<string, TableRow>,
    ) => {
      // convert the ojInputText.valueChanged event to hold the changed properties list object
      // and invoke the valueChangedHandler...
      const saveDataToModel = (event: ojInputText.valueChanged) => {
        const newValue = saveData(data);

        event.detail.value = newValue;

        valueChangedHandler(event);
      };

      return renderRow(row, data, dataProvider, saveDataToModel, isReadOnly, fieldDescription, formModel, setModel);
    };

    return (
      <div id="properties-table-container" data-testid="properties-table-container" class={ "" }>
        <oj-table
          class={attrs.class}
          editMode={attrs.editMode}
          columns={attrs.columns}
          data={attrs.data}
          data-property={fieldDescription.name}
          display="grid"
          horizontalGridVisible="enabled"
          layout="fixed"
        >
          <template slot="rowTemplate" render={tableRenderRow}></template>
          <template slot="addColumnTemplate" render={addColumn}></template>
        </oj-table>
      </div>
    );
  };

  const isDefaulted = formModel.isPropertyDefaulted(fieldDescription.name);

  return (
    <div class="OLDcfe-form-field oj-flex oj-flex-item">
      <span class={`wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? 'wrc-field-changed' : ''}`}>
        <RestartNeededImage
          fieldDescription={fieldDescription}
          formModel={formModel}
        />
        <FieldSettingsLauncher
          fieldDescription={fieldDescription}
          formModel={formModel}
        />
        {!isDefaulted ? getTableElement():<DefaultedField/>}
      </span>
    </div>
  );
};

export const getPropertiesEditor = (
  fieldDescription: Property,
  formModel: FormContentModel,
  valueChangedHandler: (
    event: ojInputText.valueChanged | ojSwitch.valueChanged,
  ) => void,
  setModel?: Dispatch<FormContentModel>,
) => {
  const renderRow = (
    row: ojTable.RowTemplateContext<string, TableRow>,
    data: TableRow[],
    dataProvider: MutableArrayDataProvider<string, TableRow>,
    saveDataToModel: (event: ojInputText.valueChanged) => void,
    isReadOnly: boolean,
    fieldDescription: Property,
    formModel: FormContentModel,
    setModel?: Dispatch<FormContentModel>
  ) => {
    // convert the ojInputText.valueChanged event to hold the changed properties list object
    // and invoke the valueChangedHandler...
    const updateName = (event: ojInputText.valueChanged) => {
      if (event.detail.updatedFrom === "internal") {
        row.data["name"] = event.detail.value;
        saveDataToModel(event);
      }
    };

    const updateValue = (event: ojInputText.valueChanged) => {
      if (event.detail.updatedFrom === "internal") {
        row.data["value"] = event.detail.value;
        saveDataToModel(event);
      }
    };

    const deleteRow = () => {
      const newValue = data.reduce(
        (acc, curr) => {
          if (curr.name !== row.data["name"]) {
            acc[curr.name] = curr.value;
          }
          return acc;
        },
        {} as Record<string, string>,
      );

      // if in a FieldSettings dialog update the field settings state,
      // otherwise operate on the formModel directly
      formModel.setProperty(fieldDescription.name, newValue);
      setModel?.(formModel.clone());
    };

    return (
      <>
        <tr>
          {row.mode == "navigation" && (
            <>
              <td>{row.data["name"]}</td>
              <td>{row.data["value"]}</td>
            </>
          )}
          {row.mode == "edit" && (
            <>
              <td>
                <oj-input-text
                  data-property={fieldDescription.name}
                  value={row.data["name"]}
                  class="editable"
                  onvalueChanged={updateName}
                ></oj-input-text>
              </td>
              <td>
                <oj-input-text
                  data-property={fieldDescription.name}
                  value={row.data["value"]}
                  class="editable"
                  onvalueChanged={updateValue}
                ></oj-input-text>
              </td>
            </>
          )}
          {!isReadOnly && (
            <>
              <td>
                <oj-c-button
                  display="icons"
                  chroming="borderless"
                  data-property={fieldDescription.name}
                  label={t["wrc-pdj-fields"]?.["cfe-property-list-editor"]?.labels.deleteButtonTooltip}
                  onojAction={deleteRow}
                >
                  <span slot="endIcon" class="oj-ux-ico-trash"></span>
                  {
                    t["wrc-pdj-fields"]?.["cfe-property-list-editor"]?.labels
                      .deleteButtonTooltip
                  }
                </oj-c-button>
              </td>
            </>
          )}
        </tr>
      </>
    );
  };

  return getTableEditor({
    fieldDescription,
    formModel,
    valueChangedHandler,
    setModel,
    columns: [
      {
        headerText:
          t["wrc-pdj-fields"]?.["cfe-property-list-editor"]?.labels
            ?.nameHeader,
        sortProperty: "name",
        field: "name",
        resizable: "enabled",
        width: "32%"
      },
      {
        headerText:
          t["wrc-pdj-fields"]?.["cfe-property-list-editor"]?.labels
            ?.valueHeader,
        sortProperty: "value",
        field: "value",
        resizable: "enabled",
        width: "60%"
      },
    ],
    getData: (modelValue) => {
      const data: TableRow[] = [];
      for (const key in modelValue as object) {
        const indexedItem = (modelValue as any)[key];
        data.push({ name: key, value: indexedItem });
      }
      return data;
    },
    saveData: (data) => {
      return data.reduce(
        (acc, curr) => {
          acc[curr.name] = curr.value;
          return acc;
        },
        {} as Record<string, string>,
      );
    },
    newRow: (data) => ({ name: "New-Property", value: "" }),
    keyField: "name",
    renderRow,
  });
};

export const getMultiSelectBox = (
  fieldDescription: Property,
  formModel: FormContentModel,
  changeNotifier: () => void,
  setModel?: Dispatch<FormContentModel>
) => {
  const isReadOnly = formModel.isReadOnly(fieldDescription);
  // set up the available and selected properties for the MultiSelect
  // which expects a key, not a value
  const selections = formModel.getSelectionsForProperty(fieldDescription);

  let available =
    selections?.map((m) => {
      return { label: m.label, key: JSON.stringify(m.value) } as SelectOption;
    }) || [];

  const propertyValues = formModel.getProperty(
    fieldDescription.name,
  ) as PropertyValue[];

  // now do the selected properties.. but for each property that is selected,
  // the corresponding element needs to be removed from the available array
  let selected: SelectOption[] =
    propertyValues?.map((p) => {
      const reference = p as Reference; // TODO: typecheck

      const availableIndex = available.findIndex(
        (a) => a.key === JSON.stringify(reference),
      );
      if (availableIndex > -1) {
        available.splice(availableIndex, 1);
      }
      return { label: reference.label || "", key: JSON.stringify(reference) };
    }) || [];

  const changeHandler = (event: ChangeEvent) => {
    const newValue = event.chosen; 

    const newValueJustKeys = newValue.map((m) => {
      return { key: m.key };
    });
    const selectedJustKeys = selected.map((m) => {
      return { key: m.key };
    });

    if (JSON.stringify(newValueJustKeys) !== JSON.stringify(selectedJustKeys)) {
      const newModelValue = newValue.map((m) => JSON.parse(m.key as string));
      formModel.setProperty(fieldDescription.name, newModelValue);

      changeNotifier();
    }
  };

  let clazz = "OLDcfe-form-field oj-flex-item oj-flex";
  
  const isDefaulted = formModel.isPropertyDefaulted(fieldDescription.name);
  
  return (
    <div class={clazz}>
      <span class={`wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? 'wrc-field-changed' : ''}`}>
        <RestartNeededImage
          fieldDescription={fieldDescription}
          formModel={formModel}
        />
        <FieldSettingsLauncher
          fieldDescription={fieldDescription}
          formModel={formModel}
        />
        {
          !isDefaulted ?
          <MultiSelect
            available={available || []}
            chosen={selected}
            changeHandler={changeHandler}
            readonly={isReadOnly}
          /> : <DefaultedField/>
        }
      </span>
    </div>
  );
};

export const MoreMenu = ({ fieldDescription, formModel }: FieldProps) => {
  const ctx = useContext(UserContext);
  const context = ctx?.context;

  const optionsSource = formModel.getOptionsSources(fieldDescription);

  let currentValue = formModel.getProperty(fieldDescription.name) as Reference;

  let menuItems;

  if (optionsSource && optionsSource.length === 1) {
    const viewLabel = Translations.applyParameters(
      t["wrc-pdj-options-sources"].menus.more.optionsSources.view.label,
      [optionsSource[0].label],
    );

    const createLabel = Translations.applyParameters(t["wrc-pdj-options-sources"].menus.more.optionsSources.create.label, [fieldDescription.label]);
   
    const path = optionsSource[0].resourceData || "";
    menuItems = [
      {
        value: viewLabel,
        classes: [],
        role: "",
        dataIndex: 0,
        id: "view",
        disabled: false,
        path,
      },
      {
        value: createLabel,
        classes: [],
        role: "",
        dataIndex: 0,
        id: "create",
        disabled: false,
        path,
      },
    ];

    if (currentValue) {
      const editLabel = Translations.getTranslatedString(
        "wrc-pdj-options-sources.menus.more.optionsSources.edit.label",
        "" + currentValue.label,
      );
      menuItems.push({
        value: editLabel,
        classes: [],
        role: "",
        dataIndex: 0,
        id: "edit",
        disabled: false,
        path: currentValue.resourceData || "",
      });
    }


    // FIX propertyId
    //const propertyId = this.id(`${fieldDescription.name}_more`);
    const propertyId = "";

    const tooltip = Translations.getTranslatedString(
      "wrc-common.tooltips.more.value",
    );

    const onSelect = (selectedValue: any) => {
      context?.routerController?.navigateToAbsolutePath(selectedValue.menuItem.path);
    };

    return (
      <KebabMenu
        id={propertyId}
        tooltip={tooltip}
        menuItems={menuItems}
        selected={onSelect}
      />
    );
  }

  return <></>;
};


export const getSelectSingle = (
  fieldDescription: Property,
  formModel: FormContentModel,
  valueChangedHandler: (event: ojInputText.valueChanged) => void,
  setModel?: Dispatch<FormContentModel>,
) => {

  let selections = [
    ...(formModel.getSelectionsForProperty(fieldDescription) || []),
  ];

  // the CBE uses null as a valid key on some fields, this isn't compatible with jet
  // which considers a null value as 'unset', as such it would not render properly
  // (e.g. a blank box instead of 'None'), so sub it for a special string to give to jet
  const NULL_VALUE_CONSTANT = "_NULL";
  const nullValueSelection = selections.find((s) => s.value == null);

  if (nullValueSelection) {
    // JET can't use null, substitute sentinel for the control
    nullValueSelection.value = NULL_VALUE_CONSTANT;
  }

  let value = formModel.getProperty(fieldDescription.name);
  
  // if value is null sub it for the null constant
  // if value is undefined, that is valid as it means the field has been restored to default
  // can't use nullish coalescing operator
  if (value === null) value = NULL_VALUE_CONSTANT;

  const attrs: ComponentProps<"oj-select-single"> = {
    disabled: formModel.isDisabled(fieldDescription),
    id: fieldDescription.name,
    required: formModel.isRequired(fieldDescription),
    readonly: formModel.isReadOnly(fieldDescription),
    value
  };

  const isDefaulted = formModel.isPropertyDefaulted(fieldDescription.name);

  // having null as an option is not supported by oj-select-single,
  // so use a string constant to represent null value (and convert it back
  // when propagating the event)
  const nullSubstitutingValueChangedHandler = (
    event: ojInputText.valueChanged,
  ) => {
    if (event.detail.value === NULL_VALUE_CONSTANT) {
      event.detail.value = null;
    }
    valueChangedHandler(event);
  };
  const selectionsDataProvider = new MutableArrayDataProvider<
    string,
    SelectOption
  >(selections as SelectOption[], { keyAttributes: "value" });

  let selectClass = 'cfe-form-select-one-md';

  let clazz = "OLDcfe-form-field oj-flex oj-flex-item";


  // If the value is not a resolved value (i.e. it's freeform text) it will get displayed as a readonly oj-input-text,
  // the user will have to use the FieldSettings component to change it...
  const resolvedValue = selections?.find(
    (s) => JSON.stringify(s.value) === JSON.stringify(attrs.value),
  ) || attrs.value === undefined;

  const selectSingleItemTextFormatter = (
    opt: ItemContext<string, Record<string, string>>,
  ) => {
    const retval = opt.data.label ?? opt.data.value;

    return retval !== NULL_VALUE_CONSTANT ? retval : "";
  };
  
  const getOjSelectSingle = (
    valueChangedHandler: (event: ojInputText.valueChanged) => void,
  ) => {
    return !isDefaulted ?
      (
        <oj-select-single
          id={attrs.id}
          value={attrs.value}
          class={selectClass}
          labelEdge="none"
          label-hint={fieldDescription.label}
          data={selectionsDataProvider}
          itemText={selectSingleItemTextFormatter}
          onvalueChanged={valueChangedHandler}
          required={attrs.required}
          disabled={attrs.disabled}
          readonly={attrs.readonly}
          data-property={fieldDescription.name}
        ></oj-select-single>
      ) : <DefaultedField/>;
  };

  return (
    <div class={clazz}>
      <span class={`wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? 'wrc-field-changed' : ''}`}>
        <RestartNeededImage
          fieldDescription={fieldDescription}
          formModel={formModel}
        />
        <FieldSettingsLauncher
          fieldDescription={fieldDescription}
          formModel={formModel}
        />
        {(true || resolvedValue) ? (
          getOjSelectSingle(nullSubstitutingValueChangedHandler)
        ) : (
          <oj-input-text
            class="cfe-form-input-text"
            readonly={true}
            aria-label={fieldDescription.label}
            value={
              (() => {
                if (attrs.value === NULL_VALUE_CONSTANT) {
                  const nullSelection = (selections || []).find((s) => s.value === NULL_VALUE_CONSTANT);
                  return (nullSelection && (nullSelection as any).label) || "";
                }
                return ((attrs.value as unknown as Reference)?.["label"] || (attrs.value as any));
              })()
            }
          ></oj-input-text>
        )}
        <MoreMenu
          fieldDescription={fieldDescription}
          formModel={formModel}
        />
      </span>
    </div>
  );
};

export const getFileSelector = (
  fieldDescription: Property,
  formModel: FormContentModel,
  valueChangedHandler: (event: ojInputText.valueChanged) => void,
  setModel: any,
) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chooseFileClickHandler = () => {
    // click on the hidden file input element
    fileInputRef.current!.click();
  };

  const handleFileUpload = () => {
    const file = fileInputRef.current!.files?.[0];

    if (file) {
      formModel.setProperty(fieldDescription.name, file);

      // trigger a refresh of the form components
      setModel(formModel.clone());

      // Clear the input value to allow selecting the same file again
      fileInputRef.current!.value = '';
    }
  };

  const attrs = {
    clazz: "",
    disabled: formModel.isDisabled(fieldDescription),
    messages: formModel.getMessages(fieldDescription.name).map((c) => {
      return { detail: c };
    }),
    readonly: true,
    required: formModel.isRequired(fieldDescription),
    title: formModel.getTitle(fieldDescription),
    value: (formModel.getProperty(fieldDescription.name)as File)?.name,
  };

  if (formModel.hasPropertyChanged(fieldDescription.name))
    attrs.clazz += " wrc-field-highlight";

  return (
    <div class="OLDcfe-form-field oj-flex oj-flex-item">
      <span
        class={`wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? "wrc-field-changed" : ""} ${formModel.isReadOnly(fieldDescription) ? 'wrc-align-center' : ''}`}
      >
        <RestartNeededImage
          fieldDescription={fieldDescription}
          formModel={formModel}
        />
        <FieldSettingsLauncher
          fieldDescription={fieldDescription}
          formModel={formModel}
        />
        {/* <img src={requireAsset("wrc/assets/images/wdt-options-icon-clr_24x24.png")} /> */}

        <oj-c-input-text
          class="cfe-file-picker"
          disabled={true}
          title=""
          label-edge="none"
          label-hint={fieldDescription.label}
          value={attrs.value}
        >
          <div class=""></div>
        </oj-c-input-text>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style="display:none"
        />

        <oj-c-button chroming="borderless" onojAction={chooseFileClickHandler} aria-label="Choose file">
          <span slot="startIcon" class="oj-ux-ico-upload"></span>
        </oj-c-button>
      </span>
    </div>
  );
};

export const getFileSelectorForFilename = (
  fieldDescription: Property,
  formModel: FormContentModel,
  valueChangedHandler: (event: ojInputText.valueChanged) => void,
  setModel: any,
) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chooseFileClickHandler = () => {
    // click on the hidden file input element
    fileInputRef.current!.click();
  };

  const handleFileUpload = async () =>  {
    let filename: string | undefined;

    if (fileInputRef.current!.files?.[0]) {
      if ((window as any).electron_api) {
        const electronAPI = (window as any).electron_api as ElectronAPI;

        const file = fileInputRef.current!.files?.[0];

        filename = await electronAPI.getFilePath(file);
      } else {
        filename = fileInputRef.current!.files?.[0].name;
      }
    }

    if (filename) {
      formModel.setProperty(fieldDescription.name, filename);

      // trigger a refresh of the form components
      setModel(formModel.clone());

      // Clear the input value to allow selecting the same file again
      fileInputRef.current!.value = '';
    }
  };

  const attrs = {
    clazz: "",
    disabled: formModel.isDisabled(fieldDescription),
    messages: formModel.getMessages(fieldDescription.name).map((c) => {
      return { detail: c };
    }),
    readonly: true,
    required: formModel.isRequired(fieldDescription),
    title: formModel.getTitle(fieldDescription),
    value: (formModel.getProperty(fieldDescription.name) as string),
  };

  if (formModel.hasPropertyChanged(fieldDescription.name))
    attrs.clazz += " wrc-field-highlight";

  return (
    <div class="OLDcfe-form-field oj-flex oj-flex-item">
      <span class={`wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? 'wrc-field-changed' : ''} ${formModel.isReadOnly(fieldDescription) ? 'wrc-align-center' : ''}`}>
        <RestartNeededImage
          fieldDescription={fieldDescription}
          formModel={formModel}
        />
        <FieldSettingsLauncher
          fieldDescription={fieldDescription}
          formModel={formModel}
        />
        <img src={requireAsset("wrc/assets/images/wdt-options-icon-clr_24x24.png")} />

        <oj-c-input-text
          class="cfe-file-picker"
          disabled={true}
          title=""
          label-edge="none"
          label-hint={fieldDescription.label}
          value={attrs.value}
        >
          <div class=""></div>
        </oj-c-input-text>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style="display:none"
        />

        <img src={requireAsset("wrc/assets/images/wdt-options-icon-clr_24x24.png")} />

        <oj-c-button chroming='borderless' onojAction={chooseFileClickHandler} aria-label="Choose file">
          <span slot='startIcon' class='oj-ux-ico-upload'></span>
        </oj-c-button>

      </span>
    </div>
  );
};

export const getFileSelectorForNewFile = (
  fieldDescription: Property,
  formModel: FormContentModel,
  valueChangedHandler: (event: ojInputText.valueChanged) => void,
  setModel: any,
) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const chooseFileClickHandler = async () => {
    // click on the hidden file input element
    if ((window as any).electron_api) {
      const electronAPI = (window as any).electron_api as ElectronAPI;

      const file = await electronAPI.getSaveAs({ filepath: formModel.getProperty(fieldDescription.name) as string || '' });

      formModel.setProperty(fieldDescription.name, file.filePath);

      setModel(formModel.clone());
    }
  };

  const attrs: ComponentProps<'oj-input-text'> = {
    disabled: formModel.isDisabled(fieldDescription),
    required: formModel.isRequired(fieldDescription),
    title: formModel.getTitle(fieldDescription),
    value: formModel.getProperty(fieldDescription.name) as string || ''
  };

  return (
    <div class="OLDcfe-form-field oj-flex oj-flex-item">
      <span class={`wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? 'wrc-field-changed' : ''} ${formModel.isReadOnly(fieldDescription) ? 'wrc-align-center' : ''}`}>
        <RestartNeededImage
          fieldDescription={fieldDescription}
          formModel={formModel}
        />
        <FieldSettingsLauncher
          fieldDescription={fieldDescription}
          formModel={formModel}
        />
        <oj-input-text
          data-property={fieldDescription.name}
          onrawValueChanged={valueChangedHandler}
          {...attrs}
        ></oj-input-text>
        {(window as any).electron_api ? (
          <oj-c-button
            id="p"
            chroming="borderless"
            onojAction={chooseFileClickHandler}
            aria-label="Choose directory"
          >
            <span slot="startIcon">
              <img
                src={requireAsset(
                  "wrc/assets/images/choose-directory-icon-blk_24x24.png",
                )}
              ></img>
            </span>
          </oj-c-button>
        ) : (
          <></>
        )}
      </span>
    </div>
  );
};

export const getSwitch = (
  fieldDescription: Property,
  formModel: FormContentModel,
  valueChangedHandler: (event: ojInputText.valueChanged) => void,
  setModel?: Dispatch<FormContentModel>,
) => {
  const attrs = {
    disabled: formModel.isDisabled(fieldDescription),
    //  id: this.id(fieldDescription.name),
    messages: formModel.getMessages(fieldDescription.name).map((c) => {
      return { detail: c, severity: 3, summary: "" };
    }),
    readonly: formModel.isReadOnly(fieldDescription),
    value: formModel.getProperty(fieldDescription.name),
  };

  let clazz = "cfe-form-switch";

  const isDefaulted = formModel.isPropertyDefaulted(fieldDescription.name);

  const getOjSwitch = (
    valueChangedHandler: (
      event: ojInputText.valueChanged | ojSwitch.valueChanged,
    ) => void,
  ) =>
    !isDefaulted ? (
      <oj-switch
        id={fieldDescription.name}
        class={clazz}
        disabled={attrs.disabled || attrs.readonly}
        displayOptions={{ messages: "none" }}
        // id={attrs.id}
        label-edge="none"
        label-hint={fieldDescription.label}
        onvalueChanged={valueChangedHandler}
        value={attrs.value == true}
        data-property={fieldDescription.name}
        //   messagesCustom={messages}
      >
        <div class=""></div>
      </oj-switch>
    ) : (
      <DefaultedField />
    );

  return (
    <div class="OLDcfe-form-field oj-flex oj-flex-item">
      <span class={`wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? 'wrc-field-changed' : ''}`}>
        <RestartNeededImage
          fieldDescription={fieldDescription}
          formModel={formModel}
        />
        <FieldSettingsLauncher
          fieldDescription={fieldDescription}
          formModel={formModel}
        />
        {typeof attrs.value === "boolean" || typeof attrs.value === 'undefined' ? (
          getOjSwitch(valueChangedHandler)
        ) : (
          <oj-input-text
            class="cfe-form-input-text"
            readonly={true}
            aria-label={fieldDescription.label}
            value={attrs.value}
          ></oj-input-text>
        )}
      </span>
    </div>
  );
};

export const getPolicyExpression = (
  fieldDescription: Property,
  formModel: FormContentModel,
  valueChangedHandler: (e: ojInputText.valueChanged) => void,
  setModel?: Dispatch<FormContentModel>
) => (
  <PolicyExpression
    fieldDescription={fieldDescription}
    formModel={formModel}
    valueChangedHandler={valueChangedHandler}
    setModel={setModel}
  />
);
