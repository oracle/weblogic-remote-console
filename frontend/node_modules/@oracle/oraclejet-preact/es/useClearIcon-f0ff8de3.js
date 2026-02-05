/* @oracle/oraclejet-preact: undefined */
import { useCallback, useEffect } from 'preact/hooks';
import { u as useToggle } from './useToggle-8b7fcefe.js';

/**
 * A custom hook that handles showing/hiding clear icon
 */
function useClearIcon({ clearIcon, display, hasValue, isEnabled = true, isFocused = false, isHover = false }) {
    const shouldRenderClearIcon = useCallback(() => isEnabled &&
        (display === 'always' || (display === 'conditionally' && hasValue && (isFocused || isHover))), [display, hasValue, isEnabled, isFocused, isHover]);
    const { bool, setFalse, setTrue } = useToggle(shouldRenderClearIcon());
    useEffect(() => {
        shouldRenderClearIcon() ? setTrue() : setFalse();
    }, [shouldRenderClearIcon, setTrue, setFalse]);
    return bool ? clearIcon : null;
}

export { useClearIcon as u };
//# sourceMappingURL=useClearIcon-f0ff8de3.js.map
