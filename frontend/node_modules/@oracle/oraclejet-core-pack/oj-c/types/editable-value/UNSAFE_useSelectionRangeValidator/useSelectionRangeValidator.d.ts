import type { SelectionRangeValidatorOptions } from './SelectionRangeValidator';
import Validator = require('ojs/ojvalidator');
/**
 * A custom hook that creates an implicit SelectionRangeValidator if either min or max is defined.
 * @returns An array of validators, e.g. Validator<V>[]
 */
export declare function useSelectionRangeValidator<V>({ defaultSelectionExactMessageDetail, defaultSelectionOverflowMessageDetail, defaultSelectionRangeMessageDetail, defaultSelectionUnderflowMessageDetail, max, min, selectionExactMessageDetail, selectionOverflowMessageDetail, selectionRangeMessageDetail, selectionUnderflowMessageDetail }: SelectionRangeValidatorOptions): Validator<V>[];
