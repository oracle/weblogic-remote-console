define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "ojs/ojcustomelement-registry", "ojs/ojkeyset", "ojs/ojvcomponent", "preact/hooks", "./hooks/UNSAFE_useWhenReadyContext/useWhenReadyContext", "../hooks/UNSAFE_useListData/useListData", "../utils/PRIVATE_keyUtils/keySetUtils", "@oracle/oraclejet-preact/hooks/UNSAFE_useBusyStateContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useCollectionInteractionContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormVariantContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useTableViewColumnResizing", "@oracle/oraclejet-preact/UNSAFE_TableView", "./utils/TableRendererUtils", "css!oj-c/table/table-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, ojcustomelement_registry_1, ojkeyset_1, ojvcomponent_1, hooks_1, useWhenReadyContext_1, useListData_1, keySetUtils_1, UNSAFE_useBusyStateContext_1, UNSAFE_useCollectionInteractionContext_1, UNSAFE_useFormVariantContext_1, UNSAFE_useTableViewColumnResizing_1, UNSAFE_TableView_1, TableRendererUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Table = void 0;
    const _SELECTION_COLUMN_KEY = 'oj-c-table_selection';
    const _selectedDefault = {};
    const _selectionModeDefault = { row: 'none', column: 'none' };
    const _scrollPolicyOptionsDefault = { fetchSize: 25 };
    // copied from DataCollectionUtils
    const _isClickthroughDisabled = function (element) {
        return element.dataset['ojClickthrough'] === 'disabled';
    };
    // copied from DataCollectionUtils
    const _isEventClickthroughDisabled = function (event, rootElement) {
        let node = event.target;
        while (node != null && node !== rootElement) {
            if (_isClickthroughDisabled(node)) {
                return true;
            }
            node = node.parentNode;
        }
        return false;
    };
    /**
     * @classdesc
     * <h3 id="tableOverview-section">
     *   JET Table Component
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#tableOverview-section"></a>
     * </h3>
     *
     * <p>Description: The Table component presents data in a tabular format with highly interactive features.
     *
     * <h3 id="data-section">
     *   Data
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#data-section"></a>
     * </h3>
     * <p>The JET Table gets its data from a DataProvider.</p>
     *
     * <p>Example of data provider content</p>
     * <pre class="prettyprint"><code>&lt;oj-c-table data="[[dataProvider]]">&lt;/oj-c-table></code></pre>
     *
     *
     * <h3 id="coming-features-section">
     *   Coming Features
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#coming-features-section"></a>
     * </h3>
     *
     * <p>These features will be available in forthcoming versions</p>
     * <ul>
     *     <li>Sorting</li>
     *     <li>Drag and Drop</li>
     *     <li>Editing</li>
     *     <li>Add Row</li>
     *     <li>Page Scrolling</li>
     *     <li>First Selected Row</li>
     *     <li>Sticky Columns</li>
     *     <li>Edge To Edge Padding</li>
     *     <li>Tree Data</li>
     *     <li>Context menu</li>
     *     <li>Per Row Selectable</li>
     *     <li>Group By Table</li>
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
     *       <td rowspan="18" style="vertical-align:top;">Data Cell</td>
     *       <td>Tab</td>
     *       <td>Move browser focus to next tab stop on the page.</td>
     *     </tr>
     *     <tr>
     *       <td>Shift + Tab</td>
     *       <td>Move browser focus to previous tab stop on the page.</td>
     *     </tr>
     *     <tr>
     *       <td>F2</td>
     *       <td>If there is focusable content in the current cell, move browser focus to the first focusable element in the current cell. No action otherwise.</td>
     *     </tr>
     *     <tr>
     *       <td>Esc</td>
     *       <td>No action.</td>
     *     </tr>
     *     <tr>
     *       <td>Up Arrow</td>
     *       <td>Focus the cell above the current cell.</td>
     *     </tr>
     *     <tr>
     *       <td>Down Arrow</td>
     *       <td>Focus the cell below the current cell.</td>
     *     </tr>
     *     <tr>
     *       <td>Left Arrow</td>
     *       <td>Focus the cell to the left of the current cell.</td>
     *     </tr>
     *     <tr>
     *       <td>Right Arrow</td>
     *       <td>Focus the cell to the right of the current cell.</td>
     *     </tr>
     *     <tr>
     *       <td>Shift + Up Arrow</td>
     *       <td>If multiple row selection is enabled, begin or extend a range selection to include the next row in the given direction without changing the currently focused cell. If multipleToggle row selection is enabled, begin or extend a range selection to include the next row in the given direction while also changing the currently focused cell. No action otherwise.</td>
     *     </tr>
     *     <tr>
     *       <td>Shift + Down Arrow</td>
     *       <td>If multiple row selection is enabled, begin or extend a range selection to include the next row in the given direction without changing the currently focused cell. If multipleToggle row selection is enabled, begin or extend a range selection to include the next row in the given direction while also changing the currently focused cell. No action otherwise.</td>
     *     </tr>
     *     <tr>
     *       <td>Space</td>
     *       <td>If row selection is enabled, toggle the selection state of the current row. Additionally, if row actions are enabled, trigger an ojRowAction event. No action otherwise.</td>
     *     </tr>
     *     <tr>
     *       <td>Enter</td>
     *       <td>If there is focusable content in the current cell, move browser focus to the first focusable element in the current cell. Additionally, if row actions are enabled, trigger an ojRowAction event. No action otherwise.</td>
     *     </tr>
     *     <tr>
     *       <td>Page Up</td>
     *       <td>Focus the corresponding cell in the first visible data row and scroll to make that data row the last visible data row of the table if possible.</td>
     *     </tr>
     *     <tr>
     *       <td>Page Down</td>
     *       <td>Focus the corresponding cell in the last visible data row and scroll to make that data row the first visible data row of the table if possible.</td>
     *     </tr>
     *     <tr>
     *       <td>Home</td>
     *       <td>Focus the first cell in the current row.</td>
     *     </tr>
     *     <tr>
     *       <td>End</td>
     *       <td>Focus the last cell in the current row.</td>
     *     </tr>
     *     <tr>
     *       <td>Ctrl/Cmd + Home</td>
     *       <td>Focus the first cell in the first row.</td>
     *     </tr>
     *     <tr>
     *       <td>Ctrl/Cmd + End</td>
     *       <td>Focus the last cell in the last available row.</td>
     *     </tr>
     *
     *     <tr>
     *       <td rowspan="18" style="vertical-align:top;">Header Cell</td>
     *       <td>Tab</td>
     *       <td>Move browser focus to next tab stop on the page.</td>
     *     </tr>
     *     <tr>
     *       <td>Shift + Tab</td>
     *       <td>Move browser focus to previous tab stop on the page.</td>
     *     </tr>
     *     <tr>
     *       <td>F2</td>
     *       <td>If there is focusable content in the current header cell, move browser focus to the first focusable element in the current header cell. No action otherwise.</td>
     *     </tr>
     *     <tr>
     *       <td>Esc</td>
     *      <td>No action.</td>
     *     </tr>
     *     <tr>
     *       <td>Up Arrow</td>
     *       <td>No action.</td>
     *     </tr>
     *     <tr>
     *       <td>Down Arrow</td>
     *       <td>Focus the cell below the current cell.</td>
     *     </tr>
     *     <tr>
     *       <td>Left Arrow</td>
     *       <td>Focus the header cell to the left of the current cell.</td>
     *     </tr>
     *     <tr>
     *       <td>Right Arrow</td>
     *       <td>Focus the header cell to the right of the current cell.</td>
     *     </tr>
     *     <tr>
     *       <td>Shift + Left Arrow</td>
     *       <td>If multiple column selection is enabled, begin or extend a range selection to include the next column in the given direction without changing the currently focused header cell. No action otherwise.</td>
     *     </tr>
     *     <tr>
     *       <td>Shift + Right Arrow</td>
     *       <td>If multiple column selection is enabled, begin or extend a range selection to include the next column in the given direction without changing the currently focused header cell. No action otherwise.</td>
     *     </tr>
     *     <tr>
     *       <td>Space</td>
     *       <td>If column selection is enabled and the current column is selectable, toggle the selection state of the current column. No action otherwise.</td>
     *     </tr>
     *     <tr>
     *       <td>Enter</td>
     *       <td>If there is focusable content in the current header cell, move browser focus to the first focusable element in the current header cell. No action otherwise.</td>
     *     </tr>
     *     <tr>
     *       <td>Page Up</td>
     *       <td>Focus the corresponding cell in the first visible data row and scroll to make that data row the last visible data row of the table if possible.</td>
     *     </tr>
     *     <tr>
     *       <td>Page Down</td>
     *       <td>Focus the corresponding cell in the last visible data row and scroll to make that data row the first visible data row of the table if possible.</td>
     *     </tr>
     *     <tr>
     *       <td>Home</td>
     *       <td>Focus the first header cell.</td>
     *     </tr>
     *     <tr>
     *       <td>End</td>
     *       <td>Focus the last header cell.</td>
     *     </tr>
     *     <tr>
     *       <td>Ctrl/Cmd + Home</td>
     *       <td>Focus the first cell in the first row.</td>
     *     </tr>
     *     <tr>
     *       <td>Ctrl/Cmd + End</td>
     *       <td>Focus the last cell in the last available row.</td>
     *     </tr>
     *
     *
     *     <tr>
     *       <td rowspan="18" style="vertical-align:top;">Footer Cell</td>
     *       <td>Tab</td>
     *       <td>Move browser focus to next tab stop on the page.</td>
     *     </tr>
     *     <tr>
     *       <td>Shift + Tab</td>
     *       <td>Move browser focus to previous tab stop on the page.</td>
     *     </tr>
     *     <tr>
     *       <td>F2</td>
     *       <td>If there is focusable content in the current footer cell, move browser focus to the first focusable element in the current footer cell. No action otherwise.</td>
     *     </tr>
     *     <tr>
     *       <td>Esc</td>
     *       <td>No action.</td>
     *     </tr>
     *     <tr>
     *       <td>Up Arrow</td>
     *       <td>Focus the cell above the current cell.</td>
     *     </tr>
     *     <tr>
     *       <td>Down Arrow</td>
     *       <td>No action.</td>
     *     </tr>
     *     <tr>
     *       <td>Left Arrow</td>
     *       <td>Focus the footer cell to the left of the current cell.</td>
     *     </tr>
     *     <tr>
     *       <td>Right Arrow</td>
     *       <td>Focus the footer cell to the right of the current cell.</td>
     *     </tr>
     *     <tr>
     *       <td>Shift + Left Arrow</td>
     *       <td>If multiple column selection is enabled, begin or extend a range selection to include the next column in the given direction without changing the currently focused footer cell. No action otherwise.</td>
     *     </tr>
     *     <tr>
     *       <td>Shift + Right Arrow</td>
     *       <td>If multiple column selection is enabled, begin or extend a range selection to include the next column in the given direction without changing the currently focused footer cell. No action otherwise.</td>
     *     </tr>
     *     <tr>
     *       <td>Space</td>
     *       <td>If column selection is enabled and the current column is selectable, toggle the selection state of the current column. No action otherwise.</td>
     *     </tr>
     *    <tr>
     *       <td>Enter</td>
     *       <td>If there is focusable content in the current footer cell, move browser focus to the first focusable element in the current footer cell. No action otherwise.</td>
     *     </tr>
     *     <tr>
     *       <td>Page Up</td>
     *       <td>Focus the corresponding cell in the first visible data row and scroll to make that data row the last visible data row of the table if possible.</td>
     *     </tr>
     *     <tr>
     *       <td>Page Down</td>
     *       <td>Focus the corresponding cell in the last visible data row and scroll to make that data row the first visible data row of the table if possible.</td>
     *     </tr>
     *     <tr>
     *       <td>Home</td>
     *       <td>Focus the first footer cell.</td>
     *     </tr>
     *     <tr>
     *       <td>End</td>
     *       <td>Focus the last footer cell.</td>
     *     </tr>
     *     <tr>
     *       <td>Ctrl/Cmd + Home</td>
     *       <td>Focus the first cell in the first row.</td>
     *     </tr>
     *     <tr>
     *       <td>Ctrl/Cmd + End</td>
     *       <td>Focus the last cell in the last available row.</td>
     *     </tr>
     *
     *
     *     <tr>
     *       <td rowspan="10" style="vertical-align:top;">No Data Cell</td>
     *       <td>Tab</td>
     *       <td>Move browser focus to next tab stop on the page.</td>
     *     </tr>
     *     <tr>
     *       <td>Shift + Tab</td>
     *       <td>Move browser focus to previous tab stop on the page.</td>
     *     </tr>
     *     <tr>
     *       <td>F2</td>
     *       <td>If there is focusable content in the no data cell, move browser focus to the first focusable element in the no data cell. No action otherwise.</td>
     *     </tr>
     *     <tr>
     *       <td>Esc</td>
     *       <td>No action.</td>
     *     </tr>
     *     <tr>
     *       <td>Up Arrow</td>
     *       <td>Focus the first header cell.</td>
     *     </tr>
     *     <tr>
     *       <td>Down Arrow</td>
     *       <td>If footer cells are rendered, focus the first footer cell. No action otherwise.</td>
     *     </tr>
     *     <tr>
     *       <td>Left Arrow</td>
     *       <td>No action.</td>
     *     </tr>
     *     <tr>
     *       <td>Right Arrow</td>
     *       <td>No action.</td>
     *     </tr>
     *     <tr>
     *       <td>Space</td>
     *       <td>No action.</td>
     *     </tr>
     *     <tr>
     *       <td>Enter</td>
     *       <td>If there is focusable content in the no data cell, move browser focus to the first focusable element in the no data cell. No action otherwise.</td>
     *     </tr>
     *
     *
     *     <tr>
     *       <td rowspan="18" style="vertical-align:top;">Focused Cell Content</td>
     *       <td>Tab</td>
     *       <td>Move browser focus to the next focusable element in the table. If that element is already focused, move browser focus to the first focusable element in the table.</td>
     *     </tr>
     *     <tr>
     *       <td>Shift + Tab</td>
     *       <td>Move browser focus to the previous focusable element in the table. If that element is already focused, move browser focus to the last focusable element in the table.</td>
     *     </tr>
     *     <tr>
     *       <td>F2</td>
     *       <td>Restore focus to the current cell.</td>
     *     </tr>
     *     <tr>
     *       <td>Esc</td>
     *       <td>Restore focus to the current cell.</td>
     *     </tr>
     *     <tr>
     *       <td>Space</td>
     *       <td>No action.</td>
     *     </tr>
     *     <tr>
     *       <td>Enter</td>
     *       <td>No action.</td>
     *     </tr>
     *
     *   </tbody>
     * </table>
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
     *       <td rowspan="1" style="vertical-align:top;">
     *         Data Cell
     *       </td>
     *       <td>Tap</td>
     *       <td>Focus the data cell. Additionally, if row selection is enabled and the current row is selectable, toggle the selection state of the current row. Additionally, if row actions are enabled, trigger an ojRowAction event.</td>
     *     </tr>
     *     <tr>
     *       <td rowspan="1" style="vertical-align:top;">
     *         Header Cell
     *       </td>
     *       <td>Tap</td>
     *       <td>Focus the header cell. Additionally, if column selection is enabled and the current column is selectable, toggle the selection state of the current column.</td>
     *     </tr>
     *     <tr>
     *       <td rowspan="1" style="vertical-align:top;">
     *         Footer Cell
     *       </td>
     *       <td>Tap</td>
     *       <td>Focus the footer cell. Additionally, if column selection is enabled and the current column is selectable, toggle the selection state of the current column.</td>
     *     </tr>
     *     <tr>
     *       <td rowspan="1" style="vertical-align:top;">
     *         No Data Cell
     *       </td>
     *       <td>Tap</td>
     *       <td>Focus the no data cell.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>The Table implements the grid role for accessibility. This enables the Table to be compatible with the special 'table
     * reading' commands that most assistive technologies provide in addition to the standard keyboard interactions described
     * in the Keyboard End User Information section above.</p>
     *
     * <p>An application is required to include contextual information to make the Table accessible for assistive technologies
     * by providing one or more the following properties as appropriate:</p>
     *
     * <ul>
     *   <li>aria-labelledby</li>
     *   <li>aria-label</li>
     * </ul>
     *
     * <p>Additionally, an application should specify at least 1 accessible row header per row by providing a value for the
     * <code>row.accessible-row-header</code> attribute. The information in the cell(s) specified will be used by assistive technologies
     * to convey basic contextual information for the focused row. For example, if a user is arrowing up or down in an 'Amount Due'
     * column, having something like '$500' read out does not provide any helpful information as to who or what that amount corresponds
     * to. If an 'Account Holder' column is specified as an accessible row header, then something like 'Larry Ellison, $500' would be read
     * out instead. Providing this additional row context is essential for creating accessible tables.</p>
     *
     * <h4>Managing Tab Stops</h4>
     * <p>The Table does not manipulate the <code>tabindex</code> attribute of cell contents. For oj-c components specified
     * as children of the Table, <code>tabindex</code> management will happen automatically. Otherwise, applications must
     * specifically set the <code>tabindex</code> of tabbable child elements based on the <code>isTabbable</code> property
     * of the template context.</p>
     * <p>However, there may be cases where applications do not have access to the tabbable elements themselves. For
     * example, a third-party component that does not support JET's new <code>tabindex</code> management. In that case,
     * applications can specify the <code>data-oj-manage-tabs</code> attribute on any tabbable elements (or any one of
     * their ancestors) to ensure the Table remains a single tab stop for accessibility purposes.</p>
     *
     * <h4>Custom Colors</h4>
     * <p>Using colors, including background and text colors, is not accessible if it is the only way information is conveyed.
     * Low vision users may not be able to see the different colors, and in high contrast mode the colors are removed.
     * The Redwood approved way to show status is to use a badge.</p>
     *
     * <h3 id="background-section">
     *   Background Color
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#background-section"></a>
     * </h3>
     *
     * <p>The Table's background color is managed via the --oj-current-bg-color CSS variable. If a different
     * background color is desired, one can be set by adding a background color class on the Table. <b>The Table does
     * not support background colors with transparencies.</b> See the 'Background Color' cookbook demo for examples.
     * </p>
     *
     * <h3 id="data-attributes-section">
     *   Custom Data Attributes
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#data-attributes-section"></a>
     * </h3>
     *
     * <p>Table supports the following custom data attributes.
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Name</th>
     *       <th>Description</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td><kbd>data-oj-as</kbd></td>
     *       <td><p>Provides an alias for a specific template instance and has the same subproperties as the $current variable.</p>
     *         <pre class="prettyprint"><code>&lt;oj-c-table id="table">
     *   &lt;template slot="cellTemplate" data-oj-as="cell">
     *   &lt;/template>
     * &lt;/oj-c-table></code></pre>
     *       </td>
     *     </tr>
     *     <tr>
     *       <td><kbd>data-oj-clickthrough</kbd></td>
     *       <td><p>Specify on any element inside a cell where you want to control whether the Table should perform actions triggered
     *         by a click event originating from the element or one of its descendants.</p>
     *         <p>For example, if you specify this attribute with a value of "disabled" on a button inside a cell, the Table
     *         will not select the row or trigger an action event when a user clicks on the button.</p>
     *         <pre class="prettyprint"><code>&lt;oj-c-table id="table">
     *   &lt;template slot="cellTemplate">
     *     &lt;oj-c-button data-oj-clickthrough="disabled">&lt;/oj-c-button>
     *   &lt;/template>
     * &lt;/oj-c-table></code></pre>
     *       </td>
     *     </tr>
     *     <tr>
     *       <td><kbd>data-oj-manage-tabs</kbd></td>
     *       <td><p>The Table does not manipulate the <code>tabindex</code> attribute of cell contents. For oj-c elements
     *         specified as children of the Table, <code>tabindex</code> management will happen automatically. Otherwise,
     *         applications must specifically set the <code>tabindex</code> of tabbable child elements based on the
     *         <code>isTabbable</code> property of the template context.</p>
     *         <p>However, there may be cases where applications do not have access to the tabbable elements themselves. For
     *         example, a third-party component that does not support JET's new <code>tabindex</code> management. In that case,
     *         applications can specify the <code>data-oj-manage-tabs</code> attribute on any tabbable elements (or any one
     *         of their ancestors) to ensure the Table remains a single tab stop for accessibility purposes.</p>
     *         <pre class="prettyprint"><code>&lt;oj-c-table>
     *   &lt;template slot="cellTemplate1" data-oj-as="cell">
     *     &lt;a href="#" :tabindex="[[cell.isTabbable ? 0 : -1]]">Link&lt;/a>
     *   &lt;/template>
     *   &lt;template slot="cellTemplate2" data-oj-as="cell">
     *     &lt;some-tabbable-component data-oj-manage-tabs>&lt;/some-tabbable-component>
     *   &lt;/template>
     * &lt;/oj-c-table></code></pre>
     *       </td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojmetadata displayName "Table"
     * @ojmetadata description "A table displays data items in a tabular format with highly interactive features."
     * @ojmetadata help "oj-c.Table.html"
     * @ojmetadata main "oj-c/table"
     * @ojmetadata status [
     *   {
     *     type: "candidate",
     *     since: "17.1.0"
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Collections"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/table",
     *     "defaultColumns": 12,
     *     "minColumns": 2,
     *   },
     *   "oracle": {
     *     "uxSpecs": ["table"],
     *     "icon" : "oj-ux-ico-tables-basic"
     *   }
     * }
     *
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "selectionMode.row",
     *       "selectionMode.column",
     *       "horizontalGridVisible",
     *       "verticalGridVisible"
     *     ]
     *   },
     *   {
     *     "propertyGroup": "data",
     *     "items": [
     *       "data",
     *       "columns",
     *       "selected.row",
     *       "selected.column"
     *     ]
     *   }
     * ]
     * @ojmetadata since "17.1.0"
     */
    function TableImpl({ 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, id, data, columns, row, horizontalGridVisible = 'enabled', verticalGridVisible = 'disabled', layout = 'contents', currentCellOverride, onCurrentCellChanged, selected = _selectedDefault, selectionMode = _selectionModeDefault, onSelectedChanged, selectAllControl = 'visible', columnOrder, cellTemplate, headerTemplate, footerTemplate, templates, onOjRowAction, noData, columnWidths, onColumnWidthsChanged, columnResizeBehavior = 'redistribute', scrollPolicyOptions = _scrollPolicyOptionsDefault }) {
        const rootRef = (0, hooks_1.useRef)(null);
        const tableViewRef = (0, hooks_1.useRef)(null);
        const isClickthroughDisabled = (0, hooks_1.useCallback)((target) => {
            if (target == null || rootRef.current == null) {
                return false;
            }
            return _isEventClickthroughDisabled({ target }, rootRef.current);
        }, []);
        const [listDataState, onLoadRange] = (0, useListData_1.useListData)(data, {
            fetchSize: scrollPolicyOptions?.fetchSize
        });
        // At this point, core-pack supports just loadMoreOnScroll
        const onLoadMore = (0, hooks_1.useCallback)(() => {
            if (listDataState.status === 'success' && listDataState.data && onLoadRange) {
                const fetchSize = scrollPolicyOptions && scrollPolicyOptions.fetchSize != null
                    ? scrollPolicyOptions.fetchSize
                    : 25;
                onLoadRange({ offset: 0, count: listDataState.data.data.length + fetchSize });
            }
        }, [listDataState, onLoadRange, scrollPolicyOptions]);
        const hasMore = listDataState.status === 'loading' ||
            (listDataState.status === 'success' && listDataState.data.sizePrecision === 'atLeast');
        const isMultipleRowSelection = selectionMode?.row === 'multiple' || selectionMode?.row === 'multipleToggle';
        const [realizedColumnWidths, setRealizedColumnWidths] = (0, hooks_1.useState)(() => {
            const preactColumnWidths = { ...columnWidths };
            if (isMultipleRowSelection) {
                preactColumnWidths[_SELECTION_COLUMN_KEY] = 36;
            }
            return preactColumnWidths;
        });
        (0, hooks_1.useEffect)(() => {
            const updated = { ...columnWidths };
            if (isMultipleRowSelection) {
                updated[_SELECTION_COLUMN_KEY] = 36;
            }
            setRealizedColumnWidths(updated);
        }, [columnWidths, isMultipleRowSelection]);
        // add a keydown handler to handle spacebar on select all column header
        const handleKeyDown = (0, hooks_1.useCallback)((event) => {
            if (event.key === ' ') {
                const targetElement = event.target;
                if (targetElement.children.length > 0 &&
                    targetElement.children[0].dataset['ojTableSelector'] === 'all' &&
                    !event.repeat) {
                    let newRowSelection;
                    if (selected.row?.isAddAll() && selected.row.keys.deletedKeys?.size === 0) {
                        newRowSelection = new ojkeyset_1.KeySetImpl();
                    }
                    else {
                        newRowSelection = new ojkeyset_1.AllKeySetImpl();
                    }
                    onSelectedChanged({
                        row: newRowSelection,
                        column: new ojkeyset_1.KeySetImpl()
                    });
                }
            }
        }, [onSelectedChanged, selected]);
        const selectAllHandlerProps = isMultipleRowSelection && selectAllControl !== 'hidden' ? { onKeyDown: handleKeyDown } : {};
        const preactColumnOrder = (0, hooks_1.useMemo)(() => {
            const newColumnOrder = [];
            let hasSelectorColumn = false;
            if (isMultipleRowSelection) {
                newColumnOrder.push(_SELECTION_COLUMN_KEY);
                hasSelectorColumn = true;
            }
            if (columns != null) {
                if (columnOrder != null) {
                    for (const key of columnOrder) {
                        // don't allow for duplicate column keys to be specified
                        if (columns[key] != null && !newColumnOrder.includes(key)) {
                            newColumnOrder.push(key);
                        }
                    }
                }
                else {
                    for (const [key] of Object.entries(columns)) {
                        if (key !== _SELECTION_COLUMN_KEY) {
                            newColumnOrder.push(key);
                        }
                    }
                }
            }
            // don't include columns if only the selector column is present
            return newColumnOrder.length === 1 && hasSelectorColumn ? [] : newColumnOrder;
        }, [columnOrder, columns, isMultipleRowSelection]);
        const preactColumns = (0, hooks_1.useMemo)(() => {
            const preactColumns = {};
            if (columns != null) {
                if (isMultipleRowSelection) {
                    preactColumns[_SELECTION_COLUMN_KEY] = {
                        sticky: 'enabled',
                        selectable: 'disabled',
                        renderer: TableRendererUtils_1.tableCellSelectorRenderer,
                        headerRenderer: selectAllControl !== 'hidden' ? TableRendererUtils_1.tableHeaderSelectorRenderer : undefined,
                        padding: 'disabled',
                        headerPadding: 'disabled',
                        tooltip: 'disabled',
                        headerTooltip: 'disabled',
                        accessibleColumnHeader: 'disabled'
                    };
                }
                Object.keys(columns).forEach((key) => {
                    // js doesn't allow object.keys to be typed as C
                    const colKey = key;
                    const column = columns[colKey];
                    const cellRenderer = column.template && templates && templates[column.template]
                        ? (0, TableRendererUtils_1.getPreactCellRenderer)(templates[column.template], column.field)
                        : (0, TableRendererUtils_1.getPreactCellRenderer)(cellTemplate, column.field);
                    const headerCellRenderer = column.headerTemplate && templates && templates[column.headerTemplate]
                        ? (0, TableRendererUtils_1.getPreactHeaderRenderer)(templates[column.headerTemplate])
                        : (0, TableRendererUtils_1.getPreactHeaderRenderer)(headerTemplate);
                    const footerCellRenderer = column.footerTemplate && templates && templates[column.footerTemplate]
                        ? (0, TableRendererUtils_1.getPreactFooterRenderer)(templates[column.footerTemplate])
                        : (0, TableRendererUtils_1.getPreactFooterRenderer)(footerTemplate);
                    const headerText = column.headerText ?? undefined;
                    const footerText = column.footerText ?? undefined;
                    const maxWidth = column.maxWidth ?? undefined;
                    const minWidth = column.minWidth ?? undefined;
                    const weight = column.weight ?? undefined;
                    let padding;
                    const columnPadding = column.padding;
                    if (typeof columnPadding === 'function') {
                        padding = (context) => {
                            const internalContext = (0, TableRendererUtils_1.getRowContext)(context);
                            return columnPadding(internalContext);
                        };
                    }
                    else {
                        padding = columnPadding ?? 'enabled';
                    }
                    const headerPadding = column.headerPadding ?? 'enabled';
                    const footerPadding = column.footerPadding ?? 'enabled';
                    let tooltip;
                    const columnTooltip = column.tooltip;
                    if (typeof columnTooltip === 'function') {
                        tooltip = (context) => {
                            const internalContext = (0, TableRendererUtils_1.getRowContext)(context);
                            return columnTooltip(internalContext);
                        };
                    }
                    else {
                        tooltip = columnTooltip ?? 'enabled';
                    }
                    const headerTooltip = column.headerTooltip ?? 'enabled';
                    const footerTooltip = column.footerTooltip ?? 'enabled';
                    const sticky = column.sticky ?? 'disabled';
                    const horizontalAlignment = column.horizontalAlignment ?? 'start';
                    const resizable = column.resizable ?? 'disabled';
                    let edgeResizable = resizable;
                    if (resizable === 'enabled' && columnResizeBehavior === 'redistribute') {
                        // if last column, edgeResizable is disabled
                        const position = preactColumnOrder.indexOf(colKey);
                        const isLastColumn = position === preactColumnOrder.length - 1;
                        const nextColumnKey = !isLastColumn ? preactColumnOrder[position + 1] : undefined;
                        const nextColumnResizable = nextColumnKey != null ? columns[nextColumnKey]?.resizable : undefined;
                        edgeResizable =
                            isLastColumn || nextColumnResizable !== 'enabled' ? 'disabled' : 'enabled';
                    }
                    preactColumns[colKey] = {
                        headerText: headerText,
                        footerText: footerText,
                        renderer: cellRenderer,
                        headerRenderer: headerCellRenderer,
                        footerRenderer: footerCellRenderer,
                        maxWidth,
                        minWidth,
                        weight,
                        padding,
                        headerPadding,
                        footerPadding,
                        tooltip,
                        headerTooltip,
                        footerTooltip,
                        sticky,
                        horizontalAlignment,
                        resizable,
                        edgeResizable
                    };
                });
            }
            return preactColumns;
        }, [
            columns,
            cellTemplate,
            headerTemplate,
            footerTemplate,
            selectAllControl,
            templates,
            isMultipleRowSelection,
            columnResizeBehavior,
            preactColumnOrder
        ]);
        const preactData = listDataState.status === 'success' ? listDataState?.data?.data || [] : [];
        const preactGetAccessibleRowHeaders = (preactContext) => {
            const internalContext = (0, TableRendererUtils_1.getRowContext)(preactContext);
            const rowHeaders = new Set();
            if (row != null && row.accessibleRowHeader != null) {
                if (typeof row.accessibleRowHeader === 'string') {
                    rowHeaders.add(row.accessibleRowHeader);
                }
                else if (Array.isArray(row.accessibleRowHeader)) {
                    row.accessibleRowHeader.forEach((header) => rowHeaders.add(header));
                }
                else if (typeof row.accessibleRowHeader === 'function') {
                    const result = row.accessibleRowHeader(internalContext);
                    if (typeof result === 'string') {
                        rowHeaders.add(result);
                    }
                    else if (Array.isArray(result)) {
                        result.forEach((header) => rowHeaders.add(header));
                    }
                }
            }
            else if (preactColumnOrder.length > 0) {
                // column order is only populated if at least 1 non-selector columns is valid
                if (isMultipleRowSelection) {
                    rowHeaders.add(preactColumnOrder[1]);
                }
                else {
                    rowHeaders.add(preactColumnOrder[0]);
                }
            }
            return rowHeaders;
        };
        const preactOnRowAction = (0, hooks_1.useCallback)((eventDetail) => {
            if (onOjRowAction && eventDetail != null && !isClickthroughDisabled(eventDetail.target)) {
                onOjRowAction({ context: (0, TableRendererUtils_1.getRowContext)(eventDetail.context) });
            }
        }, [onOjRowAction, isClickthroughDisabled]);
        const gridlines = (0, hooks_1.useMemo)(() => ({
            horizontal: horizontalGridVisible === 'enabled' ? 'visible' : 'hidden',
            vertical: verticalGridVisible === 'enabled' ? 'visible' : 'hidden'
        }), [horizontalGridVisible, verticalGridVisible]);
        const noDataRenderer = (0, hooks_1.useMemo)(() => {
            return (0, TableRendererUtils_1.getPreactNoDataRenderer)(noData);
        }, [noData]);
        const preactSelected = (0, hooks_1.useMemo)(() => {
            return selected
                ? {
                    row: selected.row ? (0, keySetUtils_1.keySetToKeys)(selected.row) : undefined,
                    column: selected.column ? (0, keySetUtils_1.keySetToKeys)(selected.column) : undefined
                }
                : undefined;
        }, [selected]);
        const preactOnSelectionChange = (0, hooks_1.useCallback)((detail) => {
            if (!isClickthroughDisabled(detail.target)) {
                const value = detail.value;
                const rowKeySet = value.row
                    ? (0, keySetUtils_1.keysToKeySet)(value.row)
                    : undefined;
                const columnKeySet = value.column
                    ? (0, keySetUtils_1.keysToKeySet)(value.column)
                    : undefined;
                // cast as ImmutableKeySet<C> since the default selector column does not support selection
                onSelectedChanged({
                    row: rowKeySet,
                    column: columnKeySet
                });
            }
        }, [onSelectedChanged, isClickthroughDisabled]);
        const onPersistCurrentCell = (0, hooks_1.useCallback)((detail) => {
            if (onCurrentCellChanged) {
                onCurrentCellChanged(detail.value);
            }
        }, [onCurrentCellChanged]);
        const preactContextMenuConfig = (0, hooks_1.useMemo)(() => {
            return {
                itemsRenderer: (context) => {
                    return context.defaultMenuItems;
                }
            };
        }, []);
        const busyStateContext = (0, hooks_1.useContext)(UNSAFE_useBusyStateContext_1.BusyStateContext);
        const childBusyStateContext = (0, useWhenReadyContext_1.useWhenReadyContext)(tableViewRef);
        const resolveDataBusyStateRef = (0, hooks_1.useRef)();
        const resolveContentBusyStateRef = (0, hooks_1.useRef)();
        const [isInitialLoading, setIsInitialLoading] = (0, hooks_1.useState)(layout === 'contents');
        const isInitialLoadingRef = (0, hooks_1.useRef)(isInitialLoading);
        (0, hooks_1.useEffect)(() => {
            if (listDataState.status === 'loading') {
                // if loading, create a new data busy state
                resolveDataBusyStateRef.current = busyStateContext.addBusyState('loading data');
            }
            else {
                // only create children busy state on initial load of contents layout
                if (isInitialLoadingRef.current) {
                    resolveContentBusyStateRef.current = busyStateContext.addBusyState('content initializing');
                    childBusyStateContext.whenReady().then(function () {
                        // resolve the child busy state once content is ready for sizing
                        if (resolveContentBusyStateRef.current) {
                            resolveContentBusyStateRef.current();
                            resolveContentBusyStateRef.current = undefined;
                        }
                        setIsInitialLoading(false);
                        isInitialLoadingRef.current = false;
                    });
                }
            }
            return () => {
                // clear busy states to ensure no orphaned busy states persist on unmount
                if (resolveDataBusyStateRef.current) {
                    resolveDataBusyStateRef.current();
                    resolveDataBusyStateRef.current = undefined;
                }
                if (resolveContentBusyStateRef.current) {
                    resolveContentBusyStateRef.current();
                    resolveContentBusyStateRef.current = undefined;
                }
            };
        }, [listDataState.status, busyStateContext, childBusyStateContext]);
        const handleColumnWidthsChange = (0, hooks_1.useCallback)((newWidths) => {
            setRealizedColumnWidths(newWidths);
            if (onColumnWidthsChanged) {
                onColumnWidthsChanged(newWidths);
            }
        }, [onColumnWidthsChanged]);
        const handleColumnResizing = (0, hooks_1.useCallback)((newWidths) => {
            setRealizedColumnWidths(newWidths);
        }, []);
        const { columnResizingProps } = (0, UNSAFE_useTableViewColumnResizing_1.useTableViewColumnResizing)({
            columnOrder: preactColumnOrder,
            columnWidths: realizedColumnWidths,
            onColumnWidthsChanging: handleColumnResizing,
            onColumnWidthsChange: handleColumnWidthsChange,
            resizeBehavior: columnResizeBehavior
        });
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: id, ref: rootRef, children: (0, jsx_runtime_1.jsx)("div", { ref: tableViewRef, "data-oj-context": true, ...selectAllHandlerProps, ...(cellTemplate ? { 'data-oj-ct': true } : {}), ...(headerTemplate ? { 'data-oj-ht': true } : {}), ...(footerTemplate ? { 'data-oj-ft': true } : {}), ...(noData ? { 'data-oj-ndt': true } : {}), style: "display: contents;", children: (0, jsx_runtime_1.jsx)(UNSAFE_useFormVariantContext_1.FormVariantContext.Provider, { value: 'embedded', children: (0, jsx_runtime_1.jsx)(ojvcomponent_1.ReportBusyContext.Provider, { value: tableViewRef, children: (0, jsx_runtime_1.jsx)(UNSAFE_TableView_1.TableView, { "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, columns: preactColumns, contextMenuConfig: preactContextMenuConfig, data: preactData, getRowKey: TableRendererUtils_1.getPreactRowKey, getAccessibleRowHeaders: preactGetAccessibleRowHeaders, gridlines: gridlines, layout: isInitialLoading ? 'pending' : layout, selected: preactSelected, selectionMode: selectionMode, onSelectionChange: preactOnSelectionChange, columnOrder: preactColumnOrder, onRowAction: preactOnRowAction, noDataRenderer: noDataRenderer, onLoadMore: onLoadMore, hasMore: hasMore, currentCellOverride: currentCellOverride, onPersistCurrentCell: onPersistCurrentCell, width: '100%', ...columnResizingProps }) }) }) }) }));
    }
    // register oj-c-table custom element
    // **** must run BEFORE the user assistance density update below ****
    // This custom element supports generic parameters, but was introduced before the pattern for exposing
    // generic parameters on the functional value-based element was established.  In order to introduce the generics in
    // a backwards-compatible way, they must be defaulted, but we don't want the defaults to be added to the existing
    // types which had generics from the start.  The solution is to use two consts:
    //   * the first is not exported, but is used as the basis for the custom element types and does not default its generics
    //   * the second is the exported functional value-based element and defaults the generics for backwards compatibility
    const TableWithoutDefaultedGenerics = (0, ojvcomponent_1.registerCustomElement)('oj-c-table', TableImpl, "Table", { "properties": { "layout": { "type": "string", "enumValues": ["fixed", "contents"] }, "data": { "type": "DataProvider" }, "columns": { "type": "object" }, "row": { "type": "object", "properties": { "accessibleRowHeader": { "type": "string|Array<string>|function" } } }, "horizontalGridVisible": { "type": "string", "enumValues": ["disabled", "enabled"] }, "verticalGridVisible": { "type": "string", "enumValues": ["disabled", "enabled"] }, "selected": { "type": "object", "properties": { "column": { "type": "object" }, "row": { "type": "object" } }, "writeback": true }, "selectionMode": { "type": "object", "properties": { "column": { "type": "string", "enumValues": ["none", "multiple", "single"] }, "row": { "type": "string", "enumValues": ["none", "multiple", "single", "multipleToggle"] } } }, "selectAllControl": { "type": "string", "enumValues": ["hidden", "visible"] }, "columnOrder": { "type": "Array<string>", "writeback": true }, "currentCellOverride": { "type": "object" }, "currentCell": { "type": "object", "readOnly": true, "writeback": true }, "columnWidths": { "type": "object", "writeback": true }, "scrollPolicyOptions": { "type": "object", "properties": { "fetchSize": { "type": "number" } } }, "columnResizeBehavior": { "type": "string", "enumValues": ["add", "redistribute"] } }, "slots": { "cellTemplate": { "data": {} }, "headerTemplate": { "data": {} }, "footerTemplate": { "data": {} }, "noData": { "data": {} } }, "extension": { "_DYNAMIC_SLOT": { "prop": "templates", "isTemplate": 1 }, "_WRITEBACK_PROPS": ["selected", "columnOrder", "currentCell", "columnWidths"], "_READ_ONLY_PROPS": ["currentCell"], "_OBSERVED_GLOBAL_PROPS": ["aria-label", "aria-labelledby", "id"] }, "events": { "ojRowAction": { "bubbles": true } } }, { "horizontalGridVisible": "enabled", "verticalGridVisible": "disabled", "layout": "contents", "selected": {}, "selectionMode": { "row": "none", "column": "none" }, "selectAllControl": "visible", "columnResizeBehavior": "redistribute", "scrollPolicyOptions": { "fetchSize": 25 } }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useCollectionInteractionContext_1.CollectionInteractionContext] });
    exports.Table = TableWithoutDefaultedGenerics;
    // propagate 'compact' userAssistanceDensity defaults to underlying components
    // **** must run AFTER the custom element registration above ****
    const metadata = (0, ojcustomelement_registry_1.getMetadata)('oj-c-table');
    metadata.properties.__oj_private_do_not_use_userAssistanceDensity = {
        binding: {
            provide: [
                { name: 'containerUserAssistanceDensity', default: 'compact' },
                { name: 'userAssistanceDensity', default: 'compact' }
            ]
        }
    };
});
