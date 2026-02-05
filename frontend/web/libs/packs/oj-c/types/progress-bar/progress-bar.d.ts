/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ProgressBar as PreactProgressBar } from '@oracle/oraclejet-preact/UNSAFE_ProgressBar';
import { ComponentProps } from 'preact';
import { ObservedGlobalProps } from 'ojs/ojvcomponent';
import 'css!oj-c/progress-bar/progress-bar-styles.css';
type PreactProgressBarProps = ComponentProps<typeof PreactProgressBar>;
/**
 * This export corresponds to the ProgressBar Preact component. For the oj-c-progress-bar custom element, import CProgressBarElement instead.
 */
export declare const ProgressBar: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<ObservedGlobalProps<"aria-label" | "aria-labelledby" | "aria-valuetext"> & {
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
     * The value of the Progress Bar. The element's value attribute is used if it
     * is provided, otherwise the default value of 0 is used. For indeterminate Progress, set value to -1.
     * Any other negative value will default to 0.
     *
     * @ojmetadata description "The value of the Progress Bar."
     * @ojmetadata displayName "Value"
     * @ojmetadata eventGroup "common"
     * @ojmetadata help "value"
     * @ojmetadata minimum -1
     */
    value?: number;
    /**
     * @description
     * Whether the progress bar is positioned at the top edge of a container or not.
     * If set to 'top', the curved borders will be removed.
     *
     * @ojmetadata description "Specifies whether the progress bar is on the top edge of a container"
     * @ojmetadata displayName "edge"
     * @ojmetadata help "#edge"
     * @ojmetadata propertyEditorValues {
     *     "none": {
     *       "description": "Not attached progress bar (default, if unspecified)",
     *       "displayName": "Not Attached Progress Bar"
     *     },
     *     "top": {
     *       "description": "Progress Bar at Top Edge of container",
     *       "displayName": "Progress Bar Top Edge Container"
     *     }
     *   }
     */
    edge?: PreactProgressBarProps["edge"];
}>>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-progress-bar custom element. For the ProgressBar Preact component, import ProgressBar instead.
 */
export interface CProgressBarElement extends JetElement<CProgressBarElementSettableProperties>, CProgressBarElementSettableProperties {
    addEventListener<T extends keyof CProgressBarElementEventMap>(type: T, listener: (this: HTMLElement, ev: CProgressBarElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CProgressBarElementSettableProperties>(property: T): CProgressBarElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CProgressBarElementSettableProperties>(property: T, value: CProgressBarElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CProgressBarElementSettableProperties>): void;
    setProperties(properties: CProgressBarElementSettablePropertiesLenient): void;
}
export namespace CProgressBarElement {
    type edgeChanged = JetElementCustomEventStrict<CProgressBarElement['edge']>;
    type maxChanged = JetElementCustomEventStrict<CProgressBarElement['max']>;
    type valueChanged = JetElementCustomEventStrict<CProgressBarElement['value']>;
}
export interface CProgressBarElementEventMap extends HTMLElementEventMap {
    'edgeChanged': JetElementCustomEventStrict<CProgressBarElement['edge']>;
    'maxChanged': JetElementCustomEventStrict<CProgressBarElement['max']>;
    'valueChanged': JetElementCustomEventStrict<CProgressBarElement['value']>;
}
export interface CProgressBarElementSettableProperties extends JetSettableProperties {
    /**
     * Whether the progress bar is positioned at the top edge of a container or not.
     * If set to 'top', the curved borders will be removed.
     */
    edge?: ComponentProps<typeof ProgressBar>['edge'];
    /**
     * The maximum allowed value. The element's max attribute is used if it
     * is provided, otherwise the default value of 100 is used.
     */
    max?: ComponentProps<typeof ProgressBar>['max'];
    /**
     * The value of the Progress Bar. The element's value attribute is used if it
     * is provided, otherwise the default value of 0 is used. For indeterminate Progress, set value to -1.
     * Any other negative value will default to 0.
     */
    value?: ComponentProps<typeof ProgressBar>['value'];
}
export interface CProgressBarElementSettablePropertiesLenient extends Partial<CProgressBarElementSettableProperties> {
    [key: string]: any;
}
export interface ProgressBarIntrinsicProps extends Partial<Readonly<CProgressBarElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onedgeChanged?: (value: CProgressBarElementEventMap['edgeChanged']) => void;
    onmaxChanged?: (value: CProgressBarElementEventMap['maxChanged']) => void;
    onvalueChanged?: (value: CProgressBarElementEventMap['valueChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-progress-bar': ProgressBarIntrinsicProps;
        }
    }
}
