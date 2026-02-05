define(["require", "exports", "preact/hooks", "./SelectionContext"], function (require, exports, hooks_1, SelectionContext_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useSelectionContext = useSelectionContext;
    /**
     * Utility hook for consuming the SelectionContext
     *
     * @returns The value of the closest SelectionContext provider
     */
    function useSelectionContext() {
        return (0, hooks_1.useContext)(SelectionContext_1.SelectionContext);
    }
});
