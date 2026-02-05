/* @oracle/oraclejet-preact: undefined */
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

export { gridInterpolations as g };
//# sourceMappingURL=grid-65aa641c.js.map
