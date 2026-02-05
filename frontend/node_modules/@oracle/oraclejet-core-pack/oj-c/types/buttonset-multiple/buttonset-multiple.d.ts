/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ExtendGlobalProps, ObservedGlobalProps, PropertyChanged } from 'ojs/ojvcomponent';
import { ButtonSetMultiple as PreactButtonSetMultiple } from '@oracle/oraclejet-preact/UNSAFE_ButtonSetMultiple';
import { type ToggleItem } from 'oj-c/utils/PRIVATE_toggleUtils/index';
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
import { ComponentProps, Ref, ComponentType } from 'preact';
import 'css!oj-c/buttonset-multiple/buttonset-multiple-styles.css';
/** @deprecated since 19.0.0 - use 'CButtonsetMultipleElement[&apos;items&apos;]' instead */
export type ToggleItemDeprecated = ToggleItem;
export type PreactButtonSetMultipleProps = ComponentProps<typeof PreactButtonSetMultiple>;
type Props = ObservedGlobalProps<'aria-describedby' | 'aria-label'> & {
    /**
     * @ojmetadata description "Specifies which toggle button is selected"
     * @ojmetadata help "#value"
     * @ojmetadata translatable
     */
    value?: string[];
    /**
     * @ojmetadata description Writeback support for the value property
     * @ojmetadata help "#value"
     */
    onValueChanged?: PropertyChanged<string[] | undefined>;
    /**
     * @ojmetadata description "Specifies the toggle buttons rendered by the buttonset."
     * @ojmetadata help "#items"
     */
    items?: ToggleItem[];
    /**
     * @ojmetadata description "Display just the label, the icons, or all. "
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
    size?: PreactButtonSetMultipleProps['size'];
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
    chroming?: PreactButtonSetMultipleProps['variant'];
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
    layoutWidth?: PreactButtonSetMultipleProps['layoutWidth'];
};
type ButtonsetMultipleHandle = {
    focus: () => void;
    blur: () => void;
};
/**
 * @classdesc
 * <h3 id="ButtonsetMultipleOverview-section">
 *   JET Buttonset Multiple
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#buttonSetMultipleOverview-section"></a>
 * </h3>
 *
 * <p>Description: A Buttonset Multiple is a grouping of related buttons where any number of buttons may be selected.
 *
 * <pre class="prettyprint"><code>&lt;oj-c-buttonset-multiple aria-label="Pick Items" value="{{value}}" items="[[items]]">
 * &lt;/oj-c-buttonset-multiple>
 * </code></pre>
 *
 * <h3 id="toolbar-section">
 * Toolbar Usage
 * </h3>
 * <p>Note that oj-c-buttonset-multiple is not intended for usage inside oj-toolbar, it is only
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
 *       <td>Buttonset Multiple</td>
 *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
 *       <td>Toggle the focused Button.</td>
 *     </tr>
 *     <tr>
 *       <td>Buttonset Multiple</td>
 *       <td><kbd>Right Arrow</kbd></td>
 *       <td>Move focus to the next enabled Button, wrapping as needed.</td>
 *     </tr>
 *     <tr>
 *       <td>Buttonset Multiple</td>
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
 * <p>The application is responsible for applying <code class="prettyprint">aria-label</code> and/or
 * <code class="prettyprint">aria-controls</code> attributes like the following to the buttonset element, if applicable per the instructions that follow:
 *
 * <pre class="prettyprint">
 * <code>aria-label="Choose beverages."
 * aria-controls="myTextEditor"
 * </code></pre>
 *
 * <p>An <code class="prettyprint">aria-label</code> conveying the "choose multiple" semantics should be included for a buttonset-multiple.
 *
 * <p>The <code class="prettyprint">aria-controls</code> attribute should be included if the buttonset is controlling something else on the page, e.g.
 * bold / italic / underline buttons controlling a rich text editor.  If the buttonset is contained in a toolbar, <code class="prettyprint">aria-controls</code>
 * should be placed on the toolbar, not on the buttonsets within the toolbar.
 *
 *  {@include accessibility_doc.ts#a11y-section-disabled-content}
 *
 * @ojmetadata description "A Buttonset Multiple allows a user to select the states of one or more related options."
 * @ojmetadata displayName "Buttonset Multiple"
 * @ojmetadata help "oj-c.ButtonsetMultiple.html"
 * @ojmetadata main "oj-c/buttonset-multiple"
 * @ojmetadata extension {
 *   "catalog": {
 *     "category": "Controls"
 *   },
 *   "vbdt": {
 *     "module": "oj-c/buttonset-multiple",
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-buttonset-multiple",
 *     "uxSpecs": [
 *        "Toggle%20Button"
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
 *     "value": ["oj-buttonset-many"]
 *   }
 * ]
 */
declare function ButtonsetMultipleImpl({ chroming, disabled, value, onValueChanged, size, width, maxWidth, layoutWidth, items, display, 'aria-label': accessibleLabel, 'aria-describedby': ariaDescribedBy, ...otherProps }: Props, ref: Ref<ButtonsetMultipleHandle>): import("preact").JSX.Element;
/**
 * This export corresponds to the ButtonsetMultiple Preact component. For the oj-c-buttonset-multiple custom element, import CButtonsetMultipleElement instead.
 */
export declare const ButtonsetMultiple: ComponentType<ExtendGlobalProps<ComponentProps<typeof ButtonsetMultipleImpl>> & {
    ref?: Ref<ButtonsetMultipleHandle>;
}>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-buttonset-multiple custom element. For the ButtonsetMultiple Preact component, import ButtonsetMultiple instead.
 */
export interface CButtonsetMultipleElement extends JetElement<CButtonsetMultipleElementSettableProperties>, CButtonsetMultipleElementSettableProperties {
    addEventListener<T extends keyof CButtonsetMultipleElementEventMap>(type: T, listener: (this: HTMLElement, ev: CButtonsetMultipleElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CButtonsetMultipleElementSettableProperties>(property: T): CButtonsetMultipleElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CButtonsetMultipleElementSettableProperties>(property: T, value: CButtonsetMultipleElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CButtonsetMultipleElementSettableProperties>): void;
    setProperties(properties: CButtonsetMultipleElementSettablePropertiesLenient): void;
    blur: () => void;
    focus: () => void;
}
export namespace CButtonsetMultipleElement {
    type chromingChanged = JetElementCustomEventStrict<CButtonsetMultipleElement['chroming']>;
    type disabledChanged = JetElementCustomEventStrict<CButtonsetMultipleElement['disabled']>;
    type displayChanged = JetElementCustomEventStrict<CButtonsetMultipleElement['display']>;
    type itemsChanged = JetElementCustomEventStrict<CButtonsetMultipleElement['items']>;
    type layoutWidthChanged = JetElementCustomEventStrict<CButtonsetMultipleElement['layoutWidth']>;
    type maxWidthChanged = JetElementCustomEventStrict<CButtonsetMultipleElement['maxWidth']>;
    type sizeChanged = JetElementCustomEventStrict<CButtonsetMultipleElement['size']>;
    type valueChanged = JetElementCustomEventStrict<CButtonsetMultipleElement['value']>;
    type widthChanged = JetElementCustomEventStrict<CButtonsetMultipleElement['width']>;
}
export interface CButtonsetMultipleElementEventMap extends HTMLElementEventMap {
    'chromingChanged': JetElementCustomEventStrict<CButtonsetMultipleElement['chroming']>;
    'disabledChanged': JetElementCustomEventStrict<CButtonsetMultipleElement['disabled']>;
    'displayChanged': JetElementCustomEventStrict<CButtonsetMultipleElement['display']>;
    'itemsChanged': JetElementCustomEventStrict<CButtonsetMultipleElement['items']>;
    'layoutWidthChanged': JetElementCustomEventStrict<CButtonsetMultipleElement['layoutWidth']>;
    'maxWidthChanged': JetElementCustomEventStrict<CButtonsetMultipleElement['maxWidth']>;
    'sizeChanged': JetElementCustomEventStrict<CButtonsetMultipleElement['size']>;
    'valueChanged': JetElementCustomEventStrict<CButtonsetMultipleElement['value']>;
    'widthChanged': JetElementCustomEventStrict<CButtonsetMultipleElement['width']>;
}
export interface CButtonsetMultipleElementSettableProperties extends JetSettableProperties {
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
export interface CButtonsetMultipleElementSettablePropertiesLenient extends Partial<CButtonsetMultipleElementSettableProperties> {
    [key: string]: any;
}
export interface ButtonsetMultipleIntrinsicProps extends Partial<Readonly<CButtonsetMultipleElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onchromingChanged?: (value: CButtonsetMultipleElementEventMap['chromingChanged']) => void;
    ondisabledChanged?: (value: CButtonsetMultipleElementEventMap['disabledChanged']) => void;
    ondisplayChanged?: (value: CButtonsetMultipleElementEventMap['displayChanged']) => void;
    onitemsChanged?: (value: CButtonsetMultipleElementEventMap['itemsChanged']) => void;
    onlayoutWidthChanged?: (value: CButtonsetMultipleElementEventMap['layoutWidthChanged']) => void;
    onmaxWidthChanged?: (value: CButtonsetMultipleElementEventMap['maxWidthChanged']) => void;
    onsizeChanged?: (value: CButtonsetMultipleElementEventMap['sizeChanged']) => void;
    onvalueChanged?: (value: CButtonsetMultipleElementEventMap['valueChanged']) => void;
    onwidthChanged?: (value: CButtonsetMultipleElementEventMap['widthChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-buttonset-multiple': ButtonsetMultipleIntrinsicProps;
        }
    }
}
