/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Helper class for debouncing fetch requests.
 */
export declare class Debouncer {
    private readonly _responseTimes;
    private readonly _requestTime;
    private _lastRequestTime;
    /**
     * Debounce a given function by the specified time.
     * @param callback function to debounce
     * @param filterTextLength text filter length
     * @returns debounced function
     */
    debounce(callback: (...args: any) => void, filterTextLength: number): (...args: any) => void;
    /**
     * Record the time between a fetch request and response.
     * @param time fetch time in ms
     * @param filterTextLength length of the text filter for the fetch
     */
    recordResponseTime(time: number, filterTextLength: number): void;
    /**
     * Record the time of a fetch request.
     */
    recordRequestTime(): void;
    /**
     * Get the average response time for a given text filter length.
     * @param filterTextLength length of the text filter
     * @returns average response time in ms
     */
    private _getResponseTime;
    /**
     * Get the average request time.
     * @returns average request time in ms
     */
    private _getRequestTime;
    /**
     * Get the time to use for debouncing based on the text filter length, the average
     * time between requests, and the average response time.
     * @param filterTextLength text filter length
     * @returns debounce time in ms
     */
    protected GetDebounceTime(filterTextLength: number): number;
}
