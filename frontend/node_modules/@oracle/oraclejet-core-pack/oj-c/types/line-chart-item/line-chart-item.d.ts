export type LineChartItemImplProps = {
    /**
     * @description
     * The id for the series the item belongs to.
     * @ojmetadata description "The id for the series the item belongs to."
     * @ojmetadata displayName "Series Id"
     * @ojmetadata help "#seriesId"
     */
    seriesId: string;
    /**
     * @description
     * The array of ids for the groups the item belongs to. For hierarchical groups, it will be an array of outermost to innermost group ids. This is also used to specify the date for non mixed frequency time axes. The specified date for non mixed frequency time axes must be an ISO string.
     * @ojmetadata description "The array of ids for the groups the item belongs to"
     * @ojmetadata displayName "Group Id"
     * @ojmetadata help "#groupId"
     */
    groupId: Array<string>;
    /**
     * @description
     * The value for this data item. Null can be specified to skip a data point.
     * @ojmetadata description "The value of the data item."
     * @ojmetadata displayName "Value"
     * @ojmetadata help "#value"
     */
    value: number;
    /**
     * @description
     * The x value. Mainly used to specify the date for mixed-frequency time axis. The date specified in the x value must be an ISO date string.
     * @ojmetadata description "The x value of the data item."
     * @ojmetadata displayName "X"
     * @ojmetadata help "#x"
     */
    x?: string;
    /**
     * @description
     * The color of the data item. This color value is not inherited by chart legend. See chart <a href="oj.ojChartSeries.html#color">series color</a> and <a href="oj.ojChartSeries.html#displayInLegend">display-in-legend</a> for more details.
     * @ojmetadata description "The color of the data item."
     * @ojmetadata displayName "Color"
     * @ojmetadata help "#color"
     */
    color?: string;
    /**
     * @description
     * Defines whether the data marker is displayed. Only applies to line, area, scatter, and bubble series. If auto, the markers will be displayed whenever the data points are not connected by a line.
     * @ojmetadata description "Defines whether the data marker is displayed. Only applies to line, area, scatter, and bubble series."
     * @ojmetadata displayName "Marker Displayed"
     * @ojmetadata help "#markerDisplayed"
     */
    markerDisplayed?: 'on' | 'off' | 'auto';
    /**
     * @description
     * The shape of the data markers. Only applies to line, area, scatter, and bubble series. In addition to the built-in shapes, it may also take SVG path commands to specify a custom shape. The chart will style the custom shapes the same way as built-in shapes, supporting properties like color and borderColor and applying hover and selection effects. Only 'auto' is supported for range series.
     * @ojmetadata description "The shape of the data markers. Only applies to line, area, scatter, and bubble series."
     * @ojmetadata displayName "Marker Shape"
     * @ojmetadata help "#markerShape"
     */
    markerShape?: 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | 'auto';
    /**
     * @description
     * The size of the data markers. Only applies to line, area, and scatter series. Does not apply to bubble charts, which calculate marker size based on the z values.
     * @ojmetadata description "The size of the data markers. Only applies to line, area, and scatter series."
     * @ojmetadata displayName "Marker Size"
     * @ojmetadata help "#markerSize"
     */
    markerSize?: number;
    /**
     * @description
     * An optional array of category strings corresponding to this data item. This enables highlighting and filtering of individual data items through interactions with the legend or other visualization elements. If not defined, series categories are used.
     * @ojmetadata description "An optional array of category strings corresponding to this data item."
     * @ojmetadata displayName "Categories"
     * @ojmetadata help "#categories"
     */
    categories?: string[];
    /**
     * @description
     * Whether drilling is enabled for the data item. Drillable objects will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click (double click if selection is enabled). To enable drilling for all data items at once, use the drilling attribute in the top level.
     * @ojmetadata description "Whether drilling is enabled for the data item."
     * @ojmetadata displayName "Drilling"
     * @ojmetadata help "#drilling"
     */
    drilling?: 'on' | 'off' | 'inherit';
    /**
     * @description
     * The description of this object. This is used for accessibility and also for customizing the tooltip text.
     * @ojmetadata displayName "Short Desc"
     * @ojmetadata help "#shortDesc"
     */
    shortDesc?: string;
};
/**
 * @deprecated since 19.0.0 - use `ComponentProps<typeof LineChartItem>` instead
 */
export type LineChartItemProps = LineChartItemImplProps;
/**
 * This export corresponds to the LineChartItem Preact component. For the oj-c-line-chart-item custom element, import CLineChartItemElement instead.
 */
export declare const LineChartItem: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<LineChartItemImplProps>>;
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-line-chart-item custom element. For the LineChartItem Preact component, import LineChartItem instead.
 */
export interface CLineChartItemElement extends JetElement<CLineChartItemElementSettableProperties>, CLineChartItemElementSettableProperties {
    addEventListener<T extends keyof CLineChartItemElementEventMap>(type: T, listener: (this: HTMLElement, ev: CLineChartItemElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CLineChartItemElementSettableProperties>(property: T): CLineChartItemElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CLineChartItemElementSettableProperties>(property: T, value: CLineChartItemElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CLineChartItemElementSettableProperties>): void;
    setProperties(properties: CLineChartItemElementSettablePropertiesLenient): void;
}
export namespace CLineChartItemElement {
    type categoriesChanged = JetElementCustomEventStrict<CLineChartItemElement['categories']>;
    type colorChanged = JetElementCustomEventStrict<CLineChartItemElement['color']>;
    type drillingChanged = JetElementCustomEventStrict<CLineChartItemElement['drilling']>;
    type groupIdChanged = JetElementCustomEventStrict<CLineChartItemElement['groupId']>;
    type markerDisplayedChanged = JetElementCustomEventStrict<CLineChartItemElement['markerDisplayed']>;
    type markerShapeChanged = JetElementCustomEventStrict<CLineChartItemElement['markerShape']>;
    type markerSizeChanged = JetElementCustomEventStrict<CLineChartItemElement['markerSize']>;
    type seriesIdChanged = JetElementCustomEventStrict<CLineChartItemElement['seriesId']>;
    type shortDescChanged = JetElementCustomEventStrict<CLineChartItemElement['shortDesc']>;
    type valueChanged = JetElementCustomEventStrict<CLineChartItemElement['value']>;
    type xChanged = JetElementCustomEventStrict<CLineChartItemElement['x']>;
}
export interface CLineChartItemElementEventMap extends HTMLElementEventMap {
    'categoriesChanged': JetElementCustomEventStrict<CLineChartItemElement['categories']>;
    'colorChanged': JetElementCustomEventStrict<CLineChartItemElement['color']>;
    'drillingChanged': JetElementCustomEventStrict<CLineChartItemElement['drilling']>;
    'groupIdChanged': JetElementCustomEventStrict<CLineChartItemElement['groupId']>;
    'markerDisplayedChanged': JetElementCustomEventStrict<CLineChartItemElement['markerDisplayed']>;
    'markerShapeChanged': JetElementCustomEventStrict<CLineChartItemElement['markerShape']>;
    'markerSizeChanged': JetElementCustomEventStrict<CLineChartItemElement['markerSize']>;
    'seriesIdChanged': JetElementCustomEventStrict<CLineChartItemElement['seriesId']>;
    'shortDescChanged': JetElementCustomEventStrict<CLineChartItemElement['shortDesc']>;
    'valueChanged': JetElementCustomEventStrict<CLineChartItemElement['value']>;
    'xChanged': JetElementCustomEventStrict<CLineChartItemElement['x']>;
}
export interface CLineChartItemElementSettableProperties extends JetSettableProperties {
    /**
     * An optional array of category strings corresponding to this data item. This enables highlighting and filtering of individual data items through interactions with the legend or other visualization elements. If not defined, series categories are used.
     */
    categories?: LineChartItemProps['categories'];
    /**
     * The color of the data item. This color value is not inherited by chart legend. See chart <a href="oj.ojChartSeries.html#color">series color</a> and <a href="oj.ojChartSeries.html#displayInLegend">display-in-legend</a> for more details.
     */
    color?: LineChartItemProps['color'];
    /**
     * Whether drilling is enabled for the data item. Drillable objects will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click (double click if selection is enabled). To enable drilling for all data items at once, use the drilling attribute in the top level.
     */
    drilling?: LineChartItemProps['drilling'];
    /**
     * The array of ids for the groups the item belongs to. For hierarchical groups, it will be an array of outermost to innermost group ids. This is also used to specify the date for non mixed frequency time axes. The specified date for non mixed frequency time axes must be an ISO string.
     */
    groupId: LineChartItemProps['groupId'];
    /**
     * Defines whether the data marker is displayed. Only applies to line, area, scatter, and bubble series. If auto, the markers will be displayed whenever the data points are not connected by a line.
     */
    markerDisplayed?: LineChartItemProps['markerDisplayed'];
    /**
     * The shape of the data markers. Only applies to line, area, scatter, and bubble series. In addition to the built-in shapes, it may also take SVG path commands to specify a custom shape. The chart will style the custom shapes the same way as built-in shapes, supporting properties like color and borderColor and applying hover and selection effects. Only 'auto' is supported for range series.
     */
    markerShape?: LineChartItemProps['markerShape'];
    /**
     * The size of the data markers. Only applies to line, area, and scatter series. Does not apply to bubble charts, which calculate marker size based on the z values.
     */
    markerSize?: LineChartItemProps['markerSize'];
    /**
     * The id for the series the item belongs to.
     */
    seriesId: LineChartItemProps['seriesId'];
    /**
     * The description of this object. This is used for accessibility and also for customizing the tooltip text.
     */
    shortDesc?: LineChartItemProps['shortDesc'];
    /**
     * The value for this data item. Null can be specified to skip a data point.
     */
    value: LineChartItemProps['value'];
    /**
     * The x value. Mainly used to specify the date for mixed-frequency time axis. The date specified in the x value must be an ISO date string.
     */
    x?: LineChartItemProps['x'];
}
export interface CLineChartItemElementSettablePropertiesLenient extends Partial<CLineChartItemElementSettableProperties> {
    [key: string]: any;
}
export interface LineChartItemIntrinsicProps extends Partial<Readonly<CLineChartItemElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    oncategoriesChanged?: (value: CLineChartItemElementEventMap['categoriesChanged']) => void;
    oncolorChanged?: (value: CLineChartItemElementEventMap['colorChanged']) => void;
    ondrillingChanged?: (value: CLineChartItemElementEventMap['drillingChanged']) => void;
    ongroupIdChanged?: (value: CLineChartItemElementEventMap['groupIdChanged']) => void;
    onmarkerDisplayedChanged?: (value: CLineChartItemElementEventMap['markerDisplayedChanged']) => void;
    onmarkerShapeChanged?: (value: CLineChartItemElementEventMap['markerShapeChanged']) => void;
    onmarkerSizeChanged?: (value: CLineChartItemElementEventMap['markerSizeChanged']) => void;
    onseriesIdChanged?: (value: CLineChartItemElementEventMap['seriesIdChanged']) => void;
    onshortDescChanged?: (value: CLineChartItemElementEventMap['shortDescChanged']) => void;
    onvalueChanged?: (value: CLineChartItemElementEventMap['valueChanged']) => void;
    onxChanged?: (value: CLineChartItemElementEventMap['xChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-line-chart-item': LineChartItemIntrinsicProps;
        }
    }
}
