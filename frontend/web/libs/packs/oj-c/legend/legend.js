define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "preact/hooks", "preact/compat", "@oracle/oraclejet-preact/UNSAFE_Legend", "@oracle/oraclejet-preact/hooks/UNSAFE_useBusyStateContext", "@oracle/oraclejet-preact/UNSAFE_SectionalLegend", "ojs/ojvcomponent", "./utils", "../hooks/UNSAFE_useDataProvider/useDataProvider", "../utils/UNSAFE_vizUtils/TemplateHandler", "@oracle/oraclejet-preact/hooks/UNSAFE_useTranslationBundle", "preact/compat", "../hooks/UNSAFE_useVizCategories/useVizCategories", "./events", "./useSectionData", "oj-c/hooks/PRIVATE_useVisContextMenu/useVisContextMenu", "css!oj-c/legend/legend-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, hooks_1, compat_1, UNSAFE_Legend_1, UNSAFE_useBusyStateContext_1, UNSAFE_SectionalLegend_1, ojvcomponent_1, utils_1, useDataProvider_1, TemplateHandler_1, UNSAFE_useTranslationBundle_1, compat_2, useVizCategories_1, events_1, useSectionData_1, useVisContextMenu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SectionalLegend = exports.LinearLegend = exports.Legend = void 0;
    const HIGHLIGHTED_DEFAULT = [];
    const HIDDEN_DEFAULT = [];
    const TEXTSTYLE_DEFAULT = {};
    const SECTION_TITLE_DEFAULT = {};
    // This custom element supports generic parameters, but was introduced before the pattern for exposing
    // generic parameters on the functional value-based element was established.  In order to introduce the generics in
    // a backwards-compatible way, they must be defaulted, but we don't want the defaults to be added to the existing
    // types which had generics from the start.  The solution is to use two consts:
    //   * the first is not exported, but is used as the basis for the custom element types and does not default its generics
    //   * the second is the exported functional value-based element and defaults the generics for backwards compatibility
    const LegendWithoutDefaultedGenerics = (0, ojvcomponent_1.registerCustomElement)('oj-c-legend', (0, compat_1.forwardRef)(
    /**
     * @classdesc
     * <h3 id="legendOverview-section">
     *   JET Legend
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#legendOverview-section"></a>
     * </h3>
     * A legend displays an interactive description of symbols, colors, etc used in graphical information representations.
     * <pre class="prettyprint"><code>&lt;oj-c-legend orientation='vertical' data='[[dataProvider]]'>&lt;/oj-c-legend></code></pre>
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
     *  When setting color, applications are responsible for making sure that the color meets the
     * <a href="https://www.w3.org/TR/WCAG21/#non-text-contrast">minimum contrast ratio</a>
     * </p>
     * <p>
     *  If your application has custom keyboard and touch shortcuts implemented for the component, these shortcuts can conflict with those of the component. It is the application's responsibility to disclose these custom shortcuts, possibly via a datatip or help popup.
     * </p>
     * <p>
     *  In the case of the text truncating, applications should provide the untruncated string or contextual text to the datatip to make the component accessible.
     * </p>
     *
     * <h3 id="perf-section">
     *   Performance
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
     * </h3>
     *
     * <h4>Shaped Data</h4>
     * <p>As a rule of thumb, it's recommended that applications use <a href="https://jet.oraclecorp.com/trunk/jetCookbook.html?component=legendCorepack&demo=shapedData">shaped data</a> if possible for performance gains.</p>
     *
     * <h3 id="keyboardSection">
     *   Keyboard
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboardSection"></a>
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
     *       <td>Move focus to previous item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Move focus to next item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>LeftArrow</kbd></td>
     *       <td>Move focus to previous item (on left).</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>RightArrow</kbd></td>
     *       <td>Move focus to next item (on right).</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Enter or Space</kbd></td>
     *       <td>Hides or unhides the data associated with the current item.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift+F10</kbd></td>
     *       <td>Launch the context menu if there is one associated with the current item.</td>
     *     </tr>
     *   </tbody>
     * </table>
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
     *       <td rowspan="2">Legend Item</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Filter when <code class="prettyprint">hideAndShowBehavior</code> is enabled.</td>
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
     * @ojmetadata description "A legend displays an interactive description of symbols, colors, etc., used in graphical information representations."
     * @ojmetadata displayName "Legend"
     * @ojmetadata main "oj-c/legend"
     * @ojmetadata help "oj-c.Legend.html"
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
     *     "module": "oj-c/legend",
     *       "defaultColumns": 2,
     *         "minColumns": 1
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-legend",
     *     "uxSpecs": [
     *       "legend"
     *     ]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "orientation",
     *       "halign",
     *       "valign",
     *       "hoverBehavior",
     *       "style"
     *     ]
     *   },
     *   {
     *     "propertyGroup": "data",
     *     "items": [
     *       "data"
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
    ({ data = null, drilling = 'off', halign = 'start', valign = 'top', hiddenCategories = HIDDEN_DEFAULT, hideAndShowBehavior = 'off', highlightedCategories = HIGHLIGHTED_DEFAULT, hoverBehavior = 'none', orientation = 'vertical', symbolHeight = 0, symbolWidth = 0, textStyle = TEXTSTYLE_DEFAULT, sectionTitleStyle = SECTION_TITLE_DEFAULT, sectionTitleHalign = 'start', contextMenuConfig, onOjContextMenuAction, onOjContextMenuSelection, itemTemplate, sectionTemplate, onOjDrill, ...props }, ref) => {
        const rootRef = (0, hooks_1.useRef)(null);
        const busyStateContext = (0, hooks_1.useContext)(UNSAFE_useBusyStateContext_1.BusyStateContext);
        const legendRef = (0, hooks_1.useRef)(null);
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            _getPreferredSize: (_width, _height) => {
                return legendRef.current._getPreferredSize(_width, _height);
            }
        }));
        const isTreeData = (0, utils_1.isTreeDataProvider)(data);
        const { width: symWidth, height: symHeight } = (0, utils_1.getDefaultSymbolDims)(symbolHeight, symbolWidth);
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, children: isTreeData ? ((0, jsx_runtime_1.jsx)(exports.SectionalLegend, { ...props, onOjDrill: onOjDrill, data: data, halign: halign, valign: valign, sectionTemplate: sectionTemplate, itemTemplate: itemTemplate, addBusyState: busyStateContext.addBusyState, drilling: drilling, hiddenCategories: hiddenCategories, hideAndShowBehavior: hideAndShowBehavior, highlightedCategories: highlightedCategories, hoverBehavior: hoverBehavior, orientation: orientation, symbolHeight: symHeight, symbolWidth: symWidth, textStyle: textStyle, sectionTitleStyle: sectionTitleStyle, sectionTitleHalign: sectionTitleHalign, sectionalLegendRef: legendRef, contextMenuConfig: contextMenuConfig, onOjContextMenuAction: onOjContextMenuAction, onOjContextMenuSelection: onOjContextMenuSelection })) : ((0, jsx_runtime_1.jsx)(exports.LinearLegend, { ...props, onOjDrill: onOjDrill, data: data, valign: valign, halign: halign, itemTemplate: itemTemplate, drilling: drilling, hiddenCategories: hiddenCategories, hideAndShowBehavior: hideAndShowBehavior, highlightedCategories: highlightedCategories, hoverBehavior: hoverBehavior, orientation: orientation, symbolHeight: symHeight, symbolWidth: symHeight, addBusyState: busyStateContext.addBusyState, textStyle: textStyle, linearLegendRef: legendRef, contextMenuConfig: contextMenuConfig, onOjContextMenuAction: onOjContextMenuAction, onOjContextMenuSelection: onOjContextMenuSelection })) }));
    }), "Legend", { "properties": { "data": { "type": "DataProvider|null" }, "drilling": { "type": "string", "enumValues": ["off", "on"] }, "halign": { "type": "string", "enumValues": ["center", "end", "start"] }, "hiddenCategories": { "type": "Array<string>", "writeback": true }, "hideAndShowBehavior": { "type": "string", "enumValues": ["off", "on"] }, "highlightedCategories": { "type": "Array<string>", "writeback": true }, "hoverBehavior": { "type": "string", "enumValues": ["none", "dim"] }, "orientation": { "type": "string", "enumValues": ["horizontal", "vertical"] }, "symbolHeight": { "type": "number" }, "symbolWidth": { "type": "number" }, "textStyle": { "type": "object", "properties": { "color": { "type": "string" }, "fontFamily": { "type": "string" }, "fontSize": { "type": "string" }, "fontStyle": { "type": "string" }, "fontWeight": { "type": "string" }, "textDecoration": { "type": "string" } } }, "valign": { "type": "string", "enumValues": ["top", "bottom", "middle"] }, "sectionTitleStyle": { "type": "object", "properties": { "color": { "type": "string" }, "fontFamily": { "type": "string" }, "fontSize": { "type": "string" }, "fontStyle": { "type": "string" }, "fontWeight": { "type": "string" }, "textDecoration": { "type": "string" } } }, "sectionTitleHalign": { "type": "string", "enumValues": ["center", "end", "start"] }, "contextMenuConfig": { "type": "object", "properties": { "accessibleLabel": { "type": "string" }, "items": { "type": "function" } } } }, "slots": { "itemTemplate": { "data": {} }, "sectionTemplate": { "data": {} } }, "events": { "ojDrill": {}, "ojContextMenuAction": { "bubbles": true }, "ojContextMenuSelection": { "bubbles": true } }, "extension": { "_WRITEBACK_PROPS": ["hiddenCategories", "highlightedCategories"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-label", "aria-describedby", "aria-labelledby"] }, "methods": { "_getPreferredSize": {} } }, { "data": null, "drilling": "off", "halign": "start", "valign": "top", "hiddenCategories": [], "hideAndShowBehavior": "off", "highlightedCategories": [], "hoverBehavior": "none", "orientation": "vertical", "symbolHeight": 0, "symbolWidth": 0, "textStyle": {}, "sectionTitleStyle": {}, "sectionTitleHalign": "start" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [] });
    exports.Legend = LegendWithoutDefaultedGenerics;
    /**
     * The wrapper for the liner legend.
     */
    const LinearLegend = ({ hoverBehavior, hideAndShowBehavior, hiddenCategories, highlightedCategories, onHiddenCategoriesChanged, onHighlightedCategoriesChanged, drilling, itemTemplate, sectionTemplate, textStyle, orientation, symbolHeight, symbolWidth, valign, halign, contextMenuConfig, onOjContextMenuAction, onOjContextMenuSelection, ...props }) => {
        const { data } = (0, useDataProvider_1.useDataProvider)({
            data: props.data ? props.data : undefined,
            addBusyState: props.addBusyState
        });
        const idToDPItemMap = new Map(data.map((item) => [item.key, item.data]));
        const isHighlightOn = hoverBehavior === 'dim';
        const isHideShowOn = hideAndShowBehavior === 'on';
        const getItemContext = (context, index) => {
            return {
                data: context.data,
                key: context.key,
                index
            };
        };
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        const items = (itemTemplate
            ? (0, TemplateHandler_1.processTemplate)(data, itemTemplate, getItemContext, 'oj-c-legend-item')
            : data.map((item) => item.data));
        const hasDrillableItem = (0, compat_2.useMemo)(() => {
            return items.some((value) => value.drilling === 'on');
        }, [items]);
        const isContextMenuEnabled = !!contextMenuConfig;
        const preactItems = (0, compat_2.useMemo)(() => {
            return items.map((value, itemIndex) => {
                return (0, utils_1.transformItem)(value, 0, itemIndex, (drilling === 'on' && value.drilling !== 'off') || value.drilling === 'on'
                    ? translations.vis_drillable()
                    : '', drilling, hideAndShowBehavior, isContextMenuEnabled);
            });
        }, [items, drilling, translations]);
        const isInteractive = (0, utils_1.isLegendInteractive)(drilling, hideAndShowBehavior, hoverBehavior, hasDrillableItem, isContextMenuEnabled);
        // TODO: JET-59090 could prevent this after useCategories support getIdFromItem
        const categoriesItems = (0, compat_2.useMemo)(() => {
            const categoriesItems = [];
            if (isHideShowOn || isHighlightOn) {
                items.forEach((item, itemIndex) => {
                    categoriesItems.push({
                        id: preactItems[itemIndex].id,
                        categories: item.categories || []
                    });
                });
            }
            return categoriesItems;
        }, [preactItems, items, isHideShowOn, isHighlightOn]);
        const { hiddenIds, updateHidden, highlightedIds, updateHighlighted } = (0, useVizCategories_1.useVizCategories)(categoriesItems, (item) => item.categories, hiddenCategories, highlightedCategories, 'any', 'any', onHiddenCategoriesChanged, onHighlightedCategoriesChanged);
        const getDrillDetail = (id) => {
            const [_, itemIdx] = id;
            const item = items[itemIdx];
            if ((item.categories || []).length > 0)
                return item.categories; //legacy behavior
            return data[itemIdx].metadata?.key;
        };
        const getItemDrilling = (itemIdx) => {
            const item = items[itemIdx];
            return item?.drilling || 'inherit';
        };
        const { itemActionHandler, inputHandler } = (0, events_1.getLegendEventsHandler)(isHideShowOn, isHighlightOn, updateHidden, updateHighlighted, getDrillDetail, drilling, getItemDrilling, props.onOjDrill);
        const textStyles = (0, utils_1.getTextStyles)(textStyle);
        const transformContext = (context) => {
            if (context.type !== 'item')
                return context;
            const id = context.data.id;
            const [_, itemIdx] = (0, utils_1.parseItemIdx)(id);
            const corepackItemData = idToDPItemMap.get(data[itemIdx].metadata?.key);
            const corepackData = { ...preactItems[itemIdx], id: data[itemIdx].metadata?.key };
            return {
                data: corepackData,
                itemData: corepackItemData,
                itemIndexPath: [itemIdx],
                type: 'item'
            };
        };
        const { preactContextMenuConfig } = (0, useVisContextMenu_1.useVisContextMenu)(idToDPItemMap, contextMenuConfig, onOjContextMenuAction, onOjContextMenuSelection, transformContext);
        const { data: _data, ...otherProps } = props;
        const vAlign = valign === 'middle' ? 'center' : valign;
        return preactItems.length !== 0 ? ((0, jsx_runtime_1.jsx)(UNSAFE_Legend_1.Legend, { ref: props.linearLegendRef, orientation: orientation, symbolHeight: symbolHeight, valign: vAlign, halign: halign, symbolWidth: symbolWidth, isReadOnly: !isInteractive, hideAndShowBehavior: hideAndShowBehavior, hoverBehavior: hoverBehavior, hiddenIds: isHideShowOn ? hiddenIds : undefined, highlightedIds: isHighlightOn ? highlightedIds : undefined, items: preactItems, onItemAction: itemActionHandler, onItemHover: inputHandler, onItemFocus: inputHandler, 
            //@ts-ignore
            contextMenuConfig: contextMenuConfig ? preactContextMenuConfig : undefined, ...otherProps, ...textStyles })) : null;
    };
    exports.LinearLegend = LinearLegend;
    /**
     * The wrapper for sectional legend.
     */
    const SectionalLegend = ({ hoverBehavior, hideAndShowBehavior, hiddenCategories, highlightedCategories, onHiddenCategoriesChanged, onHighlightedCategoriesChanged, drilling, itemTemplate, sectionTemplate, textStyle, sectionTitleStyle, orientation, symbolHeight, symbolWidth, valign, halign, contextMenuConfig, onOjContextMenuAction, onOjContextMenuSelection, ...props }) => {
        const isHighlightOn = hoverBehavior === 'dim';
        const isHideShowOn = hideAndShowBehavior === 'on';
        const translations = (0, UNSAFE_useTranslationBundle_1.useTranslationBundle)('@oracle/oraclejet-preact');
        const { sections: s, idToDPItemMap } = (0, useSectionData_1.useSectionData)(props.data, props.addBusyState, sectionTemplate, itemTemplate);
        const sections = s;
        const hasDrillableItem = (0, compat_2.useMemo)(() => {
            return sections.some((section) => section.items.some((item) => item.drilling === 'on'));
        }, [sections]);
        const preactSections = (0, compat_2.useMemo)(() => {
            const preactSections = sections.map((section, sectionIdx) => (0, utils_1.transformSection)(section, drilling === 'on' ? translations.vis_drillable() : '', sectionIdx));
            return preactSections;
        }, [sections, drilling, translations]);
        const isContextMenuEnabled = !!contextMenuConfig;
        const isInteractive = (0, utils_1.isLegendInteractive)(drilling, hideAndShowBehavior, hoverBehavior, hasDrillableItem, isContextMenuEnabled);
        // TODO: JET-59090 could prevent this after useCategories support getIdFromItem
        const categoriesItems = (0, compat_2.useMemo)(() => {
            const categoriesItems = [];
            if (isHideShowOn || isHighlightOn) {
                sections.forEach((section, sectionIndex) => {
                    section.items.forEach((item, itemIndex) => {
                        categoriesItems.push({
                            id: preactSections[sectionIndex].items[itemIndex].id,
                            categories: item.categories || []
                        });
                    });
                });
            }
            return categoriesItems;
        }, [sections, isHideShowOn, isHighlightOn, preactSections]);
        const { hiddenIds, updateHidden, highlightedIds, updateHighlighted } = (0, useVizCategories_1.useVizCategories)(categoriesItems, (item) => item.categories, hiddenCategories, highlightedCategories, 'any', 'any', onHiddenCategoriesChanged, onHighlightedCategoriesChanged);
        const getDrillDetail = (id) => {
            const [sectionIdx, itemIdx] = id;
            const item = sections[sectionIdx].items[itemIdx];
            if (item.categories)
                return item.categories; //legacy behavior
            return item.key;
        };
        const getItemDrilling = (itemIdx, sectionIdx) => {
            const item = sections[sectionIdx].items[itemIdx];
            return item?.drilling || 'inherit';
        };
        const { itemActionHandler, inputHandler } = (0, events_1.getLegendEventsHandler)(isHideShowOn, isHighlightOn, updateHidden, updateHighlighted, getDrillDetail, drilling, getItemDrilling, props.onOjDrill);
        const transformContext = (context) => {
            if (context.type !== 'item')
                return context;
            const id = context.data.id;
            const [sectionIdx, itemIdx] = (0, utils_1.parseItemIdx)(id);
            const corepackItemData = idToDPItemMap.get(sections[sectionIdx].items[itemIdx].key);
            const corepackData = {
                ...preactSections[sectionIdx].items[itemIdx],
                id: sections[sectionIdx].items[itemIdx].key
            };
            return {
                data: corepackData,
                itemData: corepackItemData,
                itemIndexPath: [sectionIdx, itemIdx],
                type: 'item'
            };
        };
        const { preactContextMenuConfig } = (0, useVisContextMenu_1.useVisContextMenu)(idToDPItemMap, contextMenuConfig, onOjContextMenuAction, onOjContextMenuSelection, transformContext);
        const textStyles = (0, utils_1.getTextStyles)(textStyle);
        const sectionTitleStyles = (0, utils_1.getSectionStyles)(sectionTitleStyle);
        const vAlign = valign === 'middle' ? 'center' : valign;
        return preactSections.length !== 0 ? ((0, jsx_runtime_1.jsx)(UNSAFE_SectionalLegend_1.SectionalLegend, { ref: props.sectionalLegendRef, sections: preactSections, orientation: orientation, sectionTitleHAlign: props.sectionTitleHalign, symbolHeight: symbolHeight, symbolWidth: symbolWidth, isReadOnly: !isInteractive, valign: vAlign, halign: halign, hideAndShowBehavior: hideAndShowBehavior, hoverBehavior: hoverBehavior, "aria-label": props['aria-label'], "aria-describedBy": props['aria-describedby'], "aria-labelledBy": props['aria-labelledby'], hiddenIds: isHideShowOn ? hiddenIds : undefined, highlightedIds: isHighlightOn ? highlightedIds : undefined, onItemAction: itemActionHandler, onItemHover: inputHandler, onItemFocus: inputHandler, 
            //@ts-ignore
            contextMenuConfig: contextMenuConfig ? preactContextMenuConfig : undefined, ...textStyles, ...sectionTitleStyles })) : null;
    };
    exports.SectionalLegend = SectionalLegend;
});
