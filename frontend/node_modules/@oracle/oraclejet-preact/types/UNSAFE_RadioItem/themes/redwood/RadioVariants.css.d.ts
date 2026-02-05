/*******************
 * Variants Utility
 *******************/
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    readonly disabled: {
        readonly isDisabled: string;
        readonly notDisabled: string;
    };
    readonly focused: {
        readonly isFocused: string;
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };
