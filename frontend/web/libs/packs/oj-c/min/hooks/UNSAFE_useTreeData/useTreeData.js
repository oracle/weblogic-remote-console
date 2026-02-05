define(["require", "exports", "ojs/ojflattenedtreedataproviderview", "../UNSAFE_useListData/useListData", "preact/hooks"], function (require, exports, FlattenedTreeDataProviderView, useListData_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useTreeData = void 0;
    const defaultOptions = {
        isInitialFetchDeferred: false
    };
    /**
     * A hook that takes a TreeDataProvider and returns a FlattenedDataState object and callback functions.
     * @param data the TreeDataProvider
     * @param options the optional arguments used for fetchFirst
     * @return an array containing: 1) TreeDataState 2) Callback for loadRange 3) Callback for handling onToggle event
     */
    const useTreeData = (data, options = defaultOptions) => {
        const actualExpandedRef = (0, hooks_1.useRef)(options.expanded);
        const currentExpandedRef = (0, hooks_1.useRef)(options.expanded);
        const dataProvider = (0, hooks_1.useMemo)(() => new FlattenedTreeDataProviderView(data, {
            expanded: options.expanded
        }), [data, options.expanded]);
        const [listDataState, onLoadRange] = (0, useListData_1.useListData)(dataProvider, options);
        const [treeDataState, setTreeDataState] = (0, hooks_1.useState)(() => {
            const initialState = listToTreeData(listDataState, keySetToKeys(actualExpandedRef.current), null);
            return initialState;
        });
        (0, hooks_1.useEffect)(() => {
            const expandedObservable = dataProvider.getExpandedObservable();
            const subscriber = expandedObservable.subscribe((value) => {
                currentExpandedRef.current = value.value;
                value.completionPromise.then(() => {
                    actualExpandedRef.current = value.value;
                });
            });
            return () => {
                subscriber.unsubscribe();
            };
        }, [dataProvider]);
        const toggleExpanded = (0, hooks_1.useCallback)((detail) => {
            const key = detail.key;
            if (!currentExpandedRef.current.has(key)) {
                dataProvider.setExpanded(currentExpandedRef.current.add([key]));
            }
            else {
                dataProvider.setExpanded(currentExpandedRef.current.delete([key]));
            }
        }, [dataProvider]);
        (0, hooks_1.useEffect)(() => {
            if (options.includeClosestParents &&
                listDataState.status === 'success' &&
                listDataState.data.data.length > 0) {
                fetchParents(listDataState, dataProvider).then((resultParent) => {
                    setTreeDataState(listToTreeData(listDataState, keySetToKeys(actualExpandedRef.current), resultParent));
                });
            }
            else {
                setTreeDataState(listToTreeData(listDataState, keySetToKeys(actualExpandedRef.current), []));
            }
        }, [listDataState, dataProvider, options.includeClosestParents]);
        return [treeDataState, onLoadRange, toggleExpanded];
    };
    exports.useTreeData = useTreeData;
    /**
     * Helper convert keys to keySet.
     * @param listDataState
     * @param dataProvider
     * @returns
     */
    const fetchParents = async (listDataState, dataProvider) => {
        if (listDataState.status === 'success' && listDataState.data.data.length > 0) {
            let parentKey = listDataState.data.data[0].metadata.parentKey;
            const parents = [];
            while (parentKey != null) {
                const fetchByKeyResults = await dataProvider.fetchByKeys({ keys: new Set([parentKey]) });
                const parent = fetchByKeyResults.results.get(parentKey);
                parentKey = parent?.metadata.parentKey;
                if (parent) {
                    parents.push(parent);
                }
            }
            return parents;
        }
        return null;
    };
    /**
     * Helper convert keyset to keys.
     * @param keyset
     * @returns
     */
    const keySetToKeys = (keySet) => {
        if (!keySet) {
            return getEmptyExpanded();
        }
        let keys = {};
        if (keySet.isAddAll()) {
            keys = {
                all: true,
                deletedKeys: new Set(keySet.deletedValues().values())
            };
        }
        else if (!keySet.isAddAll()) {
            keys = { all: false, keys: new Set(keySet.values().values()) };
        }
        return keys;
    };
    /**
     * Helper method to return empty keys object.
     * @returns
     */
    const getEmptyExpanded = () => {
        return { all: false, keys: new Set() };
    };
    /**
     * Helper to convert listData to treeData.
     * @param listData
     * @param expanded
     * @param parents
     * @returns
     */
    const listToTreeData = (listData, expanded, parents) => {
        if (!expanded) {
            expanded = getEmptyExpanded();
        }
        const treeDataState = {
            status: listData.status
        };
        if (treeDataState.status === 'loading' && listData.status === 'loading') {
            treeDataState.data = listData.data;
        }
        else if (treeDataState.status === 'error' && listData.status === 'error') {
            treeDataState.error = listData.error;
        }
        else if (treeDataState.status === 'success' && listData.status === 'success') {
            const flattenedDataState = { ...listData.data };
            flattenedDataState.expanded = expanded;
            if (parents !== null) {
                flattenedDataState.closestParents = [];
                parents.forEach((item) => {
                    const dataState = { data: item.data, metadata: item.metadata };
                    flattenedDataState.closestParents.push(dataState);
                });
            }
            treeDataState.data = flattenedDataState;
        }
        return treeDataState;
    };
});
