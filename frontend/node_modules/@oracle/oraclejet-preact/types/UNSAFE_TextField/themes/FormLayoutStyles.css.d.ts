import { ComponentThemeType, VariantOptions } from '../../UNSAFE_Theme';
type FormLayoutVariants = typeof variants;
type FormLayoutVariantOptions = VariantOptions<FormLayoutVariants>;
type FormLayoutStyles = typeof styles;
type FormLayoutTheme = ComponentThemeType<FormLayoutVariants, FormLayoutStyles>;
/*******************
 * Component Styles
 *******************/
declare const styles: {};
/*******************
 * Component Variants
 *******************/
declare const variants: {};
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    [x: string]: {
        [x: string]: string | import("@vanilla-extract/css").ComplexStyleRule;
    };
}>;
export type { FormLayoutTheme, FormLayoutVariantOptions, FormLayoutStyles };
export { styles, variants, multiVariantStyles };
