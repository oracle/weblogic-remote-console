define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_SelectorAll", "ojs/ojvcomponent", "../utils/PRIVATE_keyUtils/keySetUtils"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_SelectorAll_1, ojvcomponent_1, keySetUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectorAll = void 0;
    /**
     * @classdesc
     * <h3 id="selectorAllOverview-section">
     *   JET SelectorAll
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#selectorAllOverview-section"></a>
     * </h3>
     * <p>Description: A checkbox to support select all functionality in Collection Components</p>
     * <p>The oj-c-selector-all is a component that may be placed above Table, ListView. It presents as a checkbox
     * when the Collection Component is configured for select all.</p>
     * <p>Note that if the application wants to explicitly update the visual state of the component (e.g. to have
     * it checked when every item in the associated ListView is selected), it will need to update the selectedKeys
     * attribute with an AllKeySetImpl (with empty deletedKeys) to have it checked, or a KeySetImpl (with empty keys)
     * to have it unchecked. Partial state will be shown if either an AllKeySetImpl with non-empty deletedKeys or a
     * KeySetImpl with non-empty keys is specified.</p>
     *
     * <pre class="prettyprint">
     * <code>
     * &lt;div class="oj-flex oj-sm-align-items-center">
     *   &lt;oj-c-selector-all
     *     id="selectAll"
     *     selected-keys="{{selectedItems}}">
     *   &lt;/oj-c-selector-all>
     *   &lt;span>Select All</span>
     * &lt;/div>
     * &lt;oj-c-list-view
     *   id="listview"
     *   data="[[dataProvider]]"
     *   selected="{{selectedItems}}"
     *   selection-mode="multiple">
     *  &lt;template slot="itemTemplate" data-oj-as="item">
     *    &lt;oj-c-list-item-layout>
     *      &lt;oj-c-selector
     *        selected-keys="{{selectedItems}}"
     *        selection-mode="multiple"
     *        row-key="[[item.data.id]]"
     *        slot="selector">
     *      &lt;/oj-c-selector>
     *      &lt;span>
     *        &lt;oj-bind-text value="[[item.data.name]]">&lt;/oj-bind-text>
     *      &lt;/span>
     *     &lt;/oj-c-list-item-layout>
     *   &lt;/template>
     * &lt;/oj-c-list-view>
     * </code></pre>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>Application must specify a value for the aria-label attribute with a meaningful description of the purpose of this selector in order for this to be accessible.</p>
     *
     * @typeparam K Type of key
     * @ojmetadata description "The selector all component renders a checkbox in collections to support selection."
     * @ojmetadata displayName "SelectorAll"
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Collections"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/selectorAll"
     *   }
     * }
     * @ojmetadata help "oj-c.SelectorAll.html"
     * @ojmetadata since "15.0.0"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "16.0.0",
     *     "value": ["oj-selector"]
     *   }
     * ]
     */
    const SelectorAllImpl = ({ selectedKeys, onSelectedKeysChanged, showTooltip, ...otherProps }) => {
        const keys = selectedKeys.keys;
        const selected = (keys.all
            ? keys.deletedKeys.size > 0
                ? 'partial'
                : 'all'
            : keys.keys.size > 0
                ? 'partial'
                : 'none');
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_SelectorAll_1.SelectorAll, { selected: selected, onChange: (detail) => {
                    onSelectedKeysChanged?.((0, keySetUtils_1.keysToKeySet)(detail.value));
                }, showTooltip: showTooltip, ...otherProps }) }));
    };
    // This custom element supports generic parameters, but was introduced before the pattern for exposing
    // generic parameters on the functional value-based element was established.  In order to introduce the generics in
    // a backwards-compatible way, they must be defaulted, but we don't want the defaults to be added to the existing
    // types which had generics from the start.  The solution is to use two consts:
    //   * the first is not exported, but is used as the basis for the custom element types and does not default its generics
    //   * the second is the exported functional value-based element and defaults the generics for backwards compatibility
    const SelectorAllWithoutDefaultedGenerics = (0, ojvcomponent_1.registerCustomElement)('oj-c-selector-all', SelectorAllImpl, "SelectorAll", { "properties": { "selectedKeys": { "type": "object", "writeback": true }, "showTooltip": { "type": "string", "enumValues": ["disabled", "enabled"] } }, "extension": { "_WRITEBACK_PROPS": ["selectedKeys"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-label", "aria-labelledby", "aria-describedby"] } }, undefined, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
    exports.SelectorAll = SelectorAllWithoutDefaultedGenerics;
});
