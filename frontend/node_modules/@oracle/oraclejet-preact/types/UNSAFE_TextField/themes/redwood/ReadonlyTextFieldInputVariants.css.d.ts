declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    textarea: {
        isTextArea: string;
        notTextArea: string;
    };
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
