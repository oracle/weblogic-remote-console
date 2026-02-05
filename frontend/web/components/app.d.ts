import { ComponentProps } from 'preact';
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
export declare const App: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<Readonly<{
    appName?: string;
    userLogin?: string;
}>>>;
export interface RootElement extends JetElement<RootElementSettableProperties>, RootElementSettableProperties {
    addEventListener<T extends keyof RootElementEventMap>(type: T, listener: (this: HTMLElement, ev: RootElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof RootElementSettableProperties>(property: T): RootElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof RootElementSettableProperties>(property: T, value: RootElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, RootElementSettableProperties>): void;
    setProperties(properties: RootElementSettablePropertiesLenient): void;
}
export namespace RootElement {
    type appNameChanged = JetElementCustomEventStrict<RootElement['appName']>;
    type userLoginChanged = JetElementCustomEventStrict<RootElement['userLogin']>;
}
export interface RootElementEventMap extends HTMLElementEventMap {
    'appNameChanged': JetElementCustomEventStrict<RootElement['appName']>;
    'userLoginChanged': JetElementCustomEventStrict<RootElement['userLogin']>;
}
export interface RootElementSettableProperties extends JetSettableProperties {
    appName?: ComponentProps<typeof App>['appName'];
    userLogin?: ComponentProps<typeof App>['userLogin'];
}
export interface RootElementSettablePropertiesLenient extends Partial<RootElementSettableProperties> {
    [key: string]: any;
}
export interface AppIntrinsicProps extends Partial<Readonly<RootElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onappNameChanged?: (value: RootElementEventMap['appNameChanged']) => void;
    onuserLoginChanged?: (value: RootElementEventMap['userLoginChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'app-root': AppIntrinsicProps;
        }
    }
}
