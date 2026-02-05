/*******************
 * Variants Utility
 *******************/
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    readonly position: {
        readonly top: string;
        readonly start: string;
        readonly inside: "";
    };
    readonly inside: {
        readonly isInside: string;
        readonly notInside: "";
    };
    readonly textField: {
        readonly isTextField: "";
        readonly notTextField: "";
    };
    readonly inEnabledForm: {
        readonly isInEnabledForm: "";
        readonly notInEnabledForm: "";
    };
    readonly labelWrapping: {
        readonly wrap: "";
        readonly truncate: "";
    };
    readonly readonly: {
        readonly isReadonly: "";
        readonly notReadonly: "";
    };
    readonly focused: {
        readonly isFocused: "";
        readonly nonFocused: "";
    };
    readonly disabled: {
        readonly isDisabled: "";
        readonly nonDisabled: "";
    };
    readonly formLayout: {
        readonly isFormLayout: "";
        readonly nonFormLayout: "";
    };
    readonly readonlyForm: {
        readonly isReadonlyForm: "";
        readonly notReadonlyForm: "";
    };
    readonly value: {
        readonly hasValue: "";
        readonly noValue: "";
    };
    readonly valueOrFocus: {
        readonly hasValueOrFocus: "";
        readonly noValueOrFocus: "";
    };
    readonly userAssistanceDensity: {
        readonly compact: string;
        readonly efficient: "";
        readonly reflow: "";
    };
    readonly animatedWhenInside: {
        readonly isAnimated: "";
        readonly notAnimated: "";
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };
