/* @oracle/oraclejet-preact: undefined */
'use strict';

var hooks = require('preact/hooks');

/**
 * useToggle is a state toggle hook
 *
 * @param defaultValue
 * @returns
 */
function useToggle(defaultValue = false) {
    const [bool, setBool] = hooks.useState(defaultValue);
    const toggleHandlers = hooks.useMemo(() => {
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

exports.useToggle = useToggle;
//# sourceMappingURL=useToggle-3ebba7d8.js.map
