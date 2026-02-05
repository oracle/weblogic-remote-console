/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ExtendGlobalProps, ObservedGlobalProps, PropertyChanged, Slot } from 'ojs/ojvcomponent';
import { ToggleButton as PreactToggleButton } from '@oracle/oraclejet-preact/UNSAFE_ToggleButton';
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
import { ComponentProps, Ref, ComponentType } from 'preact';
import 'css!oj-c/button/button-styles.css';
type PreactToggleButtonProps = ComponentProps<typeof PreactToggleButton>;
type Props = ObservedGlobalProps<'aria-describedby' | 'aria-label'> & {
    /**
     * @ojmetadata description "Text to show in the button."
     * @ojmetadata help "#label"
     * @ojmetadata required
     * @ojmetadata translatable
     */
    label: string;
    /**
     * @ojmetadata description "Specifies if the toggle button is selected"
     * @ojmetadata help "#value"
     * @ojmetadata translatable
     */
    value?: boolean;
    /**
     * @ojmetadata description Writeback support for the value property
     * @ojmetadata help "#value"
     */
    onValueChanged?: PropertyChanged<boolean>;
    /**
     * @ojmetadata description "Text to show in the tooltip. This overrides the default tooltip that renders the label when in icon mode."
     * @ojmetadata help "#tooltip"
     * @ojmetadata translatable
     */
    tooltip?: string;
    /**
     * @ojmetadata description "The startIcon slot is the button's start icon. The oj-c-toggle-button element accepts DOM nodes as children with the startIcon slot."
     * @ojmetadata help "#startIcon"
     */
    startIcon?: Slot;
    /**
     * @ojmetadata description "The endIcon slot is the button's end icon. The oj-c-toggle-button element accepts DOM nodes as children with the endIcon slot."
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
     * @ojmetadata description "Indicates in what states the button has variants in background and border. "
     * @ojmetadata help "#chroming"
     * @ojmetadata propertyEditorValues {
     *     "borderless": {
     *       "description": "Borderless buttons are a less prominent variation.",
     *       "displayName": "Borderless"
     *     },
     *     "outlined": {
     *       "description": "Outlined buttons are a more prominent variation.",
     *       "displayName": "Outlined"
     *     }
     *   }
     */
    chroming?: PreactToggleButtonProps['variant'];
};
type ToggleButtonHandle = {
    focus: () => void;
    blur: () => void;
    click: () => void;
};
/**
 * @classdesc
 * <h3 id="toggleButtonOverview-section">
 *   JET ToggleButton
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#toggleButtonOverview-section"></a>
 * </h3>
 *
 * <p>Description: Themeable, WAI-ARIA-compliant toggle button, with appropriate styles for hover, active, and disabled.
 *
 * <pre class="prettyprint"><code>&lt;oj-c-toggle-button id="myToggleButton" value="{{value}}" label="My ToggleButton">
 * &lt;/oj-c-toggle-button>
 * &lt;oj-c-toggle-button label="start icon">
 *   &lt;span slot='startIcon' class='myIconClass'>&lt;/span>
 * &lt;/oj-c-toggle-button>
 *  &lt;oj-c-toggle-button label="end icon">
 *   &lt;span slot='endIcon' class='myIconClass'>&lt;/span>
 * &lt;/oj-c-toggle-button>
 * </code></pre>
 *
 * <h3 id="toggleButtons-section">
 *   Toggle Buttons
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pushToggleButtons-section"></a>
 * </h3>
 *
 * <p>Toggle Buttons allow users to switch between states when clicked or tapped.
 * Toggle buttons are created from <code class="prettyprint">oj-c-toggle-button</code> elements.
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
 *       <td>Push ToggleButton</td>
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
 *       <td>Push Toggle Button</td>
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
 * @ojmetadata description "Toggle Buttons allow users to switch between states when clicked or tapped."
 * @ojmetadata displayName "Toggle Button"
 * @ojmetadata help "oj-c.ToggleButton.html"
 * @ojmetadata main "oj-c/toggle-button"
 * @ojmetadata extension {
 *   "catalog": {
 *     "category": "Controls"
 *   },
 *   "vbdt": {
 *     "module": "oj-c/toggle-button",
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-button",
 *     "uxSpecs": [
 *       "Toggle%20Button"
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
 *       "disabled"
 *     ]
 *   }
 * ]
 * @ojmetadata since "17.0.0"
 * @ojmetadata status [
 *   {
 *     "type": "supersedes",
 *     "since": "17.0.0",
 *     "value": ["oj-buttonset-many"]
 *   }
 * ]
 */
declare function ToggleButtonImpl({ chroming, disabled, 'aria-label': accessibleLabel, 'aria-describedby': ariaDescribedBy, width, display, value, label, tooltip, startIcon, endIcon, size, onValueChanged }: Props, ref: Ref<ToggleButtonHandle>): import("preact").JSX.Element;
/**
 * This export corresponds to the ToggleButton Preact component. For the oj-c-toggle-button custom element, import CToggleButtonElement instead.
 */
export declare const ToggleButton: ComponentType<ExtendGlobalProps<ComponentProps<typeof ToggleButtonImpl>> & {
    ref?: Ref<ToggleButtonHandle>;
}>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-toggle-button custom element. For the ToggleButton Preact component, import ToggleButton instead.
 */
export interface CToggleButtonElement extends JetElement<CToggleButtonElementSettableProperties>, CToggleButtonElementSettableProperties {
    addEventListener<T extends keyof CToggleButtonElementEventMap>(type: T, listener: (this: HTMLElement, ev: CToggleButtonElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CToggleButtonElementSettableProperties>(property: T): CToggleButtonElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CToggleButtonElementSettableProperties>(property: T, value: CToggleButtonElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CToggleButtonElementSettableProperties>): void;
    setProperties(properties: CToggleButtonElementSettablePropertiesLenient): void;
    blur: () => void;
    click: () => void;
    focus: () => void;
}
export namespace CToggleButtonElement {
    type chromingChanged = JetElementCustomEventStrict<CToggleButtonElement['chroming']>;
    type disabledChanged = JetElementCustomEventStrict<CToggleButtonElement['disabled']>;
    type displayChanged = JetElementCustomEventStrict<CToggleButtonElement['display']>;
    type labelChanged = JetElementCustomEventStrict<CToggleButtonElement['label']>;
    type sizeChanged = JetElementCustomEventStrict<CToggleButtonElement['size']>;
    type tooltipChanged = JetElementCustomEventStrict<CToggleButtonElement['tooltip']>;
    type valueChanged = JetElementCustomEventStrict<CToggleButtonElement['value']>;
    type widthChanged = JetElementCustomEventStrict<CToggleButtonElement['width']>;
}
export interface CToggleButtonElementEventMap extends HTMLElementEventMap {
    'chromingChanged': JetElementCustomEventStrict<CToggleButtonElement['chroming']>;
    'disabledChanged': JetElementCustomEventStrict<CToggleButtonElement['disabled']>;
    'displayChanged': JetElementCustomEventStrict<CToggleButtonElement['display']>;
    'labelChanged': JetElementCustomEventStrict<CToggleButtonElement['label']>;
    'sizeChanged': JetElementCustomEventStrict<CToggleButtonElement['size']>;
    'tooltipChanged': JetElementCustomEventStrict<CToggleButtonElement['tooltip']>;
    'valueChanged': JetElementCustomEventStrict<CToggleButtonElement['value']>;
    'widthChanged': JetElementCustomEventStrict<CToggleButtonElement['width']>;
}
export interface CToggleButtonElementSettableProperties extends JetSettableProperties {
    chroming?: Props['chroming'];
    disabled?: Props['disabled'];
    display?: Props['display'];
    label: Props['label'];
    size?: Props['size'];
    tooltip?: Props['tooltip'];
    value?: Props['value'];
    width?: Props['width'];
}
export interface CToggleButtonElementSettablePropertiesLenient extends Partial<CToggleButtonElementSettableProperties> {
    [key: string]: any;
}
export interface ToggleButtonIntrinsicProps extends Partial<Readonly<CToggleButtonElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    onchromingChanged?: (value: CToggleButtonElementEventMap['chromingChanged']) => void;
    ondisabledChanged?: (value: CToggleButtonElementEventMap['disabledChanged']) => void;
    ondisplayChanged?: (value: CToggleButtonElementEventMap['displayChanged']) => void;
    onlabelChanged?: (value: CToggleButtonElementEventMap['labelChanged']) => void;
    onsizeChanged?: (value: CToggleButtonElementEventMap['sizeChanged']) => void;
    ontooltipChanged?: (value: CToggleButtonElementEventMap['tooltipChanged']) => void;
    onvalueChanged?: (value: CToggleButtonElementEventMap['valueChanged']) => void;
    onwidthChanged?: (value: CToggleButtonElementEventMap['widthChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-toggle-button': ToggleButtonIntrinsicProps;
        }
    }
}
