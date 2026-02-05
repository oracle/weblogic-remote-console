define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_SelectionCard", "ojs/ojvcomponent", "css!oj-c/selection-card/selection-card-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_SelectionCard_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectionCard = void 0;
    exports.SelectionCard = (0, ojvcomponent_1.registerCustomElement)('oj-c-selection-card', 
    /**
     * @classdesc
     * <h3 id="SelectionCardOverview-section">
     *   JET Selection
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#SelectionCardOverview-section"></a>
     * </h3>
     * <p>Description: Themeable, WAI-ARIA-compliant element that represents a card.</p>
     * <p>Selection Card provides a styled rectangular area for use in collections.
     *
     *
     * <pre class="prettyprint">
     * <code>
     *&lt;oj-c-selection-card" selected="[[isSelected]]">
     *   Sample Text
     * &lt;/oj-c-selection-card>
     *
     *</code></pre>
     *
     * <h3 id="diff-section">
     *   Differences between Cards in JET
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#diff-section"></a>
     * </h3>
     *
     * <p>
     * There are several different options for creating cards in JET applications.
     * </p>
     * <ul>
     * <li><strong>oj-c-action-card:</strong> ActionCard fires action events and is supported for use stand alone or in oj-c-card-view. For accessibility reasons nothing interactive (for example links or buttons) can be put in an action card.</li>
     * <li><strong>oj-c-selection-card:</strong> SelectionCard is supported for use in oj-c-card-view, with single or multiple selection.</li>
     * <li><strong>oj-panel CSS class:</strong> For simple cases with no associated action or selection. Panel is supported for use in standalone or in oj-c-card-view.</li>
     * </ul>
     *
     *
     * @ojmetadata description "A Selection Card is a container that can be set as selected with a collection"
     * @ojmetadata displayName "Selection Card"
     * @ojmetadata status [
     *   {
     *     type: "production",
     *     since: "19.0.0"
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Collections"
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-object-card",
     *     "uxSpecs": ["card"]
     *   },
     *   "vbdt": {
     *     "module": "oj-c/selection-card",
     *     "defaultColumns": 1,
     *     "minColumns": 1
     *   }
     * }
     * @ojmetadata since "16.0.0"
     */
    ({ children, selected }) => {
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_SelectionCard_1.SelectionCard, { isSelected: selected, width: "100%", height: "100%", children: children }) }));
    }, "SelectionCard", { "slots": { "": {} }, "properties": { "selected": { "type": "boolean" } } }, undefined, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});
