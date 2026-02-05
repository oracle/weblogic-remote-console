/*******************
 * Variants Utility
 *******************/
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    readonly edge: {
        readonly none: {
            borderRadius: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };
