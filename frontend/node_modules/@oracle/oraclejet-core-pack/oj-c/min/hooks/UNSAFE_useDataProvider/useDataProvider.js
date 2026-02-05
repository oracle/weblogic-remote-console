/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "preact/hooks", "./DataProviderHandler"], function (require, exports, hooks_1, DataProviderHandler_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useDataProvider = useDataProvider;
    /**
     * Consumes a DP and converts the data into an array. This also attaches event listeners
     * to the DP and updates the array accordingly.
     *
     * @param param0 The props for the hook
     * @returns The data converted into an array
     */
    function useDataProvider({ addBusyState, data }) {
        const [fetchedData, setFetchedData] = (0, hooks_1.useState)([]);
        const dataProviderHandler = (0, hooks_1.useRef)();
        (0, hooks_1.useEffect)(() => {
            if (data !== undefined) {
                dataProviderHandler.current = new DataProviderHandler_1.DataProviderHandler(data, addBusyState, {
                    onDataUpdated: setFetchedData
                });
            }
            return () => {
                dataProviderHandler.current?.destroy();
                dataProviderHandler.current = undefined;
            };
        }, [data, addBusyState]);
        return {
            data: fetchedData
        };
    }
});
