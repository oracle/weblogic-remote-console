import { Action, CancelableAction, ExtendGlobalProps, PropertyChanged, ObservedGlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren, ComponentType } from 'preact';
import 'css!oj-c/drawer-popup/drawer-popup-styles.css';
type OnCloseDetail = {
    reason: 'outsideClick' | 'escapeKey' | 'swipe';
};
type Props = ObservedGlobalProps<'aria-describedby' | 'aria-label' | 'aria-labelledby' | 'id'> & {
    /**
     * @ojmetadata description "The default slot is the content of the Drawer Popup."
     * @ojmetadata displayName "default"
     * @ojmetadata help "#Default"
     */
    children: ComponentChildren;
    /**
     * @description
     * Specifies whether the Drawer is open.
     *
     * @ojmetadata description "Specifies whether the Drawer is open."
     * @ojmetadata displayName "Opened"
     * @ojmetadata help "#opened"
     * @ojmetadata extension {
     *    "vbdt" : {
     *       "temporaryOverride": {}
     *    }
     * }
     */
    opened: boolean;
    /**
     * @description
     * Specifies the modality of the drawer.
     * Supported detail values are:
     * <p><code>modal</code>, <code>modeless</code></p>
     *
     * @ojmetadata description "Controls the modality of the drawer."
     * @ojmetadata displayName "Modality"
     * @ojmetadata help "#modality"
     */
    modality?: 'modal' | 'modeless';
    /**
     * @description
     * Specifies at what edge the drawer opens.
     * Supported values are:
     * <p><code>start</code>, <code>end</code>, <code>bottom</code></p>
     * Default is <code>start</code>.
     *
     * @ojmetadata description "Specifies at what edge the drawer opens."
     * @ojmetadata displayName "Edge"
     * @ojmetadata help "#edge"
     */
    edge?: 'start' | 'end' | 'bottom';
    /**
     * @description
     * Specifies whether a click on the scrim closes the drawer.
     * Supported values are:
     * <p><code>focus-loss</code>, <code>none</code></p>
     * Default is <code>focus-loss</code>.
     *
     * @ojmetadata description "Specifies the close auto-dismiss behaviour to close the drawer."
     * @ojmetadata displayName "Auto Dismiss"
     * @ojmetadata help "#autoDismiss"
     */
    autoDismiss?: 'focus-loss' | 'none';
    /**
     * @description
     * Specifies whether a gesture closes the drawer.
     * Supported values are:
     * <p><code>swipe</code>, <code>none</code></p>
     * Default is <code>swipe</code>.
     *
     * @ojmetadata description "Specifies whether a gesture closes the drawer."
     * @ojmetadata displayName "Close Gesture"
     * @ojmetadata help "#closeGesture"
     */
    closeGesture?: 'swipe' | 'none';
    /**
     * @description
     * Triggered immediately before the drawer closes.
     * Call <code class="prettyprint">event.preventDefault()</code> in the event listener to veto the event synchronously, which prevents the drawer from closing.
     * Call <code class="prettyprint">event.detail.accept(Promise.reject());</code> in the event listener to veto the event asynchronously, which prevents the drawer from closing.
     *
     * @ojmetadata description "Triggered immediately before the drawer closes"
     * @ojmetadata displayName "ojBeforeClose"
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
    onOjClose?: Action;
    /**
     * @description
     * Triggered when the 'opened' property value changes.
     *
     * @ojmetadata help "#event:openedChanged"
     */
    onOpenedChanged?: PropertyChanged<boolean>;
    /**
     * @description
     * Specifies background color of the Drawer.
     *
     * @ojmetadata description "Specifies background color of the Drawer."
     * @ojmetadata displayName "Background Color"
     * @ojmetadata help "#backgroundColor"
     */
    backgroundColor?: string;
};
/**
 * This export corresponds to the DrawerPopup Preact component. For the oj-c-drawer-popup custom element, import CDrawerPopupElement instead.
 */
export declare const DrawerPopup: ComponentType<ExtendGlobalProps<Props>>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-drawer-popup custom element. For the DrawerPopup Preact component, import DrawerPopup instead.
 */
export interface CDrawerPopupElement extends JetElement<CDrawerPopupElementSettableProperties>, CDrawerPopupElementSettableProperties {
    addEventListener<T extends keyof CDrawerPopupElementEventMap>(type: T, listener: (this: HTMLElement, ev: CDrawerPopupElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CDrawerPopupElementSettableProperties>(property: T): CDrawerPopupElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CDrawerPopupElementSettableProperties>(property: T, value: CDrawerPopupElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CDrawerPopupElementSettableProperties>): void;
    setProperties(properties: CDrawerPopupElementSettablePropertiesLenient): void;
}
export namespace CDrawerPopupElement {
    interface ojBeforeClose extends CustomEvent<OnCloseDetail & {
        accept: (param: Promise<void>) => void;
    }> {
    }
    interface ojClose extends CustomEvent<{}> {
    }
    type autoDismissChanged = JetElementCustomEventStrict<CDrawerPopupElement['autoDismiss']>;
    type backgroundColorChanged = JetElementCustomEventStrict<CDrawerPopupElement['backgroundColor']>;
    type closeGestureChanged = JetElementCustomEventStrict<CDrawerPopupElement['closeGesture']>;
    type edgeChanged = JetElementCustomEventStrict<CDrawerPopupElement['edge']>;
    type modalityChanged = JetElementCustomEventStrict<CDrawerPopupElement['modality']>;
    type openedChanged = JetElementCustomEventStrict<CDrawerPopupElement['opened']>;
}
export interface CDrawerPopupElementEventMap extends HTMLElementEventMap {
    'ojBeforeClose': CDrawerPopupElement.ojBeforeClose;
    'ojClose': CDrawerPopupElement.ojClose;
    'autoDismissChanged': JetElementCustomEventStrict<CDrawerPopupElement['autoDismiss']>;
    'backgroundColorChanged': JetElementCustomEventStrict<CDrawerPopupElement['backgroundColor']>;
    'closeGestureChanged': JetElementCustomEventStrict<CDrawerPopupElement['closeGesture']>;
    'edgeChanged': JetElementCustomEventStrict<CDrawerPopupElement['edge']>;
    'modalityChanged': JetElementCustomEventStrict<CDrawerPopupElement['modality']>;
    'openedChanged': JetElementCustomEventStrict<CDrawerPopupElement['opened']>;
}
export interface CDrawerPopupElementSettableProperties extends JetSettableProperties {
    /**
     * Specifies whether a click on the scrim closes the drawer.
     * Supported values are:
     * <p><code>focus-loss</code>, <code>none</code></p>
     * Default is <code>focus-loss</code>.
     */
    autoDismiss?: Props['autoDismiss'];
    /**
     * Specifies background color of the Drawer.
     */
    backgroundColor?: Props['backgroundColor'];
    /**
     * Specifies whether a gesture closes the drawer.
     * Supported values are:
     * <p><code>swipe</code>, <code>none</code></p>
     * Default is <code>swipe</code>.
     */
    closeGesture?: Props['closeGesture'];
    /**
     * Specifies at what edge the drawer opens.
     * Supported values are:
     * <p><code>start</code>, <code>end</code>, <code>bottom</code></p>
     * Default is <code>start</code>.
     */
    edge?: Props['edge'];
    /**
     * Specifies the modality of the drawer.
     * Supported detail values are:
     * <p><code>modal</code>, <code>modeless</code></p>
     */
    modality?: Props['modality'];
    /**
     * Specifies whether the Drawer is open.
     */
    opened: Props['opened'];
}
export interface CDrawerPopupElementSettablePropertiesLenient extends Partial<CDrawerPopupElementSettableProperties> {
    [key: string]: any;
}
export interface DrawerPopupIntrinsicProps extends Partial<Readonly<CDrawerPopupElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    /**
     * Triggered immediately before the drawer closes.
     * Call <code class="prettyprint">event.preventDefault()</code> in the event listener to veto the event synchronously, which prevents the drawer from closing.
     * Call <code class="prettyprint">event.detail.accept(Promise.reject());</code> in the event listener to veto the event asynchronously, which prevents the drawer from closing.
     */
    onojBeforeClose?: (value: CDrawerPopupElementEventMap['ojBeforeClose']) => void;
    /**
     * Triggered immediately after the drawer closes.
     */
    onojClose?: (value: CDrawerPopupElementEventMap['ojClose']) => void;
    onautoDismissChanged?: (value: CDrawerPopupElementEventMap['autoDismissChanged']) => void;
    onbackgroundColorChanged?: (value: CDrawerPopupElementEventMap['backgroundColorChanged']) => void;
    oncloseGestureChanged?: (value: CDrawerPopupElementEventMap['closeGestureChanged']) => void;
    onedgeChanged?: (value: CDrawerPopupElementEventMap['edgeChanged']) => void;
    onmodalityChanged?: (value: CDrawerPopupElementEventMap['modalityChanged']) => void;
    onopenedChanged?: (value: CDrawerPopupElementEventMap['openedChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-drawer-popup': DrawerPopupIntrinsicProps;
        }
    }
}
