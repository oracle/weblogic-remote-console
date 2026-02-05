/* @oracle/oraclejet-preact: undefined */
'use strict';

var hooks = require('preact/hooks');
var preact = require('preact');

/**
 * Context used by the parent to pass accessibility related information.
 */
const AccessibleContext = preact.createContext({
    UNSAFE_ariaLabelledBy: undefined
});

/**
 * Utility hook for consuming the AccessibleContext
 *
 * @returns The value of closest AccessibleContext provider
 */
function useAccessibleContext() {
    return hooks.useContext(AccessibleContext);
}

exports.AccessibleContext = AccessibleContext;
exports.useAccessibleContext = useAccessibleContext;
//# sourceMappingURL=useAccessibleContext-c49d8d1b.js.map
