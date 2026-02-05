import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-table WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, TableWebElement.ts.
 */
export declare class TableWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>layout</code> property.
     * The column sizing method used for the Table's columns.
     * @return The value of <code>layout</code> property.
     *
     */
    getLayout(): Promise<string>;
    /**
     * Gets the value of <code>columns</code> property.
     * The set of columns that can be displayed in the Table.
     * @return The value of <code>columns</code> property.
     *
     */
    getColumns(): Promise<object>;
    /**
     * Gets the value of <code>row</code> property.
     * A subset of attributes for controlling certain behaviors on a per row basis.
     * @return The value of <code>row</code> property.
     *
     */
    getRow(): Promise<Row>;
    /**
     * Gets the value of <code>horizontalGridVisible</code> property.
     * Controls the display of the Table's horizontal gridlines.
     * @return The value of <code>horizontalGridVisible</code> property.
     *
     */
    getHorizontalGridVisible(): Promise<string>;
    /**
     * Gets the value of <code>verticalGridVisible</code> property.
     * Controls the display of the Table's vertical gridlines.
     * @return The value of <code>verticalGridVisible</code> property.
     *
     */
    getVerticalGridVisible(): Promise<string>;
    /**
     * Sets the value of <code>selected</code> property.
     * The selected rows and/or columns. See the Help documentation for more information.
     * @param selected The value to set for <code>selected</code>
     *
     */
    changeSelected(selected: Selected): Promise<void>;
    /**
     * Gets the value of <code>selected</code> property.
     * The selected rows and/or columns. See the Help documentation for more information.
     * @return The value of <code>selected</code> property.
     *
     */
    getSelected(): Promise<Selected>;
    /**
     * Gets the value of <code>selectionMode</code> property.
     * Specifies whether row and/or column selection gestures are enabled on the Table, and the cardinality of each (single/multiple/multipleToggle/none).
     * @return The value of <code>selectionMode</code> property.
     *
     */
    getSelectionMode(): Promise<SelectionMode>;
    /**
     * Gets the value of <code>selectAllControl</code> property.
     * Controls the display of the Table's select all control when multiple or multipleToggle row selection is enabled.
     * @return The value of <code>selectAllControl</code> property.
     *
     */
    getSelectAllControl(): Promise<string>;
    /**
     * Sets the value of <code>columnOrder</code> property.
     * Display and order of columns. See the Help documentation for more information.
     * @param columnOrder The value to set for <code>columnOrder</code>
     *
     */
    changeColumnOrder(columnOrder: Array<string>): Promise<void>;
    /**
     * Gets the value of <code>columnOrder</code> property.
     * Display and order of columns. See the Help documentation for more information.
     * @return The value of <code>columnOrder</code> property.
     *
     */
    getColumnOrder(): Promise<Array<string>>;
    /**
     * Gets the value of <code>currentCellOverride</code> property.
     * The cell override to apply to the current cell of the Table. In order for this property to be honored, a new object instance must be set.
     * @return The value of <code>currentCellOverride</code> property.
     *
     */
    getCurrentCellOverride(): Promise<object>;
    /**
     * Gets the value of <code>currentCell</code> property.
     * The cell currently being used as the target for keyboard gestures made on the Table.
     * @return The value of <code>currentCell</code> property.
     *
     */
    getCurrentCell(): Promise<object>;
    /**
     * Sets the value of <code>columnWidths</code> property.
     * The desired widths of table columns. A record mapping column keys to numbers representing pixel widths for each column.
     * @param columnWidths The value to set for <code>columnWidths</code>
     *
     */
    changeColumnWidths(columnWidths: object): Promise<void>;
    /**
     * Gets the value of <code>columnWidths</code> property.
     * The desired widths of table columns. A record mapping column keys to numbers representing pixel widths for each column.
     * @return The value of <code>columnWidths</code> property.
     *
     */
    getColumnWidths(): Promise<object>;
    /**
     * Gets the value of <code>scrollPolicyOptions</code> property.
     * Options related to the Table's fetching and scrolling behaviors.
     * @return The value of <code>scrollPolicyOptions</code> property.
     *
     */
    getScrollPolicyOptions(): Promise<ScrollPolicyOptions>;
    /**
     * Gets the value of <code>columnResizeBehavior</code> property.
     * The column resize behavior this Table will utilize when column resizing is enabled on a given column.
     * @return The value of <code>columnResizeBehavior</code> property.
     *
     */
    getColumnResizeBehavior(): Promise<string>;
}
export interface Row {
    /**
     * The column key(s) to be used as the accessible row header(s) for assistive technologies. See the Help documentation for more information.
     */
    accessibleRowHeader: string | Array<string> | null;
}
export interface Selected {
    /**
     * The selected columns. See the Help documentation for more information.
     */
    column: object;
    /**
     * The selected rows. See the Help documentation for more information.
     */
    row: object;
}
export interface SelectionMode {
    /**
     * Specifies whether column selection gestures are enabled on the Table.
     */
    column: string;
    /**
     * Specifies whether row selection gestures are enabled on the Table.
     */
    row: string;
}
export interface ScrollPolicyOptions {
    /**
     * The number of records the Table will request during each data fetch.
     */
    fetchSize: number;
}
