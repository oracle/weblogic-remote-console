define(["require", "exports", "preact/jsx-runtime", "ojL10n!wrc/shared/resources/nls/frontend"], function (require, exports, jsx_runtime_1, t) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HelpTable = void 0;
    const HelpHeader = ({ nameText, descriptionText, }) => {
        return ((0, jsx_runtime_1.jsx)("thead", { class: "oj-table-header", children: (0, jsx_runtime_1.jsxs)("tr", { class: "oj-table-header-row", children: [(0, jsx_runtime_1.jsx)("th", { class: "oj-table-column-header-cell oj-table-header-cell-wrap-text", title: nameText, id: "help-table:_hdrCol0", children: (0, jsx_runtime_1.jsx)("div", { class: "oj-table-column-header", children: (0, jsx_runtime_1.jsx)("div", { class: "oj-table-column-header-text", children: nameText }) }) }), (0, jsx_runtime_1.jsx)("th", { class: "oj-table-column-header-cell oj-table-header-cell-wrap-text", title: descriptionText, id: "help-table:_hdrCol1", children: (0, jsx_runtime_1.jsx)("div", { class: "oj-table-column-header", children: (0, jsx_runtime_1.jsx)("div", { class: "oj-table-column-header-text", children: descriptionText }) }) })] }) }));
    };
    const HelpFooter = ({ tableDef }) => {
        const { helpTopics } = tableDef;
        const expandHelpTopics = () => {
            if (helpTopics && helpTopics.length > 0) {
                return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { dangerouslySetInnerHTML: {
                                __html: t["wrc-help-form"].labels.relatedTopics.value,
                            } }), (0, jsx_runtime_1.jsx)("ul", { children: helpTopics.map((helpTopic) => ((0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsx)("a", { href: "#", "data-external-help-link": helpTopic.href, children: helpTopic.label }) }))) })] }));
            }
            else {
                return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
            }
        };
        return ((0, jsx_runtime_1.jsx)("tfoot", { class: "oj-table-footer", children: (0, jsx_runtime_1.jsx)("tr", { class: "oj-table-footer-row", children: (0, jsx_runtime_1.jsx)("td", { colspan: 2, children: (0, jsx_runtime_1.jsx)("div", { class: "cfe-help-table-footer", children: expandHelpTopics() }) }) }) }));
    };
    const ExternalHelpDetail = ({ externalHelp, }) => {
        return externalHelp ? ((0, jsx_runtime_1.jsxs)("p", { children: [externalHelp.introLabel, (0, jsx_runtime_1.jsx)("br", {}), (0, jsx_runtime_1.jsx)("code", { children: externalHelp.href ? ((0, jsx_runtime_1.jsx)("a", { href: "#", "data-external-help-link": externalHelp.href, children: externalHelp.label })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})) })] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}));
    };
    const HelpRow = ({ rowData }) => {
        return ((0, jsx_runtime_1.jsxs)("tr", { class: "oj-table-body-row", children: [(0, jsx_runtime_1.jsx)("td", { id: "help-table:2420395_0", class: "oj-table-data-cell oj-form-control-inherit", children: rowData.helpLabel }), (0, jsx_runtime_1.jsxs)("td", { id: "help-table:2420395_1", class: "oj-table-data-cell oj-form-control-inherit", children: [(0, jsx_runtime_1.jsx)("span", { dangerouslySetInnerHTML: { __html: rowData.detailedHelpHTML || '' } }), (0, jsx_runtime_1.jsx)(ExternalHelpDetail, { externalHelp: rowData.externalHelp })] })] }));
    };
    const HelpTable = ({ tableDefinition }) => {
        var _a;
        return ((0, jsx_runtime_1.jsxs)("table", { id: "help-table", class: "oj-table-element oj-component-initnode", "aria-labelledby": "help-table", "x-ms-format-detection": "none", children: [(0, jsx_runtime_1.jsxs)("colgroup", { class: "oj-table-colgroup", children: [(0, jsx_runtime_1.jsx)("col", { class: "oj-table-col" }), (0, jsx_runtime_1.jsx)("col", { class: "oj-table-col" })] }), (0, jsx_runtime_1.jsx)(HelpHeader, { nameText: tableDefinition.columns[0].header, descriptionText: (_a = tableDefinition.columns[1]) === null || _a === void 0 ? void 0 : _a.header }), (0, jsx_runtime_1.jsx)("tbody", { class: "oj-table-body", children: tableDefinition.rows.map((row) => ((0, jsx_runtime_1.jsx)(HelpRow, { rowData: row }))) }), (0, jsx_runtime_1.jsx)(HelpFooter, { tableDef: tableDefinition })] }));
    };
    exports.HelpTable = HelpTable;
});
//# sourceMappingURL=help-table.js.map