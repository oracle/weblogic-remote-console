import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
import { ExtendGlobalProps } from "ojs/ojvcomponent";
import { ComponentProps, ComponentType, JSX } from "preact";
import "ojs/ojoption";
import "ojs/ojdialog";
import "oj-c/menu-button";
export type MenuItem = {
    classes: string[];
    role: string;
    dataIndex: number;
    id: string;
    value: string;
    disabled: boolean;
    path: string;
};
export type MenuItemCallbackEvent = {
    menuItem: MenuItem;
    menuId: string;
};
type Props = Readonly<{
    id: string;
    tooltip?: string;
    menuItems?: MenuItem[];
    selected?: (selectedValue: any) => void;
}>;
declare function KebabMenuImpl({ id, menuItems, selected }: Props): JSX.Element;
export declare const KebabMenu: ComponentType<ExtendGlobalProps<ComponentProps<typeof KebabMenuImpl>>>;
export {};
export interface KebabMenuElement extends JetElement<KebabMenuElementSettableProperties>, KebabMenuElementSettableProperties {
    addEventListener<T extends keyof KebabMenuElementEventMap>(type: T, listener: (this: HTMLElement, ev: KebabMenuElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof KebabMenuElementSettableProperties>(property: T): KebabMenuElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof KebabMenuElementSettableProperties>(property: T, value: KebabMenuElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, KebabMenuElementSettableProperties>): void;
    setProperties(properties: KebabMenuElementSettablePropertiesLenient): void;
}
export namespace KebabMenuElement {
    type idChanged = JetElementCustomEventStrict<KebabMenuElement['id']>;
    type menuItemsChanged = JetElementCustomEventStrict<KebabMenuElement['menuItems']>;
    type selectedChanged = JetElementCustomEventStrict<KebabMenuElement['selected']>;
    type tooltipChanged = JetElementCustomEventStrict<KebabMenuElement['tooltip']>;
}
export interface KebabMenuElementEventMap extends HTMLElementEventMap {
    'idChanged': JetElementCustomEventStrict<KebabMenuElement['id']>;
    'menuItemsChanged': JetElementCustomEventStrict<KebabMenuElement['menuItems']>;
    'selectedChanged': JetElementCustomEventStrict<KebabMenuElement['selected']>;
    'tooltipChanged': JetElementCustomEventStrict<KebabMenuElement['tooltip']>;
}
export interface KebabMenuElementSettableProperties extends JetSettableProperties {
    id: Props['id'];
    menuItems?: Props['menuItems'];
    selected?: Props['selected'];
    tooltip?: Props['tooltip'];
}
export interface KebabMenuElementSettablePropertiesLenient extends Partial<KebabMenuElementSettableProperties> {
    [key: string]: any;
}
export interface KebabMenuIntrinsicProps extends Partial<Readonly<KebabMenuElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onidChanged?: (value: KebabMenuElementEventMap['idChanged']) => void;
    onmenuItemsChanged?: (value: KebabMenuElementEventMap['menuItemsChanged']) => void;
    onselectedChanged?: (value: KebabMenuElementEventMap['selectedChanged']) => void;
    ontooltipChanged?: (value: KebabMenuElementEventMap['tooltipChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'wrc-kebab-menu': KebabMenuIntrinsicProps;
        }
    }
}
