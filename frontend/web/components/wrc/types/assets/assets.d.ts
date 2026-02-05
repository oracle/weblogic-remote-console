import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
import "css!wrc/assets/assets-styles.css";
type Props = Readonly<{
    message?: string;
}>;
declare function AssetsImpl({ message }: Props): import("preact").JSX.Element;
export declare const Assets: ComponentType<ExtendGlobalProps<ComponentProps<typeof AssetsImpl>>>;
export {};
export interface AssetsElement extends JetElement<AssetsElementSettableProperties>, AssetsElementSettableProperties {
    addEventListener<T extends keyof AssetsElementEventMap>(type: T, listener: (this: HTMLElement, ev: AssetsElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof AssetsElementSettableProperties>(property: T): AssetsElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof AssetsElementSettableProperties>(property: T, value: AssetsElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, AssetsElementSettableProperties>): void;
    setProperties(properties: AssetsElementSettablePropertiesLenient): void;
}
export namespace AssetsElement {
    type messageChanged = JetElementCustomEventStrict<AssetsElement['message']>;
}
export interface AssetsElementEventMap extends HTMLElementEventMap {
    'messageChanged': JetElementCustomEventStrict<AssetsElement['message']>;
}
export interface AssetsElementSettableProperties extends JetSettableProperties {
    message?: Props['message'];
}
export interface AssetsElementSettablePropertiesLenient extends Partial<AssetsElementSettableProperties> {
    [key: string]: any;
}
export interface AssetsIntrinsicProps extends Partial<Readonly<AssetsElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onmessageChanged?: (value: AssetsElementEventMap['messageChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'wrc-assets': AssetsIntrinsicProps;
        }
    }
}
