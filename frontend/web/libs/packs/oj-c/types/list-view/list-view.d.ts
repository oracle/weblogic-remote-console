import { DataProvider, Item } from 'ojs/ojdataprovider';
import { ImmutableKeySet } from 'ojs/ojkeyset';
import { Action, Bubbles, ExtendGlobalProps, ObservedGlobalProps, PropertyChanged, ReadOnlyPropertyChanged, TemplateSlot } from 'ojs/ojvcomponent';
import { ComponentProps, ComponentChildren, Ref } from 'preact';
import { ListView as PreactListView, ItemPadding, SkeletonRendererContext } from '@oracle/oraclejet-preact/UNSAFE_ListView';
import 'css!oj-c/list-view/list-view-styles.css';
import { ContextMenuItems } from '../utils/PRIVATE_ItemsMenu/items-menu';
type PreactListViewProps = ComponentProps<typeof PreactListView>;
export type ContextMenuConfig<K, D> = {
    accessibleLabel?: string;
    items: (context: ListItemContextProps<K, D>) => Array<ContextMenuItems>;
};
type ListItemContextProps<K, D> = Omit<ListItemContext<K, D>, 'isTabbable'>;
type ListViewContextMenuSelectionDetail<K, D> = {
    value: string | Array<string>;
    menuSelectionGroupKey: string;
    contextMenuContext: ListItemContextProps<K, D>;
};
type ListViewContextMenuActionDetail<K, D> = {
    menuItemKey: string;
    contextMenuContext: ListItemContextProps<K, D>;
};
/** @deprecated since 19.0.0 - use 'CListViewElement.&lt;event-name&gt;[&apos;detail&apos;]' instead */
export type ListViewContextMenuSelectionDetailDeprecated<K, D> = ListViewContextMenuSelectionDetail<K, D>;
/** @deprecated since 19.0.0 - use 'CListViewElement.&lt;event-name&gt;[&apos;detail&apos;]' instead */
export type ListViewContextMenuActionDetailDeprecated<K, D> = ListViewContextMenuActionDetail<K, D>;
export type ListItemContext<K, D> = {
    /**
     * The data of the item.  Note this is made available primarily to ease migration.
     * Applications should get the data from the item property instead.
     */
    data: D;
    /**
     * Contains the data and metadata of the item.
     */
    item: Item<K, D>;
    /**
     * A boolean indicating whether the item is in tabbable mode or not.
     * Template elements should not be tab-stops when the item is not in tabbable mode, this context can be used to implement
     * conditional behavior for all tabbable child elements.
     */
    isTabbable: boolean;
};
export type ItemActionDetail<K, D> = {
    context: ListItemContextProps<K, D>;
};
export type FirstSelectedItemDetail<K, D> = {
    key: K;
    data: D;
};
export type ReorderDetail<K> = {
    /**
     * An array of keys matching the new order of items
     */
    reorderedKeys: Array<K>;
    /**
     * An array of keys of the items that are moved
     */
    itemKeys: Array<K>;
    /**
     * The key of the item where the moved items will be dropped after. If the moved items were dropped at the very beginning, the referenceKey will be null.
     */
    referenceKey: K | null;
};
type SelectionMode = PreactListViewProps['selectionMode'] | 'singleRequired' | 'multipleToggle';
export type SkeletonTemplateContext = SkeletonRendererContext;
type ListViewHandle = {
    /**
     * @ojmetadata description "Place focus on the list."
     * @ignore
     */
    focus: () => void;
};
type Props<K extends string | number, D> = ObservedGlobalProps<'aria-label' | 'aria-labelledby' | 'aria-describedby' | 'id'> & {
    /**
     * @description
     * The key of the item that currently has keyboard focus
     *
     * @ojmetadata description "The key of the item that currently has keyboard focus"
     * @ojmetadata displayName "Current Item"
     * @ojmetadata help "#currentItem"
     */
    onCurrentItemChanged?: ReadOnlyPropertyChanged<K>;
    /**
     * @description
     * The key of the item that will have keyboard focus
     *
     * @ojmetadata description "The key of the item that will have keyboard focus"
     * @ojmetadata displayName "Current Item Override"
     * @ojmetadata help "#currentItemOverride"
     */
    currentItemOverride?: {
        rowKey: K;
    };
    /**
     * @description
     * The data source for ListView. Must be of type DataProvider.
     *
     * @ojmetadata description "The data source for ListView."
     * @ojmetadata displayName "Data"
     * @ojmetadata help "#data"
     * @ojmetadata extension {
     *   "webelement": {
     *     "exceptionStatus": [
     *       {"type": "unsupported"}
     *     ]
     *   }
     * }
     */
    data?: DataProvider<K, D> | null;
    /**
     * @description
     * Specifies whether the horizontal grid lines should be visible.  By default gridlines
     * are hidden.
     *
     * It takes the keys `item`, `top` and `bottom`,
     * each of which are optional and take a value of "hidden" or "visible". `item`
     * toggles the presence of bottom gridlines except the last item,
     * and `top` and `bottom` toggle the initial and trailing gridlines.
     * By default all gridlines are hidden.
     *
     * @ojmetadata description "Specifies whether the grid lines should be visible."
     * @ojmetadata displayName "Gridlines"
     * @ojmetadata help "#gridlines"
     */
    gridlines?: PreactListViewProps['gridlines'];
    /**
     * @description
     * <p>The <code class="prettyprint">itemTemplate</code> slot is used to specify the template for rendering each item in the List. The slot content must be a &lt;template> element.
     * <p>When the template is executed for each item, it will have access to the binding context containing the following properties:</p>
     * <ul>
     *   <li>$current - an object that contains information for the current item.</li>
     * </ul>
     *
     * @ojmetadata description "The itemTemplate slot is used to specify the template for rendering each item in the component. See the Help documentation for more information."
     * @ojmetadata displayName "itemTemplate"
     * @ojmetadata help "#itemTemplate"
     * @ojmetadata maxItems 1
     */
    itemTemplate?: TemplateSlot<ListItemContext<K, D>>;
    /**
     * @description
     * <p>The <code class="prettyprint">noData</code> slot is used to specify the content to display when the list is empty. The slot content
     * must be a &lt;template&gt; element. If not specified then a default no data message will be displayed.
     * @ojmetadata description "The noData slot is used to specify the content to show when there is no data. See the Help documentation for more information."
     * @ojmetadata displayName "noData"
     * @ojmetadata help "#noData"
     * @ojmetadata maxItems 1
     * @ojmetadata templateSlotAlias "noDataTemplate"
     */
    noData?: TemplateSlot<any>;
    /**
     * @description
     * scrollPolicy options.
     * <p>
     * The following options are supported:
     * <ul>
     *   <li>fetchSize: The number of items fetched each time when scroll to the end.</li>
     *   <li>scroller: The css selector that locates the element in which listview uses to determine the scroll position as well as the maximum scroll position where scroll to the end will trigger a fetch.  If not specified then the root element of listview is used.</li>
     * </ul>
     * By default, the next block of rows is fetched when the user scrolls to the end of the list/scroller. The fetchSize option determines how many rows are fetched in each block.
     * @ojmetadata description "Specifies fetch options for scrolling behaviors that trigger data fetches."
     * @ojmetadata displayName "Scroll Policy Options"
     * @ojmetadata help "#scrollPolicyOptions"
     */
    scrollPolicyOptions?: {
        fetchSize?: number;
        scroller?: string;
    };
    /**
     * @description
     * The current selected items in the ListView. An empty KeySet indicates nothing is selected.
     * Note that property change event for the deprecated selection property will still be fire when
     * selected property has changed. In addition, <a href="AllKeySetImpl.html">AllKeySetImpl</a> set
     * can be used to represent select all state. In this case, the value for selection would have an
     * 'inverted' property set to true, and would contain the keys of the items that are not selected.
     *
     * @ojmetadata description "The selected property"
     * @ojmetadata displayName "Selected Items Changed"
     * @ojmetadata help "#selected"
     */
    selected?: ImmutableKeySet<K>;
    /**
     * @ojmetadata description "Writeback support for the selected property"
     * @ojmetadata displayName "Selected Items Changed"
     * @ojmetadata help "#selected"
     */
    onSelectedChanged?: PropertyChanged<ImmutableKeySet<K>>;
    /**
     * @description
     * <p>The type of selection behavior that is enabled on the ListView. This attribute controls the number of selections that can be made via selection gestures at any given time.
     *
     * <p>If the specified value is not <code class="prettyprint">none</code>, selection gestures will be enabled, and the ListView's selection styling will be applied to all items specified by the <a href="#selected">selected</a> attribute.
     * If <code class="prettyprint">singleRequired</code> is specified, then the behavior is the same as single except that ListView will ensure there is an item selected at all times. Specifically, the user will not be able to de-selected a selected item.  And if selection is initially empty, ListView will select the first item.
     * If <code class="prettyprint">none</code> is specified, selection gestures will be disabled, and the ListView's selection styling will not be applied to any items specified by the <a href="#selected">selected</a> attribute.
     * <p>Changing the value of this attribute will not affect the value of the <a href="#selected">selected</a> attribute.
     *
     * @ojmetadata description "Type of selection behavior for the ListView"
     * @ojmetadata displayName "Selection Mode"
     * @ojmetadata help "#selectionMode"
     * @ojmetadata propertyEditorValues {
     *   "none": {
     *     "description": "Selection is disabled.",
     *     "displayName": "None"
     *   },
     *   "single": {
     *     "description": "Only a single item can be selected at a time.",
     *     "displayName": "Single"
     *   },
     *  "singleRequired": {
     *     "description": "Only a single item can be selected at a time. In addition, ListView will also ensure that an item is selected at all time.",
     *     "displayName": "Single Required"
     *   },
     *  "multiple": {
     *     "description": "Multiple items can be selected at the same time with the 'replace' selection behavior. For example, clicking on an already selected item will not affect that item's selection, and clicking on a non-selected item will select that item and deselect any other previously selected items. In order to perform additive selections, users can click on selector checkboxes, use spacebar, or ctrl/cmd click on individual items to perform 'toggle' selection gestures.",
     *     "displayName": "Multiple"
     *   },
     *  "multipleToggle": {
     *     "description": "Multiple items can be selected at the same time with the 'toggle' selection behavior. For example, clicking on an already selected item will deselect that item, and clicking on any non-selected item will select that item without affecting any previously selected items.",
     *     "displayName": "MultipleToggle"
     *   },
     * }
     */
    selectionMode?: SelectionMode;
    /**
     * @description
     * Triggered when user performs an action gesture on an item while ListView is in navigation mode.  The action gestures include:
     * <ul>
     *   <li>User clicks anywhere in an item</li>
     *   <li>User taps anywhere in an item</li>
     *   <li>User pressed enter key while item has focus</li>
     * </ul>
     *
     * @ojmetadata description "Triggered when user performs an action gesture on an item."
     * @ojmetadata displayName "Item Action"
     * @ojmetadata help "#event:itemAction"
     */
    onOjItemAction?: Action<ItemActionDetail<K, D>>;
    /**
     * @description
     * Triggered when data for the first selected item is available.  This can occurred when:
     * <ul>
     *   <li>ListView is initialized with a selection or first item is selected due to singleRequired selection mode.</li>
     *   <li>Selection has changed.</li>
     *   <li>Data for the first selected item is updated.</li>
     * </ul>
     * Note this event will only be enabled if selection-mode is set to <code class="prettyprint">singleRequired</code>.
     *
     * @ojmetadata description "Triggered when data for the first selected item is available."
     * @ojmetadata displayName "First Selected Item"
     * @ojmetadata help "#event:firstSelectedItem"
     */
    onOjFirstSelectedItem?: Action<FirstSelectedItemDetail<K, D>>;
    /**
     * @description
     * Specifies a context menu configuration.
     * It takes the keys `accessibleLabel` and `items`,
     * where `accessibleLabel` is optional and items required . `items` function returns an array
     * of menu item object representations that indicates what menu items are going to be part of
     * menu based on some specific context menu context.
     * <table>
     * <tr><th>Context Menu Item Type</th><th>Def</th></tr>
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
    contextMenuConfig?: ContextMenuConfig<K, D>;
    /**
     * @ojmetadata description "Triggered when a menu item is clicked, whether by keyboard, mouse,
     *    or touch events."
     * @ojmetadata eventGroup "common"
     * @ojmetadata displayName "onOjContextMenuAction"
     * @ojmetadata help "#event:ojContextMenuAction"
     */
    onOjContextMenuAction?: Action<ListViewContextMenuActionDetail<K, D>> & Bubbles;
    /**
     * @ojmetadata description "Triggered when a select menu item is clicked, whether by keyboard, mouse,
     *    or touch events."
     * @ojmetadata eventGroup "common"
     * @ojmetadata displayName "onOjContextMenuSelection"
     * @ojmetadata help "#event:ojContextMenuSelection"
     */
    onOjContextMenuSelection?: Action<ListViewContextMenuSelectionDetail<K, D>> & Bubbles;
    /**
     * @description
     * The reorder option contains a subset of options for reordering items.
     *
     * <p>The following options are supported:</p>
     * <ul>
     *   <li>items: Enable or disable reordering the items within the same ListView using drag and drop or keyboard. Specify 'enabled' to enable reordering. Setting the value to <code class="prettyprint">"disabled"</code> or setting the <code class="prettyprint">"reorderable"</code> property
     *              to <code class="prettyprint">null</code> (or omitting it), disables reordering support.</li>
     * </ul>
     * @ojmetadata description "Specify the item reordering functionality."
     * @ojmetadata displayName "Reorderable"
     * @ojmetadata help "#reorderable"
     */
    reorderable?: {
        items?: 'enabled' | 'disabled';
    };
    /**
     * @description
     * Triggered after items are reordered within ListView via drag and drop or keyboard.
     *
     * @ojmetadata description "Triggered after items are reordered within ListView via drag and drop or keyboard."
     * @ojmetadata displayName "Reorder"
     * @ojmetadata help "#event:reorder"
     */
    onOjReorder?: Action<ReorderDetail<K>>;
    /**
     * @ojmetadata description "The item option contains a subset of options for items."
     * @ojmetadata displayName "Item"
     * @ojmetadata help "#item"
     */
    item?: {
        /**
         * @ojmetadata description "It controls the padding around the list item"
         * @ojmetadata displayName "item.padding"
         * @ojmetadata help "#item.padding"
         */
        padding?: 'disabled' | 'enabled' | ItemPadding;
        /**
         * @ojmetadata description "It controls the focus behavior when enter key is pressed on an item"
         * @ojmetadata displayName "item.enterKeyFocusBehavior"
         * @ojmetadata help "#item.enterKeyFocusBehavior"
         */
        enterKeyFocusBehavior?: 'none' | 'focusWithin';
    };
    /**
     * @description
     * <p>The <code class="prettyprint">skeletonTemplate</code> slot is used to specify the template for rendering each skeleton while waiting for data during initial load as well as load more on scroll. The slot content
     * must be a &lt;template&gt; element. If not specified then the default skeleton will display.
     * <p>When the template is executed for each skeleton, it will have access to the binding context containing the following properties:</p>
     * <ul>
     *   <li>$current - an object that contains information for the current skeleton.</li>
     * </ul>
     * <h5>Properties of $current:</h5>
     * <p></p>
     * <table class="keyboard-table">
     * <thead>
     * <tr><th>Name</th><th>Type</th><th>Description</th></tr>
     * </thead>
     * <tbody>
     * <tr><td>loadingStatus</td><td>'initial' | 'loadMore'</td><td>Whether the skeletons are rendered for initial load of data or for load more data in CardView</td></tr>
     * <tr><td>index</td><td>number</td><td>The index prop can be used to determine the order of different skeletons that to be place to create the whole list item skeleton.</td></tr>
     * </tbody>
     * </table>
     * <p></p>
     * <p>Example of skeletonTemplate slot usage.</p>
     * <pre class="prettyprint">
  * <code>
  * &lt;oj-c-list-view
  *    id="cardview"
              id="listview"
              class="demo-list-view"
              aria-label="listview with skeleton"
              data="[[dataProvider]]">
          &lt;template slot="skeletonTemplate" data-oj-as="context">
            &lt;div>
                      &lt;oj-bind-if test="[[context.loadingStatus === 'initial']]">
                      &lt;oj-bind-if test="[[context.index % 3 === 0]]">
                          &lt;oj-c-skeleton height="4x" width="4x">
                          &lt;/oj-c-skeleton>
                      &lt;/oj-bind-if>
                      &lt;oj-bind-if test="[[context.index % 3 === 1]]">
                       &lt;oj-c-skeleton height="4x" width="6x">
                          &lt;/oj-c-skeleton>
                      &lt;/oj-bind-if>
                      &lt;oj-bind-if test="[[context.index % 3 === 2]]">
                           &lt;oj-c-skeleton height="4x" width="8x">
                          &lt;/oj-c-skeleton>
                      &lt;/oj-bind-if>
                      &lt;/oj-bind-if>
                      &lt;oj-bind-if test="[[context.loadingStatus === 'loadMore']]">
                           &lt;oj-c-skeleton height="4x" width="8x">
                          &lt;/oj-c-skeleton>
                      &lt;/oj-bind-if>
                  &lt;/div>
              &lt;/template>
              &lt;template slot="itemTemplate" data-oj-as="item">
                &lt;oj-c-list-item-layout>
                  <&lt;pan class="oj-typography-body-md oj-text-color-primary">
                    &lt;oj-bind-text value="[[item.item.data.name]]"></oj-bind-text>
                  &lt;/span>
                  &lt;oj-c-avatar slot="leading" size="xs" src="[[item.item.data.image]]"></oj-c-avatar>
                  &lt;span slot="secondary" class="oj-typography-body-sm oj-text-color-secondary">
                    &lt;oj-bind-text value="[[item.item.data.title]]"></oj-bind-text>
                  &lt;/span>
                &lt;/oj-c-list-item-layout>
              &lt;/template>
   * &lt;/oj-c-list-view>
   * </code></pre>
   *
     * @ojmetadata description "The skeletonTemplate slot is used to specify the template for rendering each skeleton while waiting for data during initial load as well as load more on scroll. See the Help documentation for more information."
     * @ojmetadata displayName "skeletonTemplate"
     * @ojmetadata help "#skeletonTemplate"
     * @ojmetadata maxItems 1
     */
    skeletonTemplate?: TemplateSlot<SkeletonTemplateContext>;
};
/**
 * This export corresponds to the ListView Preact component. For the oj-c-list-view custom element, import CListViewElement instead.
 */
export declare const ListView: <K extends string | number = string | number, D = any>(props: ExtendGlobalProps<Props<K, D>> & {
    ref?: Ref<ListViewHandle>;
}) => ComponentChildren;
export type ListViewProps<K extends string | number, D> = Props<K, D>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-list-view custom element. For the ListView Preact component, import ListView instead.
 */
export interface CListViewElement<K extends string | number, D> extends JetElement<CListViewElementSettableProperties<K, D>>, CListViewElementSettableProperties<K, D> {
    /**
     * The key of the item that currently has keyboard focus
     */
    readonly currentItem?: Parameters<Required<Props<K, D>>['onCurrentItemChanged']>[0];
    addEventListener<T extends keyof CListViewElementEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: CListViewElementEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CListViewElementSettableProperties<K, D>>(property: T): CListViewElement<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CListViewElementSettableProperties<K, D>>(property: T, value: CListViewElementSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CListViewElementSettableProperties<K, D>>): void;
    setProperties(properties: CListViewElementSettablePropertiesLenient<K, D>): void;
    focus: () => void;
}
declare namespace _CListViewElementTypes {
    type _SkeletonTemplateContext = SkeletonTemplateContext;
}
export namespace CListViewElement {
    interface ojItemAction<K extends string | number, D> extends CustomEvent<ItemActionDetail<K, D> & {}> {
    }
    interface ojFirstSelectedItem<K extends string | number, D> extends CustomEvent<FirstSelectedItemDetail<K, D> & {}> {
    }
    interface ojContextMenuAction<K extends string | number, D> extends CustomEvent<ListViewContextMenuActionDetail<K, D> & {}> {
    }
    interface ojContextMenuSelection<K extends string | number, D> extends CustomEvent<ListViewContextMenuSelectionDetail<K, D> & {}> {
    }
    interface ojReorder<K extends string | number> extends CustomEvent<ReorderDetail<K> & {}> {
    }
    type contextMenuConfigChanged<K extends string | number, D> = JetElementCustomEventStrict<CListViewElement<K, D>['contextMenuConfig']>;
    type currentItemChanged<K extends string | number, D> = JetElementCustomEventStrict<CListViewElement<K, D>['currentItem']>;
    type currentItemOverrideChanged<K extends string | number, D> = JetElementCustomEventStrict<CListViewElement<K, D>['currentItemOverride']>;
    type dataChanged<K extends string | number, D> = JetElementCustomEventStrict<CListViewElement<K, D>['data']>;
    type gridlinesChanged<K extends string | number, D> = JetElementCustomEventStrict<CListViewElement<K, D>['gridlines']>;
    type itemChanged<K extends string | number, D> = JetElementCustomEventStrict<CListViewElement<K, D>['item']>;
    type reorderableChanged<K extends string | number, D> = JetElementCustomEventStrict<CListViewElement<K, D>['reorderable']>;
    type scrollPolicyOptionsChanged<K extends string | number, D> = JetElementCustomEventStrict<CListViewElement<K, D>['scrollPolicyOptions']>;
    type selectedChanged<K extends string | number, D> = JetElementCustomEventStrict<CListViewElement<K, D>['selected']>;
    type selectionModeChanged<K extends string | number, D> = JetElementCustomEventStrict<CListViewElement<K, D>['selectionMode']>;
    type ItemTemplateContext<K extends string | number, D> = ListItemContext<K, D>;
    type RenderItemTemplate<K extends string | number, D> = import('ojs/ojvcomponent').TemplateSlot<ListItemContext<K, D>>;
    type RenderNoDataTemplate = import('ojs/ojvcomponent').TemplateSlot<{}>;
    type SkeletonTemplateContext = _CListViewElementTypes._SkeletonTemplateContext;
    type RenderSkeletonTemplate = import('ojs/ojvcomponent').TemplateSlot<SkeletonTemplateContext>;
}
export interface CListViewElementEventMap<K extends string | number, D> extends HTMLElementEventMap {
    'ojItemAction': CListViewElement.ojItemAction<K, D>;
    'ojFirstSelectedItem': CListViewElement.ojFirstSelectedItem<K, D>;
    'ojContextMenuAction': CListViewElement.ojContextMenuAction<K, D>;
    'ojContextMenuSelection': CListViewElement.ojContextMenuSelection<K, D>;
    'ojReorder': CListViewElement.ojReorder<K>;
    'contextMenuConfigChanged': JetElementCustomEventStrict<CListViewElement<K, D>['contextMenuConfig']>;
    'currentItemChanged': JetElementCustomEventStrict<CListViewElement<K, D>['currentItem']>;
    'currentItemOverrideChanged': JetElementCustomEventStrict<CListViewElement<K, D>['currentItemOverride']>;
    'dataChanged': JetElementCustomEventStrict<CListViewElement<K, D>['data']>;
    'gridlinesChanged': JetElementCustomEventStrict<CListViewElement<K, D>['gridlines']>;
    'itemChanged': JetElementCustomEventStrict<CListViewElement<K, D>['item']>;
    'reorderableChanged': JetElementCustomEventStrict<CListViewElement<K, D>['reorderable']>;
    'scrollPolicyOptionsChanged': JetElementCustomEventStrict<CListViewElement<K, D>['scrollPolicyOptions']>;
    'selectedChanged': JetElementCustomEventStrict<CListViewElement<K, D>['selected']>;
    'selectionModeChanged': JetElementCustomEventStrict<CListViewElement<K, D>['selectionMode']>;
}
export interface CListViewElementSettableProperties<K extends string | number, D> extends JetSettableProperties {
    /**
     * Specifies a context menu configuration.
     * It takes the keys `accessibleLabel` and `items`,
     * where `accessibleLabel` is optional and items required . `items` function returns an array
     * of menu item object representations that indicates what menu items are going to be part of
     * menu based on some specific context menu context.
     * <table>
     * <tr><th>Context Menu Item Type</th><th>Def</th></tr>
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
    contextMenuConfig?: Props<K, D>['contextMenuConfig'];
    /**
     * The key of the item that will have keyboard focus
     */
    currentItemOverride?: Props<K, D>['currentItemOverride'];
    /**
     * The data source for ListView. Must be of type DataProvider.
     */
    data?: Props<K, D>['data'];
    /**
     * Specifies whether the horizontal grid lines should be visible.  By default gridlines
     * are hidden.
     *
     * It takes the keys `item`, `top` and `bottom`,
     * each of which are optional and take a value of "hidden" or "visible". `item`
     * toggles the presence of bottom gridlines except the last item,
     * and `top` and `bottom` toggle the initial and trailing gridlines.
     * By default all gridlines are hidden.
     */
    gridlines?: Props<K, D>['gridlines'];
    item?: Props<K, D>['item'];
    /**
     * The reorder option contains a subset of options for reordering items.
     *
     * <p>The following options are supported:</p>
     * <ul>
     *   <li>items: Enable or disable reordering the items within the same ListView using drag and drop or keyboard. Specify 'enabled' to enable reordering. Setting the value to <code class="prettyprint">"disabled"</code> or setting the <code class="prettyprint">"reorderable"</code> property
     *              to <code class="prettyprint">null</code> (or omitting it), disables reordering support.</li>
     * </ul>
     */
    reorderable?: Props<K, D>['reorderable'];
    /**
     * scrollPolicy options.
     * <p>
     * The following options are supported:
     * <ul>
     *   <li>fetchSize: The number of items fetched each time when scroll to the end.</li>
     *   <li>scroller: The css selector that locates the element in which listview uses to determine the scroll position as well as the maximum scroll position where scroll to the end will trigger a fetch.  If not specified then the root element of listview is used.</li>
     * </ul>
     * By default, the next block of rows is fetched when the user scrolls to the end of the list/scroller. The fetchSize option determines how many rows are fetched in each block.
     */
    scrollPolicyOptions?: Props<K, D>['scrollPolicyOptions'];
    /**
     * The current selected items in the ListView. An empty KeySet indicates nothing is selected.
     * Note that property change event for the deprecated selection property will still be fire when
     * selected property has changed. In addition, <a href="AllKeySetImpl.html">AllKeySetImpl</a> set
     * can be used to represent select all state. In this case, the value for selection would have an
     * 'inverted' property set to true, and would contain the keys of the items that are not selected.
     */
    selected?: Props<K, D>['selected'];
    /**
     * <p>The type of selection behavior that is enabled on the ListView. This attribute controls the number of selections that can be made via selection gestures at any given time.
     *
     * <p>If the specified value is not <code class="prettyprint">none</code>, selection gestures will be enabled, and the ListView's selection styling will be applied to all items specified by the <a href="#selected">selected</a> attribute.
     * If <code class="prettyprint">singleRequired</code> is specified, then the behavior is the same as single except that ListView will ensure there is an item selected at all times. Specifically, the user will not be able to de-selected a selected item.  And if selection is initially empty, ListView will select the first item.
     * If <code class="prettyprint">none</code> is specified, selection gestures will be disabled, and the ListView's selection styling will not be applied to any items specified by the <a href="#selected">selected</a> attribute.
     * <p>Changing the value of this attribute will not affect the value of the <a href="#selected">selected</a> attribute.
     */
    selectionMode?: Props<K, D>['selectionMode'];
}
export interface CListViewElementSettablePropertiesLenient<K extends string | number, D> extends Partial<CListViewElementSettableProperties<K, D>> {
    [key: string]: any;
}
export interface ListViewIntrinsicProps extends Partial<Readonly<CListViewElementSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    currentItem?: never;
    children?: import('preact').ComponentChildren;
    onojContextMenuAction?: (value: CListViewElementEventMap<any, any>['ojContextMenuAction']) => void;
    onojContextMenuSelection?: (value: CListViewElementEventMap<any, any>['ojContextMenuSelection']) => void;
    /**
     * Triggered when data for the first selected item is available.  This can occurred when:
     * <ul>
     *   <li>ListView is initialized with a selection or first item is selected due to singleRequired selection mode.</li>
     *   <li>Selection has changed.</li>
     *   <li>Data for the first selected item is updated.</li>
     * </ul>
     * Note this event will only be enabled if selection-mode is set to <code class="prettyprint">singleRequired</code>.
     */
    onojFirstSelectedItem?: (value: CListViewElementEventMap<any, any>['ojFirstSelectedItem']) => void;
    /**
     * Triggered when user performs an action gesture on an item while ListView is in navigation mode.  The action gestures include:
     * <ul>
     *   <li>User clicks anywhere in an item</li>
     *   <li>User taps anywhere in an item</li>
     *   <li>User pressed enter key while item has focus</li>
     * </ul>
     */
    onojItemAction?: (value: CListViewElementEventMap<any, any>['ojItemAction']) => void;
    /**
     * Triggered after items are reordered within ListView via drag and drop or keyboard.
     */
    onojReorder?: (value: CListViewElementEventMap<any, any>['ojReorder']) => void;
    oncontextMenuConfigChanged?: (value: CListViewElementEventMap<any, any>['contextMenuConfigChanged']) => void;
    oncurrentItemChanged?: (value: CListViewElementEventMap<any, any>['currentItemChanged']) => void;
    oncurrentItemOverrideChanged?: (value: CListViewElementEventMap<any, any>['currentItemOverrideChanged']) => void;
    ondataChanged?: (value: CListViewElementEventMap<any, any>['dataChanged']) => void;
    ongridlinesChanged?: (value: CListViewElementEventMap<any, any>['gridlinesChanged']) => void;
    onitemChanged?: (value: CListViewElementEventMap<any, any>['itemChanged']) => void;
    onreorderableChanged?: (value: CListViewElementEventMap<any, any>['reorderableChanged']) => void;
    onscrollPolicyOptionsChanged?: (value: CListViewElementEventMap<any, any>['scrollPolicyOptionsChanged']) => void;
    onselectedChanged?: (value: CListViewElementEventMap<any, any>['selectedChanged']) => void;
    onselectionModeChanged?: (value: CListViewElementEventMap<any, any>['selectionModeChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-list-view': ListViewIntrinsicProps;
        }
    }
}
