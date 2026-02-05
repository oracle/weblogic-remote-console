import { ComponentThemeType, VariantOptions } from '../../UNSAFE_Theme';
type GroupedListVariants = typeof variants;
type ListGroupHeaderVariantOptions = VariantOptions<GroupedListVariants>;
type GroupedListStyles = typeof styles;
type GroupedListTheme = ComponentThemeType<GroupedListVariants, GroupedListStyles>;
declare const styles: {
    stuckHeader: string;
};
/*******************
 * Style Variants
 *******************/
declare const variants: {};
declare const multiVariantStyles: import("@vanilla-extract/recipes").RuntimeFn<{
    [x: string]: {
        [x: string]: string | import("@vanilla-extract/css").ComplexStyleRule;
    };
}>;
export type { ListGroupHeaderVariantOptions, GroupedListStyles, GroupedListTheme };
export { styles, variants, multiVariantStyles };
