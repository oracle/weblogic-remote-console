/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { MeterCircle as PreactMeterCircle, CenterContext } from '@oracle/oraclejet-preact/UNSAFE_MeterCircle';
import { ComponentProps } from 'preact';
import { ObservedGlobalProps, ReadOnlyPropertyChanged, PropertyChanged, TemplateSlot } from 'ojs/ojvcomponent';
import 'css!oj-c/meter-circle/meter-circle-styles.css';
import { ReferenceLine as CommonReferenceLine, Threshold } from '../utils/UNSAFE_vizTypes';
type ReferenceLine = Omit<CommonReferenceLine, 'position'>;
type PreactMeterCircleProps = ComponentProps<typeof PreactMeterCircle>;
type CenterTemplateContext = CenterContext & {
    /**
     * @description
     * The current value of the meter circle.
     */
    value: number | null;
};
type PlotArea = {
    /**
     * @description
     * The color of the plot area.
     * @ojmetadata format "color"
     */
    color?: PreactMeterCircleProps['trackColor'];
    /**
     * @description
     *  Defines if the plot area is to be rendered. The default value is on.
     */
    rendered?: 'on' | 'off';
};
/**
 * Context for datatip function.
 */
export type DatatipContext = {
    /**
     * @description
     * The current value of the meter circle.
     */
    value: number;
};
export type ThresholdDisplay = 'all' | 'plotArea' | 'indicator';
/**
 * This export corresponds to the MeterCircle Preact component. For the oj-c-meter-circle custom element, import CMeterCircleElement instead.
 */
export declare const MeterCircle: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<ObservedGlobalProps<"aria-describedby" | "aria-label" | "aria-labelledby"> & {
    /**
     * @description
     * Integer value specifying the maximum value of the meter circle.
     * @ojmetadata description "The maximum value of the meter circle."
     * @ojmetadata displayName "Max"
     * @ojmetadata help "#max"
     */
    max?: number;
    /**
     * @description
     * Integer value specifying the minimum value of the meter circle.
     * @ojmetadata description "The minimum value of the meter circle."
     * @ojmetadata displayName "Min"
     * @ojmetadata help "#min"
     */
    min?: number;
    /**
     * @description
     * Defines whether the value of the meter circle can be changed by the end user.
     * @ojmetadata help "#readonly"
     * @ojmetadata displayName "Readonly"
     */
    readonly?: boolean;
    /**
     * @description
     * The value of the meter circle.
     *
     * @ojmetadata description "The value of the meter circle."
     * @ojmetadata displayName "Value"
     * @ojmetadata help "#value"
     */
    value?: number | null;
    /**
     * @ojmetadata description Writeback support for the value property
     * @ojmetadata displayName "Value"
     * @ojmetadata help "#value"
     */
    onValueChanged?: PropertyChanged<number | null>;
    /**
     * @description
     * Specifies the increment by which values can be changed by the end user when readonly is false. The step must be a positive value that is smaller than the difference between the min and max.
     * @ojmetadata displayName "Step"
     * @ojmetadata help "#step"
     */
    step?: number;
    /**
     * @description
     * Specifies the color of the meter circle indicator. Only applies when thresholdDisplay is not set to indicator.
     * @ojmetadata displayName "Color"
     * @ojmetadata help "#color"
     * @ojmetadata format "color"
     * @ojmetadata status [
     *   {
     *     "type": "antiPattern",
     *     "since": "16.0.0",
     *     "themes": ["Redwood"]
     *   }
     * ]
     */
    color?: PreactMeterCircleProps["indicatorColor"];
    /**
     * @description
     * Specifies the ratio of relative thickness of the indicator to the plot area.
     * @ojmetadata displayName "Indicator Size"
     * @ojmetadata help "#indicatorSize"
     * @ojmetadata status [
     *   {
     *     "type": "antiPattern",
     *     "since": "16.0.0",
     *     "themes": ["Redwood"]
     *   }
     * ]
     */
    indicatorSize?: number;
    /**
     * @description
     * Specifies the inner radius, defined by the ratio of the distance from the center of the gauge to the innermost edge of the indicator to plot area. Valid values are ratios from 0 to 1. Depends on the size of the gauge and theme.
     * @ojmetadata displayName "Inner Radius"
     * @ojmetadata help "innerRadius"
     * @ojmetadata status [
     *   {
     *     "type": "antiPattern",
     *     "since": "16.0.0",
     *     "themes": ["Redwood"]
     *   }
     * ]
     */
    innerRadius?: number | undefined;
    /**
     * @description
     * Specifies the plot area of the meter circle.
     * @ojmetadata displayName "Plot Area"
     * @ojmetadata help "#plotArea"
     */
    plotArea: PlotArea;
    /**
     * @description
     * Specifies the angle extent of a meter circle. Value should be provided in degrees.
     * @ojmetadata displayName "Angle Extent"
     * @ojmetadata help "#angleExtent"
     */
    angleExtent?: PreactMeterCircleProps["angleExtent"];
    /**
     * @description
     * Specifies the start angle of the plot area relative to the positive x axis. Value should be provided in degrees.
     * @ojmetadata displayName "Start Angle"
     * @ojmetadata help "#startAngle"
     */
    startAngle?: PreactMeterCircleProps["startAngle"];
    /**
     * @description
     * Specifies the array of objects defining the reference lines for the meter circle.
     * @ojmetadata displayName "Reference Lines"
     * @ojmetadata help "#referenceLines"
     */
    referenceLines?: Array<ReferenceLine>;
    /**
     * @description
     * Controls whether the current threshold is displayed on the indicator, in the plot area, or if all the thresholds are displayed in the plot area.
     * @ojmetadata displayName "Threshold Display"
     * @ojmetadata help "#thresholdDisplay"
     */
    thresholdDisplay?: ThresholdDisplay;
    /**
     * @description
     * An array of objects defining the thresholds for the meter circle.
     * @ojmetadata displayName "Thresholds"
     * @ojmetadata help "#thresholds"
     */
    thresholds?: Array<Threshold>;
    /**
     * @description
     * Used to establish a relationship between this component and another element.
     * A common use is to tie a label, which can be a text in a div or some other HTML element, and the oj-c-meter-circle together for accessibility.
     * The oj-label element has a label-id, which is used by the described-by attribute to tie the two components together to facilitate correct screen reader behavior.
     * @ojmetadata displayName "Described By"
     * @ojmetadata help "#describedBy"
     */
    describedBy?: string | null;
    /**
     * @description
     * Used to establish a relationship between this component and another element.
     * A common use is to tie a label, which can be a text in a div or some other HTML element, and the oj-c-meter-circle together for accessibility.
     * The oj-label element has a label-id, which is used by the labelled-by attribute to tie the two components together to facilitate correct screen reader behavior.
     * @ojmetadata displayName "Labelled By"
     * @ojmetadata help "#labelledBy"
     */
    labelledBy?: string | null;
    /**
     * @description
     * Specifies the size of the meter var.
     * @ojmetadata description "Specifies the size of the meter circle."
     * @ojmetadata displayName "Size"
     * @ojmetadata help "#size"
     * @ojmetadata propertyEditorValues {
     *     "sm": {
     *       "description": "small Meter circle",
     *       "displayName": "Small"
     *     },
     *     "md": {
     *       "description": "medium Meter circle (default, if unspecified)",
     *       "displayName": "Medium"
     *     },
     *     "lg": {
     *       "description": "large Meter circle",
     *       "displayName": "Large"
     *     },
     *     "fit": {
     *       "description": "Meter Circle that fills available width and height.",
     *       "displayName": "Fit"
     *     }
     *   }
     */
    size?: PreactMeterCircleProps["size"];
    /**
     * @description
     * The function that returns a custom datatip string for given value of meter circle. The function is called with DatatipContext as context. If datatip is undefined,
     * meter circle will use the default datatip. If the returned value of the function is null, no datatip is shown.
     * @ojmetadata displayName "Datatip"
     * @ojmetadata help "#datatip"
     */
    datatip?: (context: DatatipContext) => string | null;
    /**
     * @description
     * A read-only property for retrieving the transient value from the meter circle. It is triggered when dragging over the meter circle.
     * @ojmetadata displayName "transientValue"
     * @ojmetadata help "#transientValue"
     */
    onTransientValueChanged?: ReadOnlyPropertyChanged<number | undefined>;
    /**
     * @example
     * <caption>Initialize the Meter Circle with a center template specified:</caption>
     * &lt;oj-c-meter-circle>
     *  &lt;template slot="centerTemplate">
     *    &lt;div :style="[[{position: 'absolute',
     *                       top: $current.innerBounds.y + 'px',
     *                       left: $current.innerBounds.x + 'px',
     *                       height: $current.innerBounds.height + 'px',
     *                       width: $current.innerBounds.width + 'px'}]]">
     *      &lt;span class="metric">&lt;oj-bind-text value="[[$current.value]]">&lt;/oj-bind-text>&lt;/span>
     *    &lt;/div>
     *  &lt;/template>
     * &lt;/oj-c-center-template>
     * @description
     * The centerTemplate slot is used to specify center content. When the template is executed, the component's binding context is extended with the following properties:
     */
    centerTemplate?: TemplateSlot<CenterTemplateContext>;
}>>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-meter-circle custom element. For the MeterCircle Preact component, import MeterCircle instead.
 */
export interface CMeterCircleElement extends JetElement<CMeterCircleElementSettableProperties>, CMeterCircleElementSettableProperties {
    /**
     * A read-only property for retrieving the transient value from the meter circle. It is triggered when dragging over the meter circle.
     */
    readonly transientValue?: Parameters<Required<ComponentProps<typeof MeterCircle>>['onTransientValueChanged']>[0];
    addEventListener<T extends keyof CMeterCircleElementEventMap>(type: T, listener: (this: HTMLElement, ev: CMeterCircleElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CMeterCircleElementSettableProperties>(property: T): CMeterCircleElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CMeterCircleElementSettableProperties>(property: T, value: CMeterCircleElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CMeterCircleElementSettableProperties>): void;
    setProperties(properties: CMeterCircleElementSettablePropertiesLenient): void;
}
declare namespace _CMeterCircleElementTypes {
    type _CenterTemplateContext = CenterTemplateContext;
}
export namespace CMeterCircleElement {
    type angleExtentChanged = JetElementCustomEventStrict<CMeterCircleElement['angleExtent']>;
    type colorChanged = JetElementCustomEventStrict<CMeterCircleElement['color']>;
    type datatipChanged = JetElementCustomEventStrict<CMeterCircleElement['datatip']>;
    type describedByChanged = JetElementCustomEventStrict<CMeterCircleElement['describedBy']>;
    type indicatorSizeChanged = JetElementCustomEventStrict<CMeterCircleElement['indicatorSize']>;
    type innerRadiusChanged = JetElementCustomEventStrict<CMeterCircleElement['innerRadius']>;
    type labelledByChanged = JetElementCustomEventStrict<CMeterCircleElement['labelledBy']>;
    type maxChanged = JetElementCustomEventStrict<CMeterCircleElement['max']>;
    type minChanged = JetElementCustomEventStrict<CMeterCircleElement['min']>;
    type plotAreaChanged = JetElementCustomEventStrict<CMeterCircleElement['plotArea']>;
    type readonlyChanged = JetElementCustomEventStrict<CMeterCircleElement['readonly']>;
    type referenceLinesChanged = JetElementCustomEventStrict<CMeterCircleElement['referenceLines']>;
    type sizeChanged = JetElementCustomEventStrict<CMeterCircleElement['size']>;
    type startAngleChanged = JetElementCustomEventStrict<CMeterCircleElement['startAngle']>;
    type stepChanged = JetElementCustomEventStrict<CMeterCircleElement['step']>;
    type thresholdDisplayChanged = JetElementCustomEventStrict<CMeterCircleElement['thresholdDisplay']>;
    type thresholdsChanged = JetElementCustomEventStrict<CMeterCircleElement['thresholds']>;
    type transientValueChanged = JetElementCustomEventStrict<CMeterCircleElement['transientValue']>;
    type valueChanged = JetElementCustomEventStrict<CMeterCircleElement['value']>;
    type CenterTemplateContext = _CMeterCircleElementTypes._CenterTemplateContext;
    type RenderCenterTemplate = import('ojs/ojvcomponent').TemplateSlot<CenterTemplateContext>;
}
export interface CMeterCircleElementEventMap extends HTMLElementEventMap {
    'angleExtentChanged': JetElementCustomEventStrict<CMeterCircleElement['angleExtent']>;
    'colorChanged': JetElementCustomEventStrict<CMeterCircleElement['color']>;
    'datatipChanged': JetElementCustomEventStrict<CMeterCircleElement['datatip']>;
    'describedByChanged': JetElementCustomEventStrict<CMeterCircleElement['describedBy']>;
    'indicatorSizeChanged': JetElementCustomEventStrict<CMeterCircleElement['indicatorSize']>;
    'innerRadiusChanged': JetElementCustomEventStrict<CMeterCircleElement['innerRadius']>;
    'labelledByChanged': JetElementCustomEventStrict<CMeterCircleElement['labelledBy']>;
    'maxChanged': JetElementCustomEventStrict<CMeterCircleElement['max']>;
    'minChanged': JetElementCustomEventStrict<CMeterCircleElement['min']>;
    'plotAreaChanged': JetElementCustomEventStrict<CMeterCircleElement['plotArea']>;
    'readonlyChanged': JetElementCustomEventStrict<CMeterCircleElement['readonly']>;
    'referenceLinesChanged': JetElementCustomEventStrict<CMeterCircleElement['referenceLines']>;
    'sizeChanged': JetElementCustomEventStrict<CMeterCircleElement['size']>;
    'startAngleChanged': JetElementCustomEventStrict<CMeterCircleElement['startAngle']>;
    'stepChanged': JetElementCustomEventStrict<CMeterCircleElement['step']>;
    'thresholdDisplayChanged': JetElementCustomEventStrict<CMeterCircleElement['thresholdDisplay']>;
    'thresholdsChanged': JetElementCustomEventStrict<CMeterCircleElement['thresholds']>;
    'transientValueChanged': JetElementCustomEventStrict<CMeterCircleElement['transientValue']>;
    'valueChanged': JetElementCustomEventStrict<CMeterCircleElement['value']>;
}
export interface CMeterCircleElementSettableProperties extends JetSettableProperties {
    /**
     * Specifies the angle extent of a meter circle. Value should be provided in degrees.
     */
    angleExtent?: ComponentProps<typeof MeterCircle>['angleExtent'];
    /**
     * Specifies the color of the meter circle indicator. Only applies when thresholdDisplay is not set to indicator.
     */
    color?: ComponentProps<typeof MeterCircle>['color'];
    /**
     * The function that returns a custom datatip string for given value of meter circle. The function is called with DatatipContext as context. If datatip is undefined,
     * meter circle will use the default datatip. If the returned value of the function is null, no datatip is shown.
     */
    datatip?: ComponentProps<typeof MeterCircle>['datatip'];
    /**
     * Used to establish a relationship between this component and another element.
     * A common use is to tie a label, which can be a text in a div or some other HTML element, and the oj-c-meter-circle together for accessibility.
     * The oj-label element has a label-id, which is used by the described-by attribute to tie the two components together to facilitate correct screen reader behavior.
     */
    describedBy?: ComponentProps<typeof MeterCircle>['describedBy'];
    /**
     * Specifies the ratio of relative thickness of the indicator to the plot area.
     */
    indicatorSize?: ComponentProps<typeof MeterCircle>['indicatorSize'];
    /**
     * Specifies the inner radius, defined by the ratio of the distance from the center of the gauge to the innermost edge of the indicator to plot area. Valid values are ratios from 0 to 1. Depends on the size of the gauge and theme.
     */
    innerRadius?: ComponentProps<typeof MeterCircle>['innerRadius'];
    /**
     * Used to establish a relationship between this component and another element.
     * A common use is to tie a label, which can be a text in a div or some other HTML element, and the oj-c-meter-circle together for accessibility.
     * The oj-label element has a label-id, which is used by the labelled-by attribute to tie the two components together to facilitate correct screen reader behavior.
     */
    labelledBy?: ComponentProps<typeof MeterCircle>['labelledBy'];
    /**
     * Integer value specifying the maximum value of the meter circle.
     */
    max?: ComponentProps<typeof MeterCircle>['max'];
    /**
     * Integer value specifying the minimum value of the meter circle.
     */
    min?: ComponentProps<typeof MeterCircle>['min'];
    /**
     * Specifies the plot area of the meter circle.
     */
    plotArea: ComponentProps<typeof MeterCircle>['plotArea'];
    /**
     * Defines whether the value of the meter circle can be changed by the end user.
     */
    readonly?: ComponentProps<typeof MeterCircle>['readonly'];
    /**
     * Specifies the array of objects defining the reference lines for the meter circle.
     */
    referenceLines?: ComponentProps<typeof MeterCircle>['referenceLines'];
    /**
     * Specifies the size of the meter var.
     */
    size?: ComponentProps<typeof MeterCircle>['size'];
    /**
     * Specifies the start angle of the plot area relative to the positive x axis. Value should be provided in degrees.
     */
    startAngle?: ComponentProps<typeof MeterCircle>['startAngle'];
    /**
     * Specifies the increment by which values can be changed by the end user when readonly is false. The step must be a positive value that is smaller than the difference between the min and max.
     */
    step?: ComponentProps<typeof MeterCircle>['step'];
    /**
     * Controls whether the current threshold is displayed on the indicator, in the plot area, or if all the thresholds are displayed in the plot area.
     */
    thresholdDisplay?: ComponentProps<typeof MeterCircle>['thresholdDisplay'];
    /**
     * An array of objects defining the thresholds for the meter circle.
     */
    thresholds?: ComponentProps<typeof MeterCircle>['thresholds'];
    /**
     * The value of the meter circle.
     */
    value?: ComponentProps<typeof MeterCircle>['value'];
}
export interface CMeterCircleElementSettablePropertiesLenient extends Partial<CMeterCircleElementSettableProperties> {
    [key: string]: any;
}
export interface MeterCircleIntrinsicProps extends Partial<Readonly<CMeterCircleElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    transientValue?: never;
    children?: import('preact').ComponentChildren;
    onangleExtentChanged?: (value: CMeterCircleElementEventMap['angleExtentChanged']) => void;
    oncolorChanged?: (value: CMeterCircleElementEventMap['colorChanged']) => void;
    ondatatipChanged?: (value: CMeterCircleElementEventMap['datatipChanged']) => void;
    ondescribedByChanged?: (value: CMeterCircleElementEventMap['describedByChanged']) => void;
    onindicatorSizeChanged?: (value: CMeterCircleElementEventMap['indicatorSizeChanged']) => void;
    oninnerRadiusChanged?: (value: CMeterCircleElementEventMap['innerRadiusChanged']) => void;
    onlabelledByChanged?: (value: CMeterCircleElementEventMap['labelledByChanged']) => void;
    onmaxChanged?: (value: CMeterCircleElementEventMap['maxChanged']) => void;
    onminChanged?: (value: CMeterCircleElementEventMap['minChanged']) => void;
    onplotAreaChanged?: (value: CMeterCircleElementEventMap['plotAreaChanged']) => void;
    onreadonlyChanged?: (value: CMeterCircleElementEventMap['readonlyChanged']) => void;
    onreferenceLinesChanged?: (value: CMeterCircleElementEventMap['referenceLinesChanged']) => void;
    onsizeChanged?: (value: CMeterCircleElementEventMap['sizeChanged']) => void;
    onstartAngleChanged?: (value: CMeterCircleElementEventMap['startAngleChanged']) => void;
    onstepChanged?: (value: CMeterCircleElementEventMap['stepChanged']) => void;
    onthresholdDisplayChanged?: (value: CMeterCircleElementEventMap['thresholdDisplayChanged']) => void;
    onthresholdsChanged?: (value: CMeterCircleElementEventMap['thresholdsChanged']) => void;
    ontransientValueChanged?: (value: CMeterCircleElementEventMap['transientValueChanged']) => void;
    onvalueChanged?: (value: CMeterCircleElementEventMap['valueChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-meter-circle': MeterCircleIntrinsicProps;
        }
    }
}
