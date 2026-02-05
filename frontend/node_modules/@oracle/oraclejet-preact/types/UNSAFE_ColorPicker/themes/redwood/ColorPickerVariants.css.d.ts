/*******************
 * Variants Utility
 *******************/
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    [x: string]: {
        [x: string]: string | import("@vanilla-extract/css").ComplexStyleRule;
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };
