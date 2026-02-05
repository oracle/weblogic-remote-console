/*******************
 * Variants Utility
 *******************/
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    size: {
        sm: {
            vars: {
                [x: string]: string;
            };
        };
        md: {
            vars: {
                [x: string]: string;
            };
        };
        lg: {
            vars: {
                [x: string]: string;
            };
        };
    };
    color: {
        neutral: {};
        gold: {
            vars: {
                [x: string]: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            };
        };
        success: {
            vars: {
                [x: string]: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            };
        };
        warning: {
            vars: {
                [x: string]: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            };
        };
        danger: {
            vars: {
                [x: string]: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            };
        };
    };
    selectionState: {
        isSelected: string;
        isNotSelected: string;
    };
    disabledState: {
        isDisabled: string;
        isNotDisabled: string;
    };
    readonlyState: {
        isReadonly: string;
        isNotReadonly: string;
    };
    highContrastState: {
        isHighContrast: string;
        isNotHighContrast: string;
    };
}>;
/*******************
 * Exports
 *******************/
export { multiVariantStyles };
