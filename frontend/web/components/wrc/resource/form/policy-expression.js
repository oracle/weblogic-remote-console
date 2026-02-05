define(["require", "exports", "preact/jsx-runtime", "preact/hooks", "ojL10n!wrc/shared/resources/nls/frontend", "../../shared/typedefs/rdj", "ojs/ojmutablearraydataprovider", "oj-c/button", "ojs/ojselectsingle", "ojs/ojformlayout", "ojs/ojlabel", "ojs/ojtable"], function (require, exports, jsx_runtime_1, hooks_1, t, rdj_1, MutableArrayDataProvider) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const PolicyExpression = ({ fieldDescription, formModel, valueChangedHandler }) => {
        var _a, _b, _c, _d, _e, _f;
        const name = fieldDescription.name;
        const rawValue = formModel.getProperty(name);
        const disabled = formModel.isDisabled(fieldDescription);
        const readonly = formModel.isReadOnly(fieldDescription);
        const required = formModel.isRequired(fieldDescription);
        const title = formModel.getTitle(fieldDescription);
        const expression = rawValue && typeof rawValue === "object" && rawValue.stringExpression !== undefined
            ? rawValue
            : undefined;
        const stringExpression = (_a = expression === null || expression === void 0 ? void 0 : expression.stringExpression) !== null && _a !== void 0 ? _a : (typeof rawValue === "string" ? rawValue : "");
        const predicateOptions = (_b = expression === null || expression === void 0 ? void 0 : expression.supportedPredicates) !== null && _b !== void 0 ? _b : [];
        const [selectedPredicateClass, setSelectedPredicateClass] = (0, hooks_1.useState)(undefined);
        const selectionOptions = (predicateOptions || []).map((p) => ({ label: p.displayName, value: p.className }));
        const selectionDataProvider = new MutableArrayDataProvider(selectionOptions, { keyAttributes: "value" });
        const itemText = (opt) => { var _a; return (_a = opt.data.label) !== null && _a !== void 0 ? _a : opt.data.value; };
        const selectedPredicate = predicateOptions.find((p) => p.className === selectedPredicateClass);
        const [currentParsedExpression, setCurrentParsedExpression] = (0, hooks_1.useState)(expression === null || expression === void 0 ? void 0 : expression.parsedExpression);
        (0, hooks_1.useEffect)(() => { setCurrentParsedExpression(expression === null || expression === void 0 ? void 0 : expression.parsedExpression); }, [expression === null || expression === void 0 ? void 0 : expression.parsedExpression]);
        const onPredicateChanged = (event) => {
            const val = event.detail.value;
            setSelectedPredicateClass(val || undefined);
        };
        const predicateDialogRef = (0, hooks_1.useRef)(null);
        const openPredicateDialog = (event) => {
            if (event === null || event === void 0 ? void 0 : event.preventDefault)
                event.preventDefault();
            const dlg = predicateDialogRef.current;
            if (dlg && typeof dlg.open === "function") {
                dlg.open();
            }
        };
        const closePredicateDialog = () => {
            const dlg = predicateDialogRef.current;
            if (dlg && typeof dlg.close === "function") {
                dlg.close();
            }
        };
        const createParsedExpressionNode = (name, values = [], predicateType = rdj_1.ParsedExpressionType.Predicate) => {
            const node = { name, type: predicateType };
            if (values.length > 0)
                node.arguments = values;
            return node;
        };
        const supportedPredsButton = !readonly ? ((0, jsx_runtime_1.jsx)("oj-c-button", { class: "oj-sm-margin-top", chroming: "outlined", onojAction: openPredicateDialog, disabled: !expression || ((_d = (_c = expression.supportedPredicates) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) === 0, label: "Preds" })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}));
        const policyResourceId = (expression === null || expression === void 0 ? void 0 : expression.resourceId) ? ((0, jsx_runtime_1.jsx)("oj-text-area", { class: "cfe-form-input-textarea", "resize-behavior": "vertical", "label-edge": "none", value: expression === null || expression === void 0 ? void 0 : expression.resourceId, readonly: true, disabled: true, title: "Resource Id" })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}));
        const simpleClassName = (fqcn) => {
            if (!fqcn)
                return "";
            const noPkg = (fqcn.split(".").pop() || fqcn);
            return (noPkg.split("$").pop() || noPkg);
        };
        const buildTreeRows = (root) => {
            const rows = [];
            let idCounter = 0;
            const walk = (node, depth) => {
                var _a, _b;
                if (!node)
                    return;
                rows.push({
                    id: String(idCounter++),
                    depth,
                    type: String((_a = node.type) !== null && _a !== void 0 ? _a : "node"),
                    name: simpleClassName((_b = node.name) !== null && _b !== void 0 ? _b : ""),
                    args: Array.isArray(node.arguments) && node.arguments.length ? node.arguments.join(", ") : ""
                });
                const children = node.children || [];
                children.forEach((child) => walk(child, depth + 1));
            };
            if (root)
                walk(root, 0);
            return rows;
        };
        const treeRows = buildTreeRows(currentParsedExpression);
        const treeDataProvider = new MutableArrayDataProvider(treeRows, { keyAttributes: "id" });
        const treeColumns = [
            { headerText: "#", field: "depth", width: "3rem", resizable: "enabled" },
            { headerText: "Type", field: "type", width: "6rem", resizable: "enabled" },
            { headerText: "Name", field: "name", width: "10rem", resizable: "enabled" },
            { headerText: "Args", field: "args", resizable: "enabled" }
        ];
        const policyParsedTable = expression ? ((0, jsx_runtime_1.jsx)("oj-table", { class: "oj-sm-margin-top", style: "min-width:23rem", "aria-label": "Parsed Expression Tree", data: treeDataProvider, columns: treeColumns })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}));
        const handleRawValueChanged = (e) => {
            var _a;
            const nextString = e.detail.value;
            const current = expression;
            if ((current === null || current === void 0 ? void 0 : current.stringExpression) === nextString)
                return;
            const nextValue = {
                resourceId: (_a = current === null || current === void 0 ? void 0 : current.resourceId) !== null && _a !== void 0 ? _a : "",
                stringExpression: nextString
            };
            e.detail.value = nextValue;
            valueChangedHandler(e);
        };
        const policyStringEditor = ((0, jsx_runtime_1.jsx)("oj-text-area", { class: `cfe-form-input-textarea ${formModel.hasPropertyChanged(name) && !readonly && !disabled ? 'wrc-field-highlight' : ''}`, "resize-behavior": "vertical", rows: 10, "label-edge": "none", value: stringExpression, title: title, disabled: disabled, readonly: readonly, required: required, onrawValueChanged: handleRawValueChanged, "data-property": name }));
        return ((0, jsx_runtime_1.jsx)("div", { class: "oj-flex oj-flex-item", children: (0, jsx_runtime_1.jsxs)("span", { class: `wrc-value-group ${formModel.hasPropertyChanged(fieldDescription.name) ? 'wrc-field-highlight' : ''}`, children: [supportedPredsButton, policyStringEditor, policyResourceId, policyParsedTable, (0, jsx_runtime_1.jsxs)("oj-dialog", { ref: predicateDialogRef, id: `${name}-predicates-dialog`, "dialog-title": "Supported Predicates", "initial-visibility": "hide", "cancel-behavior": "icon", children: [(0, jsx_runtime_1.jsxs)("div", { slot: "body", children: [(0, jsx_runtime_1.jsxs)("oj-form-layout", { "label-edge": "start", "label-width": "35%", children: [(0, jsx_runtime_1.jsx)("oj-label", { slot: "label", for: `${name}-predicate-select`, children: (0, jsx_runtime_1.jsx)("span", { children: "Predicate:" }) }), (0, jsx_runtime_1.jsx)("oj-select-single", { id: `${name}-predicate-select`, value: selectedPredicateClass, data: selectionDataProvider, itemText: itemText, onvalueChanged: onPredicateChanged })] }), (0, jsx_runtime_1.jsx)("div", { class: "oj-sm-margin-top", children: (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: {
                                                __html: (selectedPredicate === null || selectedPredicate === void 0 ? void 0 : selectedPredicate.descriptionHTML) || ""
                                            } }) }), ((_f = (_e = selectedPredicate === null || selectedPredicate === void 0 ? void 0 : selectedPredicate.arguments) === null || _e === void 0 ? void 0 : _e.length) !== null && _f !== void 0 ? _f : 0) > 0 ? ((0, jsx_runtime_1.jsxs)("div", { class: "oj-sm-margin-top", children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("strong", { children: "Arguments" }) }), (0, jsx_runtime_1.jsx)("ul", { class: "oj-typography-body-sm oj-sm-padding-start", children: selectedPredicate.arguments.map((arg) => ((0, jsx_runtime_1.jsxs)("li", { children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("strong", { children: arg.displayName }) }), (0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: {
                                                                __html: arg.descriptionHTML || ""
                                                            } })] }))) })] })) : null] }), (0, jsx_runtime_1.jsx)("div", { slot: "footer", children: (0, jsx_runtime_1.jsx)("oj-c-button", { label: t["wrc-common"].buttons.ok.label, onojAction: closePredicateDialog, children: (0, jsx_runtime_1.jsx)("span", { class: "button-label", children: t["wrc-common"].buttons.ok.label }) }) })] })] }) }));
    };
    exports.default = PolicyExpression;
});
//# sourceMappingURL=policy-expression.js.map