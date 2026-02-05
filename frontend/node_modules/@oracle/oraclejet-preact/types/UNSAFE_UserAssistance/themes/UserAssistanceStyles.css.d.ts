import { ComponentThemeType, VariantOptions } from '../../UNSAFE_Theme';
type UserAssistanceVariants = typeof variants;
type UserAssistanceVariantOptions = VariantOptions<UserAssistanceVariants>;
type UserAssistanceStyles = typeof styles;
type UserAssistanceTheme = ComponentThemeType<UserAssistanceVariants, UserAssistanceStyles>;
declare const assistiveStyles: string;
declare const dividerStyle: string;
declare const helpIconBase: string;
declare const helpIconLabelEdgeStart: string;
declare const helpContentStyles: string;
declare const requiredIconBase: string;
declare const requiredIconLabelEdgeStart: string;
declare const iconUserAssistanceIcon: string;
declare const iconUserAssistancePopupFocus: string;
/*******************
 * Component Variants
 *******************/
declare const variants: {
    align: {
        start: string;
        end: string;
    };
    visible: {
        hide: string;
        show: string;
    };
    container: {
        reflow: string;
        efficient: string;
    };
};
declare const styles: {
    helpTextStyles: string;
    helpSourceStyles: string;
    inlineContainerBaseStyles: string;
};
export type { UserAssistanceVariantOptions, UserAssistanceStyles, UserAssistanceTheme };
export { styles, assistiveStyles, dividerStyle, helpIconBase, helpIconLabelEdgeStart, helpContentStyles, requiredIconBase, requiredIconLabelEdgeStart, iconUserAssistanceIcon, iconUserAssistancePopupFocus, variants };
