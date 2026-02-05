/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { MeterBar as PreactMeterBar } from '@oracle/oraclejet-preact/UNSAFE_MeterBar';
import { ComponentProps } from 'preact';
import { ObservedGlobalProps, ReadOnlyPropertyChanged, PropertyChanged } from 'ojs/ojvcomponent';
import 'css!oj-c/meter-bar/meter-bar-styles.css';
import { ReferenceLine, Threshold } from '../utils/UNSAFE_vizTypes';
type PreactMeterBarProps = ComponentProps<typeof PreactMeterBar>;
type PlotArea = {
    /**
     * @description
     * The color of the plot area.
     * @ojmetadata format "color"
     */
    color?: PreactMeterBarProps['trackColor'];
    /**
     * @description
     * Defines if the plot area is to be rendered. The default value is on.
     */
    rendered?: 'on' | 'off';
};
export type ThresholdDisplay = 'all' | 'plotArea' | 'indicator';
/**
 * Context for datatip function.
 */
type DatatipContext = {
    /**
     * @description
     * The current value of the meter bar.
     */
    value: number;
};
/**
 * This export corresponds to the MeterBar Preact component. For the oj-c-meter-bar custom element, import CMeterBarElement instead.
 */
export declare const MeterBar: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<ObservedGlobalProps<"aria-describedby" | "aria-label" | "aria-labelledby"> & {
    /**
     * @description
     * Integer value specifying the maximum value of the meter bar.
     * @ojmetadata description "The maximum value of the meter bar."
     * @ojmetadata displayName "Max"
     * @ojmetadata help "#max"
     */
    max?: number;
    /**
     * @description
     * Integer value specifying the minimum value of the meter bar.
     * @ojmetadata description "The minimum value of the meter bar."
     * @ojmetadata displayName "Min"
     * @ojmetadata help "#min"
     */
    min?: number;
    /**
     * @description
     * Defines whether the value of the meter bar can be changed by the end user.
     * @ojmetadata help "#readonly"
     * @ojmetadata displayName "Readonly"
     */
    readonly?: boolean;
    /**
     * @description
     * The value of the meter bar.
     *
     * @ojmetadata description "The value of the meter bar."
     * @ojmetadata displayName "Value"
     * @ojmetadata help "#value"
     */
    value?: number | null;
    /**
     * @description
     * Define the baseline value of the bar. If undefined, defaults to minimum value of the meter bar.
     * The baseline value must be between the min and max.
     * @ojmetadata description "Define the baseline value of the bar. If undefined, defaults to minimum value of the meter bar."
     * @ojmetadata displayName "Baseline"
     * @ojmetadata help "#baseline"
     */
    baseline?: number;
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
     * Specifies the color of the meter bar indicator. Only applies when thresholdDisplay is not set to indicator.
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
    color?: PreactMeterBarProps["indicatorColor"];
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
     * Specifies the plot area of the meter bar.
     * @ojmetadata displayName "Plot Area"
     * @ojmetadata help "#plotArea"
     */
    plotArea?: PlotArea;
    /**
     * @description
     * Specifies the orientation of the meter bar to render.
     * @ojmetadata displayName "Orientation"
     * @ojmetadata help "#orientation"
     */
    orientation?: PreactMeterBarProps["orientation"];
    /**
     * @description
     * Specifies the array of objects defining the reference lines for the meter bar.
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
     * An array of objects defining the thresholds for the meter bar.
     * @ojmetadata displayName "Thresholds"
     * @ojmetadata help "#thresholds"
     */
    thresholds?: Array<Threshold>;
    /**
     * @description
     * Used to establish a relationship between this component and another element.
     * A common use is to tie a label, which can be a text in a div or some other HTML element, and the oj-c-meter-bar together for accessibility.
     * The oj-label element has a label-id, which is used by the described-by attribute to tie the two components together to facilitate correct screen reader behavior.
     * @ojmetadata displayName "Described By"
     * @ojmetadata help "#describedBy"
     */
    describedBy?: string | null;
    /**
     * @description
     * Used to establish a relationship between this component and another element.
     * A common use is to tie a label, which can be a text in a div or some other HTML element, and the oj-c-meter-bar together for accessibility.
     * The oj-label element has a label-id, which is used by the labelled-by attribute to tie the two components together to facilitate correct screen reader behavior.
     * @ojmetadata displayName "Labelled By"
     * @ojmetadata help "#labelledBy"
     */
    labelledBy?: string | null;
    /**
     * @description
     * Specifies the size of the meter bar.
     * @ojmetadata description "Specifies the size of the meter bar."
     * @ojmetadata displayName "Size"
     * @ojmetadata help "#size"
     * @ojmetadata propertyEditorValues {
     *     "sm": {
     *       "description": "small Meter Bar",
     *       "displayName": "Small"
     *     },
     *     "md": {
     *       "description": "medium Meter Bar (default, if unspecified)",
     *       "displayName": "Medium"
     *     },
     *     "lg": {
     *       "description": "large Meter Bar",
     *       "displayName": "Large"
     *     },
     *     "fit": {
     *       "description": "Meter Bar that fits the available space",
     *       "displayName": "Fit"
     *     }
     *   }
     */
    size?: PreactMeterBarProps["size"];
    /**
     * @description
     * The function that returns a custom datatip string for given value of meter bar. The function is called with DatatipContext as context. If datatip is undefined,
     * meter bar will use the default datatip. If the returned value of the function is null, no datatip is shown.
     * @ojmetadata displayName "Datatip"
     * @ojmetadata help "#datatip"
     */
    datatip?: (context: DatatipContext) => string | null;
    /**
     * @description
     * A read-only property for retrieving the transient value from the meter bar. It is triggered when dragging over the meter bar.
     * @ojmetadata displayName "transientValue"
     * @ojmetadata help "#transientValue"
     */
    onTransientValueChanged?: ReadOnlyPropertyChanged<number | undefined>;
}>>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-meter-bar custom element. For the MeterBar Preact component, import MeterBar instead.
 */
export interface CMeterBarElement extends JetElement<CMeterBarElementSettableProperties>, CMeterBarElementSettableProperties {
    /**
     * A read-only property for retrieving the transient value from the meter bar. It is triggered when dragging over the meter bar.
     */
    readonly transientValue?: Parameters<Required<ComponentProps<typeof MeterBar>>['onTransientValueChanged']>[0];
    addEventListener<T extends keyof CMeterBarElementEventMap>(type: T, listener: (this: HTMLElement, ev: CMeterBarElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CMeterBarElementSettableProperties>(property: T): CMeterBarElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CMeterBarElementSettableProperties>(property: T, value: CMeterBarElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CMeterBarElementSettableProperties>): void;
    setProperties(properties: CMeterBarElementSettablePropertiesLenient): void;
}
export namespace CMeterBarElement {
    type baselineChanged = JetElementCustomEventStrict<CMeterBarElement['baseline']>;
    type colorChanged = JetElementCustomEventStrict<CMeterBarElement['color']>;
    type datatipChanged = JetElementCustomEventStrict<CMeterBarElement['datatip']>;
    type describedByChanged = JetElementCustomEventStrict<CMeterBarElement['describedBy']>;
    type indicatorSizeChanged = JetElementCustomEventStrict<CMeterBarElement['indicatorSize']>;
    type labelledByChanged = JetElementCustomEventStrict<CMeterBarElement['labelledBy']>;
    type maxChanged = JetElementCustomEventStrict<CMeterBarElement['max']>;
    type minChanged = JetElementCustomEventStrict<CMeterBarElement['min']>;
    type orientationChanged = JetElementCustomEventStrict<CMeterBarElement['orientation']>;
    type plotAreaChanged = JetElementCustomEventStrict<CMeterBarElement['plotArea']>;
    type readonlyChanged = JetElementCustomEventStrict<CMeterBarElement['readonly']>;
    type referenceLinesChanged = JetElementCustomEventStrict<CMeterBarElement['referenceLines']>;
    type sizeChanged = JetElementCustomEventStrict<CMeterBarElement['size']>;
    type stepChanged = JetElementCustomEventStrict<CMeterBarElement['step']>;
    type thresholdDisplayChanged = JetElementCustomEventStrict<CMeterBarElement['thresholdDisplay']>;
    type thresholdsChanged = JetElementCustomEventStrict<CMeterBarElement['thresholds']>;
    type transientValueChanged = JetElementCustomEventStrict<CMeterBarElement['transientValue']>;
    type valueChanged = JetElementCustomEventStrict<CMeterBarElement['value']>;
}
export interface CMeterBarElementEventMap extends HTMLElementEventMap {
    'baselineChanged': JetElementCustomEventStrict<CMeterBarElement['baseline']>;
    'colorChanged': JetElementCustomEventStrict<CMeterBarElement['color']>;
    'datatipChanged': JetElementCustomEventStrict<CMeterBarElement['datatip']>;
    'describedByChanged': JetElementCustomEventStrict<CMeterBarElement['describedBy']>;
    'indicatorSizeChanged': JetElementCustomEventStrict<CMeterBarElement['indicatorSize']>;
    'labelledByChanged': JetElementCustomEventStrict<CMeterBarElement['labelledBy']>;
    'maxChanged': JetElementCustomEventStrict<CMeterBarElement['max']>;
    'minChanged': JetElementCustomEventStrict<CMeterBarElement['min']>;
    'orientationChanged': JetElementCustomEventStrict<CMeterBarElement['orientation']>;
    'plotAreaChanged': JetElementCustomEventStrict<CMeterBarElement['plotArea']>;
    'readonlyChanged': JetElementCustomEventStrict<CMeterBarElement['readonly']>;
    'referenceLinesChanged': JetElementCustomEventStrict<CMeterBarElement['referenceLines']>;
    'sizeChanged': JetElementCustomEventStrict<CMeterBarElement['size']>;
    'stepChanged': JetElementCustomEventStrict<CMeterBarElement['step']>;
    'thresholdDisplayChanged': JetElementCustomEventStrict<CMeterBarElement['thresholdDisplay']>;
    'thresholdsChanged': JetElementCustomEventStrict<CMeterBarElement['thresholds']>;
    'transientValueChanged': JetElementCustomEventStrict<CMeterBarElement['transientValue']>;
    'valueChanged': JetElementCustomEventStrict<CMeterBarElement['value']>;
}
export interface CMeterBarElementSettableProperties extends JetSettableProperties {
    /**
     * Define the baseline value of the bar. If undefined, defaults to minimum value of the meter bar.
     * The baseline value must be between the min and max.
     */
    baseline?: ComponentProps<typeof MeterBar>['baseline'];
    /**
     * Specifies the color of the meter bar indicator. Only applies when thresholdDisplay is not set to indicator.
     */
    color?: ComponentProps<typeof MeterBar>['color'];
    /**
     * The function that returns a custom datatip string for given value of meter bar. The function is called with DatatipContext as context. If datatip is undefined,
     * meter bar will use the default datatip. If the returned value of the function is null, no datatip is shown.
     */
    datatip?: ComponentProps<typeof MeterBar>['datatip'];
    /**
     * Used to establish a relationship between this component and another element.
     * A common use is to tie a label, which can be a text in a div or some other HTML element, and the oj-c-meter-bar together for accessibility.
     * The oj-label element has a label-id, which is used by the described-by attribute to tie the two components together to facilitate correct screen reader behavior.
     */
    describedBy?: ComponentProps<typeof MeterBar>['describedBy'];
    /**
     * Specifies the ratio of relative thickness of the indicator to the plot area.
     */
    indicatorSize?: ComponentProps<typeof MeterBar>['indicatorSize'];
    /**
     * Used to establish a relationship between this component and another element.
     * A common use is to tie a label, which can be a text in a div or some other HTML element, and the oj-c-meter-bar together for accessibility.
     * The oj-label element has a label-id, which is used by the labelled-by attribute to tie the two components together to facilitate correct screen reader behavior.
     */
    labelledBy?: ComponentProps<typeof MeterBar>['labelledBy'];
    /**
     * Integer value specifying the maximum value of the meter bar.
     */
    max?: ComponentProps<typeof MeterBar>['max'];
    /**
     * Integer value specifying the minimum value of the meter bar.
     */
    min?: ComponentProps<typeof MeterBar>['min'];
    /**
     * Specifies the orientation of the meter bar to render.
     */
    orientation?: ComponentProps<typeof MeterBar>['orientation'];
    /**
     * Specifies the plot area of the meter bar.
     */
    plotArea?: ComponentProps<typeof MeterBar>['plotArea'];
    /**
     * Defines whether the value of the meter bar can be changed by the end user.
     */
    readonly?: ComponentProps<typeof MeterBar>['readonly'];
    /**
     * Specifies the array of objects defining the reference lines for the meter bar.
     */
    referenceLines?: ComponentProps<typeof MeterBar>['referenceLines'];
    /**
     * Specifies the size of the meter bar.
     */
    size?: ComponentProps<typeof MeterBar>['size'];
    /**
     * Specifies the increment by which values can be changed by the end user when readonly is false. The step must be a positive value that is smaller than the difference between the min and max.
     */
    step?: ComponentProps<typeof MeterBar>['step'];
    /**
     * Controls whether the current threshold is displayed on the indicator, in the plot area, or if all the thresholds are displayed in the plot area.
     */
    thresholdDisplay?: ComponentProps<typeof MeterBar>['thresholdDisplay'];
    /**
     * An array of objects defining the thresholds for the meter bar.
     */
    thresholds?: ComponentProps<typeof MeterBar>['thresholds'];
    /**
     * The value of the meter bar.
     */
    value?: ComponentProps<typeof MeterBar>['value'];
}
export interface CMeterBarElementSettablePropertiesLenient extends Partial<CMeterBarElementSettableProperties> {
    [key: string]: any;
}
export interface MeterBarIntrinsicProps extends Partial<Readonly<CMeterBarElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    transientValue?: never;
    onbaselineChanged?: (value: CMeterBarElementEventMap['baselineChanged']) => void;
    oncolorChanged?: (value: CMeterBarElementEventMap['colorChanged']) => void;
    ondatatipChanged?: (value: CMeterBarElementEventMap['datatipChanged']) => void;
    ondescribedByChanged?: (value: CMeterBarElementEventMap['describedByChanged']) => void;
    onindicatorSizeChanged?: (value: CMeterBarElementEventMap['indicatorSizeChanged']) => void;
    onlabelledByChanged?: (value: CMeterBarElementEventMap['labelledByChanged']) => void;
    onmaxChanged?: (value: CMeterBarElementEventMap['maxChanged']) => void;
    onminChanged?: (value: CMeterBarElementEventMap['minChanged']) => void;
    onorientationChanged?: (value: CMeterBarElementEventMap['orientationChanged']) => void;
    onplotAreaChanged?: (value: CMeterBarElementEventMap['plotAreaChanged']) => void;
    onreadonlyChanged?: (value: CMeterBarElementEventMap['readonlyChanged']) => void;
    onreferenceLinesChanged?: (value: CMeterBarElementEventMap['referenceLinesChanged']) => void;
    onsizeChanged?: (value: CMeterBarElementEventMap['sizeChanged']) => void;
    onstepChanged?: (value: CMeterBarElementEventMap['stepChanged']) => void;
    onthresholdDisplayChanged?: (value: CMeterBarElementEventMap['thresholdDisplayChanged']) => void;
    onthresholdsChanged?: (value: CMeterBarElementEventMap['thresholdsChanged']) => void;
    ontransientValueChanged?: (value: CMeterBarElementEventMap['transientValueChanged']) => void;
    onvalueChanged?: (value: CMeterBarElementEventMap['valueChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-meter-bar': MeterBarIntrinsicProps;
        }
    }
}
