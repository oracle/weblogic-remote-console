/* @oracle/oraclejet-preact: undefined */
import { jsx } from 'preact/jsx-runtime';
import { Fragment } from 'preact';

/**
 * Component that renders an array of data.
 */
function Collection({ items, children }) {
    return (jsx(Fragment, { children: items.map((data, index) => {
            const ctx = { index, data };
            return children(ctx);
        }) }));
}

export { Collection as C };
//# sourceMappingURL=Collection-c4f2f3ea.js.map
