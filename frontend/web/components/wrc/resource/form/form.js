define(["require", "exports", "preact/jsx-runtime", "preact", "preact/hooks", "./formfields", "oj-c/collapsible"], function (require, exports, jsx_runtime_1, preact_1, hooks_1, formfields_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Form = ({ formModel, setModel }) => {
        const [isDark, setIsDark] = (0, hooks_1.useState)(false);
        const getRootEl = () => (document.getElementById('globalBody') ||
            document.getElementById('appContainer') ||
            document.body);
        const checkDarkMode = () => {
            var _a;
            const root = getRootEl();
            return !!((_a = root === null || root === void 0 ? void 0 : root.classList) === null || _a === void 0 ? void 0 : _a.contains('oj-color-invert'));
        };
        (0, hooks_1.useEffect)(() => {
            setIsDark(checkDarkMode());
            const onDarkMode = (e) => {
                if (e && e.detail && typeof e.detail.enabled === 'boolean') {
                    setIsDark(!!e.detail.enabled);
                }
                else {
                    setIsDark(checkDarkMode());
                }
            };
            window.addEventListener('wrc:darkMode', onDarkMode);
            return () => window.removeEventListener('wrc:darkMode', onDarkMode);
        }, []);
        const suppressForm = formModel.isCreatableOptionalSingleton() && formModel.isDataMissing();
        if (suppressForm) {
            return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}));
        }
        const valueChangedHandler = (e) => {
            var _a, _b, _c;
            const updatedFrom = (_a = e === null || e === void 0 ? void 0 : e.detail) === null || _a === void 0 ? void 0 : _a.updatedFrom;
            if (updatedFrom && updatedFrom !== "internal") {
                return;
            }
            const newValue = e.detail.value;
            const propertyId = (_b = e.currentTarget) === null || _b === void 0 ? void 0 : _b.getAttribute("data-property");
            if (propertyId) {
                const currentValue = formModel.getProperty(propertyId);
                const nextValue = (_c = newValue === null || newValue === void 0 ? void 0 : newValue.modelToken) !== null && _c !== void 0 ? _c : newValue;
                const numericallyEqual = (typeof currentValue === "number" && typeof nextValue === "string" && Number(nextValue) === currentValue) ||
                    (typeof currentValue === "string" && typeof nextValue === "number" && String(nextValue) === currentValue);
                const toBool = (v) => typeof v === "boolean"
                    ? v
                    : typeof v === "string"
                        ? (v.toLowerCase() === "true" ? true : (v.toLowerCase() === "false" ? false : v))
                        : v;
                const booleanEqual = (typeof currentValue === "boolean" && typeof nextValue === "string" && typeof toBool(nextValue) === "boolean" && toBool(nextValue) === currentValue) ||
                    (typeof currentValue === "string" && typeof nextValue === "boolean" && typeof toBool(currentValue) === "boolean" && toBool(currentValue) === nextValue);
                const nullishEmptyEqual = ((currentValue === null || currentValue === undefined) && nextValue === "") ||
                    ((nextValue === null || nextValue === undefined) && currentValue === "");
                const deeplyEqual = JSON.stringify(nextValue) === JSON.stringify(currentValue);
                if (booleanEqual || numericallyEqual || nullishEmptyEqual || deeplyEqual) {
                    return;
                }
                if (newValue === null || newValue === void 0 ? void 0 : newValue.modelToken) {
                    formModel.setPropertyAsTokenValue(propertyId, newValue.modelToken);
                }
                else {
                    formModel.setProperty(propertyId, nextValue);
                }
                formModel.getPropertyList().forEach((element) => {
                    const fieldDescription = formModel.getPropertyDescription(element);
                    if (fieldDescription) {
                    }
                });
                if (setModel) {
                    setModel(formModel.clone());
                }
            }
        };
        const textAreaValueChangedHandler = (e) => {
            var _a, _b;
            const updatedFrom = (_a = e === null || e === void 0 ? void 0 : e.detail) === null || _a === void 0 ? void 0 : _a.updatedFrom;
            if (updatedFrom && updatedFrom !== "internal") {
                return;
            }
            const newValue = e.detail.value.split('\n');
            const propertyId = (_b = e.currentTarget) === null || _b === void 0 ? void 0 : _b.getAttribute("data-property");
            if (propertyId) {
                const currentValue = formModel.getProperty(propertyId);
                if (JSON.stringify(newValue) === JSON.stringify(currentValue)) {
                    return;
                }
                formModel.setProperty(propertyId, newValue);
                if (setModel) {
                    setModel(formModel.clone());
                }
            }
        };
        const renderField = (property) => {
            var _a, _b;
            const fieldDescription = formModel.getPropertyDescription(property);
            if (!fieldDescription)
                return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
            let valueNode;
            if (formModel.isFieldSelect(fieldDescription)) {
                valueNode = (0, formfields_1.getSelectSingle)(fieldDescription, formModel, valueChangedHandler, setModel);
            }
            else if (formModel.isFieldMultiSelect(fieldDescription)) {
                valueNode = (0, formfields_1.getMultiSelectBox)(fieldDescription, formModel, () => {
                    if (setModel)
                        setModel(formModel.clone());
                }, setModel);
            }
            else if (formModel.isFieldBoolean(fieldDescription)) {
                valueNode = (0, formfields_1.getSwitch)(fieldDescription, formModel, valueChangedHandler, setModel);
            }
            else if (formModel.isFieldProperties(fieldDescription)) {
                valueNode = (0, formfields_1.getPropertiesEditor)(fieldDescription, formModel, valueChangedHandler, setModel);
            }
            else if (formModel.isFieldFileContents(fieldDescription)) {
                valueNode = (0, formfields_1.getFileSelector)(fieldDescription, formModel, valueChangedHandler, setModel);
            }
            else if (formModel.isFieldFilename(fieldDescription)) {
                valueNode = (0, formfields_1.getFileSelectorForFilename)(fieldDescription, formModel, valueChangedHandler, setModel);
            }
            else if (formModel.isFieldNewFilename(fieldDescription)) {
                valueNode = (0, formfields_1.getFileSelectorForNewFile)(fieldDescription, formModel, valueChangedHandler, setModel);
            }
            else if (formModel.isPolicyExpression(fieldDescription)) {
                valueNode = (0, formfields_1.getPolicyExpression)(fieldDescription, formModel, valueChangedHandler, setModel);
            }
            else if (formModel.isFieldArray(fieldDescription)) {
                valueNode = (0, formfields_1.getArrayInputField)(fieldDescription, formModel, textAreaValueChangedHandler, setModel);
            }
            else if (formModel.isSecretField(fieldDescription)) {
                valueNode = (0, formfields_1.getSecretInputField)(fieldDescription, formModel, valueChangedHandler, setModel);
            }
            else {
                valueNode = (0, formfields_1.getInputField)(fieldDescription, formModel, valueChangedHandler, setModel);
            }
            const isFullWidthField = (_b = (_a = valueNode === null || valueNode === void 0 ? void 0 : valueNode.props) === null || _a === void 0 ? void 0 : _a.class) === null || _b === void 0 ? void 0 : _b.includes('wrc-lg-width-field');
            if (isFullWidthField) {
                return valueNode;
            }
            const labelNode = (0, formfields_1.getLabel)(fieldDescription, formModel);
            return ((0, jsx_runtime_1.jsx)("div", { class: `wrc-field oj-flex-item oj-sm-padding-2x-bottom ${isSingle ? 'oj-sm-12' : 'oj-sm-6'}`, children: (0, jsx_runtime_1.jsxs)("div", { class: labelNode ? "wrc-c-row" : "", children: [labelNode ? (0, jsx_runtime_1.jsx)("div", { class: "wrc-c-label", children: labelNode }) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}), (0, jsx_runtime_1.jsx)("div", { class: "wrc-c-value", children: valueNode })] }) }));
        };
        const renderProperties = (properties) => {
            return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: properties.map((property) => renderField(property)) }));
        };
        const renderSection = (section) => {
            const propsNodes = (section.properties || []).map((p) => renderField(p.name));
            const childNodes = (section.sections || [])
                .map((s) => renderSection(s))
                .filter((n) => !!n);
            if (!section.title) {
                if (propsNodes.length === 0 && childNodes.length === 0)
                    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
                return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [section.introductionHTML ? ((0, jsx_runtime_1.jsx)("div", { class: "wrc-section-intro oj-bg-info-20", dangerouslySetInnerHTML: { __html: section.introductionHTML } })) : null, propsNodes, childNodes] }));
            }
            if (propsNodes.length === 0 && childNodes.length === 0)
                return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
            if (propsNodes.length === 0)
                return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: childNodes });
            return ((0, jsx_runtime_1.jsxs)("oj-c-collapsible", { expanded: true, children: [(0, jsx_runtime_1.jsx)("div", { slot: "header", class: `wrc-section-header wrc-label-text ${isDark ? 'oj-color-invert oj-c-colorscheme-dependent oj-bg-neutral-180' : 'oj-bg-neutral-30'}`, children: section.title }), (0, jsx_runtime_1.jsx)("div", { class: "oj-sm-padding-2x-top" }), section.introductionHTML ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { class: "wrc-section-intro oj-bg-info-20", dangerouslySetInnerHTML: { __html: section.introductionHTML } }), (0, jsx_runtime_1.jsx)("div", { class: "oj-sm-padding-2x-bottom" })] })) : null, (0, jsx_runtime_1.jsxs)("div", { class: `wrc-form-grid oj-flex oj-sm-flex-wrap-wrap ${isSingle ? 'wrc-single-col' : 'wrc-two-col'}`, style: { ['--wrc-c-label-width']: (isSingle ? '4%' : '36%'), width: '100%' }, children: [propsNodes, childNodes] })] }));
        };
        const columnsVal = formModel.getNumberOfColumns();
        const isSingle = columnsVal === 1;
        return ((0, jsx_runtime_1.jsx)("div", { id: "form-container", class: "oj-flex-item", children: (0, jsx_runtime_1.jsx)("div", { class: `wrc-form-grid oj-flex oj-sm-flex-wrap-wrap ${isSingle ? 'wrc-single-col' : 'wrc-two-col'}`, style: { ['--wrc-c-label-width']: (isSingle ? '4%' : '36%'), width: '100%' }, children: formModel.hasSections() ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [formModel.getVisibleSections().map((s) => renderSection(s)), renderProperties(formModel.getTopLevelPropertyNames())] })) : renderProperties(formModel.getPropertyList()) }) }));
    };
    const UNUSED = preact_1.h;
    exports.default = Form;
});
//# sourceMappingURL=form.js.map