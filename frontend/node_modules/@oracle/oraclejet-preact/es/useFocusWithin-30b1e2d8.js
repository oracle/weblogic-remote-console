/* @oracle/oraclejet-preact: undefined */
import { useState, useRef, useCallback } from 'preact/hooks';

function useFocusWithin({ isDisabled, onBlurWithin, onFocusWithin } = {}) {
    const [isFocused, setIsFocused] = useState(false);
    // Maintain a ref for whether we're focused so that we can update it synchronously and check
    // it in the listeners.  It's possible for an element to receive and lose focus before
    // the next render happens, in which case the isFocused state hasn't been updated yet for
    // the focusin event.  The focusout listener would not do anything based on that stale state,
    // which would result in the isFocused state incorrectly remaining true.
    // We still need the isFocused state because that state change will trigger a rerender,
    // whereas updating the ref will not.
    const isFocusedRef = useRef(false);
    const onFocusIn = useCallback((event) => {
        if (!isFocusedRef.current) {
            onFocusWithin?.(event);
            setIsFocused(true);
            isFocusedRef.current = true;
        }
    }, [onFocusWithin]);
    const onFocusOut = useCallback((event) => {
        // Trigger focus event changes only when the focus goes outside of the current
        // target. Ignore focus changes within the current target
        if (isFocusedRef.current &&
            (event.relatedTarget == null ||
                !event.currentTarget.contains(event.relatedTarget))) {
            onBlurWithin?.(event);
            setIsFocused(false);
            isFocusedRef.current = false;
        }
    }, [onBlurWithin]);
    return isDisabled
        ? {
            isFocused: false,
            focusProps: {}
        }
        : {
            isFocused,
            focusProps: {
                onFocusIn,
                onFocusOut
            }
        };
}

export { useFocusWithin as u };
//# sourceMappingURL=useFocusWithin-30b1e2d8.js.map
