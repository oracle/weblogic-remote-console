define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.treatNull = exports.normalizeValue = exports.isShallowEqual = exports.hasErrorMessages = exports.getVirtualKeyboardHintFromConverter = exports.createMessageFromError = void 0;
    /**
     * Creates a component message for the provided error
     *
     * @param error The error object
     * @returns The component message for the error provided
     */
    const createMessageFromError = (error) => {
        if (typeof error.getMessage === 'function') {
            return {
                severity: 'error',
                detail: error.getMessage().detail
            };
        }
        return { severity: 'error', detail: error.message };
    };
    exports.createMessageFromError = createMessageFromError;
    /**
     * Treats the value for `null` and replaces it with the provided defaultValue
     * or undefined.
     *
     * @param value The value that needs to be treated
     * @param defaultValue The value to used when the provided value is null
     * @returns the null treated value
     */
    const treatNull = (value, defaultValue) => {
        if (value === null) {
            return defaultValue;
        }
        return value;
    };
    exports.treatNull = treatNull;
    /**
     * Normalizes an empty string to null.
     * @param value
     * @returns null if the value is an empty string
     */
    const normalizeValue = (value) => {
        if (typeof value === 'string' && value === '') {
            return null;
        }
        return value;
    };
    exports.normalizeValue = normalizeValue;
    /**
     * Shallow compares two arrays.
     *
     * @param a The first array
     * @param b The second array
     * @returns Result of the shallow compare
     */
    const isShallowEqual = (a, b) => a === b || (a.length === b.length && a.every((v, i) => v === b[i]));
    exports.isShallowEqual = isShallowEqual;
    /**
     * Return true if there are any messsages with "error" severity.
     * @param messages
     * @returns True if there are any messages with "error" severity
     */
    const hasErrorMessages = (messages) => {
        return !!messages && messages.some((message) => message.severity === 'error');
    };
    exports.hasErrorMessages = hasErrorMessages;
    /**
     * If there is a converter and the converter's resolvedOptions have a virtualKeyboardHint
     * property, return the virtualKeyboardHint. Otherwise return 'text'.
     * @param converter
     * @returns The virtual keyboard hint from the converter or 'text'
     */
    const getVirtualKeyboardHintFromConverter = (converter) => {
        let virtualKeyboardHint;
        if (converter && converter.resolvedOptions) {
            const resOptions = converter.resolvedOptions();
            virtualKeyboardHint = resOptions?.virtualKeyboardHint ?? 'text';
        }
        else {
            virtualKeyboardHint = 'text';
        }
        return virtualKeyboardHint;
    };
    exports.getVirtualKeyboardHintFromConverter = getVirtualKeyboardHintFromConverter;
});
