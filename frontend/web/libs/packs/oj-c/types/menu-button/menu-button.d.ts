/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ExtendGlobalProps, ObservedGlobalProps, PropertyChanged, Slot, Action, Bubbles } from 'ojs/ojvcomponent';
import { MenuButton as PreactMenuButton } from '@oracle/oraclejet-preact/UNSAFE_MenuButton';
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
import { ItemsMenu, type MenuItemSelectionDetail, type SelectMenuItemDetail, type MenuSelection, MenuItems } from 'oj-c/utils/PRIVATE_ItemsMenu/items-menu';
import { type MenuValueUpdateDetail } from '@oracle/oraclejet-preact/UNSAFE_Menu/menuUtils';
import { ComponentProps, Ref, ComponentType } from 'preact';
import 'css!oj-c/menu-button/menu-button-styles.css';
export type PreactMenuButtonProps = ComponentProps<typeof PreactMenuButton>;
type ItemsMenuProps = ComponentProps<typeof ItemsMenu>;
/** @deprecated since 19.0.0 - use 'CMenuButtonElement.&lt;ojMenuAction&gt;[&apos;detail&apos;]' instead */
export type MenuValueUpdateDetailDeprecated<T> = MenuValueUpdateDetail<T>;
/** @deprecated since 19.0.0 - use 'CMenuButtonElement[&apos;selection&apos;]' instead */
export type MenuSelectionDeprecated = MenuSelection;
/** @deprecated since 19.0.0 - use 'CMenuButtonElement.&lt;ojMenuSelection&gt;[&apos;detail&apos;]' instead */
export type MenuItemSelectionDetailDeprecated = MenuItemSelectionDetail;
/** @deprecated since 19.0.0 - use 'CMenuButtonElement[&apos;items&apos;]' instead */
export type MenuItemsDeprecated = MenuItems;
type ItemsMenuButtonProps = {
    items: MenuItems[];
};
type MenuButtonMenuSelectionDetail = SelectMenuItemDetail<MenuSelection>;
type Props = ObservedGlobalProps<'aria-describedby' | 'aria-label'> & {
    /**
     * @ojmetadata description "Text to show in the button."
     * @ojmetadata help "#label"
     * @ojmetadata required
     * @ojmetadata translatable
     */
    label: string;
    /**
     * @ojmetadata description "Suffix appended to menu label to indicate last selection."
     * @ojmetadata help "#label"
     * @ojmetadata translatable
     */
    suffix?: string;
    /**
     * @ojmetadata description "Text to show in the tooltip. This overrides the default tooltip that renders the label when in icon mode."
     * @ojmetadata help "#tooltip"
     * @ojmetadata translatable
     */
    tooltip?: string;
    /**
     * @ojmetadata description "The startIcon slot is the button's start icon. The oj-c-menu-button element accepts DOM nodes as children with the startIcon slot."
     * @ojmetadata displayName "startIcon"
     * @ojmetadata help "#startIcon"
     */
    startIcon?: Slot;
    /**
     * @ojmetadata description "The endIcon slot is the button's end icon. The oj-c-menu-button element accepts DOM nodes as children with the endIcon slot."
     * @ojmetadata help "#endIcon"
     */
    endIcon?: Slot;
    /**
     * @ojmetadata description "Items describe the menu items rendered by the menu button."
     * @ojmetadata help "#items"
     */
    items?: ItemsMenuButtonProps['items'];
    /**
     * @ojmetadata description "Triggered when a menu item is clicked, whether by keyboard, mouse,
     *    or touch events. Detail indicates which menu item was clicked."
     * @ojmetadata eventGroup "common"
     * @ojmetadata help "#event:ojMenuAction"
     */
    onOjMenuAction?: Action<MenuItemSelectionDetail> & Bubbles;
    /**
     * @ojmetadata description "Triggered when a menu selection group item is clicked, whether by keyboard, mouse,
     *    or touch events. Detail indicates new selection value for group."
     * @ojmetadata eventGroup "common"
     * @ojmetadata help "#event:ojMenuSelection"
     */
    onOjMenuSelection?: Action<MenuButtonMenuSelectionDetail> & Bubbles;
    /**
     * @description
     * An array containing key/value objects for menu selection groups.
     * @ojmetadata description "An array containing key/value objects for menu selection groups."
     * @ojmetadata help "#selection"
     */
    selection?: ItemsMenuProps['selection'];
    /**
     * @ojmetadata description Writeback support for the selection property
     * @ojmetadata help "#selection"
     */
    onSelectionChanged?: PropertyChanged<ItemsMenuProps['selection']>;
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
     * @ojmetadata description "Specifies that the button element should be disabled."
     * @ojmetadata displayName "disabled"
     * @ojmetadata help "#disabled"
     */
    disabled?: boolean;
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
    size?: PreactMenuButtonProps['size'];
    /**
     * @ojmetadata description "Specifies that the button style width"
     * @ojmetadata displayName "width"
     * @ojmetadata help "#width"
     */
    width?: Size;
    /**
     * @ojmetadata description "Indicates in what states the button has chromings in background and border. "
     * @ojmetadata displayName "chroming"
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
     *     }
     *   }
     */
    chroming?: PreactMenuButtonProps['variant'];
};
type MenuButtonHandle = {
    focus: () => void;
    blur: () => void;
    click: () => void;
};
/**
 * @classdesc
 * <h3 id="MenuButtonOverview-section">
 *   JET Menu Button
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#buttonOverview-section"></a>
 * </h3>
 *
 * <p>Description: A menu button launches a menu when clicked.
 *
 * <pre class="prettyprint"><code>&lt;oj-c-menu-button label="Copy" items="[[items]]">
 * &lt;/oj-c-menu-button>
 * </code></pre>
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
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
 *       <td>Menu Button</td>
 *       <td><kbd>Enter</kbd> or <kbd>Space</kbd> or <kbd>Down Arrow</kbd></td>
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
 * <p>For accessibility, the label and suffix are used as the accessible aria label.  This is required
 * as persistent menu buttons or suffixes modify the label depending on the last menu item selection.
 *
 * <p>oj-c-menu-button follows the ARIA Authoring Practices Guide patterns for
 * <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/">menu</a> and
 * <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/">menu button</a>.
 * Note that this is an implementation detail that may change in the future.
 *
 * {@include accessibility_doc.ts#a11y-section-disabled-content}
 *
 * @ojmetadata description "A menu button launches a menu when clicked."
 * @ojmetadata displayName "Menu Button"
 * @ojmetadata help "oj-c.MenuButton.html"
 * @ojmetadata main "oj-c/menu-button"
 * @ojmetadata extension {
 *   "catalog": {
 *     "category": "Controls"
 *   },
 *   "vbdt": {
 *     "module": "oj-c/menu-button",
 *     "pi":{
 *       "events":{
 *         "suggestions":[
 *             { "type":"component",
 *                "name": "ojMenuAction",
 *                "mappings": [
 *                  { "variableName": "menuItemKey",
 *                     "expression": "{{$event.detail.key}}",
 *                     "type": "string"
 *                  }
 *                ]
 *             },
 *             { "type":"component",
 *                "name": "onOjMenuSelection",
 *                "mappings": [
 *                  { "variableName": "menuSelectionValue",
 *                     "expression": "{{$event.detail.value}}",
 *                     "type": "string"
 *                  },
 *                  { "variableName": "menuSelectionGroupKey",
 *                     "expression": "{{$event.detail.menuSelectionGroupKey}}",
 *                     "type": "string"
 *                  }
 *                ]
 *              },
 *            ]
 *         }
 *      }
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
 *       "edge",
 *       "disabled"
 *     ]
 *    },
 *   {
 *     "propertyGroup": "data",
 *     "items": [
 *       "suffix",
 *       "items"
 *       "selection"
 *     ]
 *   }
 * ]
 * @ojmetadata since "16.0.0"
 * @ojmetadata status [
 *   {
 *     "type": "supersedes",
 *     "since": "16.0.0",
 *     "value": ["oj-menu-button","oj-menu-select-many"]
 *   }
 * ]
 */
declare function MenuButtonImpl({ label, chroming, disabled, size, display, items, tooltip, suffix, startIcon, endIcon, selection, onSelectionChanged, onOjMenuAction, onOjMenuSelection, 'aria-label': accessibleLabel, 'aria-describedby': ariaDescribedBy, width }: Props, ref: Ref<MenuButtonHandle>): import("preact").JSX.Element;
/**
 * This export corresponds to the MenuButton Preact component. For the oj-c-menu-button custom element, import CMenuButtonElement instead.
 */
export declare const MenuButton: ComponentType<ExtendGlobalProps<ComponentProps<typeof MenuButtonImpl>> & {
    ref?: Ref<MenuButtonHandle>;
}>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-menu-button custom element. For the MenuButton Preact component, import MenuButton instead.
 */
export interface CMenuButtonElement extends JetElement<CMenuButtonElementSettableProperties>, CMenuButtonElementSettableProperties {
    addEventListener<T extends keyof CMenuButtonElementEventMap>(type: T, listener: (this: HTMLElement, ev: CMenuButtonElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CMenuButtonElementSettableProperties>(property: T): CMenuButtonElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CMenuButtonElementSettableProperties>(property: T, value: CMenuButtonElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CMenuButtonElementSettableProperties>): void;
    setProperties(properties: CMenuButtonElementSettablePropertiesLenient): void;
    blur: () => void;
    click: () => void;
    focus: () => void;
}
export namespace CMenuButtonElement {
    interface ojMenuAction extends CustomEvent<MenuItemSelectionDetail & {}> {
    }
    interface ojMenuSelection extends CustomEvent<MenuButtonMenuSelectionDetail & {}> {
    }
    type chromingChanged = JetElementCustomEventStrict<CMenuButtonElement['chroming']>;
    type disabledChanged = JetElementCustomEventStrict<CMenuButtonElement['disabled']>;
    type displayChanged = JetElementCustomEventStrict<CMenuButtonElement['display']>;
    type itemsChanged = JetElementCustomEventStrict<CMenuButtonElement['items']>;
    type labelChanged = JetElementCustomEventStrict<CMenuButtonElement['label']>;
    type selectionChanged = JetElementCustomEventStrict<CMenuButtonElement['selection']>;
    type sizeChanged = JetElementCustomEventStrict<CMenuButtonElement['size']>;
    type suffixChanged = JetElementCustomEventStrict<CMenuButtonElement['suffix']>;
    type tooltipChanged = JetElementCustomEventStrict<CMenuButtonElement['tooltip']>;
    type widthChanged = JetElementCustomEventStrict<CMenuButtonElement['width']>;
}
export interface CMenuButtonElementEventMap extends HTMLElementEventMap {
    'ojMenuAction': CMenuButtonElement.ojMenuAction;
    'ojMenuSelection': CMenuButtonElement.ojMenuSelection;
    'chromingChanged': JetElementCustomEventStrict<CMenuButtonElement['chroming']>;
    'disabledChanged': JetElementCustomEventStrict<CMenuButtonElement['disabled']>;
    'displayChanged': JetElementCustomEventStrict<CMenuButtonElement['display']>;
    'itemsChanged': JetElementCustomEventStrict<CMenuButtonElement['items']>;
    'labelChanged': JetElementCustomEventStrict<CMenuButtonElement['label']>;
    'selectionChanged': JetElementCustomEventStrict<CMenuButtonElement['selection']>;
    'sizeChanged': JetElementCustomEventStrict<CMenuButtonElement['size']>;
    'suffixChanged': JetElementCustomEventStrict<CMenuButtonElement['suffix']>;
    'tooltipChanged': JetElementCustomEventStrict<CMenuButtonElement['tooltip']>;
    'widthChanged': JetElementCustomEventStrict<CMenuButtonElement['width']>;
}
export interface CMenuButtonElementSettableProperties extends JetSettableProperties {
    chroming?: Props['chroming'];
    disabled?: Props['disabled'];
    display?: Props['display'];
    items?: Props['items'];
    label: Props['label'];
    /**
     * An array containing key/value objects for menu selection groups.
     */
    selection?: Props['selection'];
    size?: Props['size'];
    suffix?: Props['suffix'];
    tooltip?: Props['tooltip'];
    width?: Props['width'];
}
export interface CMenuButtonElementSettablePropertiesLenient extends Partial<CMenuButtonElementSettableProperties> {
    [key: string]: any;
}
export interface MenuButtonIntrinsicProps extends Partial<Readonly<CMenuButtonElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    onojMenuAction?: (value: CMenuButtonElementEventMap['ojMenuAction']) => void;
    onojMenuSelection?: (value: CMenuButtonElementEventMap['ojMenuSelection']) => void;
    onchromingChanged?: (value: CMenuButtonElementEventMap['chromingChanged']) => void;
    ondisabledChanged?: (value: CMenuButtonElementEventMap['disabledChanged']) => void;
    ondisplayChanged?: (value: CMenuButtonElementEventMap['displayChanged']) => void;
    onitemsChanged?: (value: CMenuButtonElementEventMap['itemsChanged']) => void;
    onlabelChanged?: (value: CMenuButtonElementEventMap['labelChanged']) => void;
    onselectionChanged?: (value: CMenuButtonElementEventMap['selectionChanged']) => void;
    onsizeChanged?: (value: CMenuButtonElementEventMap['sizeChanged']) => void;
    onsuffixChanged?: (value: CMenuButtonElementEventMap['suffixChanged']) => void;
    ontooltipChanged?: (value: CMenuButtonElementEventMap['tooltipChanged']) => void;
    onwidthChanged?: (value: CMenuButtonElementEventMap['widthChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-menu-button': MenuButtonIntrinsicProps;
        }
    }
}
