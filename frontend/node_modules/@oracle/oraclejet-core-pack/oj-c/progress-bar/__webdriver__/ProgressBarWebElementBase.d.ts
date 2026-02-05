import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-progress-bar WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, ProgressBarWebElement.ts.
 */
export declare class ProgressBarWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>max</code> property.
     * The maximum allowed value.
     * @return The value of <code>max</code> property.
     *
     */
    getMax(): Promise<number>;
    /**
     * Gets the value of <code>value</code> property.
     * The value of the Progress Bar.
     * @return The value of <code>value</code> property.
     *
     */
    getValue(): Promise<number>;
    /**
     * Gets the value of <code>edge</code> property.
     * Specifies whether the progress bar is on the top edge of a container
     * @return The value of <code>edge</code> property.
     *
     */
    getEdge(): Promise<string>;
}
