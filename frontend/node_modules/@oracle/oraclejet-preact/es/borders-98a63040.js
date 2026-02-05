/* @oracle/oraclejet-preact: undefined */
const borderInterpolations = {
    border: ({ border }) => border === undefined
        ? {}
        : {
            border
        },
    borderBlockStart: ({ borderBlockStart }) => borderBlockStart === undefined
        ? {}
        : {
            borderBlockStart
        },
    borderBlockEnd: ({ borderBlockEnd }) => borderBlockEnd === undefined
        ? {}
        : {
            borderBlockEnd
        },
    borderInlineStart: ({ borderInlineStart }) => borderInlineStart === undefined
        ? {}
        : {
            borderInlineStart
        },
    borderInlineEnd: ({ borderInlineEnd }) => borderInlineEnd === undefined
        ? {}
        : {
            borderInlineEnd
        },
    borderRadius: ({ borderRadius }) => borderRadius === undefined
        ? {}
        : {
            borderRadius
        }
};

export { borderInterpolations as b };
//# sourceMappingURL=borders-98a63040.js.map
