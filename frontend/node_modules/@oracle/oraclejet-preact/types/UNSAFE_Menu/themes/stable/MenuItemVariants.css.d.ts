declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    readonly variant: {
        readonly standard: {
            selectors: {
                '&:active': object;
            };
        };
        readonly destructive: {
            vars: {
                [x: string]: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            };
            selectors: {
                '&:active': object;
            };
        };
        readonly disabled: {
            vars: {
                [x: string]: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            };
            cursor: string;
        };
    };
    readonly focusRing: {
        readonly isFocusRing: "";
        readonly notFocusRing: "";
    };
    readonly containerFocused: {
        readonly isContainerFocused: "";
        readonly notContainerFocused: "";
    };
    readonly current: {
        readonly isCurrent: "";
        readonly notCurrent: "";
    };
    readonly submenuOpen: {
        readonly isSubmenuOpen: "";
        readonly notSubmenuOpen: "";
    };
}>;
export { multiVariantStyles };
