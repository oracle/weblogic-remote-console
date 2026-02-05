import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { h } from "preact";
import "ojs/ojinputsearch";
import "oj-c/button";
import { ResourceContext } from "wrc/integration/resource-context";
type Props = {
    context?: ResourceContext;
};
export declare function BrandingHeaderImpl({ context }: Props): h.JSX.Element;
export declare const openExternalUrl: (url: string) => void;
export declare const BrandingArea: any;
export declare const BrandingHeader: any;
export default BrandingHeader;
export interface BrandingAreaElement extends JetElement<BrandingAreaElementSettableProperties>, BrandingAreaElementSettableProperties {
    addEventListener<T extends keyof BrandingAreaElementEventMap>(type: T, listener: (this: HTMLElement, ev: BrandingAreaElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof BrandingAreaElementSettableProperties>(property: T): BrandingAreaElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof BrandingAreaElementSettableProperties>(property: T, value: BrandingAreaElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, BrandingAreaElementSettableProperties>): void;
    setProperties(properties: BrandingAreaElementSettablePropertiesLenient): void;
}
export namespace BrandingAreaElement {
    type contextChanged = JetElementCustomEventStrict<BrandingAreaElement['context']>;
}
export interface BrandingAreaElementEventMap extends HTMLElementEventMap {
    'contextChanged': JetElementCustomEventStrict<BrandingAreaElement['context']>;
}
export interface BrandingAreaElementSettableProperties extends JetSettableProperties {
    context?: Props['context'];
}
export interface BrandingAreaElementSettablePropertiesLenient extends Partial<BrandingAreaElementSettableProperties> {
    [key: string]: any;
}
export interface BrandingAreaIntrinsicProps extends Partial<Readonly<BrandingAreaElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    oncontextChanged?: (value: BrandingAreaElementEventMap['contextChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'wrc-branding-area': BrandingAreaIntrinsicProps;
        }
    }
}
export interface BrandingHeaderElement extends JetElement<BrandingHeaderElementSettableProperties>, BrandingHeaderElementSettableProperties {
    addEventListener<T extends keyof BrandingHeaderElementEventMap>(type: T, listener: (this: HTMLElement, ev: BrandingHeaderElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof BrandingHeaderElementSettableProperties>(property: T): BrandingHeaderElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof BrandingHeaderElementSettableProperties>(property: T, value: BrandingHeaderElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, BrandingHeaderElementSettableProperties>): void;
    setProperties(properties: BrandingHeaderElementSettablePropertiesLenient): void;
}
export namespace BrandingHeaderElement {
    type contextChanged = JetElementCustomEventStrict<BrandingHeaderElement['context']>;
}
export interface BrandingHeaderElementEventMap extends HTMLElementEventMap {
    'contextChanged': JetElementCustomEventStrict<BrandingHeaderElement['context']>;
}
export interface BrandingHeaderElementSettableProperties extends JetSettableProperties {
    context?: Props['context'];
}
export interface BrandingHeaderElementSettablePropertiesLenient extends Partial<BrandingHeaderElementSettableProperties> {
    [key: string]: any;
}
export interface BrandingHeaderIntrinsicProps extends Partial<Readonly<BrandingHeaderElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    oncontextChanged?: (value: BrandingHeaderElementEventMap['contextChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'wrc-branding-header': BrandingHeaderIntrinsicProps;
        }
    }
}
