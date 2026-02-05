/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Toolbar as PreactToolbar } from '@oracle/oraclejet-preact/UNSAFE_Toolbar';
import { ComponentProps } from 'preact';
import { Action, Bubbles, ObservedGlobalProps, PropertyChanged } from 'ojs/ojvcomponent';
import { ToolbarItems, ToolbarActionDetail, ToolbarSelection, ToolbarSelectionDetail, ItemChroming, ItemSizes } from './items-toolbar';
export { ToolbarSelection };
type PreactToolbarProps = ComponentProps<typeof PreactToolbar>;
/**
 * This export corresponds to the Toolbar Preact component. For the oj-c-toolbar custom element, import CToolbarElement instead.
 */
export declare const Toolbar: import("preact").ComponentType<import("ojs/ojvcomponent").ExtendGlobalProps<ObservedGlobalProps<"aria-controls" | "aria-label"> & {
    /**
     * @ojmetadata description "Specifies the spacing between content. 'sm' spacing is recommended for button variants that don't have a background or border, for example borderless buttons. 'lg' spacing is recommended for button variants that have a background or border, for example outlined or solid buttons."
     * @ojmetadata displayName "spacing"
     * @ojmetadata help "#spacing"
     * @ojmetadata propertyEditorValues {
     *     "sm": {
     *       "description": "Compact spacing between content.",
     *       "displayName": "Small"
     *     },
     *    "lg": {
     *       "description": "Default spacing between content.",
     *       "displayName": "Large"
     *    }
     *  }
     */
    spacing?: PreactToolbarProps["spacing"];
    /**
     * @ojmetadata description "Specifies the chroming to be set on content to be placed into the toolbar."
     * @ojmetadata displayName "chroming"
     * @ojmetadata help "#chroming"
     */
    chroming?: ItemChroming;
    /**
     * @ojmetadata description "Specifies the size of content to be placed into the toolbar."
     * @ojmetadata displayName "size"
     * @ojmetadata help "#size"
     */
    size?: ItemSizes;
    /**
     * @ojmetadata description "Specifies the content to be placed into the toolbar."
     * @ojmetadata displayName "items"
     * @ojmetadata help "#items"
     * @ojmetadata extension {
     *  webelement: {
     *    exceptionStatus: [
     *      {
     *        type: "unsupported",
     *        since: "18.0.5",
     *        description: "Stop 'items' property test adapter generation based upon metadata, and instead use override to freeze the API."
     *      }
     *    ]
     *  },
     *  vbdt: {
     *    pi: {
     *      events: {
     *        suggestions: [
     *          {
     *            type: "component",
     *            name: "ojMenuAction",
     *            mappings: [
     *              {
     *                variableName: "menuItemKey",
     *                expression: "{{$event.detail.key}}",
     *                type: "string"
     *              }
     *            ]
     *          }
     *        ]
     *      }
     *    },
     *    itemProperties: {
     *      type: {
     *        description: "Specifies the type of the toolbar item.",
     *        type: "string",
     *        required: true,
     *        enumValues: [
     *          "button",
     *          "menu-button",
     *          "split-menu-button",
     *          "buttonset-single",
     *          "buttonset-multiple",
     *          "toggle-button",
     *          "progress-button",
     *          "separator"
     *        ],
     *        propertyEditorValues: {
     *          "button": {
     *            displayName: "Button"
     *          },
     *          "menu-button": {
     *            displayName: "Menu Button"
     *          },
     *          "split-menu-button": {
     *            displayName: "Split Menu Button"
     *          },
     *          "buttonset-single": {
     *            displayName: "Buttonset Single"
     *          },
     *          "buttonset-multiple": {
     *            displayName: "Buttonset Multiple"
     *          },
     *          "toggle-button": {
     *            displayName: "Toggle Button"
     *          },
     *          "progress-button": {
     *            displayName: "Progress Button"
     *          },
     *          "separator": {
     *            displayName: "Separator"
     *          }
     *        }
     *      },
     *      chroming: {
     *        description: "Indicates in what states the item has variants in background and border.",
     *        type: "string",
     *        enumValues: [
     *          "solid",
     *          "borderless",
     *          "outlined",
     *          "ghost",
     *          "callToAction",
     *          "danger"
     *        ],
     *        propertyEditorValues: {
     *          solid: {
     *            description: "Valid for Button, Menu Button, Split Menu Button, and Progress Button items."
     *          },
     *          borderless: {
     *            description: "Valid for Button, Menu Button, Buttonset, Toggle Button, and Progress Button items."
     *          },
     *          outlined: {
     *            description: "Valid for Button, Menu Button, Split Menu Button, Buttonset, Toggle Button, and Progress Button items."
     *          },
     *          ghost: {
     *            description: "Valid for Button and Menu Button items."
     *          },
     *          callToAction: {
     *            description: "Valid for Button, Split Menu Button, and Progress Button items."
     *          },
     *          danger: {
     *            description: "Valid for Button items."
     *          }
     *        }
     *      },
     *      disabled: {
     *        description: "Specifies whether the item should be disabled.",
     *        type: "boolean"
     *      },
     *      display: {
     *        description: "Display just the labels, the icons, or all (not supported for Split Menu Button items).",
     *        type: "string",
     *        enumValues: [
     *          "all",
     *          "labels",
     *          "icons"
     *        ]
     *      },
     *      endIcon: {
     *        description: "Optional icon to show at the end position of an item (not supported for Split Menu Button nor Buttonset items).",
     *        type: "object",
     *        properties: {
     *          type: {
     *            type: "string",
     *            enumValues: [
     *              "class",
     *              "img"
     *            ]
     *          },
     *          class: {
     *            type: "string"
     *          },
     *          src: {
     *            type: "string"
     *          }
     *        }
     *      },
     *      isLoading: {
     *        description: "Specifies if progress should be shown (only valid for Progress Button items).",
     *        type: "boolean"
     *      },
     *      items: {
     *        description: "Specifies the content for Menu Button, Split Menu Button, and Buttonset items. See the Help documentation for more information.",
     *        type: "Array<object>",
     *        properties: {
     *          disabled: {
     *            description: "Specifies if the menu item or buttonset toggle item is disabled.",
     *            type: "boolean"
     *          },
     *          endIcon: {
     *            description: "Optional icon to show at the end position of a top-level menu item or of a buttonset toggle item (not supported for submenu items).",
     *            type: "object",
     *            properties: {
     *              type: {
     *                type: "string",
     *                enumValues: [
     *                  "class",
     *                  "img"
     *                ]
     *              },
     *              class: {
     *                type: "string"
     *              },
     *              src: {
     *                type: "string"
     *              }
     *            }
     *          },
     *          items: {
     *            description: "Specifies submenu or select menu content. See the Help documentation for more information.",
     *            type: "Array<object>"
     *          },
     *          key: {
     *            description: "A unique key associated with the menu item.",
     *            type: "string"
     *          },
     *          label: {
     *            description: "Text to show in the menu item or the buttonset toggle item.",
     *            type: "string",
     *            translatable: true
     *          },
     *          onAction: {
     *            description: "An optional callback function associated with a top-level menu item (not supported for submenu items).",
     *            type: "function"
     *          },
     *          startIcon: {
     *            description: "Optional icon to show at the start position of a top-level menu item or a buttonset toggle item (not supported for submenu items).",
     *            type: "object",
     *            properties: {
     *              type: {
     *                type: "string",
     *                enumValues: [
     *                  "class",
     *                  "img"
     *                ]
     *              },
     *              class: {
     *                type: "string"
     *              },
     *              src: {
     *                type: "string"
     *              }
     *            }
     *          },
     *          type: {
     *            description: "Specifies the type of the menu item (not supported for buttonset toggle items).",
     *            type: "string",
     *            enumValues: [
     *              "item",
     *              "submenu",
     *              "selectsingle",
     *              "selectmultiple",
     *              "separator"
     *            ]
     *          },
     *          value: {
     *            description: "The value associated with a buttonset toggle item (not supported for menu items).",
     *            type: "string"
     *          },
     *          variant: {
     *            description: "Specifies the behavior of a top-level menu item (not supported for submenu items nor buttonset toggle items).",
     *            type: "string",
     *            enumValues: [
     *              "standard",
     *              "destructive"
     *            ]
     *          }
     *        }
     *      },
     *      key: {
     *        description: "A unique key associated with the item (not supported for Menu Button items, and required for all other items).",
     *        type: "string"
     *      },
     *      label: {
     *        description: "Text to show in the item (not supported for Buttonset items, and required for all other items).",
     *        type: "string",
     *        translatable: true
     *      },
     *      onAction: {
     *        description: "A callback function associated with the item (only valid for Button, Split Menu Button, and Progress Button items).",
     *        type: "function"
     *      },
     *      startIcon: {
     *        description: "Optional icon to show at the start position of an item (not supported for Split Menu Button nor Buttonset items).",
     *        type: "object",
     *        properties: {
     *          type: {
     *            type: "string",
     *            enumValues: [
     *              "class",
     *              "img"
     *            ]
     *          },
     *          class: {
     *            type: "string"
     *          },
     *          src: {
     *            type: "string"
     *          }
     *        }
     *      },
     *      suffix: {
     *        description: "Optional suffix appended to menu label to indicate last selection (only valid for Menu Button items).",
     *        type: "string",
     *        translatable: true
     *      },
     *      tooltip: {
     *        description: "Optional override text for the default tooltip that renders the label when in icon mode (not supported for Buttonset items).",
     *        type: "string",
     *        translatable: true
     *      }
     *    }
     *  }
     * }
     */
    items?: ToolbarItems[];
    /**
     * @ojmetadata description "An array containing key/value objects for selection groups."
     * @ojmetadata displayName "toolbarSelection"
     * @ojmetadata help "#toolbarSelection"
     */
    toolbarSelection?: Readonly<Record<string, ToolbarSelection>>;
    /**
     * @ojmetadata description "Writeback support for the selection property."
     * @ojmetadata displayName "onToolbarSelectionChanged"
     * @ojmetadata help "#selection"
     */
    onToolbarSelectionChanged?: PropertyChanged<Record<string, ToolbarSelection>>;
    /**
     * @ojmetadata description "Triggered when a toolbar item is clicked, whether by keyboard, mouse,
     *    or touch events. Detail indicates which toolbar item was clicked."
     * @ojmetadata eventGroup "common"
     * @ojmetadata help "#event:ojToolbarAction"
     */
    onOjToolbarAction?: Action<ToolbarActionDetail> & Bubbles;
    /**
     * @ojmetadata description "Triggered when a toolbar selection group item is clicked, whether by keyboard, mouse,
     *    or touch events. Detail indicates new selection value for group."
     * @ojmetadata eventGroup "common"
     * @ojmetadata help "#event:ojToolbarSelection"
     */
    onOjToolbarSelection?: Action<ToolbarSelectionDetail> & Bubbles;
}>>;
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-toolbar custom element. For the Toolbar Preact component, import Toolbar instead.
 */
export interface CToolbarElement extends JetElement<CToolbarElementSettableProperties>, CToolbarElementSettableProperties {
    addEventListener<T extends keyof CToolbarElementEventMap>(type: T, listener: (this: HTMLElement, ev: CToolbarElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CToolbarElementSettableProperties>(property: T): CToolbarElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CToolbarElementSettableProperties>(property: T, value: CToolbarElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CToolbarElementSettableProperties>): void;
    setProperties(properties: CToolbarElementSettablePropertiesLenient): void;
}
export namespace CToolbarElement {
    interface ojToolbarAction extends CustomEvent<ToolbarActionDetail & {}> {
    }
    interface ojToolbarSelection extends CustomEvent<ToolbarSelectionDetail & {}> {
    }
    type chromingChanged = JetElementCustomEventStrict<CToolbarElement['chroming']>;
    type itemsChanged = JetElementCustomEventStrict<CToolbarElement['items']>;
    type sizeChanged = JetElementCustomEventStrict<CToolbarElement['size']>;
    type spacingChanged = JetElementCustomEventStrict<CToolbarElement['spacing']>;
    type toolbarSelectionChanged = JetElementCustomEventStrict<CToolbarElement['toolbarSelection']>;
}
export interface CToolbarElementEventMap extends HTMLElementEventMap {
    'ojToolbarAction': CToolbarElement.ojToolbarAction;
    'ojToolbarSelection': CToolbarElement.ojToolbarSelection;
    'chromingChanged': JetElementCustomEventStrict<CToolbarElement['chroming']>;
    'itemsChanged': JetElementCustomEventStrict<CToolbarElement['items']>;
    'sizeChanged': JetElementCustomEventStrict<CToolbarElement['size']>;
    'spacingChanged': JetElementCustomEventStrict<CToolbarElement['spacing']>;
    'toolbarSelectionChanged': JetElementCustomEventStrict<CToolbarElement['toolbarSelection']>;
}
export interface CToolbarElementSettableProperties extends JetSettableProperties {
    chroming?: ComponentProps<typeof Toolbar>['chroming'];
    items?: ComponentProps<typeof Toolbar>['items'];
    size?: ComponentProps<typeof Toolbar>['size'];
    spacing?: ComponentProps<typeof Toolbar>['spacing'];
    toolbarSelection?: ComponentProps<typeof Toolbar>['toolbarSelection'];
}
export interface CToolbarElementSettablePropertiesLenient extends Partial<CToolbarElementSettableProperties> {
    [key: string]: any;
}
export interface ToolbarIntrinsicProps extends Partial<Readonly<CToolbarElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    onojToolbarAction?: (value: CToolbarElementEventMap['ojToolbarAction']) => void;
    onojToolbarSelection?: (value: CToolbarElementEventMap['ojToolbarSelection']) => void;
    onchromingChanged?: (value: CToolbarElementEventMap['chromingChanged']) => void;
    onitemsChanged?: (value: CToolbarElementEventMap['itemsChanged']) => void;
    onsizeChanged?: (value: CToolbarElementEventMap['sizeChanged']) => void;
    onspacingChanged?: (value: CToolbarElementEventMap['spacingChanged']) => void;
    ontoolbarSelectionChanged?: (value: CToolbarElementEventMap['toolbarSelectionChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-toolbar': ToolbarIntrinsicProps;
        }
    }
}
