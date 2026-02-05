/* @oracle/oraclejet-preact: undefined */
import { u as useToggle } from './useToggle-8b7fcefe.js';

/**
 * Get status on whether target has touch or not
 * @returns
 */
function useTouch(settings = { isDisabled: false }) {
    const { bool, setTrue, setFalse } = useToggle(false);
    const touchProps = settings.isDisabled
        ? {}
        : {
            onTouchStart: setTrue,
            onTouchEnd: setFalse
        };
    return {
        isTouch: settings.isDisabled ? false : bool,
        touchProps: touchProps
    };
}

export { useTouch as u };
//# sourceMappingURL=useTouch-4828df25.js.map
