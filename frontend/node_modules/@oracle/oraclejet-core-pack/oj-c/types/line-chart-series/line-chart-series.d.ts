export declare const LineChartSeriesDefaults: Partial<LineChartSeriesProps>;
export type LineChartSeriesProps = {
    /**
     * @description
     * Defines whether the series is associated with the y2 axis.
     * @ojmetadata description "Defines whether the series is associated with the y2 axis"
     * @ojmetadata displayName "Assigned To Y2"
     * @ojmetadata help "#assignedToY2"
     */
    assignedToY2?: 'on' | 'off';
    /**
     * @description
     * An array of category strings corresponding to the tag cloud items. This allows highlighting and filtering of items.
     * @ojmetadata description "An array of category strings corresponding to the tag cloud items."
     * @ojmetadata displayName "Categories"
     * @ojmetadata help "#categories"
     */
    categories?: string[];
    /**
     * @description
     * The color of the series. The chart legend item will inherit this color value.
     * @ojmetadata description "The color of the series. The chart legend item will inherit this color value."
     * @ojmetadata displayName "Color"
     * @ojmetadata help "#color"
     */
    color?: string;
    /**
     * @description
     * Whether drilling is enabled on the series item. Drillable objects will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click (double click if selection is enabled). To enable drilling for all series items at once, use the drilling attribute in the top level.
     * @ojmetadata description "Whether drilling is enabled on the series item."
     * @ojmetadata displayName "Drilling"
     * @ojmetadata help "#drilling"
     */
    drilling?: 'on' | 'off' | 'inherit';
    /**
     * @description
     * The line style of the data line. Only applies to line, lineWithArea, scatter, and bubble series..
     * @ojmetadata description "The line style of the data line."
     * @ojmetadata displayName "LineStyle"
     * @ojmetadata help "#lineStyle"
     */
    lineStyle?: 'solid' | 'dotted' | 'dashed';
    /**
     * @description
     * The line type of the data line or area. Only applies to line, area, scatter, and bubble series. centeredStepped and centeredSegmented are not supported for polar, scatter, and bubble charts.
     * @ojmetadata description "The line type of the data line or area."
     * @ojmetadata displayName "Line Type"
     * @ojmetadata help "#lineType"
     */
    lineType?: 'curved' | 'straight';
    /**
     * @description
     * The width of the data line. Only applies to line, lineWithArea, scatter, and bubble series.
     * @ojmetadata description "The width of the data line."
     * @ojmetadata displayName "Line Width"
     * @ojmetadata help "#lineWidth"
     */
    lineWidth?: number;
    /**
     * @description
     * The shape of the data markers. In addition to the built-in shapes, it may also take SVG path commands to specify a custom shape. The chart will style the custom shapes the same way as built-in shapes, supporting properties like color and borderColor and applying hover and selection effects. Only 'auto' is supported for range series.
     * @ojmetadata description "The shape of the data markers."
     * @ojmetadata displayName "Marker Shape"
     * @ojmetadata help "#markerShape"
     */
    markerShape?: 'circle' | 'diamond' | 'human' | 'plus' | 'square' | 'star' | 'triangleDown' | 'triangleUp' | 'auto';
    /**
     * @description
     * The color of the data markers, if different from the series color.
     * @ojmetadata description "The color of the data markers, if different from the series color."
     * @ojmetadata displayName "Marker Color"
     * @ojmetadata help "#markerColor"
     */
    markerColor?: string;
    /**
     * @description
     * Defines whether the data marker is displayed. Only applies to line, area, scatter, and bubble series. If auto, the markers will be displayed whenever the data points are not connected by a line.
     * @ojmetadata description "Defines whether the data marker is displayed. Only applies to line, area, scatter, and bubble series."
     * @ojmetadata displayName "Marker Displayed"
     * @ojmetadata help "#markerDisplayed"
     */
    markerDisplayed?: string;
    /**
     * @description
     * The size of the data markers.
     * @ojmetadata description "The size of the data markers."
     * @ojmetadata displayName "Marker Size"
     * @ojmetadata help "#markerSize"
     */
    markerSize?: number;
    /**
     * @description
     * The name of the series, displayed in the legend and tooltips.
     * @ojmetadata description "The name of the series, displayed in the legend and tooltips."
     * @ojmetadata displayName "Name"
     * @ojmetadata help "#name"
     */
    name?: string;
    /**
     * @description
     * The description of this series. This is used for accessibility and for customizing the tooltip text on the corresponding legend item for the series.
     * @ojmetadata description "The description of this series. This is used for accessibility and for customizing the tooltip text on the corresponding legend item for the series."
     * @ojmetadata displayName "Short Desc"
     * @ojmetadata help "#shortDesc"
     */
    shortDesc?: string;
};
/**
 * This export corresponds to the LineChartSeries Preact component. For the oj-c-line-chart-series custom element, import CLineChartSeriesElement instead.
 */
export declare const LineChartSeries: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<LineChartSeriesProps>>;
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-line-chart-series custom element. For the LineChartSeries Preact component, import LineChartSeries instead.
 */
export interface CLineChartSeriesElement extends JetElement<CLineChartSeriesElementSettableProperties>, CLineChartSeriesElementSettableProperties {
    addEventListener<T extends keyof CLineChartSeriesElementEventMap>(type: T, listener: (this: HTMLElement, ev: CLineChartSeriesElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CLineChartSeriesElementSettableProperties>(property: T): CLineChartSeriesElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CLineChartSeriesElementSettableProperties>(property: T, value: CLineChartSeriesElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CLineChartSeriesElementSettableProperties>): void;
    setProperties(properties: CLineChartSeriesElementSettablePropertiesLenient): void;
}
export namespace CLineChartSeriesElement {
    type assignedToY2Changed = JetElementCustomEventStrict<CLineChartSeriesElement['assignedToY2']>;
    type categoriesChanged = JetElementCustomEventStrict<CLineChartSeriesElement['categories']>;
    type colorChanged = JetElementCustomEventStrict<CLineChartSeriesElement['color']>;
    type drillingChanged = JetElementCustomEventStrict<CLineChartSeriesElement['drilling']>;
    type lineStyleChanged = JetElementCustomEventStrict<CLineChartSeriesElement['lineStyle']>;
    type lineTypeChanged = JetElementCustomEventStrict<CLineChartSeriesElement['lineType']>;
    type lineWidthChanged = JetElementCustomEventStrict<CLineChartSeriesElement['lineWidth']>;
    type markerColorChanged = JetElementCustomEventStrict<CLineChartSeriesElement['markerColor']>;
    type markerDisplayedChanged = JetElementCustomEventStrict<CLineChartSeriesElement['markerDisplayed']>;
    type markerShapeChanged = JetElementCustomEventStrict<CLineChartSeriesElement['markerShape']>;
    type markerSizeChanged = JetElementCustomEventStrict<CLineChartSeriesElement['markerSize']>;
    type nameChanged = JetElementCustomEventStrict<CLineChartSeriesElement['name']>;
    type shortDescChanged = JetElementCustomEventStrict<CLineChartSeriesElement['shortDesc']>;
}
export interface CLineChartSeriesElementEventMap extends HTMLElementEventMap {
    'assignedToY2Changed': JetElementCustomEventStrict<CLineChartSeriesElement['assignedToY2']>;
    'categoriesChanged': JetElementCustomEventStrict<CLineChartSeriesElement['categories']>;
    'colorChanged': JetElementCustomEventStrict<CLineChartSeriesElement['color']>;
    'drillingChanged': JetElementCustomEventStrict<CLineChartSeriesElement['drilling']>;
    'lineStyleChanged': JetElementCustomEventStrict<CLineChartSeriesElement['lineStyle']>;
    'lineTypeChanged': JetElementCustomEventStrict<CLineChartSeriesElement['lineType']>;
    'lineWidthChanged': JetElementCustomEventStrict<CLineChartSeriesElement['lineWidth']>;
    'markerColorChanged': JetElementCustomEventStrict<CLineChartSeriesElement['markerColor']>;
    'markerDisplayedChanged': JetElementCustomEventStrict<CLineChartSeriesElement['markerDisplayed']>;
    'markerShapeChanged': JetElementCustomEventStrict<CLineChartSeriesElement['markerShape']>;
    'markerSizeChanged': JetElementCustomEventStrict<CLineChartSeriesElement['markerSize']>;
    'nameChanged': JetElementCustomEventStrict<CLineChartSeriesElement['name']>;
    'shortDescChanged': JetElementCustomEventStrict<CLineChartSeriesElement['shortDesc']>;
}
export interface CLineChartSeriesElementSettableProperties extends JetSettableProperties {
    /**
     * Defines whether the series is associated with the y2 axis.
     */
    assignedToY2?: LineChartSeriesProps['assignedToY2'];
    /**
     * An array of category strings corresponding to the tag cloud items. This allows highlighting and filtering of items.
     */
    categories?: LineChartSeriesProps['categories'];
    /**
     * The color of the series. The chart legend item will inherit this color value.
     */
    color?: LineChartSeriesProps['color'];
    /**
     * Whether drilling is enabled on the series item. Drillable objects will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click (double click if selection is enabled). To enable drilling for all series items at once, use the drilling attribute in the top level.
     */
    drilling?: LineChartSeriesProps['drilling'];
    /**
     * The line style of the data line. Only applies to line, lineWithArea, scatter, and bubble series..
     */
    lineStyle?: LineChartSeriesProps['lineStyle'];
    /**
     * The line type of the data line or area. Only applies to line, area, scatter, and bubble series. centeredStepped and centeredSegmented are not supported for polar, scatter, and bubble charts.
     */
    lineType?: LineChartSeriesProps['lineType'];
    /**
     * The width of the data line. Only applies to line, lineWithArea, scatter, and bubble series.
     */
    lineWidth?: LineChartSeriesProps['lineWidth'];
    /**
     * The color of the data markers, if different from the series color.
     */
    markerColor?: LineChartSeriesProps['markerColor'];
    /**
     * Defines whether the data marker is displayed. Only applies to line, area, scatter, and bubble series. If auto, the markers will be displayed whenever the data points are not connected by a line.
     */
    markerDisplayed?: LineChartSeriesProps['markerDisplayed'];
    /**
     * The shape of the data markers. In addition to the built-in shapes, it may also take SVG path commands to specify a custom shape. The chart will style the custom shapes the same way as built-in shapes, supporting properties like color and borderColor and applying hover and selection effects. Only 'auto' is supported for range series.
     */
    markerShape?: LineChartSeriesProps['markerShape'];
    /**
     * The size of the data markers.
     */
    markerSize?: LineChartSeriesProps['markerSize'];
    /**
     * The name of the series, displayed in the legend and tooltips.
     */
    name?: LineChartSeriesProps['name'];
    /**
     * The description of this series. This is used for accessibility and for customizing the tooltip text on the corresponding legend item for the series.
     */
    shortDesc?: LineChartSeriesProps['shortDesc'];
}
export interface CLineChartSeriesElementSettablePropertiesLenient extends Partial<CLineChartSeriesElementSettableProperties> {
    [key: string]: any;
}
export interface LineChartSeriesIntrinsicProps extends Partial<Readonly<CLineChartSeriesElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onassignedToY2Changed?: (value: CLineChartSeriesElementEventMap['assignedToY2Changed']) => void;
    oncategoriesChanged?: (value: CLineChartSeriesElementEventMap['categoriesChanged']) => void;
    oncolorChanged?: (value: CLineChartSeriesElementEventMap['colorChanged']) => void;
    ondrillingChanged?: (value: CLineChartSeriesElementEventMap['drillingChanged']) => void;
    onlineStyleChanged?: (value: CLineChartSeriesElementEventMap['lineStyleChanged']) => void;
    onlineTypeChanged?: (value: CLineChartSeriesElementEventMap['lineTypeChanged']) => void;
    onlineWidthChanged?: (value: CLineChartSeriesElementEventMap['lineWidthChanged']) => void;
    onmarkerColorChanged?: (value: CLineChartSeriesElementEventMap['markerColorChanged']) => void;
    onmarkerDisplayedChanged?: (value: CLineChartSeriesElementEventMap['markerDisplayedChanged']) => void;
    onmarkerShapeChanged?: (value: CLineChartSeriesElementEventMap['markerShapeChanged']) => void;
    onmarkerSizeChanged?: (value: CLineChartSeriesElementEventMap['markerSizeChanged']) => void;
    onnameChanged?: (value: CLineChartSeriesElementEventMap['nameChanged']) => void;
    onshortDescChanged?: (value: CLineChartSeriesElementEventMap['shortDescChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-line-chart-series': LineChartSeriesIntrinsicProps;
        }
    }
}
