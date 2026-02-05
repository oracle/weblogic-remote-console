export declare const LegendSectionDefaults: {
    text: string;
};
type LegendSectionProps = {
    /**
     * @description
     * The title of the legend section.
     * @ojmetadata description "The title of the legend section."
     * @ojmetadata displayName "Text"
     * @ojmetadata help "#text"
     * @ojmetadata translatable
     */
    text?: string;
};
/**
 * This export corresponds to the LegendSection Preact component. For the oj-c-legend-section custom element, import CLegendSectionElement instead.
 */
export declare const LegendSection: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<LegendSectionProps>>;
export {};
import { ComponentProps } from 'preact';
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-legend-section custom element. For the LegendSection Preact component, import LegendSection instead.
 */
export interface CLegendSectionElement extends JetElement<CLegendSectionElementSettableProperties>, CLegendSectionElementSettableProperties {
    addEventListener<T extends keyof CLegendSectionElementEventMap>(type: T, listener: (this: HTMLElement, ev: CLegendSectionElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CLegendSectionElementSettableProperties>(property: T): CLegendSectionElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CLegendSectionElementSettableProperties>(property: T, value: CLegendSectionElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CLegendSectionElementSettableProperties>): void;
    setProperties(properties: CLegendSectionElementSettablePropertiesLenient): void;
}
export namespace CLegendSectionElement {
    type textChanged = JetElementCustomEventStrict<CLegendSectionElement['text']>;
}
export interface CLegendSectionElementEventMap extends HTMLElementEventMap {
    'textChanged': JetElementCustomEventStrict<CLegendSectionElement['text']>;
}
export interface CLegendSectionElementSettableProperties extends JetSettableProperties {
    /**
     * The title of the legend section.
     */
    text?: ComponentProps<typeof LegendSection>['text'];
}
export interface CLegendSectionElementSettablePropertiesLenient extends Partial<CLegendSectionElementSettableProperties> {
    [key: string]: any;
}
export interface LegendSectionIntrinsicProps extends Partial<Readonly<CLegendSectionElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    ontextChanged?: (value: CLegendSectionElementEventMap['textChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-legend-section': LegendSectionIntrinsicProps;
        }
    }
}
