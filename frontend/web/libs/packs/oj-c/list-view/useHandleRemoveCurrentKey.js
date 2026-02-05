define(["require", "exports", "preact/hooks"], function (require, exports, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useHandleRemoveCurrentKey = useHandleRemoveCurrentKey;
    /**
     * Hook to detect and handle when the current key has been removed
     * and try to find the next available current key.
     * TODO: put in its own private module as we should be able to share
     * between other Collection components.
     * @param dataState
     * @param updateCurrentKey
     */
    function useHandleRemoveCurrentKey(dataState, updateCurrentKey) {
        const prevDataState = (0, hooks_1.useRef)();
        const currentKeyRef = (0, hooks_1.useRef)();
        const notifyCurrentKeyChanged = (detail) => {
            currentKeyRef.current = detail.value;
        };
        (0, hooks_1.useEffect)(() => {
            const oldDataState = prevDataState.current;
            if (currentKeyRef.current &&
                oldDataState &&
                dataState &&
                oldDataState.offset === dataState.offset &&
                oldDataState !== dataState) {
                const newKeys = dataState.data.map((dataMetadata) => {
                    return dataMetadata.metadata.key;
                });
                // first check if currentKey exists in new data, if it is then we
                // don't need to do anything
                if (newKeys.indexOf(currentKeyRef.current) === -1) {
                    const oldKeys = oldDataState?.data.map((dataMetadata) => {
                        return dataMetadata.metadata.key;
                    });
                    // figure out what the new currentKey should be
                    let index = oldKeys.indexOf(currentKeyRef.current);
                    if (index > -1) {
                        const backward = index === oldKeys.length - 1;
                        while (index >= 0 && index < oldKeys.length) {
                            index = backward ? index - 1 : index + 1;
                            const newCurrentKey = oldKeys[index];
                            if (newKeys.indexOf(newCurrentKey) > -1) {
                                updateCurrentKey(newCurrentKey);
                                break;
                            }
                        }
                    }
                }
            }
            // update previous DataState
            prevDataState.current = dataState;
        }, [dataState, updateCurrentKey]);
        return {
            notifyCurrentKeyChanged
        };
    }
});
