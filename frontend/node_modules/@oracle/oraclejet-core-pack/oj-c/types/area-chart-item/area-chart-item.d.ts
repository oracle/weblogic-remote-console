export type AreaChartItemImplProps = {
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
     * @ojmetadata description "The array of ids for the groups the item belongs to."
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
 * @deprecated since 19.0.0 - use `ComponentProps<typeof AreaChartItem>` instead
 */
export type AreaChartItemProps = AreaChartItemImplProps;
/**
 * This export corresponds to the AreaChartItem Preact component. For the oj-c-area-chart-item custom element, import CAreaChartItemElement instead.
 */
export declare const AreaChartItem: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<AreaChartItemImplProps>>;
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-area-chart-item custom element. For the AreaChartItem Preact component, import AreaChartItem instead.
 */
export interface CAreaChartItemElement extends JetElement<CAreaChartItemElementSettableProperties>, CAreaChartItemElementSettableProperties {
    addEventListener<T extends keyof CAreaChartItemElementEventMap>(type: T, listener: (this: HTMLElement, ev: CAreaChartItemElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CAreaChartItemElementSettableProperties>(property: T): CAreaChartItemElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CAreaChartItemElementSettableProperties>(property: T, value: CAreaChartItemElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CAreaChartItemElementSettableProperties>): void;
    setProperties(properties: CAreaChartItemElementSettablePropertiesLenient): void;
}
export namespace CAreaChartItemElement {
    type categoriesChanged = JetElementCustomEventStrict<CAreaChartItemElement['categories']>;
    type colorChanged = JetElementCustomEventStrict<CAreaChartItemElement['color']>;
    type drillingChanged = JetElementCustomEventStrict<CAreaChartItemElement['drilling']>;
    type groupIdChanged = JetElementCustomEventStrict<CAreaChartItemElement['groupId']>;
    type markerDisplayedChanged = JetElementCustomEventStrict<CAreaChartItemElement['markerDisplayed']>;
    type markerShapeChanged = JetElementCustomEventStrict<CAreaChartItemElement['markerShape']>;
    type markerSizeChanged = JetElementCustomEventStrict<CAreaChartItemElement['markerSize']>;
    type seriesIdChanged = JetElementCustomEventStrict<CAreaChartItemElement['seriesId']>;
    type shortDescChanged = JetElementCustomEventStrict<CAreaChartItemElement['shortDesc']>;
    type valueChanged = JetElementCustomEventStrict<CAreaChartItemElement['value']>;
    type xChanged = JetElementCustomEventStrict<CAreaChartItemElement['x']>;
}
export interface CAreaChartItemElementEventMap extends HTMLElementEventMap {
    'categoriesChanged': JetElementCustomEventStrict<CAreaChartItemElement['categories']>;
    'colorChanged': JetElementCustomEventStrict<CAreaChartItemElement['color']>;
    'drillingChanged': JetElementCustomEventStrict<CAreaChartItemElement['drilling']>;
    'groupIdChanged': JetElementCustomEventStrict<CAreaChartItemElement['groupId']>;
    'markerDisplayedChanged': JetElementCustomEventStrict<CAreaChartItemElement['markerDisplayed']>;
    'markerShapeChanged': JetElementCustomEventStrict<CAreaChartItemElement['markerShape']>;
    'markerSizeChanged': JetElementCustomEventStrict<CAreaChartItemElement['markerSize']>;
    'seriesIdChanged': JetElementCustomEventStrict<CAreaChartItemElement['seriesId']>;
    'shortDescChanged': JetElementCustomEventStrict<CAreaChartItemElement['shortDesc']>;
    'valueChanged': JetElementCustomEventStrict<CAreaChartItemElement['value']>;
    'xChanged': JetElementCustomEventStrict<CAreaChartItemElement['x']>;
}
export interface CAreaChartItemElementSettableProperties extends JetSettableProperties {
    /**
     * An optional array of category strings corresponding to this data item. This enables highlighting and filtering of individual data items through interactions with the legend or other visualization elements. If not defined, series categories are used.
     */
    categories?: AreaChartItemImplProps['categories'];
    /**
     * The color of the data item. This color value is not inherited by chart legend. See chart <a href="oj.ojChartSeries.html#color">series color</a> and <a href="oj.ojChartSeries.html#displayInLegend">display-in-legend</a> for more details.
     */
    color?: AreaChartItemImplProps['color'];
    /**
     * Whether drilling is enabled for the data item. Drillable objects will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click (double click if selection is enabled). To enable drilling for all data items at once, use the drilling attribute in the top level.
     */
    drilling?: AreaChartItemImplProps['drilling'];
    /**
     * The array of ids for the groups the item belongs to. For hierarchical groups, it will be an array of outermost to innermost group ids. This is also used to specify the date for non mixed frequency time axes. The specified date for non mixed frequency time axes must be an ISO string.
     */
    groupId: AreaChartItemImplProps['groupId'];
    /**
     * Defines whether the data marker is displayed. Only applies to line, area, scatter, and bubble series. If auto, the markers will be displayed whenever the data points are not connected by a line.
     */
    markerDisplayed?: AreaChartItemImplProps['markerDisplayed'];
    /**
     * The shape of the data markers. Only applies to line, area, scatter, and bubble series. In addition to the built-in shapes, it may also take SVG path commands to specify a custom shape. The chart will style the custom shapes the same way as built-in shapes, supporting properties like color and borderColor and applying hover and selection effects. Only 'auto' is supported for range series.
     */
    markerShape?: AreaChartItemImplProps['markerShape'];
    /**
     * The size of the data markers. Only applies to line, area, and scatter series. Does not apply to bubble charts, which calculate marker size based on the z values.
     */
    markerSize?: AreaChartItemImplProps['markerSize'];
    /**
     * The id for the series the item belongs to.
     */
    seriesId: AreaChartItemImplProps['seriesId'];
    /**
     * The description of this object. This is used for accessibility and also for customizing the tooltip text.
     */
    shortDesc?: AreaChartItemImplProps['shortDesc'];
    /**
     * The value for this data item. Null can be specified to skip a data point.
     */
    value: AreaChartItemImplProps['value'];
    /**
     * The x value. Mainly used to specify the date for mixed-frequency time axis. The date specified in the x value must be an ISO date string.
     */
    x?: AreaChartItemImplProps['x'];
}
export interface CAreaChartItemElementSettablePropertiesLenient extends Partial<CAreaChartItemElementSettableProperties> {
    [key: string]: any;
}
export interface AreaChartItemIntrinsicProps extends Partial<Readonly<CAreaChartItemElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    oncategoriesChanged?: (value: CAreaChartItemElementEventMap['categoriesChanged']) => void;
    oncolorChanged?: (value: CAreaChartItemElementEventMap['colorChanged']) => void;
    ondrillingChanged?: (value: CAreaChartItemElementEventMap['drillingChanged']) => void;
    ongroupIdChanged?: (value: CAreaChartItemElementEventMap['groupIdChanged']) => void;
    onmarkerDisplayedChanged?: (value: CAreaChartItemElementEventMap['markerDisplayedChanged']) => void;
    onmarkerShapeChanged?: (value: CAreaChartItemElementEventMap['markerShapeChanged']) => void;
    onmarkerSizeChanged?: (value: CAreaChartItemElementEventMap['markerSizeChanged']) => void;
    onseriesIdChanged?: (value: CAreaChartItemElementEventMap['seriesIdChanged']) => void;
    onshortDescChanged?: (value: CAreaChartItemElementEventMap['shortDescChanged']) => void;
    onvalueChanged?: (value: CAreaChartItemElementEventMap['valueChanged']) => void;
    onxChanged?: (value: CAreaChartItemElementEventMap['xChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-area-chart-item': AreaChartItemIntrinsicProps;
        }
    }
}
