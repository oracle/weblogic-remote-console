/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ProgressCircle as PreactProgressCircle } from '@oracle/oraclejet-preact/UNSAFE_ProgressCircle';
import { ComponentProps } from 'preact';
import { ObservedGlobalProps } from 'ojs/ojvcomponent';
import 'css!oj-c/progress-circle/progress-circle-styles.css';
type PreactProgressCircleProps = ComponentProps<typeof PreactProgressCircle>;
/**
 * This export corresponds to the ProgressCircle Preact component. For the oj-c-progress-circle custom element, import CProgressCircleElement instead.
 */
export declare const ProgressCircle: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<ObservedGlobalProps<"aria-label" | "aria-labelledby" | "aria-valuetext"> & {
    /**
     * @description
     * The maximum allowed value. The element's max attribute is used if it
     * is provided, otherwise the default value of 100 is used.
     * @ojmetadata description "The maximum allowed value."
     * @ojmetadata displayName "Max"
     * @ojmetadata help "#max"
     * @ojmetadata minimum 0
     */
    max?: number;
    /**
     * @description
     * The value of the Progress Circle. The element's value attribute is used if it
     * is provided, otherwise the default value of 0 is used. For indeterminate Progress, set value to -1.
     * Any other negative value will default to 0.
     *
     * @ojmetadata description "The value of the Progress Circle."
     * @ojmetadata displayName "Value"
     * @ojmetadata eventGroup "common"
     * @ojmetadata help "value"
     * @ojmetadata minimum -1
     */
    value?: number;
    /**
     * @ojmetadata description "Specifies the size of the progress circle."
     * @ojmetadata displayName "Size"
     * @ojmetadata help "#size"
     * @ojmetadata propertyEditorValues {
     *     "sm": {
     *       "description": "small progress circle",
     *       "displayName": "Small"
     *     },
     *     "md": {
     *       "description": "medium progress circle (default, if unspecified)",
     *       "displayName": "Medium"
     *     },
     *     "lg": {
     *       "description": "large progress circle",
     *       "displayName": "Large"
     *     }
     *   }
     */
    size?: PreactProgressCircleProps["size"];
}>>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-progress-circle custom element. For the ProgressCircle Preact component, import ProgressCircle instead.
 */
export interface CProgressCircleElement extends JetElement<CProgressCircleElementSettableProperties>, CProgressCircleElementSettableProperties {
    addEventListener<T extends keyof CProgressCircleElementEventMap>(type: T, listener: (this: HTMLElement, ev: CProgressCircleElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CProgressCircleElementSettableProperties>(property: T): CProgressCircleElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CProgressCircleElementSettableProperties>(property: T, value: CProgressCircleElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CProgressCircleElementSettableProperties>): void;
    setProperties(properties: CProgressCircleElementSettablePropertiesLenient): void;
}
export namespace CProgressCircleElement {
    type maxChanged = JetElementCustomEventStrict<CProgressCircleElement['max']>;
    type sizeChanged = JetElementCustomEventStrict<CProgressCircleElement['size']>;
    type valueChanged = JetElementCustomEventStrict<CProgressCircleElement['value']>;
}
export interface CProgressCircleElementEventMap extends HTMLElementEventMap {
    'maxChanged': JetElementCustomEventStrict<CProgressCircleElement['max']>;
    'sizeChanged': JetElementCustomEventStrict<CProgressCircleElement['size']>;
    'valueChanged': JetElementCustomEventStrict<CProgressCircleElement['value']>;
}
export interface CProgressCircleElementSettableProperties extends JetSettableProperties {
    /**
     * The maximum allowed value. The element's max attribute is used if it
     * is provided, otherwise the default value of 100 is used.
     */
    max?: ComponentProps<typeof ProgressCircle>['max'];
    size?: ComponentProps<typeof ProgressCircle>['size'];
    /**
     * The value of the Progress Circle. The element's value attribute is used if it
     * is provided, otherwise the default value of 0 is used. For indeterminate Progress, set value to -1.
     * Any other negative value will default to 0.
     */
    value?: ComponentProps<typeof ProgressCircle>['value'];
}
export interface CProgressCircleElementSettablePropertiesLenient extends Partial<CProgressCircleElementSettableProperties> {
    [key: string]: any;
}
export interface ProgressCircleIntrinsicProps extends Partial<Readonly<CProgressCircleElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onmaxChanged?: (value: CProgressCircleElementEventMap['maxChanged']) => void;
    onsizeChanged?: (value: CProgressCircleElementEventMap['sizeChanged']) => void;
    onvalueChanged?: (value: CProgressCircleElementEventMap['valueChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-progress-circle': ProgressCircleIntrinsicProps;
        }
    }
}
