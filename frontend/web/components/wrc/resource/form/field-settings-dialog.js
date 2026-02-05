var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "preact/jsx-runtime", "preact/hooks", "ojL10n!wrc/shared/resources/nls/frontend", "ojs/ojtranslation", "ojs/ojmutablearraydataprovider", "../../shared/model/transport", "ojs/ojlogger", "../../display/dialog", "./formfields", "oj-c/input-password", "ojs/ojselectsingle", "oj-c/button", "oj-c/input-text", "ojs/ojradioset"], function (require, exports, jsx_runtime_1, hooks_1, t, Translations, MutableArrayDataProvider, transport_1, Logger, dialog_1, formfields_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FieldSettingsDialog;
    var ENTRY_TYPE;
    (function (ENTRY_TYPE) {
        ENTRY_TYPE["unset"] = "unset";
        ENTRY_TYPE["regular"] = "regular";
        ENTRY_TYPE["token"] = "token";
        ENTRY_TYPE["unresolvedRef"] = "unresolvedRef";
    })(ENTRY_TYPE || (ENTRY_TYPE = {}));
    const NULL_VALUE_CONSTANT = "_NULL";
    function FieldSettingsDialog({ open, formModel, fieldDescription, onClose, onApply, }) {
        const dialogRef = (0, hooks_1.useRef)(null);
        const fileContentsInputRef = (0, hooks_1.useRef)(null);
        const filenameInputRef = (0, hooks_1.useRef)(null);
        const title = (0, hooks_1.useMemo)(() => {
            if (!fieldDescription)
                return "";
            const pattern = t["wrc-wdt-form"].wdtOptionsDialog.title;
            return Translations.applyParameters(pattern, [fieldDescription.label]);
        }, [fieldDescription]);
        const [entryType, setEntryType] = (0, hooks_1.useState)(ENTRY_TYPE.regular);
        const [tokenValue, setTokenValue] = (0, hooks_1.useState)(undefined);
        const [unresolvedRefValue, setUnresolvedRefValue] = (0, hooks_1.useState)(undefined);
        const [regularValue, setRegularValue] = (0, hooks_1.useState)();
        const [workingModel, setWorkingModel] = (0, hooks_1.useState)(undefined);
        const [indirectDisplayValue, setIndirectDisplayValue] = (0, hooks_1.useState)("");
        const [indirectLoading, setIndirectLoading] = (0, hooks_1.useState)(false);
        const isIndirectField = (0, hooks_1.useMemo)(() => {
            var _a;
            if (!fieldDescription)
                return false;
            if (!((_a = formModel.rdj) === null || _a === void 0 ? void 0 : _a.data) || Array.isArray(formModel.rdj.data))
                return false;
            const propertyData = formModel.rdj.data[fieldDescription.name];
            return (propertyData === null || propertyData === void 0 ? void 0 : propertyData.indirect) === true;
        }, [fieldDescription, formModel]);
        (0, hooks_1.useEffect)(() => {
            if (!fieldDescription)
                return;
            const modelValue = formModel.getProperty(fieldDescription.name);
            const supportsModelTokens = formModel.canSupportTokens;
            const isToken = supportsModelTokens &&
                typeof modelValue === "string" &&
                modelValue.startsWith("@@") &&
                modelValue.endsWith("@@");
            if (formModel.isFieldProperties(fieldDescription)) {
                setWorkingModel(formModel.clone());
            }
            else {
                setWorkingModel(undefined);
            }
            if (isIndirectField) {
                setIndirectLoading(true);
                setIndirectDisplayValue(t["wrc-indirect-field"].loading.value);
                const fetchIndirectData = () => __awaiter(this, void 0, void 0, function* () {
                    try {
                        if (typeof modelValue === "string" && modelValue) {
                            const data = yield (0, transport_1.getDataComponentText)(modelValue);
                            setIndirectDisplayValue(data);
                        }
                        else {
                            setIndirectDisplayValue("");
                        }
                    }
                    catch (error) {
                        Logger.error("Failed to fetch indirect field data:", error);
                        setIndirectDisplayValue(t["wrc-indirect-field"].error.value);
                    }
                    finally {
                        setIndirectLoading(false);
                    }
                });
                fetchIndirectData();
                setEntryType(ENTRY_TYPE.regular);
                setTokenValue(undefined);
                setUnresolvedRefValue(undefined);
                setRegularValue(modelValue);
            }
            else if (isToken) {
                setEntryType(ENTRY_TYPE.token);
                setTokenValue(modelValue);
                setRegularValue(undefined);
                setUnresolvedRefValue(undefined);
            }
            else {
                setEntryType(ENTRY_TYPE.regular);
                setTokenValue(undefined);
                setUnresolvedRefValue(undefined);
                if (formModel.isFieldArray(fieldDescription)) {
                    const arr = modelValue || [];
                    setRegularValue(arr.join("\n"));
                }
                else if (formModel.isFieldBoolean(fieldDescription)) {
                    setRegularValue(!!modelValue);
                }
                else if (formModel.isFieldSelect(fieldDescription)) {
                    setRegularValue(modelValue === null ? NULL_VALUE_CONSTANT : modelValue);
                }
                else if (!formModel.isFieldProperties(fieldDescription)) {
                    setRegularValue(modelValue);
                }
            }
        }, [fieldDescription, formModel, isIndirectField]);
        (0, hooks_1.useEffect)(() => {
            if (!dialogRef.current)
                return;
            if (open) {
                dialogRef.current.open();
            }
        }, [open]);
        if (!fieldDescription)
            return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
        const selections = (0, hooks_1.useMemo)(() => {
            if (!formModel.isFieldSelect(fieldDescription))
                return [];
            const arr = [...(formModel.getSelectionsForProperty(fieldDescription) || [])];
            const nullSel = arr.find((s) => s.value == null);
            if (nullSel) {
                nullSel.value = NULL_VALUE_CONSTANT;
            }
            return arr;
        }, [fieldDescription, formModel]);
        const selectionsDP = (0, hooks_1.useMemo)(() => {
            return new MutableArrayDataProvider(selections, { keyAttributes: "value" });
        }, [selections]);
        const itemText = (opt) => {
            var _a;
            return (_a = opt.data.label) !== null && _a !== void 0 ? _a : opt.data.value;
        };
        const supportsTokens = formModel.canSupportTokens && !!fieldDescription.supportsModelTokens;
        const supportsUnresolvedRef = fieldDescription.type === "reference-dynamic-enum" || fieldDescription.type === "reference";
        const applyAndClose = (e) => {
            var _a;
            if (!fieldDescription)
                return;
            const name = fieldDescription.name;
            const currentVal = formModel.getProperty(name);
            let didChange = false;
            if (entryType === ENTRY_TYPE.unset) {
                if (!formModel.isReadOnly(fieldDescription)) {
                    if (currentVal !== undefined) {
                        formModel.setProperty(name);
                        didChange = true;
                    }
                }
            }
            else if (entryType === ENTRY_TYPE.token) {
                if (tokenValue && currentVal !== tokenValue) {
                    formModel.setPropertyAsTokenValue(name, tokenValue);
                    didChange = true;
                }
            }
            else if (entryType === ENTRY_TYPE.unresolvedRef) {
                if (unresolvedRefValue && currentVal !== unresolvedRefValue) {
                    formModel.setPropertyAsUnresolvedReference(name, unresolvedRefValue);
                    didChange = true;
                }
            }
            else {
                if (formModel.isFieldProperties(fieldDescription) && workingModel) {
                    const newVal = workingModel.getProperty(name);
                    const equal = JSON.stringify(newVal) === JSON.stringify(currentVal);
                    if (!equal) {
                        formModel.setProperty(name, newVal);
                        didChange = true;
                    }
                }
                else {
                    let valueToSet = regularValue;
                    if (formModel.isFieldArray(fieldDescription)) {
                        const asText = (regularValue !== null && regularValue !== void 0 ? regularValue : "");
                        valueToSet = asText.length ? asText.split("\n") : [];
                    }
                    else if (formModel.isFieldSelect(fieldDescription)) {
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
            (_a = dialogRef.current) === null || _a === void 0 ? void 0 : _a.close();
        };
        return ((0, jsx_runtime_1.jsxs)(dialog_1.Dialog, { id: "fieldSettingsDialog", ref: dialogRef, "dialog-title": title, "drag-affordance": "title-bar", onojClose: onClose, resizeBehavior: "resizable", children: [(0, jsx_runtime_1.jsx)("div", { slot: "body", children: (0, jsx_runtime_1.jsxs)("div", { class: "cfe-dialog-prompt", children: [(0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsxs)("oj-radioset", { value: entryType, onvalueChanged: (ev) => setEntryType(ev.detail.value), style: { width: '100%' }, children: [(0, jsx_runtime_1.jsx)("oj-option", { value: ENTRY_TYPE.unset, disabled: !formModel.hasPropertyChanged(fieldDescription.name) || formModel.isReadOnly(fieldDescription), children: t["wrc-wdt-form"].wdtOptionsDialog.default }), (0, jsx_runtime_1.jsx)("oj-option", { value: ENTRY_TYPE.regular, children: formModel.isFieldBoolean(fieldDescription)
                                            ? t["wrc-wdt-form"].wdtOptionsDialog.selectSwitch
                                            : formModel.isFieldSelect(fieldDescription)
                                                ? t["wrc-wdt-form"].wdtOptionsDialog.selectValue
                                                : formModel.isFieldMultiSelect(fieldDescription)
                                                    ? t["wrc-wdt-form"].wdtOptionsDialog.multiSelectUnset
                                                    : (formModel.isReadOnly(fieldDescription)
                                                        ? t["wrc-wdt-form"].wdtOptionsDialog.seeValue
                                                        : t["wrc-wdt-form"].wdtOptionsDialog.enterValue) }), (0, jsx_runtime_1.jsx)("div", { style: { display: entryType === ENTRY_TYPE.regular ? "" : "none" }, children: formModel.isFieldProperties(fieldDescription) ? ((0, formfields_1.getPropertiesEditor)(fieldDescription, (workingModel !== null && workingModel !== void 0 ? workingModel : formModel), (e) => {
                                            const val = e.detail.value;
                                            const wm = workingModel !== null && workingModel !== void 0 ? workingModel : formModel.clone();
                                            wm.setProperty(fieldDescription.name, val);
                                            setWorkingModel(wm);
                                        }, workingModel ? ((m) => setWorkingModel(m)) : undefined)) : formModel.isFieldBoolean(fieldDescription) ? ((0, jsx_runtime_1.jsx)("oj-switch", { id: fieldDescription.name, class: "cfe-form-switch", disabled: formModel.isDisabled(fieldDescription), displayOptions: { messages: "none" }, "label-edge": "none", "label-hint": fieldDescription.label, onvalueChanged: (e) => setRegularValue(!!e.detail.value), value: !!regularValue, "data-property": fieldDescription.name, readonly: formModel.isReadOnly(fieldDescription) })) : formModel.isFieldSelect(fieldDescription) ? ((0, jsx_runtime_1.jsx)("oj-select-single", { id: fieldDescription.name, value: regularValue, class: "cfe-form-select-one-md", labelEdge: "none", "label-hint": fieldDescription.label, data: selectionsDP, itemText: itemText, onvalueChanged: (e) => setRegularValue(e.detail.value), required: formModel.isRequired(fieldDescription), disabled: formModel.isDisabled(fieldDescription), readonly: formModel.isReadOnly(fieldDescription), "data-property": fieldDescription.name })) : formModel.isFieldFileContents(fieldDescription) ? ((0, jsx_runtime_1.jsxs)("div", { class: "oj-flex oj-flex-bar oj-sm-align-items-center", children: [(0, jsx_runtime_1.jsx)("oj-c-input-text", { class: "cfe-file-picker", disabled: true, title: "", "label-edge": "none", "label-hint": fieldDescription.label, value: (regularValue === null || regularValue === void 0 ? void 0 : regularValue.name) || "", children: (0, jsx_runtime_1.jsx)("div", { class: "" }) }), (0, jsx_runtime_1.jsx)("input", { type: "file", ref: fileContentsInputRef, onChange: () => {
                                                        var _a, _b;
                                                        const f = (_b = (_a = fileContentsInputRef.current) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b[0];
                                                        setRegularValue(f);
                                                    }, style: "display:none" }), (0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "borderless", onojAction: () => { var _a; return (_a = fileContentsInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-upload" }) }), (0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "borderless", onojAction: () => setRegularValue(undefined), children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-eraser" }) })] })) : formModel.isFieldFilename(fieldDescription) ? ((0, jsx_runtime_1.jsxs)("div", { class: "oj-flex oj-flex-bar oj-sm-align-items-center", children: [(0, jsx_runtime_1.jsx)("oj-c-input-text", { class: "cfe-file-picker", disabled: true, title: "", "label-edge": "none", "label-hint": fieldDescription.label, value: regularValue || "", children: (0, jsx_runtime_1.jsx)("div", { class: "" }) }), (0, jsx_runtime_1.jsx)("input", { type: "file", ref: filenameInputRef, onChange: () => __awaiter(this, void 0, void 0, function* () {
                                                        var _a, _b;
                                                        const f = (_b = (_a = filenameInputRef.current) === null || _a === void 0 ? void 0 : _a.files) === null || _b === void 0 ? void 0 : _b[0];
                                                        let fname;
                                                        if (f) {
                                                            try {
                                                                const electronAPI = window.electron_api;
                                                                if (electronAPI && typeof electronAPI.getFilePath === "function") {
                                                                    fname = yield electronAPI.getFilePath(f);
                                                                }
                                                                else {
                                                                    fname = f.name;
                                                                }
                                                            }
                                                            catch (_e) {
                                                                fname = f.name;
                                                            }
                                                        }
                                                        setRegularValue(fname || "");
                                                    }), style: "display:none" }), (0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "borderless", onojAction: () => { var _a; return (_a = filenameInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-upload" }) }), (0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "borderless", onojAction: () => setRegularValue(""), children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-eraser" }) })] })) : formModel.isFieldNewFilename(fieldDescription) ? ((0, jsx_runtime_1.jsxs)("div", { class: "oj-flex oj-flex-bar oj-sm-align-items-center", children: [(0, jsx_runtime_1.jsx)("oj-input-text", { class: "cfe-form-input-text", displayOptions: { messages: "none" }, "label-edge": "none", onrawValueChanged: (e) => setRegularValue(e.detail.value), placeholder: "", readonly: formModel.isReadOnly(fieldDescription), required: formModel.isRequired(fieldDescription), title: `${formModel.getTitle(fieldDescription)}`, "user-assistance-density": "reflow", value: regularValue || "", "data-property": fieldDescription.name, id: fieldDescription.name }), window.electron_api ? ((0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "borderless", onojAction: () => __awaiter(this, void 0, void 0, function* () {
                                                        try {
                                                            const electronAPI = window.electron_api;
                                                            const res = yield electronAPI.getSaveAs({ filepath: regularValue || "" });
                                                            if (res === null || res === void 0 ? void 0 : res.filePath)
                                                                setRegularValue(res.filePath);
                                                        }
                                                        catch (_e) { }
                                                    }), children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-upload" }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] })) : formModel.isFieldArray(fieldDescription) ? ((0, jsx_runtime_1.jsx)("oj-text-area", { class: "cfe-form-input-textarea", "resize-behavior": "vertical", rows: 4, "label-edge": "none", "label-hint": fieldDescription.label, value: regularValue, onrawValueChanged: (e) => setRegularValue(e.detail.value), "data-property": fieldDescription.name })) : formModel.isSecretField(fieldDescription) ? ((0, jsx_runtime_1.jsx)("oj-c-input-password", { id: fieldDescription.name, class: "cfe-form-input-text", disabled: formModel.isDisabled(fieldDescription), displayOptions: { messages: "none" }, "label-edge": "none", "label-hint": fieldDescription.label, onrawValueChanged: (e) => setRegularValue(e.detail.value), placeholder: "", readonly: formModel.isReadOnly(fieldDescription), required: formModel.isRequired(fieldDescription), title: formModel.getTitle(fieldDescription), "user-assistance-density": "reflow", value: regularValue, "data-property": fieldDescription.name })) : isIndirectField ? ((0, jsx_runtime_1.jsxs)("div", { class: "wrc-indirect-field-container", children: [(0, jsx_runtime_1.jsx)("oj-text-area", { class: "wrc-indirect-field-value", value: indirectDisplayValue, readonly: true, rows: Math.min(10, Math.max(3, ((indirectDisplayValue === null || indirectDisplayValue === void 0 ? void 0 : indirectDisplayValue.split('\n').length) || 1))), title: "Fetched content from URL" }), !indirectLoading && indirectDisplayValue && ((0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "ghost", onojAction: () => __awaiter(this, void 0, void 0, function* () {
                                                        try {
                                                            yield navigator.clipboard.writeText(indirectDisplayValue);
                                                        }
                                                        catch (error) {
                                                            Logger.error("Failed to copy to clipboard:", error);
                                                        }
                                                    }), class: "wrc-indirect-field-copy-btn", tooltip: t["wrc-indirect-field"].copy.button.tooltip, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: `oj-ux-ico-copy` }) }))] })) : ((0, jsx_runtime_1.jsx)("oj-input-text", { class: "cfe-form-input-text", displayOptions: { messages: "none" }, "label-edge": "none", onrawValueChanged: (e) => setRegularValue(e.detail.value), placeholder: "", readonly: formModel.isReadOnly(fieldDescription), required: formModel.isRequired(fieldDescription), title: `${formModel.getHint(fieldDescription)}`, "user-assistance-density": "reflow", value: regularValue, "data-property": fieldDescription.name, id: fieldDescription.name })) }), supportsTokens ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("oj-option", { value: ENTRY_TYPE.token, children: t["wrc-wdt-form"].wdtOptionsDialog.enterModelToken }), (0, jsx_runtime_1.jsx)("div", { style: { display: entryType === ENTRY_TYPE.token ? "" : "none" }, children: (0, jsx_runtime_1.jsx)("oj-input-text", { placeholder: "@@PROP:KEY@@", class: "cfe-required-field cfe-form-input-single-column", "aria-label": t["wrc-wdt-form"].wdtOptionsDialog.enterModelToken, value: tokenValue, onvalueChanged: (e) => setTokenValue(e.detail.value) }) })] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), supportsUnresolvedRef ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("oj-option", { value: ENTRY_TYPE.unresolvedRef, children: t["wrc-wdt-form"].wdtOptionsDialog.enterUnresolvedReference }), (0, jsx_runtime_1.jsx)("div", { style: { display: entryType === ENTRY_TYPE.unresolvedRef ? "" : "none" }, children: (0, jsx_runtime_1.jsx)("oj-input-text", { class: "cfe-required-field cfe-form-input-single-column", "aria-label": t["wrc-wdt-form"].wdtOptionsDialog.enterUnresolvedReference, value: unresolvedRefValue, onvalueChanged: (e) => setUnresolvedRefValue(e.detail.value) }) })] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] })] }) }), (0, jsx_runtime_1.jsxs)("div", { slot: "footer", children: [(0, jsx_runtime_1.jsx)("oj-c-button", { id: "dlgOkBtn", label: t["wrc-common"].buttons.ok.label, onojAction: applyAndClose, children: (0, jsx_runtime_1.jsx)("span", { class: "button-label", children: t["wrc-common"].buttons.ok.label }) }), (0, jsx_runtime_1.jsx)("oj-c-button", { id: "dlgCancelBtn", label: t["wrc-common"].buttons.cancel.label, onojAction: () => { var _a; return (_a = dialogRef.current) === null || _a === void 0 ? void 0 : _a.close(); }, children: (0, jsx_runtime_1.jsx)("span", { class: "button-label", children: t["wrc-common"].buttons.cancel.label }) })] })] }));
    }
});
//# sourceMappingURL=field-settings-dialog.js.map