import { ComponentThemeType, VariantOptions } from '../../UNSAFE_Theme';
type DrawerPopupVariants = typeof variants;
type DrawerPopupVariantOptions = VariantOptions<DrawerPopupVariants>;
type DrawerPopupTheme = ComponentThemeType<DrawerPopupVariants>;
/*******************
 * Component Styles
 *******************/
declare const baseStyle: string;
declare const variants: {
    placement: {
        left: {
            boxShadow: string;
            top: number;
            bottom: number;
            left: number;
        };
        right: {
            boxShadow: string;
            top: number;
            bottom: number;
            right: number;
        };
        bottom: {
            boxShadow: string;
            bottom: number;
            left: number;
            right: number;
        };
    };
    visibility: {
        visible: string;
        hidden: string;
    };
    displayModeHorizontal: {
        overlay: {
            maxWidth: string;
            minWidth: string;
        };
        fullOverlay: {
            width: string;
            maxWidth: string;
        };
    };
};
export type { DrawerPopupVariantOptions, DrawerPopupTheme };
export { variants, baseStyle };
