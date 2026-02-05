import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import "css!./nav-tree-styles.css";
import "oj-c/button";
import "oj-c/buttonset-single";
import "ojs/ojcollapsible";
import "ojs/ojaccordion";
import "ojs/ojnavigationlist";
import "ojs/ojtoolbar";
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import "preact";
import { ComponentProps, ComponentType } from "preact";
import { ResourceContext } from "wrc/integration/resource-context";
type Props = Readonly<{
    navtreeUrl: string;
    url: string;
    context?: ResourceContext;
    unique: string;
    backendPrefix?: string;
}>;
export declare const ICONS: Record<string, string>;
declare function NavTreeImpl({ context, unique, backendPrefix }: Props): import("preact").JSX.Element;
export declare const NavTree: ComponentType<ExtendGlobalProps<ComponentProps<typeof NavTreeImpl>>>;
export {};
export interface NavTreeElement extends JetElement<NavTreeElementSettableProperties>, NavTreeElementSettableProperties {
    addEventListener<T extends keyof NavTreeElementEventMap>(type: T, listener: (this: HTMLElement, ev: NavTreeElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof NavTreeElementSettableProperties>(property: T): NavTreeElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof NavTreeElementSettableProperties>(property: T, value: NavTreeElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, NavTreeElementSettableProperties>): void;
    setProperties(properties: NavTreeElementSettablePropertiesLenient): void;
}
export namespace NavTreeElement {
    type backendPrefixChanged = JetElementCustomEventStrict<NavTreeElement['backendPrefix']>;
    type contextChanged = JetElementCustomEventStrict<NavTreeElement['context']>;
    type navtreeUrlChanged = JetElementCustomEventStrict<NavTreeElement['navtreeUrl']>;
    type uniqueChanged = JetElementCustomEventStrict<NavTreeElement['unique']>;
    type urlChanged = JetElementCustomEventStrict<NavTreeElement['url']>;
}
export interface NavTreeElementEventMap extends HTMLElementEventMap {
    'backendPrefixChanged': JetElementCustomEventStrict<NavTreeElement['backendPrefix']>;
    'contextChanged': JetElementCustomEventStrict<NavTreeElement['context']>;
    'navtreeUrlChanged': JetElementCustomEventStrict<NavTreeElement['navtreeUrl']>;
    'uniqueChanged': JetElementCustomEventStrict<NavTreeElement['unique']>;
    'urlChanged': JetElementCustomEventStrict<NavTreeElement['url']>;
}
export interface NavTreeElementSettableProperties extends JetSettableProperties {
    backendPrefix?: Props['backendPrefix'];
    context?: Props['context'];
    navtreeUrl: Props['navtreeUrl'];
    unique: Props['unique'];
    url: Props['url'];
}
export interface NavTreeElementSettablePropertiesLenient extends Partial<NavTreeElementSettableProperties> {
    [key: string]: any;
}
export interface NavTreeIntrinsicProps extends Partial<Readonly<NavTreeElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onbackendPrefixChanged?: (value: NavTreeElementEventMap['backendPrefixChanged']) => void;
    oncontextChanged?: (value: NavTreeElementEventMap['contextChanged']) => void;
    onnavtreeUrlChanged?: (value: NavTreeElementEventMap['navtreeUrlChanged']) => void;
    onuniqueChanged?: (value: NavTreeElementEventMap['uniqueChanged']) => void;
    onurlChanged?: (value: NavTreeElementEventMap['urlChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'wrc-nav-tree': NavTreeIntrinsicProps;
        }
    }
}
