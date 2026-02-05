/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ItemContext } from 'ojs/ojcommontypes';
import { DataProvider } from 'ojs/ojdataprovider';
/**
 * Types used for handling dataprovider events
 */
type DataProviderHandlerCallback<Key, Data> = {
    /**
     * Callback function to call when the data is fetched/updated
     *
     * @param data The array for fetched items
     */
    onDataUpdated: (data: Array<ItemContext<Key, Data>>) => void;
};
/**
 * @classdesc
 * This class handles DataProvider mechanisms for the preact components
 * @ignore
 */
export declare class DataProviderHandler<Key, Data> {
    private readonly addBusyState;
    private readonly dataProvider;
    private currentData;
    private callback?;
    /**
     * Handles the mutation event triggered by the dataprovider and calls corresponding
     * callbacks.
     *
     * @param event DP mutation event object containing details relevant to the event
     */
    private readonly handleMutateEvent;
    /**
     * Handles the refresh event triggered by the dataprovider and calls corresponding
     * callbacks.
     */
    private readonly handleRefreshEvent;
    /**
     * Instantiates the DataProviderHandler.
     *
     * @param dataProvider The data provider instance that is being used by the component
     * @param addBusyState A function reference that set busy state in the component
     * @param callback A callback that will be invoked whenever data changes
     */
    constructor(dataProvider: DataProvider<Key, Data>, addBusyState: (description: string) => () => void, callback?: DataProviderHandlerCallback<Key, Data>);
    /**
     * Destroys all resources un-registers all events
     */
    destroy(): void;
    /**
     * Fetches the data from the dataprovider and returns the fetched data
     *
     * @returns A promise that resolves with the fetched data
     */
    private _fetchData;
    /**
     * Fetches the data from the dataprovider and calls the corresponding
     * callback with the fetched data.
     */
    private _fetchDataAndNotify;
}
export {};
