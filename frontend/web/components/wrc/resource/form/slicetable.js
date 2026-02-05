define(["require", "exports", "preact/jsx-runtime", "preact", "wrc/resource/table/tablebuilder"], function (require, exports, jsx_runtime_1, preact_1, tablebuilder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const SliceTable = ({ tableModel, pageContext, onSelectionChanged }) => {
        if (tableModel) {
            const tableBuilder = new tablebuilder_1.TableBuilder(tableModel, pageContext, true, onSelectionChanged);
            return tableBuilder.getHTML();
        }
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}));
    };
    const _UNUSED = preact_1.h;
    exports.default = SliceTable;
});
//# sourceMappingURL=slicetable.js.map