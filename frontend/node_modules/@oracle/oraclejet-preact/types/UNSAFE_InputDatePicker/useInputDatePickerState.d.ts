/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { CalendarDate, CalendarDateRequired } from "../utils/UNSAFE_calendarDateUtils";
type InputDatePickerState = {
    /**
     * If dateValue is a complete date, then completeDateValue is the same as dateValue
     * otherwise is is undefined. We need to maintain separate states because
     * InputDateMask uses CalendarDate, but DatePicker uses CalendarDateRequired.
     * If the user types a partial date then opens the picker, we treat that as
     * no selection. The picker opens to the current month showing today.
     */
    completeDateValue?: CalendarDateRequired;
    /**
     * Represents the current date value of the component. The user either selected
     * the date in the picker, or typed it into the date field.
     */
    dateValue?: CalendarDate;
};
type DateChangedAction = {
    type: 'dateChanged';
    data?: CalendarDate;
};
type DateResetAction = {
    type: 'reset';
    data?: CalendarDate;
};
type DateSelectedAction = {
    type: 'dateSelected';
    data?: CalendarDateRequired;
};
type InputDatePickerReducerAction = DateChangedAction | DateResetAction | DateSelectedAction;
type Props = {
    /**
     * The value of the InputDatePicker, or undefined.
     */
    value?: CalendarDate;
};
/**
 * useInputDatePickerState calls useReducer to determine the initial state. Any changes to that state
 * are managed by dispatching actions to the reducer function.
 */
declare const useInputDatePickerState: ({ value }: Props) => {
    state: InputDatePickerState;
    dispatch: import("preact/hooks").Dispatch<InputDatePickerReducerAction>;
};
export { useInputDatePickerState };
