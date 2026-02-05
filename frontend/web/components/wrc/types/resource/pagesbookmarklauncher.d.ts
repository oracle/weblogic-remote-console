import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
import "oj-c/button";
import "oj-c/message-toast";
declare function PagesBookmarkLauncherImpl(): import("preact").JSX.Element;
export declare const PagesBookmarkLauncher: ComponentType<ExtendGlobalProps<ComponentProps<typeof PagesBookmarkLauncherImpl>>>;
export default PagesBookmarkLauncher;
export interface PagesBookmarkLauncherElement extends JetElement<PagesBookmarkLauncherElementSettableProperties>, PagesBookmarkLauncherElementSettableProperties {
    addEventListener<T extends keyof PagesBookmarkLauncherElementEventMap>(type: T, listener: (this: HTMLElement, ev: PagesBookmarkLauncherElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof PagesBookmarkLauncherElementSettableProperties>(property: T): PagesBookmarkLauncherElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof PagesBookmarkLauncherElementSettableProperties>(property: T, value: PagesBookmarkLauncherElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, PagesBookmarkLauncherElementSettableProperties>): void;
    setProperties(properties: PagesBookmarkLauncherElementSettablePropertiesLenient): void;
}
export interface PagesBookmarkLauncherElementEventMap extends HTMLElementEventMap {
}
export interface PagesBookmarkLauncherElementSettableProperties extends JetSettableProperties {
}
export interface PagesBookmarkLauncherElementSettablePropertiesLenient extends Partial<PagesBookmarkLauncherElementSettableProperties> {
    [key: string]: any;
}
export interface PagesBookmarkLauncherIntrinsicProps extends Partial<Readonly<PagesBookmarkLauncherElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'wrc-pages-bookmark-launcher': PagesBookmarkLauncherIntrinsicProps;
        }
    }
}
