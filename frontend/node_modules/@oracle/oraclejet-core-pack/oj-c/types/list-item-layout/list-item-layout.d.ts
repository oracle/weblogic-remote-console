import { ComponentChildren } from 'preact';
import { ObservedGlobalProps, Slot } from 'ojs/ojvcomponent';
import 'css!oj-c/list-item-layout/list-item-layout-styles.css';
/**
 * This export corresponds to the ListItemLayout Preact component. For the oj-c-list-item-layout custom element, import CListItemLayoutElement instead.
 */
export declare const ListItemLayout: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<ObservedGlobalProps<"aria-label"> & {
    /**
     * @ojmetadata description "The default slot accepts the primary data to be displayed."
     * @ojmetadata displayName "Default"
     * @ojmetadata help "#default"
     */
    children?: ComponentChildren;
    /**
     * @ojmetadata description "The overline slot is for adding a overline text above the default slot."
     * @ojmetadata displayName "Overline"
     * @ojmetadata help "#overline"
     */
    overline?: Slot;
    /**
     * @ojmetadata description "The selector slot can accept a oj-selector component and is optional."
     * @ojmetadata displayName "Selector"
     * @ojmetadata help "#selector"
     */
    selector?: Slot;
    /**
     * @ojmetadata description "The leading slot is used for adding a leading visual next to the selector."
     * @ojmetadata displayName "Leading"
     * @ojmetadata help "#leading"
     */
    leading?: Slot;
    /**
     * @ojmetadata description "The secondary slot is for adding a secondary text below the default text."
     * @ojmetadata displayName "Secondary"
     * @ojmetadata help "#secondary"
     */
    secondary?: Slot;
    /**
     * @ojmetadata description "The tertiary slot is for adding a tertiary text below the secondary text."
     * @ojmetadata displayName "Tertiary"
     * @ojmetadata help "#tertiary"
     */
    tertiary?: Slot;
    /**
     * @ojmetadata description "The metadata for adding extra trailing information. Examples of metadata are author, date etc."
     * @ojmetadata displayName "Metadata"
     * @ojmetadata help "#metadata"
     */
    metadata?: Slot;
    /**
     * @ojmetadata description "The trailing slot is used for adding a trailing visual."
     * @ojmetadata displayName "Trailing"
     * @ojmetadata help "#trailing"
     */
    trailing?: Slot;
    /**
     * @ojmetadata description "Action slot often uses a toolbar. In general, the action slot should display either one primary action or one or more secondary actions."
     * @ojmetadata displayName "Action"
     * @ojmetadata help "#action"
     */
    action?: Slot;
    /**
     * @ojmetadata description "The quaternary slot is for adding a quaternary text below the tertiary text."
     * @ojmetadata displayName "Quaternary"
     * @ojmetadata help "#quaternary"
     */
    quaternary?: Slot;
    /**
     * @ojmetadata description "The navigation slot is used for adding links below the trailing slot."
     * @ojmetadata displayName "Navigation"
     * @ojmetadata help "#navigation"
     */
    navigation?: Slot;
    /**
     * @ojmetadata description "Controls padding around outside of list item layouts."
     * @ojmetadata displayName "Inset"
     * @ojmetadata help "#inset"
     */
    inset?: "none" | "listInset";
    /**
     * @ojmetadata description "When set to 'top', this setting aligns layout content to top of cells, and moves overline to a row above primary."
     * @ojmetadata description "Default is 'middle' which vertically aligns layout content to center of the row."
     * @ojmetadata displayName "verticalAlignment"
     * @ojmetadata help "#verticalAlignment"
     */
    verticalAlignment?: "middle" | "top";
}>>;
import { ComponentProps } from 'preact';
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-list-item-layout custom element. For the ListItemLayout Preact component, import ListItemLayout instead.
 */
export interface CListItemLayoutElement extends JetElement<CListItemLayoutElementSettableProperties>, CListItemLayoutElementSettableProperties {
    addEventListener<T extends keyof CListItemLayoutElementEventMap>(type: T, listener: (this: HTMLElement, ev: CListItemLayoutElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CListItemLayoutElementSettableProperties>(property: T): CListItemLayoutElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CListItemLayoutElementSettableProperties>(property: T, value: CListItemLayoutElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CListItemLayoutElementSettableProperties>): void;
    setProperties(properties: CListItemLayoutElementSettablePropertiesLenient): void;
}
export namespace CListItemLayoutElement {
    type insetChanged = JetElementCustomEventStrict<CListItemLayoutElement['inset']>;
    type verticalAlignmentChanged = JetElementCustomEventStrict<CListItemLayoutElement['verticalAlignment']>;
}
export interface CListItemLayoutElementEventMap extends HTMLElementEventMap {
    'insetChanged': JetElementCustomEventStrict<CListItemLayoutElement['inset']>;
    'verticalAlignmentChanged': JetElementCustomEventStrict<CListItemLayoutElement['verticalAlignment']>;
}
export interface CListItemLayoutElementSettableProperties extends JetSettableProperties {
    inset?: ComponentProps<typeof ListItemLayout>['inset'];
    verticalAlignment?: ComponentProps<typeof ListItemLayout>['verticalAlignment'];
}
export interface CListItemLayoutElementSettablePropertiesLenient extends Partial<CListItemLayoutElementSettableProperties> {
    [key: string]: any;
}
export interface ListItemLayoutIntrinsicProps extends Partial<Readonly<CListItemLayoutElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    oninsetChanged?: (value: CListItemLayoutElementEventMap['insetChanged']) => void;
    onverticalAlignmentChanged?: (value: CListItemLayoutElementEventMap['verticalAlignmentChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-list-item-layout': ListItemLayoutIntrinsicProps;
        }
    }
}
