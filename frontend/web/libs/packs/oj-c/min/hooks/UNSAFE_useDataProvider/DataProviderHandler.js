define(["require", "exports", "./utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataProviderHandler = void 0;
    /**
     * @classdesc
     * This class handles DataProvider mechanisms for the preact components
     * @ignore
     */
    class DataProviderHandler {
        ///////////////////////////
        // Handler functions end //
        ///////////////////////////
        /**
         * Instantiates the DataProviderHandler.
         *
         * @param dataProvider The data provider instance that is being used by the component
         * @param addBusyState A function reference that set busy state in the component
         * @param callback A callback that will be invoked whenever data changes
         */
        constructor(dataProvider, addBusyState, callback) {
            ////////////////////////////////////////////////////////////////////////
            // Handler functions are created as members to have them 'this' bound //
            ////////////////////////////////////////////////////////////////////////
            /**
             * Handles the mutation event triggered by the dataprovider and calls corresponding
             * callbacks.
             *
             * @param event DP mutation event object containing details relevant to the event
             */
            this.handleMutateEvent = async (event) => {
                const { detail } = event;
                // Add busy state while updating the data
                const resolver = this.addBusyState('updating data from mutation event');
                const updatedData = await (0, utils_1.getUpdatedItemsFromMutationDetail)(detail, this.currentData, this.dataProvider);
                // Resolve the busy state
                resolver?.();
                // store the newly created data and notify the consumer with the new data
                this.currentData = updatedData;
                this.callback?.onDataUpdated?.(updatedData);
            };
            /**
             * Handles the refresh event triggered by the dataprovider and calls corresponding
             * callbacks.
             */
            this.handleRefreshEvent = () => {
                this._fetchDataAndNotify();
            };
            this.addBusyState = addBusyState;
            this.callback = callback;
            this.dataProvider = dataProvider;
            this.currentData = [];
            // Subscribe to the data provider events
            dataProvider.addEventListener('refresh', this.handleRefreshEvent);
            dataProvider.addEventListener('mutate', this.handleMutateEvent);
            // Initialize a fetch
            this._fetchDataAndNotify();
        }
        ////////////////////
        // Public Methods //
        ////////////////////
        /**
         * Destroys all resources un-registers all events
         */
        destroy() {
            // Clean up callbacks so that existing fetches will not update the component
            this.callback = undefined;
            // empty the store data
            this.currentData = [];
            // Clean up data provider
            this.dataProvider.removeEventListener('refresh', this.handleRefreshEvent);
            this.dataProvider.removeEventListener('mutate', this.handleMutateEvent);
        }
        ////////////////////////
        // Public Methods End //
        ////////////////////////
        ////////////////////////////
        // Private Helper Methods //
        ////////////////////////////
        /**
         * Fetches the data from the dataprovider and returns the fetched data
         *
         * @returns A promise that resolves with the fetched data
         */
        async _fetchData() {
            const fetchedData = [];
            const asyncIterable = this.dataProvider.fetchFirst({ size: -1 });
            for await (const results of asyncIterable) {
                const contextArray = results.data.map((item, index) => {
                    return {
                        data: item,
                        key: results.metadata[index].key,
                        metadata: results.metadata[index]
                    };
                });
                fetchedData.push(...contextArray);
            }
            // Store a copy of data before returning.
            // When receiving a mutation event this data will be used along with the
            // mutation event detail to construct the new data.
            this.currentData = fetchedData.slice();
            return fetchedData;
        }
        /**
         * Fetches the data from the dataprovider and calls the corresponding
         * callback with the fetched data.
         */
        async _fetchDataAndNotify() {
            // Set the busy state
            const resolver = this.addBusyState('fetching data');
            const fetchedData = await this._fetchData();
            this.callback?.onDataUpdated?.(fetchedData);
            // Now that the data is fetched, clear the busy state
            resolver();
        }
    }
    exports.DataProviderHandler = DataProviderHandler;
});
