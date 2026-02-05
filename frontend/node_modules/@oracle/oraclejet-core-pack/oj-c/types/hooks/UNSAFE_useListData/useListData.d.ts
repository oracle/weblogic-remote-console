/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { DataState, Range } from '@oracle/oraclejet-preact/UNSAFE_Collection';
import { DataFilter, DataProvider, FetchAttribute, SortCriterion } from 'ojs/ojdataprovider';
/**
 * Type for the state returned by useListData
 */
export type ListDataState<K, D> = {
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
     * DataService which provides a facade of accessing data and metadata synchronously
     */
    data: DataState<K, D>;
} | {
    status: 'error';
    /**
     * Any error code that occurs during data load
     */
    error: any;
};
/**
 * Optional parameters that applications can pass to useListData.
 * Note except for isInitialFetchDeferred, all the other options are pass directly to
 * fetchFirst/fetchByOffset in DataProvider.
 */
export type FetchOptions<D> = {
    attributes?: string[] | FetchAttribute[];
    filterCriterion?: DataFilter.Filter<D>;
    sortCriteria?: SortCriterion<D>[];
    isInitialFetchDeferred?: boolean;
    initialRowsFetched?: number;
    fetchSize?: number;
};
/**
 * A hook that takes a DataProvider and returns a DataService object and a loadMore function.
 * @param data the DataProvider
 * @param options the optional arguments used for fetchFirst
 */
export declare const useListData: <K, D>(data: DataProvider<K, D> | null, options?: FetchOptions<D>) => [ListDataState<K, D>, (range: Range) => void];
/**
 * Helper to create an empty DataState object
 * @param precision
 * @returns
 */
export declare const getEmptyState: <K, D>(precision: "exact" | "atLeast") => ListDataState<K, D>;
