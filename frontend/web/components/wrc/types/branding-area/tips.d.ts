import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import "ojs/ojpopup";
import "ojs/ojcheckboxset";
import "ojs/ojoption";
import "ojs/ojlabel";
import "oj-c/button";
import "oj-c/checkboxset";
export declare const Tips: any;
export default Tips;
export interface TipsElement extends JetElement<TipsElementSettableProperties>, TipsElementSettableProperties {
    addEventListener<T extends keyof TipsElementEventMap>(type: T, listener: (this: HTMLElement, ev: TipsElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof TipsElementSettableProperties>(property: T): TipsElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof TipsElementSettableProperties>(property: T, value: TipsElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, TipsElementSettableProperties>): void;
    setProperties(properties: TipsElementSettablePropertiesLenient): void;
}
export interface TipsElementEventMap extends HTMLElementEventMap {
}
export interface TipsElementSettableProperties extends JetSettableProperties {
}
export interface TipsElementSettablePropertiesLenient extends Partial<TipsElementSettableProperties> {
    [key: string]: any;
}
export interface TipsIntrinsicProps extends Partial<Readonly<TipsElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'wrc-tips': TipsIntrinsicProps;
        }
    }
}
