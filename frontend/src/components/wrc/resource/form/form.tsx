/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import { InputTextElement, ojInputPassword, ojInputText, ojTextArea } from "ojs/ojinputtext";
import { h } from "preact";
import { Dispatch, StateUpdater, useRef, useEffect, useState } from "preact/hooks";
import { extractHelpData } from "wrc/shared/model/model-utils";
import { FormContentModel } from "../../shared/model/formcontentmodel";
import { Section } from "../../shared/typedefs/pdj";
import {
  getArrayInputField,
  getFileSelector,
  getFileSelectorForFilename,
  getFileSelectorForNewFile,
  getInputField,
  getLabel,
  getMultiSelectBox,
  getPropertiesEditor,
  getSecretInputField,
  getSelectSingle,
  getSwitch,
  getPolicyExpression,
} from "./formfields";
import MutableArrayDataProvider = require("ojs/ojmutablearraydataprovider");
import Translations = require("ojs/ojtranslation");
import "oj-c/collapsible";

type Props = {
  formModel: FormContentModel;
  setModel?: Dispatch<FormContentModel>;
};

const Form = ({ formModel, setModel }: Props) => {
  
  // Dark mode support for collapsible header classes
  const [isDark, setIsDark] = useState(false);
  const getRootEl = () =>
    (document.getElementById('globalBody') ||
     document.getElementById('appContainer') ||
     document.body) as HTMLElement;
  const checkDarkMode = () => {
    const root = getRootEl();
    return !!root?.classList?.contains('oj-color-invert');
  };
  useEffect(() => {
    setIsDark(checkDarkMode());
    const onDarkMode = (e: any) => {
      if (e && e.detail && typeof e.detail.enabled === 'boolean') {
        setIsDark(!!e.detail.enabled);
      } else {
        setIsDark(checkDarkMode());
      }
    };
    window.addEventListener('wrc:darkMode', onDarkMode as any);
    return () => window.removeEventListener('wrc:darkMode', onDarkMode as any);
  }, []);
  
  // If this is a creatable optional singleton with missing data,
  // suppress fields entirely. The toolbar will render a Create button.
  const suppressForm = formModel.isCreatableOptionalSingleton() && formModel.isDataMissing();
  if (suppressForm) {
    return (
      <></>
    );
  }

  const valueChangedHandler = (e: ojInputText.valueChanged | ojInputPassword.valueChanged) => {
    const updatedFrom = (e as any)?.detail?.updatedFrom;
    if (updatedFrom && updatedFrom !== "internal") {
      return;
    }
    const newValue = e.detail.value;

    const propertyId = (e.currentTarget as HTMLElement)?.getAttribute(
      "data-property",
    );

    if (propertyId) {
      const currentValue = formModel.getProperty(propertyId);
      const nextValue = (newValue as any)?.modelToken ?? newValue;
      // treat numeric string and number as equal (e.g., "7005" vs 7005)
      const numericallyEqual =
        (typeof currentValue === "number" && typeof nextValue === "string" && Number(nextValue) === currentValue) ||
        (typeof currentValue === "string" && typeof nextValue === "number" && String(nextValue) === currentValue);
      // treat boolean string and boolean as equal (e.g., "true" vs true)
      const toBool = (v: any) =>
        typeof v === "boolean"
          ? v
          : typeof v === "string"
            ? (v.toLowerCase() === "true" ? true : (v.toLowerCase() === "false" ? false : v))
            : v;
      const booleanEqual =
        (typeof currentValue === "boolean" && typeof nextValue === "string" && typeof toBool(nextValue) === "boolean" && toBool(nextValue) === currentValue) ||
        (typeof currentValue === "string" && typeof nextValue === "boolean" && typeof toBool(currentValue) === "boolean" && toBool(currentValue) === nextValue);
      // treat null/undefined and empty string as equal to avoid JET init churn
      const nullishEmptyEqual =
        ((currentValue === null || currentValue === undefined) && nextValue === "") ||
        ((nextValue === null || nextValue === undefined) && currentValue === "");
      const deeplyEqual = JSON.stringify(nextValue) === JSON.stringify(currentValue);
      if (booleanEqual || numericallyEqual || nullishEmptyEqual || deeplyEqual) {
        return;
      }
      if ((newValue as any)?.modelToken) {
        formModel.setPropertyAsTokenValue(propertyId, (newValue as any).modelToken);
      } else {
        formModel.setProperty(propertyId, nextValue);
      }

      // Reevaluate what fields are disabled -- status may have changed due to presence of usedIfs
      formModel.getPropertyList().forEach((element) => {
        const fieldDescription = formModel.getPropertyDescription(element);
        if (fieldDescription) {
          // FIX THIS: not longer using id()
          //      document.getElementById(id(element))?.setAttribute('disabled', String(formModel.isDisabled(fieldDescription)));
        }
      });

      // update model property with a new one to force a render of all dependent components
      if (setModel) {
        setModel(formModel.clone());
      }
    }
  };

  const textAreaValueChangedHandler = (e: ojTextArea.valueChanged) => {
    const updatedFrom = (e as any)?.detail?.updatedFrom;
    if (updatedFrom && updatedFrom !== "internal") {
      return;
    }
    const newValue = e.detail.value.split('\n');

    const propertyId = (e.currentTarget as HTMLElement)?.getAttribute(
      "data-property",
    );

    if (propertyId) {
      const currentValue = formModel.getProperty(propertyId);
      if (JSON.stringify(newValue) === JSON.stringify(currentValue)) {
        return;
      }
      formModel.setProperty(propertyId, newValue);

      // update model property with a new one to force a render of all dependent components

      if (setModel) {
        setModel(formModel.clone());
      }
    }
  };

  const renderField = (property: string) => {
      const fieldDescription = formModel.getPropertyDescription(property);
      if (!fieldDescription) return <></>;

      // Build the value (editor) for the field
      let valueNode: any;
      if (formModel.isFieldSelect(fieldDescription)) {
        valueNode = getSelectSingle(fieldDescription, formModel, valueChangedHandler, setModel);
      } else if (formModel.isFieldMultiSelect(fieldDescription)) {
        valueNode = getMultiSelectBox(
          fieldDescription,
          formModel,
          () => {
            if (setModel) setModel(formModel.clone());
          },
          setModel
        );
      } else if (formModel.isFieldBoolean(fieldDescription)) {
        valueNode = getSwitch(fieldDescription, formModel, valueChangedHandler, setModel);
      } else if (formModel.isFieldProperties(fieldDescription)) {
        valueNode = getPropertiesEditor(fieldDescription, formModel, valueChangedHandler, setModel);
      } else if (formModel.isFieldFileContents(fieldDescription)) {
        valueNode = getFileSelector(fieldDescription, formModel, valueChangedHandler, setModel);
      } else if (formModel.isFieldFilename(fieldDescription)) {
        valueNode = getFileSelectorForFilename(fieldDescription, formModel, valueChangedHandler, setModel);
      }  else if (formModel.isFieldNewFilename(fieldDescription)) {
        valueNode = getFileSelectorForNewFile(fieldDescription, formModel, valueChangedHandler, setModel);
      } else if (formModel.isPolicyExpression(fieldDescription)) {
        valueNode = getPolicyExpression(fieldDescription, formModel, valueChangedHandler, setModel);
      } else if (formModel.isFieldArray(fieldDescription)) {
        valueNode = getArrayInputField(fieldDescription, formModel, textAreaValueChangedHandler, setModel);
      } else if (formModel.isSecretField(fieldDescription)) {
        valueNode = getSecretInputField(fieldDescription, formModel, valueChangedHandler, setModel);
      } else {
        valueNode = getInputField(fieldDescription, formModel, valueChangedHandler, setModel);
      }

      // Check if this field returns its own full-width wrapper (lg, xxl, or indirect fields)
      const isFullWidthField = valueNode?.props?.class?.includes('wrc-lg-width-field');

      if (isFullWidthField) {
        // Field already provides its own full-width wrapper, return as-is
        return valueNode;
      }

      // Build the label content (with help icon + popup)
      const labelNode = getLabel(fieldDescription, formModel);

      return (
        <div class={`wrc-field oj-flex-item oj-sm-padding-2x-bottom ${isSingle ? 'oj-sm-12' : 'oj-sm-6'}`}>
          <div class={labelNode ? "wrc-c-row" : ""}>
            {labelNode ? <div class="wrc-c-label">{labelNode}</div> : <></>}
            <div class="wrc-c-value">{valueNode}</div>
          </div>
        </div>
      );
    };

  const renderProperties = (properties: string[]) => {

    return (
      <>
        {properties.map((property) => renderField(property))}
      </>
    );
  };

  // Render a section tree:
  // - If section has a title and has any content (own props or child content), wrap in oj-c-collapsible.
  // - If section has no title, flatten its content (no collapsible).
  // - If section has neither own properties nor child content, render nothing.
  const renderSection = (section: Section): any => {
    const propsNodes = (section.properties || []).map((p: any) => renderField(p.name));
    const childNodes = (section.sections || [])
      .map((s: Section) => renderSection(s))
      .filter((n) => !!n);

    // No title: flatten content (render like before)
    if (!section.title) {
      if (propsNodes.length === 0 && childNodes.length === 0) return <></>;
      return (
        <>
          {/* Optional intro for untitled section */}
          {section.introductionHTML ? (
            <div
              class="wrc-section-intro oj-bg-info-20"
              dangerouslySetInnerHTML={{ __html: section.introductionHTML } as any}
            ></div>
          ) : null}
          {propsNodes}
          {childNodes}
        </>
      );
    }

    // Titled section:
    // - If no properties and no children: skip.
    // - If no properties but has children: flatten (do not render a collapsible/header/intro).
    // - If has properties: render as a collapsible group.
    if (propsNodes.length === 0 && childNodes.length === 0) return <></>;
    if (propsNodes.length === 0) return <>{childNodes}</>;

    return (
      <oj-c-collapsible expanded={true}>
        <div slot="header" class={`wrc-section-header wrc-label-text ${isDark ? 'oj-color-invert oj-c-colorscheme-dependent oj-bg-neutral-180' : 'oj-bg-neutral-30'}`}>
          {section.title}
        </div>
        <div class="oj-sm-padding-2x-top"></div>
        {section.introductionHTML ? (
          <>
            <div
              class="wrc-section-intro oj-bg-info-20"
              dangerouslySetInnerHTML={{ __html: section.introductionHTML } as any}></div>
            <div class="oj-sm-padding-2x-bottom"></div>
          </> 
        ) : null}
        <div
          class={`wrc-form-grid oj-flex oj-sm-flex-wrap-wrap ${isSingle ? 'wrc-single-col' : 'wrc-two-col'}`}
          style={{ ['--wrc-c-label-width' as any]: (isSingle ? '4%' : '36%'), width: '100%' }}
        >
          {propsNodes}
          {childNodes}
        </div>
      </oj-c-collapsible>
    );
  };


  const columnsVal = formModel.getNumberOfColumns();
  const isSingle = columnsVal === 1;

    return (
      <div id="form-container" class="oj-flex-item">
        <div
          class={`wrc-form-grid oj-flex oj-sm-flex-wrap-wrap ${isSingle ? 'wrc-single-col' : 'wrc-two-col'}`}
          style={{ ['--wrc-c-label-width' as any]: (isSingle ? '4%' : '36%'), width: '100%' }}
        >
          {formModel.hasSections() ? (
            <>
              {formModel.getVisibleSections().map((s: Section) => renderSection(s))}
              {renderProperties(formModel.getTopLevelPropertyNames())}
            </>
          ) : renderProperties(formModel.getPropertyList())}
        </div>
      </div>
    );
};

// @ts-ignore
const UNUSED = h;

export default Form;
