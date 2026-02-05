import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-conveyor-belt WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, ConveyorBeltWebElement.ts.
 */
export declare class ConveyorBeltWebElementBase extends OjWebElement {
    /**
     * Sets the value of <code>scrollPosition</code> property.
     * Gets or sets the number of pixels that an element's content is scrolled from its initial position.
     * @param scrollPosition The value to set for <code>scrollPosition</code>
     *
     */
    changeScrollPosition(scrollPosition: number): Promise<void>;
    /**
     * Gets the value of <code>scrollPosition</code> property.
     * Gets or sets the number of pixels that an element's content is scrolled from its initial position.
     * @return The value of <code>scrollPosition</code> property.
     *
     */
    getScrollPosition(): Promise<number>;
    /**
     * Gets the value of <code>arrowVisibility</code> property.
     * Specifies visibility of overflow arrow buttons.
     * @return The value of <code>arrowVisibility</code> property.
     *
     */
    getArrowVisibility(): Promise<string>;
    /**
     * Gets the value of <code>items</code> property.
     * An array of data items or a data provider that returns the items for the ConveyorBelt.
     * @return The value of <code>items</code> property.
     *
     */
    getItems(): Promise<Array<object>>;
    /**
     * Gets the value of <code>orientation</code> property.
     *
     * @return The value of <code>orientation</code> property.
     *
     */
    getOrientation(): Promise<string>;
}
