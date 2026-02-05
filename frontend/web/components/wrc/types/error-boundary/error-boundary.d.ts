import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import 'ojs/oj-jsx-interfaces';
import "css!wrc/error-boundary/error-boundary-styles.css";
import { GlobalProps } from "ojs/ojvcomponent";
import { Component, ComponentChild, Context, ErrorInfo } from "preact";
import { Context as wrcContext } from "wrc/resource/resource";
export declare class ErrorBoundary extends Component<GlobalProps> {
    static contextType: Context<wrcContext | null>;
    state: {
        error: null;
    };
    componentDidCatch(error: any, _errorInfo: ErrorInfo): void;
    render(): ComponentChild;
}
export interface ErrorBoundaryElement extends JetElement<ErrorBoundaryElementSettableProperties>, ErrorBoundaryElementSettableProperties {
    addEventListener<T extends keyof ErrorBoundaryElementEventMap>(type: T, listener: (this: HTMLElement, ev: ErrorBoundaryElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ErrorBoundaryElementSettableProperties>(property: T): ErrorBoundaryElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ErrorBoundaryElementSettableProperties>(property: T, value: ErrorBoundaryElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ErrorBoundaryElementSettableProperties>): void;
    setProperties(properties: ErrorBoundaryElementSettablePropertiesLenient): void;
}
export interface ErrorBoundaryElementEventMap extends HTMLElementEventMap {
}
export interface ErrorBoundaryElementSettableProperties extends JetSettableProperties {
}
export interface ErrorBoundaryElementSettablePropertiesLenient extends Partial<ErrorBoundaryElementSettableProperties> {
    [key: string]: any;
}
export interface ErrorBoundaryIntrinsicProps extends Partial<Readonly<ErrorBoundaryElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'wrc-error-boundary': ErrorBoundaryIntrinsicProps;
        }
    }
}
