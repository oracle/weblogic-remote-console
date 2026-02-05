import { InputSensitiveTextWebElementBase } from './InputSensitiveTextWebElementBase';
/**
 * The component WebElement for [oj-c-input-sensitive-text](../../jsdocs/oj-c.InputSensitiveText.html).
 * Do not instantiate this class directly, instead, use
 * [findInputSensitiveText](../functions/findInputSensitiveText.html).
 */
export declare class InputSensitiveTextWebElement extends InputSensitiveTextWebElementBase {
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
