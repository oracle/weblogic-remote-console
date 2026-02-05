/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { DataProvider, ContainsKeysResults, FetchByKeysParameters, FetchByKeysResults, FetchByOffsetParameters, FetchByOffsetResults, FetchListParameters, FetchListResult } from 'ojs/ojdataprovider';
/**
 * A DataProvider wrapper that supports debouncing fetchFirst requests.
 * It is up to the calling code to abort stale requests and only process
 * the results for the most recent fetch.
 */
export declare class DebouncingDataProviderView<K, D> implements DataProvider<K, D> {
    private _debouncer;
    protected readonly dataProvider: DataProvider<K, D>;
    constructor(dataProvider: DataProvider<K, D>);
    /**
     * Fetch the first block of data
     */
    fetchFirst<F extends FetchListResult<K, D>>(params?: FetchListParameters<D>): AsyncIterable<F>;
    /**
     * Fetch rows by keys
     */
    fetchByKeys(params: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>;
    /**
     * Check if rows are contained by keys
     */
    containsKeys(params: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>;
    /**
     * Fetch rows by offset
     */
    fetchByOffset(params: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>;
    /**
     * Returns the total size of the data
     */
    getTotalSize(): Promise<number>;
    /**
     * Returns a string that indicates if this data provider is empty.
     * Returns "unknown" if the dataProvider has not resolved yet.
     */
    isEmpty(): 'yes' | 'no' | 'unknown';
    /**
     * Determines whether this DataProvider supports certain feature.
     */
    getCapability(capabilityName: string): any;
    /** start EVENT TARGET IMPLEMENTATION **/
    addEventListener(eventType: string, listener: EventListener): void;
    removeEventListener(eventType: string, listener: EventListener): void;
    dispatchEvent(event: Event): boolean;
}
