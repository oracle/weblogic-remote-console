define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "ojs/ojcontext", "ojs/ojvcomponent", "preact/compat", "preact/hooks", "@oracle/oraclejet-preact/UNSAFE_EmptyList", "@oracle/oraclejet-preact/UNSAFE_ListView", "@oracle/oraclejet-preact/hooks/UNSAFE_useTranslationBundle", "@oracle/oraclejet-preact/hooks/UNSAFE_useCollectionInteractionContext", "./useListViewPreact", "./DataFetchLiveRegion", "./listViewItem", "../utils/PRIVATE_ItemsMenu/items-menu", "../hooks/PRIVATE_useSelectionContext/SelectionContext", "css!oj-c/list-view/list-view-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, Context, ojvcomponent_1, compat_1, hooks_1, UNSAFE_EmptyList_1, UNSAFE_ListView_1, UNSAFE_useTranslationBundle_1, UNSAFE_useCollectionInteractionContext_1, useListViewPreact_1, DataFetchLiveRegion_1, listViewItem_1, items_menu_1, SelectionContext_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ListView = void 0;
    const ListViewPreactWrapper = ({ listviewRef, addBusyState, isClickthroughDisabled, itemTemplate, noData, contextMenuConfig, onOjContextMenuAction, onOjContextMenuSelection, ...rest }) => {
        const { status, listViewProps } = (0, useListViewPreact_1.useListViewPreact)(rest, addBusyState, isClickthroughDisabled);
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        const itemsRenderer = (0, hooks_1.useCallback)((context) => {
            const item = context.data;
            const itemDetail = { item, data: item.data };
            const items = contextMenuConfig?.items(itemDetail);
            return ((0, jsx_runtime_1.jsx)(items_menu_1.ItemsMenu, { items: items, onOjMenuAction: ({ key }) => {
                    onOjContextMenuAction?.({
                        menuItemKey: key,
                        contextMenuContext: itemDetail
                    });
                }, onOjMenuSelection: ({ value, menuSelectionGroupKey }) => {
                    onOjContextMenuSelection?.({
                        value,
                        menuSelectionGroupKey,
                        contextMenuContext: itemDetail
                    });
                } }));
        }, [contextMenuConfig?.items, onOjContextMenuAction, onOjContextMenuSelection]);
        const preactContextMenuConfig = (0, hooks_1.useMemo)(() => {
            return {
                itemsRenderer,
                accessibleLabel: contextMenuConfig?.accessibleLabel
            };
        }, [contextMenuConfig?.accessibleLabel, itemsRenderer]);
        if (status === 'success' && !listViewProps.hasMore && listViewProps.data?.length === 0) {
            if (noData) {
                return ((0, jsx_runtime_1.jsx)(UNSAFE_EmptyList_1.EmptyList, { "aria-label": listViewProps['aria-label'], "aria-labelledby": listViewProps['aria-labelledby'], children: noData(compat_1.Children) }));
            }
            else {
                const noDataContent = translations.noData_message();
                return ((0, jsx_runtime_1.jsx)(UNSAFE_EmptyList_1.EmptyList, { "aria-label": listViewProps['aria-label'], "aria-labelledby": listViewProps['aria-labelledby'], children: noDataContent }));
            }
        }
        const selectInfo = {
            selected: rest.selected,
            selectionMode: listViewProps.selectionMode === 'multipleToggle' ? 'multiple' : listViewProps.selectionMode,
            onSelectedChange: rest.onSelectedChanged
        };
        return ((0, jsx_runtime_1.jsxs)(SelectionContext_1.SelectionContext.Provider, { value: selectInfo, children: [(0, jsx_runtime_1.jsx)(UNSAFE_ListView_1.ListView, { ref: listviewRef, ...listViewProps, ...(contextMenuConfig && {
                        contextMenuConfig: preactContextMenuConfig
                    }), children: (0, hooks_1.useCallback)((context) => {
                        return (0, jsx_runtime_1.jsx)(listViewItem_1.ListItem, { context: context, itemTemplate: itemTemplate });
                    }, [itemTemplate]) }), (0, jsx_runtime_1.jsx)(DataFetchLiveRegion_1.DataFetchLiveRegion, { isFetching: status === 'loading' })] }));
    };
    const ListViewImpl = (0, compat_1.forwardRef)(
    /**
     * @classdesc
     * <h3 id="listViewOverview-section">
     *   JET ListView Component
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#listViewOverview-section"></a>
     * </h3>
     *
     * <p>Description: The JET ListView enhances a HTML list element into a themable, WAI-ARIA compliant, mobile friendly component with advance interactive features.
     * The child content can be configured via a DataProvider which should be used for mutable data.</p>
     *
     * <p>For migration information from <code>oj-list-view</code> refer to the <a href="https://jet.oraclecorp.com/trunk/jsdocs/oj.ojListView.html#styling-section">migration section</a> in the API docs.
     *
     * <h3 id="data-section">
     *   Data
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#data-section"></a>
     * </h3>
     * <p>The JET ListView gets its data from a DataProvider.</p>
     *
     * <p><b>ArrayDataProvider</b> - Use this when the underlying data is an array object or an observableArray.  In the observableArray case, ListView will automatically react
     * when items are added or removed from the array.  See the documentation for ArrayDataProvider for more details on the available options.</p>
     *
     * <p>Example of data provider content</p>
     * <pre class="prettyprint"><code>
     *   &lt;oj-c-list-view aria-label="Accessible Summary" data="[[dataProvider]]">
     *   &lt;/oj-c-list-view>
     * </code></pre>
     *
     * <p>Check out the Listview Basic demo</a>
     *
     * <h3 id="keyboard-section">
     *   Coming Features
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#coming-features-section"></a>
     * </h3>
     *
     * <p>These features will be the domain of new, specialized components</p>
     * <ul>
     *    <li>Cards in grid layout</li>
     *    <li>Cards in waterfall layout</li>
     *    <li>Grouped list</li>
     *    <li>Expandable list</li>
     * </ul>
     *
     * <p>These features will be available in forthcoming versions</p>
     * <ul>
     *    <li>Drag and drop between components</li>
     *    <li>Managing scroll position</li>
     * </ul>
     *
     * <h3 id="keyboard-section">
     *   Keyboard End User Information
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
     * </h3>
     *
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Target</th>
     *       <th>Key</th>
     *       <th>Action</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td rowspan = "20" nowrap>List Item</td>
     *       <td><kbd>F2</kbd></td>
     *       <td>Enters tabbable mode.  This enables keyboard action on elements inside the item, including navigate between focusable elements inside the item.  It can also be used to exit tabbable mode if already in tabbable mode.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Enter</kbd></td>
     *       <td>Enters tabbable mode if <a href="#item">enterKeyFocusBehavior</a> is "focusWithin" (default).  This enables keyboard action on elements inside the item, including navigate between focusable elements inside the item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Esc</kbd></td>
     *       <td>Exits tabbable mode.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Tab</kbd></td>
     *       <td>When in tabbable mode, navigates to next focusable element within the item.  If the last focusable element is reached, shift focus back to the first focusable element.
     *           When not in tabbable mode, navigates to next focusable element on page (outside ListView).</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift+Tab</kbd></td>
     *       <td>When in tabbable mode, navigates to previous focusable element within the item.  If the first focusable element is reached, shift focus back to the last focusable element.
     *           When not in tabbable mode, navigates to previous focusable element on page (outside ListView).</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Move focus to the item below.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Move focus to the item above.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift+DownArrow</kbd></td>
     *       <td>Extend the selection to the item below.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift+UpArrow</kbd></td>
     *       <td>Extend the selection to the item above.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Space</kbd></td>
     *       <td>Toggles to select and deselect the current item while maintaining previously selected items.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift+Space</kbd></td>
     *       <td>Toggles to select and deselect the current item while maintaining previously selected items.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift+Cmd/Ctrl+UpArrow</kbd></td>
     *       <td>Reorder the current item up.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift+Cmd/Ctrl+DownArrow</kbd></td>
     *       <td>Reorder the current item down.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Ctrl+Space</kbd></td>
     *       <td>Toggles to select and deselect the current item while maintaining previously selected items.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>Application should specify a value for the aria-label attribute with a meaningful description of the purpose of this list.</p>
     * <p>Note that ListView uses the grid role and follows the <a href="https://www.w3.org/TR/wai-aria-practices/examples/grid/LayoutGrids.html">Layout Grid</a> design as outlined in the <a href="https://www.w3.org/TR/wai-aria-practices/#grid">grid design pattern</a></p>
     * <p>Nesting collection components such as ListView, Table, TreeView, and ListView inside of ListView is not supported.</p>
     * <p>When reorder feature is enabled, application should specify a live region which contains an announcement to notify assistive technologies that the item reordering happens.</p>
     *
     * <h4>Custom Colours</h4>
     * <p>Using colors, including background and text colors, is not accessible if it is the only way information is conveyed.
     * Low vision users may not be able to see the different colors, and in high contrast mode the colors are removed.
     * The Redwood approved way to show status is to use badge.</p>
     *
     * <h3 id="context-section">
     *   Item Context
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#context-section"></a>
     * </h3>
     *
     * <p>For all item options, developers can specify a function as the return value.  The function takes a single argument, which is an object that contains contextual information about the particular item.  This gives developers the flexibility to return different value depending on the context.</p>
     *
     * <p>The context parameter contains the following keys:</p>
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Key</th>
     *       <th>Description</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td><kbd>data</kbd></td>
     *       <td>The data of the item.  Note this is made available primarily to ease migration.
     *           Applications should get the data from the item property instead.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>item</kbd></td>
     *       <td>An object that contains the data and metadata for the item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>isTabbable</kbd></td>
     *       <td>A boolean indicating whether the item is in tabbable mode or not.
     *          This should be used to implement conditional behavior for all tabbable elements, this avoids creating a keyboard trap when tabbing through a List.<br/>
     *          This can be implemented as a conditional tabindex, for example <code>tabindex="[[!item.isTabbable && '-1']]"</code>.<br/>
     *          When composing with core pack components, this is not needed, as they are tabbable mode aware.
     *         </td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <p>The following keys are not currently supported:</p>
     *
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Key</th>
     *       <th>Description</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td><kbd>componentElement</kbd></td>
     *       <td>A reference to the root element of ListView.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>datasource</kbd></td>
     *       <td>A reference to the data source object.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>index</kbd></td>
     *       <td>The index of the item, where 0 is the index of the first item.  In the hierarchical case the index is relative to its parent.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>key</kbd></td>
     *       <td>The key of the item (this duplicates item.metadata.key and has been deprecated)</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>metadata</kbd></td>
     *       <td>The metadata of the item (this is instead available in item)</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>parentElement</kbd></td>
     *       <td>This will be supported by the Hierarchical list component and no longer applies to list view..</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <h3 id="data-attributes-section">
     *   Custom Data Attributes
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#data-attributes-section"></a>
     * </h3>
     *
     * <p>ListView supports the following custom data attributes.
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Name</th>
     *       <th>Description</th>
     *       <th>Example</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td><kbd>data-oj-as</kbd></td>
     *       <td>Provides an alias for a specific template instance and has the same subproperties as the $current variable.</td>
     *       <td>
     *         <pre class="prettyprint"><code>&lt;oj-c-list-view id="listView">
     *   &lt;template slot="itemTemplate" data-oj-as="item">
     *   &lt;/template>
     * &lt;/oj-c-list-view></code></pre>
     *       </td>
     *     </tr>
     *     <tr>
     *       <td><kbd>data-oj-clickthrough</kbd></td>
     *       <td><p>Specify on any element inside an item where you want to control whether ListView should perform actions triggered by
     *           a click event originating from the element or one of its descendants.</p>
     *           <p>For example, if you specify this attribute with a value of "disabled" on a link inside an item, then ListView
     *           will not select or trigger itemAction event to be fired when user clicks on the link.</p>
     *           <p>Note that the currentItem will still be updated to the item that the user clicked on.</p>
     *           <p>Also note you do not need to set this attribute on core pack components such as oj-c-button, as it natively supports
     *              disabling clickthrough.</p>
     *       </td>
     *       <td>
     *         <pre class="prettyprint"><code>&lt;oj-c-list-view id="listView">
     *   &lt;template slot="itemTemplate">
     *     &lt;a href="#" data-oj-clickthrough="disabled">&lt;/a>
     *   &lt;/template>
     * &lt;/oj-c-list-view></code></pre>
     *       </td>
     *     </tr>
     *     <tr>
     *       <td><kbd>data-oj-manage-tabs</kbd></td>
     *       <td><p>ListView does not manipulate the tabindex of the item content.  Applications should set the tabIndex of any focusable
     *          element based on the isTabbableMode property from the context pass to the itemTemplate.</p>
     *          <p>However, there will be cases where you can't control the tabindex of the content, for example, if you are using components from another team.</p>
     *          <p>In that case, applications can specify this attribute on the element or one of its ancestors so that when the itemTemplate is processed,
     *          it will scan and manipulate the tabindex of any focusable elements.</p>
     *       </td>
     *       <td>
     *         <pre class="prettyprint"><code>&lt;oj-c-list-view id="listView">
     *   &lt;template slot="itemTemplate">
     *     &lt;some-component-with-focusable-elements data-oj-manage-tabs>&lt;/some-component-with-focusable-elements>
     *   &lt;/template>
     * &lt;/oj-c-list-view></code></pre>
     *       </td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <h3 id="suggestion-items-section">
     *   Suggestion Items
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#suggestion-items-section"></a>
     * </h3>
     *
     * <p>If <a href="ItemMetadata.html">ItemMetadata</a> returned by the DataProvider contains suggestion field, ListView will apply special visual to those
     *    items. The DataProvider must ensure the suggestion items are the first items returned by the initial fetchFirst call.</p>
     *
     * @ojmetadata displayName "List View"
     * @ojmetadata description "A list view displays data items as a list or a grid with highly interactive features."
     * @ojmetadata help "oj-c.ListView.html"
     * @ojmetadata main "oj-c/list-view"
     * @ojmetadata status [
     *   {
     *     type: "candidate",
     *     since: "17.0.0"
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Collections"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/list-view",
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-list",
     *     "uxSpecs": [
     *       "list-view"
     *     ]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "selectionMode"
     *     ]
     *   },
     *   {
     *     "propertyGroup": "data",
     *     "items": [
     *       "data",
     *       "selected"
     *     ]
     *   }
     * ]
     * @ojmetadata since "15.0.0"
     */
    ({ selectionMode = 'none', reorderable = { items: 'disabled' }, item = { padding: 'disabled', enterKeyFocusBehavior: 'focusWithin' }, ...rest }, ref) => {
        const rootRef = (0, hooks_1.useRef)();
        const listviewRef = (0, hooks_1.useRef)();
        const addBusyState = (0, hooks_1.useCallback)((desc) => {
            return rootRef.current
                ? Context.getContext(rootRef.current)
                    .getBusyContext()
                    .addBusyState({
                    description: `oj-c-list-view: ${desc}`
                })
                : () => { };
        }, []);
        const isClickthroughDisabled = (0, hooks_1.useCallback)((target) => {
            if (target === null || rootRef.current === undefined) {
                return false;
            }
            return isEventClickthroughDisabled({ target }, rootRef.current);
        }, []);
        const props = {
            selectionMode,
            reorderable,
            item,
            ...rest
        };
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            focus: () => {
                listviewRef.current?.focus();
            }
        }), []);
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: props.id, ref: rootRef, children: (0, jsx_runtime_1.jsx)(ListViewPreactWrapper, { listviewRef: listviewRef, addBusyState: addBusyState, isClickthroughDisabled: isClickthroughDisabled, ...props }) }));
    });
    // This custom element supports generic parameters, but was introduced before the pattern for exposing
    // generic parameters on the functional value-based element was established.  In order to introduce the generics in
    // a backwards-compatible way, they must be defaulted, but we don't want the defaults to be added to the existing
    // types which had generics from the start.  The solution is to use two consts:
    //   * the first is not exported, but is used as the basis for the custom element types and does not default its generics
    //   * the second is the exported functional value-based element and defaults the generics for backwards compatibility
    const ListViewWithoutDefaultedGenerics = (0, ojvcomponent_1.registerCustomElement)('oj-c-list-view', ListViewImpl, "ListView", { "properties": { "currentItem": { "type": "string|number", "readOnly": true, "writeback": true }, "currentItemOverride": { "type": "object", "properties": { "rowKey": { "type": "string|number" } } }, "data": { "type": "DataProvider|null" }, "gridlines": { "type": "object", "properties": { "item": { "type": "string", "enumValues": ["hidden", "visible"] }, "top": { "type": "string", "enumValues": ["hidden", "visible"] }, "bottom": { "type": "string", "enumValues": ["hidden", "visible"] } } }, "scrollPolicyOptions": { "type": "object", "properties": { "fetchSize": { "type": "number" }, "scroller": { "type": "string" } } }, "selected": { "type": "object", "writeback": true }, "selectionMode": { "type": "string", "enumValues": ["none", "multiple", "single", "singleRequired", "multipleToggle"] }, "contextMenuConfig": { "type": "object", "properties": { "accessibleLabel": { "type": "string" }, "items": { "type": "function" } } }, "reorderable": { "type": "object", "properties": { "items": { "type": "string", "enumValues": ["disabled", "enabled"] } } }, "item": { "type": "object", "properties": { "padding": { "type": "string|object" }, "enterKeyFocusBehavior": { "type": "string", "enumValues": ["none", "focusWithin"] } } } }, "slots": { "itemTemplate": { "data": {} }, "noData": { "data": {} }, "skeletonTemplate": { "data": {} } }, "events": { "ojItemAction": {}, "ojFirstSelectedItem": {}, "ojContextMenuAction": { "bubbles": true }, "ojContextMenuSelection": { "bubbles": true }, "ojReorder": {} }, "extension": { "_WRITEBACK_PROPS": ["currentItem", "selected"], "_READ_ONLY_PROPS": ["currentItem"], "_OBSERVED_GLOBAL_PROPS": ["aria-label", "aria-labelledby", "aria-describedby", "id"] }, "methods": { "focus": {} } }, { "selectionMode": "none", "reorderable": { "items": "disabled" }, "item": { "padding": "disabled", "enterKeyFocusBehavior": "focusWithin" } }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useCollectionInteractionContext_1.CollectionInteractionContext] });
    exports.ListView = ListViewWithoutDefaultedGenerics;
    // copied from DataCollectionUtils
    const isEventClickthroughDisabled = function (event, rootElement) {
        let node = event.target;
        while (node != null && node !== rootElement) {
            if (isClickthroughDisabled(node)) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    };
    // copied from DataCollectionUtils
    const isClickthroughDisabled = function (element) {
        return element.dataset['ojClickthrough'] === 'disabled';
    };
});
