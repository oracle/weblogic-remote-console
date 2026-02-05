import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
import "css!wrc/shared/shared-styles.css";
type Props = Readonly<{
    message?: string;
}>;
declare function SharedImpl({ message }: Props): import("preact").JSX.Element;
export declare const Shared: ComponentType<ExtendGlobalProps<ComponentProps<typeof SharedImpl>>>;
export {};
export interface SharedElement extends JetElement<SharedElementSettableProperties>, SharedElementSettableProperties {
    addEventListener<T extends keyof SharedElementEventMap>(type: T, listener: (this: HTMLElement, ev: SharedElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof SharedElementSettableProperties>(property: T): SharedElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof SharedElementSettableProperties>(property: T, value: SharedElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, SharedElementSettableProperties>): void;
    setProperties(properties: SharedElementSettablePropertiesLenient): void;
}
export namespace SharedElement {
    type messageChanged = JetElementCustomEventStrict<SharedElement['message']>;
}
export interface SharedElementEventMap extends HTMLElementEventMap {
    'messageChanged': JetElementCustomEventStrict<SharedElement['message']>;
}
export interface SharedElementSettableProperties extends JetSettableProperties {
    message?: Props['message'];
}
export interface SharedElementSettablePropertiesLenient extends Partial<SharedElementSettableProperties> {
    [key: string]: any;
}
export interface SharedIntrinsicProps extends Partial<Readonly<SharedElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onmessageChanged?: (value: SharedElementEventMap['messageChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'wrc-shared': SharedIntrinsicProps;
        }
    }
}
