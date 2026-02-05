define(["require", "exports", "preact/jsx-runtime"], function (require, exports, jsx_runtime_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRowContext = getRowContext;
    exports.getPreactRowKey = getPreactRowKey;
    exports.getPreactCellRenderer = getPreactCellRenderer;
    exports.getPreactHeaderRenderer = getPreactHeaderRenderer;
    exports.getPreactFooterRenderer = getPreactFooterRenderer;
    exports.getPreactNoDataRenderer = getPreactNoDataRenderer;
    exports.tableCellSelectorRenderer = tableCellSelectorRenderer;
    exports.tableHeaderSelectorRenderer = tableHeaderSelectorRenderer;
    function getRowContext(context) {
        return { item: context.data };
    }
    function getPreactRowKey(data) {
        return data.metadata.key;
    }
    function getPreactCellRenderer(cellTemplate, field) {
        return (context) => {
            const templateContext = {
                item: context.rowData,
                columnKey: context.columnKey,
                data: field != null ? context.rowData.data[field] : undefined,
                isTabbable: context.isTabbable
            };
            if (cellTemplate != null) {
                return cellTemplate(templateContext);
            }
            return templateContext.data != null ? String(templateContext.data) : undefined;
        };
    }
    function getPreactHeaderRenderer(headerTemplate) {
        if (headerTemplate != null) {
            return (context) => {
                const templateContext = {
                    key: context.key,
                    headerText: context.headerText,
                    isTabbable: context.isTabbable
                };
                return headerTemplate(templateContext);
            };
        }
        return undefined;
    }
    function getPreactFooterRenderer(footerTemplate) {
        if (footerTemplate != null) {
            return (context) => {
                const templateContext = {
                    key: context.key,
                    footerText: context.footerText,
                    isTabbable: context.isTabbable
                };
                return footerTemplate(templateContext);
            };
        }
        return undefined;
    }
    function getPreactNoDataRenderer(noData) {
        if (noData != null) {
            return (context) => {
                return noData({ isTabbable: context.isTabbable });
            };
        }
        return undefined;
    }
    function tableCellSelectorRenderer(context) {
        return context.selector != null ? context.selector() : undefined;
    }
    function tableHeaderSelectorRenderer(context) {
        return context.selector != null ? ((0, jsx_runtime_1.jsx)("div", { "data-oj-table-selector": 'all', children: context.selector() })) : undefined;
    }
});
