/*******************
 * Variants Utility
 *******************/
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    readonly disabledState: {
        readonly isDisabled: {
            backgroundColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            borderColor: string;
            cursor: string;
        };
    };
    readonly hoveredState: {
        readonly isHover: string;
    };
    readonly pseudoHoveredState: {
        readonly isPseudoHover: {
            '@media': {
                '(hover: hover)': {
                    selectors: {
                        '&:hover:not(:active)': object;
                    };
                };
            };
        };
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };
