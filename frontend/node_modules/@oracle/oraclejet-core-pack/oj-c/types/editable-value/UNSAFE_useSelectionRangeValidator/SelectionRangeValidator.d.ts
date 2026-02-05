import type { BundleType } from '@oracle/oraclejet-preact/resources/nls/bundle';
import type Validator = require('ojs/ojvalidator');
type MessageDetailFn<T> = (p: T) => string;
/**
 * Parameters that are passed into the selectionOverflowMessageDetail callback function.
 */
export type OverflowMessageDetailParameters = {
    /**
     * The maximum allowed number of selections.
     */
    max: number;
};
/**
 * Parameters that are passed into the selectionUnderflowMessageDetail callback function.
 */
export type UnderflowMessageDetailParameters = {
    /**
     * The minimum allowed number of selections.
     */
    min: number;
};
/**
 * Parameters that are passed into the selectionExactMessageDetail callback function.
 */
export type ExactMessageDetailParameters = {
    /**
     * The exact allowed number of selections.
     */
    exact: number;
};
/**
 * Parameters that are passed into the selectionRangeMessageDetail callback function.
 */
export type RangeMessageDetailParameters = {
    /**
     * The maximum allowed number of selections.
     */
    max: number;
    /**
     * The minimum allowed number of selections.
     */
    min: number;
};
/**
 * Options for SelectionRangeValidator to configure its min, max, and messages.
 */
export type SelectionRangeValidatorOptions = {
    /**
     * Default message detail functions. They return a translated string.
     */
    defaultSelectionExactMessageDetail: BundleType['formControl_selectionExactMessageDetail'];
    defaultSelectionOverflowMessageDetail: BundleType['formControl_selectionOverflowMessageDetail'];
    defaultSelectionRangeMessageDetail: BundleType['formControl_selectionRangeMessageDetail'];
    defaultSelectionUnderflowMessageDetail: BundleType['formControl_selectionUnderflowMessageDetail'];
    /**
     * The maximum allowed number of selections.
     */
    max?: number;
    /**
     * The minimum allowed number of selections.
     */
    min?: number;
    /**
     * A callback function that returns a component-specific message detail when validation
     * fails because the number of selections does not equal the exact number of allowed
     * selections, e.g. when min equals max. The function should return a translated string.
     */
    selectionExactMessageDetail?: MessageDetailFn<ExactMessageDetailParameters>;
    /**
     * A callback function that returns a component-specific message detail when validation
     * fails because the number of selections is greater than the max. The function should
     * return a translated string.
     */
    selectionOverflowMessageDetail?: MessageDetailFn<OverflowMessageDetailParameters>;
    /**
     * A callback function that returns a component-specific message detail when validation
     * fails because the number of selections falls outside the valid range defined by
     * min and max. The function should return a translated string.
     */
    selectionRangeMessageDetail?: MessageDetailFn<RangeMessageDetailParameters>;
    /**
     * A callback function that returns a component-specific message detail when validation
     * fails because the number of selections is less than the min. The function should
     * return a translated string.
     */
    selectionUnderflowMessageDetail?: MessageDetailFn<UnderflowMessageDetailParameters>;
};
/**
 * Constructs a SelectionRangeValidator that ensures the number of
 * selections is within the range specified using min and max.
 * @template V type of the value to be validated
 * @implements {Validator}
 */
export declare class SelectionRangeValidator<V extends Array<string | number>> implements Validator<V> {
    #private;
    private options;
    /**
     * Instantiates the SelectionRangeValidator
     * @param options The validator options
     */
    constructor(options: SelectionRangeValidatorOptions);
    /**
     * Validates that the number of selections is within the range
     * @param value The value to be validated
     * @throws {SelectionRangeValidatorError} when the value is not within the range
     */
    validate(value: V): void;
}
export {};
