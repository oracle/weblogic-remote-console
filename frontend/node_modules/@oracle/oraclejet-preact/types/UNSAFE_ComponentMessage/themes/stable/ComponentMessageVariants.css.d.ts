/*******************
 * Variants Utility
 *******************/
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    severity: {
        error: string;
        warning: string;
        confirmation: string;
        info: string;
        none: string;
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };
