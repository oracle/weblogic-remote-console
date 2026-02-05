"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-table WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, TableWebElement.ts.
 */
class TableWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>layout</code> property.
     * The column sizing method used for the Table's columns.
     * @return The value of <code>layout</code> property.
     *
     */
    getLayout() {
        return this.getProperty('layout');
    }
    /**
     * Gets the value of <code>columns</code> property.
     * The set of columns that can be displayed in the Table.
     * @return The value of <code>columns</code> property.
     *
     */
    getColumns() {
        return this.getProperty('columns');
    }
    /**
     * Gets the value of <code>row</code> property.
     * A subset of attributes for controlling certain behaviors on a per row basis.
     * @return The value of <code>row</code> property.
     *
     */
    getRow() {
        return this.getProperty('row');
    }
    /**
     * Gets the value of <code>horizontalGridVisible</code> property.
     * Controls the display of the Table's horizontal gridlines.
     * @return The value of <code>horizontalGridVisible</code> property.
     *
     */
    getHorizontalGridVisible() {
        return this.getProperty('horizontalGridVisible');
    }
    /**
     * Gets the value of <code>verticalGridVisible</code> property.
     * Controls the display of the Table's vertical gridlines.
     * @return The value of <code>verticalGridVisible</code> property.
     *
     */
    getVerticalGridVisible() {
        return this.getProperty('verticalGridVisible');
    }
    /**
     * Sets the value of <code>selected</code> property.
     * The selected rows and/or columns. See the Help documentation for more information.
     * @param selected The value to set for <code>selected</code>
     *
     */
    changeSelected(selected) {
        return this.setProperty('selected', selected);
    }
    /**
     * Gets the value of <code>selected</code> property.
     * The selected rows and/or columns. See the Help documentation for more information.
     * @return The value of <code>selected</code> property.
     *
     */
    getSelected() {
        return this.getProperty('selected');
    }
    /**
     * Gets the value of <code>selectionMode</code> property.
     * Specifies whether row and/or column selection gestures are enabled on the Table, and the cardinality of each (single/multiple/multipleToggle/none).
     * @return The value of <code>selectionMode</code> property.
     *
     */
    getSelectionMode() {
        return this.getProperty('selectionMode');
    }
    /**
     * Gets the value of <code>selectAllControl</code> property.
     * Controls the display of the Table's select all control when multiple or multipleToggle row selection is enabled.
     * @return The value of <code>selectAllControl</code> property.
     *
     */
    getSelectAllControl() {
        return this.getProperty('selectAllControl');
    }
    /**
     * Sets the value of <code>columnOrder</code> property.
     * Display and order of columns. See the Help documentation for more information.
     * @param columnOrder The value to set for <code>columnOrder</code>
     *
     */
    changeColumnOrder(columnOrder) {
        return this.setProperty('columnOrder', columnOrder);
    }
    /**
     * Gets the value of <code>columnOrder</code> property.
     * Display and order of columns. See the Help documentation for more information.
     * @return The value of <code>columnOrder</code> property.
     *
     */
    getColumnOrder() {
        return this.getProperty('columnOrder');
    }
    /**
     * Gets the value of <code>currentCellOverride</code> property.
     * The cell override to apply to the current cell of the Table. In order for this property to be honored, a new object instance must be set.
     * @return The value of <code>currentCellOverride</code> property.
     *
     */
    getCurrentCellOverride() {
        return this.getProperty('currentCellOverride');
    }
    /**
     * Gets the value of <code>currentCell</code> property.
     * The cell currently being used as the target for keyboard gestures made on the Table.
     * @return The value of <code>currentCell</code> property.
     *
     */
    getCurrentCell() {
        return this.getProperty('currentCell');
    }
    /**
     * Sets the value of <code>columnWidths</code> property.
     * The desired widths of table columns. A record mapping column keys to numbers representing pixel widths for each column.
     * @param columnWidths The value to set for <code>columnWidths</code>
     *
     */
    changeColumnWidths(columnWidths) {
        return this.setProperty('columnWidths', columnWidths);
    }
    /**
     * Gets the value of <code>columnWidths</code> property.
     * The desired widths of table columns. A record mapping column keys to numbers representing pixel widths for each column.
     * @return The value of <code>columnWidths</code> property.
     *
     */
    getColumnWidths() {
        return this.getProperty('columnWidths');
    }
    /**
     * Gets the value of <code>scrollPolicyOptions</code> property.
     * Options related to the Table's fetching and scrolling behaviors.
     * @return The value of <code>scrollPolicyOptions</code> property.
     *
     */
    getScrollPolicyOptions() {
        return this.getProperty('scrollPolicyOptions');
    }
    /**
     * Gets the value of <code>columnResizeBehavior</code> property.
     * The column resize behavior this Table will utilize when column resizing is enabled on a given column.
     * @return The value of <code>columnResizeBehavior</code> property.
     *
     */
    getColumnResizeBehavior() {
        return this.getProperty('columnResizeBehavior');
    }
}
exports.TableWebElementBase = TableWebElementBase;
//# sourceMappingURL=TableWebElementBase.js.map