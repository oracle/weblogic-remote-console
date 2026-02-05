import { ComponentThemeType, CompoundVariantStyles, VariantOptions } from "../../UNSAFE_Theme";
type ReadonlyTextFieldInputVariants = typeof variants;
type ReadonlyTextFieldInputVariantOptions = VariantOptions<ReadonlyTextFieldInputVariants>;
type ReadonlyTextFieldInputStyles = typeof styles;
type ReadonlyTextFieldInputTheme = ComponentThemeType<ReadonlyTextFieldInputVariants, ReadonlyTextFieldInputStyles>;
declare const readOnlyTextFieldInputBase: string;
declare const styles: {};
/*******************
 * Component Variants
 *******************/
declare const variants: {
    textarea: {
        isTextArea: string;
        notTextArea: string;
    };
    formLayout: {
        isFormLayout: string;
        notFormLayout: string;
    };
    readonlyForm: {
        isReadonlyForm: string;
        notReadonlyForm: string;
    };
    insideLabel: {
        hasInsideLabel: string;
        noInsideLabel: string;
    };
};
declare const compoundVariants: CompoundVariantStyles<ReadonlyTextFieldInputVariantOptions>;
export type { ReadonlyTextFieldInputVariantOptions, ReadonlyTextFieldInputStyles, ReadonlyTextFieldInputTheme };
export { variants, compoundVariants, readOnlyTextFieldInputBase };
