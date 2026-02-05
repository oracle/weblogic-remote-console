import { Action, CancelableAction, ExtendGlobalProps, PropertyChanged, Slot } from 'ojs/ojvcomponent';
import { ComponentChildren, ComponentType } from 'preact';
import 'css!oj-c/drawer-layout/drawer-layout-styles.css';
type Placement = 'start' | 'end' | 'bottom';
type OnCloseDetail = {
    /**
     * @ojmetadata description "edge from which the drawer slides into the layout."
     */
    edge: Placement;
    /**
     * @ojmetadata description "reason for closing the drawer"
     */
    reason: 'escapeKey';
};
type OnTransitionEndDetail = {
    /**
     * @ojmetadata description "edge from which the drawer slides into the layout."
     */
    edge: Placement;
    /**
     * @ojmetadata description "opened value"
     */
    value: boolean;
};
type Props = {
    /**
     * @ojmetadata description "The default slot is the content of the Drawer Popup."
     * @ojmetadata displayName "default"
     * @ojmetadata help "#Default"
     */
    children: ComponentChildren;
    /**
     * The content node to be shown within the Start Drawer
     */
    start?: Slot;
    /**
     * The content node to be shown within the End Drawer
     */
    end?: Slot;
    /**
     * The content node to be shown within the Bottom Drawer
     */
    bottom?: Slot;
    /**
     * @description
     * Specifies whether the Start drawer is open.
     *
     * @ojmetadata description "Specifies whether the Drawer is open."
     * @ojmetadata displayName "Start Opened"
     * @ojmetadata help "#startOpened"
     */
    startOpened?: boolean;
    /**
     * @description
     * Specifies whether the End drawer is open.
     *
     * @ojmetadata description "Specifies whether the Drawer is open."
     * @ojmetadata displayName "End Opened"
     * @ojmetadata help "#endOpened"
     */
    endOpened?: boolean;
    /**
     * @description
     * Specifies whether the Bottom drawer is open.
     *
     * @ojmetadata description "Specifies whether the Drawer is open."
     * @ojmetadata displayName "Bottom Opened"
     * @ojmetadata help "#bottomOpened"
     */
    bottomOpened?: boolean;
    /**
     * @description
     * Specifies display mode of the Start drawer.
     *
     * @ojmetadata description "Specifies display mode of the Start drawer."
     * @ojmetadata displayName "Start Display"
     * @ojmetadata help "#startDisplay"
     */
    startDisplay?: 'auto' | 'reflow' | 'overlay';
    /**
     * @description
     * Specifies display mode of the Start drawer.
     *
     * @ojmetadata description "Specifies display mode of the End drawer."
     * @ojmetadata displayName "End Display"
     * @ojmetadata help "#endDisplay"
     */
    endDisplay?: 'auto' | 'reflow' | 'overlay';
    /**
     * @description
     * Specifies display mode of the Bottom drawer.
     *
     * @ojmetadata description "Specifies display mode of the Start drawer."
     * @ojmetadata displayName "Bottom Display"
     * @ojmetadata help "#bottomDisplay"
     */
    bottomDisplay?: 'auto' | 'reflow' | 'overlay';
    /**
     * @description
     * Triggered immediately before the drawer closes.
     * Call <code class="prettyprint">event.preventDefault()</code> in the event listener to veto the event synchronously, which prevents the drawer from closing.
     * Call <code class="prettyprint">event.detail.accept(Promise.reject());</code> in the event listener to veto the event asynchronously, which prevents the drawer from closing.
     *
     * @ojmetadata description "Triggered immediately before the drawer closes"
     * @ojmetadata displayName "ojBeforeclose"
     * @ojmetadata help "#event:beforeClose"
     */
    onOjBeforeClose?: CancelableAction<OnCloseDetail>;
    /**
     * @description
     * Triggered immediately after the drawer closes.
     *
     * @ojmetadata description "Triggered immediately after the drawer closes"
     * @ojmetadata displayName "ojClose"
     * @ojmetadata help "#event:close"
     */
    onOjClose?: Action<OnTransitionEndDetail>;
    /**
     * @description
     * Triggered when the 'startOpened' property value changes.
     *
     * @ojmetadata help "#event:startOpenedChanged"
     */
    onStartOpenedChanged?: PropertyChanged<boolean>;
    /**
     * @description
     * Triggered when the 'endOpened' property value changes.
     *
     * @ojmetadata help "#event:endOpenedChanged"
     */
    onEndOpenedChanged?: PropertyChanged<boolean>;
    /**
     * @description
     * Triggered when the 'bottomOpened' property value changes.
     *
     * @ojmetadata help "#event:bottomOpenedChanged"
     */
    onBottomOpenedChanged?: PropertyChanged<boolean>;
};
/**
 * This export corresponds to the DrawerLayout Preact component. For the oj-c-drawer-layout custom element, import CDrawerLayoutElement instead.
 */
export declare const DrawerLayout: ComponentType<ExtendGlobalProps<Props>>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-drawer-layout custom element. For the DrawerLayout Preact component, import DrawerLayout instead.
 */
export interface CDrawerLayoutElement extends JetElement<CDrawerLayoutElementSettableProperties>, CDrawerLayoutElementSettableProperties {
    addEventListener<T extends keyof CDrawerLayoutElementEventMap>(type: T, listener: (this: HTMLElement, ev: CDrawerLayoutElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CDrawerLayoutElementSettableProperties>(property: T): CDrawerLayoutElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CDrawerLayoutElementSettableProperties>(property: T, value: CDrawerLayoutElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CDrawerLayoutElementSettableProperties>): void;
    setProperties(properties: CDrawerLayoutElementSettablePropertiesLenient): void;
}
export namespace CDrawerLayoutElement {
    interface ojBeforeClose extends CustomEvent<OnCloseDetail & {
        accept: (param: Promise<void>) => void;
    }> {
    }
    interface ojClose extends CustomEvent<OnTransitionEndDetail & {}> {
    }
    type bottomDisplayChanged = JetElementCustomEventStrict<CDrawerLayoutElement['bottomDisplay']>;
    type bottomOpenedChanged = JetElementCustomEventStrict<CDrawerLayoutElement['bottomOpened']>;
    type endDisplayChanged = JetElementCustomEventStrict<CDrawerLayoutElement['endDisplay']>;
    type endOpenedChanged = JetElementCustomEventStrict<CDrawerLayoutElement['endOpened']>;
    type startDisplayChanged = JetElementCustomEventStrict<CDrawerLayoutElement['startDisplay']>;
    type startOpenedChanged = JetElementCustomEventStrict<CDrawerLayoutElement['startOpened']>;
}
export interface CDrawerLayoutElementEventMap extends HTMLElementEventMap {
    'ojBeforeClose': CDrawerLayoutElement.ojBeforeClose;
    'ojClose': CDrawerLayoutElement.ojClose;
    'bottomDisplayChanged': JetElementCustomEventStrict<CDrawerLayoutElement['bottomDisplay']>;
    'bottomOpenedChanged': JetElementCustomEventStrict<CDrawerLayoutElement['bottomOpened']>;
    'endDisplayChanged': JetElementCustomEventStrict<CDrawerLayoutElement['endDisplay']>;
    'endOpenedChanged': JetElementCustomEventStrict<CDrawerLayoutElement['endOpened']>;
    'startDisplayChanged': JetElementCustomEventStrict<CDrawerLayoutElement['startDisplay']>;
    'startOpenedChanged': JetElementCustomEventStrict<CDrawerLayoutElement['startOpened']>;
}
export interface CDrawerLayoutElementSettableProperties extends JetSettableProperties {
    /**
     * Specifies display mode of the Bottom drawer.
     */
    bottomDisplay?: Props['bottomDisplay'];
    /**
     * Specifies whether the Bottom drawer is open.
     */
    bottomOpened?: Props['bottomOpened'];
    /**
     * Specifies display mode of the Start drawer.
     */
    endDisplay?: Props['endDisplay'];
    /**
     * Specifies whether the End drawer is open.
     */
    endOpened?: Props['endOpened'];
    /**
     * Specifies display mode of the Start drawer.
     */
    startDisplay?: Props['startDisplay'];
    /**
     * Specifies whether the Start drawer is open.
     */
    startOpened?: Props['startOpened'];
}
export interface CDrawerLayoutElementSettablePropertiesLenient extends Partial<CDrawerLayoutElementSettableProperties> {
    [key: string]: any;
}
export interface DrawerLayoutIntrinsicProps extends Partial<Readonly<CDrawerLayoutElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    /**
     * Triggered immediately before the drawer closes.
     * Call <code class="prettyprint">event.preventDefault()</code> in the event listener to veto the event synchronously, which prevents the drawer from closing.
     * Call <code class="prettyprint">event.detail.accept(Promise.reject());</code> in the event listener to veto the event asynchronously, which prevents the drawer from closing.
     */
    onojBeforeClose?: (value: CDrawerLayoutElementEventMap['ojBeforeClose']) => void;
    /**
     * Triggered immediately after the drawer closes.
     */
    onojClose?: (value: CDrawerLayoutElementEventMap['ojClose']) => void;
    onbottomDisplayChanged?: (value: CDrawerLayoutElementEventMap['bottomDisplayChanged']) => void;
    onbottomOpenedChanged?: (value: CDrawerLayoutElementEventMap['bottomOpenedChanged']) => void;
    onendDisplayChanged?: (value: CDrawerLayoutElementEventMap['endDisplayChanged']) => void;
    onendOpenedChanged?: (value: CDrawerLayoutElementEventMap['endOpenedChanged']) => void;
    onstartDisplayChanged?: (value: CDrawerLayoutElementEventMap['startDisplayChanged']) => void;
    onstartOpenedChanged?: (value: CDrawerLayoutElementEventMap['startOpenedChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-drawer-layout': DrawerLayoutIntrinsicProps;
        }
    }
}
