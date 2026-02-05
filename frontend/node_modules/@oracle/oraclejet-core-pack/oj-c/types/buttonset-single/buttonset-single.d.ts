/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ExtendGlobalProps, ObservedGlobalProps, PropertyChanged } from 'ojs/ojvcomponent';
import { ButtonSetSingle as PreactButtonSetSingle } from '@oracle/oraclejet-preact/UNSAFE_ButtonSetSingle';
import { type ToggleItem } from 'oj-c/utils/PRIVATE_toggleUtils/index';
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
import { ComponentProps, Ref, ComponentType } from 'preact';
import 'css!oj-c/buttonset-single/buttonset-single-styles.css';
/** @deprecated since 19.0.0 - use 'CButtonsetSingleElement[&apos;items&apos;]' instead */
export type ToggleItemDeprecated = ToggleItem;
export type PreactButtonSetSingleProps = ComponentProps<typeof PreactButtonSetSingle>;
type Props = ObservedGlobalProps<'aria-describedby' | 'aria-label'> & {
    /**
     * @ojmetadata description "Specifies which toggle button is selected"
     * @ojmetadata help "#value"
     * @ojmetadata translatable
     */
    value?: string;
    /**
     * @ojmetadata description Writeback support for the value property
     * @ojmetadata help "#value"
     */
    onValueChanged?: PropertyChanged<string | undefined>;
    /**
     * @ojmetadata description "Specifies the toggle buttons rendered by the buttonset."
     * @ojmetadata help "#items"
     */
    items?: ToggleItem[];
    /**
     * @ojmetadata description "Display just the label, the icons, or all."
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
     * @ojmetadata description "Specifies that the buttonset should be disabled."
     * @ojmetadata help "#disabled"
     */
    disabled?: boolean;
    /**
     * @ojmetadata description "Specifies the size of the toggle buttons"
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
    size?: PreactButtonSetSingleProps['size'];
    /**
     * @ojmetadata description "Specifies the buttonset width"
     * @ojmetadata help "#width"
     */
    width?: Size;
    /**
     * @ojmetadata description "Specifies the buttonset max width"
     * @ojmetadata help "#maxWidth"
     */
    maxWidth?: Size;
    /**
     * @ojmetadata description "Indicates in what states the button has chromings in background and border. "
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
    chroming?: PreactButtonSetSingleProps['variant'];
    /**
     * @ojmetadata description "Specifies if button width should be equal or based on contents."
     * @ojmetadata help "#layoutWidth"
     * @ojmetadata propertyEditorValues {
     *     "auto": {
     *       "description": "The width of each Button is automatically determined to fit its contents. The overall width of the Buttonset can also be specified for further width control. (Default)",
     *       "displayName": "Auto"
     *     },
     *     "equal": {
     *       "description": "The width of the Buttonset is equally distributed to all contained Buttons. The overall width of the Buttonset defaults to 100%. Set the max-width or width property for further control."
     *       "displayName": "Equal"
     *     }
     *  }
     */
    layoutWidth?: PreactButtonSetSingleProps['layoutWidth'];
};
type ButtonsetSingleHandle = {
    focus: () => void;
    blur: () => void;
};
/**
 * @classdesc
 * <h3 id="ButtonsetSingleOverview-section">
 *   JET Buttonset Single
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#buttonSetSingleOverview-section"></a>
 * </h3>
 *
 * <p>Description: A Buttonset Single is a grouping of related buttons where only one button may be selected.
 *
 * <pre class="prettyprint"><code>&lt;oj-c-buttonset-single aria-label="Pick an Item" value="{{value}}" items="[[items]]">
 * &lt;/oj-c-buttonset-single>
 * </code></pre>
 *
 * <h3 id="toolbar-section">
 * Toolbar Usage
 * </h3>
 * <p>Note that oj-c-buttonset-single is not intended for usage inside oj-toolbar, it is only
 * supported in oj-c-toolbar.</p>
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
 *       <td>Push Toggle Button</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Toggle the button.</td>
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
 *       <td>Buttonset Single</td>
 *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
 *       <td>Toggle the focused Button.</td>
 *     </tr>
 *     <tr>
 *       <td>Buttonset Single</td>
 *       <td><kbd>Right Arrow</kbd></td>
 *       <td>Move focus to the next enabled Button, wrapping as needed.</td>
 *     </tr>
 *     <tr>
 *       <td>Buttonset Single</td>
 *       <td><kbd>Left Arrow</kbd></td>
 *       <td>Move focus to the previous enabled Button, wrapping as needed.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 *  <p>The application is responsible for applying <code class="prettyprint">aria-label</code> and/or
 * <code class="prettyprint">aria-controls</code> attributes like the following to the buttonset element, if applicable per the instructions that follow:
 *
 * <pre class="prettyprint">
 * <code>aria-label="Choose only one beverage."
 * aria-controls="myTextEditor"
 * </code></pre>
 *
 * <p>An <code class="prettyprint">aria-label</code> conveying the "choose only one" semantics should be included for a buttonset-single.
 *
 * <p>The <code class="prettyprint">aria-controls</code> attribute should be included if the buttonset is controlling something else on the page, e.g.
 * bold / italic / underline buttons controlling a rich text editor.  If the buttonset is contained in a toolbar, <code class="prettyprint">aria-controls</code>
 * should be placed on the toolbar, not on the buttonsets within the toolbar.
 *
 *  {@include accessibility_doc.ts#a11y-section-disabled-content}
 *
 * @ojmetadata description "A Buttonset Single allows a user to select the state of one or more related options."
 * @ojmetadata displayName "Buttonset Single"
 * @ojmetadata help "oj-c.ButtonsetSingle.html"
 * @ojmetadata main "oj-c/buttonset-single"
 * @ojmetadata extension {
 *   "catalog": {
 *     "category": "Controls"
 *   },
 *   "vbdt": {
 *     "module": "oj-c/buttonset-single",
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-buttonset-single",
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
 *       "edge",
 *       "disabled"
 *       "items",
 *       "layoutWidth",
 *       "maxWidth"
 *     ]
 *   }
 * ]
 * @ojmetadata since "17.0.0"
 * @ojmetadata status [
 *   {
 *     "type": "supersedes",
 *     "since": "17.0.0",
 *     "value": ["oj-buttonset-one"]
 *   }
 * ]
 */
declare function ButtonsetSingleImpl({ chroming, disabled, value, onValueChanged, size, width, maxWidth, layoutWidth, items, display, 'aria-label': accessibleLabel, 'aria-describedby': ariaDescribedBy, ...otherProps }: Props, ref: Ref<ButtonsetSingleHandle>): import("preact").JSX.Element;
/**
 * This export corresponds to the ButtonsetSingle Preact component. For the oj-c-buttonset-single custom element, import CButtonsetSingleElement instead.
 */
export declare const ButtonsetSingle: ComponentType<ExtendGlobalProps<ComponentProps<typeof ButtonsetSingleImpl>> & {
    ref?: Ref<ButtonsetSingleHandle>;
}>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-buttonset-single custom element. For the ButtonsetSingle Preact component, import ButtonsetSingle instead.
 */
export interface CButtonsetSingleElement extends JetElement<CButtonsetSingleElementSettableProperties>, CButtonsetSingleElementSettableProperties {
    addEventListener<T extends keyof CButtonsetSingleElementEventMap>(type: T, listener: (this: HTMLElement, ev: CButtonsetSingleElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CButtonsetSingleElementSettableProperties>(property: T): CButtonsetSingleElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CButtonsetSingleElementSettableProperties>(property: T, value: CButtonsetSingleElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CButtonsetSingleElementSettableProperties>): void;
    setProperties(properties: CButtonsetSingleElementSettablePropertiesLenient): void;
    blur: () => void;
    focus: () => void;
}
export namespace CButtonsetSingleElement {
    type chromingChanged = JetElementCustomEventStrict<CButtonsetSingleElement['chroming']>;
    type disabledChanged = JetElementCustomEventStrict<CButtonsetSingleElement['disabled']>;
    type displayChanged = JetElementCustomEventStrict<CButtonsetSingleElement['display']>;
    type itemsChanged = JetElementCustomEventStrict<CButtonsetSingleElement['items']>;
    type layoutWidthChanged = JetElementCustomEventStrict<CButtonsetSingleElement['layoutWidth']>;
    type maxWidthChanged = JetElementCustomEventStrict<CButtonsetSingleElement['maxWidth']>;
    type sizeChanged = JetElementCustomEventStrict<CButtonsetSingleElement['size']>;
    type valueChanged = JetElementCustomEventStrict<CButtonsetSingleElement['value']>;
    type widthChanged = JetElementCustomEventStrict<CButtonsetSingleElement['width']>;
}
export interface CButtonsetSingleElementEventMap extends HTMLElementEventMap {
    'chromingChanged': JetElementCustomEventStrict<CButtonsetSingleElement['chroming']>;
    'disabledChanged': JetElementCustomEventStrict<CButtonsetSingleElement['disabled']>;
    'displayChanged': JetElementCustomEventStrict<CButtonsetSingleElement['display']>;
    'itemsChanged': JetElementCustomEventStrict<CButtonsetSingleElement['items']>;
    'layoutWidthChanged': JetElementCustomEventStrict<CButtonsetSingleElement['layoutWidth']>;
    'maxWidthChanged': JetElementCustomEventStrict<CButtonsetSingleElement['maxWidth']>;
    'sizeChanged': JetElementCustomEventStrict<CButtonsetSingleElement['size']>;
    'valueChanged': JetElementCustomEventStrict<CButtonsetSingleElement['value']>;
    'widthChanged': JetElementCustomEventStrict<CButtonsetSingleElement['width']>;
}
export interface CButtonsetSingleElementSettableProperties extends JetSettableProperties {
    chroming?: Props['chroming'];
    disabled?: Props['disabled'];
    display?: Props['display'];
    items?: Props['items'];
    layoutWidth?: Props['layoutWidth'];
    maxWidth?: Props['maxWidth'];
    size?: Props['size'];
    value?: Props['value'];
    width?: Props['width'];
}
export interface CButtonsetSingleElementSettablePropertiesLenient extends Partial<CButtonsetSingleElementSettableProperties> {
    [key: string]: any;
}
export interface ButtonsetSingleIntrinsicProps extends Partial<Readonly<CButtonsetSingleElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onchromingChanged?: (value: CButtonsetSingleElementEventMap['chromingChanged']) => void;
    ondisabledChanged?: (value: CButtonsetSingleElementEventMap['disabledChanged']) => void;
    ondisplayChanged?: (value: CButtonsetSingleElementEventMap['displayChanged']) => void;
    onitemsChanged?: (value: CButtonsetSingleElementEventMap['itemsChanged']) => void;
    onlayoutWidthChanged?: (value: CButtonsetSingleElementEventMap['layoutWidthChanged']) => void;
    onmaxWidthChanged?: (value: CButtonsetSingleElementEventMap['maxWidthChanged']) => void;
    onsizeChanged?: (value: CButtonsetSingleElementEventMap['sizeChanged']) => void;
    onvalueChanged?: (value: CButtonsetSingleElementEventMap['valueChanged']) => void;
    onwidthChanged?: (value: CButtonsetSingleElementEventMap['widthChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-buttonset-single': ButtonsetSingleIntrinsicProps;
        }
    }
}
