declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    styleVariant: {
        default: {
            fontSize: string;
        };
        embedded: string;
    };
    textarea: {
        isTextArea: string;
        notTextArea: string;
    };
    input: {
        isInput: string;
        notInput: string;
    };
    div: {
        isDiv: string;
        notDiv: string;
    };
    insideLabel: {
        hasInsideLabel: {
            minHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            paddingTop: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            paddingBottom: number;
            selectors: {
                '&:hover': {
                    backgroundColor: string;
                };
            };
        };
        noInsideLabel: string;
    };
    disabled: {
        isDisabled: {
            color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        notDisabled: {
            color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
    };
    type: {
        isPassword: {
            selectors: {
                '&::-ms-reveal': {
                    display: string;
                };
            };
        };
        notPassword: string;
    };
    startContent: {
        hasStartContent: {
            paddingInlineStart: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        noStartContent: string;
    };
    endContent: {
        hasEndContent: string;
        noEndContent: string;
    };
    prefix: {
        hasPrefix: {
            paddingInlineStart: string;
        };
        noPrefix: string;
    };
    suffix: {
        hasSuffix: string;
        noSuffix: string;
    };
    value: {
        hasValue: string;
        noValue: string;
    };
    focused: {
        isFocused: string;
        notFocused: string;
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };
