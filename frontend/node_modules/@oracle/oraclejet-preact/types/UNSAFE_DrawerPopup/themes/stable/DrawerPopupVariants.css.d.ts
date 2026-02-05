/*******************
 * Variants Utility
 *******************/
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    placement: {
        left: {
            boxShadow: string;
            top: number;
            bottom: number;
            left: number;
        };
        right: {
            boxShadow: string;
            top: number;
            bottom: number;
            right: number;
        };
        bottom: {
            boxShadow: string;
            bottom: number;
            left: number;
            right: number;
        };
    };
    visibility: {
        visible: string;
        hidden: string;
    };
    displayModeHorizontal: {
        overlay: {
            maxWidth: string;
            minWidth: string;
        };
        fullOverlay: {
            width: string;
            maxWidth: string;
        };
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };
