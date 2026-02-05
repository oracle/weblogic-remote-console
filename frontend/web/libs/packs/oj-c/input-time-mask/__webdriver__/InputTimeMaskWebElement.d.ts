import { InputTimeMaskWebElementBase } from './InputTimeMaskWebElementBase';
/**
 * The component WebElement for [oj-c-input-time-mask](../../jsdocs/oj-c.InputTimeMask.html).
 * Do not instantiate this class directly, instead, use
 * [findInputTimeMask](../functions/findInputTimeMask.html).
 */
export declare class InputTimeMaskWebElement extends InputTimeMaskWebElementBase {
    /**
     * Sets the value of the "value" property of the input component.
     * @param value The value to set for the <code>value</code>
     */
    changeValue(value: string | null): Promise<void>;
    /**
     * Clears the value of the component.
     */
    clear(): Promise<void>;
}
