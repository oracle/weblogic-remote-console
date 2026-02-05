import { ComponentThemeType, VariantOptions } from '../../UNSAFE_Theme';
type RadioVariants = typeof variants;
type RadioVariantOptions = VariantOptions<RadioVariants>;
type RadioStyles = typeof styles;
type RadioTheme = ComponentThemeType<RadioVariants, RadioStyles>;
/*******************
 * Component Styles
 *******************/
declare const radioBaseStyle: string;
declare const valueLabelStyle: string;
declare const radioDefaultColor: string;
declare const radioDisabledColor: string;
/*******************
 * Style Variants
 *******************/
declare const variants: {
    readonly disabled: {
        readonly isDisabled: string;
        readonly notDisabled: string;
    };
    readonly focused: {
        readonly isFocused: string;
    };
};
declare const styles: {
    radioBaseStyle: string;
    valueLabelStyle: string;
};
export type { RadioVariantOptions, RadioStyles, RadioTheme };
export { radioBaseStyle, valueLabelStyle, radioDefaultColor, radioDisabledColor, styles, variants };
