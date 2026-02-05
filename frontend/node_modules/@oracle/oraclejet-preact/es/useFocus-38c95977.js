/* @oracle/oraclejet-preact: undefined */
import { u as useToggle } from './useToggle-8b7fcefe.js';

/**
 * Get status on whether target has focus or not
 * @returns
 */
function useFocus(settings = { isDisabled: false }) {
    const { bool, setTrue, setFalse } = useToggle(false);
    const focusProps = settings.isDisabled
        ? {}
        : {
            onFocus: setTrue,
            onBlur: setFalse
        };
    return {
        isFocus: settings.isDisabled ? false : bool,
        focusProps: focusProps
    };
}

export { useFocus as u };
//# sourceMappingURL=useFocus-38c95977.js.map
