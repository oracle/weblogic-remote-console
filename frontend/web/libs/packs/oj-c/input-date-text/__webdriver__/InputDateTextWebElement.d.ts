import { InputDateTextWebElementBase } from './InputDateTextWebElementBase';
/**
 * The component WebElement for [oj-c-input-date-text](../../jsdocs/oj-c.InputDateText.html).
 * Do not instantiate this class directly, instead, use
 * [findInputDateText](../functions/findInputDateText.html).
 */
export declare class InputDateTextWebElement extends InputDateTextWebElementBase {
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
