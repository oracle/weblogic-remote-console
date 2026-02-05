/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "ojs/ojdataproviderfactory", "preact/hooks", "../PRIVATE_DebouncingDataProviderView/DebouncingDataProviderView"], function (require, exports, ojdataproviderfactory_1, hooks_1, DebouncingDataProviderView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useWrapDataProvider = useWrapDataProvider;
    function useWrapDataProvider(data) {
        const dataProvider = (0, hooks_1.useMemo)(() => {
            if (!data) {
                return data;
            }
            const enhancedDP = (0, ojdataproviderfactory_1.getEnhancedDataProvider)(data, {
                fetchFirst: { caching: 'visitedByCurrentIterator' }
                // dedup: { type: 'iterator' },
                // eventFiltering: { type: 'iterator' }
            });
            // JET-55290 - Select Single - Debounce (introducing delays)
            // If the DP is capable of returning fetches immediately, simply return the enhancedDP.
            // Otherwise wrap the enhancedDP in a debouncing wrapper to help reduce the number of
            // remote fetch requests that are actually made as the user types.
            const filterCapability = enhancedDP.getCapability('fetchFirst');
            const isImmediate = filterCapability?.iterationSpeed === 'immediate';
            return isImmediate ? enhancedDP : new DebouncingDataProviderView_1.DebouncingDataProviderView(enhancedDP);
        }, [data]);
        return dataProvider;
    }
});
