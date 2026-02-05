import { ComponentThemeType, VariantOptions } from '../../UNSAFE_Theme';
type ComponentMessageVariants = typeof variants;
type ComponentMessageVariantOptions = VariantOptions<ComponentMessageVariants>;
type ComponentMessageStyles = typeof styles;
type ComponentMessageTheme = ComponentThemeType<ComponentMessageVariants, ComponentMessageStyles>;
declare const componentMessageBase: string;
declare const componentMessageContainerBase: string;
declare const variants: {
    severity: {
        error: string;
        warning: string;
        confirmation: string;
        info: string;
        none: string;
    };
};
declare const styles: {};
export type { ComponentMessageVariantOptions, ComponentMessageTheme, ComponentMessageStyles };
export { componentMessageBase, variants, componentMessageContainerBase };
