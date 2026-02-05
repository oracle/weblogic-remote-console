import { RichCheckboxsetWebElementBase } from './RichCheckboxsetWebElementBase';
/**
 * The component WebElement for [oj-c-rich-checkboxset](../../jsdocs/oj-c.RichCheckboxset.html).
 * Do not instantiate this class directly, instead, use
 * [findRichCheckboxset](../functions/findRichCheckboxset.html).
 */
export declare class RichCheckboxsetWebElement extends RichCheckboxsetWebElementBase {
    /**
     * Sets the value of "value" property for the RichCheckboxset component
     * @param value The value to set for "value"
     * @throws {ElementNotInteractableError} if the API is called when the control is readonly or disabled
     */
    changeValue(value: Array<string | number> | null): Promise<void>;
    /**
     * Checks if the Checkboxset is in interactable state
     */
    private isInteractable;
    private getInputsWithCards;
    /**
     * Check checkboxes that have value within values array
     */
    private toggleValues;
}
