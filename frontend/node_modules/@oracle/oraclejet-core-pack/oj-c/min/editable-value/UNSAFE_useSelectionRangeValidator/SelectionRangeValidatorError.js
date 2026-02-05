define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectionRangeValidatorError = void 0;
    /**
     * A SelectionRangeValidatorError is thrown by SelectionRangeValidator when the number of
     * selected values falls outside of a given range, defined by min and max props.
     *
     * We extend the Error class so we can include an optional 'messageDisplayStrategy' field that
     * indicates when a validation error should be displayed. If unset, we show it immediately.
     */
    class SelectionRangeValidatorError extends Error {
        constructor(message) {
            super(message);
            this.name = 'SelectionRangeValidatorError';
            this.messageDisplayStrategy = 'displayOnBlur';
        }
    }
    exports.SelectionRangeValidatorError = SelectionRangeValidatorError;
});
