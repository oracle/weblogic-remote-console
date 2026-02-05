/* @oracle/oraclejet-preact: undefined */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');


var hiddenAccessibleStyle = 'HiddenAccessibleStyles_hiddenAccessibleStyle__1lyg6yp0';

/**
 * HiddenAccessible is a helper component that hides its children visually,
 * but keeps them visible to screen readers.
 *
 */
function HiddenAccessible({ children, id, isHidden }) {
    return (jsxRuntime.jsx("span", { id: id, class: hiddenAccessibleStyle, hidden: isHidden, children: children }));
}

exports.HiddenAccessible = HiddenAccessible;
//# sourceMappingURL=HiddenAccessible-087eb49a.js.map
