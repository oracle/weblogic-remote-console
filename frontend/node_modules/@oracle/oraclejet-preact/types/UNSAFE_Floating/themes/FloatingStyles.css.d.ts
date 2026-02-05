import { ComponentThemeType, VariantOptions } from '../../UNSAFE_Theme';
type FloatingVariants = typeof variants;
type FloatingVariantOptions = VariantOptions<FloatingVariants>;
type FloatingStyles = typeof styles;
type FloatingTheme = ComponentThemeType<FloatingVariants, FloatingStyles>;
/*******************
 * Component Styles
 *******************/
declare const baseStyle: string;
declare const floatingVisibilityStyles: {
    visible: string;
    hidden: string;
};
declare const styles: {
    readonly baseStyle: string;
    readonly floatingTailBaseStyle: string;
};
/*******************
 * Component Variants
 *******************/
declare const variants: {};
export type { FloatingTheme, FloatingVariantOptions, FloatingStyles };
export { baseStyle, floatingVisibilityStyles, styles, variants };
