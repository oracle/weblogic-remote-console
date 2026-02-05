define(["require", "exports", "preact/jsx-runtime", "ojL10n!wrc/shared/resources/nls/frontend", "preact/hooks", "../resource", "ojs/ojcollapsible"], function (require, exports, jsx_runtime_1, t, hooks_1, resource_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormIntro = void 0;
    const CHECKBOX_KEY = "showAdvanced";
    const FormIntro = ({ formModel, setModel }) => {
        const ctx = (0, hooks_1.useContext)(resource_1.UserContext);
        const handleShowAdvanced = (event) => {
            formModel.showAdvanced = event.detail.value.length > 0;
            if (setModel) {
                setModel(formModel.clone());
            }
        };
        const checkboxValue = formModel.showAdvanced ? [CHECKBOX_KEY] : [];
        const [isDark, setIsDark] = (0, hooks_1.useState)(false);
        (0, hooks_1.useEffect)(() => {
            const target = document.getElementById("globalBody");
            const compute = () => setIsDark(!!target && target.classList.contains("oj-color-invert"));
            compute();
            const observer = new MutationObserver(compute);
            if (target) {
                observer.observe(target, { attributes: true, attributeFilter: ["class"] });
            }
            return () => observer.disconnect();
        }, []);
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [formModel.showInstructions ? ((0, jsx_runtime_1.jsx)("div", { id: "intro", class: `cfe-table-form-instructions wrc-form-intro ${isDark ? "oj-bg-neutral-180" : "oj-bg-info-20"}`, dangerouslySetInnerHTML: { __html: formModel.getIntroductionHTML() } })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), (0, jsx_runtime_1.jsx)("div", { "aria-labelledby": "intro-collapsible", class: "cfe-table-form-content-header oj-flex oj-sm-flex-direction-column oj-sm-flex-wrap-nowrap", children: (0, jsx_runtime_1.jsx)("div", { id: "show-advanced-fields-container", class: "oj-flex oj-sm-flex-items-initial oj-sm-justify-content-flex-end oj-flex-items-pad", children: (0, jsx_runtime_1.jsx)("div", { id: "show-advanced-fields-checkboxset", class: "oj-flex-item", children: (0, jsx_runtime_1.jsx)("oj-checkboxset", { id: "show-advanced-fields", style: formModel.hasAdvancedProperties() === false
                                    ? { visibility: "hidden" }
                                    : {}, value: checkboxValue, onvalueChanged: handleShowAdvanced, children: (0, jsx_runtime_1.jsx)("oj-option", { accesskey: "[", value: CHECKBOX_KEY, children: t["wrc-form"].checkboxes.showAdvancedFields.label }) }) }) }) })] }));
    };
    exports.FormIntro = FormIntro;
});
//# sourceMappingURL=formintro.js.map