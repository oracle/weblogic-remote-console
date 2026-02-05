/*******************
 * Variants Utility
 *******************/
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    spacing: {
        lg: {
            vars: {
                columnGap: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            };
        };
        sm: {
            vars: {
                columnGap: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            };
        };
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };
