/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentProps, ComponentChildren } from 'preact';
import { DataProvider, Item } from 'ojs/ojdataprovider';
import { ImmutableKeySet } from 'ojs/ojkeyset';
import { Action, ExtendGlobalProps, ObservedGlobalProps, ReadOnlyPropertyChanged, TemplateSlot, PropertyChanged } from 'ojs/ojvcomponent';
import { SkeletonRendererContext } from '@oracle/oraclejet-preact/UNSAFE_CardFlexView';
import { CardGridView as PreactCardGridView } from '@oracle/oraclejet-preact/UNSAFE_CardGridView';
import 'css!oj-c/card-view/card-view-styles.css';
type PreactCardViewProps = ComponentProps<typeof PreactCardGridView>;
export type SkeletonTemplateContext = SkeletonRendererContext;
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
    isTabbable?: boolean;
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
type selectionMode = PreactCardViewProps['selectionMode'] | 'singleRequired';
type Props<K extends string | number, D> = ObservedGlobalProps<'aria-label' | 'aria-labelledby' | 'aria-describedby' | 'id'> & {
    /**
     * @description
     * The item that currently has keyboard focus
     *
     * @ojmetadata description "The item that currently has keyboard focus"
     * @ojmetadata displayName "Current Item"
     * @ojmetadata help "#currentItem"
     */
    onCurrentItemChanged?: ReadOnlyPropertyChanged<K>;
    /**
     * @description
     * The data source for CardView. Must be of type DataProvider.
     *
     * @ojmetadata description "The data source for CardView."
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
     * Specifies size of the gutter between columns and rows.
     *
     * Possible values are: 'xs', 'sm', 'md', 'lg' and 'xl'.
     * The default value is 'sm'.
     *
     * @ojmetadata description "Size of the gutter between columns and rows."
     * @ojmetadata displayName "GutterSize"
     * @ojmetadata help "#gutterSize"
     */
    gutterSize?: PreactCardViewProps['gutterSize'];
    /**
     * @description
     * <p>The <code class="prettyprint">noData</code> slot is used to specify the content to display when the CardView is empty. The slot content
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
     *   <li>scroller: The css selector that locates the element in which CardView uses to determine the scroll position as well as the maximum scroll position where scroll to the end will trigger a fetch.  If not specified then the oj-c-card-view element is used.</li>
     * </ul>
     * By default, the next block of rows is fetched when the user scrolls to the end of the CardView/scroller. The fetchSize option determines how many rows are fetched in each block.
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
     * The current selected items in the CardView. An empty KeySet indicates nothing is selected.
     * In addition, <a href="AllKeySetImpl.html">AllKeySetImpl</a> set
     * can be used to represent select all state.
     *
     * @ojmetadata description "The selected property"
     * @ojmetadata displayName "Selected Items Changed"
     * @ojmetadata help "#selected"
     */
    selected?: ImmutableKeySet<K>;
    /**
     * @description
     * <p>The <code class="prettyprint">itemTemplate</code> slot is used to specify the template for rendering each item in the CardView. The slot content must be a &lt;template> element.
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
     * @ojmetadata description "Writeback support for the selected property"
     * @ojmetadata displayName "Selected Items Changed"
     * @ojmetadata help "#selected"
     */
    onSelectedChanged?: PropertyChanged<ImmutableKeySet<K>>;
    /**
     * @description
     * <p>The type of selection behavior that is enabled on the CardView. This attribute controls the number of selections that can be made via selection gestures at any given time.
     *
     * <p>If <code class="prettyprint">single</code> or <code class="prettyprint">multiple</code> is specified, selection gestures will be enabled, and the CardView's selection styling will be applied to all items specified by the <a href="#selected">selected</a> attribute.
     * If <code class="prettyprint">singleRequired</code> is specified, then the behavior is the same as single except that CardView will ensure there is an item selected at all times. Specifically, the user will not be able to de-selected a selected item.  And if selection is initially empty, CardView will select the first item.
     * If <code class="prettyprint">none</code> is specified, selection gestures will be disabled, and the CardView's selection styling will not be applied to any items specified by the <a href="#selected">selected</a> attribute.
     * <p>Changing the value of this attribute will not affect the value of the <a href="#selected">selected</a> attribute.
     *
     * @ojmetadata description "Type of selection behavior for the CardView"
     * @ojmetadata displayName "Selection Mode"
     * @ojmetadata help "#selectionMode"
     * @ojmetadata propertyEditorValues {
     *   "multiple": {
     *     "description": "Multiple items can be selected at the same time.",
     *     "displayName": "Multiple"
     *   },
     *   "none": {
     *     "description": "Selection is disabled.",
     *     "displayName": "None"
     *   },
     *   "single": {
     *     "description": "Only a single item can be selected at a time.",
     *     "displayName": "Single"
     *   },
     *  "singleRequired": {
     *     "description": "Only a single item can be selected at a time. In addition, CardView will also ensure that an item is selected at all time.",
     *     "displayName": "Single Required"
     *   }
     * }
     */
    selectionMode?: selectionMode;
    /**
     * @description
     * Specify animation when cards are initially rendered.
     * Possible values are: 'slideUp' and 'slideDown'
     *
     * @ojmetadata description "Specify animation when cards are initially rendered."
     * @ojmetadata displayName "Initial Animation"
     * @ojmetadata help "initialAnimation"
     */
    initialAnimation?: PreactCardViewProps['initialAnimation'];
    /**
     * @description
     * Specifies which focus behavior CardView should use for an item that has single focusable element during keyboard navigation.
     * When the focusBehavior is 'card', the focus will be on the root of CardView and it will do logical focus on the card. When the focusBehavior
     * is 'content', the first focusable element within the card will get focus. Note that when set to 'content', there should only be one focusable
     * element within the card. If that's not the case, a warning will be logged and the focus behavior will be reset to 'card'.
     *
     * @ojmetadata description "Specifies which focus behavior we should use for an item."
     * @ojmetadata displayName "Focus Behavior"
     * @ojmetadata help "focusBehavior"
     */
    focusBehavior?: PreactCardViewProps['focusBehavior'];
    /**
     * @description
     * Specifies the exact number of columns to render. By default, CardView will determine the number of columns based on
     * width of the CardView and the width of the cards.
     *
     * @ojmetadata description "Specifies the exact number of columns to render."
     * @ojmetadata displayName "Columns"
     * @ojmetadata help "columns"
     * @ojmetadata propertyEditorValues {
     *   "auto": {
     *     "description": "CardView will determine the number of columns based on width of the CardView and the width of the cards",
     *     "displayName": "Auto"
     *   }
     * }
     */
    columns?: PreactCardViewProps['columns'] | 'auto';
    /**
     * @description
     * The reorder option contains a subset of options for reordering items.
     *
     * <p>The following options are supported:</p>
     * <ul>
     *   <li>items: Enable or disable reordering the items within the same CardView using drag and drop or keyboard. Specify 'enabled' to enable reordering. Setting the value to <code class="prettyprint">"disabled"</code> or setting the <code class="prettyprint">"reorderable"</code> property
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
     * Triggered after items are reordered within CardView via drag and drop or keyboard.
     *
     * @ojmetadata description "Triggered after items are reordered within CardView via drag and drop or keyboard."
     * @ojmetadata displayName "Reorder"
     * @ojmetadata help "#event:reorder"
     */
    onOjReorder?: Action<ReorderDetail<K>>;
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
     * <tr><th>Name</th><th>Type</th><th>Argument</th><th>Description</th></tr>
     * </thead>
     * <tbody>
     * <tr><td>loadingStatus</td><td>'initial' | 'loadMore'</td><td>     </td><td>Whether the skeletons are rendered for initial load of data or for load more data in CardView</td></tr>
     * <tr><td>height</td><td>Size</td><td>optional</td><td>when the loadingStatus is ‘loadMore’ this will be the height of the actual card size, when loadingStatus is 'initial' this vale is undefined.</td></tr>
     * <tr><td>width</td><td>Size</td><td>optional</td><td>when the loadingStatus is ‘loadMore’ this will be the width of the actual card size, when loadingStatus is 'initial' this vale is undefined.</td></tr>
     * </tbody>
     * </table>
     * <p></p>
     * <p>Example of skeletonTemplate slot usage.</p>
     * <pre class="prettyprint">
   * <code>
   * &lt;oj-c-card-view
   *    id="cardview"
              class="demo-card-view"
              aria-label="cardview with custom skeleton"
              data=[[dataProvider]]>
          &lt;template slot="skeletonTemplate" data-oj-as="context">
            &lt;div class="oj-panel oj-sm-padding-0
             :style="[[context.loadingStatus === 'initial' ? { width: '300px', height: '240px' } : { width: context.width, height: context.height } ]]">
                &lt;oj-c-skeleton height ="100%">
                &lt;/oj-c-skeleton>
            &lt;/div>
          &lt;/template>
          &lt;template data-oj-as="item" slot="itemTemplate">
            &lt;div class="oj-panel">
              &lt;demo-profile-card-layout
                name="[[item.data.name]]"
                initials="[[item.data.initials]]"
              >
              &lt;/demo-profile-card-layout>
            &lt;/div>
          &lt;/template>
   * &lt;/oj-c-card-view>
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
 * @classdesc
 * <h3 id="CardViewOverview-section">
 *   JET CardView Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#CardViewOverview-section"></a>
 * </h3>
 *
 * <p>Description: The JET CardView enhances a themable, WAI-ARIA compliant, mobile friendly component with advance interactive features.
 * The child content can be configured via a DataProvider which should be used for mutable data.</p>
 *
 * <p>For migration information from the card layout feature from <code>oj-list-view</code> refer to the <a href="https://jet.oraclecorp.com/trunk/jsdocs/oj.ojListView.html#styling-section">migration section</a> in the API docs.
 *
 * <h3 id="data-section">
 *   Data
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#data-section"></a>
 * </h3>
 * <p>The JET CardView gets its data from a DataProvider.</p>
 *
 * <p><b>ArrayDataProvider</b> - Use this when the underlying data is an array object or an observableArray.  In the observableArray case, CardView will automatically react
 * when items are added or removed from the array.  See the documentation for ArrayDataProvider for more details on the available options.</p>
 *
 * <p>Example of data provider content</p>
 * <pre class="prettyprint"><code>
 *   &lt;oj-c-card-view aria-label="Accessible Summary" data="[[dataProvider]]">
 *   &lt;/oj-c-card-view>
 * </code></pre>
 *
 * <p>Check out the CardView Basic demo</a>
 *
 * <h3 id="keyboard-section">
 *   Coming Features
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#coming-features-section"></a>
 * </h3>
 *
 * <p>These features will be available in forthcoming versions</p>
 * <ul>
 *    <li>Context menu</li>
 *    <li>First selected item</li>
 *    <li>Drag and drop between components</li>
 *    <li>Managing scroll position</li>
 * </ul>
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
 *       <td rowspan = "20" nowrap>Card Item</td>
 *       <td><kbd>F2</kbd></td>
 *       <td>Enters tabbable mode.  This enables keyboard action on elements inside the item, including navigate between focusable elements inside the item.  It can also be used to exit tabbable mode if already in tabbable mode.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Exits tabbable mode.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Tab</kbd></td>
 *       <td>When in tabbable mode, navigates to next focusable element within the item.  If the last focusable element is reached, shift focus back to the first focusable element.
 *           When not in tabbable mode, navigates to next focusable element on page (outside CardView).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+Tab</kbd></td>
 *       <td>When in tabbable mode, navigates to previous focusable element within the item.  If the first focusable element is reached, shift focus back to the last focusable element.
 *           When not in tabbable mode, navigates to previous focusable element on page (outside CardView).</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Move focus to the item below.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Move focus to the item above.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Move focus to the item on the left.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Move focus to the item on the right.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+DownArrow</kbd></td>
 *       <td>Extend the selection to the item below.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+UpArrow</kbd></td>
 *       <td>Extend the selection to the item above.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+LeftArrow</kbd></td>
 *       <td>Extend the selection to the item on the left.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+RightArrow</kbd></td>
 *       <td>Extend the selection to the item on the right.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Space</kbd></td>
 *       <td>Toggles to select and deselect the current item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+Space</kbd></td>
 *       <td>Selects contiguous items from the last selected item to the current item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+Cmd/Ctrl+DownArrow</kbd></td>
 *       <td>Reorder the current item down.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+Cmd/Ctrl+UpArrow</kbd></td>
 *       <td>Reorder the current item up.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+Cmd/Ctrl+LeftArrow</kbd></td>
 *       <td>Reorder the current item to the left.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Shift+Cmd/Ctrl+RightArrow</kbd></td>
 *       <td>Reorder the current item to the right.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>Application should specify a value for the aria-label attribute with a meaningful description of the purpose of this CardView.</p>
 * <p>Note that CardView uses the grid role and follows the <a href="https://www.w3.org/TR/wai-aria-practices/examples/grid/LayoutGrids.html">Layout Grid</a> design as outlined in the <a href="https://www.w3.org/TR/wai-aria-practices/#grid">grid design pattern</a></p>
 * <p>Nesting collection components such as ListView, Table, TreeView, and CardView inside of CardView is not supported.</p>
 * <p>When reorder feature is enabled, application should specify a live region which contains an announcement to notify assistive technologies that the card reordering happens.</p>
 *
 * <h4>Custom Colours</h4>
 * <p>Using colors, including background and text colors, is not accessible if it is the only way information is conveyed.
 * Low vision users may not be able to see the different colors, and in high contrast mode the colors are removed.
 * The Redwood approved way to show status is to use badge.</p>
 *
 * <h3 id="context-section">
 *   Item Context
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#context-section"></a>
 * </h3>
 *
 * <p>For all item options, developers can specify a function as the return value.  The function takes a single argument, which is an object that contains contextual information about the particular item.  This gives developers the flexibility to return different value depending on the context.</p>
 *
 * <p>The context parameter contains the following keys:</p>
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>data</kbd></td>
 *       <td>The data of the item.  Note this is made available primarily to ease migration.
 *           Applications should get the data from the item property instead.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>item</kbd></td>
 *       <td>An object that contains the data and metadata for the item.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>isTabbable</kbd></td>
 *       <td>A boolean indicating whether the item is in tabbable mode or not.
 *          This should be used to implement conditional behavior for all tabbable elements, this avoids creating a keyboard trap when tabbing through the CardView.<br/>
 *          This can be implemented as a conditional tabindex, for example <code>tabindex="[[!item.isTabbable && '-1']]"</code>.<br/>
 *          When composing with core pack components, this is not needed, as they are tabbable mode aware.
 *         </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <p>The following keys are not currently supported:</p>
 *
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Key</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>componentElement</kbd></td>
 *       <td>A reference to the root element of CardView.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>datasource</kbd></td>
 *       <td>A reference to the data source object.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>index</kbd></td>
 *       <td>The index of the item, where 0 is the index of the first item.  In the hierarchical case the index is relative to its parent.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>key</kbd></td>
 *       <td>The key of the item (this duplicates item.metadata.key and has been deprecated)</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>metadata</kbd></td>
 *       <td>The metadata of the item (this is instead available in item)</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>parentElement</kbd></td>
 *       <td>This will be supported by the Hierarchical list component and no longer applies to CardView..</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="data-attributes-section">
 *   Custom Data Attributes
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#data-attributes-section"></a>
 * </h3>
 *
 * <p>CardView supports the following custom data attributes.
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Name</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td><kbd>data-oj-as</kbd></td>
 *       <td>Provides an alias for a specific template instance and has the same subproperties as the $current variable.</td>
 *       <td>
 *         <pre class="prettyprint"><code>&lt;oj-c-card-view id="CardView">
 *   &lt;template slot="itemTemplate" data-oj-as="item">
 *   &lt;/template>
 * &lt;/oj-c-card-view></code></pre>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>data-oj-clickthrough</kbd></td>
 *       <td><p>Specify on any element inside an item where you want to control whether CardView should perform actions triggered by
 *           a click event originating from the element or one of its descendants.</p>
 *           <p>For example, if you specify this attribute with a value of "disabled" on a link inside an item, then CardView
 *           will not select or trigger itemAction event to be fired when user clicks on the link.</p>
 *           <p>Note that the currentItem will still be updated to the item that the user clicked on.</p>
 *           <p>Also note you do not need to set this attribute on core pack components such as oj-c-button, as it natively supports
 *              disabling clickthrough.</p>
 *       </td>
 *       <td>
 *         <pre class="prettyprint"><code>&lt;oj-c-card-view id="card-view">
 *   &lt;template slot="itemTemplate">
 *     &lt;a href="#" data-oj-clickthrough="disabled">&lt;/a>
 *   &lt;/template>
 * &lt;/oj-c-card-view></code></pre>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td><kbd>data-oj-manage-tabs</kbd></td>
 *       <td><p>CardView does not manipulate the tabindex of the item content.  Applications should set the tabIndex of any focusable
 *          element based on the isTabbableMode property from the context pass to the itemTemplate.</p>
 *          <p>However, there will be cases where you can't control the tabindex of the content, for example, if you are using components from another team.</p>
 *          <p>In that case, applications can specify this attribute on the element or one of its ancestors so that when the itemTemplate is processed,
 *          it will scan and manipulate the tabindex of any focusable elements.</p>
 *       </td>
 *       <td>
 *         <pre class="prettyprint"><code>&lt;oj-c-card-view id="CardView">
 *   &lt;template slot="itemTemplate">
 *     &lt;some-component-with-focusable-elements data-oj-manage-tabs>&lt;/some-component-with-focusable-elements>
 *   &lt;/template>
 * &lt;/oj-c-card-view></code></pre>
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 *
 * @ojmetadata displayName "Card View"
 * @ojmetadata description "A CardView displays data items as a grid with highly interactive features."
 * @ojmetadata help "oj-c.CardView.html"
 * @ojmetadata main "oj-c/card-view"
 * @ojmetadata status [
 *   {
 *     type: "production",
 *     since: "19.0.0"
 *   }
 * ]
 * @ojmetadata extension {
 *   "vbdt": {
 *     "module": "oj-c/card-view",
 *   },
 *   "oracle": {
 *     "uxSpecs": [
 *       "card-view"
 *     ]
 *   }
 * }
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "common",
 *     "items": [
 *       "selectionMode",
 *       "gutterSize",
 *       "focusBehavior",
 *       "initialAnimation"
 *     ]
 *   },
 *   {
 *     "propertyGroup": "data",
 *     "items": [
 *       "data",
 *       "selected"
 *     ]
 *   }
 * ]
 * @ojmetadata since "17.0.0"
 **/
declare const CardViewImpl: <K extends string | number, D>({ columns, data, focusBehavior, gutterSize, initialAnimation, scrollPolicyOptions, selectionMode, reorderable, ...rest }: Props<K, D>) => import("preact").JSX.Element;
/**
 * This export corresponds to the CardView Preact component. For the oj-c-card-view custom element, import CCardViewElement instead.
 */
export declare const CardView: <K extends string | number = string | number, D = any>(props: ExtendGlobalProps<ComponentProps<typeof CardViewImpl<K, D>>>) => ComponentChildren;
export type CardViewProps<K extends string | number, D> = Props<K, D>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-card-view custom element. For the CardView Preact component, import CardView instead.
 */
export interface CCardViewElement<K extends string | number, D> extends JetElement<CCardViewElementSettableProperties<K, D>>, CCardViewElementSettableProperties<K, D> {
    /**
     * The item that currently has keyboard focus
     */
    readonly currentItem?: Parameters<Required<Props<K, D>>['onCurrentItemChanged']>[0];
    addEventListener<T extends keyof CCardViewElementEventMap<K, D>>(type: T, listener: (this: HTMLElement, ev: CCardViewElementEventMap<K, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CCardViewElementSettableProperties<K, D>>(property: T): CCardViewElement<K, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CCardViewElementSettableProperties<K, D>>(property: T, value: CCardViewElementSettableProperties<K, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CCardViewElementSettableProperties<K, D>>): void;
    setProperties(properties: CCardViewElementSettablePropertiesLenient<K, D>): void;
}
declare namespace _CCardViewElementTypes {
    type _SkeletonTemplateContext = SkeletonTemplateContext;
}
export namespace CCardViewElement {
    interface ojReorder<K extends string | number> extends CustomEvent<ReorderDetail<K> & {}> {
    }
    type columnsChanged<K extends string | number, D> = JetElementCustomEventStrict<CCardViewElement<K, D>['columns']>;
    type currentItemChanged<K extends string | number, D> = JetElementCustomEventStrict<CCardViewElement<K, D>['currentItem']>;
    type dataChanged<K extends string | number, D> = JetElementCustomEventStrict<CCardViewElement<K, D>['data']>;
    type focusBehaviorChanged<K extends string | number, D> = JetElementCustomEventStrict<CCardViewElement<K, D>['focusBehavior']>;
    type gutterSizeChanged<K extends string | number, D> = JetElementCustomEventStrict<CCardViewElement<K, D>['gutterSize']>;
    type initialAnimationChanged<K extends string | number, D> = JetElementCustomEventStrict<CCardViewElement<K, D>['initialAnimation']>;
    type reorderableChanged<K extends string | number, D> = JetElementCustomEventStrict<CCardViewElement<K, D>['reorderable']>;
    type scrollPolicyOptionsChanged<K extends string | number, D> = JetElementCustomEventStrict<CCardViewElement<K, D>['scrollPolicyOptions']>;
    type selectedChanged<K extends string | number, D> = JetElementCustomEventStrict<CCardViewElement<K, D>['selected']>;
    type selectionModeChanged<K extends string | number, D> = JetElementCustomEventStrict<CCardViewElement<K, D>['selectionMode']>;
    type RenderNoDataTemplate = import('ojs/ojvcomponent').TemplateSlot<{}>;
    type ItemTemplateContext<K extends string | number, D> = ListItemContext<K, D>;
    type RenderItemTemplate<K extends string | number, D> = import('ojs/ojvcomponent').TemplateSlot<ListItemContext<K, D>>;
    type SkeletonTemplateContext = _CCardViewElementTypes._SkeletonTemplateContext;
    type RenderSkeletonTemplate = import('ojs/ojvcomponent').TemplateSlot<SkeletonTemplateContext>;
}
export interface CCardViewElementEventMap<K extends string | number, D> extends HTMLElementEventMap {
    'ojReorder': CCardViewElement.ojReorder<K>;
    'columnsChanged': JetElementCustomEventStrict<CCardViewElement<K, D>['columns']>;
    'currentItemChanged': JetElementCustomEventStrict<CCardViewElement<K, D>['currentItem']>;
    'dataChanged': JetElementCustomEventStrict<CCardViewElement<K, D>['data']>;
    'focusBehaviorChanged': JetElementCustomEventStrict<CCardViewElement<K, D>['focusBehavior']>;
    'gutterSizeChanged': JetElementCustomEventStrict<CCardViewElement<K, D>['gutterSize']>;
    'initialAnimationChanged': JetElementCustomEventStrict<CCardViewElement<K, D>['initialAnimation']>;
    'reorderableChanged': JetElementCustomEventStrict<CCardViewElement<K, D>['reorderable']>;
    'scrollPolicyOptionsChanged': JetElementCustomEventStrict<CCardViewElement<K, D>['scrollPolicyOptions']>;
    'selectedChanged': JetElementCustomEventStrict<CCardViewElement<K, D>['selected']>;
    'selectionModeChanged': JetElementCustomEventStrict<CCardViewElement<K, D>['selectionMode']>;
}
export interface CCardViewElementSettableProperties<K extends string | number, D> extends JetSettableProperties {
    /**
     * Specifies the exact number of columns to render. By default, CardView will determine the number of columns based on
     * width of the CardView and the width of the cards.
     */
    columns?: Props<K, D>['columns'];
    /**
     * The data source for CardView. Must be of type DataProvider.
     */
    data?: Props<K, D>['data'];
    /**
     * Specifies which focus behavior CardView should use for an item that has single focusable element during keyboard navigation.
     * When the focusBehavior is 'card', the focus will be on the root of CardView and it will do logical focus on the card. When the focusBehavior
     * is 'content', the first focusable element within the card will get focus. Note that when set to 'content', there should only be one focusable
     * element within the card. If that's not the case, a warning will be logged and the focus behavior will be reset to 'card'.
     */
    focusBehavior?: Props<K, D>['focusBehavior'];
    /**
     * Specifies size of the gutter between columns and rows.
     *
     * Possible values are: 'xs', 'sm', 'md', 'lg' and 'xl'.
     * The default value is 'sm'.
     */
    gutterSize?: Props<K, D>['gutterSize'];
    /**
     * Specify animation when cards are initially rendered.
     * Possible values are: 'slideUp' and 'slideDown
     */
    initialAnimation?: Props<K, D>['initialAnimation'];
    /**
     * The reorder option contains a subset of options for reordering items.
     *
     * <p>The following options are supported:</p>
     * <ul>
     *   <li>items: Enable or disable reordering the items within the same CardView using drag and drop or keyboard. Specify 'enabled' to enable reordering. Setting the value to <code class="prettyprint">"disabled"</code> or setting the <code class="prettyprint">"reorderable"</code> property
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
     *   <li>scroller: The css selector that locates the element in which CardView uses to determine the scroll position as well as the maximum scroll position where scroll to the end will trigger a fetch.  If not specified then the oj-c-card-view element is used.</li>
     * </ul>
     * By default, the next block of rows is fetched when the user scrolls to the end of the CardView/scroller. The fetchSize option determines how many rows are fetched in each block.
     */
    scrollPolicyOptions?: Props<K, D>['scrollPolicyOptions'];
    /**
     * The current selected items in the CardView. An empty KeySet indicates nothing is selected.
     * In addition, <a href="AllKeySetImpl.html">AllKeySetImpl</a> set
     * can be used to represent select all state.
     */
    selected?: Props<K, D>['selected'];
    /**
     * <p>The type of selection behavior that is enabled on the CardView. This attribute controls the number of selections that can be made via selection gestures at any given time.
     *
     * <p>If <code class="prettyprint">single</code> or <code class="prettyprint">multiple</code> is specified, selection gestures will be enabled, and the CardView's selection styling will be applied to all items specified by the <a href="#selected">selected</a> attribute.
     * If <code class="prettyprint">singleRequired</code> is specified, then the behavior is the same as single except that CardView will ensure there is an item selected at all times. Specifically, the user will not be able to de-selected a selected item.  And if selection is initially empty, CardView will select the first item.
     * If <code class="prettyprint">none</code> is specified, selection gestures will be disabled, and the CardView's selection styling will not be applied to any items specified by the <a href="#selected">selected</a> attribute.
     * <p>Changing the value of this attribute will not affect the value of the <a href="#selected">selected</a> attribute.
     */
    selectionMode?: Props<K, D>['selectionMode'];
}
export interface CCardViewElementSettablePropertiesLenient<K extends string | number, D> extends Partial<CCardViewElementSettableProperties<K, D>> {
    [key: string]: any;
}
export interface CardViewIntrinsicProps extends Partial<Readonly<CCardViewElementSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    currentItem?: never;
    children?: import('preact').ComponentChildren;
    /**
     * Triggered after items are reordered within CardView via drag and drop or keyboard.
     */
    onojReorder?: (value: CCardViewElementEventMap<any, any>['ojReorder']) => void;
    oncolumnsChanged?: (value: CCardViewElementEventMap<any, any>['columnsChanged']) => void;
    oncurrentItemChanged?: (value: CCardViewElementEventMap<any, any>['currentItemChanged']) => void;
    ondataChanged?: (value: CCardViewElementEventMap<any, any>['dataChanged']) => void;
    onfocusBehaviorChanged?: (value: CCardViewElementEventMap<any, any>['focusBehaviorChanged']) => void;
    ongutterSizeChanged?: (value: CCardViewElementEventMap<any, any>['gutterSizeChanged']) => void;
    oninitialAnimationChanged?: (value: CCardViewElementEventMap<any, any>['initialAnimationChanged']) => void;
    onreorderableChanged?: (value: CCardViewElementEventMap<any, any>['reorderableChanged']) => void;
    onscrollPolicyOptionsChanged?: (value: CCardViewElementEventMap<any, any>['scrollPolicyOptionsChanged']) => void;
    onselectedChanged?: (value: CCardViewElementEventMap<any, any>['selectedChanged']) => void;
    onselectionModeChanged?: (value: CCardViewElementEventMap<any, any>['selectionModeChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-card-view': CardViewIntrinsicProps;
        }
    }
}
