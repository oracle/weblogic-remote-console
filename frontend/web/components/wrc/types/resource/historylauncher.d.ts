import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
import "oj-c/button";
declare function HistoryLauncherImpl(): import("preact").JSX.Element;
export declare const HistoryLauncher: ComponentType<ExtendGlobalProps<ComponentProps<typeof HistoryLauncherImpl>>>;
export default HistoryLauncher;
export interface HistoryLauncherElement extends JetElement<HistoryLauncherElementSettableProperties>, HistoryLauncherElementSettableProperties {
    addEventListener<T extends keyof HistoryLauncherElementEventMap>(type: T, listener: (this: HTMLElement, ev: HistoryLauncherElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof HistoryLauncherElementSettableProperties>(property: T): HistoryLauncherElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof HistoryLauncherElementSettableProperties>(property: T, value: HistoryLauncherElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, HistoryLauncherElementSettableProperties>): void;
    setProperties(properties: HistoryLauncherElementSettablePropertiesLenient): void;
}
export interface HistoryLauncherElementEventMap extends HTMLElementEventMap {
}
export interface HistoryLauncherElementSettableProperties extends JetSettableProperties {
}
export interface HistoryLauncherElementSettablePropertiesLenient extends Partial<HistoryLauncherElementSettableProperties> {
    [key: string]: any;
}
export interface HistoryLauncherIntrinsicProps extends Partial<Readonly<HistoryLauncherElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'wrc-history-launcher': HistoryLauncherIntrinsicProps;
        }
    }
}
