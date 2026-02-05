import { CheckboxsetWebElementBase } from './CheckboxsetWebElementBase';
/**
 * The component WebElement for [oj-c-checkboxset](../../jsdocs/oj-c.Checkboxset.html).
 * Do not instantiate this class directly, instead, use
 * [findCheckboxset](../functions/findCheckboxset.html).
 */
export declare class CheckboxsetWebElement extends CheckboxsetWebElementBase {
    /**
     * Sets the value of "value" property for the Checkboxset component
     * @param value The value to set for "value"
     * @throws {ElementNotInteractableError} if the API is called when the control is readonly or disabled
     */
    changeValue(value: Array<string | number> | null): Promise<void>;
    /**
     * Checks if the Checkboxset is in interactable state
     */
    private isInteractable;
    private getInputsWithLabels;
    /**
     * Check checkboxes that have value within values array
     */
    private toggleValues;
}
