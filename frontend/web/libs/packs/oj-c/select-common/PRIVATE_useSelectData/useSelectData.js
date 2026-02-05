define(["require", "exports", "oj-c/hooks/UNSAFE_useListData/useListData", "preact/hooks", "../UNSAFE_useWrapDataProvider/index", "./useCollectionTemplateDataProviderView"], function (require, exports, useListData_1, hooks_1, index_1, useCollectionTemplateDataProviderView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useSelectData = void 0;
    const noOp = () => { };
    /**
     * A custom hook for creating the data related properties for the select component.
     * @param param0 hook params
     * @returns hook result
     */
    const useSelectData = ({ data, dataStateOverride: propDataStateOverride, filterCriterion, hasCollectionTemplate }) => {
        const dataProvider = (0, index_1.useWrapDataProvider)(data);
        // pass initialRowsFetched: 0 so that no data is fetched until the collection calls onLoadRange
        // (i.e. when the dropdown is open and the collection needs to render)
        const [listDataState, onLoadRange] = (0, useListData_1.useListData)(dataProvider ?? null, {
            filterCriterion,
            initialRowsFetched: 0
        });
        const dataStateOverride = (0, hooks_1.useMemo)(() => (propDataStateOverride ? { status: 'success', data: propDataStateOverride } : undefined), [propDataStateOverride]);
        const { dataState: templateDataState, dataProvider: templateDataProvider } = (0, useCollectionTemplateDataProviderView_1.useCollectionTemplateDataProviderView)({
            dataProvider,
            options: { dataStateOverride, filterCriterion }
        });
        return {
            dataProvider: hasCollectionTemplate ? templateDataProvider : dataProvider,
            dataState: hasCollectionTemplate ? dataStateOverride ?? templateDataState : listDataState,
            // It is the default list on the preact side that calls onLoadRange to fetch data. But with
            // collectionTemplate/ collectionRenderer, the default list is not rendered on the preact side.
            // The collectionTemplate will render the list and it will be a core-pack collection that has
            // access to the DP. It then directly call the fetch methods on the DP to fetch the data. So,
            // we assign noOp to onLoadRange when rendering a collectionTemplate.
            onLoadRange: hasCollectionTemplate ? noOp : onLoadRange
        };
    };
    exports.useSelectData = useSelectData;
});
