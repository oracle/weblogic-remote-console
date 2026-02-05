import { ComponentThemeType, CompoundVariantStyles, VariantOptions } from "../../UNSAFE_Theme";
type PrefixSuffixVariants = typeof variants;
type PrefixSuffixVariantOptions = VariantOptions<PrefixSuffixVariants>;
type PrefixSuffixStyles = typeof styles;
type PrefixSuffixTheme = ComponentThemeType<PrefixSuffixVariants, PrefixSuffixStyles>;
/*******************
 * Component Styles
 *******************/
declare const styles: {
    base: string;
};
declare const variants: {
    variant: {
        prefix: string;
        suffix: string;
    };
    isFocused: {
        yes: {
            opacity: string;
        };
        no: {};
    };
    isDisabled: {
        yes: {
            color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        no: {};
    };
    hasInsideLabel: {
        yes: {
            minHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            paddingTop: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        no: {};
    };
    hasStartContent: {
        yes: {};
        no: {};
    };
    hasEndContent: {
        yes: {};
        no: {};
    };
};
declare const compoundVariants: CompoundVariantStyles<PrefixSuffixVariantOptions>;
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    variant: {
        prefix: string;
        suffix: string;
    };
    isFocused: {
        yes: {
            opacity: string;
        };
        no: {};
    };
    isDisabled: {
        yes: {
            color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        no: {};
    };
    hasInsideLabel: {
        yes: {
            minHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            paddingTop: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        no: {};
    };
    hasStartContent: {
        yes: {};
        no: {};
    };
    hasEndContent: {
        yes: {};
        no: {};
    };
}>;
export type { PrefixSuffixVariantOptions, PrefixSuffixStyles, PrefixSuffixTheme };
export { multiVariantStyles, variants, compoundVariants, styles };
