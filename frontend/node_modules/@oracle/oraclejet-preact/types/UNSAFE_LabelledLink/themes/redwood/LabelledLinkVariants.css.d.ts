declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    formLayout: {
        isFormLayout: string;
        notFormLayout: string;
    };
    readonlyForm: {
        isReadonlyForm: string;
        notReadonlyForm: string;
    };
    insideLabel: {
        hasInsideLabel: string;
        noInsideLabel: string;
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };
