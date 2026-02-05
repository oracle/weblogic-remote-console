import { ComponentThemeType, VariantOptions } from '../../UNSAFE_Theme';
type ButtonLayoutVariants = typeof variants;
type ButtonLayoutVariantOptions = VariantOptions<ButtonLayoutVariants>;
type ButtonLayoutStyles = typeof styles;
type ButtonLayoutTheme = ComponentThemeType<ButtonLayoutVariants, ButtonLayoutStyles>;
declare const styles: {
    base: string;
};
declare const variants: {
    spacing: {
        lg: {
            vars: {
                columnGap: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            };
        };
        sm: {
            vars: {
                columnGap: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
            };
        };
    };
};
export type { ButtonLayoutVariantOptions, ButtonLayoutStyles, ButtonLayoutTheme };
export { styles, variants };
