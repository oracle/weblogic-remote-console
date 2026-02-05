import { ComponentThemeType, VariantOptions } from '../../UNSAFE_Theme';
type SeparatorVariant = typeof variants;
type SeparatorVariantOptions = VariantOptions<SeparatorVariant>;
type SeparatorStyles = typeof styles;
type SeparatorTheme = ComponentThemeType<SeparatorVariant, SeparatorStyles>;
declare const variants: {
    orientation: {
        horizontal: {
            borderWidth: string;
        };
        vertical: {
            display: string;
            borderWidth: string;
            height: string;
        };
    };
};
declare const styles: {
    separatorBase: string;
    separatorVerticalWrapper: string;
};
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    orientation: {
        horizontal: {
            borderWidth: string;
        };
        vertical: {
            display: string;
            borderWidth: string;
            height: string;
        };
    };
}>;
export type { SeparatorStyles, SeparatorTheme, SeparatorVariantOptions };
export { variants, styles, multiVariantStyles };
