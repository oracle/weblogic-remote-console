/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ExtendGlobalProps, Action, Bubbles, ObservedGlobalProps, Slot } from 'ojs/ojvcomponent';
import { Button as PreactButton } from '@oracle/oraclejet-preact/UNSAFE_Button';
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
import { ComponentProps, Ref, ComponentType } from 'preact';
import 'css!oj-c/button/button-styles.css';
type PreactButtonProps = ComponentProps<typeof PreactButton>;
type Props = ObservedGlobalProps<'aria-describedby' | 'aria-label'> & {
    /**
     * @ojmetadata description "Text to show in the button."
     * @ojmetadata help "#label"
     * @ojmetadata required
     * @ojmetadata translatable
     */
    label: string;
    /**
     * @ojmetadata description "Text to show in the tooltip. This overrides the default tooltip that renders the label when in icon mode."
     * @ojmetadata help "#tooltip"
     * @ojmetadata translatable
     */
    tooltip?: string;
    /**
     * @ojmetadata description "The startIcon slot is the button's start icon. The oj-c-button element accepts DOM nodes as children with the startIcon slot."
     * @ojmetadata help "#startIcon"
     */
    startIcon?: Slot;
    /**
     * @ojmetadata description "The endIcon slot is the button's end icon. The oj-c-button element accepts DOM nodes as children with the endIcon slot."
     * @ojmetadata help "#endIcon"
     */
    endIcon?: Slot;
    /**
     * @ojmetadata description "Specifies that the button element should be disabled."
     * @ojmetadata help "#disabled"
     */
    disabled?: boolean;
    /**
     * @ojmetadata description "Specifies that the button style width"
     * @ojmetadata help "#width"
     */
    width?: Size;
    /**
     * @ojmetadata description "Display just the label, the icons, or all.  Label is used as tooltip and should be set in all cases."
     * @ojmetadata help "#display"
     * @ojmetadata propertyEditorValues {
     *     "all": {
     *       "description": "Display both the label and icons.",
     *       "displayName": "All"
     *     },
     *     "icons": {
     *       "description": "Display only the icons.",
     *       "displayName": "Icons"
     *     },
     *    "label": {
     *       "description": "Display only the text label.",
     *       "displayName": "label"
     *    }
     *  }
     */
    display?: 'all' | 'icons' | 'label';
    /**
     * @ojmetadata description "Size of button"
     * @ojmetadata help "#size"
     * @ojmetadata propertyEditorValues {
     *     "xs": {
     *       "description": "Display an extra small button.  Only supported for component developers with ghost chroming in icon display mode.",
     *       "displayName": "Extra Small"
     *     },
     *     "sm": {
     *       "description": "Display a small button.",
     *       "displayName": "Small"
     *     },
     *     "md": {
     *       "description": "Display a default size button.",
     *       "displayName": "Medium"
     *     },
     *    "lg": {
     *       "description": "Display a large button.",
     *       "displayName": "Large"
     *    }
     *  }
     */
    size?: 'xs' | 'sm' | 'md' | 'lg';
    /**
     * @ojmetadata description "Specifies whether the button is attached to an edge. For example setting edge='bottom' can be used to attach a button to the bottom of a card.  The button is then stretched to 100% width, and borders adjusted."
     * @ojmetadata help "#edge"
     * @ojmetadata propertyEditorValues {
     *     "none": {
     *       "description": "Display a default standalone button.",
     *       "displayName": "Small"
     *     },
     *     "bottom": {
     *       "description": "Stretch the button to 100% width and adjust borders for usage at bottom of container.",
     *       "displayName": "Bottom"
     *     }
     *  }
     */
    edge?: PreactButtonProps['edge'];
    /**
     * @ojmetadata description "Indicates in what states the button has variants in background and border. "
     * @ojmetadata help "#chroming"
     * @ojmetadata propertyEditorValues {
     *     "ghost": {
     *       "description": "Ghost buttons are the least prominent variation. Ghost buttons are useful for performing low-priority tasks, such as manipulating the UI.",
     *       "displayName": "Ghost"
     *     },
     *     "borderless": {
     *       "description": "Borderless buttons are a more prominent variation. Borderless buttons are useful for supplemental actions that require minimal emphasis.",
     *       "displayName": "Borderless"
     *     },
     *     "outlined": {
     *       "description": "Outlined buttons are salient, but lighter weight than solid buttons. Outlined buttons are useful for secondary actions.",
     *       "displayName": "Outlined"
     *     },
     *     "solid": {
     *       "description": "Solid buttons stand out, and direct the user's attention to the most important actions in the UI.",
     *       "displayName": "Solid"
     *     },
     *     "callToAction": {
     *       "description": "A Call To Action (CTA) button guides the user to take or complete the action that is the main goal of the page or page section. There should only be one CTA button on a page at any given time.",
     *       "displayName": "Call To Action"
     *     },
     *     "danger": {
     *       "description": "A Danger button alerts the user to a dangerous situation.",
     *       "displayName": "Danger"
     *     }
     *   }
     */
    chroming?: PreactButtonProps['variant'];
    /**
     * @ojmetadata description "Triggered when a button is clicked, whether by keyboard, mouse,
     *    or touch events. To meet accessibility requirements, the only supported way to react
     *    to the click of a button is to listen for this event."
     * @ojmetadata eventGroup "common"
     * @ojmetadata help "#event:action"
     */
    onOjAction?: Action & Bubbles;
};
type ButtonHandle = {
    focus: () => void;
    blur: () => void;
    click: () => void;
};
/**
 * @classdesc
 * <h3 id="buttonOverview-section">
 *   JET Button
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#buttonOverview-section"></a>
 * </h3>
 *
 * <p>Description: Themeable, WAI-ARIA-compliant push buttons, with appropriate styles for hover, active, and disabled.
 *
 * <pre class="prettyprint"><code>&lt;oj-c-button id="myButton" label="My Button">
 * &lt;/oj-c-button>
 * &lt;oj-c-button label="start icon">
 *   &lt;span slot='startIcon' class='myIconClass'>&lt;/span>
 * &lt;/oj-c-button>
 *  &lt;oj-c-button label="end icon">
 *   &lt;span slot='endIcon' class='myIconClass'>&lt;/span>
 * &lt;/oj-c-button>
 * </code></pre>
 *
 * <h3 id="pushButtons-section">
 *   Push Buttons
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pushButtons-section"></a>
 * </h3>
 *
 * <p>Push buttons are ordinary buttons that do not stay pressed in when clicked.
 * Push buttons are created from <code class="prettyprint">oj-c-button</code> elements.
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Gesture</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Push Button</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Push the button.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Push Button</td>
 *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
 *       <td>Push the button.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>For accessibility, it is not required to set an aria label on a JET button as it uses the label text to generate an aria label.
 * Therefore the label should be specified even if the button is <a href="#display">icon-only (display=icons)</a>. However,
 * you can override the default behavior by setting <code class="prettyprint">aria-label</code>.
 * The label can be hidden using the display attribute.
 *
 * {@include accessibility_doc.ts#a11y-section-disabled-content}
 *
 * @ojmetadata description "Buttons direct users to initiate or take actions and work with a single tap, click, or keystroke."
 * @ojmetadata displayName "Button"
 * @ojmetadata help "oj-c.Button.html"
 * @ojmetadata main "oj-c/button"
 * @ojmetadata extension {
 *   "catalog": {
 *     "category": "Controls"
 *   },
 *   "vbdt": {
 *     "module": "oj-c/button",
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-button",
 *     "uxSpecs": [
 *       "button"
 *     ]
 *   }
 * }
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "common",
 *     "items": [
 *       "label",
 *       "tooltip",
 *       "display",
 *       "chroming",
 *       "size",
 *       "width",
 *       "edge",
 *       "disabled"
 *     ]
 *   }
 * ]
 * @ojmetadata since "13.0.0"
 * @ojmetadata status [
 *   {
 *     "type": "supersedes",
 *     "since": "15.0.0",
 *     "value": ["oj-button"]
 *   }
 * ]
 */
declare function ButtonImpl({ chroming, disabled, size, display, endIcon, startIcon, edge, tooltip, width, label, onOjAction, 'aria-label': accessibleLabel, 'aria-describedby': ariaDescribedBy, ...otherProps }: Props, ref: Ref<ButtonHandle>): import("preact").JSX.Element;
/**
 * This export corresponds to the Button Preact component. For the oj-c-button custom element, import CButtonElement instead.
 */
export declare const Button: ComponentType<ExtendGlobalProps<ComponentProps<typeof ButtonImpl>> & {
    ref?: Ref<ButtonHandle>;
}>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-button custom element. For the Button Preact component, import Button instead.
 */
export interface CButtonElement extends JetElement<CButtonElementSettableProperties>, CButtonElementSettableProperties {
    addEventListener<T extends keyof CButtonElementEventMap>(type: T, listener: (this: HTMLElement, ev: CButtonElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CButtonElementSettableProperties>(property: T): CButtonElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CButtonElementSettableProperties>(property: T, value: CButtonElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CButtonElementSettableProperties>): void;
    setProperties(properties: CButtonElementSettablePropertiesLenient): void;
    blur: () => void;
    click: () => void;
    focus: () => void;
}
export namespace CButtonElement {
    interface ojAction extends CustomEvent<{}> {
    }
    type chromingChanged = JetElementCustomEventStrict<CButtonElement['chroming']>;
    type disabledChanged = JetElementCustomEventStrict<CButtonElement['disabled']>;
    type displayChanged = JetElementCustomEventStrict<CButtonElement['display']>;
    type edgeChanged = JetElementCustomEventStrict<CButtonElement['edge']>;
    type labelChanged = JetElementCustomEventStrict<CButtonElement['label']>;
    type sizeChanged = JetElementCustomEventStrict<CButtonElement['size']>;
    type tooltipChanged = JetElementCustomEventStrict<CButtonElement['tooltip']>;
    type widthChanged = JetElementCustomEventStrict<CButtonElement['width']>;
}
export interface CButtonElementEventMap extends HTMLElementEventMap {
    'ojAction': CButtonElement.ojAction;
    'chromingChanged': JetElementCustomEventStrict<CButtonElement['chroming']>;
    'disabledChanged': JetElementCustomEventStrict<CButtonElement['disabled']>;
    'displayChanged': JetElementCustomEventStrict<CButtonElement['display']>;
    'edgeChanged': JetElementCustomEventStrict<CButtonElement['edge']>;
    'labelChanged': JetElementCustomEventStrict<CButtonElement['label']>;
    'sizeChanged': JetElementCustomEventStrict<CButtonElement['size']>;
    'tooltipChanged': JetElementCustomEventStrict<CButtonElement['tooltip']>;
    'widthChanged': JetElementCustomEventStrict<CButtonElement['width']>;
}
export interface CButtonElementSettableProperties extends JetSettableProperties {
    chroming?: Props['chroming'];
    disabled?: Props['disabled'];
    display?: Props['display'];
    edge?: Props['edge'];
    label: Props['label'];
    size?: Props['size'];
    tooltip?: Props['tooltip'];
    width?: Props['width'];
}
export interface CButtonElementSettablePropertiesLenient extends Partial<CButtonElementSettableProperties> {
    [key: string]: any;
}
export interface ButtonIntrinsicProps extends Partial<Readonly<CButtonElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    onojAction?: (value: CButtonElementEventMap['ojAction']) => void;
    onchromingChanged?: (value: CButtonElementEventMap['chromingChanged']) => void;
    ondisabledChanged?: (value: CButtonElementEventMap['disabledChanged']) => void;
    ondisplayChanged?: (value: CButtonElementEventMap['displayChanged']) => void;
    onedgeChanged?: (value: CButtonElementEventMap['edgeChanged']) => void;
    onlabelChanged?: (value: CButtonElementEventMap['labelChanged']) => void;
    onsizeChanged?: (value: CButtonElementEventMap['sizeChanged']) => void;
    ontooltipChanged?: (value: CButtonElementEventMap['tooltipChanged']) => void;
    onwidthChanged?: (value: CButtonElementEventMap['widthChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-button': ButtonIntrinsicProps;
        }
    }
}
