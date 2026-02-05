import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import "css!./wrc-form-styles.css";
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
import { ResourceContext } from "../integration/resource-context";
import type { Databus } from "wrc/integration/databus";
import { Action } from "../shared/typedefs/pdj";
import { Message } from "wrc/shared/typedefs/common";
import { Action as ojAction } from "ojs/ojvcomponent";
export type ActionCompletedEvent = {
    action: Action;
    messages?: Message[];
};
export type BeforeNavigateEvent = {
    path: string;
    preventDefault: () => void;
    defaultPrevented: boolean;
};
export type Context = {
    rdj: string;
    unique?: string;
    context?: ResourceContext;
    databus?: Databus;
    showHelp: boolean;
    onActionCompleted?: ojAction<ActionCompletedEvent>;
    onBeforeNavigate?: ojAction<BeforeNavigateEvent>;
};
export declare const UserContext: import("preact").Context<Context | null>;
type Props = Readonly<{
    rdj: string;
    pdj?: string;
    showHelp?: boolean;
    unique?: string;
    context?: ResourceContext;
    pageContext?: string;
    backendPrefix?: string;
    onBeforeNavigate?: ojAction<BeforeNavigateEvent>;
    onActionCompleted?: ojAction<ActionCompletedEvent>;
}>;
declare function ResourceImpl({ rdj, pdj, unique, context, pageContext, showHelp, backendPrefix, onBeforeNavigate, onActionCompleted }: Props): import("preact").JSX.Element | null;
export declare const Resource: ComponentType<ExtendGlobalProps<ComponentProps<typeof ResourceImpl>>>;
export {};
export interface ResourceElement extends JetElement<ResourceElementSettableProperties>, ResourceElementSettableProperties {
    addEventListener<T extends keyof ResourceElementEventMap>(type: T, listener: (this: HTMLElement, ev: ResourceElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ResourceElementSettableProperties>(property: T): ResourceElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ResourceElementSettableProperties>(property: T, value: ResourceElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ResourceElementSettableProperties>): void;
    setProperties(properties: ResourceElementSettablePropertiesLenient): void;
}
export namespace ResourceElement {
    interface beforeNavigate extends CustomEvent<BeforeNavigateEvent & {}> {
    }
    interface actionCompleted extends CustomEvent<ActionCompletedEvent & {}> {
    }
    type backendPrefixChanged = JetElementCustomEventStrict<ResourceElement['backendPrefix']>;
    type contextChanged = JetElementCustomEventStrict<ResourceElement['context']>;
    type pageContextChanged = JetElementCustomEventStrict<ResourceElement['pageContext']>;
    type pdjChanged = JetElementCustomEventStrict<ResourceElement['pdj']>;
    type rdjChanged = JetElementCustomEventStrict<ResourceElement['rdj']>;
    type showHelpChanged = JetElementCustomEventStrict<ResourceElement['showHelp']>;
    type uniqueChanged = JetElementCustomEventStrict<ResourceElement['unique']>;
}
export interface ResourceElementEventMap extends HTMLElementEventMap {
    'beforeNavigate': ResourceElement.beforeNavigate;
    'actionCompleted': ResourceElement.actionCompleted;
    'backendPrefixChanged': JetElementCustomEventStrict<ResourceElement['backendPrefix']>;
    'contextChanged': JetElementCustomEventStrict<ResourceElement['context']>;
    'pageContextChanged': JetElementCustomEventStrict<ResourceElement['pageContext']>;
    'pdjChanged': JetElementCustomEventStrict<ResourceElement['pdj']>;
    'rdjChanged': JetElementCustomEventStrict<ResourceElement['rdj']>;
    'showHelpChanged': JetElementCustomEventStrict<ResourceElement['showHelp']>;
    'uniqueChanged': JetElementCustomEventStrict<ResourceElement['unique']>;
}
export interface ResourceElementSettableProperties extends JetSettableProperties {
    backendPrefix?: Props['backendPrefix'];
    context?: Props['context'];
    pageContext?: Props['pageContext'];
    pdj?: Props['pdj'];
    rdj: Props['rdj'];
    showHelp?: Props['showHelp'];
    unique?: Props['unique'];
}
export interface ResourceElementSettablePropertiesLenient extends Partial<ResourceElementSettableProperties> {
    [key: string]: any;
}
export interface ResourceIntrinsicProps extends Partial<Readonly<ResourceElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onactionCompleted?: (value: ResourceElementEventMap['actionCompleted']) => void;
    onbeforeNavigate?: (value: ResourceElementEventMap['beforeNavigate']) => void;
    onbackendPrefixChanged?: (value: ResourceElementEventMap['backendPrefixChanged']) => void;
    oncontextChanged?: (value: ResourceElementEventMap['contextChanged']) => void;
    onpageContextChanged?: (value: ResourceElementEventMap['pageContextChanged']) => void;
    onpdjChanged?: (value: ResourceElementEventMap['pdjChanged']) => void;
    onrdjChanged?: (value: ResourceElementEventMap['rdjChanged']) => void;
    onshowHelpChanged?: (value: ResourceElementEventMap['showHelpChanged']) => void;
    onuniqueChanged?: (value: ResourceElementEventMap['uniqueChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'wrc-resource': ResourceIntrinsicProps;
        }
    }
}
