import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-card-view WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, CardViewWebElement.ts.
 */
export declare class CardViewWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>currentItem</code> property.
     * The item that currently has keyboard focus
     * @return The value of <code>currentItem</code> property.
     *
     */
    getCurrentItem(): Promise<string | number>;
    /**
     * Gets the value of <code>gutterSize</code> property.
     * Size of the gutter between columns and rows.
     * @return The value of <code>gutterSize</code> property.
     *
     */
    getGutterSize(): Promise<string>;
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
     * Type of selection behavior for the CardView
     * @return The value of <code>selectionMode</code> property.
     *
     */
    getSelectionMode(): Promise<string>;
    /**
     * Gets the value of <code>initialAnimation</code> property.
     * Specify animation when cards are initially rendered.
     * @return The value of <code>initialAnimation</code> property.
     *
     */
    getInitialAnimation(): Promise<string>;
    /**
     * Gets the value of <code>focusBehavior</code> property.
     * Specifies which focus behavior we should use for an item.
     * @return The value of <code>focusBehavior</code> property.
     *
     */
    getFocusBehavior(): Promise<string>;
    /**
     * Gets the value of <code>columns</code> property.
     * Specifies the exact number of columns to render.
     * @return The value of <code>columns</code> property.
     *
     */
    getColumns(): Promise<number | string>;
    /**
     * Gets the value of <code>reorderable</code> property.
     * Specify the item reordering functionality.
     * @return The value of <code>reorderable</code> property.
     *
     */
    getReorderable(): Promise<Reorderable>;
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
export interface Reorderable {
    /**
     *
     */
    items: string;
}
