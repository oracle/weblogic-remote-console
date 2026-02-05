/* @oracle/oraclejet-preact: undefined */
/**
 * @license
 * Copyright (c) 2011 %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * pushProps
 * @param target
 * @param key
 * @param value
 * @returns
 */
function pushProp(target, key, value) {
    if (key === 'class') {
        const oldClass = target['class'];
        target['class'] = oldClass ? [oldClass, value].join(' ').trim() : value;
    }
    else if (key === 'style') {
        if (typeof value == 'object') {
            target['style'] = { ...target['style'], ...value };
        }
        else {
            throw new Error(`Unable to merge prop '${key}'. ` + `Only support 'style' objects not 'style' strings`);
        }
    }
    else if (typeof value === 'function') {
        const oldFn = target[key];
        target[key] = oldFn
            ? (...args) => {
                oldFn(...args);
                value(...args);
            }
            : value;
    }
    else if (
    // skip undefined values
    value === undefined ||
        // skip if same
        (typeof value !== 'object' && value === target[key])) {
        return;
    }
    else if (!(key in target)) {
        target[key] = value;
    }
    else if (key === 'aria-describedby' ||
        key === 'aria-labelledby' ||
        key === 'aria-owns' ||
        key === 'aria-controls' ||
        key === 'aria-details') {
        // concatenate values together using a space delimiter as per
        // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes
        const oldAria = target[key];
        target[key] = oldAria ? [oldAria, value].join(' ').trim() : value;
    }
    else {
        // Currently the primary use of this utility is to merge together the spread properties returned by multiple hooks.
        // Given that we don't want to overwrite a property that was returned from one hook with the value from another hook.
        // Potentially it will break functionality of the hook whose value was overwritten. That is why we prefer to throw an error
        // instead of merging the given properties. We can revisit this if we ever run into a case where our hooks
        // produce conflicting properties.
        throw new Error(`Unable to merge prop '${key}'. ` +
            `Only support 'className', 'style', some aria properties, and event handlers`);
    }
}
/**
 * Merges allProps together:
 *  - duplicate className and class allProps concatenated
 *  - duplicate style allProps merged - note that only style objects supported at this point
 *  - duplicate functions chained
 * @param allProps Props to merge together.
 */
function mergeProps(...allProps) {
    if (allProps.length === 1) {
        return allProps[0];
    }
    return allProps.reduce((merged, props) => {
        for (const key in props) {
            pushProp(merged, key, props[key]);
        }
        return merged;
    }, {});
}

export { mergeProps as m };
//# sourceMappingURL=mergeProps-88ea8306.js.map
