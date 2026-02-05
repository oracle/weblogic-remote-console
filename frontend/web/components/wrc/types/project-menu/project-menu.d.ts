import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import "css!wrc/project-menu/project-menu-styles.css";
import "oj-c/button";
import "oj-c/menu-button";
import "ojs/ojpopup";
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
declare function ProjectMenuImpl(): import("preact").JSX.Element;
export declare const ProjectMenu: ComponentType<ExtendGlobalProps<ComponentProps<typeof ProjectMenuImpl>>>;
export {};
export interface ProjectMenuElement extends JetElement<ProjectMenuElementSettableProperties>, ProjectMenuElementSettableProperties {
    addEventListener<T extends keyof ProjectMenuElementEventMap>(type: T, listener: (this: HTMLElement, ev: ProjectMenuElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ProjectMenuElementSettableProperties>(property: T): ProjectMenuElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ProjectMenuElementSettableProperties>(property: T, value: ProjectMenuElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ProjectMenuElementSettableProperties>): void;
    setProperties(properties: ProjectMenuElementSettablePropertiesLenient): void;
}
export interface ProjectMenuElementEventMap extends HTMLElementEventMap {
}
export interface ProjectMenuElementSettableProperties extends JetSettableProperties {
}
export interface ProjectMenuElementSettablePropertiesLenient extends Partial<ProjectMenuElementSettableProperties> {
    [key: string]: any;
}
export interface ProjectMenuIntrinsicProps extends Partial<Readonly<ProjectMenuElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'wrc-project-menu': ProjectMenuIntrinsicProps;
        }
    }
}
