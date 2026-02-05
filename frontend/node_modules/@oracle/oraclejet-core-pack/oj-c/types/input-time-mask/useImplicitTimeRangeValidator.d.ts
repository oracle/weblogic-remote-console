/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { TimeRangeValidator, TimeRangeValidatorOptions } from './TimeRangeValidator';
type UseImplicitTimeRangeValidatorProps = TimeRangeValidatorOptions;
/**
 * Custom hook that creates an implicit TimeRangeValidator for oj-c-input-time-mask.
 *
 * @returns A TimeRangeValidator instance or undefined if there is no min and no max, and therefore no need for validation.
 */
export declare const useImplicitTimeRangeValidator: ({ converter, defaultRangeOverflowMessageDetailFn, defaultRangeUnderflowMessageDetailFn, timeRangeOverflowMessageDetail, timeRangeUnderflowMessageDetail, formatObj, max, min }: UseImplicitTimeRangeValidatorProps) => TimeRangeValidator<string | null> | undefined;
export {};
