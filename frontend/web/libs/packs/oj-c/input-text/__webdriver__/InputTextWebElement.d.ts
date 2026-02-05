import { InputTextWebElementBase } from './InputTextWebElementBase';
/**
 * The component WebElement for [oj-c-input-text](../../jsdocs/oj-c.InputText.html).
 * Do not instantiate this class directly, instead, use
 * [findInputText](../functions/findInputText.html).
 */
export declare class InputTextWebElement extends InputTextWebElementBase {
    /**
     * Sets the value of the "value" property of the input component.
     * @param value The value to set for the <code>value</code>
     */
    changeValue(value: string | number | null): Promise<void>;
    /**
     * Clears the value of the component.
     */
    clear(): Promise<void>;
}
