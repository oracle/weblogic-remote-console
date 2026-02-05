import { ComponentThemeType, VariantOptions } from '../../UNSAFE_Theme';
type CollapsibleVariants = typeof variants;
type CollapsibleVariantOptions = VariantOptions<CollapsibleVariants>;
type CollapsibleStyles = typeof styles;
type CollapsibleTheme = ComponentThemeType<CollapsibleVariants, CollapsibleStyles>;
/*******************
 * Component Styles
 *******************/
declare const baseStyle: string;
declare const styles: {
    readonly headerChildrenStyle: string;
    readonly iconStartStyle: string;
    readonly iconEndStyle: string;
    readonly chevronStyle: string;
    readonly contentHiddenStyle: string;
    readonly contentChildrenStyle: string;
};
/*******************
 * Component Variants
 *******************/
declare const variants: {
    disabled: {
        isDisabled: {
            cursor: string;
            color: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        notDisabled: string;
    };
    divider: {
        hasDivider: {
            paddingBottom: string;
        };
        noDivider: string;
    };
    focused: {
        isFocused: {
            outlineStyle: string;
            outlineOffset: string;
            outlineWidth: string;
            outlineColor: `var(--${string})` | `var(--${string}, ${string})` | `var(--${string}, ${number})`;
        };
        notFocused: string;
    };
};
export type { CollapsibleTheme, CollapsibleVariantOptions, CollapsibleStyles };
export { baseStyle, styles, variants };
