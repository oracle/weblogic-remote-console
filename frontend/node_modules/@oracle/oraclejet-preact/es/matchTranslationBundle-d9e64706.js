/* @oracle/oraclejet-preact: undefined */
/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * This utility matches an array of preferred locales with a set of supported locales and
 * returns the best match for the user's preferred locale or null if none is found.
 * It is recommended to use this method when you need to load a translation bundle for RootEnvironmentProvider.
 * @returns the best match for user's preferred locale or null if none is found
 * @param preferredLocales - a list of user's preferred locales ordered from the most preferred to the least preferred
 * @param supportedLocales - a set of locales supported by the application
 */
function matchTranslationBundle(preferredLocales, supportedLocales) {
    let match = null;
    for (let l = 0; match === null && l < preferredLocales.length; l++) {
        const locale = preferredLocales[l];
        if (supportedLocales.has(locale)) {
            match = locale;
        }
        else {
            match = _findPartialMatch(locale, supportedLocales);
        }
    }
    return match;
}
function _findPartialMatch(locale, supportedLocales) {
    let match = null;
    const sep = '-';
    const parts = locale.split(sep);
    while (match === null && parts.length > 1) {
        parts.pop();
        const partial = parts.join(sep);
        if (supportedLocales.has(partial)) {
            match = partial;
        }
    }
    return match;
}

export { matchTranslationBundle as m };
//# sourceMappingURL=matchTranslationBundle-d9e64706.js.map
