import type { ListDataState } from 'oj-c/hooks/UNSAFE_useListData/useListData';
import { FetchByKeysResults, type ContainsKeysResults, type DataFilter, type DataProvider, type FetchByKeysParameters, type FetchByOffsetParameters, type FetchByOffsetResults, type FetchListParameters, type FetchListResult } from 'ojs/ojdataprovider';
export declare const SELECT_INTERNALS: unique symbol;
export type SelectInternals = {
    cause?: 'filterCriterionChanged' | 'dataOverrideChanged';
};
type CollectionTemplateDataProviderViewOptions<K, D> = {
    onInitializeFetch?: () => void;
    onNextIteration?: (details: {
        results: FetchListResult<K, D>;
        offset: number;
        done: boolean;
    }) => void;
    onOffsetFetch?: (details: {
        results: FetchByOffsetResults<K, D>;
    }) => void;
    onRefresh?: () => void;
};
export declare class CollectionTemplateDataProviderView<K, D> implements DataProvider<K, D> {
    private originalDataProvider;
    private overrideDataProvider?;
    private dataStateOverride?;
    private filterCriterion?;
    private options;
    private get currentDataProvider();
    /**
     * Sets the filter criterion that will be injected into the fetch calls.
     * @param filter The new filter
     */
    setFilterCriterion(filter?: DataFilter.Filter<D>): void;
    /**
     * Sets the override data for the data provider
     * @param dataStateOverride The override data
     */
    setDataStateOverride(dataStateOverride?: ListDataState<K, D>): void;
    /**
     * Compares two data filters.
     * @param fc1 first data filter
     * @param fc2 second data filter
     * @returns equality result
     */
    private compareFilter;
    constructor(dataProvider: DataProvider<K, D>, options: CollectionTemplateDataProviderViewOptions<K, D>);
    fetchByOffset(parameters: FetchByOffsetParameters<D>): Promise<FetchByOffsetResults<K, D>>;
    fetchFirst(parameters?: FetchListParameters<D> | undefined): AsyncIterable<FetchListResult<K, D>>;
    createOptimizedKeyMap?(initialMap?: Map<K, D> | undefined): Map<K, D>;
    createOptimizedKeySet?(initialSet?: Set<K> | undefined): Set<K>;
    addEventListener(eventType: string, listener: EventListener): void;
    containsKeys(parameters: FetchByKeysParameters<K>): Promise<ContainsKeysResults<K>>;
    dispatchEvent(event: Event): boolean;
    fetchByKeys(parameters: FetchByKeysParameters<K>): Promise<FetchByKeysResults<K, D>>;
    getCapability(capabilityName: string): any;
    getTotalSize(): Promise<number>;
    isEmpty(): "unknown" | "no" | "yes";
    removeEventListener(eventType: string, listener: EventListener): void;
}
export {};
