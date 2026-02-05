import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-progress-circle WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, ProgressCircleWebElement.ts.
 */
export declare class ProgressCircleWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>max</code> property.
     * The maximum allowed value.
     * @return The value of <code>max</code> property.
     *
     */
    getMax(): Promise<number>;
    /**
     * Gets the value of <code>value</code> property.
     * The value of the Progress Circle.
     * @return The value of <code>value</code> property.
     *
     */
    getValue(): Promise<number>;
    /**
     * Gets the value of <code>size</code> property.
     * Specifies the size of the progress circle.
     * @return The value of <code>size</code> property.
     *
     */
    getSizeProperty(): Promise<string>;
}
