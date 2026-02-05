/* @oracle/oraclejet-preact: undefined */
'use strict';

var jsxRuntime = require('preact/jsx-runtime');
var preact = require('preact');

/**
 * Component that renders an array of data.
 */
function Collection({ items, children }) {
    return (jsxRuntime.jsx(preact.Fragment, { children: items.map((data, index) => {
            const ctx = { index, data };
            return children(ctx);
        }) }));
}

exports.Collection = Collection;
//# sourceMappingURL=Collection-9880039f.js.map
