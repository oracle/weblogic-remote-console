define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent", "@oracle/oraclejet-preact/UNSAFE_HighlightText", "css!oj-c/highlight-text/highlight-text-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, ojvcomponent_1, UNSAFE_HighlightText_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HighlightText = void 0;
    exports.HighlightText = (0, ojvcomponent_1.registerCustomElement)('oj-c-highlight-text', 
    /**
     * @classdesc
     * <h3 id="highlightTextOverview-section">
     *   JET Highlight Text
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#highlightTextOverview-section"></a>
     * </h3>
     * <p>Description: JET Highlight Text renders text with highlighting applied.</p>
     *
     * <p>JET Highlight Text renders a text string with highlighting applied to the given text to match.</p>
     *
     * A Highlight Text can be created with the following markup.</p>
     *
     * <pre class="prettyprint"><code>
     * &lt;oj-c-highlight-text
     *   text='My text to apply highlighting to.'
     *   match-text='igh'>
     * &lt;/oj-c-highlight-text>
     * </code></pre>
     *
     * @ojmetadata displayName "Highlight Text"
     * @ojmetadata description "A Highlight Text renders text with highlighting applied."
     * @ojmetadata help "oj-c.HighlightText.html"
     * @ojmetadata main "oj-c/highlight-text"
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Forms"
     *   },
     *   "vbdt": {
     *     "defaultColumns": 6,
     *     "minColumns": 2,
     *     "module": "oj-c/highlight-text"
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-background-color"
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "text",
     *       "matchText"
     *     ]
     *   }
     * ]
     * @ojmetadata since "15.0.0"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "16.0.0",
     *     "value": ["oj-highlight-text"]
     *   }
     * ]
     */
    ({ matchText, text }) => {
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_HighlightText_1.HighlightText, { matchText: matchText, children: text }) }));
    }, "HighlightText", { "properties": { "matchText": { "type": "string" }, "text": { "type": "string" } } }, undefined, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});
