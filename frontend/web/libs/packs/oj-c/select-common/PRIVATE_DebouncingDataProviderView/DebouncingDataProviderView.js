define(["require", "exports", "ojs/ojdataprovider", "./Debouncer"], function (require, exports, ojdataprovider_1, Debouncer_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DebouncingDataProviderView = void 0;
    class AsyncIteratorWrapper {
        constructor(dataProvider, debouncer, params) {
            this._isFirstNext = true;
            this.dataProvider = dataProvider;
            this.debouncer = debouncer;
            this.params = params;
        }
        next() {
            if (this._isFirstNext) {
                // record the request time with the debouncer
                this.debouncer.recordRequestTime();
                this._isFirstNext = false;
                const filterText = this.params?.filterCriterion?.text;
                const debounceCallback = (resolve, reject) => {
                    // if the request has been aborted, reject the promise with the abort error and return
                    if (this.params?.signal?.aborted) {
                        reject(this.params?.signal?.reason);
                        return;
                    }
                    const asyncIterable = this.dataProvider.fetchFirst(this.params);
                    this._asyncIterator = asyncIterable[Symbol.asyncIterator]();
                    const fetchStart = Date.now();
                    const iterPromise = this._asyncIterator.next();
                    iterPromise.then((result) => {
                        // record the response time with the debouncer
                        const fetchEnd = Date.now();
                        this.debouncer.recordResponseTime(fetchEnd - fetchStart, filterText ? filterText.length : 0);
                        resolve(result);
                    }, reject);
                };
                // the abort handler will pass its own promise resolve/reject functions into this callback
                const callback = (resolve, reject) => {
                    const promise = new Promise((pResolve, pReject) => {
                        this.debouncer.debounce(debounceCallback, filterText ? filterText.length : 0)(pResolve, pReject);
                    });
                    // when the debounce promise resolves, resolve the abort handling promise
                    return promise.then(resolve, reject);
                };
                return (0, ojdataprovider_1.wrapWithAbortHandling)(this.params?.signal, callback, false);
            }
            return this._asyncIterator.next();
        }
    }
    class AsyncIterableWrapper {
        constructor(dataProvider, debouncer, params) {
            this[_a] = () => {
                return new AsyncIteratorWrapper(this.dataProvider, this.debouncer, this.params);
            };
            this.dataProvider = dataProvider;
            this.debouncer = debouncer;
            this.params = params;
        }
    }
    _a = Symbol.asyncIterator;
    /**
     * A DataProvider wrapper that supports debouncing fetchFirst requests.
     * It is up to the calling code to abort stale requests and only process
     * the results for the most recent fetch.
     */
    class DebouncingDataProviderView {
        constructor(dataProvider) {
            this._debouncer = new Debouncer_1.Debouncer();
            this.dataProvider = dataProvider;
        }
        /**
         * Fetch the first block of data
         */
        fetchFirst(params) {
            return new AsyncIterableWrapper(this.dataProvider, this._debouncer, params);
        }
        /**
         * Fetch rows by keys
         */
        fetchByKeys(params) {
            return this.dataProvider.fetchByKeys(params);
        }
        /**
         * Check if rows are contained by keys
         */
        containsKeys(params) {
            return this.dataProvider.containsKeys(params);
        }
        /**
         * Fetch rows by offset
         */
        fetchByOffset(params) {
            return this.dataProvider.fetchByOffset(params);
        }
        /**
         * Returns the total size of the data
         */
        getTotalSize() {
            return this.dataProvider.getTotalSize();
        }
        /**
         * Returns a string that indicates if this data provider is empty.
         * Returns "unknown" if the dataProvider has not resolved yet.
         */
        isEmpty() {
            return this.dataProvider.isEmpty();
        }
        /**
         * Determines whether this DataProvider supports certain feature.
         */
        getCapability(capabilityName) {
            return this.dataProvider.getCapability(capabilityName);
        }
        /** start EVENT TARGET IMPLEMENTATION **/
        addEventListener(eventType, listener) {
            this.dataProvider.addEventListener(eventType, listener);
        }
        removeEventListener(eventType, listener) {
            this.dataProvider.removeEventListener(eventType, listener);
        }
        dispatchEvent(event) {
            return this.dataProvider.dispatchEvent(event);
        }
    }
    exports.DebouncingDataProviderView = DebouncingDataProviderView;
});
