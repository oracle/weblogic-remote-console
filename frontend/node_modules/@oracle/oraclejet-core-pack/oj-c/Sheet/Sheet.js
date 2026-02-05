define(["require", "exports", "preact/jsx-runtime", "@oracle/oraclejet-preact/UNSAFE_Sheet"], function (require, exports, jsx_runtime_1, UNSAFE_Sheet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Sheet = Sheet;
    function Sheet({ isOpen, children, onClose, initialFocus }) {
        return ((0, jsx_runtime_1.jsx)(UNSAFE_Sheet_1.Sheet, { isOpen: isOpen, onClose: onClose, initialFocus: initialFocus, children: children }));
    }
});
