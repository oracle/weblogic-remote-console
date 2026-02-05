define(["require", "exports", "preact/jsx-runtime", "@oracle/oraclejet-preact/UNSAFE_Dropdown", "preact/hooks"], function (require, exports, jsx_runtime_1, UNSAFE_Dropdown_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Dropdown = Dropdown;
    function Dropdown({ anchorRef, isOpen, children, onClose, initialFocus, onPosition }) {
        const onPositionCallback = (0, hooks_1.useCallback)((data) => {
            onPosition?.({ placement: data.placement });
        }, [onPosition]);
        return ((0, jsx_runtime_1.jsx)(UNSAFE_Dropdown_1.Dropdown, { anchorRef: anchorRef, isOpen: isOpen, onClose: onClose, initialFocus: initialFocus, onPosition: onPositionCallback, children: children }));
    }
});
