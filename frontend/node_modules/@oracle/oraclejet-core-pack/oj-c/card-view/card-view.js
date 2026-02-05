define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "preact/hooks", "ojs/ojvcomponent", "preact/compat", "@oracle/oraclejet-preact/UNSAFE_CardFlexView", "@oracle/oraclejet-preact/UNSAFE_CardGridView", "./useCardViewPreact", "./cardViewItem", "@oracle/oraclejet-preact/hooks/UNSAFE_useTranslationBundle", "@oracle/oraclejet-preact/UNSAFE_EmptyList", "../hooks/PRIVATE_useSelectionContext/SelectionContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useBusyStateContext", "css!oj-c/card-view/card-view-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, hooks_1, ojvcomponent_1, compat_1, UNSAFE_CardFlexView_1, UNSAFE_CardGridView_1, useCardViewPreact_1, cardViewItem_1, UNSAFE_useTranslationBundle_1, UNSAFE_EmptyList_1, SelectionContext_1, UNSAFE_useBusyStateContext_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CardView = void 0;
    const CardViewPreactWrapper = ({ isClickthroughDisabled, busyStateContext, itemTemplate, noData, ...rest }) => {
        const { status, cardViewProps } = (0, useCardViewPreact_1.useCardViewPreact)(rest, isClickthroughDisabled, busyStateContext);
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        if (status === 'success' && !cardViewProps.hasMore && cardViewProps.data?.length === 0) {
            if (noData) {
                return (0, jsx_runtime_1.jsx)(UNSAFE_EmptyList_1.EmptyList, { children: noData(compat_1.Children) });
            }
            else {
                const noDataContent = translations.noData_message();
                return (0, jsx_runtime_1.jsx)(UNSAFE_EmptyList_1.EmptyList, { children: noDataContent });
            }
        }
        const selectInfo = {
            selected: rest.selected,
            selectionMode: cardViewProps.selectionMode,
            onSelectedChange: rest.onSelectedChanged
        };
        const itemRenderer = (0, hooks_1.useCallback)((context) => {
            return (0, jsx_runtime_1.jsx)(cardViewItem_1.CardViewItem, { context: context, itemTemplate: itemTemplate });
        }, [itemTemplate]);
        if (cardViewProps.columns) {
            return ((0, jsx_runtime_1.jsx)(SelectionContext_1.SelectionContext.Provider, { value: selectInfo, children: (0, jsx_runtime_1.jsx)(UNSAFE_CardGridView_1.CardGridView, { ...cardViewProps, children: itemRenderer }) }));
        }
        else {
            return ((0, jsx_runtime_1.jsx)(SelectionContext_1.SelectionContext.Provider, { value: selectInfo, children: (0, jsx_runtime_1.jsx)(UNSAFE_CardFlexView_1.CardFlexView, { ...cardViewProps, children: itemRenderer }) }));
        }
    };
    /**
     * @classdesc
     * <h3 id="CardViewOverview-section">
     *   JET CardView Component
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#CardViewOverview-section"></a>
     * </h3>
     *
     * <p>Description: The JET CardView enhances a themable, WAI-ARIA compliant, mobile friendly component with advance interactive features.
     * The child content can be configured via a DataProvider which should be used for mutable data.</p>
     *
     * <p>For migration information from the card layout feature from <code>oj-list-view</code> refer to the <a href="https://jet.oraclecorp.com/trunk/jsdocs/oj.ojListView.html#styling-section">migration section</a> in the API docs.
     *
     * <h3 id="data-section">
     *   Data
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#data-section"></a>
     * </h3>
     * <p>The JET CardView gets its data from a DataProvider.</p>
     *
     * <p><b>ArrayDataProvider</b> - Use this when the underlying data is an array object or an observableArray.  In the observableArray case, CardView will automatically react
     * when items are added or removed from the array.  See the documentation for ArrayDataProvider for more details on the available options.</p>
     *
     * <p>Example of data provider content</p>
     * <pre class="prettyprint"><code>
     *   &lt;oj-c-card-view aria-label="Accessible Summary" data="[[dataProvider]]">
     *   &lt;/oj-c-card-view>
     * </code></pre>
     *
     * <p>Check out the CardView Basic demo</a>
     *
     * <h3 id="keyboard-section">
     *   Coming Features
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#coming-features-section"></a>
     * </h3>
     *
     * <p>These features will be available in forthcoming versions</p>
     * <ul>
     *    <li>Context menu</li>
     *    <li>First selected item</li>
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
     *       <td rowspan = "20" nowrap>Card Item</td>
     *       <td><kbd>F2</kbd></td>
     *       <td>Enters tabbable mode.  This enables keyboard action on elements inside the item, including navigate between focusable elements inside the item.  It can also be used to exit tabbable mode if already in tabbable mode.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Esc</kbd></td>
     *       <td>Exits tabbable mode.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Tab</kbd></td>
     *       <td>When in tabbable mode, navigates to next focusable element within the item.  If the last focusable element is reached, shift focus back to the first focusable element.
     *           When not in tabbable mode, navigates to next focusable element on page (outside CardView).</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift+Tab</kbd></td>
     *       <td>When in tabbable mode, navigates to previous focusable element within the item.  If the first focusable element is reached, shift focus back to the last focusable element.
     *           When not in tabbable mode, navigates to previous focusable element on page (outside CardView).</td>
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
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Move focus to the item on the left.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Move focus to the item on the right.</td>
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
     *       <td><kbd>Shift+LeftArrow</kbd></td>
     *       <td>Extend the selection to the item on the left.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift+RightArrow</kbd></td>
     *       <td>Extend the selection to the item on the right.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Space</kbd></td>
     *       <td>Toggles to select and deselect the current item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift+Space</kbd></td>
     *       <td>Selects contiguous items from the last selected item to the current item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift+Cmd/Ctrl+DownArrow</kbd></td>
     *       <td>Reorder the current item down.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift+Cmd/Ctrl+UpArrow</kbd></td>
     *       <td>Reorder the current item up.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift+Cmd/Ctrl+LeftArrow</kbd></td>
     *       <td>Reorder the current item to the left.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift+Cmd/Ctrl+RightArrow</kbd></td>
     *       <td>Reorder the current item to the right.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>Application should specify a value for the aria-label attribute with a meaningful description of the purpose of this CardView.</p>
     * <p>Note that CardView uses the grid role and follows the <a href="https://www.w3.org/TR/wai-aria-practices/examples/grid/LayoutGrids.html">Layout Grid</a> design as outlined in the <a href="https://www.w3.org/TR/wai-aria-practices/#grid">grid design pattern</a></p>
     * <p>Nesting collection components such as ListView, Table, TreeView, and CardView inside of CardView is not supported.</p>
     * <p>When reorder feature is enabled, application should specify a live region which contains an announcement to notify assistive technologies that the card reordering happens.</p>
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
     *          This should be used to implement conditional behavior for all tabbable elements, this avoids creating a keyboard trap when tabbing through the CardView.<br/>
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
     *       <td>A reference to the root element of CardView.</td>
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
     *       <td>This will be supported by the Hierarchical list component and no longer applies to CardView..</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <h3 id="data-attributes-section">
     *   Custom Data Attributes
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#data-attributes-section"></a>
     * </h3>
     *
     * <p>CardView supports the following custom data attributes.
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
     *         <pre class="prettyprint"><code>&lt;oj-c-card-view id="CardView">
     *   &lt;template slot="itemTemplate" data-oj-as="item">
     *   &lt;/template>
     * &lt;/oj-c-card-view></code></pre>
     *       </td>
     *     </tr>
     *     <tr>
     *       <td><kbd>data-oj-clickthrough</kbd></td>
     *       <td><p>Specify on any element inside an item where you want to control whether CardView should perform actions triggered by
     *           a click event originating from the element or one of its descendants.</p>
     *           <p>For example, if you specify this attribute with a value of "disabled" on a link inside an item, then CardView
     *           will not select or trigger itemAction event to be fired when user clicks on the link.</p>
     *           <p>Note that the currentItem will still be updated to the item that the user clicked on.</p>
     *           <p>Also note you do not need to set this attribute on core pack components such as oj-c-button, as it natively supports
     *              disabling clickthrough.</p>
     *       </td>
     *       <td>
     *         <pre class="prettyprint"><code>&lt;oj-c-card-view id="card-view">
     *   &lt;template slot="itemTemplate">
     *     &lt;a href="#" data-oj-clickthrough="disabled">&lt;/a>
     *   &lt;/template>
     * &lt;/oj-c-card-view></code></pre>
     *       </td>
     *     </tr>
     *     <tr>
     *       <td><kbd>data-oj-manage-tabs</kbd></td>
     *       <td><p>CardView does not manipulate the tabindex of the item content.  Applications should set the tabIndex of any focusable
     *          element based on the isTabbableMode property from the context pass to the itemTemplate.</p>
     *          <p>However, there will be cases where you can't control the tabindex of the content, for example, if you are using components from another team.</p>
     *          <p>In that case, applications can specify this attribute on the element or one of its ancestors so that when the itemTemplate is processed,
     *          it will scan and manipulate the tabindex of any focusable elements.</p>
     *       </td>
     *       <td>
     *         <pre class="prettyprint"><code>&lt;oj-c-card-view id="CardView">
     *   &lt;template slot="itemTemplate">
     *     &lt;some-component-with-focusable-elements data-oj-manage-tabs>&lt;/some-component-with-focusable-elements>
     *   &lt;/template>
     * &lt;/oj-c-card-view></code></pre>
     *       </td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     *
     * @ojmetadata displayName "Card View"
     * @ojmetadata description "A CardView displays data items as a grid with highly interactive features."
     * @ojmetadata help "oj-c.CardView.html"
     * @ojmetadata main "oj-c/card-view"
     * @ojmetadata status [
     *   {
     *     type: "production",
     *     since: "19.0.0"
     *   }
     * ]
     * @ojmetadata extension {
     *   "vbdt": {
     *     "module": "oj-c/card-view",
     *   },
     *   "oracle": {
     *     "uxSpecs": [
     *       "card-view"
     *     ]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "selectionMode",
     *       "gutterSize",
     *       "focusBehavior",
     *       "initialAnimation"
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
     * @ojmetadata since "17.0.0"
     **/
    const CardViewImpl = ({ columns = 'auto', data = null, focusBehavior = 'card', gutterSize = 'sm', initialAnimation = 'slideUp', scrollPolicyOptions = { fetchSize: 25 }, selectionMode = 'none', reorderable = { items: 'disabled' }, ...rest }) => {
        const rootRef = (0, hooks_1.useRef)(null);
        const busyStateContext = (0, hooks_1.useContext)(UNSAFE_useBusyStateContext_1.BusyStateContext);
        const isClickthroughDisabled = (0, hooks_1.useCallback)((target) => {
            if (target === null || rootRef.current === null) {
                return false;
            }
            return isEventClickthroughDisabled({ target }, rootRef.current);
        }, []);
        const props = {
            columns,
            data,
            focusBehavior,
            gutterSize,
            initialAnimation,
            scrollPolicyOptions,
            selectionMode,
            reorderable,
            ...rest
        };
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: props.id, ref: rootRef, children: (0, jsx_runtime_1.jsx)(CardViewPreactWrapper, { isClickthroughDisabled: isClickthroughDisabled, busyStateContext: busyStateContext, ...props }) }));
    };
    // This custom element supports generic parameters, but was introduced before the pattern for exposing
    // generic parameters on the functional value-based element was established.  In order to introduce the generics in
    // a backwards-compatible way, they must be defaulted, but we don't want the defaults to be added to the existing
    // types which had generics from the start.  The solution is to use two consts:
    //   * the first is not exported, but is used as the basis for the custom element types and does not default its generics
    //   * the second is the exported functional value-based element and defaults the generics for backwards compatibility
    const CardViewWithoutDefaultedGenerics = (0, ojvcomponent_1.registerCustomElement)('oj-c-card-view', CardViewImpl, "CardView", { "properties": { "currentItem": { "type": "string|number", "readOnly": true, "writeback": true }, "data": { "type": "DataProvider|null" }, "gutterSize": { "type": "string", "enumValues": ["sm", "md", "lg", "xs", "xl"] }, "scrollPolicyOptions": { "type": "object", "properties": { "fetchSize": { "type": "number" }, "scroller": { "type": "string" } } }, "selected": { "type": "object", "writeback": true }, "selectionMode": { "type": "string", "enumValues": ["none", "multiple", "single", "singleRequired"] }, "initialAnimation": { "type": "string", "enumValues": ["slideUp", "slideDown"] }, "focusBehavior": { "type": "string", "enumValues": ["content", "card"] }, "columns": { "type": "number|string" }, "reorderable": { "type": "object", "properties": { "items": { "type": "string", "enumValues": ["disabled", "enabled"] } } } }, "slots": { "noData": { "data": {} }, "itemTemplate": { "data": {} }, "skeletonTemplate": { "data": {} } }, "events": { "ojReorder": {} }, "extension": { "_WRITEBACK_PROPS": ["currentItem", "selected"], "_READ_ONLY_PROPS": ["currentItem"], "_OBSERVED_GLOBAL_PROPS": ["aria-label", "aria-labelledby", "aria-describedby", "id"] } }, { "columns": "auto", "data": null, "focusBehavior": "card", "gutterSize": "sm", "initialAnimation": "slideUp", "scrollPolicyOptions": { "fetchSize": 25 }, "selectionMode": "none", "reorderable": { "items": "disabled" } }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
    exports.CardView = CardViewWithoutDefaultedGenerics;
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
