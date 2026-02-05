define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent", "@oracle/oraclejet-preact/UNSAFE_Badge", "css!oj-c/badge/badge-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, ojvcomponent_1, UNSAFE_Badge_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Badge = void 0;
    exports.Badge = (0, ojvcomponent_1.registerCustomElement)('oj-c-badge', 
    /**
     *
     *
     * @ojmetadata displayName "Badge"
     * @ojmetadata description "A badge is a label which holds a small amount of information."
     * @ojmetadata main "oj-c/badge"
     * @ojmetadata since "19.0.0"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "19.0.0",
     *     "description": "Note: This component supersedes the following style class: <a href='stylingdocs/Badge.html#oj-badge'>oj-badge</a>."
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Controls"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/badge"
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
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_Badge_1.Badge, { variant: variant, size: size, edge: edge, children: label }) }));
    }, "Badge", { "properties": { "variant": { "type": "string", "enumValues": ["success", "danger", "info", "warning", "neutral", "neutralSubtle", "dangerSubtle", "successSubtle", "warningSubtle", "infoSubtle"] }, "size": { "type": "string", "enumValues": ["sm", "md"] }, "edge": { "type": "string", "enumValues": ["none", "end"] }, "label": { "type": "string" } } }, undefined, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});
