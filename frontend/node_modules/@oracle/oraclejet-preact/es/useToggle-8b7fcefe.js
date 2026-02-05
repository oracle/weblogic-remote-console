/* @oracle/oraclejet-preact: undefined */
import { useState, useMemo } from 'preact/hooks';

/**
 * useToggle is a state toggle hook
 *
 * @param defaultValue
 * @returns
 */
function useToggle(defaultValue = false) {
    const [bool, setBool] = useState(defaultValue);
    const toggleHandlers = useMemo(() => {
        return {
            toggle: () => setBool((x) => !x),
            setTrue: () => setBool(true),
            setFalse: () => setBool(false)
        };
    }, [setBool]);
    return {
        bool,
        ...toggleHandlers
    };
}

export { useToggle as u };
//# sourceMappingURL=useToggle-8b7fcefe.js.map
