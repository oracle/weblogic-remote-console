import { DataProvider, Item } from 'ojs/ojdataprovider';
import { ImmutableKeySet } from 'ojs/ojkeyset';
import { ExtendGlobalProps, Action, Bubbles, PropertyChanged, ReadOnlyPropertyChanged, ObservedGlobalProps, TemplateSlot, DynamicTemplateSlots } from 'ojs/ojvcomponent';
import { ComponentProps, ComponentChildren } from 'preact';
import 'css!oj-c/table/table-styles.css';
/**
 * Context used to specify the row of a Table.
 */
export type RowContext<K, D> = {
    /**
     * Row item containing data and metadata
     */
    item: Item<K, D>;
};
/**
 * Context passed into the cell template specified in the <code>column.template</code> property.
 */
export type CellTemplateContext<K, D, C> = {
    /**
     * Column key
     */
    columnKey: C;
    /**
     * Row item containing data and metadata
     */
    item: Item<K, D>;
    /**
     * Data for the cell, derived from the column.field property
     */
    data?: D[keyof D];
    /**
     * Whether the cell is in tabbable mode or not.
     */
    isTabbable: boolean;
};
/** @deprecated since 19.0.0 - use 'CTableElement.RenderCellTemplate instead */
export type CellTemplateContextDeprecated<K, D, C> = CellTemplateContext<K, D, C>;
/**
 * Context passed into the header template specified in the <code>column.headerTemplate</code> property.
 */
export type HeaderTemplateContext<C> = {
    /**
     * Column key
     */
    key: C;
    /**
     * Column header text
     */
    headerText?: string;
    /**
     * Whether the cell is in tabbable mode or not.
     */
    isTabbable: boolean;
};
/** @deprecated since 19.0.0 - use 'CTableElement.RenderHeaderTemplate instead */
export type HeaderTemplateContextDeprecated<C> = HeaderTemplateContext<C>;
/**
 * Context passed into the footer template specified in the <code>column.footerTemplate</code> property.
 */
export type FooterTemplateContext<C> = {
    /**
     * Column key
     */
    key: C;
    /**
     * Column footer text
     */
    footerText?: string;
    /**
     * Whether the cell is in tabbable mode or not.
     */
    isTabbable: boolean;
};
/** @deprecated since 19.0.0 - use 'CTableElement.RenderFooterTemplate instead */
export type FooterTemplateContextDeprecated<C> = FooterTemplateContext<C>;
/**
 * Context passed into the no data slot.
 */
export type NoDataContext = {
    /**
     * Whether the cell is in tabbable mode or not.
     */
    isTabbable: boolean;
};
/**
 * Detail for the row action event.
 */
type RowActionDetail<K, D> = {
    /**
     * Row context
     */
    context: RowContext<K, D>;
};
/**
 * Specifies whether padding is enabled or disabled on specific sides of a cell.
 */
type CellPadding = {
    /**
     * Specifies whether bottom padding is enabled or disabled.
     */
    bottom?: 'enabled' | 'disabled';
    /**
     * Specifies whether end padding (right in ltr locales, left in rtl locales) is enabled or disabled.
     */
    end?: 'enabled' | 'disabled';
    /**
     * Specifies whether start padding (left in ltr locales, right in rtl locales) is enabled or disabled.
     */
    start?: 'enabled' | 'disabled';
    /**
     * Specifies whether top padding is enabled or disabled.
     */
    top?: 'enabled' | 'disabled';
};
/**
 * Specifies the properties of a column.
 */
export type Column<K, D> = {
    /**
     * @ojmetadata displayName "Field"
     * @ojmetadata description "Specifies the field attribute of the row item data that is mapped to the column."
     */
    field?: keyof D;
    /**
     * @ojmetadata displayName "Header Text"
     * @ojmetadata description "Text to display in the header cell of the column."
     */
    headerText?: string;
    /**
     * @ojmetadata displayName "Footer Text"
     * @ojmetadata description "Text to display in the footer cell of the column"
     */
    footerText?: string;
    /**
     * The name of the slot used to specify the template for rendering data cells in the column.
     * The slot content must be a template element.
     * The content of the template should not include the td element, only its contents.
     * The template has access to the following context via $current or the aliased name for $current set via data-oj-as.
     *
     * @ojmetadata description "The name of the slot used to specify the template for rendering data cells in the column. See the Help documentation for more information."
     * @ojmetadata displayName "Template"
     * @ojmetadata dynamicSlotDef "CellTemplateContext"
     */
    template?: string;
    /**
     * The name of the slot used to specify the template for rendering the header cell in the column.
     * The slot content must be a template element.
     * The content of the template should not include the th element, only its contents.
     * The template has access to the following context via $current or the aliased name for $current set via data-oj-as.
     *
     * @ojmetadata description "The name of the slot used to specify the template for rendering the header cell in the column. See the Help documentation for more information."
     * @ojmetadata displayName "Header Template"
     * @ojmetadata dynamicSlotDef "HeaderTemplateContext"
     */
    headerTemplate?: string;
    /**
     * The name of the slot used to specify the template for rendering the footer cell in the column.
     * The slot content must be a template element.
     * The content of the template should not include the td element, only its contents.
     * The template has access to the following context via $current or the aliased name for $current set via data-oj-as.
     *
     * @ojmetadata description "The name of the slot used to specify the template for rendering the footer cell in the column. See the Help documentation for more information."
     * @ojmetadata displayName "Footer Template"
     * @ojmetadata dynamicSlotDef "FooterTemplateContext"
     */
    footerTemplate?: string;
    /**
     * The maximum width in pixels of the column. This value is used during initial render, and does not affect the ability to resize the column.
     * This value is applicable when either, layout='fixed' or layout='contents'.
     *
     * @ojmetadata description "The maximum width in pixels of the column. See the Help documentation for more information."
     * @ojmetadata displayName "Max Width"
     */
    maxWidth?: number;
    /**
     * The minimum width in pixels of the column. This value is used during initial render, and does not affect the ability to resize the column.
     * This value is applicable when either, layout='fixed' or layout='contents'.
     * If not set and layout='fixed' a default minimum width will be determined by the theme.
     *
     * @ojmetadata description "The minimum width in pixels of the column. See the Help documentation for more information."
     * @ojmetadata displayName "Min Width"
     */
    minWidth?: number;
    /**
     * Specifies the relative sizing weight of the column. If not set a default of 1 is assumed.
     * This must be a positive number greater than or equal to 1. Its value does not affect the ability
     * to resize the column. When the Table's layout attribute is set to <code>fixed</code>, this value
     * is used to determine the relative width of the column compared to the other columns. For example,
     * a column with a weight of 2 will have twice as much space allocated to it as a column with a weight
     * of 1. This value has no effect when the table's layout attribute is set to <code>contents</code>.
     *
     * @ojmetadata description "Specifies the relative sizing weight of the column. See the Help documentation for more information."
     * @ojmetadata displayName "Weight"
     */
    weight?: number;
    /**
     * Specifies padding for the data cells in this column. Valid string values include 'enabled' and 'disabled'. Setting either
     * 'enabled' or 'disabled' will apply to all sides of the data cells, while providing an instance of CellPadding will only
     * apply to the specified sides of the data cells.
     *
     * @ojmetadata description "Specifies padding for data cells in this column."
     * @ojmetadata displayName "Padding"
     */
    padding?: 'enabled' | 'disabled' | CellPadding | ((context: RowContext<K, D>) => 'enabled' | 'disabled' | CellPadding);
    /**
     * Specifies padding for the header cell in this column. Valid string values include 'enabled' and 'disabled'. Setting either
     * 'enabled' or 'disabled' will apply to all sides of the header cell, while providing an instance of CellPadding will only
     * apply to the specified sides of the header cell.
     *
     * @ojmetadata description "Specifies padding for the header cell in this column."
     * @ojmetadata displayName "Header Padding"
     */
    headerPadding?: 'enabled' | 'disabled' | CellPadding;
    /**
     * Specifies padding for the footer cell in this column. Valid string values include 'enabled' and 'disabled'. Setting either
     * 'enabled' or 'disabled' will apply to all sides of the footer cell, while providing an instance of CellPadding will only
     * apply to the specified sides of the footer cell.
     *
     * @ojmetadata description "Specifies padding for the footer cell in this column."
     * @ojmetadata displayName "Footer Padding"
     */
    footerPadding?: 'enabled' | 'disabled' | CellPadding;
    /**
     * Specifies whether default tooltips are enabled for data cells in this column. Valid string values include 'enabled'
     * and 'disabled'.
     *
     * @ojmetadata description "Specifies whether default tooltips are enabled for data cells in this column."
     * @ojmetadata displayName "Tooltip"
     */
    tooltip?: 'enabled' | 'disabled' | ((context: RowContext<K, D>) => 'enabled' | 'disabled');
    /**
     * Specifies whether the default tooltip is enabled for the header cell in this column. Valid string values include
     * 'enabled' and 'disabled'.
     *
     * @ojmetadata description "Specifies whether the default tooltip is enabled for the header cell in this column."
     * @ojmetadata displayName "Header Tooltip"
     */
    headerTooltip?: 'enabled' | 'disabled';
    /**
     * Specifies whether the default tooltip is enabled for the footer cell in this column. Valid string values include
     * 'enabled' and 'disabled'.
     *
     * @ojmetadata description "Specifies whether the default tooltip is enabled for the footer cell in this column."
     * @ojmetadata displayName "Footer Tooltip"
     */
    footerTooltip?: 'enabled' | 'disabled';
    /**
     * @ojmetadata description "Whether this column should be prevented from scrolling out of view."
     * @ojmetadata displayName "Sticky"
     */
    sticky?: 'enabled' | 'disabled';
    /**
     * @ojmetadata description "The horizontal alignment of the column."
     * @ojmetadata displayName "Horizontal Alignment"
     */
    horizontalAlignment?: 'start' | 'end' | 'left' | 'right' | 'center';
    /**
     * @ojmetadata description "Enable or disable width resizing along the column end headers."
     * @ojmetadata displayName "Resizable"
     */
    resizable?: 'enabled' | 'disabled';
};
declare const _SELECTION_COLUMN_KEY = "oj-c-table_selection";
export type TableDefaultColumnKey = typeof _SELECTION_COLUMN_KEY;
/**
 * Specifies a data cell.
 */
type DataCell<K, C> = {
    /**
     * @ojmetadata displayName "Row Key"
     * @ojmetadata description "Specifies the row key of the cell."
     */
    rowKey: K;
    /**
     * Specifies the column key of the cell. Valid values include 'oj-c-table_selection' when multiple
     * or multipleToggle row selection is enabled.
     *
     * @ojmetadata displayName "Column Key"
     * @ojmetadata description "Specifies the column key of the cell."
     */
    columnKey: C | TableDefaultColumnKey;
    /**
     * @ojmetadata displayName "Type"
     * @ojmetadata description "Specifies the the type of the cell."
     */
    type: 'data';
};
/**
 * Specifies a no data cell.
 */
type NoDataCell = {
    /**
     * @ojmetadata displayName "Type"
     * @ojmetadata description "Specifies the type of the cell."
     */
    type: 'noData';
};
/**
 * Specifies a header cell.
 */
type HeaderCell<C> = {
    /**
     * Specifies the column key of the cell. Valid values include 'oj-c-table_selection' when multiple
     * or multipleToggle row selection is enabled.
     *
     * @ojmetadata displayName "Column Key"
     * @ojmetadata description "Specifies the column key of the cell."
     */
    columnKey: C | TableDefaultColumnKey;
    /**
     * @ojmetadata displayName "Type"
     * @ojmetadata description "Specifies the type of the cell."
     */
    type: 'header';
};
/**
 * Specifies a footer cell.
 */
type FooterCell<C> = {
    /**
     * Specifies the column key of the cell. Valid values include 'oj-c-table_selection' when multiple
     * or multipleToggle row selection is enabled.
     *
     * @ojmetadata displayName "Column Key"
     * @ojmetadata description "Specifies the column key of the cell."
     */
    columnKey: C | TableDefaultColumnKey;
    /**
     * @ojmetadata displayName "Type"
     * @ojmetadata description "Specifies the type of the cell."
     */
    type: 'footer';
};
/**
 * Identifier for the cells in the table
 */
type Cell<K, C> = DataCell<K, C> | HeaderCell<C> | FooterCell<C> | NoDataCell;
/**
 * Specifies a row override for a data cell. If only a <code>rowKey</code> is provided, using this as
 * an override will attempt to keep the the current column the same and only change the current row.
 * See the <code>current-cell-override</code> attribute for more details.
 */
type DataCellRowOverride<K, C> = {
    /**
     * @ojmetadata displayName "Row Key"
     * @ojmetadata description "Specifies the row key of the cell override."
     */
    rowKey: K;
    /**
     * Specifies the column key of the cell override. Valid values include 'oj-c-table_selection' when multiple
     * or multipleToggle row selection is enabled.
     *
     * @ojmetadata displayName "Column Key"
     * @ojmetadata description "Specifies the column key of the cell override."
     */
    columnKey?: C | TableDefaultColumnKey;
    /**
     * @ojmetadata displayName "Type"
     * @ojmetadata description "Specifies the type of the cell override."
     */
    type?: 'data';
};
/**
 * Specifies a column override for a data cell. If only a <code>columnKey</code> is provided, using this
 * as an override will attempt to keep the the current row the same and only change the current column.
 * See the <code>current-cell-override</code> attribute for more details.
 */
type DataCellColumnOverride<K, C> = {
    /**
     * @ojmetadata displayName "Row Key"
     * @ojmetadata description "Specifies the row key of the cell override."
     */
    rowKey?: K;
    /**
     * Specifies the column key of the cell override. Valid values include 'oj-c-table_selection' when multiple
     * or multipleToggle row selection is enabled.
     *
     * @ojmetadata displayName "Column Key"
     * @ojmetadata description "Specifies the column key of the cell override."
     */
    columnKey: C | TableDefaultColumnKey;
    /**
     * @ojmetadata displayName "Type"
     * @ojmetadata description "Specifies the type of the cell override."
     */
    type?: 'data';
};
/**
 * Specifies a type override for a data cell. If only a <code>type</code> is provided, using this as
 * an override will attempt to keep the the current column the same and change to the first data row.
 * See the <code>current-cell-override</code> attribute for more details.
 */
type DataCellTypeOverride<K, C> = {
    /**
     * @ojmetadata displayName "Row Key"
     * @ojmetadata description "Specifies the row key of the cell override."
     */
    rowKey?: K;
    /**
     * Specifies the column key of the cell override. Valid values include 'oj-c-table_selection' when multiple
     * or multipleToggle row selection is enabled.
     *
     * @ojmetadata displayName "Column Key"
     * @ojmetadata description "Specifies the column key of the cell override."
     */
    columnKey?: C | TableDefaultColumnKey;
    /**
     * @ojmetadata displayName "Type"
     * @ojmetadata description "Specifies the type of the cell override."
     */
    type: 'data';
};
/**
 * Specifies a column override for a header cell. If only a <code>columnKey</code> is provided, using
 * this as an override will only change the current column.
 * See the <code>current-cell-override</code> attribute for more details.
 */
type HeaderCellColumnOverride<C> = {
    /**
     * Specifies the column key of the cell override. Valid values include 'oj-c-table_selection' when multiple
     * or multipleToggle row selection is enabled.
     *
     * @ojmetadata displayName "Column Key"
     * @ojmetadata description "Specifies the column key of the cell override."
     */
    columnKey: C | TableDefaultColumnKey;
    /**
     * @ojmetadata displayName "Type"
     * @ojmetadata description "Specifies the type of the cell override."
     */
    type?: 'header';
};
/**
 * Specifies a type override for a header cell. If only a <code>type</code> is provided, using this as
 * an override will attempt to keep the the current column the same and make a header cell current.
 * See the <code>current-cell-override</code> attribute for more details.
 */
type HeaderCellTypeOverride<C> = {
    /**
     * Specifies the column key of the cell override. Valid values include 'oj-c-table_selection' when multiple
     * or multipleToggle row selection is enabled.
     *
     * @ojmetadata displayName "Column Key"
     * @ojmetadata description "Specifies the column key of the cell override."
     */
    columnKey?: C | TableDefaultColumnKey;
    /**
     * @ojmetadata displayName "Type"
     * @ojmetadata description "Specifies the type of the cell override."
     */
    type: 'header';
};
/**
 * Specifies a column override for a footer cell. If only a <code>columnKey</code> is provided, using
 * this as an override will only change the current column.
 * See the <code>current-cell-override</code> attribute for more details.
 */
type FooterCellColumnOverride<C> = {
    /**
     * Specifies the column key of the cell override. Valid values include 'oj-c-table_selection' when multiple
     * or multipleToggle row selection is enabled.
     *
     * @ojmetadata displayName "Column Key"
     * @ojmetadata description "Specifies the column key of the cell override."
     */
    columnKey: C | TableDefaultColumnKey;
    /**
     * @ojmetadata displayName "Type"
     * @ojmetadata description "Specifies the type of the cell override."
     */
    type?: 'footer';
};
/**
 * Specifies a type override for a footer cell. If only a <code>type</code> is provided, using this as
 * an override will attempt to keep the the current column the same and make a footer cell current.
 * See the <code>current-cell-override</code> attribute for more details.
 */
type FooterCellTypeOverride<C> = {
    /**
     * Specifies the column key of the cell override. Valid values include 'oj-c-table_selection' when multiple
     * or multipleToggle row selection is enabled.
     *
     * @ojmetadata displayName "Column Key"
     * @ojmetadata description "Specifies the column key of the cell override."
     */
    columnKey?: C | TableDefaultColumnKey;
    /**
     * @ojmetadata displayName "Type"
     * @ojmetadata description "Specifies the type of the cell override."
     */
    type: 'footer';
};
/**
 * Identifier for the override of cells in the table.
 */
type CellOverride<K, C> = DataCellRowOverride<K, C> | DataCellColumnOverride<K, C> | DataCellTypeOverride<K, C> | HeaderCellColumnOverride<C> | HeaderCellTypeOverride<C> | FooterCellColumnOverride<C> | FooterCellTypeOverride<C> | NoDataCell;
export type TableProps<K extends string | number, D, C extends string> = ObservedGlobalProps<'aria-label' | 'aria-labelledby' | 'id'> & {
    /**
     * @ojmetadata propertyEditorValues {
     *   "contents": {
     *     "description": "When specified, the initial column sizes are determined by the contents of the data. Does not require an overall width set on the Table. Can have performance issues when large numbers of columns and/or rows are initially rendered.",
     *     "displayName": "Contents"
     *   },
     *   "fixed": {
     *     "description": "When specified, the initial column sizes are determined by column weights. Requires an overall width set on the Table (width='100%', width='200rem', etc.) Very performant when rendering large numbers of columns and/or rows.",
     *     "displayName": "Fixed"
     *   }
     * }
     * @ojmetadata description "The column sizing method used for the Table's columns."
     * @ojmetadata displayName "Layout"
     * @ojmetadata help "#layout"
     */
    layout?: 'contents' | 'fixed';
    /**
     * The data provider for Table.
     *
     * @ojmetadata description "The data provider for Table."
     * @ojmetadata displayName "Data"
     * @ojmetadata help "#data"
     */
    data?: DataProvider<K, D>;
    /**
     * The set of columns that can be displayed in the Table.
     * If no <code>columns-order</code> is specified, all columns specified will be displayed in
     * the order returned by <code>Object.keys(columns)</code>. Otherwise only the columns specified
     * in the <code>columns-order</code> value will be displayed.
     *
     * @ojmetadata description "The set of columns that can be displayed in the Table."
     * @ojmetadata displayName "Columns"
     * @ojmetadata help "#columns"
     */
    columns?: Record<C, Column<K, D>>;
    /**
     * A subset of attributes for controlling certain behaviors on a per row basis.
     *
     * @ojmetadata description "A subset of attributes for controlling certain behaviors on a per row basis."
     * @ojmetadata displayName "Row"
     * @ojmetadata help "#row"
     */
    row?: {
        /**
         * The column key(s) to be used as the accessible row header(s) for assistive technologies.
         * At least 1 row header is required for accessibility purposes. If not specified, the first
         * column is set as the row header. This can be a single key or an array of keys if multiple
         * columns best describe the row. This value can be set on a per row basis via the callback
         * function if desired.
         *
         * @ojmetadata description "The column key(s) to be used as the accessible row header(s) for assistive technologies. See the Help documentation for more information."
         * @ojmetadata displayName "Accessible Row Header"
         * @ojmetadata help "#row.accessibleRowHeader"
         */
        accessibleRowHeader?: C | C[] | ((context: RowContext<K, D>) => C | C[]);
    };
    /**
     * @ojmetadata propertyEditorValues {
     *   "enabled": {
     *     "description": "Display horizontal gridlines",
     *     "displayName": "Enabled"
     *   },
     *   "disabled": {
     *     "description": "Do not display horizontal gridlines",
     *     "displayName": "Disabled"
     *   }
     * }
     * @ojmetadata description "Controls the display of the Table's horizontal gridlines."
     * @ojmetadata displayName "Horizontal Grid Visible"
     * @ojmetadata help "#horizontalGridVisible"
     */
    horizontalGridVisible?: 'enabled' | 'disabled';
    /**
     * @ojmetadata propertyEditorValues {
     *   "enabled": {
     *     "description": "Display vertical gridlines",
     *     "displayName": "Enabled"
     *   },
     *   "disabled": {
     *     "description": "Do not display vertical gridlines",
     *     "displayName": "Disabled"
     *   }
     * }
     * @ojmetadata description "Controls the display of the Table's vertical gridlines."
     * @ojmetadata displayName "Vertical Grid Visible"
     * @ojmetadata help "#verticalGridVisible"
     */
    verticalGridVisible?: 'enabled' | 'disabled';
    /**
     * The selected rows and/or columns.
     *
     * @ojmetadata description "The selected rows and/or columns. See the Help documentation for more information."
     * @ojmetadata displayName "Selected"
     * @ojmetadata help "#selected"
     */
    selected?: {
        /**
         * The selected columns.
         * An empty ImmutableKeySet that returns <code>false</code> when <code>isaddAll()</code> is invoked
         * indicates that no columns are selected. An empty ImmutableKeySet that returns <code>true</code> when
         * <code>isAddAll()</code> is invoked on it indicates that 'all' columns are selected.
         *
         * @ojmetadata description "The selected columns. See the Help documentation for more information."
         * @ojmetadata displayName "Selected Columns"
         * @ojmetadata help "#selected.column"
         */
        column?: ImmutableKeySet<C>;
        /**
         * The selected rows.
         * An empty ImmutableKeySet that returns <code>false</code> when <code>isaddAll()</code> is invoked
         * indicates that no rows are selected. An empty ImmutableKeySet that returns <code>true</code> when
         * <code>isAddAll()</code> is invoked on it indicates that 'all' rows are selected.
         *
         * @ojmetadata description "The selected rows. See the Help documentation for more information."
         * @ojmetadata displayName "Selected Rows"
         * @ojmetadata help "#selected.row"
         */
        row?: ImmutableKeySet<K>;
    };
    /**
     * Specifies whether row and/or column selection gestures are enabled on the Table, and the cardinality
     * of each (single/multiple/multipleToggle/none). If <code>single</code>, <code>multiple</code>, or
     * <code>multipleToggle</code> is specified, selection gestures will be enabled. Otherwise, selection
     * gestures will be disabled. This attribute has no effect on the Table's selection styling as styling
     * will be applied to any rows and/or columns specified by the <code>selected</code> attribute regardless
     * of the type of selection gestures enabled. Changing the value of this attribute will not affect the
     * value of the <code>selected</code> attribute.
     *
     * @ojmetadata description "Specifies whether row and/or column selection gestures are enabled on the Table, and the cardinality of each (single/multiple/multipleToggle/none)."
     * @ojmetadata displayName "Selection Mode"
     * @ojmetadata help "#selectionMode"
     */
    selectionMode?: {
        /**
         * @ojmetadata propertyEditorValues {
         *   "none": {
         *     "description": "Column selection gestures are disabled.",
         *     "displayName": "None"
         *   },
         *   "single": {
         *     "description": "A maximum of 1 column can be selected via user gestures.",
         *     "displayName": "Single"
         *   },
         *   "multiple": {
         *     "description": "Any number of columns can be selected via user gestures.",
         *     "displayName": "Multiple"
         *   }
         * }
         * @ojmetadata description "Specifies whether column selection gestures are enabled on the Table."
         * @ojmetadata displayName "Column Selection Mode"
         * @ojmetadata help "#selectionMode.column"
         */
        column?: 'none' | 'single' | 'multiple';
        /**
         * @ojmetadata propertyEditorValues {
         *   "none": {
         *     "description": "Row selection gestures are disabled.",
         *     "displayName": "None"
         *   },
         *   "single": {
         *     "description": "A maximum of 1 row can be selected via user gestures.",
         *     "displayName": "Single"
         *   },
         *   "multiple": {
         *     "description": "Any number of rows can be selected via user gestures. Performing a selection gesture may affect the selection state of previously selected rows depending on render context as well as the use of modifier keys.",
         *     "displayName": "Multiple"
         *   },
         *   "multipleToggle": {
         *     "description": "Any number of rows can be selected via user gestures. Performing a selection gesture will not affect the selection state of previously selected rows regardless of rendering context or the use of modifier keys.",
         *     "displayName": "Multiple Toggle"
         *   }
         * }
         * @ojmetadata description "Specifies whether row selection gestures are enabled on the Table."
         * @ojmetadata displayName "Row Selection Mode"
         * @ojmetadata help "#selectionMode.row"
         */
        row?: 'none' | 'single' | 'multiple' | 'multipleToggle';
    };
    /**
     * @ojmetadata propertyEditorValues {
     *   "hidden": {
     *     "description": "Do not display the select all control",
     *     "displayName": "Hidden"
     *   },
     *   "visible": {
     *     "description": "Display the select all control",
     *     "displayName": "Visible"
     *   }
     * }
     * @ojmetadata description "Controls the display of the Table's select all control when multiple or multipleToggle row selection is enabled."
     * @ojmetadata displayName "Select All Control"
     * @ojmetadata help "#selectAllControl"
     */
    selectAllControl?: 'hidden' | 'visible';
    /**
     * @ojmetadata description "Writeback support for the selected property."
     * @ojmetadata displayName "Selected Changed"
     * @ojmetadata help "#onSelectedChanged"
     */
    onSelectedChanged?: PropertyChanged<{
        row?: ImmutableKeySet<K>;
        column?: ImmutableKeySet<C>;
    }>;
    /**
     * Controls the displayed columns and their order.
     * An array of column keys that represents the displayed columns and the order to display them in.
     * If not set, all columns will be displayed in the order returned by <code>Object.keys(columns)</code>.
     *
     * @ojmetadata description "Display and order of columns. See the Help documentation for more information."
     * @ojmetadata displayName "Column Order"
     * @ojmetadata help "#columnOrder"
     */
    columnOrder?: C[];
    /**
     * @ojmetadata description "Writeback support for the column order property."
     * @ojmetadata displayName "Column Order Changed"
     * @ojmetadata help "#onColumnOrderChanged"
     */
    onColumnOrderChanged?: PropertyChanged<C[]>;
    /**
     * The template for rendering each data cell in the table.
     * When a column.template is specified that will take precedence over this template.
     * The slot content must be a template element.
     * The content of the template should not include the td element, only its contents.
     * The template has access to the context CellTemplateContext via $current or the aliased name for $current set via data-oj-as.
     *
     * @ojmetadata description "Named slot for the table's global cell template. See the Help documentation for more information."
     * @ojmetadata displayName "Cell Template"
     * @ojmetadata help "#cellTemplate"
     */
    cellTemplate?: TemplateSlot<CellTemplateContext<K, D, C>>;
    /**
     * The template for rendering each header cell in the table.
     * When a column.headerTemplate is specified that will take precedence over this template.
     * The slot content must be a template element.
     * The content of the template should not include the th element, only its contents.
     * The template has access to the context HeaderTemplateContext via $current or the aliased name for $current set via data-oj-as.
     *
     * @ojmetadata description "Named slot for the table's global header template. See the Help documentation for more information."
     * @ojmetadata displayName "Header Template"
     * @ojmetadata help "#headerTemplate"
     */
    headerTemplate?: TemplateSlot<HeaderTemplateContext<C>>;
    /**
     * The template for rendering each footer cell in the table.
     * When a column.footerTemplate is specified that will take precedence over this template.
     * The slot content must be a template element.
     * The content of the template should not include the td element, only its contents.
     * The template has access to the context FooterTemplateContext via $current or the aliased name for $current set via data-oj-as.
     *
     * @ojmetadata description "Named slot for the Table's global footer template. See the Help documentation for more information."
     * @ojmetadata displayName "Footer Template"
     * @ojmetadata help "#footerTemplate"
     */
    footerTemplate?: TemplateSlot<FooterTemplateContext<C>>;
    /**
     * @ojmetadata description "A set of dynamic templates for rendering the table content."
     * @ojmetadata displayName "Dynamic Template Slots"
     * @ojmetadata help "#dynamicTemplates"
     */
    templates?: DynamicTemplateSlots<CellTemplateContext<K, D, C> | HeaderTemplateContext<C> | FooterTemplateContext<C>>;
    /**
     * Triggered when a user performs an action gesture on a row.
     * Action gestures include when a user clicks (or taps) anywhere in a data cell, or presses the enter or space keys while a data cell or its content has browser focus.
     *
     * @ojmetadata description "Triggered when a user performs an action gesture on a row. See the Help documentation for more information."
     * @ojmetadata displayName "On OjRowAction"
     * @ojmetadata help "#event:ojRowAction"
     */
    onOjRowAction?: Action<RowActionDetail<K, D>> & Bubbles;
    /**
     * The template for rendering content when the table has an empty data set.
     * The slot content must be a template element.
     * If not specified then a default no data message will be displayed.
     *
     * @ojmetadata description "The template for rendering content when the table has an empty data set. See the Help documentation for more information."
     * @ojmetadata displayName "No Data"
     * @ojmetadata help "#noData"
     * @ojmetadata templateSlotAlias "noDataTemplate"
     */
    noData?: TemplateSlot<NoDataContext>;
    /**
     * The cell override to apply to the current cell of the Table.
     * In order for this property to be honored, a new object instance must be set.
     * Any or all aspects of a valid <code>DataCell</code>, <code>HeaderCell</code>, or
     * <code>FooterCell</code> can be overridden. For instance, if the current cell is a data cell
     * in the third row and second column, providing an override with only <code>type: 'header'</code>
     * will result in the second column's header cell becoming current. Providing an override with only
     * <code>columnKey: [fourth column key]</code> instead will result in the data cell in the third
     * row and fourth column becoming current.
     *
     * @ojmetadata description "The cell override to apply to the current cell of the Table. In order for this property to be honored, a new object instance must be set."
     * @ojmetadata displayName "Current Cell Override"
     * @ojmetadata help "#currentCellOverride"
     */
    currentCellOverride?: CellOverride<K, C>;
    /**
     * The cell currently being used as the target for keyboard gestures made on the Table.
     * This value will be updated as a user interacts with the Table. It will not be updated due to
     * the Table losing browser focus alone, but may be updated due to the Table receiving browser focus.
     * The current cell can be programatically updated by providing a new value for the
     * <code>current-cell-override</code> attribute.
     *
     * @ojmetadata description "The cell currently being used as the target for keyboard gestures made on the Table."
     * @ojmetadata displayName "Current Cell"
     * @ojmetadata help "#currentCell"
     */
    onCurrentCellChanged?: ReadOnlyPropertyChanged<Cell<K, C> | undefined>;
    /**
     * The desired widths of the specified table columns.
     * A record mapping columns keys to numbers representing pixel widths for each column.
     * Values should only be provided when a specific width is desired for a column as values provided
     * will override the Table's normal column sizing calculations. Applications should avoid setting
     * widths for every column in most cases as doing so will likely result in a non-responsive layout.
     *
     * @ojmetadata description "The desired widths of table columns. A record mapping column keys to numbers representing pixel widths for each column."
     * @ojmetadata displayName "Column Widths"
     * @ojmetadata help "#columnWidths"
     */
    columnWidths?: Record<C, number>;
    /**
     * @ojmetadata description "Writeback support for the column widths property."
     * @ojmetadata displayName "Column Widths Changed"
     * @ojmetadata help "#onColumnWidthsChanged"
     */
    onColumnWidthsChanged?: PropertyChanged<Record<C, number>>;
    /**
     * Options related to the Table's fetching and scrolling behaviors.
     *
     * @ojmetadata description "Options related to the Table's fetching and scrolling behaviors."
     * @ojmetadata displayName "Scroll Policy Options"
     * @ojmetadata help "#scrollPolicyOptions"
     */
    scrollPolicyOptions?: {
        /**
         * The number of records the Table will request during each data fetch.
         *
         * @ojmetadata description "The number of records the Table will request during each data fetch."
         * @ojmetadata displayName "Fetch Size"
         * @ojmetadata help "#scrollPolicyOptions.fetchSize"
         */
        fetchSize?: number;
    };
    /**
     * @ojmetadata description "The column resize behavior this Table will utilize when column resizing is enabled on a given column."
     * @ojmetadata displayName "Column Resize Behavior"
     * @ojmetadata help "#columnResizeBehavior"
     * @ojmetadata propertyEditorValues {
     *     "add": {
     *       "description": "Column resize gestures only affect the width of the column on the start side of the divider.",
     *       "displayName": "add"
     *     },
     *     "redistribute": {
     *       "description": "Column resize gestures affect the widths of columns on each side of the divider.",
     *       "displayName": "redistribute"
     *     }
     *   }
     */
    columnResizeBehavior?: 'redistribute' | 'add';
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
declare function TableImpl<K extends string | number, D, C extends string>({ 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, id, data, columns, row, horizontalGridVisible, verticalGridVisible, layout, currentCellOverride, onCurrentCellChanged, selected, selectionMode, onSelectedChanged, selectAllControl, columnOrder, cellTemplate, headerTemplate, footerTemplate, templates, onOjRowAction, noData, columnWidths, onColumnWidthsChanged, columnResizeBehavior, scrollPolicyOptions }: TableProps<K, D, C>): import("preact").JSX.Element;
/**
 * This export corresponds to the Table Preact component. For the oj-c-table custom element, import CTableElement instead.
 */
export declare const Table: <K extends string | number = string | number, D = any, C extends string = string>(props: ExtendGlobalProps<ComponentProps<typeof TableImpl<K, D, C>>>) => ComponentChildren;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-table custom element. For the Table Preact component, import Table instead.
 */
export interface CTableElement<K extends string | number, D, C extends string> extends JetElement<CTableElementSettableProperties<K, D, C>>, CTableElementSettableProperties<K, D, C> {
    /**
     * The cell currently being used as the target for keyboard gestures made on the Table.
     * This value will be updated as a user interacts with the Table. It will not be updated due to
     * the Table losing browser focus alone, but may be updated due to the Table receiving browser focus.
     * The current cell can be programatically updated by providing a new value for the
     * <code>current-cell-override</code> attribute.
     */
    readonly currentCell?: Parameters<Required<TableProps<K, D, C>>['onCurrentCellChanged']>[0];
    addEventListener<T extends keyof CTableElementEventMap<K, D, C>>(type: T, listener: (this: HTMLElement, ev: CTableElementEventMap<K, D, C>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CTableElementSettableProperties<K, D, C>>(property: T): CTableElement<K, D, C>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CTableElementSettableProperties<K, D, C>>(property: T, value: CTableElementSettableProperties<K, D, C>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CTableElementSettableProperties<K, D, C>>): void;
    setProperties(properties: CTableElementSettablePropertiesLenient<K, D, C>): void;
}
declare namespace _CTableElementTypes {
    type _CellTemplateContext<K extends string | number, D, C extends string> = CellTemplateContext<K, D, C>;
    type _HeaderTemplateContext<C extends string> = HeaderTemplateContext<C>;
    type _FooterTemplateContext<C extends string> = FooterTemplateContext<C>;
}
export namespace CTableElement {
    interface ojRowAction<K extends string | number, D> extends CustomEvent<RowActionDetail<K, D> & {}> {
    }
    type columnOrderChanged<K extends string | number, D, C extends string> = JetElementCustomEventStrict<CTableElement<K, D, C>['columnOrder']>;
    type columnResizeBehaviorChanged<K extends string | number, D, C extends string> = JetElementCustomEventStrict<CTableElement<K, D, C>['columnResizeBehavior']>;
    type columnWidthsChanged<K extends string | number, D, C extends string> = JetElementCustomEventStrict<CTableElement<K, D, C>['columnWidths']>;
    type columnsChanged<K extends string | number, D, C extends string> = JetElementCustomEventStrict<CTableElement<K, D, C>['columns']>;
    type currentCellChanged<K extends string | number, D, C extends string> = JetElementCustomEventStrict<CTableElement<K, D, C>['currentCell']>;
    type currentCellOverrideChanged<K extends string | number, D, C extends string> = JetElementCustomEventStrict<CTableElement<K, D, C>['currentCellOverride']>;
    type dataChanged<K extends string | number, D, C extends string> = JetElementCustomEventStrict<CTableElement<K, D, C>['data']>;
    type horizontalGridVisibleChanged<K extends string | number, D, C extends string> = JetElementCustomEventStrict<CTableElement<K, D, C>['horizontalGridVisible']>;
    type layoutChanged<K extends string | number, D, C extends string> = JetElementCustomEventStrict<CTableElement<K, D, C>['layout']>;
    type rowChanged<K extends string | number, D, C extends string> = JetElementCustomEventStrict<CTableElement<K, D, C>['row']>;
    type scrollPolicyOptionsChanged<K extends string | number, D, C extends string> = JetElementCustomEventStrict<CTableElement<K, D, C>['scrollPolicyOptions']>;
    type selectAllControlChanged<K extends string | number, D, C extends string> = JetElementCustomEventStrict<CTableElement<K, D, C>['selectAllControl']>;
    type selectedChanged<K extends string | number, D, C extends string> = JetElementCustomEventStrict<CTableElement<K, D, C>['selected']>;
    type selectionModeChanged<K extends string | number, D, C extends string> = JetElementCustomEventStrict<CTableElement<K, D, C>['selectionMode']>;
    type verticalGridVisibleChanged<K extends string | number, D, C extends string> = JetElementCustomEventStrict<CTableElement<K, D, C>['verticalGridVisible']>;
    type CellTemplateContext<K extends string | number, D, C extends string> = _CTableElementTypes._CellTemplateContext<K, D, C>;
    type RenderCellTemplate<K extends string | number, D, C extends string> = import('ojs/ojvcomponent').TemplateSlot<CellTemplateContext<K, D, C>>;
    type HeaderTemplateContext<C extends string> = _CTableElementTypes._HeaderTemplateContext<C>;
    type RenderHeaderTemplate<C extends string> = import('ojs/ojvcomponent').TemplateSlot<HeaderTemplateContext<C>>;
    type FooterTemplateContext<C extends string> = _CTableElementTypes._FooterTemplateContext<C>;
    type RenderFooterTemplate<C extends string> = import('ojs/ojvcomponent').TemplateSlot<FooterTemplateContext<C>>;
    type NoDataTemplateContext = NoDataContext;
    type RenderNoDataTemplate = import('ojs/ojvcomponent').TemplateSlot<NoDataContext>;
    type TemplateContext<K extends string | number, D, C extends string> = CellTemplateContext<K, D, C>;
    type RenderTemplate<K extends string | number, D, C extends string> = import('ojs/ojvcomponent').TemplateSlot<CellTemplateContext<K, D, C>>;
}
export interface CTableElementEventMap<K extends string | number, D, C extends string> extends HTMLElementEventMap {
    'ojRowAction': CTableElement.ojRowAction<K, D>;
    'columnOrderChanged': JetElementCustomEventStrict<CTableElement<K, D, C>['columnOrder']>;
    'columnResizeBehaviorChanged': JetElementCustomEventStrict<CTableElement<K, D, C>['columnResizeBehavior']>;
    'columnWidthsChanged': JetElementCustomEventStrict<CTableElement<K, D, C>['columnWidths']>;
    'columnsChanged': JetElementCustomEventStrict<CTableElement<K, D, C>['columns']>;
    'currentCellChanged': JetElementCustomEventStrict<CTableElement<K, D, C>['currentCell']>;
    'currentCellOverrideChanged': JetElementCustomEventStrict<CTableElement<K, D, C>['currentCellOverride']>;
    'dataChanged': JetElementCustomEventStrict<CTableElement<K, D, C>['data']>;
    'horizontalGridVisibleChanged': JetElementCustomEventStrict<CTableElement<K, D, C>['horizontalGridVisible']>;
    'layoutChanged': JetElementCustomEventStrict<CTableElement<K, D, C>['layout']>;
    'rowChanged': JetElementCustomEventStrict<CTableElement<K, D, C>['row']>;
    'scrollPolicyOptionsChanged': JetElementCustomEventStrict<CTableElement<K, D, C>['scrollPolicyOptions']>;
    'selectAllControlChanged': JetElementCustomEventStrict<CTableElement<K, D, C>['selectAllControl']>;
    'selectedChanged': JetElementCustomEventStrict<CTableElement<K, D, C>['selected']>;
    'selectionModeChanged': JetElementCustomEventStrict<CTableElement<K, D, C>['selectionMode']>;
    'verticalGridVisibleChanged': JetElementCustomEventStrict<CTableElement<K, D, C>['verticalGridVisible']>;
}
export interface CTableElementSettableProperties<K extends string | number, D, C extends string> extends JetSettableProperties {
    /**
     * Controls the displayed columns and their order.
     * An array of column keys that represents the displayed columns and the order to display them in.
     * If not set, all columns will be displayed in the order returned by <code>Object.keys(columns)</code>.
     */
    columnOrder?: TableProps<K, D, C>['columnOrder'];
    columnResizeBehavior?: TableProps<K, D, C>['columnResizeBehavior'];
    /**
     * The desired widths of the specified table columns.
     * A record mapping columns keys to numbers representing pixel widths for each column.
     * Values should only be provided when a specific width is desired for a column as values provided
     * will override the Table's normal column sizing calculations. Applications should avoid setting
     * widths for every column in most cases as doing so will likely result in a non-responsive layout.
     */
    columnWidths?: TableProps<K, D, C>['columnWidths'];
    /**
     * The set of columns that can be displayed in the Table.
     * If no <code>columns-order</code> is specified, all columns specified will be displayed in
     * the order returned by <code>Object.keys(columns)</code>. Otherwise only the columns specified
     * in the <code>columns-order</code> value will be displayed.
     */
    columns?: TableProps<K, D, C>['columns'];
    /**
     * The cell override to apply to the current cell of the Table.
     * In order for this property to be honored, a new object instance must be set.
     * Any or all aspects of a valid <code>DataCell</code>, <code>HeaderCell</code>, or
     * <code>FooterCell</code> can be overridden. For instance, if the current cell is a data cell
     * in the third row and second column, providing an override with only <code>type: 'header'</code>
     * will result in the second column's header cell becoming current. Providing an override with only
     * <code>columnKey: [fourth column key]</code> instead will result in the data cell in the third
     * row and fourth column becoming current.
     */
    currentCellOverride?: TableProps<K, D, C>['currentCellOverride'];
    /**
     * The data provider for Table.
     */
    data?: TableProps<K, D, C>['data'];
    horizontalGridVisible?: TableProps<K, D, C>['horizontalGridVisible'];
    layout?: TableProps<K, D, C>['layout'];
    /**
     * A subset of attributes for controlling certain behaviors on a per row basis.
     */
    row?: TableProps<K, D, C>['row'];
    /**
     * Options related to the Table's fetching and scrolling behaviors.
     */
    scrollPolicyOptions?: TableProps<K, D, C>['scrollPolicyOptions'];
    selectAllControl?: TableProps<K, D, C>['selectAllControl'];
    /**
     * The selected rows and/or columns.
     */
    selected?: TableProps<K, D, C>['selected'];
    /**
     * Specifies whether row and/or column selection gestures are enabled on the Table, and the cardinality
     * of each (single/multiple/multipleToggle/none). If <code>single</code>, <code>multiple</code>, or
     * <code>multipleToggle</code> is specified, selection gestures will be enabled. Otherwise, selection
     * gestures will be disabled. This attribute has no effect on the Table's selection styling as styling
     * will be applied to any rows and/or columns specified by the <code>selected</code> attribute regardless
     * of the type of selection gestures enabled. Changing the value of this attribute will not affect the
     * value of the <code>selected</code> attribute.
     */
    selectionMode?: TableProps<K, D, C>['selectionMode'];
    verticalGridVisible?: TableProps<K, D, C>['verticalGridVisible'];
}
export interface CTableElementSettablePropertiesLenient<K extends string | number, D, C extends string> extends Partial<CTableElementSettableProperties<K, D, C>> {
    [key: string]: any;
}
export interface TableIntrinsicProps extends Partial<Readonly<CTableElementSettableProperties<any, any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    currentCell?: never;
    children?: import('preact').ComponentChildren;
    /**
     * Triggered when a user performs an action gesture on a row.
     * Action gestures include when a user clicks (or taps) anywhere in a data cell, or presses the enter or space keys while a data cell or its content has browser focus.
     */
    onojRowAction?: (value: CTableElementEventMap<any, any, any>['ojRowAction']) => void;
    oncolumnOrderChanged?: (value: CTableElementEventMap<any, any, any>['columnOrderChanged']) => void;
    oncolumnResizeBehaviorChanged?: (value: CTableElementEventMap<any, any, any>['columnResizeBehaviorChanged']) => void;
    oncolumnWidthsChanged?: (value: CTableElementEventMap<any, any, any>['columnWidthsChanged']) => void;
    oncolumnsChanged?: (value: CTableElementEventMap<any, any, any>['columnsChanged']) => void;
    oncurrentCellChanged?: (value: CTableElementEventMap<any, any, any>['currentCellChanged']) => void;
    oncurrentCellOverrideChanged?: (value: CTableElementEventMap<any, any, any>['currentCellOverrideChanged']) => void;
    ondataChanged?: (value: CTableElementEventMap<any, any, any>['dataChanged']) => void;
    onhorizontalGridVisibleChanged?: (value: CTableElementEventMap<any, any, any>['horizontalGridVisibleChanged']) => void;
    onlayoutChanged?: (value: CTableElementEventMap<any, any, any>['layoutChanged']) => void;
    onrowChanged?: (value: CTableElementEventMap<any, any, any>['rowChanged']) => void;
    onscrollPolicyOptionsChanged?: (value: CTableElementEventMap<any, any, any>['scrollPolicyOptionsChanged']) => void;
    onselectAllControlChanged?: (value: CTableElementEventMap<any, any, any>['selectAllControlChanged']) => void;
    onselectedChanged?: (value: CTableElementEventMap<any, any, any>['selectedChanged']) => void;
    onselectionModeChanged?: (value: CTableElementEventMap<any, any, any>['selectionModeChanged']) => void;
    onverticalGridVisibleChanged?: (value: CTableElementEventMap<any, any, any>['verticalGridVisibleChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-table': TableIntrinsicProps;
        }
    }
}
