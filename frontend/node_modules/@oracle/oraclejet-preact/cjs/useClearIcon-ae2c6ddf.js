/* @oracle/oraclejet-preact: undefined */
'use strict';

var hooks = require('preact/hooks');
var useToggle = require('./useToggle-3ebba7d8.js');

/**
 * A custom hook that handles showing/hiding clear icon
 */
function useClearIcon({ clearIcon, display, hasValue, isEnabled = true, isFocused = false, isHover = false }) {
    const shouldRenderClearIcon = hooks.useCallback(() => isEnabled &&
        (display === 'always' || (display === 'conditionally' && hasValue && (isFocused || isHover))), [display, hasValue, isEnabled, isFocused, isHover]);
    const { bool, setFalse, setTrue } = useToggle.useToggle(shouldRenderClearIcon());
    hooks.useEffect(() => {
        shouldRenderClearIcon() ? setTrue() : setFalse();
    }, [shouldRenderClearIcon, setTrue, setFalse]);
    return bool ? clearIcon : null;
}

exports.useClearIcon = useClearIcon;
//# sourceMappingURL=useClearIcon-ae2c6ddf.js.map
