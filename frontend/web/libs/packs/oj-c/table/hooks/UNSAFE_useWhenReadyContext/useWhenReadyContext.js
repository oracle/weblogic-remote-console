define(["require", "exports", "preact/hooks", "ojs/ojcontext"], function (require, exports, hooks_1, Context) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useWhenReadyContext = useWhenReadyContext;
    function useWhenReadyContext(elemRef) {
        const whenReady = (0, hooks_1.useCallback)((timeout) => {
            // If the component is not mounted, just resolve
            return elemRef.current
                ? Context.getContext(elemRef.current).getBusyContext().whenReady(timeout)
                : Promise.resolve();
        }, [elemRef]);
        const busyContext = (0, hooks_1.useMemo)(() => ({
            whenReady
        }), [whenReady]);
        return busyContext;
    }
});
