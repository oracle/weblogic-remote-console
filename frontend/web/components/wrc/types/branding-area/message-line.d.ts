import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
export declare const MessageLine: any;
export default MessageLine;
export interface MessageLineElement extends JetElement<MessageLineElementSettableProperties>, MessageLineElementSettableProperties {
    addEventListener<T extends keyof MessageLineElementEventMap>(type: T, listener: (this: HTMLElement, ev: MessageLineElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof MessageLineElementSettableProperties>(property: T): MessageLineElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof MessageLineElementSettableProperties>(property: T, value: MessageLineElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, MessageLineElementSettableProperties>): void;
    setProperties(properties: MessageLineElementSettablePropertiesLenient): void;
}
export namespace MessageLineElement {
    type contextChanged = JetElementCustomEventStrict<MessageLineElement['context']>;
}
export interface MessageLineElementEventMap extends HTMLElementEventMap {
    'contextChanged': JetElementCustomEventStrict<MessageLineElement['context']>;
}
export interface MessageLineElementSettableProperties extends JetSettableProperties {
    context?: Props['context'];
}
export interface MessageLineElementSettablePropertiesLenient extends Partial<MessageLineElementSettableProperties> {
    [key: string]: any;
}
export interface MessageLineIntrinsicProps extends Partial<Readonly<MessageLineElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    oncontextChanged?: (value: MessageLineElementEventMap['contextChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'wrc-message-line': MessageLineIntrinsicProps;
        }
    }
}
