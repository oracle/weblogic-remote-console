/* @oracle/oraclejet-preact: undefined */
'use strict';

var hooks = require('preact/hooks');

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Hook to track focus item ref and ensure focus item is always
 * in view.
 */
function useItemFocus(focusedItem) {
    const focusedItemRef = hooks.useRef(null);
    hooks.useEffect(() => {
        if (focusedItem?.isFocusVisible) {
            focusedItemRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'nearest'
            });
        }
    }, [focusedItem]);
    return { focusedItemRef };
}

exports.useItemFocus = useItemFocus;
//# sourceMappingURL=useItemFocus-0c5fbee7.js.map
