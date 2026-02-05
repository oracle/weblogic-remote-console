export declare const AreaChartSeriesDefaults: Partial<AreaChartSeriesProps>;
export type AreaChartSeriesProps = {
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
     * The line type of the data line or area. Only applies to line, area, scatter, and bubble series. centeredStepped and centeredSegmented are not supported for polar, scatter, and bubble charts.
     * @ojmetadata description "The line type of the data line or area."
     * @ojmetadata displayName "Line Type"
     * @ojmetadata help "#lineType"
     */
    lineType?: 'curved' | 'straight';
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
 * This export corresponds to the AreaChartSeries Preact component. For the oj-c-area-chart-series custom element, import CAreaChartSeriesElement instead.
 */
export declare const AreaChartSeries: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<AreaChartSeriesProps>>;
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-area-chart-series custom element. For the AreaChartSeries Preact component, import AreaChartSeries instead.
 */
export interface CAreaChartSeriesElement extends JetElement<CAreaChartSeriesElementSettableProperties>, CAreaChartSeriesElementSettableProperties {
    addEventListener<T extends keyof CAreaChartSeriesElementEventMap>(type: T, listener: (this: HTMLElement, ev: CAreaChartSeriesElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CAreaChartSeriesElementSettableProperties>(property: T): CAreaChartSeriesElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CAreaChartSeriesElementSettableProperties>(property: T, value: CAreaChartSeriesElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CAreaChartSeriesElementSettableProperties>): void;
    setProperties(properties: CAreaChartSeriesElementSettablePropertiesLenient): void;
}
export namespace CAreaChartSeriesElement {
    type assignedToY2Changed = JetElementCustomEventStrict<CAreaChartSeriesElement['assignedToY2']>;
    type categoriesChanged = JetElementCustomEventStrict<CAreaChartSeriesElement['categories']>;
    type colorChanged = JetElementCustomEventStrict<CAreaChartSeriesElement['color']>;
    type drillingChanged = JetElementCustomEventStrict<CAreaChartSeriesElement['drilling']>;
    type lineTypeChanged = JetElementCustomEventStrict<CAreaChartSeriesElement['lineType']>;
    type markerColorChanged = JetElementCustomEventStrict<CAreaChartSeriesElement['markerColor']>;
    type markerDisplayedChanged = JetElementCustomEventStrict<CAreaChartSeriesElement['markerDisplayed']>;
    type markerShapeChanged = JetElementCustomEventStrict<CAreaChartSeriesElement['markerShape']>;
    type markerSizeChanged = JetElementCustomEventStrict<CAreaChartSeriesElement['markerSize']>;
    type nameChanged = JetElementCustomEventStrict<CAreaChartSeriesElement['name']>;
    type shortDescChanged = JetElementCustomEventStrict<CAreaChartSeriesElement['shortDesc']>;
}
export interface CAreaChartSeriesElementEventMap extends HTMLElementEventMap {
    'assignedToY2Changed': JetElementCustomEventStrict<CAreaChartSeriesElement['assignedToY2']>;
    'categoriesChanged': JetElementCustomEventStrict<CAreaChartSeriesElement['categories']>;
    'colorChanged': JetElementCustomEventStrict<CAreaChartSeriesElement['color']>;
    'drillingChanged': JetElementCustomEventStrict<CAreaChartSeriesElement['drilling']>;
    'lineTypeChanged': JetElementCustomEventStrict<CAreaChartSeriesElement['lineType']>;
    'markerColorChanged': JetElementCustomEventStrict<CAreaChartSeriesElement['markerColor']>;
    'markerDisplayedChanged': JetElementCustomEventStrict<CAreaChartSeriesElement['markerDisplayed']>;
    'markerShapeChanged': JetElementCustomEventStrict<CAreaChartSeriesElement['markerShape']>;
    'markerSizeChanged': JetElementCustomEventStrict<CAreaChartSeriesElement['markerSize']>;
    'nameChanged': JetElementCustomEventStrict<CAreaChartSeriesElement['name']>;
    'shortDescChanged': JetElementCustomEventStrict<CAreaChartSeriesElement['shortDesc']>;
}
export interface CAreaChartSeriesElementSettableProperties extends JetSettableProperties {
    /**
     * Defines whether the series is associated with the y2 axis.
     */
    assignedToY2?: AreaChartSeriesProps['assignedToY2'];
    /**
     * An array of category strings corresponding to the tag cloud items. This allows highlighting and filtering of items.
     */
    categories?: AreaChartSeriesProps['categories'];
    /**
     * The color of the series. The chart legend item will inherit this color value.
     */
    color?: AreaChartSeriesProps['color'];
    /**
     * Whether drilling is enabled on the series item. Drillable objects will show a pointer cursor on hover and fire an <code class="prettyprint">ojDrill</code> event on click (double click if selection is enabled). To enable drilling for all series items at once, use the drilling attribute in the top level.
     */
    drilling?: AreaChartSeriesProps['drilling'];
    /**
     * The line type of the data line or area. Only applies to line, area, scatter, and bubble series. centeredStepped and centeredSegmented are not supported for polar, scatter, and bubble charts.
     */
    lineType?: AreaChartSeriesProps['lineType'];
    /**
     * The color of the data markers, if different from the series color.
     */
    markerColor?: AreaChartSeriesProps['markerColor'];
    /**
     * Defines whether the data marker is displayed. Only applies to line, area, scatter, and bubble series. If auto, the markers will be displayed whenever the data points are not connected by a line.
     */
    markerDisplayed?: AreaChartSeriesProps['markerDisplayed'];
    /**
     * The shape of the data markers. In addition to the built-in shapes, it may also take SVG path commands to specify a custom shape. The chart will style the custom shapes the same way as built-in shapes, supporting properties like color and borderColor and applying hover and selection effects. Only 'auto' is supported for range series.
     */
    markerShape?: AreaChartSeriesProps['markerShape'];
    /**
     * The size of the data markers.
     */
    markerSize?: AreaChartSeriesProps['markerSize'];
    /**
     * The name of the series, displayed in the legend and tooltips.
     */
    name?: AreaChartSeriesProps['name'];
    /**
     * The description of this series. This is used for accessibility and for customizing the tooltip text on the corresponding legend item for the series.
     */
    shortDesc?: AreaChartSeriesProps['shortDesc'];
}
export interface CAreaChartSeriesElementSettablePropertiesLenient extends Partial<CAreaChartSeriesElementSettableProperties> {
    [key: string]: any;
}
export interface AreaChartSeriesIntrinsicProps extends Partial<Readonly<CAreaChartSeriesElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onassignedToY2Changed?: (value: CAreaChartSeriesElementEventMap['assignedToY2Changed']) => void;
    oncategoriesChanged?: (value: CAreaChartSeriesElementEventMap['categoriesChanged']) => void;
    oncolorChanged?: (value: CAreaChartSeriesElementEventMap['colorChanged']) => void;
    ondrillingChanged?: (value: CAreaChartSeriesElementEventMap['drillingChanged']) => void;
    onlineTypeChanged?: (value: CAreaChartSeriesElementEventMap['lineTypeChanged']) => void;
    onmarkerColorChanged?: (value: CAreaChartSeriesElementEventMap['markerColorChanged']) => void;
    onmarkerDisplayedChanged?: (value: CAreaChartSeriesElementEventMap['markerDisplayedChanged']) => void;
    onmarkerShapeChanged?: (value: CAreaChartSeriesElementEventMap['markerShapeChanged']) => void;
    onmarkerSizeChanged?: (value: CAreaChartSeriesElementEventMap['markerSizeChanged']) => void;
    onnameChanged?: (value: CAreaChartSeriesElementEventMap['nameChanged']) => void;
    onshortDescChanged?: (value: CAreaChartSeriesElementEventMap['shortDescChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-area-chart-series': AreaChartSeriesIntrinsicProps;
        }
    }
}
