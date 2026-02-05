import { ComponentThemeType, VariantOptions } from '../../UNSAFE_Theme';
type ModalVariants = typeof variants;
type ModalVariantOptions = VariantOptions<ModalVariants>;
type ModalStyles = typeof styles;
type ModalTheme = ComponentThemeType<ModalVariants, ModalStyles>;
/*******************
 * Component Styles
 *******************/
declare const baseStyle: string;
declare const styles: {
    readonly backdropStyle: string;
};
/*******************
 * Component Variants
 *******************/
declare const variants: {
    backdrop: {
        scrim: string;
        transparent: string;
    };
};
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    backdrop: {
        scrim: string;
        transparent: string;
    };
}>;
export type { ModalTheme, ModalVariantOptions, ModalStyles };
export { baseStyle, styles, multiVariantStyles, variants };
