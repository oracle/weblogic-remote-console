/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Debouncer = void 0;
    /**
     * Helper class for debouncing fetch requests.
     */
    class Debouncer {
        constructor() {
            // The algorithm will calculate the debounce time as follows:
            // debounceTime = (1 + (responseTime - 1.2 * requestTime) / responseTime) * 1.2 * requestTime
            //
            // Rewriting to solve for response time:
            // debounceTime = (2 - 1.2 * requestTime / responseTime) * 1.2 * requestTime
            // debounceTime * responseTime / (1.2 * requestTime) = 2 * responseTime - 1.2 * requestTime
            // responseTime = 1.2 * requestTime / (2 - debounceTime / (1.2 * requestTime))
            //
            // We want our default debounce times to start out higher for fewer characters typed and
            // decrease as the number of characters increases, so we will define our default
            // buckets of response times based on some of these example calculations.
            // (We don't want the default response time to be less than 1.2 * default requestTime (250),
            // because then the logic will use a debounce time of 0 because the response is expected to
            // return before the user types again.)
            // debounce | request | response
            // ---------|---------|---------
            //  500     | 250     | 900
            //  475     | 250     | 720
            //  450     | 250     | 600
            //  425     | 250     | 514
            //  400     | 250     | 450
            //  375     | 250     | 400
            //  350     | 250     | 360
            //  325     | 250     | 327
            //  300     | 250     | 300
            this._responseTimes = [
                { time: 900, count: 0 },
                { time: 720, count: 0 },
                { time: 600, count: 0 },
                { time: 450, count: 0 },
                { time: 360, count: 0 },
                { time: 300, count: 0 }
            ];
            this._requestTime = { time: 250, count: 0 };
            this._lastRequestTime = 0;
        }
        /**
         * Debounce a given function by the specified time.
         * @param callback function to debounce
         * @param filterTextLength text filter length
         * @returns debounced function
         */
        debounce(callback, filterTextLength) {
            const wait = this.GetDebounceTime(filterTextLength);
            return (...args) => {
                window.setTimeout(() => {
                    callback(...args);
                }, wait);
            };
        }
        /**
         * Record the time between a fetch request and response.
         * @param time fetch time in ms
         * @param filterTextLength length of the text filter for the fetch
         */
        recordResponseTime(time, filterTextLength) {
            const index = Math.min(filterTextLength, 5);
            const record = this._responseTimes[index];
            // if this is the first recorded time, overwrite our initial default;
            // otherwise calculate the new average
            if (record.count === 0) {
                record.time = time;
            }
            else {
                record.time = (record.time * record.count + time) / (record.count + 1);
            }
            record.count += 1;
        }
        /**
         * Record the time of a fetch request.
         */
        recordRequestTime() {
            const requestTime = Date.now();
            const lastRequestTime = this._lastRequestTime;
            this._lastRequestTime = requestTime;
            // we need two requests in order to record the time between them, so if this is the
            // very first request, just return
            if (lastRequestTime === 0) {
                return;
            }
            const time = requestTime - lastRequestTime;
            // assume that intervals greater than 1000ms are the start of a new search, so do not
            // factor into the average request time
            if (time > 1000) {
                return;
            }
            const record = this._requestTime;
            // if this is the first recorded time, overwrite our initial default;
            // otherwise calculate the new average
            if (record.count === 0) {
                record.time = time;
            }
            else {
                record.time = (record.time * record.count + time) / (record.count + 1);
            }
            record.count += 1;
        }
        /**
         * Get the average response time for a given text filter length.
         * @param filterTextLength length of the text filter
         * @returns average response time in ms
         */
        _getResponseTime(filterTextLength) {
            const index = Math.min(filterTextLength, 5);
            const record = this._responseTimes[index];
            return record.time;
        }
        /**
         * Get the average request time.
         * @returns average request time in ms
         */
        _getRequestTime() {
            return this._requestTime.time;
        }
        /**
         * Get the time to use for debouncing based on the text filter length, the average
         * time between requests, and the average response time.
         * @param filterTextLength text filter length
         * @returns debounce time in ms
         */
        GetDebounceTime(filterTextLength) {
            const responseTime = this._getResponseTime(filterTextLength);
            const requestTime = this._getRequestTime();
            // the request time is an average of how fast the user types, so assume any given time may
            // be a little longer than the average
            const paddedRequestTime = 1.2 * requestTime;
            // if the response is expected to come back before the user types another character, don't
            // debounce
            if (responseTime < paddedRequestTime) {
                return 0;
            }
            // if the response won't come back before the user types another character, wait between
            // 1 and 2 times the paddedRequestTime, depending on how much slower the response is expected
            // to be
            const factor = (responseTime - paddedRequestTime) / responseTime;
            const debounceTime = (1 + factor) * paddedRequestTime;
            return debounceTime;
        }
    }
    exports.Debouncer = Debouncer;
});
