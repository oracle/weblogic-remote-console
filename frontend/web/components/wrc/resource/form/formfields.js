var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "preact/jsx-runtime", "preact", "preact/hooks", "ojs/ojmutablearraydataprovider", "ojL10n!wrc/shared/resources/nls/frontend", "ojs/ojtranslation", "wrc/multiselect", "wrc/shared/url", "../resource", "./kebab-menu", "./policy-expression", "wrc/shared/model/transport", "ojs/ojlogger", "oj-c/input-password", "oj-c/button", "oj-c/input-text", "css!wrc/shared/shared-styles.css"], function (require, exports, jsx_runtime_1, preact_1, hooks_1, MutableArrayDataProvider, t, Translations, multiselect_1, url_1, resource_1, kebab_menu_1, policy_expression_1, transport_1, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getPolicyExpression = exports.getSwitch = exports.getFileSelectorForNewFile = exports.getFileSelectorForFilename = exports.getFileSelector = exports.getSelectSingle = exports.MoreMenu = exports.getMultiSelectBox = exports.getPropertiesEditor = exports.getInputField = exports.getSecretInputField = exports.getArrayInputField = exports.getLabel = void 0;
    const _UNUSED = preact_1.h;
    const getLabel = (fieldDescription, formModel) => {
        var _a, _b, _c;
        const widthHint = formModel.getWidth(fieldDescription);
        if (widthHint === 'lg' || widthHint === 'xxl') {
            return null;
        }
        const labelText = `${fieldDescription.label}${formModel.isRequired(fieldDescription) ? "*" : ""}`;
        let help;
        let helpSummaryText;
        if (fieldDescription.helpSummaryHTML) {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = fieldDescription.helpSummaryHTML;
            helpSummaryText = tempDiv.innerText;
            help = { definition: helpSummaryText };
        }
        const popupRef = (0, hooks_1.useRef)(null);
        const buttonRef = (0, hooks_1.useRef)(null);
        const [tooltipText, setTooltipText] = (0, hooks_1.useState)(helpSummaryText);
        const showHelpCallback = () => {
            if (fieldDescription.detailedHelpHTML) {
                setTooltipText(undefined);
                popupRef.current.open(buttonRef.current);
            }
        };
        const labelGroupClass = "oj-flex-item oj-flex-bar-start oj-flex oj-sm-flex-wrap-nowrap oj-sm-align-items-center wrc-label-group";
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", { class: 'oj-flex oj-flex-bar oj-sm-align-items-center', children: [(0, jsx_runtime_1.jsxs)("div", { class: labelGroupClass, children: [helpSummaryText ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("oj-popup", { ref: popupRef, onojOpen: () => setTooltipText(undefined), onojClose: () => setTooltipText(helpSummaryText), children: (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: {
                                                __html: fieldDescription.detailedHelpHTML,
                                            } }) }), (0, jsx_runtime_1.jsx)("oj-c-button", { ref: buttonRef, onojAction: showHelpCallback, chroming: "ghost", tooltip: tooltipText, "aria-label": (_c = (_b = (_a = t === null || t === void 0 ? void 0 : t["wrc-form-toolbar"]) === null || _a === void 0 ? void 0 : _a.icons) === null || _b === void 0 ? void 0 : _b.help) === null || _c === void 0 ? void 0 : _c.tooltip, class: "oj-sm-margin-0 oj-sm-padding-0", children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-help", style: "font-size:0.8em;line-height:1;display:inline-block" }) })] })) : ((0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "ghost", class: "oj-sm-margin-0 oj-sm-padding-0", style: "visibility:hidden", "aria-hidden": "true", disabled: true, tabindex: -1, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-help", style: "font-size:0.8em;line-height:1;display:inline-block" }) })), (0, jsx_runtime_1.jsx)("oj-label", { id: fieldDescription.name + '_LABEL', class: "oj-sm-align-self-center oj-sm-margin-0 oj-sm-padding-0", children: (0, jsx_runtime_1.jsx)("span", { class: "wrc-label-text", children: labelText }) })] }), (0, jsx_runtime_1.jsx)("div", { class: "oj-flex-bar-end" })] }) }));
    };
    exports.getLabel = getLabel;
    var FIELD_SETTINGS_ENTRY_TYPE;
    (function (FIELD_SETTINGS_ENTRY_TYPE) {
        FIELD_SETTINGS_ENTRY_TYPE[FIELD_SETTINGS_ENTRY_TYPE["unset"] = 0] = "unset";
        FIELD_SETTINGS_ENTRY_TYPE[FIELD_SETTINGS_ENTRY_TYPE["regular"] = 1] = "regular";
        FIELD_SETTINGS_ENTRY_TYPE[FIELD_SETTINGS_ENTRY_TYPE["token"] = 2] = "token";
        FIELD_SETTINGS_ENTRY_TYPE[FIELD_SETTINGS_ENTRY_TYPE["unresolvedRef"] = 3] = "unresolvedRef";
    })(FIELD_SETTINGS_ENTRY_TYPE || (FIELD_SETTINGS_ENTRY_TYPE = {}));
    const isAToken = (value) => typeof value === "string" && value.startsWith("@@") && value.endsWith("@@");
    const RestartNeededImage = ({ fieldDescription, formModel }) => {
        const visibility = formModel.isRestartNeeded(fieldDescription)
            ? "visible"
            : "hidden";
        const imgSrc = (0, url_1.requireAsset)("wrc/assets/images/restart-required-org_24x24.png");
        return !formModel.canSupportTokens ? ((0, jsx_runtime_1.jsx)("img", { className: "restart-required-icon", src: imgSrc, style: { visibility }, title: "Server or App Restart Required" })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}));
    };
    const DefaultedField = () => ((0, jsx_runtime_1.jsx)("oj-input-text", { id: "why", class: "cfe-form-input-integer-sm", value: t["wrc-pdj-unset"].placeholder.value, disabled: true, readonly: true, labelEdge: "none", "aria-disabled": "true" }));
    const FieldSettingsLauncher = ({ fieldDescription, formModel, }) => {
        const isDisabled = formModel.isDisabled(fieldDescription);
        let iconStyle = "";
        if (isDisabled)
            iconStyle += " visibility: hidden;";
        const open = () => {
            const evt = new CustomEvent("open-field-settings", {
                detail: { fieldDescription },
            });
            document.dispatchEvent(evt);
        };
        return ((0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "ghost", onojAction: open, tooltip: t["wrc-form"].icons.wdtIcon.tooltip, "aria-label": t["wrc-form"].icons.wdtIcon.tooltip, style: iconStyle, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-target cfe-button-icon" }) }));
    };
    const getArrayInputField = (fieldDescription, formModel, valueChangedHandler, setModel) => {
        const renderRow = (row, data, dataProvider, saveDataToModel, isReadOnly, fieldDescription, formModel, setModel) => {
            var _a, _b, _c, _d;
            const updateValue = (event) => {
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
                    setModel === null || setModel === void 0 ? void 0 : setModel(formModel.clone());
                }
            };
            return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("tr", { children: [row.mode == "navigation" && ((0, jsx_runtime_1.jsx)("td", { children: row.data["value"] })), row.mode == "edit" && ((0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("oj-input-text", { "data-property": fieldDescription.name, value: row.data["value"], class: "editable", onvalueChanged: updateValue }) })), !isReadOnly && ((0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsxs)("oj-c-button", { display: "icons", chroming: "borderless", "data-property": fieldDescription.name, label: (_b = (_a = t["wrc-pdj-fields"]) === null || _a === void 0 ? void 0 : _a["cfe-property-list-editor"]) === null || _b === void 0 ? void 0 : _b.labels.deleteButtonTooltip, onojAction: deleteRow, children: [(0, jsx_runtime_1.jsx)("span", { slot: "endIcon", class: "oj-ux-ico-trash" }), (_d = (_c = t["wrc-pdj-fields"]) === null || _c === void 0 ? void 0 : _c["cfe-property-list-editor"]) === null || _d === void 0 ? void 0 : _d.labels.deleteButtonTooltip] }) }))] }) }));
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
                return (modelValue || []).map((v) => ({ id: idCounter++, value: v }));
            },
            saveData: (data) => data.map(d => d.value),
            newRow: (data) => {
                const maxId = data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 0;
                return { id: maxId, value: "" };
            },
            keyField: "id",
            renderRow,
        });
    };
    exports.getArrayInputField = getArrayInputField;
    const getSecretInputField = (fieldDescription, formModel, valueChangedHandler, setModel) => {
        let clazz = formModel.isFieldNumber(fieldDescription)
            ? "cfe-form-input-integer-sm"
            : "cfe-form-input-text";
        const disabled = formModel.isDisabled(fieldDescription);
        const id = fieldDescription.name;
        const messages = formModel
            .getMessages(fieldDescription.name)
            .map((c) => {
            return { detail: c };
        });
        const readonly = formModel.isReadOnly(fieldDescription);
        const required = formModel.isRequired(fieldDescription);
        const title = formModel.getTitle(fieldDescription);
        const untypedValue = formModel.getProperty(fieldDescription.name);
        if (untypedValue &&
            typeof formModel.getProperty(fieldDescription.name) !== "string") {
            throw new Error(`Expected ${fieldDescription.name} type to be string, got ${typeof formModel.getProperty(fieldDescription.name)}`);
        }
        const value = formModel.getProperty(fieldDescription.name);
        const isDefaulted = formModel.isPropertyDefaulted(fieldDescription.name);
        const getOjInputPassword = (clazz, valueChangedHandler, showAsDefaulted) => !showAsDefaulted ? ((0, jsx_runtime_1.jsx)("oj-c-input-password", { id: id, class: clazz, disabled: disabled, displayOptions: { messages: "none" }, "label-edge": "none", "label-hint": fieldDescription.label, onrawValueChanged: valueChangedHandler, placeholder: "", readonly: readonly, required: required, title: title, "user-assistance-density": "reflow", value: value, "data-property": fieldDescription.name })) : ((0, jsx_runtime_1.jsx)(DefaultedField, {}));
        const isWDTToken = formModel.canSupportTokens &&
            value.startsWith("@@") &&
            value.endsWith("@@");
        return ((0, jsx_runtime_1.jsx)("div", { class: "OLDcfe-form-field oj-flex oj-flex-item", children: (0, jsx_runtime_1.jsxs)("span", { class: `wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? 'wrc-field-changed' : ''} ${formModel.isReadOnly(fieldDescription) ? 'wrc-align-center' : ''}`, children: [(0, jsx_runtime_1.jsx)(RestartNeededImage, { fieldDescription: fieldDescription, formModel: formModel }), (0, jsx_runtime_1.jsx)(FieldSettingsLauncher, { fieldDescription: fieldDescription, formModel: formModel }), isWDTToken ? ((0, jsx_runtime_1.jsx)("oj-input-text", { class: clazz, readonly: true, "aria-label": fieldDescription.label, value: value })) : (getOjInputPassword(clazz, valueChangedHandler, isDefaulted))] }) }));
    };
    exports.getSecretInputField = getSecretInputField;
    const IndirectField = ({ fieldDescription, formModel, }) => {
        const [displayValue, setDisplayValue] = (0, hooks_1.useState)("");
        const [loading, setLoading] = (0, hooks_1.useState)(true);
        const [copySuccess, setCopySuccess] = (0, hooks_1.useState)(false);
        (0, hooks_1.useEffect)(() => {
            var _a;
            let isMounted = true;
            const fetchIndirectValue = () => __awaiter(void 0, void 0, void 0, function* () {
                var _a;
                try {
                    const rdjData = (_a = formModel === null || formModel === void 0 ? void 0 : formModel.rdj) === null || _a === void 0 ? void 0 : _a.data;
                    let urlValue;
                    if (rdjData && typeof rdjData === 'object' && !Array.isArray(rdjData)) {
                        const propertyData = rdjData[fieldDescription === null || fieldDescription === void 0 ? void 0 : fieldDescription.name];
                        if (propertyData && typeof propertyData === 'object' && 'value' in propertyData) {
                            urlValue = propertyData.value;
                        }
                    }
                    if (typeof urlValue === "string" && urlValue && isMounted) {
                        const data = yield (0, transport_1.getDataComponentText)(urlValue);
                        if (isMounted) {
                            setDisplayValue(data);
                        }
                    }
                    else if (isMounted) {
                        setDisplayValue("");
                    }
                }
                catch (error) {
                    Logger.error("Failed to fetch indirect field value:", error);
                    if (isMounted) {
                        setDisplayValue(t["wrc-indirect-field"].error.value);
                    }
                }
                finally {
                    if (isMounted) {
                        setLoading(false);
                    }
                }
            });
            if (((_a = formModel === null || formModel === void 0 ? void 0 : formModel.rdj) === null || _a === void 0 ? void 0 : _a.data) && (fieldDescription === null || fieldDescription === void 0 ? void 0 : fieldDescription.name)) {
                fetchIndirectValue();
            }
            else if (isMounted) {
                setDisplayValue("");
                setLoading(false);
            }
            return () => {
                isMounted = false;
            };
        }, [fieldDescription === null || fieldDescription === void 0 ? void 0 : fieldDescription.name]);
        const handleCopyToClipboard = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield navigator.clipboard.writeText(displayValue);
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            }
            catch (error) {
                Logger.error("Failed to copy to clipboard:", error);
            }
        });
        const value = loading ? t["wrc-indirect-field"].loading.value : displayValue;
        return ((0, jsx_runtime_1.jsxs)("div", { class: "wrc-indirect-field-container", children: [(0, jsx_runtime_1.jsx)("oj-text-area", { class: "wrc-indirect-field-value", value: value, readonly: true, rows: Math.min(10, Math.max(3, ((value === null || value === void 0 ? void 0 : value.split('\n').length) || 1))), title: (fieldDescription === null || fieldDescription === void 0 ? void 0 : fieldDescription.label) || "" }), !loading && displayValue && ((0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "ghost", onojAction: handleCopyToClipboard, class: "wrc-indirect-field-copy-btn", tooltip: copySuccess ? t["wrc-indirect-field"].copy.success.tooltip : t["wrc-indirect-field"].copy.button.tooltip, "aria-label": copySuccess ? t["wrc-indirect-field"].copy.success.tooltip : t["wrc-indirect-field"].copy.button.tooltip, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: `oj-ux-ico-copy ${copySuccess ? 'wrc-copy-success' : ''}` }) }))] }));
    };
    const getInputField = (fieldDescription, formModel, valueChangedHandler, setModel) => {
        var _a, _b, _c, _d, _e, _f;
        const isIndirectField = (() => {
            var _a;
            if (((_a = formModel.rdj) === null || _a === void 0 ? void 0 : _a.data) && !Array.isArray(formModel.rdj.data)) {
                const propertyData = formModel.rdj.data[fieldDescription.name];
                return (propertyData === null || propertyData === void 0 ? void 0 : propertyData.indirect) === true;
            }
            return false;
        })();
        if (isIndirectField) {
            const labelText = `${fieldDescription.label}${formModel.isRequired(fieldDescription) ? "*" : ""}`;
            let help;
            let helpSummaryText;
            if (fieldDescription.helpSummaryHTML) {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = fieldDescription.helpSummaryHTML;
                helpSummaryText = tempDiv.innerText;
                help = { definition: helpSummaryText };
            }
            const popupRef = (0, hooks_1.useRef)(null);
            const buttonRef = (0, hooks_1.useRef)(null);
            const [tooltipText, setTooltipText] = (0, hooks_1.useState)(helpSummaryText);
            const showHelpCallback = () => {
                if (fieldDescription.detailedHelpHTML) {
                    setTooltipText(undefined);
                    popupRef.current.open(buttonRef.current);
                }
            };
            const labelGroupClass = "oj-flex-item oj-flex-bar-start oj-flex oj-sm-flex-wrap-nowrap oj-sm-align-items-center wrc-label-group";
            return ((0, jsx_runtime_1.jsxs)("div", { class: 'wrc-lg-width-field oj-sm-12', children: [(0, jsx_runtime_1.jsx)("div", { class: 'oj-flex oj-flex-bar oj-sm-align-items-center', children: (0, jsx_runtime_1.jsxs)("div", { class: labelGroupClass, children: [helpSummaryText ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("oj-popup", { ref: popupRef, onojOpen: () => setTooltipText(undefined), onojClose: () => setTooltipText(helpSummaryText), children: (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: { __html: fieldDescription.detailedHelpHTML } }) }), (0, jsx_runtime_1.jsx)("oj-c-button", { ref: buttonRef, onojAction: showHelpCallback, chroming: "ghost", tooltip: tooltipText, "aria-label": (_c = (_b = (_a = t === null || t === void 0 ? void 0 : t["wrc-form-toolbar"]) === null || _a === void 0 ? void 0 : _a.icons) === null || _b === void 0 ? void 0 : _b.help) === null || _c === void 0 ? void 0 : _c.tooltip, class: "oj-sm-margin-0 oj-sm-padding-0", children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-help", style: "font-size:0.8em;line-height:1;display:inline-block" }) })] })) : ((0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "ghost", class: "oj-sm-margin-0 oj-sm-padding-0", style: "visibility:hidden", "aria-hidden": "true", disabled: true, tabindex: -1, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-help", style: "font-size:0.8em;line-height:1;display:inline-block" }) })), (0, jsx_runtime_1.jsx)("oj-label", { id: fieldDescription.name + '_LABEL', class: "oj-sm-align-self-center oj-sm-margin-0 oj-sm-padding-0", children: (0, jsx_runtime_1.jsx)("span", { class: "wrc-label-text", children: labelText }) })] }) }), (0, jsx_runtime_1.jsx)("div", { class: 'oj-flex', children: (0, jsx_runtime_1.jsx)("div", { class: 'oj-sm-12', children: (0, jsx_runtime_1.jsxs)("span", { class: `wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? 'wrc-field-changed' : ''} ${formModel.isReadOnly(fieldDescription) ? 'wrc-align-center' : ''}`, children: [(0, jsx_runtime_1.jsx)(RestartNeededImage, { fieldDescription: fieldDescription, formModel: formModel }), (0, jsx_runtime_1.jsx)(FieldSettingsLauncher, { fieldDescription: fieldDescription, formModel: formModel }), (0, jsx_runtime_1.jsx)(IndirectField, { fieldDescription: fieldDescription, formModel: formModel })] }) }) })] }));
        }
        let clazz = formModel.isFieldNumber(fieldDescription)
            ? "cfe-form-input-integer-sm"
            : "";
        const value = formModel.getProperty(fieldDescription.name);
        const isDefaulted = formModel.isPropertyDefaulted(fieldDescription.name);
        const attrs = {
            class: clazz,
            disabled: formModel.isDisabled(fieldDescription),
            id: fieldDescription.name,
            messagesCustom: formModel.getMessages(fieldDescription.name).map((c) => {
                return { detail: c, severity: 'info', summary: c };
            }) || [],
            readonly: formModel.isReadOnly(fieldDescription),
            required: formModel.isRequired(fieldDescription),
            title: `${formModel.getHint(fieldDescription)}`,
            value,
        };
        const restoreToDefault = () => {
            formModel.setProperty(fieldDescription.name);
            setModel === null || setModel === void 0 ? void 0 : setModel(formModel.clone());
        };
        const getOjInputTextWithClass = (clazz, valueChangedHandler) => ((0, jsx_runtime_1.jsx)("oj-c-input-text", { class: attrs.class, disabled: attrs.disabled, displayOptions: { messages: "none" }, "label-edge": "none", "label-hint": fieldDescription.label, onrawValueChanged: valueChangedHandler, placeholder: "", readonly: attrs.readonly, required: attrs.required, title: attrs.title, "user-assistance-density": "reflow", value: attrs.value, "data-property": fieldDescription.name, id: attrs.id, children: (0, jsx_runtime_1.jsx)("oj-menu", { slot: "contextMenu", onojAction: restoreToDefault, children: (0, jsx_runtime_1.jsx)("oj-option", { children: (0, jsx_runtime_1.jsx)("span", { children: t['wrc-pdj-unset'].menu.label }) }) }) }));
        const widthHint = formModel.getWidth(fieldDescription);
        if (widthHint === 'lg' || widthHint === 'xxl') {
            const labelText = `${fieldDescription.label}${formModel.isRequired(fieldDescription) ? "*" : ""}`;
            let help;
            let helpSummaryText;
            if (fieldDescription.helpSummaryHTML) {
                const tempDiv = document.createElement("div");
                tempDiv.innerHTML = fieldDescription.helpSummaryHTML;
                helpSummaryText = tempDiv.innerText;
                help = { definition: helpSummaryText };
            }
            const popupRef = (0, hooks_1.useRef)(null);
            const buttonRef = (0, hooks_1.useRef)(null);
            const [tooltipText, setTooltipText] = (0, hooks_1.useState)(helpSummaryText);
            const showHelpCallback = () => {
                if (fieldDescription.detailedHelpHTML) {
                    setTooltipText(undefined);
                    popupRef.current.open(buttonRef.current);
                }
            };
            const labelGroupClass = "oj-flex-item oj-flex-bar-start oj-flex oj-sm-flex-wrap-nowrap oj-sm-align-items-center wrc-label-group";
            return ((0, jsx_runtime_1.jsxs)("div", { class: 'wrc-lg-width-field', children: [(0, jsx_runtime_1.jsx)("div", { class: 'oj-flex oj-flex-bar oj-sm-align-items-center', children: (0, jsx_runtime_1.jsxs)("div", { class: labelGroupClass, children: [helpSummaryText ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("oj-popup", { ref: popupRef, onojOpen: () => setTooltipText(undefined), onojClose: () => setTooltipText(helpSummaryText), children: (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: { __html: fieldDescription.detailedHelpHTML } }) }), (0, jsx_runtime_1.jsx)("oj-c-button", { ref: buttonRef, onojAction: showHelpCallback, chroming: "ghost", tooltip: tooltipText, "aria-label": (_f = (_e = (_d = t === null || t === void 0 ? void 0 : t["wrc-form-toolbar"]) === null || _d === void 0 ? void 0 : _d.icons) === null || _e === void 0 ? void 0 : _e.help) === null || _f === void 0 ? void 0 : _f.tooltip, class: "oj-sm-margin-0 oj-sm-padding-0", children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-help", style: "font-size:0.8em;line-height:1;display:inline-block" }) })] })) : ((0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "ghost", class: "oj-sm-margin-0 oj-sm-padding-0", style: "visibility:hidden", "aria-hidden": "true", disabled: true, tabindex: -1, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-help", style: "font-size:0.8em;line-height:1;display:inline-block" }) })), (0, jsx_runtime_1.jsx)("oj-label", { id: fieldDescription.name + '_LABEL', class: "oj-sm-align-self-center oj-sm-margin-0 oj-sm-padding-0", children: (0, jsx_runtime_1.jsx)("span", { class: "wrc-label-text", children: labelText }) })] }) }), (0, jsx_runtime_1.jsx)("div", { class: 'oj-flex', children: (0, jsx_runtime_1.jsx)("div", { class: 'oj-sm-12', children: (0, jsx_runtime_1.jsxs)("span", { class: `wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? 'wrc-field-changed' : ''} ${attrs.readonly ? 'wrc-align-center' : ''}`, children: [(0, jsx_runtime_1.jsx)(RestartNeededImage, { fieldDescription: fieldDescription, formModel: formModel }), (0, jsx_runtime_1.jsx)(FieldSettingsLauncher, { fieldDescription: fieldDescription, formModel: formModel }), !isDefaulted ? getOjInputTextWithClass(attrs.class || '', valueChangedHandler) : (0, jsx_runtime_1.jsx)(DefaultedField, {})] }) }) })] }));
        }
        else {
            return ((0, jsx_runtime_1.jsx)("div", { class: 'oj-flex oj-flex-item', children: (0, jsx_runtime_1.jsxs)("span", { class: `wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? 'wrc-field-changed' : ''} ${attrs.readonly ? 'wrc-align-center' : ''}`, children: [(0, jsx_runtime_1.jsx)(RestartNeededImage, { fieldDescription: fieldDescription, formModel: formModel }), (0, jsx_runtime_1.jsx)(FieldSettingsLauncher, { fieldDescription: fieldDescription, formModel: formModel }), !isDefaulted ? getOjInputTextWithClass(attrs.class || '', valueChangedHandler) : (0, jsx_runtime_1.jsx)(DefaultedField, {})] }) }));
        }
    };
    exports.getInputField = getInputField;
    const getTableEditor = (options) => {
        const { fieldDescription, formModel, valueChangedHandler, setModel, columns, getData, saveData, newRow, keyField, renderRow } = options;
        const getTableElement = () => {
            const clazz = "cfe-model-properties-table";
            const isReadOnly = formModel.isReadOnly(fieldDescription);
            const modelValue = formModel.getProperty(fieldDescription.name);
            const data = getData(modelValue);
            const dataProvider = new MutableArrayDataProvider(data, {
                keyAttributes: keyField,
            });
            let tableColumns = columns ? columns.slice() : [];
            if (!isReadOnly) {
                tableColumns.push({
                    className: "cfe-table-delete-cell",
                    headerClassName: "cfe-table-add-header",
                    headerTemplate: "addColumnTemplate",
                    template: "actionTemplate",
                    sortable: "disabled",
                    width: "7%",
                });
            }
            const attrs = {
                class: clazz,
                editMode: isReadOnly ? "none" : "rowEdit",
                data: dataProvider,
                columns: tableColumns,
            };
            const addButtonHandler = () => {
                data.push(newRow(data));
                dataProvider.data = data;
            };
            const addColumn = (cell) => {
                var _a, _b, _c, _d;
                return ((0, jsx_runtime_1.jsxs)("oj-c-button", { "data-testid": "add", display: "icons", chroming: "borderless", label: (_b = (_a = t["wrc-pdj-fields"]) === null || _a === void 0 ? void 0 : _a["cfe-property-list-editor"]) === null || _b === void 0 ? void 0 : _b.labels.addButtonTooltip, onojAction: addButtonHandler, children: [(0, jsx_runtime_1.jsx)("span", { slot: "endIcon", class: "oj-ux-ico-plus" }), (_d = (_c = t["wrc-pdj-fields"]) === null || _c === void 0 ? void 0 : _c["cfe-property-list-editor"]) === null || _d === void 0 ? void 0 : _d.labels.addButtonTooltip] }));
            };
            const tableRenderRow = (row) => {
                const saveDataToModel = (event) => {
                    const newValue = saveData(data);
                    event.detail.value = newValue;
                    valueChangedHandler(event);
                };
                return renderRow(row, data, dataProvider, saveDataToModel, isReadOnly, fieldDescription, formModel, setModel);
            };
            return ((0, jsx_runtime_1.jsx)("div", { id: "properties-table-container", "data-testid": "properties-table-container", class: "", children: (0, jsx_runtime_1.jsxs)("oj-table", { class: attrs.class, editMode: attrs.editMode, columns: attrs.columns, data: attrs.data, "data-property": fieldDescription.name, display: "grid", horizontalGridVisible: "enabled", layout: "fixed", children: [(0, jsx_runtime_1.jsx)("template", { slot: "rowTemplate", render: tableRenderRow }), (0, jsx_runtime_1.jsx)("template", { slot: "addColumnTemplate", render: addColumn })] }) }));
        };
        const isDefaulted = formModel.isPropertyDefaulted(fieldDescription.name);
        return ((0, jsx_runtime_1.jsx)("div", { class: "OLDcfe-form-field oj-flex oj-flex-item", children: (0, jsx_runtime_1.jsxs)("span", { class: `wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? 'wrc-field-changed' : ''}`, children: [(0, jsx_runtime_1.jsx)(RestartNeededImage, { fieldDescription: fieldDescription, formModel: formModel }), (0, jsx_runtime_1.jsx)(FieldSettingsLauncher, { fieldDescription: fieldDescription, formModel: formModel }), !isDefaulted ? getTableElement() : (0, jsx_runtime_1.jsx)(DefaultedField, {})] }) }));
    };
    const getPropertiesEditor = (fieldDescription, formModel, valueChangedHandler, setModel) => {
        var _a, _b, _c, _d, _e, _f;
        const renderRow = (row, data, dataProvider, saveDataToModel, isReadOnly, fieldDescription, formModel, setModel) => {
            var _a, _b, _c, _d;
            const updateName = (event) => {
                if (event.detail.updatedFrom === "internal") {
                    row.data["name"] = event.detail.value;
                    saveDataToModel(event);
                }
            };
            const updateValue = (event) => {
                if (event.detail.updatedFrom === "internal") {
                    row.data["value"] = event.detail.value;
                    saveDataToModel(event);
                }
            };
            const deleteRow = () => {
                const newValue = data.reduce((acc, curr) => {
                    if (curr.name !== row.data["name"]) {
                        acc[curr.name] = curr.value;
                    }
                    return acc;
                }, {});
                formModel.setProperty(fieldDescription.name, newValue);
                setModel === null || setModel === void 0 ? void 0 : setModel(formModel.clone());
            };
            return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("tr", { children: [row.mode == "navigation" && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("td", { children: row.data["name"] }), (0, jsx_runtime_1.jsx)("td", { children: row.data["value"] })] })), row.mode == "edit" && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("oj-input-text", { "data-property": fieldDescription.name, value: row.data["name"], class: "editable", onvalueChanged: updateName }) }), (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsx)("oj-input-text", { "data-property": fieldDescription.name, value: row.data["value"], class: "editable", onvalueChanged: updateValue }) })] })), !isReadOnly && ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("td", { children: (0, jsx_runtime_1.jsxs)("oj-c-button", { display: "icons", chroming: "borderless", "data-property": fieldDescription.name, label: (_b = (_a = t["wrc-pdj-fields"]) === null || _a === void 0 ? void 0 : _a["cfe-property-list-editor"]) === null || _b === void 0 ? void 0 : _b.labels.deleteButtonTooltip, onojAction: deleteRow, children: [(0, jsx_runtime_1.jsx)("span", { slot: "endIcon", class: "oj-ux-ico-trash" }), (_d = (_c = t["wrc-pdj-fields"]) === null || _c === void 0 ? void 0 : _c["cfe-property-list-editor"]) === null || _d === void 0 ? void 0 : _d.labels.deleteButtonTooltip] }) }) }))] }) }));
        };
        return getTableEditor({
            fieldDescription,
            formModel,
            valueChangedHandler,
            setModel,
            columns: [
                {
                    headerText: (_c = (_b = (_a = t["wrc-pdj-fields"]) === null || _a === void 0 ? void 0 : _a["cfe-property-list-editor"]) === null || _b === void 0 ? void 0 : _b.labels) === null || _c === void 0 ? void 0 : _c.nameHeader,
                    sortProperty: "name",
                    field: "name",
                    resizable: "enabled",
                    width: "32%"
                },
                {
                    headerText: (_f = (_e = (_d = t["wrc-pdj-fields"]) === null || _d === void 0 ? void 0 : _d["cfe-property-list-editor"]) === null || _e === void 0 ? void 0 : _e.labels) === null || _f === void 0 ? void 0 : _f.valueHeader,
                    sortProperty: "value",
                    field: "value",
                    resizable: "enabled",
                    width: "60%"
                },
            ],
            getData: (modelValue) => {
                const data = [];
                for (const key in modelValue) {
                    const indexedItem = modelValue[key];
                    data.push({ name: key, value: indexedItem });
                }
                return data;
            },
            saveData: (data) => {
                return data.reduce((acc, curr) => {
                    acc[curr.name] = curr.value;
                    return acc;
                }, {});
            },
            newRow: (data) => ({ name: "New-Property", value: "" }),
            keyField: "name",
            renderRow,
        });
    };
    exports.getPropertiesEditor = getPropertiesEditor;
    const getMultiSelectBox = (fieldDescription, formModel, changeNotifier, setModel) => {
        const isReadOnly = formModel.isReadOnly(fieldDescription);
        const selections = formModel.getSelectionsForProperty(fieldDescription);
        let available = (selections === null || selections === void 0 ? void 0 : selections.map((m) => {
            return { label: m.label, key: JSON.stringify(m.value) };
        })) || [];
        const propertyValues = formModel.getProperty(fieldDescription.name);
        let selected = (propertyValues === null || propertyValues === void 0 ? void 0 : propertyValues.map((p) => {
            const reference = p;
            const availableIndex = available.findIndex((a) => a.key === JSON.stringify(reference));
            if (availableIndex > -1) {
                available.splice(availableIndex, 1);
            }
            return { label: reference.label || "", key: JSON.stringify(reference) };
        })) || [];
        const changeHandler = (event) => {
            const newValue = event.chosen;
            const newValueJustKeys = newValue.map((m) => {
                return { key: m.key };
            });
            const selectedJustKeys = selected.map((m) => {
                return { key: m.key };
            });
            if (JSON.stringify(newValueJustKeys) !== JSON.stringify(selectedJustKeys)) {
                const newModelValue = newValue.map((m) => JSON.parse(m.key));
                formModel.setProperty(fieldDescription.name, newModelValue);
                changeNotifier();
            }
        };
        let clazz = "OLDcfe-form-field oj-flex-item oj-flex";
        const isDefaulted = formModel.isPropertyDefaulted(fieldDescription.name);
        return ((0, jsx_runtime_1.jsx)("div", { class: clazz, children: (0, jsx_runtime_1.jsxs)("span", { class: `wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? 'wrc-field-changed' : ''}`, children: [(0, jsx_runtime_1.jsx)(RestartNeededImage, { fieldDescription: fieldDescription, formModel: formModel }), (0, jsx_runtime_1.jsx)(FieldSettingsLauncher, { fieldDescription: fieldDescription, formModel: formModel }), !isDefaulted ?
                        (0, jsx_runtime_1.jsx)(multiselect_1.default, { available: available || [], chosen: selected, changeHandler: changeHandler, readonly: isReadOnly }) : (0, jsx_runtime_1.jsx)(DefaultedField, {})] }) }));
    };
    exports.getMultiSelectBox = getMultiSelectBox;
    const MoreMenu = ({ fieldDescription, formModel }) => {
        const ctx = (0, hooks_1.useContext)(resource_1.UserContext);
        const context = ctx === null || ctx === void 0 ? void 0 : ctx.context;
        const optionsSource = formModel.getOptionsSources(fieldDescription);
        let currentValue = formModel.getProperty(fieldDescription.name);
        let menuItems;
        if (optionsSource && optionsSource.length === 1) {
            const viewLabel = Translations.applyParameters(t["wrc-pdj-options-sources"].menus.more.optionsSources.view.label, [optionsSource[0].label]);
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
                const editLabel = Translations.getTranslatedString("wrc-pdj-options-sources.menus.more.optionsSources.edit.label", "" + currentValue.label);
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
            const propertyId = "";
            const tooltip = Translations.getTranslatedString("wrc-common.tooltips.more.value");
            const onSelect = (selectedValue) => {
                var _a;
                (_a = context === null || context === void 0 ? void 0 : context.routerController) === null || _a === void 0 ? void 0 : _a.navigateToAbsolutePath(selectedValue.menuItem.path);
            };
            return ((0, jsx_runtime_1.jsx)(kebab_menu_1.KebabMenu, { id: propertyId, tooltip: tooltip, menuItems: menuItems, selected: onSelect }));
        }
        return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
    };
    exports.MoreMenu = MoreMenu;
    const getSelectSingle = (fieldDescription, formModel, valueChangedHandler, setModel) => {
        let selections = [
            ...(formModel.getSelectionsForProperty(fieldDescription) || []),
        ];
        const NULL_VALUE_CONSTANT = "_NULL";
        const nullValueSelection = selections.find((s) => s.value == null);
        if (nullValueSelection) {
            nullValueSelection.value = NULL_VALUE_CONSTANT;
        }
        let value = formModel.getProperty(fieldDescription.name);
        if (value === null)
            value = NULL_VALUE_CONSTANT;
        const attrs = {
            disabled: formModel.isDisabled(fieldDescription),
            id: fieldDescription.name,
            required: formModel.isRequired(fieldDescription),
            readonly: formModel.isReadOnly(fieldDescription),
            value
        };
        const isDefaulted = formModel.isPropertyDefaulted(fieldDescription.name);
        const nullSubstitutingValueChangedHandler = (event) => {
            if (event.detail.value === NULL_VALUE_CONSTANT) {
                event.detail.value = null;
            }
            valueChangedHandler(event);
        };
        const selectionsDataProvider = new MutableArrayDataProvider(selections, { keyAttributes: "value" });
        let selectClass = 'cfe-form-select-one-md';
        let clazz = "OLDcfe-form-field oj-flex oj-flex-item";
        const resolvedValue = (selections === null || selections === void 0 ? void 0 : selections.find((s) => JSON.stringify(s.value) === JSON.stringify(attrs.value))) || attrs.value === undefined;
        const selectSingleItemTextFormatter = (opt) => {
            var _a;
            const retval = (_a = opt.data.label) !== null && _a !== void 0 ? _a : opt.data.value;
            return retval !== NULL_VALUE_CONSTANT ? retval : "";
        };
        const getOjSelectSingle = (valueChangedHandler) => {
            return !isDefaulted ?
                ((0, jsx_runtime_1.jsx)("oj-select-single", { id: attrs.id, value: attrs.value, class: selectClass, labelEdge: "none", "label-hint": fieldDescription.label, data: selectionsDataProvider, itemText: selectSingleItemTextFormatter, onvalueChanged: valueChangedHandler, required: attrs.required, disabled: attrs.disabled, readonly: attrs.readonly, "data-property": fieldDescription.name })) : (0, jsx_runtime_1.jsx)(DefaultedField, {});
        };
        return ((0, jsx_runtime_1.jsx)("div", { class: clazz, children: (0, jsx_runtime_1.jsxs)("span", { class: `wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? 'wrc-field-changed' : ''}`, children: [(0, jsx_runtime_1.jsx)(RestartNeededImage, { fieldDescription: fieldDescription, formModel: formModel }), (0, jsx_runtime_1.jsx)(FieldSettingsLauncher, { fieldDescription: fieldDescription, formModel: formModel }), (true || resolvedValue) ? (getOjSelectSingle(nullSubstitutingValueChangedHandler)) : ((0, jsx_runtime_1.jsx)("oj-input-text", { class: "cfe-form-input-text", readonly: true, "aria-label": fieldDescription.label, value: (() => {
                            var _a;
                            if (attrs.value === NULL_VALUE_CONSTANT) {
                                const nullSelection = (selections || []).find((s) => s.value === NULL_VALUE_CONSTANT);
                                return (nullSelection && nullSelection.label) || "";
                            }
                            return (((_a = attrs.value) === null || _a === void 0 ? void 0 : _a["label"]) || attrs.value);
                        })() })), (0, jsx_runtime_1.jsx)(exports.MoreMenu, { fieldDescription: fieldDescription, formModel: formModel })] }) }));
    };
    exports.getSelectSingle = getSelectSingle;
    const getFileSelector = (fieldDescription, formModel, valueChangedHandler, setModel) => {
        var _a;
        const fileInputRef = (0, hooks_1.useRef)(null);
        const chooseFileClickHandler = () => {
            fileInputRef.current.click();
        };
        const handleFileUpload = () => {
            var _a;
            const file = (_a = fileInputRef.current.files) === null || _a === void 0 ? void 0 : _a[0];
            if (file) {
                formModel.setProperty(fieldDescription.name, file);
                setModel(formModel.clone());
                fileInputRef.current.value = '';
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
            value: (_a = formModel.getProperty(fieldDescription.name)) === null || _a === void 0 ? void 0 : _a.name,
        };
        if (formModel.hasPropertyChanged(fieldDescription.name))
            attrs.clazz += " wrc-field-highlight";
        return ((0, jsx_runtime_1.jsx)("div", { class: "OLDcfe-form-field oj-flex oj-flex-item", children: (0, jsx_runtime_1.jsxs)("span", { class: `wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? "wrc-field-changed" : ""} ${formModel.isReadOnly(fieldDescription) ? 'wrc-align-center' : ''}`, children: [(0, jsx_runtime_1.jsx)(RestartNeededImage, { fieldDescription: fieldDescription, formModel: formModel }), (0, jsx_runtime_1.jsx)(FieldSettingsLauncher, { fieldDescription: fieldDescription, formModel: formModel }), (0, jsx_runtime_1.jsx)("oj-c-input-text", { class: "cfe-file-picker", disabled: true, title: "", "label-edge": "none", "label-hint": fieldDescription.label, value: attrs.value, children: (0, jsx_runtime_1.jsx)("div", { class: "" }) }), (0, jsx_runtime_1.jsx)("input", { type: "file", ref: fileInputRef, onChange: handleFileUpload, style: "display:none" }), (0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "borderless", onojAction: chooseFileClickHandler, "aria-label": "Choose file", children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-upload" }) })] }) }));
    };
    exports.getFileSelector = getFileSelector;
    const getFileSelectorForFilename = (fieldDescription, formModel, valueChangedHandler, setModel) => {
        const fileInputRef = (0, hooks_1.useRef)(null);
        const chooseFileClickHandler = () => {
            fileInputRef.current.click();
        };
        const handleFileUpload = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b, _c;
            let filename;
            if ((_a = fileInputRef.current.files) === null || _a === void 0 ? void 0 : _a[0]) {
                if (window.electron_api) {
                    const electronAPI = window.electron_api;
                    const file = (_b = fileInputRef.current.files) === null || _b === void 0 ? void 0 : _b[0];
                    filename = yield electronAPI.getFilePath(file);
                }
                else {
                    filename = (_c = fileInputRef.current.files) === null || _c === void 0 ? void 0 : _c[0].name;
                }
            }
            if (filename) {
                formModel.setProperty(fieldDescription.name, filename);
                setModel(formModel.clone());
                fileInputRef.current.value = '';
            }
        });
        const attrs = {
            clazz: "",
            disabled: formModel.isDisabled(fieldDescription),
            messages: formModel.getMessages(fieldDescription.name).map((c) => {
                return { detail: c };
            }),
            readonly: true,
            required: formModel.isRequired(fieldDescription),
            title: formModel.getTitle(fieldDescription),
            value: formModel.getProperty(fieldDescription.name),
        };
        if (formModel.hasPropertyChanged(fieldDescription.name))
            attrs.clazz += " wrc-field-highlight";
        return ((0, jsx_runtime_1.jsx)("div", { class: "OLDcfe-form-field oj-flex oj-flex-item", children: (0, jsx_runtime_1.jsxs)("span", { class: `wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? 'wrc-field-changed' : ''} ${formModel.isReadOnly(fieldDescription) ? 'wrc-align-center' : ''}`, children: [(0, jsx_runtime_1.jsx)(RestartNeededImage, { fieldDescription: fieldDescription, formModel: formModel }), (0, jsx_runtime_1.jsx)(FieldSettingsLauncher, { fieldDescription: fieldDescription, formModel: formModel }), (0, jsx_runtime_1.jsx)("img", { src: (0, url_1.requireAsset)("wrc/assets/images/wdt-options-icon-clr_24x24.png") }), (0, jsx_runtime_1.jsx)("oj-c-input-text", { class: "cfe-file-picker", disabled: true, title: "", "label-edge": "none", "label-hint": fieldDescription.label, value: attrs.value, children: (0, jsx_runtime_1.jsx)("div", { class: "" }) }), (0, jsx_runtime_1.jsx)("input", { type: "file", ref: fileInputRef, onChange: handleFileUpload, style: "display:none" }), (0, jsx_runtime_1.jsx)("img", { src: (0, url_1.requireAsset)("wrc/assets/images/wdt-options-icon-clr_24x24.png") }), (0, jsx_runtime_1.jsx)("oj-c-button", { chroming: 'borderless', onojAction: chooseFileClickHandler, "aria-label": "Choose file", children: (0, jsx_runtime_1.jsx)("span", { slot: 'startIcon', class: 'oj-ux-ico-upload' }) })] }) }));
    };
    exports.getFileSelectorForFilename = getFileSelectorForFilename;
    const getFileSelectorForNewFile = (fieldDescription, formModel, valueChangedHandler, setModel) => {
        const fileInputRef = (0, hooks_1.useRef)(null);
        const chooseFileClickHandler = () => __awaiter(void 0, void 0, void 0, function* () {
            if (window.electron_api) {
                const electronAPI = window.electron_api;
                const file = yield electronAPI.getSaveAs({ filepath: formModel.getProperty(fieldDescription.name) || '' });
                formModel.setProperty(fieldDescription.name, file.filePath);
                setModel(formModel.clone());
            }
        });
        const attrs = {
            disabled: formModel.isDisabled(fieldDescription),
            required: formModel.isRequired(fieldDescription),
            title: formModel.getTitle(fieldDescription),
            value: formModel.getProperty(fieldDescription.name) || ''
        };
        return ((0, jsx_runtime_1.jsx)("div", { class: "OLDcfe-form-field oj-flex oj-flex-item", children: (0, jsx_runtime_1.jsxs)("span", { class: `wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? 'wrc-field-changed' : ''} ${formModel.isReadOnly(fieldDescription) ? 'wrc-align-center' : ''}`, children: [(0, jsx_runtime_1.jsx)(RestartNeededImage, { fieldDescription: fieldDescription, formModel: formModel }), (0, jsx_runtime_1.jsx)(FieldSettingsLauncher, { fieldDescription: fieldDescription, formModel: formModel }), (0, jsx_runtime_1.jsx)("oj-input-text", Object.assign({ "data-property": fieldDescription.name, onrawValueChanged: valueChangedHandler }, attrs)), window.electron_api ? ((0, jsx_runtime_1.jsx)("oj-c-button", { id: "p", chroming: "borderless", onojAction: chooseFileClickHandler, "aria-label": "Choose directory", children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", children: (0, jsx_runtime_1.jsx)("img", { src: (0, url_1.requireAsset)("wrc/assets/images/choose-directory-icon-blk_24x24.png") }) }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] }) }));
    };
    exports.getFileSelectorForNewFile = getFileSelectorForNewFile;
    const getSwitch = (fieldDescription, formModel, valueChangedHandler, setModel) => {
        const attrs = {
            disabled: formModel.isDisabled(fieldDescription),
            messages: formModel.getMessages(fieldDescription.name).map((c) => {
                return { detail: c, severity: 3, summary: "" };
            }),
            readonly: formModel.isReadOnly(fieldDescription),
            value: formModel.getProperty(fieldDescription.name),
        };
        let clazz = "cfe-form-switch";
        const isDefaulted = formModel.isPropertyDefaulted(fieldDescription.name);
        const getOjSwitch = (valueChangedHandler) => !isDefaulted ? ((0, jsx_runtime_1.jsx)("oj-switch", { id: fieldDescription.name, class: clazz, disabled: attrs.disabled || attrs.readonly, displayOptions: { messages: "none" }, "label-edge": "none", "label-hint": fieldDescription.label, onvalueChanged: valueChangedHandler, value: attrs.value == true, "data-property": fieldDescription.name, children: (0, jsx_runtime_1.jsx)("div", { class: "" }) })) : ((0, jsx_runtime_1.jsx)(DefaultedField, {}));
        return ((0, jsx_runtime_1.jsx)("div", { class: "OLDcfe-form-field oj-flex oj-flex-item", children: (0, jsx_runtime_1.jsxs)("span", { class: `wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) && !formModel.isReadOnly(fieldDescription) && !formModel.isDisabled(fieldDescription) ? 'wrc-field-changed' : ''}`, children: [(0, jsx_runtime_1.jsx)(RestartNeededImage, { fieldDescription: fieldDescription, formModel: formModel }), (0, jsx_runtime_1.jsx)(FieldSettingsLauncher, { fieldDescription: fieldDescription, formModel: formModel }), typeof attrs.value === "boolean" || typeof attrs.value === 'undefined' ? (getOjSwitch(valueChangedHandler)) : ((0, jsx_runtime_1.jsx)("oj-input-text", { class: "cfe-form-input-text", readonly: true, "aria-label": fieldDescription.label, value: attrs.value }))] }) }));
    };
    exports.getSwitch = getSwitch;
    const getPolicyExpression = (fieldDescription, formModel, valueChangedHandler, setModel) => ((0, jsx_runtime_1.jsx)(policy_expression_1.default, { fieldDescription: fieldDescription, formModel: formModel, valueChangedHandler: valueChangedHandler, setModel: setModel }));
    exports.getPolicyExpression = getPolicyExpression;
});
//# sourceMappingURL=formfields.js.map