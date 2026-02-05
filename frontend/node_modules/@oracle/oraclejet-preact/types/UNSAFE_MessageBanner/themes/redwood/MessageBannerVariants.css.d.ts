/*******************
 * Variants Utility
 *******************/
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    severity: {
        error: {
            vars: {
                [x: string]: import("@vanilla-extract/private").CSSVarFunction;
            };
        };
        warning: {
            vars: {
                [x: string]: import("@vanilla-extract/private").CSSVarFunction;
            };
        };
        confirmation: string;
        info: string;
        none: string;
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };
