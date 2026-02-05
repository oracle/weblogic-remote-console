import { ComponentThemeType, CompoundVariantStyles, VariantOptions } from "../../UNSAFE_Theme";
type LabelledLinkVariants = typeof variants;
type LabelledLinkVariantOptions = VariantOptions<LabelledLinkVariants>;
type LabelledLinkStyles = typeof styles;
type LabelledLinkTheme = ComponentThemeType<LabelledLinkVariants, LabelledLinkStyles>;
declare const base: string;
declare const styles: {};
/**********************
 * Component Variants *
 **********************/
declare const variants: {
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
declare const compoundVariants: CompoundVariantStyles<LabelledLinkVariantOptions>;
/***********
 * Exports *
 ***********/
export type { LabelledLinkVariantOptions, LabelledLinkStyles, LabelledLinkTheme };
export { variants, compoundVariants, base };
