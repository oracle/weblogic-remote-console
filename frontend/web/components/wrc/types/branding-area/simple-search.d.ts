import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import "ojs/ojinputsearch";
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
import { ResourceContext } from "wrc/integration/resource-context";
type Props = {
    context?: ResourceContext;
};
declare function SimpleSearchImpl({ context }: Props): import("preact").JSX.Element;
export declare const SimpleSearch: ComponentType<ExtendGlobalProps<ComponentProps<typeof SimpleSearchImpl>>>;
export default SimpleSearch;
export interface SimpleSearchElement extends JetElement<SimpleSearchElementSettableProperties>, SimpleSearchElementSettableProperties {
    addEventListener<T extends keyof SimpleSearchElementEventMap>(type: T, listener: (this: HTMLElement, ev: SimpleSearchElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof SimpleSearchElementSettableProperties>(property: T): SimpleSearchElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof SimpleSearchElementSettableProperties>(property: T, value: SimpleSearchElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, SimpleSearchElementSettableProperties>): void;
    setProperties(properties: SimpleSearchElementSettablePropertiesLenient): void;
}
export namespace SimpleSearchElement {
    type contextChanged = JetElementCustomEventStrict<SimpleSearchElement['context']>;
}
export interface SimpleSearchElementEventMap extends HTMLElementEventMap {
    'contextChanged': JetElementCustomEventStrict<SimpleSearchElement['context']>;
}
export interface SimpleSearchElementSettableProperties extends JetSettableProperties {
    context?: Props['context'];
}
export interface SimpleSearchElementSettablePropertiesLenient extends Partial<SimpleSearchElementSettableProperties> {
    [key: string]: any;
}
export interface SimpleSearchIntrinsicProps extends Partial<Readonly<SimpleSearchElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    oncontextChanged?: (value: SimpleSearchElementEventMap['contextChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'wrc-simple-search': SimpleSearchIntrinsicProps;
        }
    }
}
