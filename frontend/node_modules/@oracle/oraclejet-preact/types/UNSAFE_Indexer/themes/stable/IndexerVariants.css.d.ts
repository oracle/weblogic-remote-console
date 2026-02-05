/*******************
 * Component Theme
 *******************/
/*******************
 * Variants Utility
 *******************/
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    readonly disabled: {
        readonly isDisabled: string;
        readonly notDisabled: "";
    };
    readonly selected: {
        readonly isSelected: string;
        readonly notSelected: "";
    };
    readonly focused: {
        readonly isFocused: string;
        readonly notFocused: "";
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };
