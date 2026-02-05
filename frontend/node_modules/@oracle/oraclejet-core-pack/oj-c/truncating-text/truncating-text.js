define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/UNSAFE_TruncatingText", "css!oj-c/truncating-text/truncating-text-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, ojvcomponent_1, UNSAFE_useTabbableMode_1, UNSAFE_TruncatingText_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TruncatingText = void 0;
    exports.TruncatingText = (0, ojvcomponent_1.registerCustomElement)('oj-c-truncating-text', 
    /**
     *
     *
     * @ojmetadata displayName "Truncating Text"
     * @ojmetadata description "Truncating Text shows a tooltip containing the full text while also acting as a tab stop when truncation occurs."
     * @ojmetadata main "oj-c/truncating-text"
     * @ojmetadata since "19.0.0"
     * @ojmetadata status [
     *   {
     *     "type": "production",
     *     "since": "19.0.0"
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Controls"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/truncating-text"
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-text",
     *     "uxSpecs": [
     *       "text"
     *     ]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "variant",
     *       "size",
     *       "weight",
     *       "value"
     *     ]
     *   }
     * ]
     */
    ({ variant, size, weight, overflowWrap, hyphens, lineClamp, truncation, value }) => {
        const truncateProps = !truncation && lineClamp ? { lineClamp: lineClamp } : { truncation: truncation };
        return ((0, jsx_runtime_1.jsx)(UNSAFE_TruncatingText_1.TruncatingText, { variant: variant, size: size, weight: weight, overflowWrap: overflowWrap, hyphens: hyphens, ...truncateProps, children: value }));
    }, "TruncatingText", { "properties": { "variant": { "type": "string", "enumValues": ["inherit", "disabled", "success", "danger", "warning", "primary", "secondary"] }, "size": { "type": "string", "enumValues": ["inherit", "sm", "md", "lg", "xs", "2xs", "xl"] }, "weight": { "type": "string", "enumValues": ["bold", "normal", "inherit", "semiBold"] }, "overflowWrap": { "type": "string", "enumValues": ["normal", "anywhere", "breakWord"] }, "hyphens": { "type": "string", "enumValues": ["auto", "none"] }, "truncation": { "type": "string", "enumValues": ["none", "clip", "ellipsis"] }, "lineClamp": { "type": "number" }, "value": { "type": "string" } } }, undefined, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
});
