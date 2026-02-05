import { ExtendGlobalProps, PropertyChanged, Action, CancelableAction, ObservedGlobalProps } from 'ojs/ojvcomponent';
import { ComponentChildren, ComponentType } from 'preact';
import 'css!oj-c/popup/popup-styles.css';
import { InitialFocus, Tail, Modality, PopupPlacement, Variant } from '@oracle/oraclejet-preact/UNSAFE_Popup';
import { Coords } from '@oracle/oraclejet-preact/UNSAFE_Floating';
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
type PositionCollision = 'none' | 'flip' | 'fit' | 'flipfit' | 'flipcenter';
type OnCloseDetail = {
    /**
     * @ojmetadata description "reason for closing the popup"
     */
    reason: 'escapeKey' | 'outsideClick' | 'closeSkipLink';
};
type Offset = {
    x?: number;
    y?: number;
};
export type Props = ObservedGlobalProps<'aria-describedby' | 'aria-label' | 'aria-labelledby' | 'id' | 'role'> & {
    /**
     * @ojmetadata description "The default slot is the content of the Popup."
     * @ojmetadata displayName "default"
     * @ojmetadata help "#Default"
     */
    children?: ComponentChildren;
    /**
     * @description
     * Specifies whether the Popup is open.
     *
     * @ojmetadata description "Specifies whether the Popup is open."
     * @ojmetadata displayName "Opened"
     * @ojmetadata help "#opened"
     * @ojmetadata extension { webelement: { exceptionStatus: [ { type: "getterOnly"} ] } }
     */
    opened: boolean;
    /**
     * @description
     * Specifies Popup's launcher. After Popup closes, it returns focus to launcher.
     *
     * @ojmetadata description "Specifies Popup's launcher. After Popup closes, it returns focus to the launcher."
     * @ojmetadata displayName "Launcher"
     * @ojmetadata help "#launcher"
     */
    launcher?: string | Element;
    /**
     * @description
     * Specifies Popup's anchor. Popup is placed relative to its anchor.
     *
     * @ojmetadata description "Specifies Popup's anchor. Popup is placed relative to its anchor."
     * @ojmetadata displayName "Anchor"
     * @ojmetadata help "#anchor"
     */
    anchor?: string | Element | Coords;
    /**
     * @description
     * <p>Specifies the location the popup will appear relative to another element.</p>
     *
     * <p>If not specified, the default popup position is "center" on desktop and "bottom-start" on phone.</p>
     *
     * @ojmetadata description "Specifies the location the popup will appear relative to another element."
     * @ojmetadata displayName "Placement"
     * @ojmetadata help "#placement"
     */
    placement?: PopupPlacement;
    /**
     * @description
     * Specifies modality of the Popup.
     *
     * @ojmetadata description "Specifies modality of the Popup."
     * @ojmetadata displayName "Modality"
     * @ojmetadata help "#modality"
     */
    modality?: Modality;
    /**
     * @description
     * Specifies the auto dismissal behavior.
     *
     * @ojmetadata description "Specifies the auto dismissal behavior."
     * @ojmetadata displayName "Auto Dismiss"
     * @ojmetadata help "#autoDismiss"
     */
    autoDismiss?: 'none' | 'focusLoss';
    /**
     * @description
     * Specifies Popup's tail. Simple tail is an arrow pointing to Popup's anchor.
     *
     * @ojmetadata description "Specifies Popup's tail. Simple tail is an arrow pointing to Popup's anchor."
     * @ojmetadata displayName "Tail"
     * @ojmetadata help "#tail"
     */
    tail?: Tail;
    /**
     * @description
     * Specifies Popup's style variant. If <code class="prettyprint">unstyled</code> is set, standard styles are not applied.
     *
     * @ojmetadata description "Specifies Popup's style variant."
     * @ojmetadata displayName "Variant"
     * @ojmetadata help "#variant"
     */
    variant?: Variant;
    /**
     * @description
     * Specifies if the Popup sets focus to its content when initially open.
     *
     * @ojmetadata description "Specifies if the Popup sets focus to its content when initially open."
     * @ojmetadata displayName "Initial Focus"
     * @ojmetadata help "#initialFocus"
     */
    initialFocus?: InitialFocus;
    /**
     * @description
     * Specifies displacement of the Popup from the anchor element along the specified axes.
     * The offset object consists of <code class="prettyprint">x</code> and <code class="prettyprint">y</code> properties.
     *
     * The <code>x</code> property represents horizontal diviation.
     * The <code>y</code> property represents vertical deviation.
     *
     * @ojmetadata description "Specifies displacement of the Popup from the anchor element along the specified axes."
     * @ojmetadata displayName "Offset"
     * @ojmetadata help "#offset"
     */
    offset?: Offset;
    /**
     * @description
     * Specifies rule for alternate placement alignment.
     *
     * @ojmetadata description "Specifies rule for alternate placement alignment."
     * @ojmetadata displayName "Collision"
     * @ojmetadata help "#collision"
     */
    collision?: PositionCollision;
    /**
     * @description
     * Triggered when 'opened' property changes.
     *
     * @ojmetadata help "#onOpenedChanged"
     */
    onOpenedChanged?: PropertyChanged<boolean>;
    /**
     * @description
     * Triggered immediately after the popup opens.
     *
     * @ojmetadata description "Triggered immediately after the popup opens."
     * @ojmetadata displayName "ojOpen"
     * @ojmetadata help "#event:open"
     */
    onOjOpen?: Action;
    /**
     * @description
     * Triggered immediately before the popup closes.
     * Call <code class="prettyprint">event.preventDefault()</code> in the event listener to veto the event synchronously, which prevents the popup from closing.
     * Call <code class="prettyprint">event.detail.accept(Promise.reject());</code> in the event listener to veto the event asynchronously, which prevents the popup from closing.
     *
     * @ojmetadata description "Triggered immediately before the popup closes."
     * @ojmetadata displayName "ojBeforeClose"
     * @ojmetadata help "#event:beforeClose"
     */
    onOjBeforeClose?: CancelableAction<OnCloseDetail>;
    /**
     * @description
     * Triggered immediately after the popup closes.
     *
     * @ojmetadata description "Triggered immediately after the popup closes."
     * @ojmetadata displayName "ojClose"
     * @ojmetadata help "#event:close"
     */
    onOjClose?: Action;
    /**
     * @description
     * Triggered immediately after the popup receives focus.
     *
     * @ojmetadata description "Triggered immediately after the popup receives focus."
     * @ojmetadata displayName "ojFocus"
     * @ojmetadata help "#event:onOjFocus"
     */
    onOjFocus?: Action;
    /**
     * @description
     * Specifies width of the Popup content.
     *
     * @ojmetadata description "Specifies width of the Popup content."
     * @ojmetadata displayName "Width"
     * @ojmetadata help "#width"
     */
    width?: Size;
    /**
     * @description
     * Specifies minWidth of the Popup content.
     *
     * @ojmetadata description "Specifies minWidth of the Popup content."
     * @ojmetadata displayName "Min Width"
     * @ojmetadata help "#minWidth"
     */
    minWidth?: Size;
    /**
     * @description
     * Specifies maxWidth of the Popup content.
     *
     * @ojmetadata description "Specifies maxWidth of the Popup content."
     * @ojmetadata displayName "Max Width"
     * @ojmetadata help "#maxWidth"
     */
    maxWidth?: Size;
    /**
     * @description
     * Specifies height of the Popup content.
     *
     * @ojmetadata description "Specifies height of the Popup content."
     * @ojmetadata displayName "Height"
     * @ojmetadata help "#height"
     */
    height?: Size;
    /**
     * @description
     * Specifies minHeight of the Popup content.
     *
     * @ojmetadata description "Specifies minHeight of the Popup content."
     * @ojmetadata displayName "Min Height"
     * @ojmetadata help "#minHeight"
     */
    minHeight?: Size;
    /**
     * @description
     * Specifies maxHeight of the Popup content.
     *
     * @ojmetadata description "Specifies maxHeight of the Popup content."
     * @ojmetadata displayName "Max Height"
     * @ojmetadata help "#maxHeight"
     */
    maxHeight?: Size;
    /**
     * @description
     * Specifies background color of the Popup.
     *
     * @ojmetadata description "Specifies background color of the Popup."
     * @ojmetadata displayName "Background Color"
     * @ojmetadata help "#backgroundColor"
     */
    backgroundColor?: string;
};
/**
 * This export corresponds to the Popup Preact component. For the oj-c-popup custom element, import CPopupElement instead.
 */
export declare const Popup: ComponentType<ExtendGlobalProps<Props>>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-popup custom element. For the Popup Preact component, import Popup instead.
 */
export interface CPopupElement extends JetElement<CPopupElementSettableProperties>, CPopupElementSettableProperties {
    addEventListener<T extends keyof CPopupElementEventMap>(type: T, listener: (this: HTMLElement, ev: CPopupElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CPopupElementSettableProperties>(property: T): CPopupElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CPopupElementSettableProperties>(property: T, value: CPopupElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CPopupElementSettableProperties>): void;
    setProperties(properties: CPopupElementSettablePropertiesLenient): void;
}
export namespace CPopupElement {
    interface ojOpen extends CustomEvent<{}> {
    }
    interface ojBeforeClose extends CustomEvent<OnCloseDetail & {
        accept: (param: Promise<void>) => void;
    }> {
    }
    interface ojClose extends CustomEvent<{}> {
    }
    interface ojFocus extends CustomEvent<{}> {
    }
    type anchorChanged = JetElementCustomEventStrict<CPopupElement['anchor']>;
    type autoDismissChanged = JetElementCustomEventStrict<CPopupElement['autoDismiss']>;
    type backgroundColorChanged = JetElementCustomEventStrict<CPopupElement['backgroundColor']>;
    type collisionChanged = JetElementCustomEventStrict<CPopupElement['collision']>;
    type heightChanged = JetElementCustomEventStrict<CPopupElement['height']>;
    type initialFocusChanged = JetElementCustomEventStrict<CPopupElement['initialFocus']>;
    type launcherChanged = JetElementCustomEventStrict<CPopupElement['launcher']>;
    type maxHeightChanged = JetElementCustomEventStrict<CPopupElement['maxHeight']>;
    type maxWidthChanged = JetElementCustomEventStrict<CPopupElement['maxWidth']>;
    type minHeightChanged = JetElementCustomEventStrict<CPopupElement['minHeight']>;
    type minWidthChanged = JetElementCustomEventStrict<CPopupElement['minWidth']>;
    type modalityChanged = JetElementCustomEventStrict<CPopupElement['modality']>;
    type offsetChanged = JetElementCustomEventStrict<CPopupElement['offset']>;
    type openedChanged = JetElementCustomEventStrict<CPopupElement['opened']>;
    type placementChanged = JetElementCustomEventStrict<CPopupElement['placement']>;
    type tailChanged = JetElementCustomEventStrict<CPopupElement['tail']>;
    type variantChanged = JetElementCustomEventStrict<CPopupElement['variant']>;
    type widthChanged = JetElementCustomEventStrict<CPopupElement['width']>;
}
export interface CPopupElementEventMap extends HTMLElementEventMap {
    'ojOpen': CPopupElement.ojOpen;
    'ojBeforeClose': CPopupElement.ojBeforeClose;
    'ojClose': CPopupElement.ojClose;
    'ojFocus': CPopupElement.ojFocus;
    'anchorChanged': JetElementCustomEventStrict<CPopupElement['anchor']>;
    'autoDismissChanged': JetElementCustomEventStrict<CPopupElement['autoDismiss']>;
    'backgroundColorChanged': JetElementCustomEventStrict<CPopupElement['backgroundColor']>;
    'collisionChanged': JetElementCustomEventStrict<CPopupElement['collision']>;
    'heightChanged': JetElementCustomEventStrict<CPopupElement['height']>;
    'initialFocusChanged': JetElementCustomEventStrict<CPopupElement['initialFocus']>;
    'launcherChanged': JetElementCustomEventStrict<CPopupElement['launcher']>;
    'maxHeightChanged': JetElementCustomEventStrict<CPopupElement['maxHeight']>;
    'maxWidthChanged': JetElementCustomEventStrict<CPopupElement['maxWidth']>;
    'minHeightChanged': JetElementCustomEventStrict<CPopupElement['minHeight']>;
    'minWidthChanged': JetElementCustomEventStrict<CPopupElement['minWidth']>;
    'modalityChanged': JetElementCustomEventStrict<CPopupElement['modality']>;
    'offsetChanged': JetElementCustomEventStrict<CPopupElement['offset']>;
    'openedChanged': JetElementCustomEventStrict<CPopupElement['opened']>;
    'placementChanged': JetElementCustomEventStrict<CPopupElement['placement']>;
    'tailChanged': JetElementCustomEventStrict<CPopupElement['tail']>;
    'variantChanged': JetElementCustomEventStrict<CPopupElement['variant']>;
    'widthChanged': JetElementCustomEventStrict<CPopupElement['width']>;
}
export interface CPopupElementSettableProperties extends JetSettableProperties {
    /**
     * Specifies Popup's anchor. Popup is placed relative to its anchor.
     */
    anchor?: Props['anchor'];
    /**
     * Specifies the auto dismissal behavior.
     */
    autoDismiss?: Props['autoDismiss'];
    /**
     * Specifies background color of the Popup.
     */
    backgroundColor?: Props['backgroundColor'];
    /**
     * Specifies rule for alternate placement alignment.
     */
    collision?: Props['collision'];
    /**
     * Specifies height of the Popup content.
     */
    height?: Props['height'];
    /**
     * Specifies if the Popup sets focus to its content when initially open.
     */
    initialFocus?: Props['initialFocus'];
    /**
     * Specifies Popup's launcher. After Popup closes, it returns focus to launcher.
     */
    launcher?: Props['launcher'];
    /**
     * Specifies maxHeight of the Popup content.
     */
    maxHeight?: Props['maxHeight'];
    /**
     * Specifies maxWidth of the Popup content.
     */
    maxWidth?: Props['maxWidth'];
    /**
     * Specifies minHeight of the Popup content.
     */
    minHeight?: Props['minHeight'];
    /**
     * Specifies minWidth of the Popup content.
     */
    minWidth?: Props['minWidth'];
    /**
     * Specifies modality of the Popup.
     */
    modality?: Props['modality'];
    /**
     * Specifies displacement of the Popup from the anchor element along the specified axes.
     * The offset object consists of <code class="prettyprint">x</code> and <code class="prettyprint">y</code> properties.
     *
     * The <code>x</code> property represents horizontal diviation.
     * The <code>y</code> property represents vertical deviation.
     */
    offset?: Props['offset'];
    /**
     * Specifies whether the Popup is open.
     */
    opened: Props['opened'];
    /**
     * <p>Specifies the location the popup will appear relative to another element.</p>
     *
     * <p>If not specified, the default popup position is "center" on desktop and "bottom-start" on phone.</p>
     */
    placement?: Props['placement'];
    /**
     * Specifies Popup's tail. Simple tail is an arrow pointing to Popup's anchor.
     */
    tail?: Props['tail'];
    /**
     * Specifies Popup's style variant. If <code class="prettyprint">unstyled</code> is set, standard styles are not applied.
     */
    variant?: Props['variant'];
    /**
     * Specifies width of the Popup content.
     */
    width?: Props['width'];
}
export interface CPopupElementSettablePropertiesLenient extends Partial<CPopupElementSettableProperties> {
    [key: string]: any;
}
export interface PopupIntrinsicProps extends Partial<Readonly<CPopupElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    /**
     * Triggered immediately before the popup closes.
     * Call <code class="prettyprint">event.preventDefault()</code> in the event listener to veto the event synchronously, which prevents the popup from closing.
     * Call <code class="prettyprint">event.detail.accept(Promise.reject());</code> in the event listener to veto the event asynchronously, which prevents the popup from closing.
     */
    onojBeforeClose?: (value: CPopupElementEventMap['ojBeforeClose']) => void;
    /**
     * Triggered immediately after the popup closes.
     */
    onojClose?: (value: CPopupElementEventMap['ojClose']) => void;
    /**
     * Triggered immediately after the popup receives focus.
     */
    onojFocus?: (value: CPopupElementEventMap['ojFocus']) => void;
    /**
     * Triggered immediately after the popup opens.
     */
    onojOpen?: (value: CPopupElementEventMap['ojOpen']) => void;
    onanchorChanged?: (value: CPopupElementEventMap['anchorChanged']) => void;
    onautoDismissChanged?: (value: CPopupElementEventMap['autoDismissChanged']) => void;
    onbackgroundColorChanged?: (value: CPopupElementEventMap['backgroundColorChanged']) => void;
    oncollisionChanged?: (value: CPopupElementEventMap['collisionChanged']) => void;
    onheightChanged?: (value: CPopupElementEventMap['heightChanged']) => void;
    oninitialFocusChanged?: (value: CPopupElementEventMap['initialFocusChanged']) => void;
    onlauncherChanged?: (value: CPopupElementEventMap['launcherChanged']) => void;
    onmaxHeightChanged?: (value: CPopupElementEventMap['maxHeightChanged']) => void;
    onmaxWidthChanged?: (value: CPopupElementEventMap['maxWidthChanged']) => void;
    onminHeightChanged?: (value: CPopupElementEventMap['minHeightChanged']) => void;
    onminWidthChanged?: (value: CPopupElementEventMap['minWidthChanged']) => void;
    onmodalityChanged?: (value: CPopupElementEventMap['modalityChanged']) => void;
    onoffsetChanged?: (value: CPopupElementEventMap['offsetChanged']) => void;
    onopenedChanged?: (value: CPopupElementEventMap['openedChanged']) => void;
    onplacementChanged?: (value: CPopupElementEventMap['placementChanged']) => void;
    ontailChanged?: (value: CPopupElementEventMap['tailChanged']) => void;
    onvariantChanged?: (value: CPopupElementEventMap['variantChanged']) => void;
    onwidthChanged?: (value: CPopupElementEventMap['widthChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-popup': PopupIntrinsicProps;
        }
    }
}
