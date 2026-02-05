/* @oracle/oraclejet-preact: undefined */
'use strict';

const gridInterpolations = {
    gridTemplateColumns: ({ gridTemplateColumns }) => gridTemplateColumns === undefined
        ? {}
        : {
            gridTemplateColumns
        },
    gridAutoRows: ({ gridAutoRows }) => gridAutoRows === undefined
        ? {}
        : {
            gridAutoRows
        }
};

exports.gridInterpolations = gridInterpolations;
//# sourceMappingURL=grid-7c06084e.js.map
