import { type ListDataState } from 'oj-c/hooks/UNSAFE_useListData/useListData';
import { type DataFilter, type DataProvider } from 'ojs/ojdataprovider';
export type UseCollectionTemplateDataProviderViewParams<K, D> = {
    dataProvider?: DataProvider<K, D> | null;
    options: {
        dataStateOverride?: ListDataState<K, D>;
        filterCriterion?: DataFilter.Filter<D>;
    };
};
type UseCollectionTemplateDataProviderViewResult<K, D> = {
    dataProvider?: DataProvider<K, D> | null;
    dataState: ListDataState<K, D>;
};
/**
 * A custom hook to wrap the DP in a CollectionTemplateDataProviderView.
 * @param param0 The props for the useCollectionTemplateDataProviderView
 * @returns hook result
 */
export declare function useCollectionTemplateDataProviderView<K, D>({ dataProvider, options: { dataStateOverride, filterCriterion } }: UseCollectionTemplateDataProviderViewParams<K, D>): UseCollectionTemplateDataProviderViewResult<K, D>;
export {};
