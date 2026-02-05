/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentThemeType } from '../../UNSAFE_Theme';
type Options = Record<string, unknown>;
/**
 * A hook for getting the classes associated with a component within the theming system
 */
declare const useComponentTheme: <VariantObjects extends Options, Styles = Record<string, never>>(componentTheme?: ComponentThemeType<unknown, unknown>, options?: VariantObjects) => {
    styles: Styles;
    baseTheme: any;
    variantClasses: any;
    classes: string;
};
export { useComponentTheme };
