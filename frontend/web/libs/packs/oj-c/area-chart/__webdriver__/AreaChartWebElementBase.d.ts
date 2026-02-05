import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-area-chart WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, AreaChartWebElement.ts.
 */
export declare class AreaChartWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>data</code> property.
     * Specifies the DataProvider for the sections and items of the area-chart.
     * @return The value of <code>data</code> property.
     * @deprecated Since 17.1.0. Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead.
     */
    getData(): Promise<null>;
    /**
     * Gets the value of <code>seriesComparator</code> property.
     * A comparator function that determines the ordering of the chart series when using a DataProvider. If undefined, the series will follow the order in which they are found in the data.
     * @return The value of <code>seriesComparator</code> property.
     *
     */
    getSeriesComparator(): Promise<null>;
    /**
     * Gets the value of <code>groupComparator</code> property.
     * A comparator function that determines the ordering of the chart groups when using a DataProvider. If undefined, the group will follow the order in which they are found in the data.
     * @return The value of <code>groupComparator</code> property.
     *
     */
    getGroupComparator(): Promise<null>;
    /**
     * Gets the value of <code>stack</code> property.
     * Defines whether the data items are stacked.
     * @return The value of <code>stack</code> property.
     *
     */
    getStack(): Promise<string>;
    /**
     * Gets the value of <code>drilling</code> property.
     * Whether drilling is enabled.
     * @return The value of <code>drilling</code> property.
     *
     */
    getDrilling(): Promise<string>;
    /**
     * Gets the value of <code>orientation</code> property.
     * The orientation of the chart.
     * @return The value of <code>orientation</code> property.
     *
     */
    getOrientation(): Promise<string>;
    /**
     * Gets the value of <code>timeAxisType</code> property.
     * The time axis type of the chart x axis.
     * @return The value of <code>timeAxisType</code> property.
     *
     */
    getTimeAxisType(): Promise<string>;
    /**
     * Gets the value of <code>yAxis</code> property.
     * An object defining y axis properties.
     * @return The value of <code>yAxis</code> property.
     *
     */
    getYAxis(): Promise<YAxis>;
    /**
     * Gets the value of <code>y2Axis</code> property.
     * The y2Axis options for the chart.
     * @return The value of <code>y2Axis</code> property.
     *
     */
    getY2Axis(): Promise<Y2Axis>;
    /**
     * Gets the value of <code>splitDualY</code> property.
     * Defines whether the plot area is split into two sections.
     * @return The value of <code>splitDualY</code> property.
     *
     */
    getSplitDualY(): Promise<string>;
    /**
     * Gets the value of <code>splitterPosition</code> property.
     * Specifies the fraction of the space that is given to the Y-axis subchart.
     * @return The value of <code>splitterPosition</code> property.
     *
     */
    getSplitterPosition(): Promise<number>;
    /**
     * Gets the value of <code>xAxis</code> property.
     * An object defining x axis properties.
     * @return The value of <code>xAxis</code> property.
     *
     */
    getXAxis(): Promise<XAxis>;
    /**
     * Gets the value of <code>plotArea</code> property.
     * An object defining the style of the plot area.
     * @return The value of <code>plotArea</code> property.
     *
     */
    getPlotArea(): Promise<PlotArea>;
    /**
     * Gets the value of <code>zoomAndScroll</code> property.
     * Specifies the zoom and scroll behavior of the chart.
     * @return The value of <code>zoomAndScroll</code> property.
     *
     */
    getZoomAndScroll(): Promise<string>;
    /**
     * Gets the value of <code>valueFormats</code> property.
     * An object specifying value formatting and tooltip behavior.
     * @return The value of <code>valueFormats</code> property.
     *
     */
    getValueFormats(): Promise<ValueFormats>;
    /**
     * Gets the value of <code>styleDefaults</code> property.
     * An object specifying default styles for chart style attributes..
     * @return The value of <code>styleDefaults</code> property.
     *
     */
    getStyleDefaults(): Promise<StyleDefaults>;
    /**
     * Gets the value of <code>selectionMode</code> property.
     * Specifies the selection mode.
     * @return The value of <code>selectionMode</code> property.
     *
     */
    getSelectionMode(): Promise<string>;
    /**
     * Sets the value of <code>selection</code> property.
     * An array containing the ids of the initially selected data items.
     * @param selection The value to set for <code>selection</code>
     *
     */
    changeSelection(selection: Array<string | number>): Promise<void>;
    /**
     * Gets the value of <code>selection</code> property.
     * An array containing the ids of the initially selected data items.
     * @return The value of <code>selection</code> property.
     *
     */
    getSelection(): Promise<Array<string | number>>;
    /**
     * Sets the value of <code>hiddenCategories</code> property.
     * An array of category string used for filtering.
     * @param hiddenCategories The value to set for <code>hiddenCategories</code>
     *
     */
    changeHiddenCategories(hiddenCategories: Array<string>): Promise<void>;
    /**
     * Gets the value of <code>hiddenCategories</code> property.
     * An array of category string used for filtering.
     * @return The value of <code>hiddenCategories</code> property.
     *
     */
    getHiddenCategories(): Promise<Array<string>>;
    /**
     * Gets the value of <code>dragMode</code> property.
     * The action that is performed when a drag occurs on the chart.
     * @return The value of <code>dragMode</code> property.
     *
     */
    getDragMode(): Promise<string>;
    /**
     * Sets the value of <code>highlightedCategories</code> property.
     * An array of category string used for highlighting.
     * @param highlightedCategories The value to set for <code>highlightedCategories</code>
     *
     */
    changeHighlightedCategories(highlightedCategories: Array<string>): Promise<void>;
    /**
     * Gets the value of <code>highlightedCategories</code> property.
     * An array of category string used for highlighting.
     * @return The value of <code>highlightedCategories</code> property.
     *
     */
    getHighlightedCategories(): Promise<Array<string>>;
    /**
     * Gets the value of <code>hideAndShowBehavior</code> property.
     * Defines the hide and show behavior that is performed when clicking on a leegnd item.
     * @return The value of <code>hideAndShowBehavior</code> property.
     *
     */
    getHideAndShowBehavior(): Promise<string>;
    /**
     * Gets the value of <code>hoverBehavior</code> property.
     * Defines the behavior applied when hovering over data items.
     * @return The value of <code>hoverBehavior</code> property.
     *
     */
    getHoverBehavior(): Promise<string>;
    /**
     * Gets the value of <code>highlightMatch</code> property.
     * The matching condition for the highlighted property.
     * @return The value of <code>highlightMatch</code> property.
     *
     */
    getHighlightMatch(): Promise<string>;
    /**
     * Gets the value of <code>legend</code> property.
     * An object defining the style, positioning, and behavior of the legend.
     * @return The value of <code>legend</code> property.
     *
     */
    getLegend(): Promise<Legend>;
    /**
     * Gets the value of <code>contextMenuConfig</code> property.
     * Specifies a context menu configuration.
     * @return The value of <code>contextMenuConfig</code> property.
     *
     */
    getContextMenuConfig(): Promise<ContextMenuConfig>;
}
export interface YAxis {
    /**
     * The maximum value of the chart data.
     */
    dataMax: number;
    /**
     * The minimum value of the chart data.
     */
    dataMin: number;
    /**
     * The maximum value of the y axis.
     */
    max: number;
    /**
     * The minimum value of the y axis.
     */
    min: number;
    /**
     * The y axis major tick properties.
     */
    majorTick: YAxisMajorTick;
    /**
     * The y axis minor tick properties.
     */
    minorTick: YAxisMinorTick;
    /**
     * The y axis tick label properties.
     */
    tickLabel: YAxisTickLabel;
    /**
     * The current minimum value of y axis viewport.
     */
    viewportMin: number;
    /**
     * The current maximum value of y axis viewport.
     */
    viewportMax: number;
    /**
     * The increment between major tick marks in y axis.
     */
    step: number;
    /**
     * The size of the axis.
     */
    size: number;
    /**
     * The scale of the axis.
     */
    scale: string;
    /**
     * The axis title.
     */
    title: string;
    /**
     * The axis title style.
     */
    titleStyle: object;
}
export interface YAxisMajorTick {
    /**
     * The color of the line.
     */
    lineColor: string;
    /**
     * The style of the line.
     */
    lineStyle: string;
    /**
     * The width of the line.
     */
    lineWidth: number;
    /**
     * The color of the line.
     */
    rendered: string;
}
export interface YAxisMinorTick {
    /**
     * The color of the line.
     */
    lineColor: string;
    /**
     * The style of the line.
     */
    lineStyle: string;
    /**
     * The width of the line.
     */
    lineWidth: number;
    /**
     * Whether the minor tick are rendered.
     */
    rendered: string;
}
export interface YAxisTickLabel {
    /**
     * The converter to format the axis tick labels.
     */
    converter: object;
    /**
     * Whether the tick labels are rendered or not.
     */
    rendered: string;
    /**
     * The style of the tick labels.
     */
    style: object;
}
export interface Y2Axis {
    /**
     * The maximum value of the chart data.
     */
    dataMax: number;
    /**
     * The minimum value of the chart data.
     */
    dataMin: number;
    /**
     * The maximum value of the y axis.
     */
    max: number;
    /**
     * The minimum value of the y axis.
     */
    min: number;
    /**
     * The y axis major tick properties.
     */
    majorTick: Y2AxisMajorTick;
    /**
     * The y axis minor tick properties.
     */
    minorTick: Y2AxisMinorTick;
    /**
     * The y axis tick label properties.
     */
    tickLabel: Y2AxisTickLabel;
    /**
     * The current minimum value of y axis viewport.
     */
    viewportMin: number;
    /**
     * The current maximum value of y axis viewport.
     */
    viewportMax: number;
    /**
     * The increment between major tick marks in y axis.
     */
    step: number;
    /**
     * The size of the axis.
     */
    size: number;
    /**
     * The scale of the axis.
     */
    scale: string;
    /**
     * The axis title.
     */
    title: string;
    /**
     * The axis title style.
     */
    titleStyle: object;
}
export interface Y2AxisMajorTick {
    /**
     * The color of the line.
     */
    lineColor: string;
    /**
     * The style of the line.
     */
    lineStyle: string;
    /**
     * The width of the line.
     */
    lineWidth: number;
    /**
     * The color of the line.
     */
    rendered: string;
}
export interface Y2AxisMinorTick {
    /**
     * The color of the line.
     */
    lineColor: string;
    /**
     * The style of the line.
     */
    lineStyle: string;
    /**
     * The width of the line.
     */
    lineWidth: number;
    /**
     * Whether the minor tick are rendered.
     */
    rendered: string;
}
export interface Y2AxisTickLabel {
    /**
     * The converter to format the axis tick labels.
     */
    converter: object;
    /**
     * Whether the tick labels are rendered or not.
     */
    rendered: string;
    /**
     * The style of the tick labels.
     */
    style: object;
}
export interface XAxis {
    /**
     * The x axis major tick properties.
     */
    majorTick: XAxisMajorTick;
    /**
     * The x axis minor tick properties.
     */
    minorTick: XAxisMinorTick;
    /**
     * The x axis tick label properties.
     */
    tickLabel: XAxisTickLabel;
    /**
     * The current minimum value of x axis viewport.
     */
    viewportMin: number;
    /**
     * The current maximum value of x axis viewport.
     */
    viewportMax: number;
    /**
     * The increment between major tick marks in x axis.
     */
    step: number;
    /**
     * The size of the axis.
     */
    size: number;
    /**
     * The scale of the axis.
     */
    scale: string;
    /**
     * The axis title.
     */
    title: string;
    /**
     * The axis title style.
     */
    titleStyle: object;
}
export interface XAxisMajorTick {
    /**
     * The color of the line.
     */
    lineColor: string;
    /**
     * The style of the line.
     */
    lineStyle: string;
    /**
     * The width of the line.
     */
    lineWidth: number;
    /**
     * The color of the line.
     */
    rendered: string;
}
export interface XAxisMinorTick {
    /**
     * The color of the line.
     */
    lineColor: string;
    /**
     * The style of the line.
     */
    lineStyle: string;
    /**
     * The width of the line.
     */
    lineWidth: number;
    /**
     * Whether the minor tick are rendered.
     */
    rendered: string;
}
export interface XAxisTickLabel {
    /**
     * The converter to format the axis tick labels.
     */
    converter: object | Array<object>;
    /**
     * Whether the tick labels are rendered or not.
     */
    rendered: string;
    /**
     * Whether the ticklabels can be rotated.
     */
    rotation: string;
    /**
     * The style of the tick labels.
     */
    style: object;
}
export interface PlotArea {
    /**
     * The background color of the plot area.
     */
    backgroundColor: string;
}
export interface ValueFormats {
    /**
     * The object defining formatting and tooltip behavior for the group.
     */
    group: ValueFormatsGroup;
    /**
     * The object defining formatting and tooltip behavior for the series.
     */
    series: ValueFormatsSeries;
    /**
     * The object defining formatting and tooltip behavior for the value.
     */
    value: ValueFormatsValue;
}
export interface ValueFormatsGroup {
    /**
     * A string representing the label that is displayed before the value in the tooltip.
     */
    tooltipLabel: string;
    /**
     * Whether the value is displayed in the tooltip.
     */
    tooltipDisplay: string;
}
export interface ValueFormatsSeries {
    /**
     * A string representing the label that is displayed before the value in the tooltip.
     */
    tooltipLabel: string;
    /**
     * Whether the value is displayed in the tooltip.
     */
    tooltipDisplay: string;
}
export interface ValueFormatsValue {
    /**
     * The converter to format the numerical value for the tooltip.
     */
    converter: object;
    /**
     * A string representing the label that is displayed before the value in the tooltip.
     */
    tooltipLabel: string;
    /**
     * Whether the value is displayed in the tooltip.
     */
    tooltipDisplay: string;
}
export interface StyleDefaults {
    /**
     *
     */
    groupSeparators: StyleDefaultsGroupSeparators;
}
export interface StyleDefaultsGroupSeparators {
    /**
     * Whether the group separator lines are rendered.
     */
    rendered: string;
    /**
     * The color of the group separator lines.
     */
    color: string;
}
export interface Legend {
    /**
     *
     */
    position: string;
    /**
     *
     */
    rendered: string;
    /**
     *
     */
    maxSize: number | string;
    /**
     *
     */
    size: number | string;
    /**
     *
     */
    symbolHeight: number;
    /**
     *
     */
    symbolWidth: number;
}
export interface ContextMenuConfig {
    /**
     *
     */
    accessibleLabel: string;
}
