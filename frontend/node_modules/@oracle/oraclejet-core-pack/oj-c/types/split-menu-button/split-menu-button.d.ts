/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ExtendGlobalProps, Action, Bubbles, ObservedGlobalProps } from 'ojs/ojvcomponent';
import { SplitMenuButton as PreactSplitMenuButton } from '@oracle/oraclejet-preact/UNSAFE_SplitMenuButton';
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
import { type MenuItemSelectionDetail, type MenuSelection, MenuItem, MenuSeparator } from '../utils/PRIVATE_ItemsMenu/items-menu';
import { type MenuValueUpdateDetail } from '@oracle/oraclejet-preact/UNSAFE_Menu/menuUtils';
import { ComponentProps, Ref, ComponentType } from 'preact';
import 'css!oj-c/split-menu-button/split-menu-button-styles.css';
/** @deprecated since 19.0.0 - use 'CSplitMenuButtonElement.&lt;ojMenuAction&gt;[&apos;detail&apos;]' instead */
export type MenuValueUpdateDetailDeprecated<T> = MenuValueUpdateDetail<T>;
/** @deprecated since 19.0.0 - use 'CSplitMenuButtonElement[&apos;selection&apos;]' instead */
export type MenuSelectionDeprecated = MenuSelection;
/** @deprecated since 19.0.0 - use 'CSplitMenuButtonElement.&lt;ojMenuSelection&gt;[&apos;detail&apos;]' instead */
export type MenuItemSelectionDetailDeprecated = MenuItemSelectionDetail;
type MenuItems = MenuItem | MenuSeparator;
/** @deprecated since 19.0.0 - use 'CSplitMenuButtonElement[&apos;items&apos;]' instead */
export type MenuItemsDeprecated = MenuItems;
type PreactSplitMenuButtonProps = ComponentProps<typeof PreactSplitMenuButton>;
type Props = ObservedGlobalProps<'aria-describedby'> & {
    /**
     * @ojmetadata description "Text to show in the button."
     * @ojmetadata displayName "label"
     * @ojmetadata help "#label"
     * @ojmetadata required
     * @ojmetadata translatable
     */
    label: string;
    /**
     * @ojmetadata description "Items describe the menu items rendered by the menu button."
     * @ojmetadata help "#items"
     * @ojmetadata extension {
     *   "vbdt": {
     *      "pi":{
     *         "events":{
     *           "suggestions":[
     *             { "type":"component",
     *                "name": "ojMenuAction",
     *                "mappings": [
     *                  { "variableName": "menuItemKey",
     *                     "expression": "{{$event.detail.key}}",
     *                     "type": "string"
     *                  }
     *                ]
     *              }
     *            ]
     *         }
     *      },
     *     "itemProperties": {
     *       "type": {
     *         "description": "Specifies the type of the menu item.",
     *         "type": "string",
     *         "status": [
     *           {
     *             "type": "deprecated",
     *             "target": "propertyValue",
     *             "since": "17.0.0",
     *             "value": ["divider"],
     *             "description": "Use 'separator' instead."
     *           }
     *         ],
     *         "enumValues": [
     *           "item",
     *           "separator",
     *           "divider"
     *         ],
     *         "propertyEditorValues": {
     *           "item": {
     *             "description": "A selectable menu item that triggers an action."
     *           },
     *           "separator": {
     *             "description": "A non-selectable menu item that visibly separates menu items (no other properties apply)."
     *           },
     *           "divider": {
     *             "description": "A divider that visibly separates menu items (deprecated)."
     *           }
     *         }
     *       },
     *       "label": {
     *         "description": "Specifies the text to show for the menu item.",
     *         "type": "string",
     *         "required": true,
     *         "translatable": true
     *       },
     *       "key": {
     *         "description": "Specifes a key value associated with the menu item.",
     *         "type": "string"
     *       },
     *       "disabled": {
     *         "description": "Specifies whether the menu item should be disabled.",
     *         "type": "boolean"
     *       },
     *       "onAction": {
     *         "description": "A callback function invoked when the menu item is selected.",
     *         "type": "function"
     *       },
     *       "startIcon": {
     *         "description": "Specifies an icon to show at the start position of the menu item.",
     *         "type": "object",
     *         "properties": {
     *           "type": {
     *             "type": "string",
     *             "enumValues": [
     *               "class",
     *               "img"
     *             ]
     *           },
     *           "class": {
     *             "type": "string"
     *           },
     *           "src": {
     *             "type": "string"
     *           }
     *         }
     *       },
     *       "endIcon": {
     *         "description": "Specifies an icon to show at the end position of the menu item.",
     *         "type": "object",
     *         "properties": {
     *           "type": {
     *             "type": "string",
     *             "enumValues": [
     *               "class",
     *               "img"
     *             ]
     *           },
     *           "class": {
     *             "type": "string"
     *           },
     *           "src": {
     *             "type": "string"
     *           }
     *         }
     *       },
     *       "variant": {
     *         "description": "Specifies styling for the menu item based upon its associated action.",
     *         "type": "string",
     *         "enumValues": [
     *           "standard",
     *           "destructive"
     *         ],
     *         "propertyEditorValues": {
     *           "standard": {
     *             "description": "Styling for a standard menu item"
     *           },
     *           "destructive": {
     *              "description": "Styling for a menu item associated with a non-reversible action"
     *           }
     *         }
     *       }
     *     }
     *   }
     * }
     */
    items?: MenuItems[];
    /**
     * @ojmetadata description "Triggered when a menu item is clicked, whether by keyboard, mouse,
     *    or touch events. Detail indicates which menu item was clicked."
     * @ojmetadata eventGroup "common"
     * @ojmetadata help "#event:ojMenuAction"
     */
    onOjMenuAction?: Action<MenuItemSelectionDetail> & Bubbles;
    /**
     * @ojmetadata description "Text to show in the tooltip."
     * @ojmetadata help "#tooltip"
     * @ojmetadata translatable
     */
    tooltip?: string;
    /**
     * @ojmetadata description "Specifies that the button element should be disabled."
     * @ojmetadata help "#disabled"
     */
    disabled?: boolean;
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
    size?: PreactSplitMenuButtonProps['size'];
    /**
     * @ojmetadata description "Specifies that the button style width"
     * @ojmetadata help "#width"
     */
    width?: Size;
    /**
     * @ojmetadata description "Indicates in what states the button has chromings in background and border. "
     * @ojmetadata help "#chroming"
     * @ojmetadata propertyEditorValues {
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
     *   }
     */
    chroming?: PreactSplitMenuButtonProps['variant'];
    /**
     * @ojmetadata description "Triggered when a button is clicked, whether by keyboard, mouse,
     *    or touch events. To meet accessibility requirements, the only supported way to react
     *    to the click of a button is to listen for this event."
     * @ojmetadata eventGroup "common"
     * @ojmetadata help "#event:action"
     */
    onOjAction?: Action & Bubbles;
};
type SplitMenuButtonHandle = {
    focus: () => void;
    blur: () => void;
    click: () => void;
};
/**
 * @classdesc
 * <h3 id="splitMenuButtonOverview-section">
 *   JET Split Menu Button
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#buttonOverview-section"></a>
 * </h3>
 *
 * <p>Description: A Split Menu Button combines a push button and menu button.
 *
 * <pre class="prettyprint"><code>&lt;oj-c-split-menu-button label="Copy" onAction="[[action]]" items="[[items]]">
 * &lt;/oj-c-split-menu-button>
 * </code></pre>
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
 *       <td>Button</td>
 *       <td><kbd>Tap on action side</kbd></td>
 *       <td>Invoke the action.</td>
 *     </tr>
 *     <tr>
 *       <td>Button</td>
 *       <td><kbd>Tap on menu side</kbd></td>
 *       <td>Invoke the menu.</td>
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
 *       <td>Split Menu Button</td>
 *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
 *       <td>Invoke the Button action.</td>
 *     </tr>
 *     <tr>
 *       <td>Split Menu Button</td>
 *       <td><kbd>Down Arrow</kbd></td>
 *       <td>Invoke the Button menu.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>For accessibility, the label is used as the accessible aria label.  This is required
 * as persistent split menu buttons modify the label depending on the last menu item selection.
 *
 * <p>oj-c-split-menu-button follows the ARIA Authoring Practices Guide patterns for
 * <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/">menu</a> and
 * <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/">menu button</a>.
 * Note that this is an implementation detail that may change in the future.
 *
 * {@include accessibility_doc.ts#a11y-section-disabled-content}
 *
 * @ojmetadata description "A Split Menu Button combines a push button and menu button."
 * @ojmetadata displayName "Split Menu Button"
 * @ojmetadata help "oj-c.SplitMenuButton.html"
 * @ojmetadata main "oj-c/split-menu-button"
 * @ojmetadata status [
 *   {
 *     type: "production",
 *     since: "17.0.0"
 *   }
 * ]
 * @ojmetadata extension {
 *   "catalog": {
 *     "category": "Controls"
 *   },
 *   "vbdt": {
 *     "module": "oj-c/split-menu-button",
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-menu-button",
 *     "uxSpecs": [
 *       "menu-button"
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
 *   },
 *   {
 *     "propertyGroup": "data",
 *     "items": [
 *       "items"
 *     ]
 *   }
 * ]
 * @ojmetadata since "14.0.0"
 */
declare function SplitMenuButtonImpl({ label, chroming, disabled, size, items, width, tooltip, onOjMenuAction, onOjAction, 'aria-describedby': ariaDescribedBy, ...otherProps }: Props, ref: Ref<SplitMenuButtonHandle>): import("preact").JSX.Element;
/**
 * This export corresponds to the SplitMenuButton Preact component. For the oj-c-split-menu-button custom element, import CSplitMenuButtonElement instead.
 */
export declare const SplitMenuButton: ComponentType<ExtendGlobalProps<ComponentProps<typeof SplitMenuButtonImpl>> & {
    ref?: Ref<SplitMenuButtonHandle>;
}>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-split-menu-button custom element. For the SplitMenuButton Preact component, import SplitMenuButton instead.
 */
export interface CSplitMenuButtonElement extends JetElement<CSplitMenuButtonElementSettableProperties>, CSplitMenuButtonElementSettableProperties {
    addEventListener<T extends keyof CSplitMenuButtonElementEventMap>(type: T, listener: (this: HTMLElement, ev: CSplitMenuButtonElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CSplitMenuButtonElementSettableProperties>(property: T): CSplitMenuButtonElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CSplitMenuButtonElementSettableProperties>(property: T, value: CSplitMenuButtonElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CSplitMenuButtonElementSettableProperties>): void;
    setProperties(properties: CSplitMenuButtonElementSettablePropertiesLenient): void;
    blur: () => void;
    click: () => void;
    focus: () => void;
}
export namespace CSplitMenuButtonElement {
    interface ojMenuAction extends CustomEvent<MenuItemSelectionDetail & {}> {
    }
    interface ojAction extends CustomEvent<{}> {
    }
    type chromingChanged = JetElementCustomEventStrict<CSplitMenuButtonElement['chroming']>;
    type disabledChanged = JetElementCustomEventStrict<CSplitMenuButtonElement['disabled']>;
    type itemsChanged = JetElementCustomEventStrict<CSplitMenuButtonElement['items']>;
    type labelChanged = JetElementCustomEventStrict<CSplitMenuButtonElement['label']>;
    type sizeChanged = JetElementCustomEventStrict<CSplitMenuButtonElement['size']>;
    type tooltipChanged = JetElementCustomEventStrict<CSplitMenuButtonElement['tooltip']>;
    type widthChanged = JetElementCustomEventStrict<CSplitMenuButtonElement['width']>;
}
export interface CSplitMenuButtonElementEventMap extends HTMLElementEventMap {
    'ojMenuAction': CSplitMenuButtonElement.ojMenuAction;
    'ojAction': CSplitMenuButtonElement.ojAction;
    'chromingChanged': JetElementCustomEventStrict<CSplitMenuButtonElement['chroming']>;
    'disabledChanged': JetElementCustomEventStrict<CSplitMenuButtonElement['disabled']>;
    'itemsChanged': JetElementCustomEventStrict<CSplitMenuButtonElement['items']>;
    'labelChanged': JetElementCustomEventStrict<CSplitMenuButtonElement['label']>;
    'sizeChanged': JetElementCustomEventStrict<CSplitMenuButtonElement['size']>;
    'tooltipChanged': JetElementCustomEventStrict<CSplitMenuButtonElement['tooltip']>;
    'widthChanged': JetElementCustomEventStrict<CSplitMenuButtonElement['width']>;
}
export interface CSplitMenuButtonElementSettableProperties extends JetSettableProperties {
    chroming?: Props['chroming'];
    disabled?: Props['disabled'];
    items?: Props['items'];
    label: Props['label'];
    size?: Props['size'];
    tooltip?: Props['tooltip'];
    width?: Props['width'];
}
export interface CSplitMenuButtonElementSettablePropertiesLenient extends Partial<CSplitMenuButtonElementSettableProperties> {
    [key: string]: any;
}
export interface SplitMenuButtonIntrinsicProps extends Partial<Readonly<CSplitMenuButtonElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojAction?: (value: CSplitMenuButtonElementEventMap['ojAction']) => void;
    onojMenuAction?: (value: CSplitMenuButtonElementEventMap['ojMenuAction']) => void;
    onchromingChanged?: (value: CSplitMenuButtonElementEventMap['chromingChanged']) => void;
    ondisabledChanged?: (value: CSplitMenuButtonElementEventMap['disabledChanged']) => void;
    onitemsChanged?: (value: CSplitMenuButtonElementEventMap['itemsChanged']) => void;
    onlabelChanged?: (value: CSplitMenuButtonElementEventMap['labelChanged']) => void;
    onsizeChanged?: (value: CSplitMenuButtonElementEventMap['sizeChanged']) => void;
    ontooltipChanged?: (value: CSplitMenuButtonElementEventMap['tooltipChanged']) => void;
    onwidthChanged?: (value: CSplitMenuButtonElementEventMap['widthChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-split-menu-button': SplitMenuButtonIntrinsicProps;
        }
    }
}
