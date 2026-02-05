/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { DateRestrictionValidator, DateRestrictionValidatorOptions } from './DateRestrictionValidator';
type UseImplicitDateRestrictionValidatorProps = Pick<DateRestrictionValidatorOptions, 'converter' | 'dateRestrictionMessageDetail' | 'defaultRestrictionMessageDetail'> & {
    dayFormatter?: DateRestrictionValidatorOptions['dayFormatter'];
};
/**
 * Custom hook that creates an implicit DateRestrictionValidator for oj-c-input-date-picker
 * if there is a dayFormatter property. Otherwise it will return null.
 *
 * @returns A DateRestrictionValidator instance or null
 */
export declare const useImplicitDateRestrictionValidator: ({ converter, dateRestrictionMessageDetail, dayFormatter, defaultRestrictionMessageDetail }: UseImplicitDateRestrictionValidatorProps) => DateRestrictionValidator<string | null> | undefined;
export {};
