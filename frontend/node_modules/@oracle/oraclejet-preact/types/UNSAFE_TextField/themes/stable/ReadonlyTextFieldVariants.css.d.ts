declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    insideNonReadonlyForm: {
        isInsideNonReadonlyForm: {
            borderWidth: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            borderColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            backgroundColor: string;
            height: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            minWidth: string;
            flex: string;
        };
        notInsideNonReadonlyForm: {
            borderWidth: string;
            backgroundColor: string;
            height: string;
            verticalAlign: string;
        };
    };
    insideLabel: {
        hasInsideLabel: string;
        noInsideLabel: string;
    };
    textarea: {
        isTextArea: {
            height: string;
        };
        notTextArea: string;
    };
    loading: {
        isLoading: string;
        notLoading: string;
    };
    inputGroupPosition: {
        groupLeft: string;
        groupRight: string;
        groupMiddle: string;
    };
    withinGroup: {
        isWithinGroup: string;
    };
    resize: {
        horizontal: {
            resize: import("csstype").Property.Resize;
        };
        vertical: {
            resize: import("csstype").Property.Resize;
        };
        both: {
            resize: import("csstype").Property.Resize;
        };
        none: {
            maxWidth: string;
            overflow: import("csstype").Property.Overflow;
        };
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };
