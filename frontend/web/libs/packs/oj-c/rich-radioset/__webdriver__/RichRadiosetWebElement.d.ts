import { RichRadiosetWebElementBase } from './RichRadiosetWebElementBase';
/**
 * The component WebElement for [oj-c-rich-radioset](../../jsdocs/oj-c.RichRadioset.html).
 * Do not instantiate this class directly, instead, use
 * [findRichRadioset](../functions/findRichRadioset.html).
 */
export declare class RichRadiosetWebElement extends RichRadiosetWebElementBase {
    /**
     * Sets the value of "value" property for the Radioset component
     * @param value The value to set for "value"
     * @throws {ElementNotInteractableError} if the API is called when the control is readonly or disabled
     * @throws {InvalidArgumentError} if the value is non-existent
     */
    changeValue(value: any): Promise<void>;
    /**
     * Checks if the Radioset is in interactable state
     */
    private isInteractable;
    /**
     * Finds the card of the input element for the provided value if it exists
     *
     * @param value The value for which the radio element has to be fetched
     * @returns The corresponding card of the input element if it exists, null otherwise
     */
    private getRadioCard;
}
