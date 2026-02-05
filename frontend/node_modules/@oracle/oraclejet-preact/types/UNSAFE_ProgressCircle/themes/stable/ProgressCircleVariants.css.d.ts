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
    };
    readonly type: {
        readonly indeterminate: {
            animationName: string;
            animationDuration: string;
            animationTimingFunction: string;
            animationIterationCount: string;
        };
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };
