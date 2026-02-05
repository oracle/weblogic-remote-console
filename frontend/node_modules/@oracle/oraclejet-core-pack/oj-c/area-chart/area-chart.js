define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "preact/hooks", "@oracle/oraclejet-preact/UNSAFE_VisProgressiveLoader", "@oracle/oraclejet-preact/UNSAFE_LineAreaChart", "@oracle/oraclejet-preact/UNSAFE_VisStatusMessage", "@oracle/oraclejet-preact/UNSAFE_Legend", "@oracle/oraclejet-preact/UNSAFE_ChartWithLegend", "@oracle/oraclejet-preact/hooks/UNSAFE_useBusyStateContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useLegendPreferredSize", "@oracle/oraclejet-preact/UNSAFE_TrackResizeContainer", "@oracle/oraclejet-preact/hooks/UNSAFE_useUser", "ojs/ojvcomponent", "../hooks/UNSAFE_useChartData/useChartData", "../utils/PRIVATE_chartUtils/events", "../utils/PRIVATE_chartUtils/legendUtils", "../hooks/UNSAFE_useVizCategories/useVizCategories", "../utils/PRIVATE_chartUtils/lineAreaUtils", "../utils/PRIVATE_chartUtils/plotAreaUtils", "../utils/PRIVATE_chartUtils/axisUtils", "oj-c/hooks/PRIVATE_useVisContextMenu/useVisContextMenu", "css!oj-c/area-chart/area-chart-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, hooks_1, UNSAFE_VisProgressiveLoader_1, UNSAFE_LineAreaChart_1, UNSAFE_VisStatusMessage_1, UNSAFE_Legend_1, UNSAFE_ChartWithLegend_1, UNSAFE_useBusyStateContext_1, UNSAFE_useLegendPreferredSize_1, UNSAFE_TrackResizeContainer_1, UNSAFE_useUser_1, ojvcomponent_1, useChartData_1, events_1, legendUtils_1, useVizCategories_1, lineAreaUtils_1, plotAreaUtils_1, axisUtils_1, useVisContextMenu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AreaChart = void 0;
    const HIGHLIGHTED_DEFAULT = [];
    const SELECTION_DEFAULT = [];
    const HIDDEN_DEFAULT = [];
    const LEGEND_DEFAULT = { rendered: 'on', position: 'auto' };
    /**
     * @classdesc
     * <h3 id="areaChartOverview-section">
     *   JET Area Chart
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#areaChartOverview-section"></a>
     * </h3>
     * <p>An area chart displays information graphically using lines and filled areas, making relationships among the data easier to understand.</p>
     *
     *
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-c-area-chart
     *   data="[[dataProvider]]">
     * &lt;/oj-c-area-chart>
     * </code>
     * </pre>
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
     *  When setting color, applications are responsible for making sure that the color meets the <a target="_blank" href="https://www.w3.org/TR/WCAG21/#contrast-minimum">minimum contrast requirements</a>.
     * </p>
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
     *       <td><kbd>= or +</kbd></td>
     *       <td>Zoom in one level if zooming is enabled.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>- or _</kbd></td>
     *       <td>Zoom out one level if zooming is enabled.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>PageUp or Shift + PageUp</kbd></td>
     *       <td>Pan left in left-to-right locales. Pan right in right-to-left locales.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>PageDown or Shift + PageDown</kbd></td>
     *       <td>Pan right in left-to-right locales. Pan left in right-to-left locales.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Enter</kbd></td>
     *       <td>Drill on data item, categorical axis label, or legend item when <code class="prettyprint">drilling</code> is enabled.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Shift+F10</kbd></td>
     *       <td>Launch the context menu if there is one associated with the current item.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <h3 id="perf-section">
     *   Performance
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
     * </h3>
     *
     * <h4>Data Set Size</h4>
     * <p>As a rule of thumb, it's recommended that applications only set usable data densities on the chart. For example,
     *    it's not recommended to show more than 500 area series on a 500 pixel wide chart, since the areas will be unusably thin.
     *    While there are several optimizations within the chart to deal with large data sets, it's always more efficient to
     *    reduce the data set size as early as possible. Future optimizations will focus on improving end user experience as
     *    well as developer productivity for common use cases.
     * </p>
     *
     * <h4>Styling</h4>
     * <p>Use the highest level property available. For example, consider setting styling properties on
     *    <code class="prettyprint">styleDefaults</code> or <code class="prettyprint">series</code>, instead of styling properties
     *    on the individual data items. The chart can take advantage of these higher level properties to apply the style properties on
     *    containers, saving expensive DOM calls.
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
     *       <td rowspan="5">Data Item</td>
     *       <td rowspan="2"><kbd>Tap</kbd></td>
     *       <td>Select when <code class="prettyprint">selectionMode</code> is enabled.</td>
     *     </tr>
     *     <tr>
     *       <td>Drill when <code class="prettyprint">drilling</code> is enabled and <code class="prettyprint">selectionMode</code> is <code class="prettyprint">none</code>.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Double Tap</kbd></td>
     *       <td>Drill when <code class="prettyprint">drilling</code> is enabled and <code class="prettyprint">selectionMode</code> is enabled.</td>
     *     </tr>
     *     <tr>
     *       <td rowspan="2"><kbd>Press & Hold</kbd></td>
     *       <td>Display tooltip.</td>
     *     </tr>
     *     <tr>
     *       <td>Display context menu on release.</td>
     *     </tr>
     *     <tr>
     *       <td rowspan="2">Categorical Axis Item</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Drill when <code class="prettyprint">drilling</code> is enabled.</td>
     *     </tr>
     *      <tr>
     *        <td><kbd>Press & Hold</kbd></td>
     *        <td>Display context menu on release.</td>
     *     </tr>
     *     <tr>
     *       <td rowspan="2">Legend Item</td>
     *       <td rowspan="2"><kbd>Tap</kbd></td>
     *       <td>Drill when <code class="prettyprint">drilling</code> is enabled.</td>
     *     </tr>
     *     <tr>
     *       <td>Filter when <code class="prettyprint">hideAndShowBehavior</code> is enabled.</td>
     *     </tr>
     *     <tr>
     *       <td rowspan="5">Plot Area</td>
     *       <td rowspan="2"><kbd>Drag</kbd></td>
     *       <td>Pan when panning is enabled and toggled into that mode.</td>
     *     </tr>
     *     <tr>
     *       <td>Marquee select when <code class="prettyprint">selectionMode</code> is <code class="prettyprint">multiple</code> and toggled into that mode.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Pinch-close</kbd></td>
     *       <td>Zoom out when zooming is enabled.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Spread-open</kbd></td>
     *       <td>Zoom in when zooming is enabled.</td>
     *     </tr>
     *     <tr>
     *        <td><kbd>Press & Hold</kbd></td>
     *        <td>Display context menu on release.</td>
     *     </tr>
     *     <tr>
     *        <td>Series Area</td>
     *        <td><kbd>Press & Hold</kbd></td>
     *        <td>Display context menu on release.</td>
     *     </tr>
     *     <tr>
     *        <td>Axis Title</td>
     *        <td><kbd>Press & Hold</kbd></td>
     *        <td>Display context menu on release.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     *
     * @ojmetadata description "An area chart displays information graphically using lines and filled areas, making relationships among the data easier to understand."
     * @ojmetadata displayName "Area Chart"
     * @ojmetadata main "oj-c/area-chart"
     * @ojmetadata help "oj-c.AreaChart.html"
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
     *     "module": "oj-c/area-chart",
     *       "defaultColumns": 6,
     *         "minColumns": 1
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-area-chart",
     *     "uxSpecs": [
     *       "area-chart"
     *     ]
     *   }
     * }
     *
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *        "orientation",
     *        "legend.position",
     *        "legend.rendered",
     *        "stack",
     *        "xAxis.title",
     *        "yAxis.title",
     *        "style"
     *     ]
     *   },
     *   {
     *     "propertyGroup": "data",
     *     "items": [
     *       "data"
     *     ]
     *   }
     * ]
     * @ojmetadata since "16.0.0"
     *
     * @ojmetadata requirements [
     *   {
     *     type: "anyOf",
     *     label: "accessibility",
     *     properties: ["aria-label", "aria-labelledby", "aria-describedby"]
     *   }
     * ]
     *
     */
    function AreaChartComp({ data, hideAndShowBehavior = 'none', orientation = 'vertical', xAxis, yAxis, y2Axis, hoverBehavior = 'none', valueFormats, plotArea, zoomAndScroll, itemTemplate, seriesTemplate, groupTemplate, seriesComparator, groupComparator, drilling = 'off', hiddenCategories = HIDDEN_DEFAULT, highlightedCategories = HIGHLIGHTED_DEFAULT, highlightMatch = 'any', selection = SELECTION_DEFAULT, selectionMode = 'none', timeAxisType, stack = 'off', legend = LEGEND_DEFAULT, contextMenuConfig, onOjContextMenuAction, onOjContextMenuSelection, onSelectionChanged, splitterPosition = 0.5, splitDualY = 'off', ...props }) {
        const rootRef = (0, hooks_1.useRef)(null);
        const { direction } = (0, UNSAFE_useUser_1.useUser)();
        const isRtl = direction === 'rtl';
        const busyStateContext = (0, hooks_1.useContext)(UNSAFE_useBusyStateContext_1.BusyStateContext);
        const { series, groups, getDataItem, isLoading, idToDPItemMap, createGroupContext } = (0, useChartData_1.useChartData)(data, busyStateContext.addBusyState, itemTemplate, seriesTemplate, groupTemplate, 'oj-c-area-chart-item', 'oj-c-area-chart-series', 'oj-c-area-chart-group', seriesComparator, groupComparator);
        const { majorTick: xMajorTick, ...xAxisRest } = xAxis ?? {};
        const { majorTick: yMajorTick, minorTick: yMinorTick, ...yAxisRest } = yAxis ?? {};
        const { majorTick: y2MajorTick, minorTick: y2MinorTick, ...y2AxisRest } = y2Axis ?? {};
        const { itemDrillHandler, groupDrillHandler, seriesDrillHandler } = (0, events_1.getChartEventsHandler)(series, groups, drilling, props.onOjItemDrill, props.onOjGroupDrill, props.onOjSeriesDrill, createGroupContext);
        const selectionChangeHandler = (0, hooks_1.useCallback)((detail) => {
            onSelectionChanged?.(detail.ids);
        }, [onSelectionChanged]);
        const categoriesItems = (0, legendUtils_1.getBLACCategoriesItems)(series, groups, getDataItem, hoverBehavior, hideAndShowBehavior);
        const { hiddenIds, updateHidden, highlightedIds, updateHighlighted } = (0, useVizCategories_1.useVizCategories)(categoriesItems, (item) => item.categories, hiddenCategories, highlightedCategories, 'any', highlightMatch, props.onHiddenCategoriesChanged, props.onHighlightedCategoriesChanged);
        const onItemInput = (0, hooks_1.useCallback)((detail) => {
            if (hoverBehavior === 'none')
                return;
            const id = (0, events_1.getIdFromDetail)(detail, series, getDataItem);
            updateHighlighted(id);
        }, [hoverBehavior, updateHighlighted, series, getDataItem]);
        const legendData = (0, legendUtils_1.getLegendData)(series);
        const isLegendInteractive = hideAndShowBehavior != 'none' || hoverBehavior != 'none' || drilling === 'on';
        const legendItemActionHandler = (0, hooks_1.useCallback)((detail) => {
            if (hideAndShowBehavior != 'none') {
                updateHidden(detail.itemId);
                return;
            }
            seriesDrillHandler(detail);
        }, [hideAndShowBehavior, updateHidden, seriesDrillHandler]);
        const legendItemInputHandler = (0, hooks_1.useCallback)((detail) => {
            if (hoverBehavior != 'none') {
                updateHighlighted(detail.itemId);
            }
        }, [hoverBehavior, updateHighlighted]);
        const { preactContextMenuConfig } = (0, useVisContextMenu_1.useVisContextMenu)(idToDPItemMap, contextMenuConfig, onOjContextMenuAction, onOjContextMenuSelection);
        const renderLegend = (0, legendUtils_1.shouldRenderLegend)(series.length, legend.rendered);
        const legendSizeRef = (0, hooks_1.useRef)(null);
        const [isGetPreferredSizeReady, setIsGetPreferredSizeReady] = (0, hooks_1.useState)(false);
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, children: (0, jsx_runtime_1.jsx)(UNSAFE_TrackResizeContainer_1.TrackResizeContainer, { width: "100%", height: "100%", children: (_width, _height) => {
                    const legendPreferredSize = isGetPreferredSizeReady
                        ? legendSizeRef.current._getPreferredSize(_width, _height)
                        : undefined;
                    const legendPosition = (0, legendUtils_1.getLegendPosition)(legend.position, _width, _height);
                    const isLegendDimsResolved = !renderLegend || (renderLegend && legendPreferredSize);
                    const legendGap = (0, legendUtils_1.getLegendGap)(_width, _height);
                    const { width: preactChartWidth, height: preactChartHeight } = (0, legendUtils_1.getPreactChartDimensions)(_width, _height, legendPosition, legendPreferredSize);
                    const chart = series.length > 0 && groups.length > 0 && isLegendDimsResolved ? ((0, jsx_runtime_1.jsx)(UNSAFE_LineAreaChart_1.LineAreaChart, { type: "area", width: preactChartWidth, height: preactChartHeight, series: series, groups: groups, getDataItem: getDataItem, onItemHover: onItemInput, onItemFocus: onItemInput, drilling: drilling, dragMode: props.dragMode, onItemDrill: itemDrillHandler, onGroupDrill: groupDrillHandler, onSelectionChange: selectionChangeHandler, selectionMode: selectionMode, selectedIds: selectionMode === 'none' ? undefined : selection, orientation: orientation, xAxis: (0, axisUtils_1.getPreactAxisProps)({ ...xAxisRest, timeAxisType }, props.styleDefaults), yAxis: (0, axisUtils_1.getPreactAxisProps)(yAxisRest), y2Axis: {
                            ...(0, axisUtils_1.getPreactAxisProps)(y2AxisRest),
                            split: splitDualY === 'on' ? 1 - splitterPosition : 'off'
                        }, highlightedIds: highlightedIds.length === 0 ? undefined : highlightedIds, hiddenIds: hiddenIds, plotArea: (0, plotAreaUtils_1.getPlotArea)(plotArea, yMajorTick, yMinorTick, xMajorTick, y2MajorTick, y2MinorTick), hideAndShowBehavior: hideAndShowBehavior, hoverBehavior: hoverBehavior, isStacked: stack === 'on', valueFormats: (0, lineAreaUtils_1.transformValueFormats)(valueFormats), "aria-label": props['aria-label'], "aria-describedBy": props['aria-describedby'], "aria-labelledBy": props['aria-labelledby'], 
                        //@ts-ignore
                        contextMenuConfig: contextMenuConfig ? preactContextMenuConfig : undefined })) : (!isLoading && ((0, jsx_runtime_1.jsx)(UNSAFE_VisStatusMessage_1.VisNoData, { "aria-label": props['aria-label'], "aria-describedby": props['aria-describedby'], "aria-labelledby": props['aria-labelledby'] })));
                    const legendMaxWidth = legendPosition === 'start' || legendPosition === 'end'
                        ? (legendPreferredSize?.width || _width * legendUtils_1.LEGENDMAXSIZE) + legendGap.width
                        : _width;
                    const legendMaxHeight = legendPosition === 'top' || legendPosition === 'bottom'
                        ? (legendPreferredSize?.height || _height * legendUtils_1.LEGENDMAXSIZE) + legendGap.height
                        : _height;
                    const chartLegend = renderLegend && legendData.length > 0 ? (
                    // TODO: replace with sectional legend when implementing
                    // reference line. Currently sectional legend does not render properly
                    // for top and bottom legend position.
                    (0, jsx_runtime_1.jsx)(UNSAFE_useLegendPreferredSize_1.LegendRenderedContext.Provider, { value: {
                            isGetPreferredSizeReady: !isGetPreferredSizeReady
                                ? setIsGetPreferredSizeReady
                                : undefined,
                            width: legendMaxWidth,
                            height: legendMaxHeight
                        }, children: (0, jsx_runtime_1.jsx)(UNSAFE_Legend_1.Legend, { items: legendData, ref: legendSizeRef, orientation: legendPosition === 'start' || legendPosition === 'end'
                                ? 'vertical'
                                : 'horizontal', halign: "center", valign: "center", hideAndShowBehavior: hideAndShowBehavior === 'none' ? 'off' : 'on', hoverBehavior: hoverBehavior, isReadOnly: !isLegendInteractive, highlightedIds: highlightedIds.length === 0 ? undefined : highlightedIds, hiddenIds: hiddenIds.length === 0 ? undefined : hiddenIds, symbolHeight: legend.symbolHeight, symbolWidth: legend.symbolWidth, onItemAction: legendItemActionHandler, onItemHover: legendItemInputHandler, onItemFocus: legendItemInputHandler }) })) : undefined;
                    return ((0, jsx_runtime_1.jsx)(UNSAFE_VisProgressiveLoader_1.VisProgressiveLoader, { isLoading: isLoading, type: "area", "aria-label": props['aria-label'], "aria-describedBy": props['aria-describedby'], "aria-labelledBy": props['aria-labelledby'], children: (0, jsx_runtime_1.jsx)(UNSAFE_ChartWithLegend_1.ChartWithLegend, { chart: chart, position: legendPosition, isRtl: isRtl, legend: chartLegend }) }));
                } }) }));
    }
    // This custom element supports generic parameters, but was introduced before the pattern for exposing
    // generic parameters on the functional value-based element was established.  In order to introduce the generics in
    // a backwards-compatible way, they must be defaulted, but we don't want the defaults to be added to the existing
    // types which had generics from the start.  The solution is to use two consts:
    //   * the first is not exported, but is used as the basis for the custom element types and does not default its generics
    //   * the second is the exported functional value-based element and defaults the generics for backwards compatibility
    const AreaChartWithoutDefaultedGenerics = (0, ojvcomponent_1.registerCustomElement)('oj-c-area-chart', AreaChartComp, "AreaChart", { "properties": { "data": { "type": "DataProvider|null" }, "seriesComparator": { "type": "function" }, "groupComparator": { "type": "function" }, "stack": { "type": "string", "enumValues": ["off", "on"] }, "drilling": { "type": "string", "enumValues": ["off", "on"] }, "orientation": { "type": "string", "enumValues": ["horizontal", "vertical"] }, "timeAxisType": { "type": "string", "enumValues": ["enabled", "mixedFrequency", "skipGaps"] }, "yAxis": { "type": "object", "properties": { "dataMax": { "type": "number" }, "dataMin": { "type": "number" }, "max": { "type": "number" }, "min": { "type": "number" }, "majorTick": { "type": "object", "properties": { "lineColor": { "type": "string" }, "lineStyle": { "type": "string", "enumValues": ["dashed", "solid", "dotted"] }, "lineWidth": { "type": "number" }, "rendered": { "type": "string", "enumValues": ["auto", "off", "on"] } } }, "minorTick": { "type": "object", "properties": { "lineColor": { "type": "string" }, "lineStyle": { "type": "string", "enumValues": ["dashed", "solid", "dotted"] }, "lineWidth": { "type": "number" }, "rendered": { "type": "string", "enumValues": ["auto", "off", "on"] } } }, "tickLabel": { "type": "object", "properties": { "converter": { "type": "object" }, "rendered": { "type": "string", "enumValues": ["off", "on"] }, "style": { "type": "object" } } }, "viewportMin": { "type": "number" }, "viewportMax": { "type": "number" }, "step": { "type": "number" }, "size": { "type": "number" }, "scale": { "type": "string", "enumValues": ["linear", "log"] }, "title": { "type": "string" }, "titleStyle": { "type": "object" } } }, "y2Axis": { "type": "object", "properties": { "dataMax": { "type": "number" }, "dataMin": { "type": "number" }, "max": { "type": "number" }, "min": { "type": "number" }, "majorTick": { "type": "object", "properties": { "lineColor": { "type": "string" }, "lineStyle": { "type": "string", "enumValues": ["dashed", "solid", "dotted"] }, "lineWidth": { "type": "number" }, "rendered": { "type": "string", "enumValues": ["auto", "off", "on"] } } }, "minorTick": { "type": "object", "properties": { "lineColor": { "type": "string" }, "lineStyle": { "type": "string", "enumValues": ["dashed", "solid", "dotted"] }, "lineWidth": { "type": "number" }, "rendered": { "type": "string", "enumValues": ["auto", "off", "on"] } } }, "tickLabel": { "type": "object", "properties": { "converter": { "type": "object" }, "rendered": { "type": "string", "enumValues": ["off", "on"] }, "style": { "type": "object" } } }, "viewportMin": { "type": "number" }, "viewportMax": { "type": "number" }, "step": { "type": "number" }, "size": { "type": "number" }, "scale": { "type": "string", "enumValues": ["linear", "log"] }, "title": { "type": "string" }, "titleStyle": { "type": "object" } } }, "splitDualY": { "type": "string", "enumValues": ["off", "on"] }, "splitterPosition": { "type": "number" }, "xAxis": { "type": "object", "properties": { "majorTick": { "type": "object", "properties": { "lineColor": { "type": "string" }, "lineStyle": { "type": "string", "enumValues": ["dashed", "solid", "dotted"] }, "lineWidth": { "type": "number" }, "rendered": { "type": "string", "enumValues": ["auto", "off", "on"] } } }, "minorTick": { "type": "object", "properties": { "lineColor": { "type": "string" }, "lineStyle": { "type": "string", "enumValues": ["dashed", "solid", "dotted"] }, "lineWidth": { "type": "number" }, "rendered": { "type": "string", "enumValues": ["auto", "off", "on"] } } }, "tickLabel": { "type": "object", "properties": { "converter": { "type": "object|Array<object>" }, "rendered": { "type": "string", "enumValues": ["off", "on"] }, "rotation": { "type": "string", "enumValues": ["auto", "none"] }, "style": { "type": "object" } } }, "viewportMin": { "type": "number" }, "viewportMax": { "type": "number" }, "step": { "type": "number" }, "size": { "type": "number" }, "scale": { "type": "string", "enumValues": ["linear", "log"] }, "title": { "type": "string" }, "titleStyle": { "type": "object" } } }, "plotArea": { "type": "object", "properties": { "backgroundColor": { "type": "string" } } }, "zoomAndScroll": { "type": "string", "enumValues": ["off", "live"] }, "valueFormats": { "type": "object", "properties": { "group": { "type": "object", "properties": { "tooltipLabel": { "type": "string" }, "tooltipDisplay": { "type": "string", "enumValues": ["auto", "off"] } } }, "series": { "type": "object", "properties": { "tooltipLabel": { "type": "string" }, "tooltipDisplay": { "type": "string", "enumValues": ["auto", "off"] } } }, "value": { "type": "object", "properties": { "converter": { "type": "object" }, "tooltipLabel": { "type": "string" }, "tooltipDisplay": { "type": "string", "enumValues": ["auto", "off"] } } } } }, "styleDefaults": { "type": "object", "properties": { "groupSeparators": { "type": "object", "properties": { "rendered": { "type": "string", "enumValues": ["auto", "off"] }, "color": { "type": "string" } } } } }, "selectionMode": { "type": "string", "enumValues": ["none", "multiple", "single"] }, "selection": { "type": "Array<string|number>", "writeback": true }, "hiddenCategories": { "type": "Array<string>", "writeback": true }, "dragMode": { "type": "string", "enumValues": ["pan", "zoom", "select", "off", "user"] }, "highlightedCategories": { "type": "Array<string>", "writeback": true }, "hideAndShowBehavior": { "type": "string", "enumValues": ["none", "withoutRescale", "withRescale"] }, "hoverBehavior": { "type": "string", "enumValues": ["none", "dim"] }, "highlightMatch": { "type": "string", "enumValues": ["all", "any"] }, "legend": { "type": "object", "properties": { "position": { "type": "string", "enumValues": ["auto", "end", "start", "top", "bottom"] }, "rendered": { "type": "string", "enumValues": ["auto", "off", "on"] }, "maxSize": { "type": "number|string" }, "size": { "type": "number|string" }, "symbolHeight": { "type": "number" }, "symbolWidth": { "type": "number" } } }, "contextMenuConfig": { "type": "object", "properties": { "accessibleLabel": { "type": "string" }, "items": { "type": "function" } } } }, "slots": { "itemTemplate": { "data": {} }, "seriesTemplate": { "data": {} }, "groupTemplate": { "data": {} } }, "events": { "ojViewportChange": {}, "ojItemDrill": {}, "ojGroupDrill": {}, "ojSeriesDrill": {}, "ojContextMenuAction": { "bubbles": true }, "ojContextMenuSelection": { "bubbles": true } }, "extension": { "_WRITEBACK_PROPS": ["selection", "hiddenCategories", "highlightedCategories"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-label", "aria-describedby", "aria-labelledby"] } }, { "hideAndShowBehavior": "none", "orientation": "vertical", "hoverBehavior": "none", "drilling": "off", "hiddenCategories": [], "highlightedCategories": [], "highlightMatch": "any", "selection": [], "selectionMode": "none", "stack": "off", "legend": { "rendered": "on", "position": "auto" }, "splitterPosition": 0.5, "splitDualY": "off" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
    exports.AreaChart = AreaChartWithoutDefaultedGenerics;
});
