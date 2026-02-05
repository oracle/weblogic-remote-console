/*******************
 * Variants Utility
 *******************/
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    disabled: {
        isDisabled: {
            cursor: string;
            color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        notDisabled: string;
    };
    divider: {
        hasDivider: {
            paddingBottom: string;
        };
        noDivider: string;
    };
    focused: {
        isFocused: {
            outlineStyle: string;
            outlineOffset: string;
            outlineWidth: string;
            outlineColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        notFocused: string;
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };
