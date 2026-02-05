/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentProps, ComponentChildren } from 'preact';
import { LineAreaChart as PreactAreaChart } from '@oracle/oraclejet-preact/UNSAFE_LineAreaChart';
import { DataProvider } from 'ojs/ojdataprovider';
import { AreaChartItemImplProps } from '../area-chart-item/area-chart-item';
import 'css!oj-c/area-chart/area-chart-styles.css';
import { Action, Bubbles, ExtendGlobalProps, ObservedGlobalProps, PropertyChanged, TemplateSlot } from 'ojs/ojvcomponent';
import { ChartItemTemplateContext, ChartSeriesTemplateContext, ChartGroupTemplateContext } from '../hooks/UNSAFE_useChartData/useChartData';
import { Group } from '@oracle/oraclejet-preact/utils/UNSAFE_visTypes/chart';
import type { ViewPortDetail, PlotArea, YAxis, XAxis, ValueFormats, Y2Axis } from '../utils/UNSAFE_vizTypes/chartTypes';
import { AreaChartSeriesProps } from '../area-chart-series/area-chart-series';
import { ChartLegend } from 'oj-c/utils/UNSAFE_vizTypes/legendTypes';
import { type ContextMenuConfig, type ContextMenuSelectionDetail, type ContextMenuActionDetail } from 'oj-c/hooks/PRIVATE_useVisContextMenu/useVisContextMenu';
import { ColorProps } from '@oracle/oraclejet-preact/utils/UNSAFE_interpolations/colors';
type PreactAreaChartProps = ComponentProps<typeof PreactAreaChart>;
export type AreaChartContextMenuConfig<K, D> = ContextMenuConfig<AreaContextMenuContext<K, D>>;
type AreaChartContextMenuSelectionDetail<K, D> = ContextMenuSelectionDetail<AreaContextMenuContext<K, D>>;
type AreaChartContextMenuActionDetail<K, D> = ContextMenuActionDetail<AreaContextMenuContext<K, D>>;
/** @deprecated since 19.0.0 - use 'CAreaChartElement.&lt;event-name&gt;[&apos;detail&apos;]' instead */
export type AreaChartContextMenuSelectionDetailDeprecated<K, D> = AreaChartContextMenuSelectionDetail<K, D>;
/** @deprecated since 19.0.0 - use 'CAreaChartElement.&lt;event-name&gt;[&apos;detail&apos;]' instead */
export type AreaChartContextMenuActionDetailDeprecated<K, D> = AreaChartContextMenuActionDetail<K, D>;
export type AreaContextMenuContext<K, D> = {
    /**
     * The shaped data of the item.
     */
    data?: AreaItem<K>;
    /**
     * The data of the item from the data provider.
     */
    itemData?: D;
    type: 'item';
} | {
    type: 'background';
} | {
    type: 'xAxisTickLabel';
    data: Group;
} | {
    type: 'series';
    data: AreaChartSeries<K>;
} | {
    type: 'axisTitle';
    axis: 'x' | 'y';
};
export type AreaItem<K> = {
    /**
     * @description
     * The item id should be set by the application if the DataProvider is not being used. The row key will be used as id in the DataProvider case.
     */
    id: K;
} & AreaChartItemImplProps;
export type AreaChartSeries<K> = {
    items: AreaItem<K>[];
} & AreaChartSeriesProps;
type StyleDefaults = {
    /**
     * An object defining the group separator lines in hierarchical axis.
     */
    groupSeparators?: {
        /**
         * Whether the group separator lines are rendered in hierarchical axis or not.
         * @ojmetadata description "Whether the group separator lines are rendered."
         */
        rendered?: 'auto' | 'off';
        /**
         * The color of the group separator lines.
         * @ojmetadata description "The color of the group separator lines."
         * @ojmetadata format "color"
         */
        color?: ColorProps['color'];
    };
};
type ItemDrillDetail<K, D> = {
    /**
     * The id of the drilled object.
     * @ojmetadata description "The id of the drilled object."
     */
    id: K;
    /**
     * The series id of the drilled object.
     * @ojmetadata description "The series id of the drilled object."
     */
    series: K;
    /**
     * The group id of the drilled object.
     * @ojmetadata description "The group id of the drilled object."
     */
    group: K;
    /**
     * The data object of the drilled item.
     * @ojmetadata description "The data object of the drilled item."
     */
    data: AreaItem<K>;
    /**
     * The row data object of the drilled item. This will only be set if a DataProvider is being used.
     * @ojmetadata description "The row data object of the drilled item. This will only be set if a DataProvider is being used."
     */
    itemData: D;
    /**
     * The data for the series of the drilled object.
     * @ojmetadata description "The data for the series of the drilled object"
     */
    seriesData: AreaChartSeries<K>;
    /**
     * An array of data for the group the drilled object belongs to.
     * @ojmetadata description "An array of data for the group the drilled object belongs to."
     */
    groupData: Group;
};
type SeriesDrillDetail<K> = {
    /**
     * The id of the drilled object.
     * @ojmetadata description "The id of the drilled object."
     */
    id: K;
    /**
     * The series id of the drilled object.
     * @ojmetadata description "The series id of the drilled object."
     */
    series: K;
    /**
     * The data for the series of the drilled object.
     * @ojmetadata description "The data for the series of the drilled object"
     */
    seriesData: AreaChartSeries<K>;
    /**
     * An array containing objects describing the data items belonging to the drilled group.
     * @ojmetadata description "An array containing objects describing the data items belonging to the drilled group."
     */
    items: AreaItem<K>[];
};
type GroupDrillDetail<K> = {
    /**
     * The id of the drilled object.
     * @ojmetadata description "The id of the drilled object."
     */
    id: K;
    /**
     * The group id of the drilled object.
     * @ojmetadata description "The group id of the drilled object."
     */
    group: K;
    /**
     * An array of data for the group the drilled object belongs to.
     * @ojmetadata description "An array of data for the group the drilled object belongs to."
     */
    groupData: Group;
    /**
     * An array containing objects describing the data items belonging to the drilled group.
     * @ojmetadata description "An array containing objects describing the data items belonging to the drilled group."
     */
    items: AreaItem<K>[];
};
export type AreaChartProps<K, D extends AreaItem<K> | any> = ObservedGlobalProps<'aria-label' | 'aria-describedby' | 'aria-labelledby'> & {
    /**
     * @description
     * Specifies the DataProvider for the sections and items of the area-chart.
     * A progressive loading indicator is shown by the component when the data provider fetch takes longer than a certain time.
     * @ojmetadata description "Specifies the DataProvider for the sections and items of the area-chart."
     * @ojmetadata displayName "Data"
     * @ojmetadata help "#data"
     * @ojmetadata extension {
     *   "webelement": {
     *     "exceptionStatus": [
     *       {
     *         "type": "deprecated",
     *         "since": "17.1.0",
     *         "description": "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."
     *       }
     *     ]
     *   }
     * }
     */
    data?: DataProvider<K, D> | null;
    /**
     * <p>The <code class="prettyprint">itemTemplate</code> slot is used to specify the template for creating each item of the chart. The slot content must be a &lt;template> element.
     * The content of the template should only be one &lt;oj-c-area-chart-item> element. See the <a target="_blank" href="oj-c.AreaChartItem.html">oj-c-area-chart-item</a> doc for more details. A <b>series-id</b> and <b>group-id</b> must be specified.</p>
     * <p>When the template is executed for each item, it will have access to the chart's binding context containing the following properties:</p>
     * <ul>
     *   <li>$current - an object that contains information for the current item. (See the table below for a list of properties available on $current) </li>
     *   <li>alias - if data-oj-as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
     * </ul>
     *
     * @ojmetadata description "The itemTemplate slot is used to specify the template for creating each item of the chart. See the Help documentation for more information."
     * @ojmetadata displayName "Item Template"
     * @ojmetadata help "#itemTemplate"
     * @ojmetadata maxItems 1
     */
    itemTemplate?: TemplateSlot<ChartItemTemplateContext<K, D>>;
    /**
     * <p>The <code class="prettyprint">seriesTemplate</code> slot is used to specify the template for generating the series properties of the chart. The slot content must be a single &lt;template> element.
     * The content of the template should only be one &lt;oj-c-area-chart-series> element.See the <a target="_blank" href="oj-c.AreaChartSeries.html">oj-c-area-chart-series</a> doc for more details.</p>
     * <p>When the template is executed for each series, it will have access to the chart's binding context containing the following properties:</p>
     * <ul>
     *   <li>$current - an object that contains information for the current item. (See the table below for a list of properties available on $current) </li>
     *   <li>alias - if data-oj-as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
     * </ul>
     *
     * @ojmetadata description "The seriesTemplate slot is used to specify the template for generating the series properties of the chart. See the Help documentation for more information."
     * @ojmetadata displayName "Series Template"
     * @ojmetadata help "#seriesTemplate"
     * @ojmetadata maxItems 1
     */
    seriesTemplate?: TemplateSlot<ChartSeriesTemplateContext<K, D>>;
    /**
     * <p>The <code class="prettyprint">groupTemplate</code> slot is used to specify the template for generating the group properties of the chart. The slot content must be a single &lt;template> element.
     * The content of the template should only be one &lt;oj-c-area-chart-group> element. See the <a target="_blank" href="oj-c.AreaChartGroup.html">oj-c-area-chart-group</a> doc for more details.</p>
     * <p>When the template is executed for each group, it will have access to the chart's binding context containing the following properties:</p>
     * <ul>
     *   <li>$current - an object that contains information for the current item. (See the table below for a list of properties available on $current) </li>
     *   <li>alias - if data-oj-as attribute was specified, the value will be used to provide an application-named alias for $current.</li>
     * </ul>
     *
     * @ojmetadata description "The groupTemplate slot is used to specify the template for generating the group properties of the chart. See the Help documentation for more information."
     * @ojmetadata displayName "Group Template"
     * @ojmetadata help "#groupTemplate"
     * @ojmetadata maxItems 1
     */
    groupTemplate?: TemplateSlot<ChartGroupTemplateContext<K, D>>;
    /**
     *
     * @description
     * A comparator function that determines the ordering of the chart series when using a DataProvider.
     * If undefined, the series will follow the order in which they are found in the data. The series objects will have the same properties as the context for <a href="#seriesTemplate">seriesTemplate's $current</a>.
     * If seriesComparator(a, b) is less than 0, chart series a comes before chart series b.
     * If seriesComparator(a, b) is 0, the original order is preserved.
     * If seriesComparator(a, b) is greater than 0, chart series b comes before chart series a.
     * @ojmetadata description "A comparator function that determines the ordering of the chart series when using a DataProvider. If undefined, the series will follow the order in which they are found in the data."
     * @ojmetadata displayName "Series Comparator"
     * @ojmetadata help "#seriesComparator"
     */
    seriesComparator?: (context1: ChartSeriesTemplateContext<K, D>, context2: ChartSeriesTemplateContext<K, D>) => number;
    /**
     *
     * @description
     * A comparator function that determines the ordering of the chart groups when using a DataProvider.
     * If undefined, the group will follow the order in which they are found in the data. The group objects will have the same properties as the context for <a href="#groupTemplate">groupTemplate's $current</a>.
     * If groupComparator(a, b) is less than 0, chart group a comes before chart group b.
     * If groupComparator(a, b) is 0, the original order is preserved.
     * If groupComparator(a, b) is greater than 0, chart group b comes before chart group a.
     * @ojmetadata description "A comparator function that determines the ordering of the chart groups when using a DataProvider. If undefined, the group will follow the order in which they are found in the data."
     * @ojmetadata displayName "Group Comparator"
     * @ojmetadata help "#groupComparator"
     */
    groupComparator?: (context1: ChartGroupTemplateContext<K, D>, context2: ChartGroupTemplateContext<K, D>) => number;
    /**
     * @description
     * Defines whether the data items are stacked.
     * @ojmetadata description "Defines whether the data items are stacked."
     * @ojmetadata displayName "Stack"
     * @ojmetadata help "#stack"
     * @ojmetadata propertyEditorValues {
     *     "on": {
     *       "description": "Data items belonging to same group will be stacked.",
     *       "displayName": "On"
     *     },
     *     "off": {
     *       "description": "Data items will not be stacked.",
     *       "displayName": "Off"
     *     }
     *   }
     */
    stack?: 'on' | 'off';
    /**
     * @description
     * Whether drilling is enabled. Drillable objects will show a pointer cursor on hover and fire an <code class="prettyprint">ojItemDrill</code>,  <code class="prettyprint">ojSeriesDrill</code> and  <code class="prettyprint">ojGroupDrill</code>  event on click (double click if selection is enabled). Use "on" to enable drilling for all series objects (legend items), group objects (x-axis labels), and data items. To enable or disable drilling on individual series, group, or data item, use the drilling attribute in each series, group, or data item.
     * @ojmetadata description "Whether drilling is enabled."
     * @ojmetadata displayName "Drilling"
     * @ojmetadata help "#drilling"
     * @ojmetadata propertyEditorValues {
     *     "on": {
     *       "description": "Drilling is enabled on data items, axis labels and legend items.",
     *       "displayName": "On"
     *     },
     *     "off": {
     *       "description": "Drilling is not enabled.",
     *       "displayName": "Off"
     *     }
     *   }
     */
    drilling?: 'on' | 'off';
    /**
     * @description
     * The orientation of the chart.
     * @ojmetadata description "The orientation of the chart."
     * @ojmetadata displayName "Orientation"
     * @ojmetadata help "#orientation"
     * @ojmetadata propertyEditorValues {
     *     "horizontal": {
     *       "description": "Chart will be horizontally oriented.",
     *       "displayName": "On"
     *     },
     *     "vertical": {
     *       "description": "Chart will be vertically oriented.",
     *       "displayName": "Off"
     *     }
     *   }
     */
    orientation?: PreactAreaChartProps['orientation'];
    /**
     * @description
     * The type of time axis to display in the chart. If the value is "enabled" or "skipGaps", the time values must be provided through the "group-id" attribute of the <a target="_blank" href="oj-c.AreaChartItem.html">oj-c-area-chart-item</a>  element. In this case, stacking is supported. If the value is "skipGaps", the groups will be rendered at a regular interval regardless of any time gaps that may exist in the data.
     * If the value is "mixedFrequency", the time values must be provided through the "x" attribute of the <a target="_blank" href="oj-c.AreaChartItem.html">oj-c-area-chart-item</a> element. In this case stacking is not supported.
     * The time values provided must be an ISO date string.
     * @ojmetadata description The time axis type of the chart x axis.
     * @ojmetadata displayName "TimeAxisType"
     * @ojmetadata help "#timeAxisType"
     * @ojmetadata propertyEditorValues {
     *     "enabled": {
     *       "description": "The regular time axis type. Time values are passed using <a target='_blank' href='oj-c.AreaChartItem.html'>oj-c-area-chart-item</a> group-id attribute.",
     *       "displayName": "Regular"
     *     },
     *     "mixedFrequency": {
     *       "description": "The mixed frequency time axis type. The mixed frequency time axis type is used when different series have different sampling frequencies. Time values are passed using <a target='_blank' href='oj-c.AreaChartItem.html'>oj-c-area-chart-item</a> x attribute.",
     *       "displayName": "MixedFrequency"
     *     },
     *     "skipGaps": {
     *       "description": "The regular time axis type. Time values are passed using <a target='_blank' href='oj-c.AreaChartItem.html'>oj-c-area-chart-item</a> group-id attribute. Gap between time values will be ignored.",
     *       "displayName": "SkipGaps"
     *     }
     *   }
     */
    timeAxisType?: 'enabled' | 'mixedFrequency' | 'skipGaps';
    /**
     * An object defining properties for the y axis, tick marks, tick labels, and axis titles.
     * @ojmetadata description "An object defining y axis properties."
     * @ojmetadata displayName "Y Axis"
     * @ojmetadata help "#yAxis"
     */
    yAxis?: YAxis;
    /**
     * @ojmetadata description "The y2Axis options for the chart."
     * @ojmetadata displayName "Y2 Axis"
     * @ojmetadata help "#yAxis"
     */
    y2Axis?: Y2Axis;
    /**
     * Defines whether the plot area is split into two sections, so that sets of data assigned to the different Y-axes appear in different parts of the plot area.
     * @ojmetadata description "Defines whether the plot area is split into two sections."
     * @ojmetadata displayName "Split Dual Y"
     * @ojmetadata help "#splitDualY"
     * @ojmetadata propertyEditorValues {
     *     "on": {
     *       "description": "Plot Area is split into two sections, one for each Y-axis.",
     *       "displayName": "On"
     *     },
     *     "off": {
     *       "description": "Plot Area is not split.",
     *       "displayName": "Off"
     *     }
     *   }
     */
    splitDualY?: 'on' | 'off';
    /**
     * In a split dual-Y chart, specifies the fraction of the space that is given to the Y-axis subchart. Valid values are numbers from 0 to 1.
     * @ojmetadata description "Specifies the fraction of the space that is given to the Y-axis subchart."
     * @ojmetadata displayName "Splitter Position"
     * @ojmetadata help "#splitterPosition"
     * @ojmetadata minimum 0
     * @ojmetadata maximum 1
     */
    splitterPosition?: number;
    /**
     * An object defining properties for the x axis, tick marks, tick labels, and axis titles.
     * @ojmetadata description "An object defining x axis properties."
     * @ojmetadata displayName "X Axis"
     * @ojmetadata help "#xAxis"
     */
    xAxis?: XAxis;
    /**
     * An object defining the style of the plot area.
     * @ojmetadata description "An object defining the style of the plot area."
     * @ojmetadata displayName "Plot Area"
     * @ojmetadata help "#plotArea"
     */
    plotArea?: PlotArea;
    /**
     * Specifies the zoom and scroll behavior of the chart. "Live" behavior means that the chart will be updated continuously as it is being manipulated.
     * While "live" zoom and scroll provides the best end user experience, no guarantess are made about the rendering performance or usability for large data sets or slow client environments.
     * @ojmetadata description "Specifies the zoom and scroll behavior of the chart."
     * @ojmetadata displayName "Zoom And Scroll"
     * @ojmetadata help "#zoomAndScroll"
     */
    zoomAndScroll?: PreactAreaChartProps['zoomAndScroll'];
    /**
     * An object specifying value formatting and tooltip behavior, whose keys generally correspond to the attribute names on the data items.
     * @ojmetadata description "An object specifying value formatting and tooltip behavior."
     * @ojmetadata displayName "Value Formats"
     * @ojmetadata help "#valueFormats"
     */
    valueFormats?: ValueFormats;
    /**
     * Object type defining the default styles for series colors, marker shapes, and other style attributes.
     * Properties specified on this object may be overridden by specifications on the data object.
     * @ojmetadata description "An object specifying default styles for chart style attributes.."
     * @ojmetadata displayName "Style Defaults"
     * @ojmetadata help "#styleDefaults"
     */
    styleDefaults?: StyleDefaults;
    /**
     * @ojmetadata description "Triggered after the viewport is changed due to a zoom or scroll operation."
     * @ojmetadata help "#event:ViewportChange"
     * @ojmetadata displayName "Viewport Change"
     */
    onOjViewportChange?: Action<ViewPortDetail>;
    /**
     * @ojmetadata description "Triggered on a chart item (double click if selection is enabled, single click otherwise)."
     * @ojmetadata help "#event:ItemDrill"
     * @ojmetadata displayName "Item Drill"
     */
    onOjItemDrill?: Action<ItemDrillDetail<K, D>>;
    /**
     * @ojmetadata description "Triggered on a chart group drill gesture (double click if selection is enabled, single click otherwise)."
     * @ojmetadata help "#event:GroupDrill"
     * @ojmetadata displayName "Group Drill"
     */
    onOjGroupDrill?: Action<GroupDrillDetail<K>>;
    /**
     * @ojmetadata description "Triggered on a chart series drill gesture (double click if selection is enabled, single click otherwise)."
     * @ojmetadata help "#event:SeriesDrill"
     * @ojmetadata displayName "Series Drill"
     */
    onOjSeriesDrill?: Action<SeriesDrillDetail<K>>;
    /**
     * @description
     * The type of selection behavior that is enabled on the area chart This attribute controls the number of selections that can be made via selection gestures at any given time.
     * @ojmetadata description "Specifies the selection mode."
     * @ojmetadata displayName "Selection Mode"
     * @ojmetadata help "#selectionMode"
     * @ojmetadata propertyEditorValues {
     *     "none": {
     *       "description": "No item can be selected.",
     *       "displayName": "None"
     *     },
     *     "single": {
     *       "description": "Single item can be selected.",
     *       "displayName": "Single"
     *     },
     *    "multiple": {
     *       "description": "Multiple items can be selected.",
     *       "displayName": "Multiple"
     *    }
     *   }
     */
    selectionMode?: 'none' | 'single' | 'multiple';
    /**
     * @description
     * An array containing the ids of the initially selected data items.
     * @ojmetadata description "An array containing the ids of the initially selected data items."
     * @ojmetadata displayName "Selection"
     * @ojmetadata help "#selection"
     */
    selection?: K[];
    /**
     * @ojmetadata description "Writeback support for the selection property"
     * @ojmetadata displayName "Selection"
     * @ojmetadata help "#selection"
     */
    onSelectionChanged?: PropertyChanged<(string | number)[]>;
    /**
     * An array of category strings used for filtering. Series or data items with any category matching an item in this array will be filtered.
     * @ojmetadata description "An array of category string used for filtering."
     * @ojmetadata displayName "Hidden Categories"
     * @ojmetadata help "#hiddenCategories"
     */
    hiddenCategories?: string[];
    /**
     * The action that is performed when a drag occurs on the chart. Pan and marquee zoom are only available if zoom and scroll is turned on.
     * Marquee select is only available if multiple selection is turned on. If the value is set to "user" and multiple actions are available,
     * buttons will be displayed on the plot area to let users switch between modes. Only 'select' and 'pan' buttons are shown in mobile, as
     * zoom in or out can be performed with 2 finger pinch gesture.
     * @ojmetadata description "The action that is performed when a drag occurs on the chart."
     * @ojmetadata displayName "Drag Mode"
     * @ojmetadata help "#dragMode"
     */
    dragMode?: 'user' | 'select' | 'zoom' | 'pan' | 'off';
    /**
     * @ojmetadata description "Writeback support for the highlightedCategories property"
     * @ojmetadata displayName "Highlighted Categories"
     * @ojmetadata help "#highlightedCategories"
     */
    onHiddenCategoriesChanged?: PropertyChanged<string[]>;
    /**
     * An array of category strings used for highlighting. Series or data items matching categories in this array will be highlighted.
     * @ojmetadata description "An array of category string used for highlighting."
     * @ojmetadata displayName "Highlighted Categories"
     * @ojmetadata help "#highlightedCategories"
     */
    highlightedCategories?: string[];
    /**
     * @description
     * Writeback support for the highlightedCategories property.
     * @ojmetadata description "Writeback support for the highlightedCategories property"
     * @ojmetadata displayName "Highlighted Categories"
     * @ojmetadata help "#highlightedCategories"
     */
    onHighlightedCategoriesChanged?: PropertyChanged<string[]>;
    /**
     * @description
     * Defines the hide and show behavior that is performed when clicking on a legend item. When data items are hidden, the y axes can be optionally rescaled to fit to the remaining data.
     * @ojmetadata description "Defines the hide and show behavior that is performed when clicking on a leegnd item."
     * @ojmetadata displayName "Hide and Show Behavior"
     * @ojmetadata help "#hideAndShowBehavior"
     * @ojmetadata propertyEditorValues {
     *     "withRescale": {
     *       "description": "Rescaling of y axis when items are hidden.",
     *       "displayName": "With Rescale"
     *     },
     *     "withoutRescale": {
     *       "description": "No rescaling of y axis when items are hidden.",
     *       "displayName": "Without Rescale"
     *     },
     *    "none": {
     *       "description": "No hide and show behavior.",
     *       "displayName": "None"
     *    }
     *  }
     */
    hideAndShowBehavior?: 'withRescale' | 'withoutRescale' | 'none';
    /**
     * @description
     * Defines the behavior applied when hovering over data items.
     * @ojmetadata description "Defines the behavior applied when hovering over data items."
     * @ojmetadata displayName "Hover Behavior"
     * @ojmetadata help "#hoverBehavior"
     * @ojmetadata propertyEditorValues {
     *     "dim": {
     *       "description": "Hovered items will be dimmed.",
     *       "displayName": "Dim"
     *     },
     *     "none": {
     *       "description": "No hover behavior.",
     *       "displayName": "None"
     *     }
     *  }
     */
    hoverBehavior?: 'dim' | 'none';
    /**
     * @description
     * The matching condition for the highlightedCategories property.
     * By default, highlightMatch is 'all' and only items whose categories match all of the values specified in the highlightedCategories array will be highlighted.
     * If highlightMatch is 'any', then items that match at least one of the highlightedCategories values will be highlighted.
     * @ojmetadata description "The matching condition for the highlighted property."
     * @ojmetadata displayName "Highlight Match"
     * @ojmetadata help "#highlightMatch"
     * @ojmetadata propertyEditorValues {
     *     "any": {
     *       "description": "Any matching categories will be highlighted.",
     *       "displayName": "Dim"
     *     },
     *     "all": {
     *       "description": "Items only with all matching categories will be highlighted.",
     *       "displayName": "None"
     *     }
     *  }
     */
    highlightMatch?: 'any' | 'all';
    /**
     * @description
     * An object defining the style, positioning, and behavior of the legend.
     * @ojmetadata displayName "Legend"
     * @ojmetadata description "An object defining the style, positioning, and behavior of the legend."
     * @ojmetadata help "#legend"
     */
    legend?: ChartLegend;
    /**
     * @description
     * Specifies a context menu configuration.
     * It takes the keys `accessibleLabel` and `items`,
     * where `accessibleLabel` is optional and items required . `items` function returns an array
     * of menu item object representations that indicates what menu items are going to be part of
     * menu based on some specific context menu context.
     * <table>
     * <tr><th align='left'>Context Menu Item Type</th><th align='left'>Def</th></tr>
     * <tr><td>ContextMenuSeparator</td><td>{ type: 'separator'}</td></tr>
     * <tr><td>MenuItem</td><td>{
     * type?: 'item';
     * label: string;
     * key: string;
     * disabled?: boolean;
     * onAction?: () => void;
     * startIcon?: MenuIcon;
     * endIcon?: MenuIcon;
     * variant?: 'standard' | 'destructive';
     * };</td></tr>
     * <tr><td>ContextMenuSubMenu</td><td>{
     * type: 'submenu';
     * label?: string;
     * disabled?: boolean;
     * startIcon?: string;
     * items?: Array&lt;ContextMenuItems&gt;;
     * };</td></tr>
     * <tr><td>ContextMenuSelectSingle</td><td>{
     * type: 'selectsingle';
     * key?: string;
     * items?: Array&lt;MenuSelectItem&gt;;
     * selection?: string;
     * onSelection?: (detail: { value: string }) => void;
     * };</td></tr>
     * <tr><td>ContextMenuSelectMultiple</td><td>{
     * type: 'selectmultiple';
     * key?: string;
     * items?: Array&lt;MenuSelectItem&gt;;
     * selection?: Array&lt;string&gt;;
     * onSelection?: (detail: { value: Array&lt;string&gt; }) => void;
     * };</td></tr>
     * <tr><td>MenuIcon</td><td>{
     * type?: 'class';
     *     class: string;
     *   }
     * | {
     *     type: 'img';
     *    src: string;
     *   };</td></tr>
     * <tr><td>MenuSelectItem</td><td>{
     * label: string;
     * disabled?: boolean;
     * endIcon?: MenuIcon;
     * value: string;
     * }</td></tr>
     * </table>
     * @ojmetadata description "Specifies a context menu configuration."
     * @ojmetadata displayName "Context Menu Config"
     * @ojmetadata help "#contextMenuConfig"
     */
    contextMenuConfig?: AreaChartContextMenuConfig<K, D>;
    /**
     * @ojmetadata description "Triggered when a menu item is clicked, whether by keyboard, mouse,
     *    or touch events."
     * @ojmetadata eventGroup "common"
     * @ojmetadata displayName "onOjContextMenuAction"
     * @ojmetadata help "#event:ojContextMenuAction"
     */
    onOjContextMenuAction?: Action<AreaChartContextMenuActionDetail<K, D>> & Bubbles;
    /**
     * @ojmetadata description "Triggered when a select menu item is clicked, whether by keyboard, mouse,
     *    or touch events."
     * @ojmetadata eventGroup "common"
     * @ojmetadata displayName "onOjContextMenuSelection"
     * @ojmetadata help "#event:ojContextMenuSelection"
     */
    onOjContextMenuSelection?: Action<AreaChartContextMenuSelectionDetail<K, D>> & Bubbles;
};
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
declare function AreaChartComp<K extends string | number, D extends AreaItem<K> | any>({ data, hideAndShowBehavior, orientation, xAxis, yAxis, y2Axis, hoverBehavior, valueFormats, plotArea, zoomAndScroll, itemTemplate, seriesTemplate, groupTemplate, seriesComparator, groupComparator, drilling, hiddenCategories, highlightedCategories, highlightMatch, selection, selectionMode, timeAxisType, stack, legend, contextMenuConfig, onOjContextMenuAction, onOjContextMenuSelection, onSelectionChanged, splitterPosition, splitDualY, ...props }: AreaChartProps<K, D>): import("preact").JSX.Element;
/**
 * This export corresponds to the AreaChart Preact component. For the oj-c-area-chart custom element, import CAreaChartElement instead.
 */
export declare const AreaChart: <K extends string | number = string | number, D extends AreaItem<K> | any = AreaItem<K> | any>(props: ExtendGlobalProps<ComponentProps<typeof AreaChartComp<K, D>>>) => ComponentChildren;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-area-chart custom element. For the AreaChart Preact component, import AreaChart instead.
 */
export interface CAreaChartElement<K extends string | number, D extends AreaItem<K> | any> extends JetElement<CAreaChartElementSettableProperties<K, D>>, CAreaChartElementSettableProperties<K, D> {
    addEventListener<T extends keyof CAreaChartElementEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: CAreaChartElementEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CAreaChartElementSettableProperties<K, D>>(property: T): CAreaChartElement<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CAreaChartElementSettableProperties<K, D>>(property: T, value: CAreaChartElementSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CAreaChartElementSettableProperties<K, D>>): void;
    setProperties(properties: CAreaChartElementSettablePropertiesLenient<K, D>): void;
}
export namespace CAreaChartElement {
    interface ojViewportChange extends CustomEvent<ViewPortDetail & {}> {
    }
    interface ojItemDrill<K extends string | number, D extends AreaItem<K> | any> extends CustomEvent<ItemDrillDetail<K, D> & {}> {
    }
    interface ojGroupDrill<K extends string | number> extends CustomEvent<GroupDrillDetail<K> & {}> {
    }
    interface ojSeriesDrill<K extends string | number> extends CustomEvent<SeriesDrillDetail<K> & {}> {
    }
    interface ojContextMenuAction<K extends string | number, D extends AreaItem<K> | any> extends CustomEvent<AreaChartContextMenuActionDetail<K, D> & {}> {
    }
    interface ojContextMenuSelection<K extends string | number, D extends AreaItem<K> | any> extends CustomEvent<AreaChartContextMenuSelectionDetail<K, D> & {}> {
    }
    type contextMenuConfigChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['contextMenuConfig']>;
    type dataChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['data']>;
    type dragModeChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['dragMode']>;
    type drillingChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['drilling']>;
    type groupComparatorChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['groupComparator']>;
    type hiddenCategoriesChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['hiddenCategories']>;
    type hideAndShowBehaviorChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['hideAndShowBehavior']>;
    type highlightMatchChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['highlightMatch']>;
    type highlightedCategoriesChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['highlightedCategories']>;
    type hoverBehaviorChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['hoverBehavior']>;
    type legendChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['legend']>;
    type orientationChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['orientation']>;
    type plotAreaChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['plotArea']>;
    type selectionChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['selection']>;
    type selectionModeChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['selectionMode']>;
    type seriesComparatorChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['seriesComparator']>;
    type splitDualYChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['splitDualY']>;
    type splitterPositionChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['splitterPosition']>;
    type stackChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['stack']>;
    type styleDefaultsChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['styleDefaults']>;
    type timeAxisTypeChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['timeAxisType']>;
    type valueFormatsChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['valueFormats']>;
    type xAxisChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['xAxis']>;
    type y2AxisChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['y2Axis']>;
    type yAxisChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['yAxis']>;
    type zoomAndScrollChanged<K extends string | number, D extends AreaItem<K> | any> = JetElementCustomEventStrict<CAreaChartElement<K, D>['zoomAndScroll']>;
    type ItemTemplateContext<K extends string | number, D extends AreaItem<K> | any> = ChartItemTemplateContext<K, D>;
    type RenderItemTemplate<K extends string | number, D extends AreaItem<K> | any> = import('ojs/ojvcomponent').TemplateSlot<ChartItemTemplateContext<K, D>>;
    type SeriesTemplateContext<K extends string | number, D extends AreaItem<K> | any> = ChartSeriesTemplateContext<K, D>;
    type RenderSeriesTemplate<K extends string | number, D extends AreaItem<K> | any> = import('ojs/ojvcomponent').TemplateSlot<ChartSeriesTemplateContext<K, D>>;
    type GroupTemplateContext<K extends string | number, D extends AreaItem<K> | any> = ChartGroupTemplateContext<K, D>;
    type RenderGroupTemplate<K extends string | number, D extends AreaItem<K> | any> = import('ojs/ojvcomponent').TemplateSlot<ChartGroupTemplateContext<K, D>>;
}
export interface CAreaChartElementEventMap<K extends string | number, D extends AreaItem<K> | any> extends HTMLElementEventMap {
    'ojViewportChange': CAreaChartElement.ojViewportChange;
    'ojItemDrill': CAreaChartElement.ojItemDrill<K, D>;
    'ojGroupDrill': CAreaChartElement.ojGroupDrill<K>;
    'ojSeriesDrill': CAreaChartElement.ojSeriesDrill<K>;
    'ojContextMenuAction': CAreaChartElement.ojContextMenuAction<K, D>;
    'ojContextMenuSelection': CAreaChartElement.ojContextMenuSelection<K, D>;
    'contextMenuConfigChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['contextMenuConfig']>;
    'dataChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['data']>;
    'dragModeChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['dragMode']>;
    'drillingChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['drilling']>;
    'groupComparatorChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['groupComparator']>;
    'hiddenCategoriesChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['hiddenCategories']>;
    'hideAndShowBehaviorChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['hideAndShowBehavior']>;
    'highlightMatchChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['highlightMatch']>;
    'highlightedCategoriesChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['highlightedCategories']>;
    'hoverBehaviorChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['hoverBehavior']>;
    'legendChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['legend']>;
    'orientationChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['orientation']>;
    'plotAreaChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['plotArea']>;
    'selectionChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['selection']>;
    'selectionModeChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['selectionMode']>;
    'seriesComparatorChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['seriesComparator']>;
    'splitDualYChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['splitDualY']>;
    'splitterPositionChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['splitterPosition']>;
    'stackChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['stack']>;
    'styleDefaultsChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['styleDefaults']>;
    'timeAxisTypeChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['timeAxisType']>;
    'valueFormatsChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['valueFormats']>;
    'xAxisChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['xAxis']>;
    'y2AxisChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['y2Axis']>;
    'yAxisChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['yAxis']>;
    'zoomAndScrollChanged': JetElementCustomEventStrict<CAreaChartElement<K, D>['zoomAndScroll']>;
}
export interface CAreaChartElementSettableProperties<K, D extends AreaItem<K> | any> extends JetSettableProperties {
    /**
     * Specifies a context menu configuration.
     * It takes the keys `accessibleLabel` and `items`,
     * where `accessibleLabel` is optional and items required . `items` function returns an array
     * of menu item object representations that indicates what menu items are going to be part of
     * menu based on some specific context menu context.
     * <table>
     * <tr><th align='left'>Context Menu Item Type</th><th align='left'>Def</th></tr>
     * <tr><td>ContextMenuSeparator</td><td>{ type: 'separator'}</td></tr>
     * <tr><td>MenuItem</td><td>{
     * type?: 'item';
     * label: string;
     * key: string;
     * disabled?: boolean;
     * onAction?: () => void;
     * startIcon?: MenuIcon;
     * endIcon?: MenuIcon;
     * variant?: 'standard' | 'destructive';
     * };</td></tr>
     * <tr><td>ContextMenuSubMenu</td><td>{
     * type: 'submenu';
     * label?: string;
     * disabled?: boolean;
     * startIcon?: string;
     * items?: Array&lt;ContextMenuItems&gt;;
     * };</td></tr>
     * <tr><td>ContextMenuSelectSingle</td><td>{
     * type: 'selectsingle';
     * key?: string;
     * items?: Array&lt;MenuSelectItem&gt;;
     * selection?: string;
     * onSelection?: (detail: { value: string }) => void;
     * };</td></tr>
     * <tr><td>ContextMenuSelectMultiple</td><td>{
     * type: 'selectmultiple';
     * key?: string;
     * items?: Array&lt;MenuSelectItem&gt;;
     * selection?: Array&lt;string&gt;;
     * onSelection?: (detail: { value: Array&lt;string&gt; }) => void;
     * };</td></tr>
     * <tr><td>MenuIcon</td><td>{
     * type?: 'class';
     *     class: string;
     *   }
     * | {
     *     type: 'img';
     *    src: string;
     *   };</td></tr>
     * <tr><td>MenuSelectItem</td><td>{
     * label: string;
     * disabled?: boolean;
     * endIcon?: MenuIcon;
     * value: string;
     * }</td></tr>
     * </table>
     */
    contextMenuConfig?: AreaChartProps<K, D>['contextMenuConfig'];
    /**
     * Specifies the DataProvider for the sections and items of the area-chart.
     * A progressive loading indicator is shown by the component when the data provider fetch takes longer than a certain time.
     */
    data?: AreaChartProps<K, D>['data'];
    /**
     * The action that is performed when a drag occurs on the chart. Pan and marquee zoom are only available if zoom and scroll is turned on.
     * Marquee select is only available if multiple selection is turned on. If the value is set to "user" and multiple actions are available,
     * buttons will be displayed on the plot area to let users switch between modes. Only 'select' and 'pan' buttons are shown in mobile, as
     * zoom in or out can be performed with 2 finger pinch gesture.
     */
    dragMode?: AreaChartProps<K, D>['dragMode'];
    /**
     * Whether drilling is enabled. Drillable objects will show a pointer cursor on hover and fire an <code class="prettyprint">ojItemDrill</code>,  <code class="prettyprint">ojSeriesDrill</code> and  <code class="prettyprint">ojGroupDrill</code>  event on click (double click if selection is enabled). Use "on" to enable drilling for all series objects (legend items), group objects (x-axis labels), and data items. To enable or disable drilling on individual series, group, or data item, use the drilling attribute in each series, group, or data item.
     */
    drilling?: AreaChartProps<K, D>['drilling'];
    /**
     * A comparator function that determines the ordering of the chart groups when using a DataProvider.
     * If undefined, the group will follow the order in which they are found in the data. The group objects will have the same properties as the context for <a href="#groupTemplate">groupTemplate's $current</a>.
     * If groupComparator(a, b) is less than 0, chart group a comes before chart group b.
     * If groupComparator(a, b) is 0, the original order is preserved.
     * If groupComparator(a, b) is greater than 0, chart group b comes before chart group a.
     */
    groupComparator?: AreaChartProps<K, D>['groupComparator'];
    /**
     * An array of category strings used for filtering. Series or data items with any category matching an item in this array will be filtered.
     */
    hiddenCategories?: AreaChartProps<K, D>['hiddenCategories'];
    /**
     * Defines the hide and show behavior that is performed when clicking on a legend item. When data items are hidden, the y axes can be optionally rescaled to fit to the remaining data.
     */
    hideAndShowBehavior?: AreaChartProps<K, D>['hideAndShowBehavior'];
    /**
     * The matching condition for the highlightedCategories property.
     * By default, highlightMatch is 'all' and only items whose categories match all of the values specified in the highlightedCategories array will be highlighted.
     * If highlightMatch is 'any', then items that match at least one of the highlightedCategories values will be highlighted.
     */
    highlightMatch?: AreaChartProps<K, D>['highlightMatch'];
    /**
     * An array of category strings used for highlighting. Series or data items matching categories in this array will be highlighted.
     */
    highlightedCategories?: AreaChartProps<K, D>['highlightedCategories'];
    /**
     * Defines the behavior applied when hovering over data items.
     */
    hoverBehavior?: AreaChartProps<K, D>['hoverBehavior'];
    /**
     * An object defining the style, positioning, and behavior of the legend.
     */
    legend?: AreaChartProps<K, D>['legend'];
    /**
     * The orientation of the chart.
     */
    orientation?: AreaChartProps<K, D>['orientation'];
    /**
     * An object defining the style of the plot area.
     */
    plotArea?: AreaChartProps<K, D>['plotArea'];
    /**
     * An array containing the ids of the initially selected data items.
     */
    selection?: AreaChartProps<K, D>['selection'];
    /**
     * The type of selection behavior that is enabled on the area chart This attribute controls the number of selections that can be made via selection gestures at any given time.
     */
    selectionMode?: AreaChartProps<K, D>['selectionMode'];
    /**
     * A comparator function that determines the ordering of the chart series when using a DataProvider.
     * If undefined, the series will follow the order in which they are found in the data. The series objects will have the same properties as the context for <a href="#seriesTemplate">seriesTemplate's $current</a>.
     * If seriesComparator(a, b) is less than 0, chart series a comes before chart series b.
     * If seriesComparator(a, b) is 0, the original order is preserved.
     * If seriesComparator(a, b) is greater than 0, chart series b comes before chart series a.
     */
    seriesComparator?: AreaChartProps<K, D>['seriesComparator'];
    /**
     * Defines whether the plot area is split into two sections, so that sets of data assigned to the different Y-axes appear in different parts of the plot area.
     */
    splitDualY?: AreaChartProps<K, D>['splitDualY'];
    /**
     * In a split dual-Y chart, specifies the fraction of the space that is given to the Y-axis subchart. Valid values are numbers from 0 to 1.
     */
    splitterPosition?: AreaChartProps<K, D>['splitterPosition'];
    /**
     * Defines whether the data items are stacked.
     */
    stack?: AreaChartProps<K, D>['stack'];
    /**
     * Object type defining the default styles for series colors, marker shapes, and other style attributes.
     * Properties specified on this object may be overridden by specifications on the data object.
     */
    styleDefaults?: AreaChartProps<K, D>['styleDefaults'];
    /**
     * The type of time axis to display in the chart. If the value is "enabled" or "skipGaps", the time values must be provided through the "group-id" attribute of the <a target="_blank" href="oj-c.AreaChartItem.html">oj-c-area-chart-item</a>  element. In this case, stacking is supported. If the value is "skipGaps", the groups will be rendered at a regular interval regardless of any time gaps that may exist in the data.
     * If the value is "mixedFrequency", the time values must be provided through the "x" attribute of the <a target="_blank" href="oj-c.AreaChartItem.html">oj-c-area-chart-item</a> element. In this case stacking is not supported.
     * The time values provided must be an ISO date string.
     */
    timeAxisType?: AreaChartProps<K, D>['timeAxisType'];
    /**
     * An object specifying value formatting and tooltip behavior, whose keys generally correspond to the attribute names on the data items.
     */
    valueFormats?: AreaChartProps<K, D>['valueFormats'];
    /**
     * An object defining properties for the x axis, tick marks, tick labels, and axis titles.
     */
    xAxis?: AreaChartProps<K, D>['xAxis'];
    y2Axis?: AreaChartProps<K, D>['y2Axis'];
    /**
     * An object defining properties for the y axis, tick marks, tick labels, and axis titles.
     */
    yAxis?: AreaChartProps<K, D>['yAxis'];
    /**
     * Specifies the zoom and scroll behavior of the chart. "Live" behavior means that the chart will be updated continuously as it is being manipulated.
     * While "live" zoom and scroll provides the best end user experience, no guarantess are made about the rendering performance or usability for large data sets or slow client environments.
     */
    zoomAndScroll?: AreaChartProps<K, D>['zoomAndScroll'];
}
export interface CAreaChartElementSettablePropertiesLenient<K, D extends AreaItem<K> | any> extends Partial<CAreaChartElementSettableProperties<K, D>> {
    [key: string]: any;
}
export interface AreaChartIntrinsicProps extends Partial<Readonly<CAreaChartElementSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    onojContextMenuAction?: (value: CAreaChartElementEventMap<any, any>['ojContextMenuAction']) => void;
    onojContextMenuSelection?: (value: CAreaChartElementEventMap<any, any>['ojContextMenuSelection']) => void;
    onojGroupDrill?: (value: CAreaChartElementEventMap<any, any>['ojGroupDrill']) => void;
    onojItemDrill?: (value: CAreaChartElementEventMap<any, any>['ojItemDrill']) => void;
    onojSeriesDrill?: (value: CAreaChartElementEventMap<any, any>['ojSeriesDrill']) => void;
    onojViewportChange?: (value: CAreaChartElementEventMap<any, any>['ojViewportChange']) => void;
    oncontextMenuConfigChanged?: (value: CAreaChartElementEventMap<any, any>['contextMenuConfigChanged']) => void;
    ondataChanged?: (value: CAreaChartElementEventMap<any, any>['dataChanged']) => void;
    ondragModeChanged?: (value: CAreaChartElementEventMap<any, any>['dragModeChanged']) => void;
    ondrillingChanged?: (value: CAreaChartElementEventMap<any, any>['drillingChanged']) => void;
    ongroupComparatorChanged?: (value: CAreaChartElementEventMap<any, any>['groupComparatorChanged']) => void;
    onhiddenCategoriesChanged?: (value: CAreaChartElementEventMap<any, any>['hiddenCategoriesChanged']) => void;
    onhideAndShowBehaviorChanged?: (value: CAreaChartElementEventMap<any, any>['hideAndShowBehaviorChanged']) => void;
    onhighlightMatchChanged?: (value: CAreaChartElementEventMap<any, any>['highlightMatchChanged']) => void;
    onhighlightedCategoriesChanged?: (value: CAreaChartElementEventMap<any, any>['highlightedCategoriesChanged']) => void;
    onhoverBehaviorChanged?: (value: CAreaChartElementEventMap<any, any>['hoverBehaviorChanged']) => void;
    onlegendChanged?: (value: CAreaChartElementEventMap<any, any>['legendChanged']) => void;
    onorientationChanged?: (value: CAreaChartElementEventMap<any, any>['orientationChanged']) => void;
    onplotAreaChanged?: (value: CAreaChartElementEventMap<any, any>['plotAreaChanged']) => void;
    onselectionChanged?: (value: CAreaChartElementEventMap<any, any>['selectionChanged']) => void;
    onselectionModeChanged?: (value: CAreaChartElementEventMap<any, any>['selectionModeChanged']) => void;
    onseriesComparatorChanged?: (value: CAreaChartElementEventMap<any, any>['seriesComparatorChanged']) => void;
    onsplitDualYChanged?: (value: CAreaChartElementEventMap<any, any>['splitDualYChanged']) => void;
    onsplitterPositionChanged?: (value: CAreaChartElementEventMap<any, any>['splitterPositionChanged']) => void;
    onstackChanged?: (value: CAreaChartElementEventMap<any, any>['stackChanged']) => void;
    onstyleDefaultsChanged?: (value: CAreaChartElementEventMap<any, any>['styleDefaultsChanged']) => void;
    ontimeAxisTypeChanged?: (value: CAreaChartElementEventMap<any, any>['timeAxisTypeChanged']) => void;
    onvalueFormatsChanged?: (value: CAreaChartElementEventMap<any, any>['valueFormatsChanged']) => void;
    onxAxisChanged?: (value: CAreaChartElementEventMap<any, any>['xAxisChanged']) => void;
    ony2AxisChanged?: (value: CAreaChartElementEventMap<any, any>['y2AxisChanged']) => void;
    onyAxisChanged?: (value: CAreaChartElementEventMap<any, any>['yAxisChanged']) => void;
    onzoomAndScrollChanged?: (value: CAreaChartElementEventMap<any, any>['zoomAndScrollChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-area-chart': AreaChartIntrinsicProps;
        }
    }
}
