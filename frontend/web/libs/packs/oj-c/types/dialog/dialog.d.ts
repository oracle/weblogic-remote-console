import { ExtendGlobalProps, PropertyChanged, Action, CancelableAction, ObservedGlobalProps, Slot } from 'ojs/ojvcomponent';
import { ComponentType } from 'preact';
import 'css!oj-c/dialog/dialog-styles.css';
import { CancelBehavior } from '@oracle/oraclejet-preact/UNSAFE_Dialog';
import { WindowOverlayPlacement } from '@oracle/oraclejet-preact/UNSAFE_WindowOverlay';
import { Coords, Offset } from '@oracle/oraclejet-preact/UNSAFE_Floating';
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
type Modality = 'modal' | 'modeless';
export type Position = {
    /**
     * @ojmetadata description "x coordinate"
     */
    x: number;
    /**
     * @ojmetadata description "y coordinate"
     */
    y: number;
};
type Dimensions = {
    /**
     * @ojmetadata description "element's width"
     */
    width: number;
    /**
     * @ojmetadata description "element's height"
     */
    height: number;
};
type DragMoveDetail = {
    /**
     * @ojmetadata description "original position of the dragged element"
     */
    originalPosition: Position;
    /**
     * @ojmetadata description "current position of the dragged element"
     */
    position: Position;
};
type ResizeDetail = {
    /**
     * @ojmetadata description "original position of the resized element"
     */
    originalPosition: Position;
    /**
     * @ojmetadata description "original dimensions of the resized element"
     */
    originalSize: Dimensions;
    /**
     * @ojmetadata description "current position of the resized element"
     */
    position: Position;
    /**
     * @ojmetadata description "current dimensions of the resized element"
     */
    size: Dimensions;
};
type OnCloseDetail = {
    /**
     * @ojmetadata description "reason for closing the dialog"
     */
    reason: 'escapeKey' | 'icon';
};
export type Props = ObservedGlobalProps<'aria-describedby' | 'aria-label' | 'aria-labelledby' | 'role' | 'id'> & {
    /**
     * @ojmetadata description "The content node to be shown within the Dialog header. If a header slot is not specified by the user, the dialog-title attribute will be used instead."
     */
    header?: Slot;
    /**
     * @ojmetadata description "The content node to be shown within the Dialog body."
     */
    body?: Slot;
    /**
     * @ojmetadata description "The content node to be shown within the Dialog footer."
     */
    footer?: Slot;
    /**
     * @ojmetadata description "Specifies the cancel behavior of the Dialog. Note that the cancelBehavior applies to both automatic and user-defined headers."
     * @ojmetadata displayName "Cancel Behavior"
     * @ojmetadata help "#cancelBehavior"
     * @ojmetadata propertyEditorValues {
     *     "icon": {
     *       "description": "A close icon will automatically be created. The dialog will close when it has focus and user presses the escape (ESC) key.",
     *       "displayName": "icon"
     *     },
     *     "escape": {
     *       "description": "The dialog will close when it has focus and user presses the escape (ESC) key. A close icon will not be created.",
     *       "displayName": "escape"
     *     },
     *    "none": {
     *       "description": "A close icon will not be created. No actions will be associated with the escape key.",
     *       "displayName": "none"
     *    }
     *  }
     */
    cancelBehavior?: CancelBehavior;
    /**
     * @ojmetadata description "Specifies title if header slot is not defined (custom header)."
     * @ojmetadata displayName "Dialog Title"
     * @ojmetadata help "#dialogTitle"
     */
    dialogTitle?: string;
    /**
     * @ojmetadata description "Specifies whether the Dialog is draggable."
     * @ojmetadata displayName "Drag Affordance"
     * @ojmetadata help "#dragAffordance"
     * @ojmetadata propertyEditorValues {
     *     "none": {
     *       "description": "The dialog will not be draggable.",
     *       "displayName": "none"
     *     },
     *     "header": {
     *       "description": "The dialog will be draggable by the header.",
     *       "displayName": "header"
     *     }
     *  }
     */
    dragAffordance?: 'none' | 'header';
    /**
     * @ojmetadata description "Specifies whether decorative stripe at the top is present."
     * @ojmetadata displayName "Header Decoration"
     * @ojmetadata help "#headerDecoration"
     * @ojmetadata propertyEditorValues {
     *     "on": {
     *       "description": "Renders a textured strip at the top of the dialog header in the Redwood theme.",
     *       "displayName": "on"
     *     },
     *     "off": {
     *       "description": "No decoration is rendered.",
     *       "displayName": "off"
     *     },
     *  }
     */
    headerDecoration?: 'off' | 'on';
    /**
     * @ojmetadata description "Specifies Dialog's launcher. After Dialog closes, it returns focus to the launcher."
     * @ojmetadata displayName "Launcher"
     * @ojmetadata help "#launcher"
     */
    launcher?: string | Element;
    /**
     * @ojmetadata description "Specifies modality of the Dialog."
     * @ojmetadata displayName "Modality"
     * @ojmetadata help "#modality"
     * @ojmetadata propertyEditorValues {
     *     "modal": {
     *       "description": "The dialog is modal. Interactions with other page elements are disabled. Modal dialogs overlay other page elements.",
     *       "displayName": "on"
     *     },
     *     "modeless": {
     *       "description": "Defines a modeless dialog.",
     *       "displayName": "off"
     *     },
     *  }
     */
    modality?: Modality;
    /**
     * @ojmetadata description "Specifies whether the Dialog is open."
     * @ojmetadata displayName "Opened"
     * @ojmetadata help "#opened"
     * @ojmetadata extension { webelement: { exceptionStatus: [ { type: "getterOnly"} ] } }
     */
    opened: boolean;
    /**
     * @ojmetadata description "Specifies whether the Dialog is resizable."
     * @ojmetadata displayName "Resize Behavior"
     * @ojmetadata help "#resizeBehavior"
     * @ojmetadata propertyEditorValues {
     *     "none": {
     *       "description": "The dialog will not be interactively resizable.",
     *       "displayName": "none"
     *     },
     *     "resizable": {
     *       "description": "	The dialog will be interactively resizable.",
     *       "displayName": "resizable"
     *     },
     *  }
     */
    resizeBehavior?: 'none' | 'resizable';
    /**
     * @ojmetadata description "Specifies Dialog's anchor. Dialog is placed relative to its anchor.
     * If not specified, it is placed relative to window."
     * @ojmetadata displayName "Anchor"
     * @ojmetadata help "#anchor"
     */
    anchor?: string | Element | Coords;
    /**
     * @ojmetadata description "Specifies the location the dialog will appear relative to another element. If not specified, the default dialog position is "center" on desktop and "bottom-start" on phone."
     * @ojmetadata displayName "Placement"
     * @ojmetadata help "#placement"
     */
    placement?: WindowOverlayPlacement;
    /**
     * @ojmetadata description "Specifies displacement of the Dialog from the anchor element placement along the specified axes. The offset object consists of mainAxis and crossAxis properties.
     * The direction in which these propertie are applied depends on the current value of the position property.
     * If a number is used, it represents the main axis. The <code>mainAxis</code> property represents the distance between the Popup and the anchor.
     * The <code>crossAxis</code> property represents the deviation in the opposite axis to the main axis - the skidding between the Popup and the anchor."
     * @ojmetadata displayName "Offset"
     * @ojmetadata help "#offset"
     */
    offset?: Offset;
    /**
     * @ojmetadata description "Triggered immediately after the Dialog opens."
     * @ojmetadata displayName "ojOpen"
     * @ojmetadata help "#event:open"
     */
    onOjOpen?: Action;
    /**
     * @ojmetadata description "Triggered immediately before the Dialog closes.
     * Call <code class="prettyprint">event.preventDefault()</code> in the event listener to veto the event synchronously, which prevents the Dialog from closing.
     * Call <code class="prettyprint">event.detail.accept(Promise.reject());</code> in the event listener to veto the event asynchronously, which prevents the Dialog from closing."
     *
     * @ojmetadata displayName "ojBeforeClose"
     * @ojmetadata help "#event:beforeClose"
     */
    onOjBeforeClose?: CancelableAction<OnCloseDetail>;
    /**
     * @ojmetadata description "Triggered immediately after the Dialog closes."
     * @ojmetadata displayName "ojClose"
     * @ojmetadata help "#event:close"
     */
    onOjClose?: Action;
    /**
     * @ojmetadata description "Triggered immediately after the Dialog receives focus."
     * @ojmetadata displayName "ojFocus"
     * @ojmetadata help "#event:onOjFocus"
     */
    onOjFocus?: Action;
    /**
     * @ojmetadata help "#event:openedChanged"
     */
    onOpenedChanged?: PropertyChanged<boolean>;
    /**
     * @ojmetadata description "Triggered immediately before the Dialog moves."
     * @ojmetadata displayName "ojDragStart"
     * @ojmetadata help "#event:onOjDragStart"
     */
    onOjDragStart?: Action<DragMoveDetail>;
    /**
     * @ojmetadata description "Triggered when the Dialog moves."
     * @ojmetadata displayName "ojDragMove"
     * @ojmetadata help "#event:onOjDragMove"
     */
    onOjDragMove?: Action<DragMoveDetail>;
    /**
     * @ojmetadata description "Triggered immediately after the Dialog stops moving."
     * @ojmetadata displayName "ojDragEnd"
     * @ojmetadata help "#event:onOjDragEnd"
     */
    onOjDragEnd?: Action<DragMoveDetail>;
    /**
     * @ojmetadata description "Triggered immediately before the Dialog resizes."
     * @ojmetadata displayName "ojResizeStart"
     * @ojmetadata help "#event:onOjResizeStart"
     */
    onOjResizeStart?: Action<ResizeDetail>;
    /**
     * @ojmetadata description "Triggered when the Dialog resizes."
     * @ojmetadata displayName "ojResize"
     * @ojmetadata help "#event:onOjResize"
     */
    onOjResize?: Action<ResizeDetail>;
    /**
     * @ojmetadata description "Triggered immediately after the Dialog stops resizing."
     * @ojmetadata displayName "ojResizeEnd"
     * @ojmetadata help "#event:onOjResizeEnd"
     */
    onOjResizeEnd?: Action<ResizeDetail>;
    /**
     * @ojmetadata description "Specifies width of the Dialog."
     * @ojmetadata displayName "Width"
     * @ojmetadata help "#width"
     */
    width?: Size;
    /**
     * @ojmetadata description "Specifies minWidth of the Dialog."
     * @ojmetadata displayName "Min Width"
     * @ojmetadata help "#minWidth"
     */
    minWidth?: Size;
    /**
     * @ojmetadata description "Specifies maxWidth of the Dialog."
     * @ojmetadata displayName "Max Width"
     * @ojmetadata help "#maxWidth"
     */
    maxWidth?: Size;
    /**
     * @ojmetadata description "Specifies height of the Dialog."
     * @ojmetadata displayName "Height"
     * @ojmetadata help "#height"
     */
    height?: Size;
    /**
     * @ojmetadata description "Specifies minHeight of the Dialog."
     * @ojmetadata displayName "Min Height"
     * @ojmetadata help "#minHeight"
     */
    minHeight?: Size;
    /**
     * @ojmetadata description "Specifies maxHeight of the Dialog."
     * @ojmetadata displayName "Max Height"
     * @ojmetadata help "#maxHeight"
     */
    maxHeight?: Size;
};
/**
 * This export corresponds to the Dialog Preact component. For the oj-c-dialog custom element, import CDialogElement instead.
 */
export declare const Dialog: ComponentType<ExtendGlobalProps<Props>>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-dialog custom element. For the Dialog Preact component, import Dialog instead.
 */
export interface CDialogElement extends JetElement<CDialogElementSettableProperties>, CDialogElementSettableProperties {
    addEventListener<T extends keyof CDialogElementEventMap>(type: T, listener: (this: HTMLElement, ev: CDialogElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CDialogElementSettableProperties>(property: T): CDialogElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CDialogElementSettableProperties>(property: T, value: CDialogElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CDialogElementSettableProperties>): void;
    setProperties(properties: CDialogElementSettablePropertiesLenient): void;
}
export namespace CDialogElement {
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
    interface ojDragStart extends CustomEvent<DragMoveDetail & {}> {
    }
    interface ojDragMove extends CustomEvent<DragMoveDetail & {}> {
    }
    interface ojDragEnd extends CustomEvent<DragMoveDetail & {}> {
    }
    interface ojResizeStart extends CustomEvent<ResizeDetail & {}> {
    }
    interface ojResize extends CustomEvent<ResizeDetail & {}> {
    }
    interface ojResizeEnd extends CustomEvent<ResizeDetail & {}> {
    }
    type anchorChanged = JetElementCustomEventStrict<CDialogElement['anchor']>;
    type cancelBehaviorChanged = JetElementCustomEventStrict<CDialogElement['cancelBehavior']>;
    type dialogTitleChanged = JetElementCustomEventStrict<CDialogElement['dialogTitle']>;
    type dragAffordanceChanged = JetElementCustomEventStrict<CDialogElement['dragAffordance']>;
    type headerDecorationChanged = JetElementCustomEventStrict<CDialogElement['headerDecoration']>;
    type heightChanged = JetElementCustomEventStrict<CDialogElement['height']>;
    type launcherChanged = JetElementCustomEventStrict<CDialogElement['launcher']>;
    type maxHeightChanged = JetElementCustomEventStrict<CDialogElement['maxHeight']>;
    type maxWidthChanged = JetElementCustomEventStrict<CDialogElement['maxWidth']>;
    type minHeightChanged = JetElementCustomEventStrict<CDialogElement['minHeight']>;
    type minWidthChanged = JetElementCustomEventStrict<CDialogElement['minWidth']>;
    type modalityChanged = JetElementCustomEventStrict<CDialogElement['modality']>;
    type offsetChanged = JetElementCustomEventStrict<CDialogElement['offset']>;
    type openedChanged = JetElementCustomEventStrict<CDialogElement['opened']>;
    type placementChanged = JetElementCustomEventStrict<CDialogElement['placement']>;
    type resizeBehaviorChanged = JetElementCustomEventStrict<CDialogElement['resizeBehavior']>;
    type widthChanged = JetElementCustomEventStrict<CDialogElement['width']>;
}
export interface CDialogElementEventMap extends HTMLElementEventMap {
    'ojOpen': CDialogElement.ojOpen;
    'ojBeforeClose': CDialogElement.ojBeforeClose;
    'ojClose': CDialogElement.ojClose;
    'ojFocus': CDialogElement.ojFocus;
    'ojDragStart': CDialogElement.ojDragStart;
    'ojDragMove': CDialogElement.ojDragMove;
    'ojDragEnd': CDialogElement.ojDragEnd;
    'ojResizeStart': CDialogElement.ojResizeStart;
    'ojResize': CDialogElement.ojResize;
    'ojResizeEnd': CDialogElement.ojResizeEnd;
    'anchorChanged': JetElementCustomEventStrict<CDialogElement['anchor']>;
    'cancelBehaviorChanged': JetElementCustomEventStrict<CDialogElement['cancelBehavior']>;
    'dialogTitleChanged': JetElementCustomEventStrict<CDialogElement['dialogTitle']>;
    'dragAffordanceChanged': JetElementCustomEventStrict<CDialogElement['dragAffordance']>;
    'headerDecorationChanged': JetElementCustomEventStrict<CDialogElement['headerDecoration']>;
    'heightChanged': JetElementCustomEventStrict<CDialogElement['height']>;
    'launcherChanged': JetElementCustomEventStrict<CDialogElement['launcher']>;
    'maxHeightChanged': JetElementCustomEventStrict<CDialogElement['maxHeight']>;
    'maxWidthChanged': JetElementCustomEventStrict<CDialogElement['maxWidth']>;
    'minHeightChanged': JetElementCustomEventStrict<CDialogElement['minHeight']>;
    'minWidthChanged': JetElementCustomEventStrict<CDialogElement['minWidth']>;
    'modalityChanged': JetElementCustomEventStrict<CDialogElement['modality']>;
    'offsetChanged': JetElementCustomEventStrict<CDialogElement['offset']>;
    'openedChanged': JetElementCustomEventStrict<CDialogElement['opened']>;
    'placementChanged': JetElementCustomEventStrict<CDialogElement['placement']>;
    'resizeBehaviorChanged': JetElementCustomEventStrict<CDialogElement['resizeBehavior']>;
    'widthChanged': JetElementCustomEventStrict<CDialogElement['width']>;
}
export interface CDialogElementSettableProperties extends JetSettableProperties {
    anchor?: Props['anchor'];
    cancelBehavior?: Props['cancelBehavior'];
    dialogTitle?: Props['dialogTitle'];
    dragAffordance?: Props['dragAffordance'];
    headerDecoration?: Props['headerDecoration'];
    height?: Props['height'];
    launcher?: Props['launcher'];
    maxHeight?: Props['maxHeight'];
    maxWidth?: Props['maxWidth'];
    minHeight?: Props['minHeight'];
    minWidth?: Props['minWidth'];
    modality?: Props['modality'];
    offset?: Props['offset'];
    opened: Props['opened'];
    placement?: Props['placement'];
    resizeBehavior?: Props['resizeBehavior'];
    width?: Props['width'];
}
export interface CDialogElementSettablePropertiesLenient extends Partial<CDialogElementSettableProperties> {
    [key: string]: any;
}
export interface DialogIntrinsicProps extends Partial<Readonly<CDialogElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    onojBeforeClose?: (value: CDialogElementEventMap['ojBeforeClose']) => void;
    onojClose?: (value: CDialogElementEventMap['ojClose']) => void;
    onojDragEnd?: (value: CDialogElementEventMap['ojDragEnd']) => void;
    onojDragMove?: (value: CDialogElementEventMap['ojDragMove']) => void;
    onojDragStart?: (value: CDialogElementEventMap['ojDragStart']) => void;
    onojFocus?: (value: CDialogElementEventMap['ojFocus']) => void;
    onojOpen?: (value: CDialogElementEventMap['ojOpen']) => void;
    onojResize?: (value: CDialogElementEventMap['ojResize']) => void;
    onojResizeEnd?: (value: CDialogElementEventMap['ojResizeEnd']) => void;
    onojResizeStart?: (value: CDialogElementEventMap['ojResizeStart']) => void;
    onanchorChanged?: (value: CDialogElementEventMap['anchorChanged']) => void;
    oncancelBehaviorChanged?: (value: CDialogElementEventMap['cancelBehaviorChanged']) => void;
    ondialogTitleChanged?: (value: CDialogElementEventMap['dialogTitleChanged']) => void;
    ondragAffordanceChanged?: (value: CDialogElementEventMap['dragAffordanceChanged']) => void;
    onheaderDecorationChanged?: (value: CDialogElementEventMap['headerDecorationChanged']) => void;
    onheightChanged?: (value: CDialogElementEventMap['heightChanged']) => void;
    onlauncherChanged?: (value: CDialogElementEventMap['launcherChanged']) => void;
    onmaxHeightChanged?: (value: CDialogElementEventMap['maxHeightChanged']) => void;
    onmaxWidthChanged?: (value: CDialogElementEventMap['maxWidthChanged']) => void;
    onminHeightChanged?: (value: CDialogElementEventMap['minHeightChanged']) => void;
    onminWidthChanged?: (value: CDialogElementEventMap['minWidthChanged']) => void;
    onmodalityChanged?: (value: CDialogElementEventMap['modalityChanged']) => void;
    onoffsetChanged?: (value: CDialogElementEventMap['offsetChanged']) => void;
    onopenedChanged?: (value: CDialogElementEventMap['openedChanged']) => void;
    onplacementChanged?: (value: CDialogElementEventMap['placementChanged']) => void;
    onresizeBehaviorChanged?: (value: CDialogElementEventMap['resizeBehaviorChanged']) => void;
    onwidthChanged?: (value: CDialogElementEventMap['widthChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-dialog': DialogIntrinsicProps;
        }
    }
}
