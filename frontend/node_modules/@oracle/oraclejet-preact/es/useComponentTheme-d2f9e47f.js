/* @oracle/oraclejet-preact: undefined */
import { w as warn } from './logger-c92f309c.js';

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * A hook for getting the classes associated with a component within the theming system
 */
const useComponentTheme = (componentTheme, options) => {
    const { multiVariantStyles, styles, variants = [], baseTheme = '' } = componentTheme || {};
    // Here we filter down from the keys in the options parameter that match the list of variants
    const variantsFromOptions = Object.keys(variants).reduce((acc, cur) => {
        acc[cur] = options?.[cur];
        return acc;
    }, {});
    if (!multiVariantStyles) {
        warn(`You are missing a theme for your component. You may need to create one or provide a theme in your Environment context.`);
    }
    const variantClasses = multiVariantStyles ? multiVariantStyles(variantsFromOptions) : '';
    // returned here are the styles defined in the component theme, and the classes.
    // classes always includes the baseTheme class defined in the component theme.
    // we also append the classes returned from the multiVariantStyles function
    return {
        styles: styles,
        baseTheme,
        variantClasses,
        classes: `${baseTheme} ${variantClasses}`
    };
};

export { useComponentTheme as u };
//# sourceMappingURL=useComponentTheme-d2f9e47f.js.map
