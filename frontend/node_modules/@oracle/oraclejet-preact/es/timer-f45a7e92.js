/* @oracle/oraclejet-preact: undefined */
/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Timer utility that allows you to pause and resume a timer.
 */
class Timer {
    /**
     * Instantiates a controllable timer.
     *
     * @param callback The callback to be called once the timer completes
     * @param delay The delay for the timer
     */
    constructor(callback, delay = 0) {
        // set the initial values
        this.callback = callback;
        this.isActive = true;
        this.remainingTime = delay;
        this.startTime = Date.now();
        this.start();
    }
    /**
     * Starts the timer
     */
    start() {
        if (this.callback) {
            this.timeoutId = window.setTimeout(this.proxyCallback.bind(this), this.remainingTime); // @HTMLUpdateOK
        }
    }
    /**
     * A proxy for handling callbacks when the timer runs out
     */
    proxyCallback() {
        // This will be called once the timer runs out
        // at which point the timer is expired.
        const callback = this.callback;
        // Clear the timer before calling the callback.
        // This is make sure that the timer state is up-to-date when the
        // callback is invoked.
        this.clear();
        callback?.();
    }
    /**
     * Clears the current timer without calling the callback and no further interaction will be allowed
     */
    clear() {
        // if already cleared do not do anything
        if (!this.isActive) {
            return;
        }
        window.clearTimeout(this.timeoutId);
        this.isActive = false;
        this.timeoutId = undefined;
        this.callback = undefined;
    }
    /**
     * Pauses the current timer
     */
    pause() {
        // do nothing if the timer is expired
        if (!this.isActive) {
            return;
        }
        window.clearTimeout(this.timeoutId);
        this.timeoutId = undefined;
        this.remainingTime -= Date.now() - this.startTime;
    }
    /**
     * Resumes the timer
     */
    resume() {
        // if there is already a timer running or if this is not active, do nothing
        if (this.timeoutId || !this.isActive) {
            return;
        }
        this.startTime = Date.now();
        this.start();
    }
}

export { Timer as T };
//# sourceMappingURL=timer-f45a7e92.js.map
