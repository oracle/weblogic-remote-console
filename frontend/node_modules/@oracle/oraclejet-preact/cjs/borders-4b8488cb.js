/* @oracle/oraclejet-preact: undefined */
'use strict';

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

exports.borderInterpolations = borderInterpolations;
//# sourceMappingURL=borders-4b8488cb.js.map
