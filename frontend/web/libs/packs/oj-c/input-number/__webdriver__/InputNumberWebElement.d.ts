import { InputNumberWebElementBase } from './InputNumberWebElementBase';
/**
 * The component WebElement for [oj-c-input-number](../../jsdocs/oj-c.InputNumber.html).
 * Do not instantiate this class directly, instead, use
 * [findInputNumber](../functions/findInputNumber.html).
 */
export declare class InputNumberWebElement extends InputNumberWebElementBase {
    /**
     * Sets the value of the "value" property of the input component.
     * @param value The value to set for the <code>value</code>
     */
    changeValue(value: number | null): Promise<void>;
    /**
     * Clears the value of the component.
     */
    clear(): Promise<void>;
}
