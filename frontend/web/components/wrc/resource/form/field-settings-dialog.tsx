/**
 * @license UPL-1.0
 * Copyright (c) 2025, 2026, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
import { h } from "preact";
import { useEffect, useMemo, useRef, useState, Dispatch } from "preact/hooks";
import * as t from "ojL10n!wrc/shared/resources/nls/frontend";
import Translations = require("ojs/ojtranslation");
import { FormContentModel } from "../../shared/model/formcontentmodel";
import { Property } from "../../shared/typedefs/pdj";
import MutableArrayDataProvider = require("ojs/ojmutablearraydataprovider");
import { ItemContext } from "@oracle/oraclejet/ojcommontypes";
import { getDataComponentText } from "../../shared/model/transport";
import * as Logger from "ojs/ojlogger";

import { Dialog } from "../../display/dialog";
import { ojInputText, ojInputTextEventMap } from "ojs/ojinputtext";
import "oj-c/input-password";
import { ojSwitch } from "ojs/ojswitch";
import "ojs/ojselectsingle";
import { CButtonElement } from "oj-c/button";
import "oj-c/button";
import "oj-c/input-text";
import { getPropertiesEditor } from "./formfields";
import "ojs/ojradioset";

type Props = {
  open: boolean;
  formModel: FormContentModel;
  fieldDescription?: Property;
  onClose: () => void;
  onApply: () => void; // caller should setModel(formModel.clone()) after changes
};

enum ENTRY_TYPE {
  unset = "unset",
  regular = "regular",
  token = "token",
  unresolvedRef = "unresolvedRef",
}

const NULL_VALUE_CONSTANT = "_NULL";

export default function FieldSettingsDialog({
  open,
  formModel,
  fieldDescription,
  onClose,
  onApply,
}: Props) {
  const dialogRef = useRef<any>(null);
  const fileContentsInputRef = useRef<HTMLInputElement>(null);
  const filenameInputRef = useRef<HTMLInputElement>(null);

  const title = useMemo(() => {
    if (!fieldDescription) return "";
    const pattern = t["wrc-wdt-form"].wdtOptionsDialog.title;
    return Translations.applyParameters(pattern, [fieldDescription.label]);
  }, [fieldDescription]);

  // Local working state
  const [entryType, setEntryType] = useState<ENTRY_TYPE>(ENTRY_TYPE.regular);
  const [tokenValue, setTokenValue] = useState<string | undefined>(undefined);
  const [unresolvedRefValue, setUnresolvedRefValue] = useState<string | undefined>(undefined);
  const [regularValue, setRegularValue] = useState<any>();
  const [workingModel, setWorkingModel] = useState<FormContentModel | undefined>(undefined);
  const [indirectDisplayValue, setIndirectDisplayValue] = useState<string>("");
  const [indirectLoading, setIndirectLoading] = useState<boolean>(false);

  // Check if field is indirect
  const isIndirectField = useMemo(() => {
    if (!fieldDescription) return false;
    if (!formModel.rdj?.data || Array.isArray(formModel.rdj.data)) return false;
    const propertyData = (formModel.rdj.data as any)[fieldDescription.name] as any;
    return propertyData?.indirect === true;
  }, [fieldDescription, formModel]);

  // When dialog opens for a given field, initialize local state from model
  useEffect(() => {
    if (!fieldDescription) return;

    const modelValue = formModel.getProperty(fieldDescription.name);

    const supportsModelTokens = formModel.canSupportTokens;
    const isToken =
      supportsModelTokens &&
      typeof modelValue === "string" &&
      modelValue.startsWith("@@") &&
      modelValue.endsWith("@@");

    // Prepare a working clone for properties editor so edits don't touch the live model
    if (formModel.isFieldProperties(fieldDescription)) {
      setWorkingModel(formModel.clone());
    } else {
      setWorkingModel(undefined);
    }

    // Handle indirect fields specially
    if (isIndirectField) {
      setIndirectLoading(true);
      setIndirectDisplayValue(t["wrc-indirect-field"].loading.value);

      // Fetch the indirect data
      const fetchIndirectData = async () => {
        try {
          if (typeof modelValue === "string" && modelValue) {
            const data = await getDataComponentText(modelValue);
            setIndirectDisplayValue(data);
          } else {
            setIndirectDisplayValue("");
          }
        } catch (error) {
          Logger.error("Failed to fetch indirect field data:", error);
          setIndirectDisplayValue(t["wrc-indirect-field"].error.value);
        } finally {
          setIndirectLoading(false);
        }
      };

      fetchIndirectData();

      setEntryType(ENTRY_TYPE.regular);
      setTokenValue(undefined);
      setUnresolvedRefValue(undefined);
      setRegularValue(modelValue); // Keep the URL as the regular value for editing
    } else if (isToken) {
      setEntryType(ENTRY_TYPE.token);
      setTokenValue(modelValue as string);
      setRegularValue(undefined);
      setUnresolvedRefValue(undefined);
    } else {
      setEntryType(ENTRY_TYPE.regular);
      setTokenValue(undefined);
      setUnresolvedRefValue(undefined);

      // Initialize regularValue based on type (non-properties)
      if (formModel.isFieldArray(fieldDescription)) {
        const arr = (modelValue as any[]) || [];
        setRegularValue((arr as string[]).join("\n"));
      } else if (formModel.isFieldBoolean(fieldDescription)) {
        setRegularValue(!!modelValue);
      } else if (formModel.isFieldSelect(fieldDescription)) {
        setRegularValue(modelValue === null ? NULL_VALUE_CONSTANT : modelValue);
      } else if (!formModel.isFieldProperties(fieldDescription)) {
        setRegularValue(modelValue);
      }
    }
  }, [fieldDescription, formModel, isIndirectField]);

  // Open dialog when requested; allow dialog to manage its own closing
  useEffect(() => {
    if (!dialogRef.current) return;
    if (open) {
      dialogRef.current.open();
    }
  }, [open]);

  if (!fieldDescription) return <></>;

  // Build options for select-single
  const selections = useMemo(() => {
    if (!formModel.isFieldSelect(fieldDescription)) return [];
    // Clone so we can mutate null -> constant safely
    const arr = [...(formModel.getSelectionsForProperty(fieldDescription) || [])];
    const nullSel = arr.find((s) => s.value == null);
    if (nullSel) {
      nullSel.value = NULL_VALUE_CONSTANT;
    }
    return arr as Array<{ label: string; value: unknown }>;
  }, [fieldDescription, formModel]);

  const selectionsDP = useMemo(() => {
    return new MutableArrayDataProvider<string, { label: string; value: any }>(
      selections as any[],
      { keyAttributes: "value" }
    );
  }, [selections]);

  const itemText = (opt: ItemContext<string, { label: string; value: any }>) => {
    return opt.data.label ?? opt.data.value;
  };

  const supportsTokens = formModel.canSupportTokens && !!fieldDescription.supportsModelTokens;
  const supportsUnresolvedRef =
    fieldDescription.type === "reference-dynamic-enum" || fieldDescription.type === "reference";

  const applyAndClose = (e: CButtonElement.ojAction) => {
    if (!fieldDescription) return;

    const name = fieldDescription.name;
    const currentVal = formModel.getProperty(name);
    let didChange = false;

    if (entryType === ENTRY_TYPE.unset) {
      // Do not allow unsetting a read-only field
      if (!formModel.isReadOnly(fieldDescription)) {
        if (currentVal !== undefined) {
          formModel.setProperty(name);
          didChange = true;
        }
      }
    } else if (entryType === ENTRY_TYPE.token) {
      if (tokenValue && currentVal !== tokenValue) {
        formModel.setPropertyAsTokenValue(name, tokenValue);
        didChange = true;
      }
    } else if (entryType === ENTRY_TYPE.unresolvedRef) {
      if (unresolvedRefValue && currentVal !== unresolvedRefValue) {
        formModel.setPropertyAsUnresolvedReference(name, unresolvedRefValue);
        didChange = true;
      }
    } else {
      // regular
      if (formModel.isFieldProperties(fieldDescription) && workingModel) {
        const newVal = workingModel.getProperty(name);
        const equal = JSON.stringify(newVal) === JSON.stringify(currentVal);
        if (!equal) {
          formModel.setProperty(name, newVal);
          didChange = true;
        }
      } else {
        let valueToSet: any = regularValue;
        if (formModel.isFieldArray(fieldDescription)) {
          const asText = (regularValue ?? "") as string;
          valueToSet = asText.length ? asText.split("\n") : [];
        } else if (formModel.isFieldSelect(fieldDescription)) {
          valueToSet = regularValue === NULL_VALUE_CONSTANT ? null : regularValue;
        }
        const equal = JSON.stringify(valueToSet) === JSON.stringify(currentVal);
        if (!equal) {
          formModel.setProperty(name, valueToSet);
          didChange = true;
        }
      }
    }

    if (didChange) {
      onApply();
    }
    dialogRef.current?.close();
  };

  return (
    <Dialog
      id="fieldSettingsDialog"
      ref={dialogRef}
      dialog-title={title}
      drag-affordance="title-bar"
      onojClose={onClose as any}
      resizeBehavior="resizable"
    >
      <div slot="body">
        <div class="cfe-dialog-prompt">
          <br />
          <oj-radioset
            value={entryType}
            onvalueChanged={(ev) => setEntryType(ev.detail.value as ENTRY_TYPE)}
            style={{width:'100%'}}
          >
            <oj-option value={ENTRY_TYPE.unset} disabled={!formModel.hasPropertyChanged(fieldDescription.name) || formModel.isReadOnly(fieldDescription)}>
              {t["wrc-wdt-form"].wdtOptionsDialog.default}
            </oj-option>

            <oj-option value={ENTRY_TYPE.regular}>
              {formModel.isFieldBoolean(fieldDescription)
                ? t["wrc-wdt-form"].wdtOptionsDialog.selectSwitch
                : formModel.isFieldSelect(fieldDescription)
                ? t["wrc-wdt-form"].wdtOptionsDialog.selectValue
                : formModel.isFieldMultiSelect(fieldDescription)
                ? t["wrc-wdt-form"].wdtOptionsDialog.multiSelectUnset
                : (formModel.isReadOnly(fieldDescription)
                  ? t["wrc-wdt-form"].wdtOptionsDialog.seeValue
                  : t["wrc-wdt-form"].wdtOptionsDialog.enterValue)}
            </oj-option>

            <div style={{ display: entryType === ENTRY_TYPE.regular ? "" : "none" }}>
              {formModel.isFieldProperties(fieldDescription) ? (
                getPropertiesEditor(
                  fieldDescription,
                  (workingModel ?? formModel),
                  (e: ojInputText.valueChanged | ojSwitch.valueChanged) => {
                    const val = (e as any).detail.value;
                    const wm = workingModel ?? formModel.clone();
                    wm.setProperty(fieldDescription.name, val);
                    // keep local model evolving so table re-renders
                    setWorkingModel(wm);
                  },
                  workingModel ? ((m: FormContentModel) => setWorkingModel(m)) : undefined
                )
              ) : formModel.isFieldBoolean(fieldDescription) ? (
                <oj-switch
                  id={fieldDescription.name}
                  class="cfe-form-switch"
                  disabled={formModel.isDisabled(fieldDescription)}
                  displayOptions={{ messages: "none" }}
                  label-edge="none"
                  label-hint={fieldDescription.label}
                  onvalueChanged={(e: ojSwitch.valueChanged) => setRegularValue(!!e.detail.value)}
                  value={!!regularValue}
                  data-property={fieldDescription.name}
                  readonly={formModel.isReadOnly(fieldDescription)}
                />
              ) : formModel.isFieldSelect(fieldDescription) ? (
                <oj-select-single
                  id={fieldDescription.name}
                  value={regularValue}
                  class="cfe-form-select-one-md"
                  labelEdge="none"
                  label-hint={fieldDescription.label}
                  data={selectionsDP}
                  itemText={itemText}
                  onvalueChanged={(e: ojInputText.valueChanged) => setRegularValue(e.detail.value)}
                  required={formModel.isRequired(fieldDescription)}
                  disabled={formModel.isDisabled(fieldDescription)}
                  readonly={formModel.isReadOnly(fieldDescription)}
                  data-property={fieldDescription.name}
                />
              ) : formModel.isFieldFileContents(fieldDescription) ? (
                <div class="oj-flex oj-flex-bar oj-sm-align-items-center">
                  <oj-c-input-text
                    class="cfe-file-picker"
                    disabled={true}
                    title=""
                    label-edge="none"
                    label-hint={fieldDescription.label}
                    value={(regularValue as File)?.name || ""}
                  >
                    <div class=""></div>
                  </oj-c-input-text>

                  <input
                    type="file"
                    ref={fileContentsInputRef}
                    onChange={() => {
                      const f = fileContentsInputRef.current?.files?.[0];
                      setRegularValue(f);
                    }}
                    style="display:none"
                  />

                  <oj-c-button chroming="borderless" onojAction={() => fileContentsInputRef.current?.click()}>
                    <span slot="startIcon" class="oj-ux-ico-upload"></span>
                  </oj-c-button>

                  <oj-c-button chroming="borderless" onojAction={() => setRegularValue(undefined)}>
                    <span slot="startIcon" class="oj-ux-ico-eraser"></span>
                  </oj-c-button>
                </div>
              ) : formModel.isFieldFilename(fieldDescription) ? (
                <div class="oj-flex oj-flex-bar oj-sm-align-items-center">
                  <oj-c-input-text
                    class="cfe-file-picker"
                    disabled={true}
                    title=""
                    label-edge="none"
                    label-hint={fieldDescription.label}
                    value={(regularValue as string) || ""}
                  >
                    <div class=""></div>
                  </oj-c-input-text>

                  <input
                    type="file"
                    ref={filenameInputRef}
                    onChange={async () => {
                      const f = filenameInputRef.current?.files?.[0];
                      let fname: string | undefined;
                      if (f) {
                        try {
                          const electronAPI = (window as any).electron_api;
                          if (electronAPI && typeof electronAPI.getFilePath === "function") {
                            fname = await electronAPI.getFilePath(f);
                          } else {
                            fname = f.name;
                          }
                        } catch (_e) {
                          fname = f.name;
                        }
                      }
                      setRegularValue(fname || "");
                    }}
                    style="display:none"
                  />

                  <oj-c-button chroming="borderless" onojAction={() => filenameInputRef.current?.click()}>
                    <span slot="startIcon" class="oj-ux-ico-upload"></span>
                  </oj-c-button>

                  <oj-c-button chroming="borderless" onojAction={() => setRegularValue("")}>
                    <span slot="startIcon" class="oj-ux-ico-eraser"></span>
                  </oj-c-button>
                </div>
              ) : formModel.isFieldNewFilename(fieldDescription) ? (
                <div class="oj-flex oj-flex-bar oj-sm-align-items-center">
                  <oj-input-text
                    class="cfe-form-input-text"
                    displayOptions={{ messages: "none" }}
                    label-edge="none"
                    onrawValueChanged={(e: ojInputTextEventMap["rawValueChanged"]) =>
                      setRegularValue((e as any).detail.value)
                    }
                    placeholder=""
                    readonly={formModel.isReadOnly(fieldDescription)}
                    required={formModel.isRequired(fieldDescription)}
                    title={`${formModel.getTitle(fieldDescription)}`}
                    user-assistance-density="reflow"
                    value={(regularValue as string) || ""}
                    data-property={fieldDescription.name}
                    id={fieldDescription.name}
                  />
                  {(window as any).electron_api ? (
                    <oj-c-button
                      chroming="borderless"
                      onojAction={async () => {
                        try {
                          const electronAPI = (window as any).electron_api;
                          const res = await electronAPI.getSaveAs({ filepath: (regularValue as string) || "" });
                          if (res?.filePath) setRegularValue(res.filePath);
                        } catch (_e) {}
                      }}
                    >
                      <span slot="startIcon" class="oj-ux-ico-upload"></span>
                    </oj-c-button>
                  ) : (
                    <></>
                  )}
                </div>
              ) : formModel.isFieldArray(fieldDescription) ? (
                <oj-text-area
                  class="cfe-form-input-textarea"
                  resize-behavior="vertical"
                  rows={4}
                  label-edge="none"
                  label-hint={fieldDescription.label}
                  value={regularValue}
                  onrawValueChanged={(e: ojInputTextEventMap["rawValueChanged"]) =>
                    setRegularValue((e as any).detail.value)
                  }
                  data-property={fieldDescription.name}
                />
              ) : formModel.isSecretField(fieldDescription) ? (
                <oj-c-input-password
                  id={fieldDescription.name}
                  class="cfe-form-input-text"
                  disabled={formModel.isDisabled(fieldDescription)}
                  displayOptions={{ messages: "none" }}
                  label-edge="none"
                  label-hint={fieldDescription.label}
                  onrawValueChanged={(e: ojInputTextEventMap["rawValueChanged"]) =>
                    setRegularValue((e as any).detail.value)
                  }
                  placeholder=""
                  readonly={formModel.isReadOnly(fieldDescription)}
                  required={formModel.isRequired(fieldDescription)}
                  title={formModel.getTitle(fieldDescription)}
                  user-assistance-density="reflow"
                  value={regularValue}
                  data-property={fieldDescription.name}
                />
              ) : isIndirectField ? (
                <div class="wrc-indirect-field-container">
                  <oj-text-area
                    class="wrc-indirect-field-value"
                    value={indirectDisplayValue}
                    readonly={true}
                    rows={Math.min(10, Math.max(3, (indirectDisplayValue?.split('\n').length || 1)))}
                    title="Fetched content from URL"
                  />
                  {!indirectLoading && indirectDisplayValue && (
                    <oj-c-button
                      chroming="ghost"
                      onojAction={async () => {
                        try {
                          await navigator.clipboard.writeText(indirectDisplayValue);
                          // Could add a brief success indicator here if needed
                        } catch (error) {
                          Logger.error("Failed to copy to clipboard:", error);
                        }
                      }}
                      class="wrc-indirect-field-copy-btn"
                      tooltip={t["wrc-indirect-field"].copy.button.tooltip}
                    >
                      <span slot="startIcon" class={`oj-ux-ico-copy`}></span>
                    </oj-c-button>
                  )}
                </div>
              ) : (
                <oj-input-text
                  class="cfe-form-input-text"
                  displayOptions={{ messages: "none" }}
                  label-edge="none"
                  onrawValueChanged={(e: ojInputTextEventMap["rawValueChanged"]) =>
                    setRegularValue((e as any).detail.value)
                  }
                  placeholder=""
                  readonly={formModel.isReadOnly(fieldDescription)}
                  required={formModel.isRequired(fieldDescription)}
                  title={`${formModel.getHint(fieldDescription)}`}
                  user-assistance-density="reflow"
                  value={regularValue}
                  data-property={fieldDescription.name}
                  id={fieldDescription.name}
                />
              )}
            </div>

            {supportsTokens ? (
              <>
                <oj-option value={ENTRY_TYPE.token}>
                  {t["wrc-wdt-form"].wdtOptionsDialog.enterModelToken}
                </oj-option>
                <div style={{ display: entryType === ENTRY_TYPE.token ? "" : "none" }}>
                  <oj-input-text
                    placeholder="@@PROP:KEY@@"
                    class="cfe-required-field cfe-form-input-single-column"
                    aria-label={t["wrc-wdt-form"].wdtOptionsDialog.enterModelToken}
                    value={tokenValue}
                    onvalueChanged={(e: ojInputText.valueChanged) => setTokenValue(e.detail.value as string)}
                  />
                </div>
              </>
            ) : (
              <></>
            )}

            {supportsUnresolvedRef ? (
              <>
                <oj-option value={ENTRY_TYPE.unresolvedRef}>
                  {t["wrc-wdt-form"].wdtOptionsDialog.enterUnresolvedReference}
                </oj-option>
                <div style={{ display: entryType === ENTRY_TYPE.unresolvedRef ? "" : "none" }}>
                  <oj-input-text
                    class="cfe-required-field cfe-form-input-single-column"
                    aria-label={t["wrc-wdt-form"].wdtOptionsDialog.enterUnresolvedReference}
                    value={unresolvedRefValue}
                    onvalueChanged={(e: ojInputText.valueChanged) =>
                      setUnresolvedRefValue(e.detail.value as string)
                    }
                  />
                </div>
              </>
            ) : (
              <></>
            )}
          </oj-radioset>
        </div>
      </div>

      <div slot="footer">
        <oj-c-button
          id="dlgOkBtn"
          label={t["wrc-common"].buttons.ok.label}
          onojAction={applyAndClose}
        >
          <span class="button-label">{t["wrc-common"].buttons.ok.label}</span>
        </oj-c-button>
        <oj-c-button id="dlgCancelBtn" label={t["wrc-common"].buttons.cancel.label} onojAction={() => dialogRef.current?.close()}>
          <span class="button-label">{t["wrc-common"].buttons.cancel.label}</span>
        </oj-c-button>
      </div>
    </Dialog>
  );
}
