/*******************
 * Variants Utility
 *******************/
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    readonly disabled: {
        readonly isDisabled: "";
        readonly notDisabled: "";
    };
    readonly checked: {
        readonly isChecked: "";
        readonly notChecked: "";
    };
    readonly readonly: {
        readonly isReadonly: "";
        readonly notReadonly: "";
    };
    readonly active: {
        readonly isActive: "";
        readonly notActive: "";
    };
    readonly focus: {
        readonly isFocused: string;
        readonly notFocused: "";
    };
    readonly iconSize: {
        readonly '4xUnits': {
            readonly vars: {
                readonly [x: string]: string;
            };
        };
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };
