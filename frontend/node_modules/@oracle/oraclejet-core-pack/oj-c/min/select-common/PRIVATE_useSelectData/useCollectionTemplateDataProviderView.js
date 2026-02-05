define(["require", "exports", "oj-c/hooks/UNSAFE_useListData/useListData", "preact/hooks", "./CollectionTemplateDataProviderView"], function (require, exports, useListData_1, hooks_1, CollectionTemplateDataProviderView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useCollectionTemplateDataProviderView = useCollectionTemplateDataProviderView;
    /**
     * A custom hook to wrap the DP in a CollectionTemplateDataProviderView.
     * @param param0 The props for the useCollectionTemplateDataProviderView
     * @returns hook result
     */
    function useCollectionTemplateDataProviderView({ dataProvider, options: { dataStateOverride, filterCriterion } }) {
        const [state, dispatch] = (0, hooks_1.useReducer)((reducer), {
            dataState: (0, useListData_1.getEmptyState)('atLeast')
        });
        const wrappedDP = (0, hooks_1.useMemo)(() => dataProvider == null
            ? dataProvider
            : new CollectionTemplateDataProviderView_1.CollectionTemplateDataProviderView(dataProvider, {
                onInitializeFetch() {
                    dispatch({ type: 'loading' });
                },
                onNextIteration({ results: { data, metadata, fetchParameters }, offset, done }) {
                    // if the fetch is aborted, do nothing
                    if (fetchParameters.signal?.aborted)
                        return;
                    const items = data.map((item, index) => ({
                        data: item,
                        metadata: metadata[index]
                    }));
                    dispatch({ type: 'append', payload: { items, offset, done } });
                },
                onOffsetFetch({ results: { results, done, fetchParameters } }) {
                    // If the fetch is aborted, do nothing
                    if (fetchParameters.signal?.aborted)
                        return;
                    dispatch({
                        type: 'update',
                        payload: { items: results, done, offset: fetchParameters.offset }
                    });
                },
                onRefresh() {
                    // if the previous fetch resulted in no results, the select will not render the collection. So, the current filter & the refresh event will
                    // not cause the collection to initiate a fetch as there is no collection rendered. This results in the component getting
                    // stuck in a no results state. To fix this, we will put the select in loading state, so the collection will be rendered and the collection
                    // will fetch the new data.
                    dispatch({ type: 'loading' });
                }
            }), [dataProvider]);
        // Update the wrappedDP filter if the filterCriterion is changed
        const prevFilterCriterionRef = (0, hooks_1.useRef)();
        if (prevFilterCriterionRef.current !== filterCriterion) {
            prevFilterCriterionRef.current = filterCriterion;
            wrappedDP?.setFilterCriterion(filterCriterion);
        }
        // Update the wrappedDP override data if the dataStateOverride is changed
        const prevDataStateOverride = (0, hooks_1.useRef)();
        if (prevDataStateOverride.current !== dataStateOverride) {
            prevDataStateOverride.current = dataStateOverride;
            wrappedDP?.setDataStateOverride(dataStateOverride);
        }
        return {
            dataState: state.dataState,
            dataProvider: wrappedDP
        };
    }
    const reducer = (state, { type, payload }) => {
        switch (type) {
            case 'append': {
                const { dataState } = state;
                const prevData = dataState.status === 'success' ? dataState.data : null;
                const { done, items } = payload;
                return {
                    ...state,
                    dataState: {
                        status: 'success',
                        data: {
                            data: [...(prevData?.data ?? []), ...items],
                            offset: prevData?.offset ?? 0,
                            sizePrecision: done ? 'exact' : 'atLeast',
                            totalSize: (prevData?.data.length ?? 0) + items.length
                        }
                    }
                };
            }
            case 'update': {
                return {
                    ...state,
                    dataState: {
                        status: 'success',
                        data: {
                            data: payload.items,
                            offset: payload.offset,
                            sizePrecision: payload.done ? 'exact' : 'atLeast',
                            totalSize: payload.items.length
                        }
                    }
                };
            }
            case 'loading': {
                return {
                    ...state,
                    dataState: {
                        status: 'loading',
                        data: null
                    }
                };
            }
            default:
                return state;
        }
    };
});
