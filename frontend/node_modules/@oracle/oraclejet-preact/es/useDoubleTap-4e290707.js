/* @oracle/oraclejet-preact: undefined */
import { useRef, useCallback } from 'preact/hooks';

/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * A hook that supports double tap on mobile. You can optionally pass an onSingleTap handler
 * which is called if the user taps once, but doesn't tap again within the threshold waiting
 * period (isSingleTapImmediate = false). If isSingleTapImmediate is true, onSingleTap is
 * invoked immediately after the first tap.
 *
 * If the user taps again within the threshold wait period, then onDoubleTap is called.
 */
function useDoubleTap({ isSingleTapImmediate = true, onDoubleTap, onSingleTap, threshold = 400 }) {
    const timerRef = useRef(null);
    const handler = useCallback((event) => {
        if (!timerRef.current) {
            isSingleTapImmediate && onSingleTap?.(event);
            timerRef.current = setTimeout(() => {
                !isSingleTapImmediate && onSingleTap?.(event);
                timerRef.current = null;
            }, threshold);
        }
        else {
            clearTimeout(timerRef.current);
            timerRef.current = null;
            onDoubleTap?.(event);
        }
    }, [isSingleTapImmediate, onDoubleTap, onSingleTap, threshold]);
    return { onClick: handler };
}

export { useDoubleTap as u };
//# sourceMappingURL=useDoubleTap-4e290707.js.map
