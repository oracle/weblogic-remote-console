import { InputDatePickerWebElementBase } from './InputDatePickerWebElementBase';
/**
 * The component WebElement for [oj-c-input-date-picker](../../jsdocs/oj-c.InputDatePicker.html).
 * Do not instantiate this class directly, instead, use
 * [findInputDatePicker](../functions/findInputDatePicker.html).
 */
export declare class InputDatePickerWebElement extends InputDatePickerWebElementBase {
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
