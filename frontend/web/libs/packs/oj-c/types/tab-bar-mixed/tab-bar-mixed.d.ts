import { DataTabBarMixed } from './DataTabBarMixed';
import type { Action, CancelableAction, ExtendGlobalProps, ObservedGlobalProps, PropertyChanged } from 'ojs/ojvcomponent';
import type { ComponentProps, ComponentChildren } from 'preact';
import type { TabData } from './DataTabBarMixed.types';
import type { TabIconData } from './DataTabBarMixedIcon';
type DataTabBarMixedProps<K extends string | number = string | number> = ComponentProps<typeof DataTabBarMixed<K>>;
export type KeyDetail<K extends string | number> = {
    key: K;
};
export type SelectionActionDetail<K extends string | number> = {
    previousValue: K;
    value: K;
};
/** @deprecated since 19.0.0 - use 'CTabBarMixedElement.&lt;K&gt;[&apos;staticTabs&apos;]' or 'CTabBarMixedElement.&lt;K&gt;[&apos;dynamicTabs&apos;] instead */
export type TabDataDeprecated<K extends string | number> = TabData<K>;
/** @deprecated since 19.0.0 - use 'CTabBarMixedElement.&lt;K&gt;[&apos;staticTabs&apos;][&apos;icon&apos;]' instead */
export type TabIconDataDeprecated = TabIconData;
/** @deprecated since 19.0.0 - use 'CTabBarMixedElement.&lt;event-name&gt;[&apos;detail&apos;]' instead */
export type KeyDetailDeprecated<K extends string | number> = KeyDetail<K>;
/** @deprecated since 19.0.0 - use 'CTabBarMixedElement.&lt;event-name&gt;[&apos;detail&apos;]' instead */
export type SelectionActionDetailDeprecated<K extends string | number> = SelectionActionDetail<K>;
export type Props<K extends string | number> = ObservedGlobalProps<'aria-label' | 'id' | 'aria-labelledby'> & {
    /**
     * @description
     * Specifies the data definitions for the dynamics tabs (the collection of tabs that are removable).
     *
     * @ojmetadata description "An array of dynamic tabs"
     * @ojmetadata displayName "Dynamic Tabs"
     */
    dynamicTabs?: DataTabBarMixedProps<K>['dynamicTabs'];
    /**
     * @description
     * Specifies whether the dynamic tabs are displayed inside a conveyor belt or a popup.
     *
     * @ojmetadata description "Dynamic tabs overflow configurations"
     * @ojmetadata displayName "Dynamic Tabs Overflow"
     * @ojmetadata propertyEditorValues {
     *     "conveyor": {
     *       "description": "Dynamic tabs are displayed inside a conveyor belt.",
     *       "displayName": "Conveyor"
     *     },
     *     "popup": {
     *       "description": "Dynamic tabs are displayed inside a popup.",
     *       "displayName": "Popup"
     *     }
     *   }
     */
    dynamicTabsOverflow?: DataTabBarMixedProps['dynamicTabsOverflow'];
    /**
     * @description
     * Specifies the icon used on the overflow tab when dynamicTabsOverflow is set to 'popup'.
     *
     * @ojmetadata description "The icon used on the overflow tab"
     * @ojmetadata displayName "Icon for overflow tab"
     */
    dynamicTabsOverflowIcon?: DataTabBarMixedProps['dynamicTabsOverflowIcon'];
    /**
     * @description
     * Specifies the size of the TabBarMixed.
     *
     * @ojmetadata description "Size of TabBarMixed"
     * @ojmetadata displayName "Size"
     * @ojmetadata propertyEditorValues {
     *     "md": {
     *       "description": "TabBarMixed is set with a medium height.",
     *       "displayName": "Medium"
     *     },
     *     "lg": {
     *       "description": "TabBarMixed is set with a large height.",
     *       "displayName": "Large"
     *     }
     *   }
     */
    size?: 'md' | 'lg';
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
     * The padding around the vertical divider that seperates collections of tabs.
     *
     * @ojmetadata description "The padding around the vertical divider that seperates collections of tabs."
     * @ojmetadata displayName "Divider Padding"
     */
    separatorPadding?: string;
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
     * Triggered when user performs a remove gesture on a tab.  The remove gestures include:
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
     * Triggered when user performs a selection action gesture on a tab.  The action gestures include:
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
     * Specifies the data definitions for the static tabs (the collection of tabs that are non-removable).
     *
     * @ojmetadata description "An array of static tabs"
     * @ojmetadata displayName "Static Tabs"
     */
    staticTabs?: DataTabBarMixedProps<K>['staticTabs'];
    /**
     * @description
     * Whether to display both the label and icons ("standard") or just the icons ("icons").
     * In the latter case, the label is displayed in a tooltip instead.
     *
     * @ojmetadata description "The display configuration for static tabs."
     * @ojmetadata displayName "Static Tabs Display"
     * @ojmetadata propertyEditorValues {
     *     "standard": {
     *       "description": "Label and icon are shown for all static tabs.",
     *       "displayName": "Standard"
     *     },
     *     "icons": {
     *       "description": "Only icons are shown for all static tabs.",
     *       "displayName": "Icons"
     *     }
     *   }
     */
    staticTabsDisplay?: DataTabBarMixedProps['staticTabsDisplay'];
};
/**
 * This export corresponds to the TabBarMixed Preact component. For the oj-c-tab-bar-mixed custom element, import CTabBarMixedElement instead.
 */
export declare const TabBarMixed: <K extends string | number = string | number>(props: ExtendGlobalProps<Props<K>>) => ComponentChildren;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-tab-bar-mixed custom element. For the TabBarMixed Preact component, import TabBarMixed instead.
 */
export interface CTabBarMixedElement<K extends string | number = string | number> extends JetElement<CTabBarMixedElementSettableProperties<K>>, CTabBarMixedElementSettableProperties<K> {
    addEventListener<T extends keyof CTabBarMixedElementEventMap<K>>(type: T, listener: (this: HTMLElement, ev: CTabBarMixedElementEventMap<K>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CTabBarMixedElementSettableProperties<K>>(property: T): CTabBarMixedElement<K>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CTabBarMixedElementSettableProperties<K>>(property: T, value: CTabBarMixedElementSettableProperties<K>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CTabBarMixedElementSettableProperties<K>>): void;
    setProperties(properties: CTabBarMixedElementSettablePropertiesLenient<K>): void;
}
export namespace CTabBarMixedElement {
    interface ojBeforeSelect<K extends string | number = string | number> extends CustomEvent<KeyDetail<K> & {
        accept: (param: Promise<void>) => void;
    }> {
    }
    interface ojRemove<K extends string | number = string | number> extends CustomEvent<KeyDetail<K> & {}> {
    }
    interface ojSelectionAction<K extends string | number = string | number> extends CustomEvent<SelectionActionDetail<K> & {}> {
    }
    type dynamicTabsChanged<K extends string | number = string | number> = JetElementCustomEventStrict<CTabBarMixedElement<K>['dynamicTabs']>;
    type dynamicTabsOverflowChanged<K extends string | number = string | number> = JetElementCustomEventStrict<CTabBarMixedElement<K>['dynamicTabsOverflow']>;
    type dynamicTabsOverflowIconChanged<K extends string | number = string | number> = JetElementCustomEventStrict<CTabBarMixedElement<K>['dynamicTabsOverflowIcon']>;
    type selectionChanged<K extends string | number = string | number> = JetElementCustomEventStrict<CTabBarMixedElement<K>['selection']>;
    type separatorPaddingChanged<K extends string | number = string | number> = JetElementCustomEventStrict<CTabBarMixedElement<K>['separatorPadding']>;
    type sizeChanged<K extends string | number = string | number> = JetElementCustomEventStrict<CTabBarMixedElement<K>['size']>;
    type staticTabsChanged<K extends string | number = string | number> = JetElementCustomEventStrict<CTabBarMixedElement<K>['staticTabs']>;
    type staticTabsDisplayChanged<K extends string | number = string | number> = JetElementCustomEventStrict<CTabBarMixedElement<K>['staticTabsDisplay']>;
}
export interface CTabBarMixedElementEventMap<K extends string | number = string | number> extends HTMLElementEventMap {
    'ojBeforeSelect': CTabBarMixedElement.ojBeforeSelect<K>;
    'ojRemove': CTabBarMixedElement.ojRemove<K>;
    'ojSelectionAction': CTabBarMixedElement.ojSelectionAction<K>;
    'dynamicTabsChanged': JetElementCustomEventStrict<CTabBarMixedElement<K>['dynamicTabs']>;
    'dynamicTabsOverflowChanged': JetElementCustomEventStrict<CTabBarMixedElement<K>['dynamicTabsOverflow']>;
    'dynamicTabsOverflowIconChanged': JetElementCustomEventStrict<CTabBarMixedElement<K>['dynamicTabsOverflowIcon']>;
    'selectionChanged': JetElementCustomEventStrict<CTabBarMixedElement<K>['selection']>;
    'separatorPaddingChanged': JetElementCustomEventStrict<CTabBarMixedElement<K>['separatorPadding']>;
    'sizeChanged': JetElementCustomEventStrict<CTabBarMixedElement<K>['size']>;
    'staticTabsChanged': JetElementCustomEventStrict<CTabBarMixedElement<K>['staticTabs']>;
    'staticTabsDisplayChanged': JetElementCustomEventStrict<CTabBarMixedElement<K>['staticTabsDisplay']>;
}
export interface CTabBarMixedElementSettableProperties<K extends string | number> extends JetSettableProperties {
    /**
     * Specifies the data definitions for the dynamics tabs (the collection of tabs that are removable).
     */
    dynamicTabs?: Props<K>['dynamicTabs'];
    /**
     * Specifies whether the dynamic tabs are displayed inside a conveyor belt or a popup.
     */
    dynamicTabsOverflow?: Props<K>['dynamicTabsOverflow'];
    /**
     * Specifies the icon used on the overflow tab when dynamicTabsOverflow is set to 'popup'.
     */
    dynamicTabsOverflowIcon?: Props<K>['dynamicTabsOverflowIcon'];
    /**
     * The key of the currently selected tab.
     */
    selection?: Props<K>['selection'];
    /**
     * The padding around the vertical divider that seperates collections of tabs.
     */
    separatorPadding?: Props<K>['separatorPadding'];
    /**
     * Specifies the size of the TabBarMixed.
     */
    size?: Props<K>['size'];
    /**
     * Specifies the data definitions for the static tabs (the collection of tabs that are non-removable).
     */
    staticTabs?: Props<K>['staticTabs'];
    /**
     * Whether to display both the label and icons ("standard") or just the icons ("icons").
     * In the latter case, the label is displayed in a tooltip instead.
     */
    staticTabsDisplay?: Props<K>['staticTabsDisplay'];
}
export interface CTabBarMixedElementSettablePropertiesLenient<K extends string | number> extends Partial<CTabBarMixedElementSettableProperties<K>> {
    [key: string]: any;
}
export interface TabBarMixedIntrinsicProps extends Partial<Readonly<CTabBarMixedElementSettableProperties<any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    /**
     * Triggered before user selects a tab which includes user gestures or selection is changed programmatically.
     */
    onojBeforeSelect?: (value: CTabBarMixedElementEventMap<any>['ojBeforeSelect']) => void;
    /**
     * Triggered when user performs a remove gesture on a tab.  The remove gestures include:
     * <ul>
     *   <li>User clicks the remove icon in a tab</li>
     *   <li>User presses Delete key on a tab</li>
     * </ul>
     */
    onojRemove?: (value: CTabBarMixedElementEventMap<any>['ojRemove']) => void;
    /**
     * Triggered when user performs a selection action gesture on a tab.  The action gestures include:
     * <ul>
     *   <li>User clicks anywhere in a tab</li>
     *   <li>User taps anywhere in a tab</li>
     *   <li>User pressed spacebar or enter key on a tab</li>
     * </ul>
     */
    onojSelectionAction?: (value: CTabBarMixedElementEventMap<any>['ojSelectionAction']) => void;
    ondynamicTabsChanged?: (value: CTabBarMixedElementEventMap<any>['dynamicTabsChanged']) => void;
    ondynamicTabsOverflowChanged?: (value: CTabBarMixedElementEventMap<any>['dynamicTabsOverflowChanged']) => void;
    ondynamicTabsOverflowIconChanged?: (value: CTabBarMixedElementEventMap<any>['dynamicTabsOverflowIconChanged']) => void;
    onselectionChanged?: (value: CTabBarMixedElementEventMap<any>['selectionChanged']) => void;
    onseparatorPaddingChanged?: (value: CTabBarMixedElementEventMap<any>['separatorPaddingChanged']) => void;
    onsizeChanged?: (value: CTabBarMixedElementEventMap<any>['sizeChanged']) => void;
    onstaticTabsChanged?: (value: CTabBarMixedElementEventMap<any>['staticTabsChanged']) => void;
    onstaticTabsDisplayChanged?: (value: CTabBarMixedElementEventMap<any>['staticTabsDisplayChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-tab-bar-mixed': TabBarMixedIntrinsicProps;
        }
    }
}
