/* @oracle/oraclejet-preact: undefined */
import { useRef, useEffect } from 'preact/hooks';

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
    const focusedItemRef = useRef(null);
    useEffect(() => {
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

export { useItemFocus as u };
//# sourceMappingURL=useItemFocus-c12e2756.js.map
