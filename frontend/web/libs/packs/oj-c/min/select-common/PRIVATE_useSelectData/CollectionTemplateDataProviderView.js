define(["require", "exports", "ojs/ojdataprovider"], function (require, exports, ojdataprovider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CollectionTemplateDataProviderView = exports.SELECT_INTERNALS = void 0;
    // Key to store internal only information
    exports.SELECT_INTERNALS = Symbol('__SELECT_INTERNALS__');
    class CollectionTemplateDataProviderView {
        get currentDataProvider() {
            // If we are overriding the data return the override DP
            return this.overrideDataProvider ?? this.originalDataProvider;
        }
        /**
         * Sets the filter criterion that will be injected into the fetch calls.
         * @param filter The new filter
         */
        setFilterCriterion(filter) {
            const previousFilter = this.filterCriterion;
            this.filterCriterion = filter;
            if (!this.compareFilter(previousFilter, filter)) {
                // filter criterion changed, fire refresh event
                const event = new ojdataprovider_1.DataProviderRefreshEvent();
                // Add some additional private information to the event so that the Select components can ignore this event if it needs.
                // For example, it might not have to re-sync value & valueItems for this refresh event related to filtering.
                // Using Object.defineProperty to make this not enumerable and not configurable
                Object.defineProperty(event, exports.SELECT_INTERNALS, {
                    value: { cause: 'filterCriterionChanged' }
                });
                this.dispatchEvent(event);
                // We need to also notify Select that the filter is changed. This is needed because, if the previous fetch
                // resulted in no results, the select will not render the collection. So, the current filter & the refresh event will
                // not cause the collection to initiate a fetch as there is no collection rendered. This results in the component getting
                // stuck in a no results state.
                this.options.onRefresh?.();
            }
        }
        /**
         * Sets the override data for the data provider
         * @param dataStateOverride The override data
         */
        setDataStateOverride(dataStateOverride) {
            // for dataStateOverride, we check for reference equality
            if (this.dataStateOverride !== dataStateOverride) {
                this.dataStateOverride = dataStateOverride;
                // If override data is present, create a override DP otherwise clear the override DP
                this.overrideDataProvider =
                    this.dataStateOverride?.status === 'success'
                        ? new DataStateDataProviderView(this.dataStateOverride)
                        : undefined;
                // fire refresh event so that consuming collection can refetch the data
                const event = new ojdataprovider_1.DataProviderRefreshEvent();
                // Add some additional private information to the event so that the Select components can ignore this event if it needs.
                // For example, it might not have to re-sync value & valueItems for this refresh event related to filtering.
                // Using Object.defineProperty to make this not enumerable and not configurable
                Object.defineProperty(event, exports.SELECT_INTERNALS, {
                    value: { cause: 'dataOverrideChanged' }
                });
                this.dispatchEvent(event);
                // We need to also notify Select that the filter is changed. This is needed because, if the previous fetch
                // resulted in no results, the select will not render the collection. So, the current filter & the refresh event will
                // not cause the collection to initiate a fetch as there is no collection rendered. This results in the component getting
                // stuck in a no results state.
                this.options.onRefresh?.();
            }
        }
        /**
         * Compares two data filters.
         * @param fc1 first data filter
         * @param fc2 second data filter
         * @returns equality result
         */
        compareFilter(fc1, fc2) {
            if (fc1 === fc2)
                return true;
            if (fc1 === undefined || fc2 === undefined)
                return false;
            const keys1 = Object.keys(fc1);
            const keys2 = Object.keys(fc2);
            if (keys1.length !== keys2.length)
                return false;
            return keys1.every((key) => keys2.includes(key) && fc1[key] === fc2[key]);
        }
        constructor(dataProvider, options) {
            this.originalDataProvider = dataProvider;
            this.options = options;
            if (dataProvider.createOptimizedKeyMap)
                this.createOptimizedKeyMap = (initialMap) => dataProvider.createOptimizedKeyMap(initialMap);
            if (dataProvider.createOptimizedKeySet)
                this.createOptimizedKeySet = (initialMap) => dataProvider.createOptimizedKeySet(initialMap);
        }
        async fetchByOffset(parameters) {
            const overriddenParams = this.filterCriterion
                ? { ...parameters, filterCriterion: this.filterCriterion }
                : parameters;
            const results = await this.currentDataProvider.fetchByOffset(overriddenParams);
            this.options.onOffsetFetch?.({ results });
            return results;
        }
        fetchFirst(parameters) {
            const overriddenParams = this.filterCriterion
                ? { ...parameters, filterCriterion: this.filterCriterion }
                : parameters;
            const options = this.options;
            options.onInitializeFetch?.();
            const iterable = this.currentDataProvider.fetchFirst(overriddenParams);
            return {
                [Symbol.asyncIterator]() {
                    let offset = 0;
                    const iterator = iterable[Symbol.asyncIterator]();
                    return {
                        async next() {
                            const itResult = await iterator.next();
                            const { value: results, done = false } = itResult;
                            options.onNextIteration?.({ results, offset, done });
                            offset += results.data.length;
                            return itResult;
                        }
                    };
                }
            };
        }
        addEventListener(eventType, listener) {
            // we always add event listeners on the original DP
            return this.originalDataProvider.addEventListener(eventType, listener);
        }
        containsKeys(parameters) {
            return this.currentDataProvider.containsKeys(parameters);
        }
        dispatchEvent(event) {
            // We always dispatch events to the original DP
            return this.originalDataProvider.dispatchEvent(event);
        }
        fetchByKeys(parameters) {
            return this.currentDataProvider.fetchByKeys(parameters);
        }
        getCapability(capabilityName) {
            // We always reflect the original DP's capability
            return this.originalDataProvider.getCapability(capabilityName);
        }
        getTotalSize() {
            return this.currentDataProvider.getTotalSize();
        }
        isEmpty() {
            return this.currentDataProvider.isEmpty();
        }
        removeEventListener(eventType, listener) {
            // Since we added event listeners to the original DP, we always remove
            // them from the original DP as well.
            return this.originalDataProvider.removeEventListener(eventType, listener);
        }
    }
    exports.CollectionTemplateDataProviderView = CollectionTemplateDataProviderView;
    class DataStateDataProviderView {
        constructor(dataState) {
            this.dataState = dataState;
        }
        containsKeys(parameters) {
            const { keys } = parameters;
            const { data } = this.dataState;
            const foundKeys = new Set();
            data.data.forEach((item) => {
                if (keys.has(item.metadata.key)) {
                    foundKeys.add(item.metadata.key);
                }
            });
            return Promise.resolve({
                containsParameters: parameters,
                results: foundKeys
            });
        }
        fetchByKeys(parameters) {
            const { keys } = parameters;
            const { data } = this.dataState;
            const results = new Map();
            data.data.forEach((item) => {
                if (keys.has(item.metadata.key)) {
                    results.set(item.metadata.key, item);
                }
            });
            return Promise.resolve({
                fetchParameters: parameters,
                results
            });
        }
        fetchByOffset(parameters) {
            const { offset, size } = parameters;
            const { data } = this.dataState;
            // filter data based on offset and size
            const filteredData = data.data.slice(offset, size);
            const results = {
                fetchParameters: parameters ?? {},
                results: filteredData.map((item) => ({ data: item.data, metadata: item.metadata })),
                done: offset + (size ?? 0) >= data.totalSize
            };
            return Promise.resolve(results);
        }
        fetchFirst(parameters) {
            const { data } = this.dataState;
            return {
                [Symbol.asyncIterator]() {
                    let offset = 0;
                    const size = parameters?.size ?? 25; // ideally collection will always send a size
                    const totalSize = data.totalSize;
                    return {
                        async next() {
                            if (offset < totalSize) {
                                const filteredData = data.data.slice(offset, size);
                                const resultsOverride = filteredData.reduce((acc, value) => {
                                    acc.data.push(value.data);
                                    acc.metadata.push(value.metadata);
                                    return acc;
                                }, { data: [], metadata: [] });
                                const results = {
                                    ...resultsOverride,
                                    fetchParameters: parameters ?? {},
                                    totalFilteredRowCount: data.totalSize
                                };
                                // update the offset
                                const adjustedSize = Math.min(size, totalSize - offset);
                                offset += offset + adjustedSize;
                                return { value: results, done: false };
                            }
                            // iteration is over, so return empty results
                            const results = {
                                data: [],
                                metadata: [],
                                fetchParameters: parameters ?? {},
                                totalFilteredRowCount: data.totalSize
                            };
                            return { value: results, done: true };
                        }
                    };
                }
            };
        }
        getCapability() {
            // This DP View does not support any capability
            return null;
        }
        getTotalSize() {
            return Promise.resolve(this.dataState.data.totalSize);
        }
        isEmpty() {
            return this.dataState.data.totalSize === 0 ? 'yes' : 'no';
        }
        // This DP View does not support events
        addEventListener() { }
        dispatchEvent() {
            return false;
        }
        removeEventListener() { }
    }
});
