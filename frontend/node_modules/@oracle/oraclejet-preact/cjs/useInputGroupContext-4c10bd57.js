/* @oracle/oraclejet-preact: undefined */
'use strict';

var hooks = require('preact/hooks');
var InputGroupContext = require('./InputGroupContext-05f2a46f.js');

/**
 * Utility hook for consuming the InputGroupContext
 *
 * @returns The value of closest InputGroupContext provider
 */
function useInputGroupContext() {
    return hooks.useContext(InputGroupContext.InputGroupContext);
}

exports.useInputGroupContext = useInputGroupContext;
//# sourceMappingURL=useInputGroupContext-4c10bd57.js.map
