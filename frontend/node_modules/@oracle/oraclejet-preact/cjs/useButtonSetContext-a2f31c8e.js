/* @oracle/oraclejet-preact: undefined */
'use strict';

var hooks = require('preact/hooks');
var preact = require('preact');

/**
 * Context which the parent component can use to provide various ToggleButton related
 * information
 */
const ButtonSetContext = preact.createContext({
    variant: 'outlined',
    isDisabled: false,
    size: 'md',
    layoutWidth: 'auto',
    display: 'all',
    buttonSetValue: undefined,
    onCommit: undefined
});

/**
 * Utility hook for consuming the ButtonSetContext
 *
 * @returns The value of closest ButtonSetControl provider
 */
function useButtonSetContext() {
    return hooks.useContext(ButtonSetContext);
}

exports.ButtonSetContext = ButtonSetContext;
exports.useButtonSetContext = useButtonSetContext;
//# sourceMappingURL=useButtonSetContext-a2f31c8e.js.map
