import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import "oj-c/button";
import "ojs/ojmenu";
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType } from "preact";
declare function ShoppingCartMenuImpl(): import("preact").JSX.Element;
export declare const ShoppingCartMenu: ComponentType<ExtendGlobalProps<ComponentProps<typeof ShoppingCartMenuImpl>>>;
export default ShoppingCartMenu;
export interface ShoppingcartMenuElement extends JetElement<ShoppingcartMenuElementSettableProperties>, ShoppingcartMenuElementSettableProperties {
    addEventListener<T extends keyof ShoppingcartMenuElementEventMap>(type: T, listener: (this: HTMLElement, ev: ShoppingcartMenuElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof ShoppingcartMenuElementSettableProperties>(property: T): ShoppingcartMenuElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof ShoppingcartMenuElementSettableProperties>(property: T, value: ShoppingcartMenuElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, ShoppingcartMenuElementSettableProperties>): void;
    setProperties(properties: ShoppingcartMenuElementSettablePropertiesLenient): void;
}
export interface ShoppingcartMenuElementEventMap extends HTMLElementEventMap {
}
export interface ShoppingcartMenuElementSettableProperties extends JetSettableProperties {
}
export interface ShoppingcartMenuElementSettablePropertiesLenient extends Partial<ShoppingcartMenuElementSettableProperties> {
    [key: string]: any;
}
export interface ShoppingCartMenuIntrinsicProps extends Partial<Readonly<ShoppingcartMenuElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'wrc-shoppingcart-menu': ShoppingCartMenuIntrinsicProps;
        }
    }
}
