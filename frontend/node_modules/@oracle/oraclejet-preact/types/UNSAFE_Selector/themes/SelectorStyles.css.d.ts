import { ComponentThemeType, VariantOptions } from '../../UNSAFE_Theme';
type SelectorVariants = typeof variants;
type SelectorVariantOptions = VariantOptions<SelectorVariants>;
type SelectorStyles = typeof styles;
type SelectorTheme = ComponentThemeType<SelectorVariants, SelectorStyles>;
declare const styles: {
    base: string;
    container: string;
    checkbox: string;
};
/*******************
 * Style Variants
 *******************/
declare const variants: {
    readonly checked: {
        readonly isChecked: {
            color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly isPartiallyChecked: {
            color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly notChecked: {
            color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
    };
    readonly active: {
        readonly isActive: {
            transform: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            transitionProperty: string;
            transitionDuration: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            transitionTimingFunction: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly notActive: "";
    };
};
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    readonly checked: {
        readonly isChecked: {
            color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly isPartiallyChecked: {
            color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly notChecked: {
            color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
    };
    readonly active: {
        readonly isActive: {
            transform: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            transitionProperty: string;
            transitionDuration: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            transitionTimingFunction: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly notActive: "";
    };
}>;
export type { SelectorVariantOptions, SelectorStyles, SelectorTheme };
export { multiVariantStyles, variants, styles };
