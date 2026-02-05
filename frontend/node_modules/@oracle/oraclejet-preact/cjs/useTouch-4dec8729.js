/* @oracle/oraclejet-preact: undefined */
'use strict';

var useToggle = require('./useToggle-3ebba7d8.js');

/**
 * Get status on whether target has touch or not
 * @returns
 */
function useTouch(settings = { isDisabled: false }) {
    const { bool, setTrue, setFalse } = useToggle.useToggle(false);
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

exports.useTouch = useTouch;
//# sourceMappingURL=useTouch-4dec8729.js.map
