import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-list-view WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, ListViewWebElement.ts.
 */
export declare class ListViewWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>currentItem</code> property.
     * The key of the item that currently has keyboard focus
     * @return The value of <code>currentItem</code> property.
     *
     */
    getCurrentItem(): Promise<string | number>;
    /**
     * Gets the value of <code>currentItemOverride</code> property.
     * The key of the item that will have keyboard focus
     * @return The value of <code>currentItemOverride</code> property.
     *
     */
    getCurrentItemOverride(): Promise<CurrentItemOverride>;
    /**
     * Gets the value of <code>gridlines</code> property.
     * Specifies whether the grid lines should be visible.
     * @return The value of <code>gridlines</code> property.
     *
     */
    getGridlines(): Promise<Gridlines>;
    /**
     * Gets the value of <code>scrollPolicyOptions</code> property.
     * Specifies fetch options for scrolling behaviors that trigger data fetches.
     * @return The value of <code>scrollPolicyOptions</code> property.
     *
     */
    getScrollPolicyOptions(): Promise<ScrollPolicyOptions>;
    /**
     * Sets the value of <code>selected</code> property.
     * The selected property
     * @param selected The value to set for <code>selected</code>
     *
     */
    changeSelected(selected: object): Promise<void>;
    /**
     * Gets the value of <code>selected</code> property.
     * The selected property
     * @return The value of <code>selected</code> property.
     *
     */
    getSelected(): Promise<object>;
    /**
     * Gets the value of <code>selectionMode</code> property.
     * Type of selection behavior for the ListView
     * @return The value of <code>selectionMode</code> property.
     *
     */
    getSelectionMode(): Promise<string>;
    /**
     * Gets the value of <code>contextMenuConfig</code> property.
     * Specifies a context menu configuration.
     * @return The value of <code>contextMenuConfig</code> property.
     *
     */
    getContextMenuConfig(): Promise<ContextMenuConfig>;
    /**
     * Gets the value of <code>reorderable</code> property.
     * Specify the item reordering functionality.
     * @return The value of <code>reorderable</code> property.
     *
     */
    getReorderable(): Promise<Reorderable>;
    /**
     * Gets the value of <code>item</code> property.
     * The item option contains a subset of options for items.
     * @return The value of <code>item</code> property.
     *
     */
    getItem(): Promise<Item>;
}
export interface CurrentItemOverride {
    /**
     *
     */
    rowKey: string | number;
}
export interface Gridlines {
    /**
     *
     */
    item: string;
    /**
     *
     */
    top: string;
    /**
     *
     */
    bottom: string;
}
export interface ScrollPolicyOptions {
    /**
     *
     */
    fetchSize: number;
    /**
     *
     */
    scroller: string;
}
export interface ContextMenuConfig {
    /**
     *
     */
    accessibleLabel: string;
}
export interface Reorderable {
    /**
     *
     */
    items: string;
}
export interface Item {
    /**
     * It controls the padding around the list item
     */
    padding: string | object;
    /**
     * It controls the focus behavior when enter key is pressed on an item
     */
    enterKeyFocusBehavior: string;
}
