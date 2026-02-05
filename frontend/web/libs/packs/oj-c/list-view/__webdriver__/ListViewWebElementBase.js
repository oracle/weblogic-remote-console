"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListViewWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-list-view WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, ListViewWebElement.ts.
 */
class ListViewWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>currentItem</code> property.
     * The key of the item that currently has keyboard focus
     * @return The value of <code>currentItem</code> property.
     *
     */
    getCurrentItem() {
        return this.getProperty('currentItem');
    }
    /**
     * Gets the value of <code>currentItemOverride</code> property.
     * The key of the item that will have keyboard focus
     * @return The value of <code>currentItemOverride</code> property.
     *
     */
    getCurrentItemOverride() {
        return this.getProperty('currentItemOverride');
    }
    /**
     * Gets the value of <code>gridlines</code> property.
     * Specifies whether the grid lines should be visible.
     * @return The value of <code>gridlines</code> property.
     *
     */
    getGridlines() {
        return this.getProperty('gridlines');
    }
    /**
     * Gets the value of <code>scrollPolicyOptions</code> property.
     * Specifies fetch options for scrolling behaviors that trigger data fetches.
     * @return The value of <code>scrollPolicyOptions</code> property.
     *
     */
    getScrollPolicyOptions() {
        return this.getProperty('scrollPolicyOptions');
    }
    /**
     * Sets the value of <code>selected</code> property.
     * The selected property
     * @param selected The value to set for <code>selected</code>
     *
     */
    changeSelected(selected) {
        return this.setProperty('selected', selected);
    }
    /**
     * Gets the value of <code>selected</code> property.
     * The selected property
     * @return The value of <code>selected</code> property.
     *
     */
    getSelected() {
        return this.getProperty('selected');
    }
    /**
     * Gets the value of <code>selectionMode</code> property.
     * Type of selection behavior for the ListView
     * @return The value of <code>selectionMode</code> property.
     *
     */
    getSelectionMode() {
        return this.getProperty('selectionMode');
    }
    /**
     * Gets the value of <code>contextMenuConfig</code> property.
     * Specifies a context menu configuration.
     * @return The value of <code>contextMenuConfig</code> property.
     *
     */
    getContextMenuConfig() {
        return this.getProperty('contextMenuConfig');
    }
    /**
     * Gets the value of <code>reorderable</code> property.
     * Specify the item reordering functionality.
     * @return The value of <code>reorderable</code> property.
     *
     */
    getReorderable() {
        return this.getProperty('reorderable');
    }
    /**
     * Gets the value of <code>item</code> property.
     * The item option contains a subset of options for items.
     * @return The value of <code>item</code> property.
     *
     */
    getItem() {
        return this.getProperty('item');
    }
}
exports.ListViewWebElementBase = ListViewWebElementBase;
//# sourceMappingURL=ListViewWebElementBase.js.map