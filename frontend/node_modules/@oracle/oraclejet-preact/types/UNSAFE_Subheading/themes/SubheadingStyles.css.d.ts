import { ComponentThemeType, VariantOptions } from '../../UNSAFE_Theme';
type SubheadingVariants = typeof variants;
type SubheadingVariantOptions = VariantOptions<SubheadingVariants>;
type SubheadingStyles = typeof styles;
type SubheadingTheme = ComponentThemeType<SubheadingVariants, SubheadingStyles>;
declare const styles: {
    base: string;
};
/*******************
 * Style Variants
 *******************/
declare const variants: {
    readonly size: {
        readonly '2xs': {
            readonly fontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly lineHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly xs: {
            readonly fontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly lineHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly sm: {
            readonly fontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly lineHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly md: {
            readonly fontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly lineHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly lg: {
            readonly fontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly lineHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly xl: {
            readonly fontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly lineHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly '2xl': {
            readonly fontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly lineHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly inherit: {
            readonly fontSize: "inherit";
            readonly fontWeight: "inherit";
            readonly lineHeight: "inherit";
        };
    };
    readonly variant: {
        readonly primary: {
            readonly color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly secondary: {
            readonly color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly disabled: {
            readonly color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly inherit: {
            readonly color: "inherit";
        };
    };
};
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    readonly size: {
        readonly '2xs': {
            readonly fontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly lineHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly xs: {
            readonly fontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly lineHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly sm: {
            readonly fontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly lineHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly md: {
            readonly fontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly lineHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly lg: {
            readonly fontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly lineHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly xl: {
            readonly fontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly lineHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly '2xl': {
            readonly fontSize: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly fontWeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            readonly lineHeight: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly inherit: {
            readonly fontSize: "inherit";
            readonly fontWeight: "inherit";
            readonly lineHeight: "inherit";
        };
    };
    readonly variant: {
        readonly primary: {
            readonly color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly secondary: {
            readonly color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly disabled: {
            readonly color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        readonly inherit: {
            readonly color: "inherit";
        };
    };
}>;
export type { SubheadingVariantOptions, SubheadingStyles, SubheadingTheme };
export { multiVariantStyles, variants, styles };
