import { ComponentThemeType, VariantOptions } from '../../UNSAFE_Theme';
type IndexerItemVariants = typeof indexerItemVariants;
type IndexerItemVariantOptions = VariantOptions<IndexerItemVariants>;
type IndexerStyles = typeof styles;
type IndexerTheme = ComponentThemeType<IndexerItemVariants, IndexerStyles>;
declare const styles: {
    baseStyle: string;
    innerStyle: string;
    indexerItemBaseStyle: string;
    dotStyle: string;
};
/*******************
 * IndexerItem Style Variants
 *******************/
declare const indexerItemVariants: {
    readonly disabled: {
        readonly isDisabled: string;
        readonly notDisabled: "";
    };
    readonly selected: {
        readonly isSelected: string;
        readonly notSelected: "";
    };
    readonly focused: {
        readonly isFocused: string;
        readonly notFocused: "";
    };
};
export type { IndexerItemVariantOptions, IndexerStyles, IndexerTheme };
export { indexerItemVariants, styles };
