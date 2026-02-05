/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { FlattenedDataState, Range } from '@oracle/oraclejet-preact/UNSAFE_Collection';
import { FetchAttribute, DataFilter, SortCriterion } from 'ojs/ojdataprovider';
import TreeDataProvider = require('ojs/ojtreedataprovider');
import { KeySet } from 'ojs/ojkeyset';
/**
 * Type for the state returned by useTreeData.  Basically the same as ListDataState except data has a type of FlattenedDataState.
 */
export type TreeDataState<K, D> = {
    /**
     * Data loading status
     */
    status: 'loading';
    /**
     * Component renders skeleton only when data is null
     */
    data: null;
} | {
    status: 'success';
    /**
     * FlattenedDataState which provides a facade of accessing data and metadata synchronously
     */
    data: FlattenedDataState<K, D>;
} | {
    status: 'error';
    /**
     * Any error code that occurs during data load
     */
    error: any;
};
/**
 * Optional parameters that applications can pass to useTreeData.
 * Note except for initialRowsFetched and includeClosestParents, all the other options are pass directly to
 * fetchFirst/fetchByOffset in TreeDataProvider.
 */
export type FetchOptions<K, D> = {
    attributes?: string[] | FetchAttribute[];
    filterCriterion?: DataFilter.Filter<D>;
    sortCriteria?: SortCriterion<D>[];
    isInitialFetchDeferred?: boolean;
    initialRowsFetched?: number;
    expanded?: KeySet<K>;
    /**
     * Optionally specify whether the result data should include the data for the closest parents of the first item in the fetch result.
     * This is mainly used to support the sticky header feature.
     */
    includeClosestParents?: boolean;
};
export type ToggleDetail<K> = {
    key: K;
};
/**
 * A hook that takes a TreeDataProvider and returns a FlattenedDataState object and callback functions.
 * @param data the TreeDataProvider
 * @param options the optional arguments used for fetchFirst
 * @return an array containing: 1) TreeDataState 2) Callback for loadRange 3) Callback for handling onToggle event
 */
export declare const useTreeData: <K, D>(data: TreeDataProvider<K, D>, options?: FetchOptions<K, D>) => [TreeDataState<K, D>, (range: Range) => void, (detail: ToggleDetail<K>) => void];
