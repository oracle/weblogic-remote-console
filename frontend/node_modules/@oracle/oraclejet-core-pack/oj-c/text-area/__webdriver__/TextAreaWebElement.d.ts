import { TextAreaWebElementBase } from './TextAreaWebElementBase';
/**
 * The component WebElement for [oj-c-text-area](../../jsdocs/oj-c.TextArea.html).
 * Do not instantiate this class directly, instead, use
 * [findTextArea](../functions/findTextArea.html).
 */
export declare class TextAreaWebElement extends TextAreaWebElementBase {
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
