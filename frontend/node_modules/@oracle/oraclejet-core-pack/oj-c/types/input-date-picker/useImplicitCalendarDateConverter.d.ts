/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { BundleType } from '@oracle/oraclejet-preact/resources/nls/bundle';
import { CalendarDateConverter } from 'oj-c/input-date-mask/CalendarDateConverter';
type UseImplicitCalendarDateConverterProps = {
    calendarDateConverter_parseErrorFn: BundleType['calendarDateConverter_parseError'];
};
/**
 * Custom hook that creates an implicit CalendarDateConverter for oj-c-input-date-picker.
 *
 * @returns A CalendarDateConverter instance
 */
export declare const useImplicitCalendarDateConverter: ({ calendarDateConverter_parseErrorFn }: UseImplicitCalendarDateConverterProps) => CalendarDateConverter;
export {};
