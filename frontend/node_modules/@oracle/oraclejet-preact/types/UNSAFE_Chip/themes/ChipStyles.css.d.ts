import { ComponentThemeType, VariantOptions } from '../../UNSAFE_Theme';
type ChipVariants = typeof variants;
type ChipVariantOptions = VariantOptions<ChipVariants>;
type ChipStyles = typeof styles;
type ChipTheme = ComponentThemeType<ChipVariants, ChipStyles>;
declare const styles: {
    base: string;
};
/*******************
 * Style Variants
 *******************/
declare const variants: {
    readonly disabled: {
        readonly isDisabled: {
            readonly backgroundColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly cursor: "auto";
        };
        readonly notDisabled: {};
    };
    readonly hover: {
        readonly isHover: {
            readonly backgroundImage: `linear-gradient(var(--${string}), var(--${string}))` | `linear-gradient(var(--${string}), var(--${string}, ${string}))` | `linear-gradient(var(--${string}), var(--${string}, ${number}))` | `linear-gradient(var(--${string}, ${string}), var(--${string}))` | `linear-gradient(var(--${string}, ${string}), var(--${string}, ${string}))` | `linear-gradient(var(--${string}, ${string}), var(--${string}, ${number}))` | `linear-gradient(var(--${string}, ${number}), var(--${string}))` | `linear-gradient(var(--${string}, ${number}), var(--${string}, ${string}))` | `linear-gradient(var(--${string}, ${number}), var(--${string}, ${number}))`;
            readonly color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly notHover: {};
    };
    readonly pseudoHover: {
        readonly isPseudoHover: {
            readonly '@media': {
                '(hover: hover)': {
                    selectors: {
                        '&:hover:not(:active)': object;
                    };
                };
            };
        };
        readonly notPseudoHover: {};
    };
    readonly active: {
        readonly isActive: {
            readonly backgroundColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly notActive: {};
    };
};
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    readonly disabled: {
        readonly isDisabled: {
            readonly backgroundColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly cursor: "auto";
        };
        readonly notDisabled: {};
    };
    readonly hover: {
        readonly isHover: {
            readonly backgroundImage: `linear-gradient(var(--${string}), var(--${string}))` | `linear-gradient(var(--${string}), var(--${string}, ${string}))` | `linear-gradient(var(--${string}), var(--${string}, ${number}))` | `linear-gradient(var(--${string}, ${string}), var(--${string}))` | `linear-gradient(var(--${string}, ${string}), var(--${string}, ${string}))` | `linear-gradient(var(--${string}, ${string}), var(--${string}, ${number}))` | `linear-gradient(var(--${string}, ${number}), var(--${string}))` | `linear-gradient(var(--${string}, ${number}), var(--${string}, ${string}))` | `linear-gradient(var(--${string}, ${number}), var(--${string}, ${number}))`;
            readonly color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly notHover: {};
    };
    readonly pseudoHover: {
        readonly isPseudoHover: {
            readonly '@media': {
                '(hover: hover)': {
                    selectors: {
                        '&:hover:not(:active)': object;
                    };
                };
            };
        };
        readonly notPseudoHover: {};
    };
    readonly active: {
        readonly isActive: {
            readonly backgroundColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly notActive: {};
    };
}>;
export type { ChipVariantOptions, ChipStyles, ChipTheme };
export { multiVariantStyles, variants, styles };
