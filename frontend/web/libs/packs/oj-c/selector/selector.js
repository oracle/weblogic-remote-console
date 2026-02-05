define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_Selector", "preact/hooks", "ojs/ojvcomponent", "../utils/PRIVATE_keyUtils/keySetUtils", "@oracle/oraclejet-preact/hooks/UNSAFE_useCollectionInteractionContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "../hooks/PRIVATE_useSelectionContext/useSelectionContext", "../hooks/PRIVATE_useSelectionContext/SelectionContext", "../hooks/PRIVATE_useSelectionContext/useItemKeyContext", "../hooks/PRIVATE_useSelectionContext/ItemKeyContext"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_Selector_1, hooks_1, ojvcomponent_1, keySetUtils_1, UNSAFE_useCollectionInteractionContext_1, UNSAFE_useTabbableMode_1, useSelectionContext_1, SelectionContext_1, useItemKeyContext_1, ItemKeyContext_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Selector = void 0;
    /**
     * @classdesc
     * <h3 id="selectorOverview-section">
     *   JET Selector
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#selectorOverview-section"></a>
     * </h3>
     * <p>Description: A checkbox to support selection in Collection Components</p>
     * <p>The oj-c-selector is a component that may be placed within a template for Table, ListView.
     * It presents as a checkbox when the Collection Component is configured for multi-selection.
     *
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-c-list-view
     *    id="listview"
     *    data="[[dataProvider]]"
     *    selected="{{selectedItems}}"
     *    selection-mode="[[selectedSelectionMode]]">
     *  &lt;template slot="itemTemplate" data-oj-as="item">
     *    &lt;oj-c-list-item-layout>
     *      &lt;oj-c-selector
     *        slot="selector">
     *      &lt;/oj-c-selector>
     *      &lt;span>
     *        &lt;oj-bind-text value="[[item.data.name]]">&lt;/oj-bind-text>
     *      &lt;/span>
     *    &lt;/oj-c-list-item-layout>
     *  &lt;/template>
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
     * @ojmetadata description "The selector component renders checkboxes in collections to support selection."
     * @ojmetadata displayName "Selector"
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Collections"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/selector"
     *   }
     * }
     * @ojmetadata help "oj-c.Selector.html"
     * @ojmetadata since "15.0.0"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "16.0.0",
     *     "value": ["oj-selector"]
     *   }
     * ]
     */
    const SelectorImpl = ({ rowKey, selectedKeys, indeterminate = false, selectionMode, onSelectedKeysChanged, ...otherProps }) => {
        const itemKey = (0, useItemKeyContext_1.useItemKeyContext)();
        if (itemKey !== undefined) {
            rowKey = itemKey;
        }
        const selectionInfo = (0, useSelectionContext_1.useSelectionContext)();
        let keys = selectedKeys;
        let mode = selectionMode;
        let selectedListener;
        if (selectionInfo) {
            if (selectionInfo.selected) {
                keys = selectionInfo.selected;
            }
            if (selectionInfo.selectionMode !== 'none') {
                mode = selectionInfo.selectionMode;
            }
            selectedListener = selectionInfo.onSelectedChange;
        }
        (0, hooks_1.useLayoutEffect)(() => {
            if (onSelectedKeysChanged &&
                selectedKeys &&
                selectionInfo &&
                selectionInfo.selected &&
                !(0, keySetUtils_1.isEqual)(selectionInfo.selected, selectedKeys)) {
                onSelectedKeysChanged(selectionInfo.selected);
            }
        }, [onSelectedKeysChanged, selectionInfo, selectedKeys]);
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_Selector_1.Selector, { isPartial: indeterminate, rowKey: rowKey, selectedKeys: (0, keySetUtils_1.keySetToKeys)(keys), selectionMode: mode == null ? 'multiple' : mode, "aria-label": otherProps['aria-label'], onChange: (0, hooks_1.useCallback)((detail) => {
                    const keySet = (0, keySetUtils_1.keysToKeySet)(detail.value);
                    selectedListener?.(keySet);
                    onSelectedKeysChanged?.(keySet);
                }, [selectedListener, onSelectedKeysChanged]) }, rowKey) }));
    };
    // This custom element supports generic parameters, but was introduced before the pattern for exposing
    // generic parameters on the functional value-based element was established.  In order to introduce the generics in
    // a backwards-compatible way, they must be defaulted, but we don't want the defaults to be added to the existing
    // types which had generics from the start.  The solution is to use two consts:
    //   * the first is not exported, but is used as the basis for the custom element types and does not default its generics
    //   * the second is the exported functional value-based element and defaults the generics for backwards compatibility
    const SelectorWithoutDefaultedGenerics = (0, ojvcomponent_1.registerCustomElement)('oj-c-selector', SelectorImpl, "Selector", { "properties": { "rowKey": { "type": "string|number" }, "selectedKeys": { "type": "object", "writeback": true }, "indeterminate": { "type": "boolean" }, "selectionMode": { "type": "string", "enumValues": ["multiple", "single"] } }, "extension": { "_WRITEBACK_PROPS": ["selectedKeys"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-label", "aria-labelledby", "aria-describedby"] } }, { "indeterminate": false }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, {
        consume: [UNSAFE_useCollectionInteractionContext_1.CollectionInteractionContext, UNSAFE_useTabbableMode_1.TabbableModeContext, SelectionContext_1.SelectionContext, ItemKeyContext_1.ItemKeyContext]
    });
    exports.Selector = SelectorWithoutDefaultedGenerics;
});
