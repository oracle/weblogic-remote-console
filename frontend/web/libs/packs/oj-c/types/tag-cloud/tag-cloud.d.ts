/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentProps, ComponentChildren } from 'preact';
import { TagCloud as PreactTagCloud } from '@oracle/oraclejet-preact/UNSAFE_TagCloud';
import 'css!oj-c/tag-cloud/tag-cloud-styles.css';
import { DataProvider } from 'ojs/ojdataprovider';
import { TagCloudItemProps } from '../tag-cloud-item/tag-cloud-item';
import { Action, Bubbles, ExtendGlobalProps, ObservedGlobalProps, PropertyChanged, TemplateSlot } from 'ojs/ojvcomponent';
import { type ContextMenuConfig, type ContextMenuSelectionDetail, type ContextMenuActionDetail } from 'oj-c/hooks/PRIVATE_useVisContextMenu/useVisContextMenu';
type PreactTagCloudProps = ComponentProps<typeof PreactTagCloud>;
export type TagCloudContextMenuConfig<K, D> = ContextMenuConfig<TagcloudContextMenuContext<K, D>>;
type TagCloudContextMenuSelectionDetail<K, D> = ContextMenuSelectionDetail<TagcloudContextMenuContext<K, D>>;
type TagCloudContextMenuActionDetail<K, D> = ContextMenuActionDetail<TagcloudContextMenuContext<K, D>>;
/** @deprecated since 19.0.0 - use `CTagCloudElement.<event-name>['detail']` instead */
export type TagCloudContextMenuSelectionDetailDeprecated<K, D> = TagCloudContextMenuSelectionDetail<K, D>;
/** @deprecated since 19.0.0 - use `CTagCloudElement.<event-name>['detail']` instead */
export type TagCloudContextMenuActionDetailDeprecated<K, D> = TagCloudContextMenuActionDetail<K, D>;
export type TagcloudContextMenuContext<K, D> = {
    /**
     * The shaped data of the item.
     */
    data?: Item<K>;
    /**
     * The data of the item from the data provider.
     */
    itemData?: D;
    type: 'item';
} | {
    type: 'background';
};
/**
 * Context for datatip function.
 */
type DatatipContext<K> = {
    /**
     * The id of the currently active tag cloud item.
     */
    id: K;
};
export type Item<K> = {
    /**
     * @description
     * The item id should be set by the application if the DataProvider is not being used. The row key will be used as id in the DataProvider case.
     */
    id: K;
} & TagCloudItemProps;
export type TagCloudItemTemplateContext<K, D> = {
    /**
     * @description
     * The data object of the current item.
     */
    data: D;
    /**
     * @description
     * The key of the current item.
     */
    key: K;
    /**
     * @description
     * The zero-based index of the current item.
     */
    index: number;
};
export type TagCloudProps<K, D extends Item<K> | any> = ObservedGlobalProps<'aria-label' | 'aria-describedby' | 'aria-labelledby'> & {
    /**
     * @description
     * Specifies the DataProvider for the sections and items of the tag-cloud.
     * @ojmetadata description "Specifies the DataProvider for the sections and items of the tag-cloud"
     * @ojmetadata displayName "Data"
     * @ojmetadata help "#data"
     * @ojmetadata extension {
     *   "webelement": {
     *     "exceptionStatus": [
     *       {
     *         "type": "deprecated",
     *         "since": "17.1.0",
     *         "description": "Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead."
     *       }
     *     ]
     *   }
     * }
     */
    data: DataProvider<K, D> | null;
    /**
     * @description
     * The tagcloud datatip string.
     * @ojmetadata displayName "Datatip"
     * @ojmetadata help "#datatip"
     */
    datatip?: (context: DatatipContext<K>) => string;
    /**
     * @description
     * An array of category strings used for highlighting. Data items matching categories in this array will be highlighted.
     * @ojmetadata description "An array of categories that will be hidden."
     * @ojmetadata displayName "Hidden Categories"
     * @ojmetadata help "#hiddenCategories"
     */
    hiddenCategories?: string[] | undefined;
    /**
     * @description
     * Data visualizations require a press and hold delay before triggering tooltips and rollover effects on mobile devices to avoid interfering with page panning, but these hold delays can make applications seem slower and less responsive. For a better user experience, the application can remove the touch and hold \delay when data visualizations are used within a non scrolling container or if there is sufficient space outside of the visualization for panning. If touchResponse is touchStart the element will instantly trigger the touch gesture and consume the page pan events. If touchResponse is auto, the element will behave like touchStart if it determines that it is not rendered within scrolling content and if element panning is not available for those elements that support the feature.
     * @ojmetadata description "Data visualizations require a press and hold delay before triggering tooltips and rollover effects on mobile devices to avoid interfering with page panning, but these hold delays can make applications seem slower and less responsive. For a better user experience, the application can remove the touch and hold \delay when data visualizations are used within a non scrolling container or if there is sufficient space outside of the visualization for panning. If touchResponse is touchStart the element will instantly trigger the touch gesture and consume the page pan events. If touchResponse is auto, the element will behave like touchStart if it determines that it is not rendered within scrolling content and if element panning is not available for those elements that support the feature."
     * @ojmetadata displayName "Touch Response"
     * @ojmetadata help "#touchResponse"
     */
    touchResponse?: 'touchStart' | 'auto';
    /**
     * @description
     * The matching condition for the highlightedCategories option. By default, highlightMatch is 'all' and only items whose categories match all of the values specified in the highlightedCategories array will be highlighted. If highlightMatch is 'any', then items that match at least one of the highlightedCategories values will be highlighted.
     * @ojmetadata description " The matching condition for the highlightedCategories option. By default, highlightMatch is 'all' and only items whose categories match all of the values specified in the highlightedCategories array will be highlighted. If highlightMatch is 'any', then items that match at least one of the highlightedCategories values will be highlighted."
     * @ojmetadata displayName "Highlight Match"
     * @ojmetadata help "#highlightMatch"
     */
    highlightMatch?: 'any' | 'all';
    /**
     * @ojmetadata description Writeback support for the highlightedCategories property
     * @ojmetadata displayName "Highlighted Categories"
     * @ojmetadata help "#highlightedCategories"
     */
    onHiddenCategoriesChanged?: PropertyChanged<string[]>;
    /**
     * @description
     * An array of categories that will be highlighted.
     * @ojmetadata description "An array of categories that will be highlighted."
     * @ojmetadata displayName "Highlighted Categories"
     * @ojmetadata help "#highlightedCategories"
     */
    highlightedCategories?: string[];
    /**
     * @ojmetadata description Writeback support for the highlightedCategories property
     * @ojmetadata displayName "Highlighted Categories"
     * @ojmetadata help "#highlightedCategories"
     */
    onHighlightedCategoriesChanged?: PropertyChanged<string[]>;
    /**
     * @description
     * Defines the behavior applied when hovering over a tagcloud item.
     * @ojmetadata description "Defines the behavior applied when hovering over data items."
     * @ojmetadata displayName "Hover Behavior"
     * @ojmetadata help "#hoverBehavior"
     * @ojmetadata propertyEditorValues {
     *     "dim": {
     *       "description": "Dimming hover behavior is applied.",
     *       "displayName": "Dim"
     *     },
     *     "none": {
     *       "description": "No hover behavior will be applied.",
     *       "displayName": "None"
     *     }
     *   }
     */
    hoverBehavior?: 'dim' | 'none';
    /**
     * @description
     * The layout to use for tag display.
     * @ojmetadata description "The layout to use for tag display."
     * @ojmetadata displayName "Layout"
     * @ojmetadata help "#layout"
     * @ojmetadata propertyEditorValues {
     *     "cloud": {
     *       "description": "Items will be horizontally placed in available space.",
     *       "displayName": "Cloud"
     *     },
     *     "rectangular": {
     *       "description": "Items will be vertically stacked.",
     *       "displayName": "Rectangular"
     *     }
     *   }
     */
    layout?: PreactTagCloudProps['layout'];
    /**
     * @description
     * The type of selection behavior that is enabled on the tag cloud. This attribute controls the number of selections that can be made via selection gestures at any given time.
     * @ojmetadata description "Specifies the selection mode."
     * @ojmetadata displayName "Selection Mode"
     * @ojmetadata help "#selectionMode"
     */
    selectionMode?: 'none' | 'single' | 'multiple';
    /**
     * @description
     * An array containing the ids of the initially selected data items.
     * @ojmetadata description "An array containing the ids of the initially selected data items."
     * @ojmetadata displayName "Selection"
     * @ojmetadata help "#selection"
     */
    selection?: K[];
    /**
     * @ojmetadata description Writeback support for the selection property
     * @ojmetadata displayName "Selection"
     * @ojmetadata help "#selection"
     */
    onSelectionChanged?: PropertyChanged<K[]>;
    /**
     * @description
     * <p>
     *  The <code class="prettyprint">itemTemplate</code> slot is used to specify the template for
     *  creating items. The slot content must be a single  &lt;template>
     *  element.
     * </p>
     * <p>
     *  When the template is executed for each area, it will have access to the tag cloud's binding context and the following properties:
     * </p>
     * <ul>
     *   <li>
     *      $current - an object that contains information for the current item.
     *      (See the table below for a list of properties available on $current)
     *   </li>
     *   <li>
     *      alias - if data-oj-as attribute was specified, the value will be used to provide an application-named alias for $current.
     *   </li>
     * </ul>
     * <p>
     * The content of the template should only be one &lt;oj-c-tag-cloud-item> element. See the oj-tag-cloud-item doc for more details.
     * </p>
     *
     * @ojmetadata description "The itemTemplate slot is used to map each data item in the component. See the Help documentation for more information."
     * @ojmetadata displayName "itemTemplate"
     * @ojmetadata help "#itemTemplate"
     * @ojmetadata maxItems 1
     */
    itemTemplate?: TemplateSlot<TagCloudItemTemplateContext<K, D>>;
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
    contextMenuConfig?: TagCloudContextMenuConfig<K, D>;
    /**
     * @ojmetadata description "Triggered when a menu item is clicked, whether by keyboard, mouse,
     *    or touch events."
     * @ojmetadata eventGroup "common"
     * @ojmetadata displayName "onOjContextMenuAction"
     * @ojmetadata help "#event:ojContextMenuAction"
     */
    onOjContextMenuAction?: Action<TagCloudContextMenuActionDetail<K, D>> & Bubbles;
    /**
     * @ojmetadata description "Triggered when a select menu item is clicked, whether by keyboard, mouse,
     *    or touch events."
     * @ojmetadata eventGroup "common"
     * @ojmetadata displayName "onOjContextMenuSelection"
     * @ojmetadata help "#event:ojContextMenuSelection"
     */
    onOjContextMenuSelection?: Action<TagCloudContextMenuSelectionDetail<K, D>> & Bubbles;
};
/**
 * @classdesc
 * <h3 id="tagCloudOverview-section">
 *   JET Tag Cloud
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#tagCloudOverview-section"></a>
 * </h3>
 * *
 * <p>Tag clouds are used to display text data with
 * the importance of each tag shown with font size or color.</p>
 *
 *
 * <pre class="prettyprint">
 * <code>
 * &lt;oj-c-tag-cloud
 *   data="[[dataProvider]]">
 * &lt;/oj-c-tag-cloud>
 * </code>
 * </pre>
 *
 *
 * <p>When using font colors as a data dimension for tag clouds, the application
 * needs to ensure that they meet minimum contrast requirements. Not all colors
 * in the default value ramp provided by oj.ColorAttributeGroupHandler
 * will meet minimum contrast requirements.</p>
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>Tab</kbd></td>
 *       <td>Move focus to next element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>Move focus to previous element.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Move focus and selection to previous data item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Move focus and selection to next data item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move focus and selection to previous data item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move focus and selection to next data item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + UpArrow</kbd></td>
 *       <td>Move focus and multi-select previous data item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + DownArrow</kbd></td>
 *       <td>Move focus and multi-select next data item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + LeftArrow</kbd></td>
 *       <td>Move focus and multi-select previous data item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift + RightArrow</kbd></td>
 *       <td>Move focus and multi-select next data item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + UpArrow</kbd></td>
 *       <td>Move focus to previous data item, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + DownArrow</kbd></td>
 *       <td>Move focus to next data item, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + LeftArrow</kbd></td>
 *       <td>Move focus to previous data item, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + RightArrow</kbd></td>
 *       <td>Move focus to next data item, without changing the current selection.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Ctrl + Spacebar</kbd></td>
 *       <td>Multi-select data item with focus.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Enter</kbd></td>
 *       <td>Open a link when the <code class="prettyprint">url</code> for a data item is set.</td>
 *     </tr>
 *      <tr>
 *       <td><kbd>Shift+F10</kbd></td>
 *       <td>Launch the context menu if there is one associated with the current item.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 * To make your component accessible, the application is required to include contextual information for screender readers using one or more the following methods as appropriate:
 *  <ul>
 *   <li>aria-describedby</li>
 *   <li>aria-labelledby</li>
 *   <li>aria-label</li>
 *   <li>short-desc property of your items</li>
 *  </ul>
 * <p>
 *  If your application has custom keyboard and touch shortcuts implemented for the component, these shortcuts can conflict with those of the component. It is the application's responsibility to disclose these custom shortcuts, possibly via a datatip or help popup.
 * </p>
 * <p>
 *  When using colors as a data dimension for tag clouds, the application needs to ensure that they meet <a target="_blank" href="https://www.w3.org/TR/WCAG21/#contrast-minimum">minimum contrast requirements</a>.
 * </p>
 *
 * <h3 id="perf-section">
 *   Performance
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
 * </h3>
 *
 * <h4>Shaped Data</h4>
 * <p>As a rule of thumb, it's recommended that applications use <a href="https://jet.oraclecorp.com/trunk/jetCookbook.html?component=tagCloudCorepack&demo=shapedData">shaped data</a> if possible for performance gains.</p>
 *
 * <h4>Layout</h4>
 * <p>Rectangular layouts are faster than cloud layouts and are recommended for larger data sets.
 * </p>
 *
 *
 * <h3 id="touch-section">
 * Touch End User Information
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
 *       <td rowspan="3">Data Item</td>
 *       <td rowspan="2"><kbd>Tap</kbd></td>
 *       <td>Select when <code class="prettyprint">selectionMode</code> is enabled.</td>
 *     </tr>
 *     <tr>
 *        <td>Open a link when the <code class="prettyprint">url</code> for a data item is set.</td>
 *     </tr>
 *     <tr>
 *        <td><kbd>Press & Hold</kbd></td>
 *        <td>Display context menu on release.</td>
 *     </tr>
 *     <tr>
 *        <td>Background</td>
 *        <td><kbd>Press & Hold</kbd></td>
 *        <td>Display context menu on release.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 *
 * @ojmetadata description "A tag cloud is an interactive data visualization of textual data, where the importance of each tagged word or phrase is represented by font size or color."
 * @ojmetadata displayName "Tag Cloud"
 * @ojmetadata main "oj-c/tag-cloud"
 * @ojmetadata help "oj-c.TagCloud.html"
 * @ojmetadata status [
 *   {
 *     type: "candidate",
 *     since: "17.0.0"
 *   }
 * ]
 * @ojmetadata extension {
 *   "catalog": {
 *     "category": "Visualizations"
 *   },
 *   "vbdt": {
 *     "module": "oj-c/tag-cloud",
 *       "defaultColumns": 12,
 *         "minColumns": 6
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-cloud-tag",
 *     "uxSpecs": [
 *       "tag-cloud"
 *     ]
 *   }
 * }
 *
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "common",
 *     "items": [
 *       "layout",
 *       "style"
 *     ]
 *   },
 *   {
 *     "propertyGroup": "data",
 *     "items": [
 *       "data",
 *       "selection"
 *     ]
 *   }
 * ]
 * @ojmetadata since "15.0.0"
 *
 * @ojmetadata requirements [
 *  {
 *    type: "anyOf",
 *    label: "accessibility",
 *    properties: ["aria-label", "aria-labelledby", "aria-describedby"]
 *  }
 * ]
 *
 */
declare function TagCloudComp<K extends string | number, D extends any>({ hiddenCategories, data, highlightedCategories, hoverBehavior, layout, selection, selectionMode, highlightMatch, contextMenuConfig, onOjContextMenuAction, onOjContextMenuSelection, ...props }: TagCloudProps<K, D>): import("preact").JSX.Element;
/**
 * This export corresponds to the TagCloud Preact component. For the oj-c-tag-cloud custom element, import CTagCloudElement instead.
 */
export declare const TagCloud: <K extends string | number = string | number, D extends Item<K> | any = Item<K> | any>(props: ExtendGlobalProps<ComponentProps<typeof TagCloudComp<K, D>>>) => ComponentChildren;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-tag-cloud custom element. For the TagCloud Preact component, import TagCloud instead.
 */
export interface CTagCloudElement<K extends string | number, D extends Item<K> | any> extends JetElement<CTagCloudElementSettableProperties<K, D>>, CTagCloudElementSettableProperties<K, D> {
    addEventListener<T extends keyof CTagCloudElementEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: CTagCloudElementEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CTagCloudElementSettableProperties<K, D>>(property: T): CTagCloudElement<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CTagCloudElementSettableProperties<K, D>>(property: T, value: CTagCloudElementSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CTagCloudElementSettableProperties<K, D>>): void;
    setProperties(properties: CTagCloudElementSettablePropertiesLenient<K, D>): void;
}
export namespace CTagCloudElement {
    interface ojContextMenuAction<K extends string | number, D extends Item<K> | any> extends CustomEvent<TagCloudContextMenuActionDetail<K, D> & {}> {
    }
    interface ojContextMenuSelection<K extends string | number, D extends Item<K> | any> extends CustomEvent<TagCloudContextMenuSelectionDetail<K, D> & {}> {
    }
    type contextMenuConfigChanged<K extends string | number, D extends Item<K> | any> = JetElementCustomEventStrict<CTagCloudElement<K, D>['contextMenuConfig']>;
    type dataChanged<K extends string | number, D extends Item<K> | any> = JetElementCustomEventStrict<CTagCloudElement<K, D>['data']>;
    type datatipChanged<K extends string | number, D extends Item<K> | any> = JetElementCustomEventStrict<CTagCloudElement<K, D>['datatip']>;
    type hiddenCategoriesChanged<K extends string | number, D extends Item<K> | any> = JetElementCustomEventStrict<CTagCloudElement<K, D>['hiddenCategories']>;
    type highlightMatchChanged<K extends string | number, D extends Item<K> | any> = JetElementCustomEventStrict<CTagCloudElement<K, D>['highlightMatch']>;
    type highlightedCategoriesChanged<K extends string | number, D extends Item<K> | any> = JetElementCustomEventStrict<CTagCloudElement<K, D>['highlightedCategories']>;
    type hoverBehaviorChanged<K extends string | number, D extends Item<K> | any> = JetElementCustomEventStrict<CTagCloudElement<K, D>['hoverBehavior']>;
    type layoutChanged<K extends string | number, D extends Item<K> | any> = JetElementCustomEventStrict<CTagCloudElement<K, D>['layout']>;
    type selectionChanged<K extends string | number, D extends Item<K> | any> = JetElementCustomEventStrict<CTagCloudElement<K, D>['selection']>;
    type selectionModeChanged<K extends string | number, D extends Item<K> | any> = JetElementCustomEventStrict<CTagCloudElement<K, D>['selectionMode']>;
    type touchResponseChanged<K extends string | number, D extends Item<K> | any> = JetElementCustomEventStrict<CTagCloudElement<K, D>['touchResponse']>;
    type ItemTemplateContext<K extends string | number, D extends Item<K> | any> = TagCloudItemTemplateContext<K, D>;
    type RenderItemTemplate<K extends string | number, D extends Item<K> | any> = import('ojs/ojvcomponent').TemplateSlot<TagCloudItemTemplateContext<K, D>>;
}
export interface CTagCloudElementEventMap<K extends string | number, D extends Item<K> | any> extends HTMLElementEventMap {
    'ojContextMenuAction': CTagCloudElement.ojContextMenuAction<K, D>;
    'ojContextMenuSelection': CTagCloudElement.ojContextMenuSelection<K, D>;
    'contextMenuConfigChanged': JetElementCustomEventStrict<CTagCloudElement<K, D>['contextMenuConfig']>;
    'dataChanged': JetElementCustomEventStrict<CTagCloudElement<K, D>['data']>;
    'datatipChanged': JetElementCustomEventStrict<CTagCloudElement<K, D>['datatip']>;
    'hiddenCategoriesChanged': JetElementCustomEventStrict<CTagCloudElement<K, D>['hiddenCategories']>;
    'highlightMatchChanged': JetElementCustomEventStrict<CTagCloudElement<K, D>['highlightMatch']>;
    'highlightedCategoriesChanged': JetElementCustomEventStrict<CTagCloudElement<K, D>['highlightedCategories']>;
    'hoverBehaviorChanged': JetElementCustomEventStrict<CTagCloudElement<K, D>['hoverBehavior']>;
    'layoutChanged': JetElementCustomEventStrict<CTagCloudElement<K, D>['layout']>;
    'selectionChanged': JetElementCustomEventStrict<CTagCloudElement<K, D>['selection']>;
    'selectionModeChanged': JetElementCustomEventStrict<CTagCloudElement<K, D>['selectionMode']>;
    'touchResponseChanged': JetElementCustomEventStrict<CTagCloudElement<K, D>['touchResponse']>;
}
export interface CTagCloudElementSettableProperties<K, D extends Item<K> | any> extends JetSettableProperties {
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
    contextMenuConfig?: TagCloudProps<K, D>['contextMenuConfig'];
    /**
     * Specifies the DataProvider for the sections and items of the tag-cloud.
     */
    data: TagCloudProps<K, D>['data'];
    /**
     * The tagcloud datatip string.
     */
    datatip?: TagCloudProps<K, D>['datatip'];
    /**
     * An array of category strings used for highlighting. Data items matching categories in this array will be highlighted.
     */
    hiddenCategories?: TagCloudProps<K, D>['hiddenCategories'];
    /**
     * The matching condition for the highlightedCategories option. By default, highlightMatch is 'all' and only items whose categories match all of the values specified in the highlightedCategories array will be highlighted. If highlightMatch is 'any', then items that match at least one of the highlightedCategories values will be highlighted.
     */
    highlightMatch?: TagCloudProps<K, D>['highlightMatch'];
    /**
     * An array of categories that will be highlighted.
     */
    highlightedCategories?: TagCloudProps<K, D>['highlightedCategories'];
    /**
     * Defines the behavior applied when hovering over a tagcloud item.
     */
    hoverBehavior?: TagCloudProps<K, D>['hoverBehavior'];
    /**
     * The layout to use for tag display.
     */
    layout?: TagCloudProps<K, D>['layout'];
    /**
     * An array containing the ids of the initially selected data items.
     */
    selection?: TagCloudProps<K, D>['selection'];
    /**
     * The type of selection behavior that is enabled on the tag cloud. This attribute controls the number of selections that can be made via selection gestures at any given time.
     */
    selectionMode?: TagCloudProps<K, D>['selectionMode'];
    /**
     * Data visualizations require a press and hold delay before triggering tooltips and rollover effects on mobile devices to avoid interfering with page panning, but these hold delays can make applications seem slower and less responsive. For a better user experience, the application can remove the touch and hold \delay when data visualizations are used within a non scrolling container or if there is sufficient space outside of the visualization for panning. If touchResponse is touchStart the element will instantly trigger the touch gesture and consume the page pan events. If touchResponse is auto, the element will behave like touchStart if it determines that it is not rendered within scrolling content and if element panning is not available for those elements that support the feature.
     */
    touchResponse?: TagCloudProps<K, D>['touchResponse'];
}
export interface CTagCloudElementSettablePropertiesLenient<K, D extends Item<K> | any> extends Partial<CTagCloudElementSettableProperties<K, D>> {
    [key: string]: any;
}
export interface TagCloudIntrinsicProps extends Partial<Readonly<CTagCloudElementSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    children?: import('preact').ComponentChildren;
    onojContextMenuAction?: (value: CTagCloudElementEventMap<any, any>['ojContextMenuAction']) => void;
    onojContextMenuSelection?: (value: CTagCloudElementEventMap<any, any>['ojContextMenuSelection']) => void;
    oncontextMenuConfigChanged?: (value: CTagCloudElementEventMap<any, any>['contextMenuConfigChanged']) => void;
    ondataChanged?: (value: CTagCloudElementEventMap<any, any>['dataChanged']) => void;
    ondatatipChanged?: (value: CTagCloudElementEventMap<any, any>['datatipChanged']) => void;
    onhiddenCategoriesChanged?: (value: CTagCloudElementEventMap<any, any>['hiddenCategoriesChanged']) => void;
    onhighlightMatchChanged?: (value: CTagCloudElementEventMap<any, any>['highlightMatchChanged']) => void;
    onhighlightedCategoriesChanged?: (value: CTagCloudElementEventMap<any, any>['highlightedCategoriesChanged']) => void;
    onhoverBehaviorChanged?: (value: CTagCloudElementEventMap<any, any>['hoverBehaviorChanged']) => void;
    onlayoutChanged?: (value: CTagCloudElementEventMap<any, any>['layoutChanged']) => void;
    onselectionChanged?: (value: CTagCloudElementEventMap<any, any>['selectionChanged']) => void;
    onselectionModeChanged?: (value: CTagCloudElementEventMap<any, any>['selectionModeChanged']) => void;
    ontouchResponseChanged?: (value: CTagCloudElementEventMap<any, any>['touchResponseChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-tag-cloud': TagCloudIntrinsicProps;
        }
    }
}
