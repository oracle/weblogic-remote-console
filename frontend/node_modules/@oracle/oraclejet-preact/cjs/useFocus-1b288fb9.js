/* @oracle/oraclejet-preact: undefined */
'use strict';

var useToggle = require('./useToggle-3ebba7d8.js');

/**
 * Get status on whether target has focus or not
 * @returns
 */
function useFocus(settings = { isDisabled: false }) {
    const { bool, setTrue, setFalse } = useToggle.useToggle(false);
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

exports.useFocus = useFocus;
//# sourceMappingURL=useFocus-1b288fb9.js.map
