/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { InputDatePicker as PreactInputDatePicker } from '@oracle/oraclejet-preact/UNSAFE_InputDatePicker';
import type { Root } from '@oracle/oraclejet/ojvcomponent';
import type { ComponentProps } from 'preact';
import type { InputDatePickerProps, InputDatePickerRef } from './input-date-picker';
type PreactInputDatePickerProps = ComponentProps<typeof PreactInputDatePicker>;
type RootProps = ComponentProps<typeof Root>;
/**
 * A custom hook that adds functionality to the InputDatePicker component.
 */
export declare const useInputDatePicker: (props: InputDatePickerProps, ref: InputDatePickerRef) => {
    formContextValue: import("@oracle/oraclejet-preact/hooks/UNSAFE_useFormContext").FormContextProps;
    inputDatePickerProps: PreactInputDatePickerProps;
    rootProps: RootProps;
};
export {};
