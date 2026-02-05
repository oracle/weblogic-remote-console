import { ExtendGlobalProps, PropertyChanged, TemplateSlot } from 'ojs/ojvcomponent';
import { ComponentChildren, Ref } from 'preact';
import 'css!oj-c/conveyor-belt/conveyor-belt-styles.css';
import { ConveyorItemContext } from './conveyorBeltItem';
import { DataProvider } from 'ojs/ojdataprovider';
type ScrollableHandle = {
    scrollElementIntoView: (element: HTMLElement) => void;
};
export type ConveyorBeltDataItem = {
    label?: string;
};
export type ConveyorBeltArrayDataItem<K, D> = {
    data: D;
    key: K;
};
export type ConevyorBeltPreactWrapperProps<K extends string | number, D> = {
    /**
     * @ojmetadata description "The default slot is the content of the Conveyor Belt."
     * @ojmetadata displayName "Default"
     * @ojmetadata help "#default"
     */
    children: ComponentChildren;
    /**
     *
     * @description
     * <p>Gets or sets the number of pixels that an element's content is scrolled from its initial position.
     *
     * <p>The default value of this property is 0.
     *
     * <p> There is no difference between LTR/RTL value assignment.
     * In both LTR and RTL values changes from 0 and max scroll position >=0  if we scroll to the end.
     * If we scroll to the beginning then the values changes from max scroll position >=0 to min scroll position = 0
     * When the value exceeds max/min the value is constrained to the max/min scroll position accordingly.
     *
     * @ojmetadata description " Gets or sets the number of pixels that an element's content is scrolled from its initial position."
     * @ojmetadata displayName "Scroll Position"
     * @ojmetadata help "#scrollPosition"
     */
    scrollPosition?: number;
    /**
     * @ojmetadata description "Writeback support for the scrollPosition property"
     * @ojmetadata displayName "Scroll Position"
     * @ojmetadata help "#scrollPosition"
     */
    onScrollPositionChanged?: PropertyChanged<number>;
    /**
     * @description
     * <p>Indicates whether overflow content arrows are visible or hidden.
     *
     * <p>The default value of this property varies by theme. If the default value is 'auto', then the behavior varies by device.
     *
     * @ojmetadata description "Specifies visibility of overflow arrow buttons."
     * @ojmetadata displayName "Arrow Visibility"
     * @ojmetadata help "#arrowVisibility"
     */
    arrowVisibility?: 'auto' | 'visible' | 'hidden';
    /**
     * @description
     * An array of data items or a data provider that returns the items for the ConveyorBelt.
     *
     * @ojmetadata description "An array of data items or a data provider that returns the items for the ConveyorBelt."
     * @ojmetadata displayName "Items"
     * @ojmetadata help "#items"
     */
    items?: Array<ConveyorBeltArrayDataItem<K, D>> | DataProvider<K, D>;
    /**
     * @description
     * <p>The <code class="prettyprint">itemTemplate</code> slot is used to specify the template for rendering each item in the Conveyor Belt. The slot content must be a &lt;template> element.
     * <p>When the template is executed for each item, it will have access to the binding context containing the following properties:</p>
     * <ul>
     *   <li>$current - an object that contains information for the current item.</li>
     * </ul>
     *
     * @ojmetadata description "The itemTemplate slot is used to specify the template for rendering each item in the component. See the Help documentation for more information."
     * @ojmetadata displayName "itemTemplate"
     * @ojmetadata help "#itemTemplate"
     * @ojmetadata maxItems 1
     */
    itemTemplate?: TemplateSlot<ConveyorItemContext<K, D>>;
    /**
     * Specify the orientation of the conveyorBelt.
     * "horizontal" Orient the conveyorBelt horizontally.
     * "vertical" Orient the conveyorBelt vertically.
     */
    orientation?: 'horizontal' | 'vertical';
};
export type ConveyorProps<K extends string | number, D extends ConveyorBeltDataItem> = ConevyorBeltPreactWrapperProps<K, D>;
/**
 * This export corresponds to the ConveyorBelt Preact component. For the oj-c-conveyor-belt custom element, import CConveyorBeltElement instead.
 */
export declare const ConveyorBelt: <K extends string | number = string | number, D extends ConveyorBeltDataItem = ConveyorBeltDataItem>(props: ExtendGlobalProps<ConevyorBeltPreactWrapperProps<K, D>> & {
    ref?: Ref<ScrollableHandle>;
}) => ComponentChildren;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-conveyor-belt custom element. For the ConveyorBelt Preact component, import ConveyorBelt instead.
 */
export interface CConveyorBeltElement<K extends string | number = string | number, D extends ConveyorBeltDataItem = ConveyorBeltDataItem> extends JetElement<CConveyorBeltElementSettableProperties<K, D>>, CConveyorBeltElementSettableProperties<K, D> {
    addEventListener<T extends keyof CConveyorBeltElementEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: CConveyorBeltElementEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CConveyorBeltElementSettableProperties<K, D>>(property: T): CConveyorBeltElement<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CConveyorBeltElementSettableProperties<K, D>>(property: T, value: CConveyorBeltElementSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CConveyorBeltElementSettableProperties<K, D>>): void;
    setProperties(properties: CConveyorBeltElementSettablePropertiesLenient<K, D>): void;
    /**
     * Scrolls element into view.
     */
    scrollElementIntoView: (element: HTMLElement) => void;
}
export namespace CConveyorBeltElement {
    type arrowVisibilityChanged<K extends string | number = string | number, D extends ConveyorBeltDataItem = ConveyorBeltDataItem> = JetElementCustomEventStrict<CConveyorBeltElement<K, D>['arrowVisibility']>;
    type itemsChanged<K extends string | number = string | number, D extends ConveyorBeltDataItem = ConveyorBeltDataItem> = JetElementCustomEventStrict<CConveyorBeltElement<K, D>['items']>;
    type orientationChanged<K extends string | number = string | number, D extends ConveyorBeltDataItem = ConveyorBeltDataItem> = JetElementCustomEventStrict<CConveyorBeltElement<K, D>['orientation']>;
    type scrollPositionChanged<K extends string | number = string | number, D extends ConveyorBeltDataItem = ConveyorBeltDataItem> = JetElementCustomEventStrict<CConveyorBeltElement<K, D>['scrollPosition']>;
    type ItemTemplateContext<K extends string | number = string | number, D extends ConveyorBeltDataItem = ConveyorBeltDataItem> = ConveyorItemContext<K, D>;
    type RenderItemTemplate<K extends string | number = string | number, D extends ConveyorBeltDataItem = ConveyorBeltDataItem> = import('ojs/ojvcomponent').TemplateSlot<ConveyorItemContext<K, D>>;
}
export interface CConveyorBeltElementEventMap<K extends string | number = string | number, D extends ConveyorBeltDataItem = ConveyorBeltDataItem> extends HTMLElementEventMap {
    'arrowVisibilityChanged': JetElementCustomEventStrict<CConveyorBeltElement<K, D>['arrowVisibility']>;
    'itemsChanged': JetElementCustomEventStrict<CConveyorBeltElement<K, D>['items']>;
    'orientationChanged': JetElementCustomEventStrict<CConveyorBeltElement<K, D>['orientation']>;
    'scrollPositionChanged': JetElementCustomEventStrict<CConveyorBeltElement<K, D>['scrollPosition']>;
}
export interface CConveyorBeltElementSettableProperties<K extends string | number, D> extends JetSettableProperties {
    /**
     * <p>Indicates whether overflow content arrows are visible or hidden.
     *
     * <p>The default value of this property varies by theme. If the default value is 'auto', then the behavior varies by device.
     */
    arrowVisibility?: ConevyorBeltPreactWrapperProps<K, D>['arrowVisibility'];
    /**
     * An array of data items or a data provider that returns the items for the ConveyorBelt.
     */
    items?: ConevyorBeltPreactWrapperProps<K, D>['items'];
    /**
     * Specify the orientation of the conveyorBelt.
     * "horizontal" Orient the conveyorBelt horizontally.
     * "vertical" Orient the conveyorBelt vertically.
     */
    orientation?: ConevyorBeltPreactWrapperProps<K, D>['orientation'];
    /**
     * <p>Gets or sets the number of pixels that an element's content is scrolled from its initial position.
     *
     * <p>The default value of this property is 0.
     *
     * <p> There is no difference between LTR/RTL value assignment.
     * In both LTR and RTL values changes from 0 and max scroll position >=0  if we scroll to the end.
     * If we scroll to the beginning then the values changes from max scroll position >=0 to min scroll position = 0
     * When the value exceeds max/min the value is constrained to the max/min scroll position accordingly.
     */
    scrollPosition?: ConevyorBeltPreactWrapperProps<K, D>['scrollPosition'];
}
export interface CConveyorBeltElementSettablePropertiesLenient<K extends string | number, D> extends Partial<CConveyorBeltElementSettableProperties<K, D>> {
    [key: string]: any;
}
export interface ConveyorBeltIntrinsicProps extends Partial<Readonly<CConveyorBeltElementSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    onarrowVisibilityChanged?: (value: CConveyorBeltElementEventMap<any, any>['arrowVisibilityChanged']) => void;
    onitemsChanged?: (value: CConveyorBeltElementEventMap<any, any>['itemsChanged']) => void;
    onorientationChanged?: (value: CConveyorBeltElementEventMap<any, any>['orientationChanged']) => void;
    onscrollPositionChanged?: (value: CConveyorBeltElementEventMap<any, any>['scrollPositionChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-conveyor-belt': ConveyorBeltIntrinsicProps;
        }
    }
}
