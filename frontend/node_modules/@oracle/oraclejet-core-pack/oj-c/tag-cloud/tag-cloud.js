define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "preact/hooks", "preact/compat", "@oracle/oraclejet-preact/UNSAFE_TagCloud", "@oracle/oraclejet-preact/hooks/UNSAFE_useBusyStateContext", "./utils", "@oracle/oraclejet-preact/UNSAFE_VisStatusMessage", "../hooks/UNSAFE_useVizCategories/useVizCategories", "ojs/ojvcomponent", "./utils", "../hooks/UNSAFE_useDataProvider/useDataProvider", "../utils/UNSAFE_vizUtils/TemplateHandler", "oj-c/hooks/PRIVATE_useVisContextMenu/useVisContextMenu", "css!oj-c/tag-cloud/tag-cloud-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, hooks_1, compat_1, UNSAFE_TagCloud_1, UNSAFE_useBusyStateContext_1, utils_1, UNSAFE_VisStatusMessage_1, useVizCategories_1, ojvcomponent_1, utils_2, useDataProvider_1, TemplateHandler_1, useVisContextMenu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TagCloud = void 0;
    const HIGHLIGHTED_DEFAULT = [];
    const SELECTION_DEFAULT = [];
    const HIDDEN_DEFAULT = [];
    /**
     * @classdesc
     * <h3 id="tagCloudOverview-section">
     *   JET Tag Cloud
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#tagCloudOverview-section"></a>
     * </h3>
     * *
     * <p>Tag clouds are used to display text data with
     * the importance of each tag shown with font size or color.</p>
     *
     *
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-c-tag-cloud
     *   data="[[dataProvider]]">
     * &lt;/oj-c-tag-cloud>
     * </code>
     * </pre>
     *
     *
     * <p>When using font colors as a data dimension for tag clouds, the application
     * needs to ensure that they meet minimum contrast requirements. Not all colors
     * in the default value ramp provided by oj.ColorAttributeGroupHandler
     * will meet minimum contrast requirements.</p>
     *
     * <h3 id="keyboard-section">
     *   Keyboard End User Information
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
     * </h3>
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Key</th>
     *       <th>Action</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td><kbd>Tab</kbd></td>
     *       <td>Move focus to next element.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + Tab</kbd></td>
     *       <td>Move focus to previous element.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Move focus and selection to previous data item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Move focus and selection to next data item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Move focus and selection to previous data item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Move focus and selection to next data item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + UpArrow</kbd></td>
     *       <td>Move focus and multi-select previous data item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + DownArrow</kbd></td>
     *       <td>Move focus and multi-select next data item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + LeftArrow</kbd></td>
     *       <td>Move focus and multi-select previous data item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift + RightArrow</kbd></td>
     *       <td>Move focus and multi-select next data item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Ctrl + UpArrow</kbd></td>
     *       <td>Move focus to previous data item, without changing the current selection.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Ctrl + DownArrow</kbd></td>
     *       <td>Move focus to next data item, without changing the current selection.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Ctrl + LeftArrow</kbd></td>
     *       <td>Move focus to previous data item, without changing the current selection.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Ctrl + RightArrow</kbd></td>
     *       <td>Move focus to next data item, without changing the current selection.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Ctrl + Spacebar</kbd></td>
     *       <td>Multi-select data item with focus.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Enter</kbd></td>
     *       <td>Open a link when the <code class="prettyprint">url</code> for a data item is set.</td>
     *     </tr>
     *      <tr>
     *       <td><kbd>Shift+F10</kbd></td>
     *       <td>Launch the context menu if there is one associated with the current item.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     * To make your component accessible, the application is required to include contextual information for screender readers using one or more the following methods as appropriate:
     *  <ul>
     *   <li>aria-describedby</li>
     *   <li>aria-labelledby</li>
     *   <li>aria-label</li>
     *   <li>short-desc property of your items</li>
     *  </ul>
     * <p>
     *  If your application has custom keyboard and touch shortcuts implemented for the component, these shortcuts can conflict with those of the component. It is the application's responsibility to disclose these custom shortcuts, possibly via a datatip or help popup.
     * </p>
     * <p>
     *  When using colors as a data dimension for tag clouds, the application needs to ensure that they meet <a target="_blank" href="https://www.w3.org/TR/WCAG21/#contrast-minimum">minimum contrast requirements</a>.
     * </p>
     *
     * <h3 id="perf-section">
     *   Performance
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
     * </h3>
     *
     * <h4>Shaped Data</h4>
     * <p>As a rule of thumb, it's recommended that applications use <a href="https://jet.oraclecorp.com/trunk/jetCookbook.html?component=tagCloudCorepack&demo=shapedData">shaped data</a> if possible for performance gains.</p>
     *
     * <h4>Layout</h4>
     * <p>Rectangular layouts are faster than cloud layouts and are recommended for larger data sets.
     * </p>
     *
     *
     * <h3 id="touch-section">
     * Touch End User Information
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
     * </h3>
     *
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Target</th>
     *       <th>Gesture</th>
     *       <th>Action</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td rowspan="3">Data Item</td>
     *       <td rowspan="2"><kbd>Tap</kbd></td>
     *       <td>Select when <code class="prettyprint">selectionMode</code> is enabled.</td>
     *     </tr>
     *     <tr>
     *        <td>Open a link when the <code class="prettyprint">url</code> for a data item is set.</td>
     *     </tr>
     *     <tr>
     *        <td><kbd>Press & Hold</kbd></td>
     *        <td>Display context menu on release.</td>
     *     </tr>
     *     <tr>
     *        <td>Background</td>
     *        <td><kbd>Press & Hold</kbd></td>
     *        <td>Display context menu on release.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     *
     * @ojmetadata description "A tag cloud is an interactive data visualization of textual data, where the importance of each tagged word or phrase is represented by font size or color."
     * @ojmetadata displayName "Tag Cloud"
     * @ojmetadata main "oj-c/tag-cloud"
     * @ojmetadata help "oj-c.TagCloud.html"
     * @ojmetadata status [
     *   {
     *     type: "candidate",
     *     since: "17.0.0"
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Visualizations"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/tag-cloud",
     *       "defaultColumns": 12,
     *         "minColumns": 6
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-cloud-tag",
     *     "uxSpecs": [
     *       "tag-cloud"
     *     ]
     *   }
     * }
     *
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "layout",
     *       "style"
     *     ]
     *   },
     *   {
     *     "propertyGroup": "data",
     *     "items": [
     *       "data",
     *       "selection"
     *     ]
     *   }
     * ]
     * @ojmetadata since "15.0.0"
     *
     * @ojmetadata requirements [
     *  {
     *    type: "anyOf",
     *    label: "accessibility",
     *    properties: ["aria-label", "aria-labelledby", "aria-describedby"]
     *  }
     * ]
     *
     */
    function TagCloudComp({ hiddenCategories = HIDDEN_DEFAULT, data = null, highlightedCategories = HIGHLIGHTED_DEFAULT, hoverBehavior = 'none', layout = 'rectangular', selection = SELECTION_DEFAULT, selectionMode = 'none', highlightMatch = 'all', contextMenuConfig, onOjContextMenuAction, onOjContextMenuSelection, ...props }) {
        const rootRef = (0, hooks_1.useRef)(null);
        const busyStateContext = (0, hooks_1.useContext)(UNSAFE_useBusyStateContext_1.BusyStateContext);
        const { data: compData } = (0, useDataProvider_1.useDataProvider)({
            data: data ? data : undefined,
            addBusyState: busyStateContext.addBusyState
        });
        const isHighlightOn = hoverBehavior === 'dim';
        const getItemContext = (0, hooks_1.useCallback)((context, index) => {
            return {
                data: context.data,
                key: context.key,
                index
            };
        }, []);
        const idToDPItemMap = new Map(compData.map((item) => [item.key, item.data]));
        const items = (0, compat_1.useMemo)(() => {
            const items = props.itemTemplate
                ? (0, TemplateHandler_1.processTemplate)(compData, props.itemTemplate, getItemContext, 'oj-c-tag-cloud-item')
                : compData.map((item) => item.data);
            return items;
        }, [props.itemTemplate, compData, getItemContext]);
        const [idItemMap, preactItems] = (0, compat_1.useMemo)(() => {
            const idItemMap = new Map();
            const preactItems = items.map((item) => {
                if (item.id != null || item.key != null)
                    idItemMap.set(item.id || item.key, item);
                return (0, utils_2.transformItem)(item);
            });
            return [idItemMap, preactItems];
        }, [items]);
        // TODO: JET-59090 could prevent this after useCategories support getIdFromItem
        // always create categoriesItems since we don't know when hidden categories will change
        const [hasUrl, categoriesItems] = (0, compat_1.useMemo)(() => {
            let hasUrl = false;
            const categories = items.map((item, itemIndex) => {
                hasUrl = hasUrl || item.url != null;
                return { id: preactItems[itemIndex].id, categories: item.categories || [] };
            });
            return [hasUrl, categories];
        }, [preactItems, items]);
        const { hiddenIds, highlightedIds, updateHighlighted } = (0, useVizCategories_1.useVizCategories)(categoriesItems, (item) => item.categories, hiddenCategories, highlightedCategories, 'any', highlightMatch, props.onHiddenCategoriesChanged, props.onHighlightedCategoriesChanged);
        const itemActionHandler = (detail) => {
            const item = idItemMap.get(detail.id);
            if (item?.url) {
                (0, utils_1.executeLink)(item.url);
            }
        };
        const selectionChangeHandler = (detail) => {
            props.onSelectionChanged?.(detail.ids);
        };
        const inputHandler = (detail) => {
            if (isHighlightOn)
                updateHighlighted(detail.id);
        };
        //corepack api isn't changed for now.
        const datatip = props.datatip != undefined
            ? (d) => {
                return {
                    content: props.datatip?.({ id: d.data.id }),
                    borderColor: undefined
                };
            }
            : undefined;
        const { preactContextMenuConfig } = (0, useVisContextMenu_1.useVisContextMenu)(idToDPItemMap, contextMenuConfig, onOjContextMenuAction, onOjContextMenuSelection);
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, children: !data || items.length === 0 ? ((0, jsx_runtime_1.jsx)(UNSAFE_VisStatusMessage_1.VisNoData, { "aria-label": props['aria-label'], "aria-describedby": props['aria-describedby'], "aria-labelledby": props['aria-labelledby'] })) : ((0, jsx_runtime_1.jsx)(UNSAFE_TagCloud_1.TagCloud, { layout: layout, datatip: datatip, highlightedIds: isHighlightOn ? highlightedIds : undefined, accessibleLabel: props['aria-label'], "aria-describedBy": props['aria-describedby'], "aria-labelledBy": props['aria-labelledby'], items: preactItems.filter((i) => !hiddenIds?.includes(i.id)), selectionMode: selectionMode, onSelectionChange: selectionChangeHandler, onItemAction: hasUrl ? itemActionHandler : undefined, onItemFocus: inputHandler, onItemHover: inputHandler, selectedIds: selectionMode === 'none' ? undefined : selection, width: "100%", height: "100%", contextMenuConfig: contextMenuConfig ? preactContextMenuConfig : undefined })) }));
    }
    // This custom element supports generic parameters, but was introduced before the pattern for exposing
    // generic parameters on the functional value-based element was established.  In order to introduce the generics in
    // a backwards-compatible way, they must be defaulted, but we don't want the defaults to be added to the existing
    // types which had generics from the start.  The solution is to use two consts:
    //   * the first is not exported, but is used as the basis for the custom element types and does not default its generics
    //   * the second is the exported functional value-based element and defaults the generics for backwards compatibility
    const TagCloudWithoutDefaultedGenerics = (0, ojvcomponent_1.registerCustomElement)('oj-c-tag-cloud', TagCloudComp, "TagCloud", { "properties": { "data": { "type": "DataProvider|null" }, "datatip": { "type": "function" }, "hiddenCategories": { "type": "Array<string>", "writeback": true }, "touchResponse": { "type": "string", "enumValues": ["auto", "touchStart"] }, "highlightMatch": { "type": "string", "enumValues": ["all", "any"] }, "highlightedCategories": { "type": "Array<string>", "writeback": true }, "hoverBehavior": { "type": "string", "enumValues": ["none", "dim"] }, "layout": { "type": "string", "enumValues": ["cloud", "rectangular"] }, "selectionMode": { "type": "string", "enumValues": ["none", "multiple", "single"] }, "selection": { "type": "Array<string|number>", "writeback": true }, "contextMenuConfig": { "type": "object", "properties": { "accessibleLabel": { "type": "string" }, "items": { "type": "function" } } } }, "slots": { "itemTemplate": { "data": {} } }, "events": { "ojContextMenuAction": { "bubbles": true }, "ojContextMenuSelection": { "bubbles": true } }, "extension": { "_WRITEBACK_PROPS": ["hiddenCategories", "highlightedCategories", "selection"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-label", "aria-describedby", "aria-labelledby"] } }, { "hiddenCategories": [], "data": null, "highlightedCategories": [], "hoverBehavior": "none", "layout": "rectangular", "selection": [], "selectionMode": "none", "highlightMatch": "all" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
    exports.TagCloud = TagCloudWithoutDefaultedGenerics;
});
