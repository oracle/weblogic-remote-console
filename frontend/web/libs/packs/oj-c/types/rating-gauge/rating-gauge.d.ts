/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { RatingGauge as PreactRatingGauge } from '@oracle/oraclejet-preact/UNSAFE_RatingGauge';
import { ComponentProps } from 'preact';
import { ObservedGlobalProps, ReadOnlyPropertyChanged, PropertyChanged } from 'ojs/ojvcomponent';
import 'css!oj-c/rating-gauge/rating-gauge-styles.css';
import { Threshold } from '../utils/UNSAFE_vizTypes';
type PreactRatingGaugeProps = ComponentProps<typeof PreactRatingGauge>;
/**
 * Context for datatip function.
 */
type DatatipContext = {
    /**
     * The value of the currently active rating gauge item.
     */
    value: number;
};
/**
 * This export corresponds to the RatingGauge Preact component. For the oj-c-rating-gauge custom element, import CRatingGaugeElement instead.
 */
export declare const RatingGauge: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<ObservedGlobalProps<"aria-describedby" | "aria-label" | "aria-labelledby"> & {
    /**
     * @description
     * Integer value specifying the maximum value of the gauge, which determines the number of items that are displayed.
     * @ojmetadata description "The maximum value of the gauge."
     * @ojmetadata displayName "Max"
     * @ojmetadata help "#max"
     * @ojmetadata minimum 0
     */
    max?: number;
    /**
     * @description
     * Defines whether the value of the gauge can be changed by the end user.
     * @ojmetadata help "#readonly"
     * @ojmetadata displayName "Readonly"
     */
    readonly?: boolean;
    /**
     * @description
     * Defines whether the gauge is disabled or not. User interaction is prevented and the rating gauge is hidden from screen readers if set to true.
     * @ojmetadata help "#disabled"
     * @ojmetadata displayName "Disabled"
     */
    disabled?: boolean;
    /**
     * @ojmetadata description 'Whether there has been a value entered by the user even if it is the same as the initial value.'
     * @ojmetadata displayName 'Changed'
     * @ojmetadata help '#changed'
     */
    changed?: boolean;
    /**
     * @ojmetadata description Writeback support for the changed property
     * @ojmetadata displayName "Changed"
     * @ojmetadata help "#changed"
     */
    onChangedChanged?: PropertyChanged<boolean>;
    /**
     * @description
     * The value of the Rating Gauge. The element's value attribute is used if it
     * is provided, otherwise the default value of 0 is used.
     * Any other negative value will default to 0.
     *
     * @ojmetadata description "The value of the Rating Gauge."
     * @ojmetadata displayName "Value"
     * @ojmetadata help "#value"
     * @ojmetadata minimum 0
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
     * Specifies the increment by which values can be changed by the end user.
     * @ojmetadata displayName "Step"
     * @ojmetadata help "#step"
     */
    step?: number;
    /**
     * @description
     * Used to establish a relationship between this component and another element.
     * A common use is to tie a label, which can be a text in a div or some other HTML element, and the oj-c-rating-gauge together for accessibility.
     * The oj-label element has a label-id, which is used by the described-by attribute to tie the two components together to facilitate correct screen reader behavior.
     * @ojmetadata displayName "Described By"
     * @ojmetadata help "#help"
     */
    describedBy?: string | null;
    /**
     * @description
     * Used to establish a relationship between this component and another element.
     * A common use is to tie a label, which can be a text in a div or some other HTML element, and the oj-c-rating-gauge together for accessibility.
     * The oj-label element has a label-id, which is used by the labelled-by attribute to tie the two components together to facilitate correct screen reader behavior.
     * @ojmetadata displayName "Labelled By"
     * @ojmetadata help "#labelledBy"
     */
    labelledBy?: string | null;
    /**
     * @description
     * Specifies the size of the individual rating gauge items.
     * @ojmetadata description "Specifies the size of the rating gauge items."
     * @ojmetadata displayName "Size"
     * @ojmetadata help "#size"
     * @ojmetadata propertyEditorValues {
     *     "sm": {
     *       "description": "small Rating Gauge",
     *       "displayName": "Small"
     *     },
     *     "md": {
     *       "description": "medium Rating Gauge (default, if unspecified)",
     *       "displayName": "Medium"
     *     },
     *     "lg": {
     *       "description": "large Rating Gauge",
     *       "displayName": "Large"
     *     }
     *   }
     */
    size?: PreactRatingGaugeProps["size"];
    /**
     * @description
     * Specifies the color of the individual rating gauge items.
     * @ojmetadata description "Specifies the color of the rating gauge items."
     * @ojmetadata displayName "Color"
     * @ojmetadata help "#color"
     * @ojmetadata propertyEditorValues {
     *     "neutral": {
     *       "description": "neutral color Rating Gauge (default, if unspecified)",
     *       "displayName": "Neutral"
     *     },
     *     "gold": {
     *       "description": "gold color Rating Gauge",
     *       "displayName": "Gold"
     *     }
     *   }
     */
    color?: PreactRatingGaugeProps["color"];
    /**
     * @description
     * An array of objects defining the thresholds for the rating gauge.
     * @ojmetadata displayName "Thresholds"
     * @ojmetadata help "#thresholds"
     */
    thresholds?: Array<Threshold>;
    /**
     * @description
     * The rating gauge datatip string. Datatip is only used for interactive rating gauges.
     * @ojmetadata displayName "Datatip"
     * @ojmetadata help "#datatip"
     */
    datatip?: (context: DatatipContext) => string;
    /**
     * @description
     * The rating gauge tooltip. Tooltip is only used for read only rating gauges. If aria-label is not specified, tooltip will be used as the aria-label.
     * @ojmetadata displayName "Tooltip"
     * @ojmetadata help "#tooltip"
     */
    tooltip?: string;
    /**
     * @description
     * A read-only property for retrieving the transient value from the rating gauge. It is updated upon user gestures that cause transient value changes, such as hovering over the rating gauge.
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
 * This export corresponds to the oj-c-rating-gauge custom element. For the RatingGauge Preact component, import RatingGauge instead.
 */
export interface CRatingGaugeElement extends JetElement<CRatingGaugeElementSettableProperties>, CRatingGaugeElementSettableProperties {
    /**
     * A read-only property for retrieving the transient value from the rating gauge. It is updated upon user gestures that cause transient value changes, such as hovering over the rating gauge.
     */
    readonly transientValue?: Parameters<Required<ComponentProps<typeof RatingGauge>>['onTransientValueChanged']>[0];
    addEventListener<T extends keyof CRatingGaugeElementEventMap>(type: T, listener: (this: HTMLElement, ev: CRatingGaugeElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CRatingGaugeElementSettableProperties>(property: T): CRatingGaugeElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CRatingGaugeElementSettableProperties>(property: T, value: CRatingGaugeElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CRatingGaugeElementSettableProperties>): void;
    setProperties(properties: CRatingGaugeElementSettablePropertiesLenient): void;
}
export namespace CRatingGaugeElement {
    type changedChanged = JetElementCustomEventStrict<CRatingGaugeElement['changed']>;
    type colorChanged = JetElementCustomEventStrict<CRatingGaugeElement['color']>;
    type datatipChanged = JetElementCustomEventStrict<CRatingGaugeElement['datatip']>;
    type describedByChanged = JetElementCustomEventStrict<CRatingGaugeElement['describedBy']>;
    type disabledChanged = JetElementCustomEventStrict<CRatingGaugeElement['disabled']>;
    type labelledByChanged = JetElementCustomEventStrict<CRatingGaugeElement['labelledBy']>;
    type maxChanged = JetElementCustomEventStrict<CRatingGaugeElement['max']>;
    type readonlyChanged = JetElementCustomEventStrict<CRatingGaugeElement['readonly']>;
    type sizeChanged = JetElementCustomEventStrict<CRatingGaugeElement['size']>;
    type stepChanged = JetElementCustomEventStrict<CRatingGaugeElement['step']>;
    type thresholdsChanged = JetElementCustomEventStrict<CRatingGaugeElement['thresholds']>;
    type tooltipChanged = JetElementCustomEventStrict<CRatingGaugeElement['tooltip']>;
    type transientValueChanged = JetElementCustomEventStrict<CRatingGaugeElement['transientValue']>;
    type valueChanged = JetElementCustomEventStrict<CRatingGaugeElement['value']>;
}
export interface CRatingGaugeElementEventMap extends HTMLElementEventMap {
    'changedChanged': JetElementCustomEventStrict<CRatingGaugeElement['changed']>;
    'colorChanged': JetElementCustomEventStrict<CRatingGaugeElement['color']>;
    'datatipChanged': JetElementCustomEventStrict<CRatingGaugeElement['datatip']>;
    'describedByChanged': JetElementCustomEventStrict<CRatingGaugeElement['describedBy']>;
    'disabledChanged': JetElementCustomEventStrict<CRatingGaugeElement['disabled']>;
    'labelledByChanged': JetElementCustomEventStrict<CRatingGaugeElement['labelledBy']>;
    'maxChanged': JetElementCustomEventStrict<CRatingGaugeElement['max']>;
    'readonlyChanged': JetElementCustomEventStrict<CRatingGaugeElement['readonly']>;
    'sizeChanged': JetElementCustomEventStrict<CRatingGaugeElement['size']>;
    'stepChanged': JetElementCustomEventStrict<CRatingGaugeElement['step']>;
    'thresholdsChanged': JetElementCustomEventStrict<CRatingGaugeElement['thresholds']>;
    'tooltipChanged': JetElementCustomEventStrict<CRatingGaugeElement['tooltip']>;
    'transientValueChanged': JetElementCustomEventStrict<CRatingGaugeElement['transientValue']>;
    'valueChanged': JetElementCustomEventStrict<CRatingGaugeElement['value']>;
}
export interface CRatingGaugeElementSettableProperties extends JetSettableProperties {
    changed?: ComponentProps<typeof RatingGauge>['changed'];
    /**
     * Specifies the color of the individual rating gauge items.
     */
    color?: ComponentProps<typeof RatingGauge>['color'];
    /**
     * The rating gauge datatip string. Datatip is only used for interactive rating gauges.
     */
    datatip?: ComponentProps<typeof RatingGauge>['datatip'];
    /**
     * Used to establish a relationship between this component and another element.
     * A common use is to tie a label, which can be a text in a div or some other HTML element, and the oj-c-rating-gauge together for accessibility.
     * The oj-label element has a label-id, which is used by the described-by attribute to tie the two components together to facilitate correct screen reader behavior.
     */
    describedBy?: ComponentProps<typeof RatingGauge>['describedBy'];
    /**
     * Defines whether the gauge is disabled or not. User interaction is prevented and the rating gauge is hidden from screen readers if set to true.
     */
    disabled?: ComponentProps<typeof RatingGauge>['disabled'];
    /**
     * Used to establish a relationship between this component and another element.
     * A common use is to tie a label, which can be a text in a div or some other HTML element, and the oj-c-rating-gauge together for accessibility.
     * The oj-label element has a label-id, which is used by the labelled-by attribute to tie the two components together to facilitate correct screen reader behavior.
     */
    labelledBy?: ComponentProps<typeof RatingGauge>['labelledBy'];
    /**
     * Integer value specifying the maximum value of the gauge, which determines the number of items that are displayed.
     */
    max?: ComponentProps<typeof RatingGauge>['max'];
    /**
     * Defines whether the value of the gauge can be changed by the end user.
     */
    readonly?: ComponentProps<typeof RatingGauge>['readonly'];
    /**
     * Specifies the size of the individual rating gauge items.
     */
    size?: ComponentProps<typeof RatingGauge>['size'];
    /**
     * Specifies the increment by which values can be changed by the end user.
     */
    step?: ComponentProps<typeof RatingGauge>['step'];
    /**
     * An array of objects defining the thresholds for the rating gauge.
     */
    thresholds?: ComponentProps<typeof RatingGauge>['thresholds'];
    /**
     * The rating gauge tooltip. Tooltip is only used for read only rating gauges. If aria-label is not specified, tooltip will be used as the aria-label.
     */
    tooltip?: ComponentProps<typeof RatingGauge>['tooltip'];
    /**
     * The value of the Rating Gauge. The element's value attribute is used if it
     * is provided, otherwise the default value of 0 is used.
     * Any other negative value will default to 0.
     */
    value?: ComponentProps<typeof RatingGauge>['value'];
}
export interface CRatingGaugeElementSettablePropertiesLenient extends Partial<CRatingGaugeElementSettableProperties> {
    [key: string]: any;
}
export interface RatingGaugeIntrinsicProps extends Partial<Readonly<CRatingGaugeElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    transientValue?: never;
    onchangedChanged?: (value: CRatingGaugeElementEventMap['changedChanged']) => void;
    oncolorChanged?: (value: CRatingGaugeElementEventMap['colorChanged']) => void;
    ondatatipChanged?: (value: CRatingGaugeElementEventMap['datatipChanged']) => void;
    ondescribedByChanged?: (value: CRatingGaugeElementEventMap['describedByChanged']) => void;
    ondisabledChanged?: (value: CRatingGaugeElementEventMap['disabledChanged']) => void;
    onlabelledByChanged?: (value: CRatingGaugeElementEventMap['labelledByChanged']) => void;
    onmaxChanged?: (value: CRatingGaugeElementEventMap['maxChanged']) => void;
    onreadonlyChanged?: (value: CRatingGaugeElementEventMap['readonlyChanged']) => void;
    onsizeChanged?: (value: CRatingGaugeElementEventMap['sizeChanged']) => void;
    onstepChanged?: (value: CRatingGaugeElementEventMap['stepChanged']) => void;
    onthresholdsChanged?: (value: CRatingGaugeElementEventMap['thresholdsChanged']) => void;
    ontooltipChanged?: (value: CRatingGaugeElementEventMap['tooltipChanged']) => void;
    ontransientValueChanged?: (value: CRatingGaugeElementEventMap['transientValueChanged']) => void;
    onvalueChanged?: (value: CRatingGaugeElementEventMap['valueChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-rating-gauge': RatingGaugeIntrinsicProps;
        }
    }
}
