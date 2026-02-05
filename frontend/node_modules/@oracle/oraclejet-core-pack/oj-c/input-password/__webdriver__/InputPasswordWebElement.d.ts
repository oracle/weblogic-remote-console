import { InputPasswordWebElementBase } from './InputPasswordWebElementBase';
/**
 * The component WebElement for [oj-c-input-password](../../jsdocs/oj-c.InputPassword.html).
 * Do not instantiate this class directly, instead, use
 * [findInputPassword](../functions/findInputPassword.html).
 */
export declare class InputPasswordWebElement extends InputPasswordWebElementBase {
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
