define(["require", "exports", "preact/jsx-runtime", "preact/compat", "@oracle/oraclejet-preact/UNSAFE_InlineSelectSingle", "./useInlineSelectSingle"], function (require, exports, jsx_runtime_1, compat_1, UNSAFE_InlineSelectSingle_1, useInlineSelectSingle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InlineSelectSingle = void 0;
    /**
     * Inline Select Single component for selecting a value from a list of value for the
     * Ask Oracle complex filter.
     */
    function InlineSelectSingleImpl(props, ref) {
        const { preactInlineSelectSingleProps } = (0, useInlineSelectSingle_1.useInlineSelectSingle)(props, ref);
        return (0, jsx_runtime_1.jsx)(UNSAFE_InlineSelectSingle_1.InlineSelectSingle, { ...preactInlineSelectSingleProps });
    }
    /**
     * An Inline Select Single component for selecting a value from a list of values for the
     * Ask Oracle complex filter chip.
     */
    exports.InlineSelectSingle = (0, compat_1.forwardRef)(InlineSelectSingleImpl); // forwardRef will remove generics, so we cast it explicitly to preserve generics.
});
