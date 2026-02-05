/**
 * A SelectionRangeValidatorError is thrown by SelectionRangeValidator when the number of
 * selected values falls outside of a given range, defined by min and max props.
 *
 * We extend the Error class so we can include an optional 'messageDisplayStrategy' field that
 * indicates when a validation error should be displayed. If unset, we show it immediately.
 */
export declare class SelectionRangeValidatorError extends Error {
    messageDisplayStrategy?: 'displayOnBlur';
    constructor(message: string);
}
