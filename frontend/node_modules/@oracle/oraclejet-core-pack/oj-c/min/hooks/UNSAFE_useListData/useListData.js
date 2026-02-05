define(["require", "exports", "ojs/ojabortreason", "ojs/ojdataproviderfactory", "preact/hooks"], function (require, exports, ojabortreason_1, ojdataproviderfactory_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getEmptyState = exports.useListData = void 0;
    /**
     * initial state of the reducer
     */
    const initialState = Object.freeze({
        status: 'loading',
        data: null
    });
    const defaultOptions = {
        isInitialFetchDeferred: false
    };
    const DEFAULT_FETCH_SIZE = 25;
    //TODO: Eslint warning need to be solved due to calling hooks conditionally.JET-63985
    /**
     * A hook that takes a DataProvider and returns a DataService object and a loadMore function.
     * @param data the DataProvider
     * @param options the optional arguments used for fetchFirst
     */
    const useListData = (data, options = defaultOptions) => {
        const fetchNextRef = (0, hooks_1.useRef)(null);
        const totalSizeRef = (0, hooks_1.useRef)(0);
        const isDoneRef = (0, hooks_1.useRef)(false);
        const iteratorRef = (0, hooks_1.useRef)(null);
        const abortControllerRef = (0, hooks_1.useRef)(null);
        const fetchSize = options.fetchSize && options.fetchSize > 0 ? options.fetchSize : DEFAULT_FETCH_SIZE;
        // it should return the same instance as long as the DataProvider didn't change
        const dataProvider = (0, hooks_1.useMemo)(() => wrapData(data), [data]);
        const [state, dispatch] = (0, hooks_1.useReducer)(reducer, options.initialRowsFetched === 0 ? (0, exports.getEmptyState)('atLeast') : initialState);
        /**
         * Fetch the range from DataProvider.  The results should have already been cached.
         * @param range requested range
         */
        const fetchRange = (0, hooks_1.useCallback)(async (range, resultsCallback) => {
            if (dataProvider == null) {
                return;
            }
            const fetchOptions = {
                attributes: options.attributes,
                sortCriteria: options.sortCriteria,
                filterCriterion: options.filterCriterion,
                offset: range.offset,
                size: range.count
            };
            // don't use done from result as the impl is behaving differently between DataProviders
            // ex: fetchByOffset in ADP will set done to false if the range is within total size
            // ex: fetchByOffset in CachingDP will set done to true if cache is hit
            const sizePrecision = isDoneRef.current === true ? 'exact' : 'atLeast';
            if (range.count === 0) {
                // this could happen when inserting to an empty list
                // the mutation triggers re-rendering of the current range, which would be 0
                // the load more should then trigger to fetch the next set of data
                // (sizePrecision should be 'atLeast')
                dispatch({
                    status: 'success',
                    data: {
                        offset: range.offset,
                        data: [],
                        totalSize: totalSizeRef.current,
                        sizePrecision: sizePrecision
                    }
                });
                return;
            }
            try {
                const result = await dataProvider.fetchByOffset(fetchOptions);
                const results = result['results'];
                if (resultsCallback) {
                    resultsCallback(results);
                }
                dispatch({
                    status: 'success',
                    data: {
                        offset: range.offset,
                        data: results,
                        totalSize: totalSizeRef.current,
                        sizePrecision: sizePrecision
                    }
                });
            }
            catch (error) {
                dispatch({
                    status: 'error',
                    error: error
                });
            }
        }, [dataProvider, options.attributes, options.filterCriterion, options.sortCriteria]);
        /**
         * Initial load.  Invoke fetchFirst against DataProvider.
         */
        const loadInitial = (0, hooks_1.useCallback)(async () => {
            if (dataProvider == null) {
                return;
            }
            // abort an ongoing fetch request because we are issuing a new one and would ignore any
            // results from the existing one
            if (state.status === 'loading') {
                abortControllerRef.current?.abort((0, ojabortreason_1.getAbortReason)());
            }
            // put it back to loading status if it is not the case already
            dispatch({ status: 'loading', data: null });
            const controller = new AbortController();
            abortControllerRef.current = controller;
            // the fetch size is hard coded to the default value of 25 for now, could be something
            // configurable in the future
            const iterator = dataProvider
                .fetchFirst({
                attributes: options.attributes,
                sortCriteria: options.sortCriteria,
                filterCriterion: options.filterCriterion,
                size: fetchSize,
                signal: controller.signal
            })[Symbol.asyncIterator]();
            iteratorRef.current = iterator;
            try {
                const result = await iterator.next();
                // JET-58561 - typing multiple characters quickly doesn't always filter correctly
                // if this is not the most recent call to fetchFirst, simply ignore the results and return
                if (iterator !== iteratorRef.current) {
                    return;
                }
                const fetchParameters = result.value.fetchParameters;
                if (fetchParameters.signal && fetchParameters.signal.aborted) {
                    return;
                }
                totalSizeRef.current = result.value.data.length;
                if (result.done !== undefined) {
                    isDoneRef.current = result.done;
                }
                const initialFetchSize = options.initialRowsFetched && options.initialRowsFetched > 0
                    ? options.initialRowsFetched
                    : fetchSize;
                fetchRange({ offset: 0, count: Math.min(totalSizeRef.current, initialFetchSize) });
            }
            catch (error) {
                if (error instanceof DOMException && error.name === 'AbortError') {
                    // if this is due to abort from refresh, then we should not dispatch
                    // error since there is already another fetch started
                    return;
                }
                dispatch({
                    status: 'error',
                    error: error
                });
                iteratorRef.current = null;
            }
        }, [
            dataProvider,
            fetchRange,
            fetchSize,
            options.attributes,
            options.filterCriterion,
            options.initialRowsFetched,
            options.sortCriteria,
            options.fetchSize
        ]);
        // this particular implementation is tailored towards the incremental fetching
        // model, where it incrementally increases the totalSize and use 'atLeast' for
        // precision until data is exhausted.
        const loadRange = (0, hooks_1.useCallback)(async (range) => {
            // no iterator due to isInitialFetchDeferred set to true
            if (iteratorRef.current === null) {
                loadInitial();
            }
            else {
                const endIndex = range.offset + range.count;
                // if the requested range falls outside of what we have so far, we'll need to fetch
                // next set of result from iterator to populate the cache in CachedIteratingResultsDP
                if (endIndex > totalSizeRef.current) {
                    // this shouldn't happen, but if there is an on-going iterator.next() - i.e. currentFetchNext.current
                    // is non-null, we don't want to invoke iterator.next() again. Ignore this loadRange request as the
                    // on-going request should result in an updated DataState, and the component will request another
                    // loadRange in the case if the result does not satisfy the viewport
                    if (fetchNextRef.current == null) {
                        const promise = fetchNextUntilThresholdOrDone(iteratorRef, totalSizeRef.current, endIndex);
                        fetchNextRef.current = promise;
                        try {
                            const value = await promise;
                            if (value.done !== undefined) {
                                isDoneRef.current = value.done;
                            }
                            const total = value.total;
                            // when total is 0 and done is true, need to call fetchRange again to update sizePrecision to exact
                            if (total > 0 || (total === 0 && isDoneRef.current)) {
                                totalSizeRef.current = total;
                                // have to adjust the range otherwise fetchByOffset in CachedIteratingResultsDP will skip the cache
                                // and go directly against it's underlying DP
                                fetchRange({
                                    offset: range.offset,
                                    count: Math.min(totalSizeRef.current - range.offset, range.count)
                                });
                            }
                            fetchNextRef.current = null;
                        }
                        catch (error) {
                            dispatch({
                                status: 'error',
                                error: error
                            });
                            fetchNextRef.current = null;
                        }
                    }
                }
                else {
                    // within cache, invoke fetchByOffset against cached data
                    fetchRange(range);
                }
            }
        }, [loadInitial, fetchRange]);
        const resetAndLoad = (0, hooks_1.useCallback)(() => {
            // reset value of refs
            iteratorRef.current = null;
            fetchNextRef.current = null;
            totalSizeRef.current = 0;
            isDoneRef.current = false;
            if (options.initialRowsFetched === 0) {
                dispatch((0, exports.getEmptyState)('atLeast'));
            }
            else if (!options.isInitialFetchDeferred) {
                loadInitial();
            }
            else {
                dispatch({ status: 'loading', data: null });
            }
        }, [loadInitial, options.isInitialFetchDeferred, options.initialRowsFetched]);
        // runs on mounted and also if data or any of the options have changed, in which case we should do fetchFirst again
        (0, hooks_1.useEffect)(() => {
            if (dataProvider) {
                resetAndLoad();
            }
        }, [dataProvider, resetAndLoad]);
        const handleMutation = (0, hooks_1.useCallback)((event) => {
            if (state.status === 'success' && state.data) {
                const dataState = state.data;
                let count = dataState.data.length;
                let shouldUpdate = false;
                if (event.detail.add) {
                    const itemsInserted = handleAddRemoveMutation(event.detail.add, dataState, options, true);
                    totalSizeRef.current = totalSizeRef.current + itemsInserted;
                    count = count + itemsInserted;
                    // should update if items inserted within range or if the data is already exhausted
                    shouldUpdate = itemsInserted > 0 || dataState.sizePrecision === 'exact';
                    // if some inserted item is outside of range, then we should make sure we'll fetch them
                    // this is done by setting sizePrecision to 'atLeast' so that it will trigger the component
                    // to check viewport and fetch next set of items as needed
                    if (itemsInserted < event.detail.add.data.length) {
                        isDoneRef.current = false;
                    }
                }
                if (event.detail.remove) {
                    const itemsRemoved = handleAddRemoveMutation(event.detail.remove, dataState, options, false);
                    totalSizeRef.current = Math.max(0, totalSizeRef.current - itemsRemoved);
                    count = Math.max(0, count - itemsRemoved);
                    shouldUpdate = shouldUpdate || itemsRemoved > 0;
                }
                let callback;
                const updateDetail = event.detail.update;
                if (updateDetail) {
                    shouldUpdate = shouldUpdate || handleUpdateMutation(updateDetail, dataState, options);
                    callback = (results) => {
                        processDataAfterUpdate(updateDetail, dataState, results);
                    };
                }
                if (shouldUpdate) {
                    fetchRange({ offset: dataState.offset, count }, callback);
                }
            }
        }, [state, options, fetchRange]);
        const handleRefresh = (0, hooks_1.useCallback)((event) => {
            let adjustment = -1;
            const disregardAfterKey = event.detail?.disregardAfterKey;
            if (disregardAfterKey && state.status === 'success') {
                const index = state.data.data.findIndex((value) => {
                    return value.metadata.key === disregardAfterKey;
                });
                if (index > -1) {
                    // - 1 because the disregardAfterKey itself is included
                    adjustment = state.data.data.length - index - 1;
                }
                // disregardAfterKey is the last item in viewport, no need to fetch or re-render
                // the only case is if the range is smaller than viewport, for example, if disregardAfteRKey
                // is the last item of the entire data (we reached totalSize), then we'll want to fetch more
                if (adjustment === 0 && state.data.data.length >= fetchSize) {
                    return;
                }
            }
            if (adjustment > -1 && state.status === 'success') {
                totalSizeRef.current = totalSizeRef.current - adjustment;
                // this should caused next() to be called first
                loadRange({
                    offset: state.data.offset,
                    count: Math.max(state.data.data.length, fetchSize)
                });
            }
            else {
                // abort any current fetch request
                if (state.status === 'loading') {
                    abortControllerRef.current?.abort();
                }
                resetAndLoad();
            }
        }, [state, fetchSize, loadRange, resetAndLoad]);
        // handles refresh event from DataProvider
        (0, hooks_1.useEffect)(() => {
            if (dataProvider) {
                dataProvider.addEventListener('refresh', handleRefresh);
                dataProvider.addEventListener('mutate', handleMutation);
            }
            return () => {
                if (dataProvider) {
                    dataProvider.removeEventListener('refresh', handleRefresh);
                    dataProvider.removeEventListener('mutate', handleMutation);
                }
            };
        }, [dataProvider, resetAndLoad, handleMutation, handleRefresh]);
        // Consuming components, e.g. oj-c-select-multiple can legitimately pass a null dataProvider
        // ..short circuit in that case with a success, an empty dataset, and a no-op LoadRange.
        if (!data) {
            const emptyListState = (0, exports.getEmptyState)('exact');
            return [emptyListState, (_) => Promise.resolve()];
        }
        return [state, loadRange];
    };
    exports.useListData = useListData;
    // wraps the DataProvider with an enhance DataProvider that will provide caching
    const wrapData = (data) => {
        if (data == null) {
            return null;
        }
        const configuration = {
            fetchFirst: { caching: 'visitedByCurrentIterator', forceLocalCaching: 'enabled' }
        };
        return (0, ojdataproviderfactory_1.getEnhancedDataProvider)(data, configuration);
    };
    const reducer = (state, action) => {
        // avoid re-render if status is loading and hasn't change
        if (state.status === action.status && action.status === 'loading') {
            return state;
        }
        return action;
    };
    /**
     * Call next() until either threshold has been reached or there's no more data
     * @param iteratorRef ref object that contains the current iterator
     * @param current the current number of items fetched
     * @param threshold the threshold size to reach
     * @return promise that resolves to the updated current number of items fetched
     */
    const fetchNextUntilThresholdOrDone = async (iteratorRef, current, threshold) => {
        return await fetchNextRecursive(iteratorRef, current, threshold);
    };
    /**
     * Do the recursive work for fetchNextUntilThresholdOrDone
     * @param iteratorRef ref object that contains the current iterator
     * @param currentCount the current number of items fetched
     * @param threshold the threshold size to reach
     * @param resolve
     * @param reject
     */
    const fetchNextRecursive = async (iteratorRef, currentCount, threshold) => {
        const currentIterator = iteratorRef.current;
        if (currentIterator === null) {
            return { total: -1, done: undefined };
        }
        const result = await currentIterator.next();
        // must ensure the current iterator is still valid
        if (currentIterator === iteratorRef.current) {
            currentCount += result.value.data.length;
            if (currentCount >= threshold || result.done) {
                return { total: currentCount, done: result.done };
            }
            return fetchNextRecursive(iteratorRef, currentCount, threshold);
        }
        return { total: -1, done: undefined };
    };
    /**
     * Helper to create an empty DataState object
     * @param precision
     * @returns
     */
    const getEmptyState = (precision) => {
        return (precision === 'atLeast' ? emptyStateAtLeast : emptyStateExact);
    };
    exports.getEmptyState = getEmptyState;
    const emptyStateAtLeast = Object.freeze({
        status: 'success',
        data: {
            offset: 0,
            data: [],
            totalSize: 0,
            sizePrecision: 'atLeast'
        }
    });
    const emptyStateExact = Object.freeze({
        status: 'success',
        data: {
            offset: 0,
            data: [],
            totalSize: 0,
            sizePrecision: 'exact'
        }
    });
    /**
     * Helper to handle add and remove mutation events from DataProvider
     * @param detail
     * @param dataState
     * @param options
     * @returns the number of items that are inserted or removed before the fetched data
     */
    const handleAddRemoveMutation = (detail, dataState, options, isAdd) => {
        let itemCount = 0;
        // indexes cannot be used if there is a sort or filter criteria set on fetch since the indexes
        // is most likely (doesn't specified in the contract) relative to the global data vs. data in DataState is based on
        // sorted/filtered data
        if (isIndexesAvailable(detail, options)) {
            // for add, the indexes are index of the item AFTER mutation, so the range of fetched data will need to be adjusted
            // for each in range item.  In order to do that correctly, the indexes must be sorted so that we process the
            // item with smallest index first
            const indexes = isAdd ? detail.indexes?.sort((a, b) => a - b) : detail.indexes;
            // we use totalSize since useListData use the high watermark model, so totalSize should reflect how many it's been fetched so far
            let endIndex = dataState.totalSize - 1;
            indexes?.forEach((index) => {
                // if index is before what we have fetched already
                if (index <= endIndex) {
                    itemCount = itemCount += 1;
                    if (isAdd) {
                        endIndex = endIndex += 1;
                    }
                }
            });
        }
        else {
            if (isAdd) {
                // TODO: for add, handle case where indexes are not available, see JET-52923
            }
            else {
                // only remove the data that's already fetched
                const allKeys = dataState.data.map((d) => d.metadata.key);
                detail.keys.forEach((key) => {
                    if (allKeys.includes(key)) {
                        itemCount += 1;
                    }
                });
            }
        }
        return itemCount;
    };
    /**
     * Helper to handle update mutation events from DataProvider
     * @param detail
     * @param dataState
     * @param options
     * @returns true if update occurs in the current viewport, false otherwise
     */
    const handleUpdateMutation = (detail, dataState, options) => {
        if (isIndexesAvailable(detail, options)) {
            const indexes = detail.indexes ? detail.indexes : [];
            const startIndex = dataState.offset;
            const endIndex = startIndex + dataState.data.length;
            for (let i = 0; i < indexes.length; i++) {
                if (indexes[i] >= startIndex && indexes[i] < endIndex) {
                    return true;
                }
            }
        }
        else {
            // only update the data that's already fetched
            const detailKeys = Array.from(detail.keys);
            const allKeys = dataState.data.map((d) => d.metadata.key);
            for (let i = 0; i < detailKeys.length; i++) {
                const key = detailKeys[i];
                if (allKeys.includes(key)) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Perform any processing logic after results are fetched triggered by an update event
     * @param detail
     * @param dataState
     * @param results
     */
    const processDataAfterUpdate = (detail, dataState, results) => {
        detail.keys.forEach((key) => {
            const updatedData = results.find((item) => {
                return item.metadata.key == key;
            });
            const currentData = dataState.data.find((item) => {
                return item.metadata.key == key;
            });
            // we'll need to ensure that the updated data is not the same reference
            // as what's in DataState now.  If that is the case we must wrap the data
            // in a Proxy so that the reference is different and Collection will not
            // skip rendering as part of its optimization
            if (currentData && updatedData && currentData.data === updatedData.data) {
                updatedData.data = new Proxy(updatedData.data, {});
            }
        });
    };
    /**
     * Returns true if indexes can be used from the mutation event, false otherwise.
     * @param detail
     * @param options
     * @returns
     */
    const isIndexesAvailable = (detail, options) => {
        // indexes cannot be used if there is a sort or filter criteria set on fetch since the indexes
        // is most likely (doesn't specified in the contract) relative to the global data vs. data in DataState is based on
        // sorted/filtered data
        return detail.indexes && options.sortCriteria == null && options.filterCriterion == null;
    };
});
