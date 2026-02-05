define(["require", "exports", "preact/hooks"], function (require, exports, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useCurrentItemOverride = void 0;
    /**
     * This hook handles the currentItemOverride passing to preact layer.
     *
     * If the app provided new value for 'currentItemOverride', we pass that down to preact layer;
     * otherwise, we will pass down the value of internal override, which would be the value
     * updated by useHandleRemoveCurrentKey hook
     *
     * @param currentItemOverride
     */
    const useCurrentItemOverride = (currentItemOverride) => {
        // the override that will be passed down to preact layer
        const preactOverrideRef = (0, hooks_1.useRef)();
        // track the internal override updated by useHandleRemoveCurrentKey hook
        const [, setInternalOverride] = (0, hooks_1.useState)();
        const updateCurrentItemOverride = (0, hooks_1.useCallback)((key) => {
            setInternalOverride({ rowKey: key });
            preactOverrideRef.current = { rowKey: key };
        }, []);
        // track the currentItemOverride attribute set by app
        const appOverrideRef = (0, hooks_1.useRef)();
        if (appOverrideRef.current !== currentItemOverride) {
            appOverrideRef.current = currentItemOverride;
            preactOverrideRef.current = currentItemOverride;
        }
        return {
            preactCurrentItemOverride: preactOverrideRef.current,
            updateCurrentItemOverride
        };
    };
    exports.useCurrentItemOverride = useCurrentItemOverride;
});
