import { ComponentThemeType, VariantOptions } from '../../UNSAFE_Theme';
type MessageToastVariants = typeof variants;
type MessageToastVariantOptions = VariantOptions<MessageToastVariants>;
type MessageToastStyles = typeof styles;
type MessageToastTheme = ComponentThemeType<MessageToastVariants, MessageToastStyles>;
/*******************
 * Component Styles
 *******************/
declare const styles: {
    readonly base: string;
};
/*******************
 * Component Variants
 *******************/
declare const variants: {};
export type { MessageToastTheme, MessageToastVariantOptions, MessageToastStyles };
export { styles, variants };
