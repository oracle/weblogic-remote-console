/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ExtendGlobalProps, Action, Bubbles, Slot } from 'ojs/ojvcomponent';
import { ProgressButton as PreactProgressButton } from '@oracle/oraclejet-preact/UNSAFE_ProgressButton';
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
import { ComponentProps, Ref, ComponentType } from 'preact';
import 'css!oj-c/progress-button/progress-button-styles.css';
type PreactProgressButtonProps = ComponentProps<typeof PreactProgressButton>;
type Props = {
    /**
     * @ojmetadata description "Text to show in the button or as tooltip for icon mode."
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
     * @ojmetadata description "The startIcon slot is the button's start icon. The oj-c-progress-button element accepts DOM nodes as children with the startIcon slot."
     * @ojmetadata help "#startIcon"
     */
    startIcon?: Slot;
    /**
     * @ojmetadata description "Specifies that the button element should be disabled."
     * @ojmetadata help "#disabled"
     */
    disabled?: boolean;
    /**
     * @ojmetadata description "Specifies if progress should be shown."
     * @ojmetadata help "#isLoading"
     */
    isLoading?: boolean;
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
    size?: 'sm' | 'md' | 'lg';
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
    edge?: PreactProgressButtonProps['edge'];
    /**
     * @ojmetadata description "Indicates in what states the button has variants in background and border. "
     * @ojmetadata help "#chroming"
     * @ojmetadata propertyEditorValues {
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
     *     }
     *   }
     */
    chroming?: PreactProgressButtonProps['variant'];
    /**
     * @ojmetadata description "Triggered when a button is clicked, whether by keyboard, mouse,
     *    or touch events. To meet accessibility requirements, the only supported way to react
     *    to the click of a button is to listen for this event."
     * @ojmetadata eventGroup "common"
     * @ojmetadata help "#event:action"
     */
    onOjAction?: Action & Bubbles;
};
type ProgressButtonHandle = {
    focus: () => void;
    blur: () => void;
    click: () => void;
};
/**
 * @classdesc
 * <h3 id="progressButtonOverview-section">
 *   JET Progress Button
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#progressButtonOverview-section"></a>
 * </h3>
 *
 * <p>Description: A Progress button represents button-level action initiation.
 *
 * <pre class="prettyprint"><code>&lt;oj-c-progress-button id="myButton" label="My Button">
 * &lt;/oj-c-progress-button>
 * &lt;oj-c-progress-button label="start icon" is-loading="[[loading]]" on-oj-action="[[handler]]" >
 *   &lt;span slot='startIcon' class='myIconClass'>&lt;/span>
 * &lt;/oj-c-progress-button>
 * </code></pre>
 *
 * <h3 id="progressButtons-section">
 *   Progress Buttons
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#progressButtons-section"></a>
 * </h3>
 *
 * <p>Progress buttons communicate
 * button-level initiation of an indeterminate action with a typical progress span of less
 * than 8 seconds.  They reflect a user's brief interaction with a button.
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
 *       <td>Progress Button</td>
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
 *       <td>Progress Button</td>
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
 * @ojmetadata description "A Progress button represents button-level initiation."
 * @ojmetadata displayName "Progress Button"
 * @ojmetadata help "oj-c.ProgressButton.html"
 * @ojmetadata main "oj-c/progress-button"
 * @ojmetadata since "17.1.0"
 * @ojmetadata status [
 *   {
 *     "type": "production",
 *     "since": "17.1.0"
 *   }
 * ]
 * @ojmetadata extension {
 *   "catalog": {
 *     "category": "Controls"
 *   },
 *   "vbdt": {
 *     "module": "oj-c/progress-button",
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
 *       "isloading",
 *       "size",
 *       "width",
 *       "edge",
 *       "disabled"
 *     ]
 *   }
 * ]
 */
declare function ProgressButtonImpl({ chroming, disabled, size, display, startIcon, edge, tooltip, isLoading, width, label, onOjAction, ...otherProps }: Props, ref: Ref<ProgressButtonHandle>): import("preact").JSX.Element;
/**
 * This export corresponds to the ProgressButton Preact component. For the oj-c-progress-button custom element, import CProgressButtonElement instead.
 */
export declare const ProgressButton: ComponentType<ExtendGlobalProps<ComponentProps<typeof ProgressButtonImpl>> & {
    ref?: Ref<ProgressButtonHandle>;
}>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-progress-button custom element. For the ProgressButton Preact component, import ProgressButton instead.
 */
export interface CProgressButtonElement extends JetElement<CProgressButtonElementSettableProperties>, CProgressButtonElementSettableProperties {
    addEventListener<T extends keyof CProgressButtonElementEventMap>(type: T, listener: (this: HTMLElement, ev: CProgressButtonElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CProgressButtonElementSettableProperties>(property: T): CProgressButtonElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CProgressButtonElementSettableProperties>(property: T, value: CProgressButtonElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CProgressButtonElementSettableProperties>): void;
    setProperties(properties: CProgressButtonElementSettablePropertiesLenient): void;
    blur: () => void;
    click: () => void;
    focus: () => void;
}
export namespace CProgressButtonElement {
    interface ojAction extends CustomEvent<{}> {
    }
    type chromingChanged = JetElementCustomEventStrict<CProgressButtonElement['chroming']>;
    type disabledChanged = JetElementCustomEventStrict<CProgressButtonElement['disabled']>;
    type displayChanged = JetElementCustomEventStrict<CProgressButtonElement['display']>;
    type edgeChanged = JetElementCustomEventStrict<CProgressButtonElement['edge']>;
    type isLoadingChanged = JetElementCustomEventStrict<CProgressButtonElement['isLoading']>;
    type labelChanged = JetElementCustomEventStrict<CProgressButtonElement['label']>;
    type sizeChanged = JetElementCustomEventStrict<CProgressButtonElement['size']>;
    type tooltipChanged = JetElementCustomEventStrict<CProgressButtonElement['tooltip']>;
    type widthChanged = JetElementCustomEventStrict<CProgressButtonElement['width']>;
}
export interface CProgressButtonElementEventMap extends HTMLElementEventMap {
    'ojAction': CProgressButtonElement.ojAction;
    'chromingChanged': JetElementCustomEventStrict<CProgressButtonElement['chroming']>;
    'disabledChanged': JetElementCustomEventStrict<CProgressButtonElement['disabled']>;
    'displayChanged': JetElementCustomEventStrict<CProgressButtonElement['display']>;
    'edgeChanged': JetElementCustomEventStrict<CProgressButtonElement['edge']>;
    'isLoadingChanged': JetElementCustomEventStrict<CProgressButtonElement['isLoading']>;
    'labelChanged': JetElementCustomEventStrict<CProgressButtonElement['label']>;
    'sizeChanged': JetElementCustomEventStrict<CProgressButtonElement['size']>;
    'tooltipChanged': JetElementCustomEventStrict<CProgressButtonElement['tooltip']>;
    'widthChanged': JetElementCustomEventStrict<CProgressButtonElement['width']>;
}
export interface CProgressButtonElementSettableProperties extends JetSettableProperties {
    chroming?: Props['chroming'];
    disabled?: Props['disabled'];
    display?: Props['display'];
    edge?: Props['edge'];
    isLoading?: Props['isLoading'];
    label: Props['label'];
    size?: Props['size'];
    tooltip?: Props['tooltip'];
    width?: Props['width'];
}
export interface CProgressButtonElementSettablePropertiesLenient extends Partial<CProgressButtonElementSettableProperties> {
    [key: string]: any;
}
export interface ProgressButtonIntrinsicProps extends Partial<Readonly<CProgressButtonElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    onojAction?: (value: CProgressButtonElementEventMap['ojAction']) => void;
    onchromingChanged?: (value: CProgressButtonElementEventMap['chromingChanged']) => void;
    ondisabledChanged?: (value: CProgressButtonElementEventMap['disabledChanged']) => void;
    ondisplayChanged?: (value: CProgressButtonElementEventMap['displayChanged']) => void;
    onedgeChanged?: (value: CProgressButtonElementEventMap['edgeChanged']) => void;
    onisLoadingChanged?: (value: CProgressButtonElementEventMap['isLoadingChanged']) => void;
    onlabelChanged?: (value: CProgressButtonElementEventMap['labelChanged']) => void;
    onsizeChanged?: (value: CProgressButtonElementEventMap['sizeChanged']) => void;
    ontooltipChanged?: (value: CProgressButtonElementEventMap['tooltipChanged']) => void;
    onwidthChanged?: (value: CProgressButtonElementEventMap['widthChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-progress-button': ProgressButtonIntrinsicProps;
        }
    }
}
