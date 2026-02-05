/*******************
 * Component Theme
 *******************/
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    align: {
        start: string;
        end: string;
    };
    visible: {
        hide: string;
        show: string;
    };
    container: {
        reflow: string;
        efficient: string;
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };
