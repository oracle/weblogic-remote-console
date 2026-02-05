/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { DateRangeValidator, DateRangeValidatorOptions } from './DateRangeValidator';
type UseImplicitDateRangeValidatorProps = DateRangeValidatorOptions;
/**
 * Custom hook that creates an implicit DateRangeValidator for oj-c-input-date-picker
 * if there is a dayFormatter property. Otherwise it will return null.
 *
 * @returns A DateRangeValidator instance or null
 */
export declare const useImplicitDateRangeValidator: ({ converter, defaultRangeOverflowMessageDetailFn, defaultRangeUnderflowMessageDetailFn, dateRangeOverflowMessageDetail, dateRangeUnderflowMessageDetail, formatObj, max, min }: UseImplicitDateRangeValidatorProps) => DateRangeValidator<string | null> | undefined;
export {};
