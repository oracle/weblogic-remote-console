define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent", "@oracle/oraclejet-preact/UNSAFE_TruncatingBadge", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "css!oj-c/badge/badge-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, ojvcomponent_1, UNSAFE_TruncatingBadge_1, UNSAFE_useTabbableMode_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TruncatingBadge = void 0;
    exports.TruncatingBadge = (0, ojvcomponent_1.registerCustomElement)('oj-c-truncating-badge', 
    /**
     *
     *
     * @ojmetadata displayName "Truncating Badge"
     * @ojmetadata description "A truncating badge is a label which holds a small amount of information, and also displays a tooltip when truncation occurs."
     * @ojmetadata main "oj-c/truncating-badge"
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
     *     "module": "oj-c/truncating-badge"
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-badge",
     *     "uxSpecs": [
     *       "badge"
     *     ]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "variant",
     *       "size",
     *       "edge",
     *       "label"
     *     ]
     *   }
     * ]
     */
    ({ variant, size, edge, label }) => {
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_TruncatingBadge_1.TruncatingBadge, { variant: variant, size: size, edge: edge, children: label }) }));
    }, "TruncatingBadge", { "properties": { "variant": { "type": "string", "enumValues": ["success", "danger", "info", "warning", "neutral", "neutralSubtle", "dangerSubtle", "successSubtle", "warningSubtle", "infoSubtle"] }, "size": { "type": "string", "enumValues": ["sm", "md"] }, "edge": { "type": "string", "enumValues": ["none", "end"] }, "label": { "type": "string" } } }, undefined, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
});
