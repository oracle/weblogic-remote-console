import { CheckboxWebElementBase } from './CheckboxWebElementBase';
/**
 * The component WebElement for [oj-c-checkbox](../../jsdocs/oj-c.Checkbox.html).
 * Do not instantiate this class directly, instead, use
 * [findCheckbox](../functions/findCheckbox.html).
 */
export declare class CheckboxWebElement extends CheckboxWebElementBase {
    /**
     * Sets the value of "value" property for the Checkbox component
     * @param value The value to set for "value"
     * @throws {ElementNotInteractableError} if the API is called when the control is readonly or disabled
     */
    changeValue(value: boolean): Promise<void>;
    /**
     * Checks if the Checkbox is in interactable state
     */
    private isInteractable;
    /**
     * Toggle Checkbox value if needed
     */
    private selectValue;
}
