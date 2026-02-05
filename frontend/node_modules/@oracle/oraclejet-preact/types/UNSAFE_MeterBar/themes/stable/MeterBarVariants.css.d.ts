/*******************
 * Variants Utility
 *******************/
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    readonly size: {
        readonly sm: {
            readonly vars: {
                readonly [x: string]: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            };
        };
        readonly md: {
            readonly vars: {
                readonly [x: string]: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            };
        };
        readonly lg: {
            readonly vars: {
                readonly [x: string]: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            };
        };
        readonly fit: {
            readonly vars: {
                readonly [x: string]: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            };
        };
    };
    readonly orientation: {
        readonly horizontal: string;
        readonly vertical: string;
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };
