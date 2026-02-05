import type { Action, CancelableAction, ExtendGlobalProps, ObservedGlobalProps, PropertyChanged } from 'ojs/ojvcomponent';
import type { ComponentProps, ComponentChildren, Ref } from 'preact';
import { DataProvider } from 'ojs/ojdataprovider';
import { DataTabBar } from './DataTabBar';
import { ContextMenuItems } from '../utils/PRIVATE_ItemsMenu/items-menu';
export type DataTabBarProps<K extends string | number = string | number> = ComponentProps<typeof DataTabBar<K>>;
/** The type that represents severity */
type Severity = 'warning' | 'info' | 'none' | 'error' | 'confirmation';
/** The object that represents acceptable icon types */
export type TabIconData = {
    type?: 'class';
    class: string;
} | {
    type: 'img';
    src: string;
};
/** The data item object that represents a tab. */
export type TabData<K extends string | number> = {
    /**
     * Key of the TabBarItem
     */
    itemKey: K;
    /**
     * Label of the TabBarItem. For icon only display this label is the content
     * for aria-label and tooltip text of the Tab.
     */
    label: string;
    /**
     * The icon before the label in non-stack case, icon above the label in
     * stacked case or the stand alone icon when no label is specified.
     */
    icon?: TabIconData;
    /**
     * The content to be rendered inside the Badge component.
     */
    badge?: number;
    /**
     * The content to be rendered inside the Text component as a metadata,
     * that appears after the label in non stack case only.
     */
    metadata?: string;
    /**
     * The status icon to be rendered after the label in non stack case only.
     */
    severity?: Severity;
    /**
     * Accepts the tabpanel element's ID associated with the tab item
     */
    tabPanelId?: string;
    /**
     * Renders a remove icon allowing the tabs to be removed.
     */
    isRemovable?: boolean;
};
/** The data item object that represents a tab with link.*/
export type TabLinkItemData<K extends string | number> = {
    /**
     * Key of the TabBarItem
     */
    itemKey: K;
    /**
     * Label of the TabBarItem. For icon only display this label is the content
     * for aria-label and tooltip text of the Tab.
     */
    label: string;
    /**
     * The icon before the label in non-stack case, icon above the label in
     * stacked case or the stand alone icon when no label is specified.
     */
    icon?: TabIconData;
    /**
     * The content to be rendered inside the Badge component.
     */
    badge?: number;
    /**
     * The content to be rendered inside the Text component as a metadata,
     * that appears after the label in non stack case only.
     */
    metadata?: string;
    /**
     * The status icon to be rendered after the label in non stack case only.
     */
    severity?: Severity;
    /**
     * Accepts the tabpanel element's ID associated with the tab item
     */
    tabPanelId?: string;
    /**
     * Sets the URL that the hyperlink points to. If there is no valid URL use "#" for href value to navigate to the top of the page.
     */
    href: string;
};
/** Payload for onOjBeforeSelect and onOjRemove events. */
export type KeyDetail<K extends string | number> = {
    key: K;
};
/** Payload for onOjSelectionAction event. */
export type SelectionActionDetail<K extends string | number> = {
    previousValue: K;
    value: K;
};
/** Payload for onOjReorder event. */
export type ReorderDetail<K extends string | number> = {
    /**
     * The new order of keys after reorder
     */
    reorderedKeys: K[];
};
/** @deprecated since 19.0.0 - use 'TabData.&lt;K&gt;[&apos;icon&apos;]' instead */
export type TabIconDataDeprecated = TabIconData;
/** @deprecated since 19.0.0 - use 'CTabBarElement.&lt;event-name&gt;[&apos;detail&apos;]' instead */
export type KeyDetailDeprecated<K extends string | number> = KeyDetail<K>;
/** @deprecated since 19.0.0 - use 'CTabBarElement.&lt;event-name&gt;[&apos;detail&apos;]' instead */
export type SelectionActionDetailDeprecated<K extends string | number> = SelectionActionDetail<K>;
/** @deprecated since 19.0.0 - use 'CTabBarElement.&lt;event-name&gt;[&apos;detail&apos;]' instead */
export type ReorderDetailDeprecated<K extends string | number> = ReorderDetail<K>;
type CTabBarItemContextMenuContext<K> = {
    itemKey: K;
    hasDefaultMenuItems: boolean;
};
type CTabBarContextMenuConfig<K> = {
    items: (context: CTabBarItemContextMenuContext<K>) => Array<ContextMenuItems | 'defaultMenuItems' | 'remove' | 'reorder'>;
    accessibleLabel?: string;
};
export type Props<K extends string | number> = ObservedGlobalProps<'aria-label' | 'id' | 'aria-labelledby'> & {
    /**
     * @description
     * Specifies the data definitions for the tabs.
     *
     * @ojmetadata description "An array of tabs"
     * @ojmetadata displayName "data"
     * @ojmetadata help "data"
     */
    data?: DataTabBarProps<K>['data'] | DataProvider<K, TabData<K> | TabLinkItemData<K>>;
    /**
     * @description
     * The key of the currently selected tab.
     *
     * @ojmetadata description "The key of the selected tab"
     * @ojmetadata displayName "Selected Tab"
     * @ojmetadata help "#selection"
     */
    selection?: K;
    /**
     * @description
     * Triggered before user selects a tab which includes user gestures or selection is changed programmatically.
     *
     * @ojmetadata description "Triggered before a tab is selected."
     * @ojmetadata displayName "Before Select"
     * @ojmetadata help "#event:beforeSelect"
     */
    onOjBeforeSelect?: CancelableAction<KeyDetail<K>>;
    /**
     * @description
     * Triggered when user performs a remove gesture on a tab. The remove gestures include:
     * <ul>
     *   <li>User clicks the remove icon in a tab</li>
     *   <li>User presses Delete key on a tab</li>
     * </ul>
     *
     * @ojmetadata description "Triggered when user performs a remove gesture on a tab."
     * @ojmetadata displayName "Remove"
     * @ojmetadata help "#event:remove"
     */
    onOjRemove?: Action<KeyDetail<K>>;
    /**
     * @description
     * Triggered when user performs a reorder gesture on a tab. The reorder gestures include:
     * <ul>
     *   <li>User drags a tab and drops it in a new drop location</li>
     *   <li>User presses Command + Shift + Arrow key(s) on a tab</li>
     * </ul>
     * Note: Do not use with <code class="prettyprint"> overflow="popup"</code> as reorder is not supported with
     popup.
     *
     * @ojmetadata description "Triggered when user performs a reorder gesture on a tab."
     * @ojmetadata displayName "Reorder"
     * @ojmetadata help "#event:reorder"
     */
    onOjReorder?: Action<ReorderDetail<K>>;
    /**
     * @description
     * Triggered when user performs a selection action gesture on a tab. The action gestures include:
     * <ul>
     *   <li>User clicks anywhere in a tab</li>
     *   <li>User taps anywhere in a tab</li>
     *   <li>User pressed spacebar or enter key on a tab</li>
     * </ul>
     *
     * @ojmetadata description "Triggered when user performs an action gesture on a tab."
     * @ojmetadata displayName "Selection Action"
     * @ojmetadata help "#event:selectionAction"
     */
    onOjSelectionAction?: Action<SelectionActionDetail<K>>;
    /**
     * @ojmetadata description "Writeback support for the selection property"
     * @ojmetadata displayName "Selection Changed"
     * @ojmetadata help "#selection"
     */
    onSelectionChanged?: PropertyChanged<K>;
    /**
     * @description
     * Specifies if the tabs can be reordered within the tab bar.
     * Note: Do not use with <code class="prettyprint"> overflow="popup"</code> as reorder is not supported with
     popup.
     *
     * @ojmetadata description "The reorderable configuration for tabs."
     * @ojmetadata displayName "reorderable"
     * @ojmetadata propertyEditorValues {
     *     "enabled": {
     *       "description": "Enables reordering of items in tabbar.",
     *       "displayName": "Enabled"
     *     },
     *     "disabled": {
     *       "description": "Disables reordering of items in tabbar.",
     *       "displayName": "Disabled"
     *     }
     *   }
     */
    reorderable?: DataTabBarProps['reorderable'];
    /**
     * @description
     * Specifies the overflow behavior
     *
     * @ojmetadata description "Specifies the overflow behavior."
     * @ojmetadata displayName "Layout"
     * @ojmetadata propertyEditorValues {
     *     "popup": {
     *       "description": "Popup menu will be shown with overflowing items. Note: Setting <code class="prettyprint"> overflow="popup"</code> can trigger browser reflow, so only set it when it is actually required. Do not use with <code class="prettyprint">reorderable="enabled"</code> and <code class="prettyprint">onOjReorder</code> as reorder is not supported with popup.",
     *       "displayName": "Popup"
     *     },
     *     "conveyor": {
     *       "description": "Overflowing tabs are displayed inside a conveyor belt." Note: Do not use with <code class="prettyprint">truncation="progressive"</code> as it is not supported with conveyor.",
     *       "displayName": "Conveyor"
     *     },
     *     "hidden": {
     *       "description": "Overflow is clipped, and the rest of the content will be invisible.",
     *       "displayName": "Hidden"
     *     }
     *   }
     */
    overflow?: DataTabBarProps['overflow'];
    /**
     * @description
     * Whether to display both the label and icons ("standard") or just the icons ("icons") or to render stacked display ("stacked").
     * In the latter case, the label is displayed in a tooltip instead.
     *
     * @ojmetadata description "The display configuration for tabs."
     * @ojmetadata displayName "Tabs Display"
     * @ojmetadata propertyEditorValues {
     *     "standard": {
     *       "description": "Label and icon are shown for all tabs.",
     *       "displayName": "Standard"
     *     },
     *     "icons": {
     *       "description": "Only icons are shown for all tabs.",
     *       "displayName": "Icons"
     *     },
     *     "stacked": {
     *       "description": "Stacks the badge over the icon and icon over the label when applicable.",
     *       "displayName": "Stacked"
     *      }
     *   }
     */
    display?: DataTabBarProps['display'];
    /**
     * @description
     * Whether to stretch the tab bar items to occupy available space or to condense items
     *
     * @ojmetadata description "The layout configuration for tabs."
     * @ojmetadata displayName "Layout"
     * @ojmetadata propertyEditorValues {
     *     "stretch": {
     *       "description": "Stretches the tab bar items to occupy available space ",
     *       "displayName": "Stretch"
     *     },
     *     "condense": {
     *       "description": "Condenses the space occupied by tab bar items",
     *       "displayName": "Condense"
     *     }
     *   }
     */
    layout?: DataTabBarProps['layout'];
    /**
     * @description
     * The position of the TabBar.
     *
     * @ojmetadata description "The edge configuration for tabs."
     * @ojmetadata displayName "Edge"
     * @ojmetadata propertyEditorValues {
     *     "top": {
     *       "description": "top is used when TabBar is placed at the top of content section and the selection
     *       indicator would be placed below the item.",
     *       "displayName": "Top"
     *     },
     *     "bottom": {
     *       "description": "bottom is used when TabBar is placed at the bottom of content section and the selection
     *  indicator would be placed above the item.",
     *       "displayName": "Bottom"
     *     }
     *   }
     */
    edge?: DataTabBarProps['edge'];
    /**
     * @description
     * Truncation applies to the tab labels when there is not enough room to display all tabs.
     *
     * @ojmetadata description "The truncation configuration for tab labels."
     * @ojmetadata displayName "Truncation"
     * @ojmetadata propertyEditorValues {
     *     "none": {
     *       "description": "Tabs always take up the space needed by the label texts.",
     *       "displayName": "None"
     *     },
     *     "progressive": {
     *       "description": "If not enough space is available to display all of the tabs, then the width of each tab label is restricted just enough to allow all tabs to fit. All tab labels that are truncated are displayed with ellipses. However the width of each tab label will not be truncated below a specific threshold. Note: Do not use with <code class="prettyprint"> overflow="conveyor"</code> as progressive truncation is not supported with
     conveyor.",
     *       "displayName": "Progressive"
     *     }
     *   }
     */
    truncation?: DataTabBarProps['truncation'];
    /**
     * @description
     * Specifies a context menu configuration.
     * It takes the keys `accessibleLabel` and `items`,
     * where `accessibleLabel` is optional and items required . `items` function returns an array
     * of menu item object representations that indicates what menu items are going to be part of
     * menu based on some specific context menu context.
     * <table>
     * <tr><th align='left'>Context Menu Item Type</th><th align='left'>Def</th></tr>
     * <tr><td>ContextMenuSeparator</td><td>{ type: 'separator'}</td></tr>
     * <tr><td>MenuItem</td><td>{
     * type?: 'item';
     * label: string;
     * key: string;
     * disabled?: boolean;
     * onAction?: () => void;
     * startIcon?: MenuIcon;
     * endIcon?: MenuIcon;
     * variant?: 'standard' | 'destructive';
     * };</td></tr>
     * <tr><td>ContextMenuSubMenu</td><td>{
     * type: 'submenu';
     * label?: string;
     * disabled?: boolean;
     * startIcon?: string;
     * items?: Array&lt;ContextMenuItems&gt;;
     * };</td></tr>
     * <tr><td>ContextMenuSelectSingle</td><td>{
     * type: 'selectsingle';
     * key?: string;
     * items?: Array&lt;MenuSelectItem&gt;;
     * selection?: string;
     * onSelection?: (detail: { value: string }) => void;
     * };</td></tr>
     * <tr><td>ContextMenuSelectMultiple</td><td>{
     * type: 'selectmultiple';
     * key?: string;
     * items?: Array&lt;MenuSelectItem&gt;;
     * selection?: Array&lt;string&gt;;
     * onSelection?: (detail: { value: Array&lt;string&gt; }) => void;
     * };</td></tr>
     * <tr><td>MenuIcon</td><td>{
     * type?: 'class';
     *     class: string;
     *   }
     * | {
     *     type: 'img';
     *    src: string;
     *   };</td></tr>
     * <tr><td>MenuSelectItem</td><td>{
     * label: string;
     * disabled?: boolean;
     * endIcon?: MenuIcon;
     * value: string;
     * }</td></tr>
     * </table>
     * @ojmetadata description "Specifies a context menu configuration."
     * @ojmetadata displayName "Context Menu Config"
     * @ojmetadata help "#contextMenuConfig"
     */
    contextMenuConfig?: CTabBarContextMenuConfig<K>;
};
type reorderTestHandle = {
    /**
     * @ojmetadata description "This is a private method that should only be called by the webelement API."
     * @ignore
     */
    _doReorderHelper: (tabBarKeys: (string | number)[]) => void;
};
/**
 * This export corresponds to the TabBar Preact component. For the oj-c-tab-bar custom element, import CTabBarElement instead.
 */
export declare const TabBar: <K extends string | number = string | number>(props: ExtendGlobalProps<Props<K>> & {
    ref?: Ref<reorderTestHandle>;
}) => ComponentChildren;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-tab-bar custom element. For the TabBar Preact component, import TabBar instead.
 */
export interface CTabBarElement<K extends string | number = string | number> extends JetElement<CTabBarElementSettableProperties<K>>, CTabBarElementSettableProperties<K> {
    addEventListener<T extends keyof CTabBarElementEventMap<K>>(type: T, listener: (this: HTMLElement, ev: CTabBarElementEventMap<K>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CTabBarElementSettableProperties<K>>(property: T): CTabBarElement<K>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CTabBarElementSettableProperties<K>>(property: T, value: CTabBarElementSettableProperties<K>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CTabBarElementSettableProperties<K>>): void;
    setProperties(properties: CTabBarElementSettablePropertiesLenient<K>): void;
    _doReorderHelper: (tabBarKeys: (string | number)[]) => void;
}
export namespace CTabBarElement {
    interface ojBeforeSelect<K extends string | number = string | number> extends CustomEvent<KeyDetail<K> & {
        accept: (param: Promise<void>) => void;
    }> {
    }
    interface ojRemove<K extends string | number = string | number> extends CustomEvent<KeyDetail<K> & {}> {
    }
    interface ojReorder<K extends string | number = string | number> extends CustomEvent<ReorderDetail<K> & {}> {
    }
    interface ojSelectionAction<K extends string | number = string | number> extends CustomEvent<SelectionActionDetail<K> & {}> {
    }
    type contextMenuConfigChanged<K extends string | number = string | number> = JetElementCustomEventStrict<CTabBarElement<K>['contextMenuConfig']>;
    type dataChanged<K extends string | number = string | number> = JetElementCustomEventStrict<CTabBarElement<K>['data']>;
    type displayChanged<K extends string | number = string | number> = JetElementCustomEventStrict<CTabBarElement<K>['display']>;
    type edgeChanged<K extends string | number = string | number> = JetElementCustomEventStrict<CTabBarElement<K>['edge']>;
    type layoutChanged<K extends string | number = string | number> = JetElementCustomEventStrict<CTabBarElement<K>['layout']>;
    type overflowChanged<K extends string | number = string | number> = JetElementCustomEventStrict<CTabBarElement<K>['overflow']>;
    type reorderableChanged<K extends string | number = string | number> = JetElementCustomEventStrict<CTabBarElement<K>['reorderable']>;
    type selectionChanged<K extends string | number = string | number> = JetElementCustomEventStrict<CTabBarElement<K>['selection']>;
    type truncationChanged<K extends string | number = string | number> = JetElementCustomEventStrict<CTabBarElement<K>['truncation']>;
}
export interface CTabBarElementEventMap<K extends string | number = string | number> extends HTMLElementEventMap {
    'ojBeforeSelect': CTabBarElement.ojBeforeSelect<K>;
    'ojRemove': CTabBarElement.ojRemove<K>;
    'ojReorder': CTabBarElement.ojReorder<K>;
    'ojSelectionAction': CTabBarElement.ojSelectionAction<K>;
    'contextMenuConfigChanged': JetElementCustomEventStrict<CTabBarElement<K>['contextMenuConfig']>;
    'dataChanged': JetElementCustomEventStrict<CTabBarElement<K>['data']>;
    'displayChanged': JetElementCustomEventStrict<CTabBarElement<K>['display']>;
    'edgeChanged': JetElementCustomEventStrict<CTabBarElement<K>['edge']>;
    'layoutChanged': JetElementCustomEventStrict<CTabBarElement<K>['layout']>;
    'overflowChanged': JetElementCustomEventStrict<CTabBarElement<K>['overflow']>;
    'reorderableChanged': JetElementCustomEventStrict<CTabBarElement<K>['reorderable']>;
    'selectionChanged': JetElementCustomEventStrict<CTabBarElement<K>['selection']>;
    'truncationChanged': JetElementCustomEventStrict<CTabBarElement<K>['truncation']>;
}
export interface CTabBarElementSettableProperties<K extends string | number> extends JetSettableProperties {
    /**
     * Specifies a context menu configuration.
     * It takes the keys `accessibleLabel` and `items`,
     * where `accessibleLabel` is optional and items required . `items` function returns an array
     * of menu item object representations that indicates what menu items are going to be part of
     * menu based on some specific context menu context.
     * <table>
     * <tr><th align='left'>Context Menu Item Type</th><th align='left'>Def</th></tr>
     * <tr><td>ContextMenuSeparator</td><td>{ type: 'separator'}</td></tr>
     * <tr><td>MenuItem</td><td>{
     * type?: 'item';
     * label: string;
     * key: string;
     * disabled?: boolean;
     * onAction?: () => void;
     * startIcon?: MenuIcon;
     * endIcon?: MenuIcon;
     * variant?: 'standard' | 'destructive';
     * };</td></tr>
     * <tr><td>ContextMenuSubMenu</td><td>{
     * type: 'submenu';
     * label?: string;
     * disabled?: boolean;
     * startIcon?: string;
     * items?: Array&lt;ContextMenuItems&gt;;
     * };</td></tr>
     * <tr><td>ContextMenuSelectSingle</td><td>{
     * type: 'selectsingle';
     * key?: string;
     * items?: Array&lt;MenuSelectItem&gt;;
     * selection?: string;
     * onSelection?: (detail: { value: string }) => void;
     * };</td></tr>
     * <tr><td>ContextMenuSelectMultiple</td><td>{
     * type: 'selectmultiple';
     * key?: string;
     * items?: Array&lt;MenuSelectItem&gt;;
     * selection?: Array&lt;string&gt;;
     * onSelection?: (detail: { value: Array&lt;string&gt; }) => void;
     * };</td></tr>
     * <tr><td>MenuIcon</td><td>{
     * type?: 'class';
     *     class: string;
     *   }
     * | {
     *     type: 'img';
     *    src: string;
     *   };</td></tr>
     * <tr><td>MenuSelectItem</td><td>{
     * label: string;
     * disabled?: boolean;
     * endIcon?: MenuIcon;
     * value: string;
     * }</td></tr>
     * </table>
     */
    contextMenuConfig?: Props<K>['contextMenuConfig'];
    /**
     * Specifies the data definitions for the tabs.
     */
    data?: Props<K>['data'];
    /**
     * Whether to display both the label and icons ("standard") or just the icons ("icons") or to render stacked display ("stacked").
     * In the latter case, the label is displayed in a tooltip instead.
     */
    display?: Props<K>['display'];
    /**
     * The position of the TabBar.
     */
    edge?: Props<K>['edge'];
    /**
     * Whether to stretch the tab bar items to occupy available space or to condense items
     */
    layout?: Props<K>['layout'];
    /**
     * Specifies the overflow behavior
     */
    overflow?: Props<K>['overflow'];
    /**
     * Specifies if the tabs can be reordered within the tab bar.
     * Note: Do not use with <code class="prettyprint"> overflow="popup"</code> as reorder is not supported with
     * popup.
     */
    reorderable?: Props<K>['reorderable'];
    /**
     * The key of the currently selected tab.
     */
    selection?: Props<K>['selection'];
    /**
     * Truncation applies to the tab labels when there is not enough room to display all tabs.
     */
    truncation?: Props<K>['truncation'];
}
export interface CTabBarElementSettablePropertiesLenient<K extends string | number> extends Partial<CTabBarElementSettableProperties<K>> {
    [key: string]: any;
}
export interface TabBarIntrinsicProps extends Partial<Readonly<CTabBarElementSettableProperties<any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    /**
     * Triggered before user selects a tab which includes user gestures or selection is changed programmatically.
     */
    onojBeforeSelect?: (value: CTabBarElementEventMap<any>['ojBeforeSelect']) => void;
    /**
     * Triggered when user performs a remove gesture on a tab. The remove gestures include:
     * <ul>
     *   <li>User clicks the remove icon in a tab</li>
     *   <li>User presses Delete key on a tab</li>
     * </ul>
     */
    onojRemove?: (value: CTabBarElementEventMap<any>['ojRemove']) => void;
    /**
     * Triggered when user performs a reorder gesture on a tab. The reorder gestures include:
     * <ul>
     *   <li>User drags a tab and drops it in a new drop location</li>
     *   <li>User presses Command + Shift + Arrow key(s) on a tab</li>
     * </ul>
     * Note: Do not use with <code class="prettyprint"> overflow="popup"</code> as reorder is not supported with
     * popup.
     */
    onojReorder?: (value: CTabBarElementEventMap<any>['ojReorder']) => void;
    /**
     * Triggered when user performs a selection action gesture on a tab. The action gestures include:
     * <ul>
     *   <li>User clicks anywhere in a tab</li>
     *   <li>User taps anywhere in a tab</li>
     *   <li>User pressed spacebar or enter key on a tab</li>
     * </ul>
     */
    onojSelectionAction?: (value: CTabBarElementEventMap<any>['ojSelectionAction']) => void;
    oncontextMenuConfigChanged?: (value: CTabBarElementEventMap<any>['contextMenuConfigChanged']) => void;
    ondataChanged?: (value: CTabBarElementEventMap<any>['dataChanged']) => void;
    ondisplayChanged?: (value: CTabBarElementEventMap<any>['displayChanged']) => void;
    onedgeChanged?: (value: CTabBarElementEventMap<any>['edgeChanged']) => void;
    onlayoutChanged?: (value: CTabBarElementEventMap<any>['layoutChanged']) => void;
    onoverflowChanged?: (value: CTabBarElementEventMap<any>['overflowChanged']) => void;
    onreorderableChanged?: (value: CTabBarElementEventMap<any>['reorderableChanged']) => void;
    onselectionChanged?: (value: CTabBarElementEventMap<any>['selectionChanged']) => void;
    ontruncationChanged?: (value: CTabBarElementEventMap<any>['truncationChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-tab-bar': TabBarIntrinsicProps;
        }
    }
}
