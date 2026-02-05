type InputDateMaskContextProps = {
    isInputDatePickerParent: boolean;
    isDropdownOpen: boolean;
};
/**
 * Context used to indicate when the component is being used in
 * composition within some parent, such as InputDatePicker.
 */
declare const InputDateMaskContext: import("preact").Context<InputDateMaskContextProps>;
declare const useInputDateMaskContext: () => InputDateMaskContextProps;
export { InputDateMaskContext, useInputDateMaskContext };
export type { InputDateMaskContextProps };
