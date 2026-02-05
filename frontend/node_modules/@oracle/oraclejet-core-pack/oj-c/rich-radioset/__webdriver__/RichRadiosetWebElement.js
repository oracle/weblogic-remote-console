"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichRadiosetWebElement = void 0;
const RichRadiosetWebElementBase_1 = require("./RichRadiosetWebElementBase");
const selenium_webdriver_1 = require("selenium-webdriver");
/**
 * The component WebElement for [oj-c-rich-radioset](../../jsdocs/oj-c.RichRadioset.html).
 * Do not instantiate this class directly, instead, use
 * [findRichRadioset](../functions/findRichRadioset.html).
 */
class RichRadiosetWebElement extends RichRadiosetWebElementBase_1.RichRadiosetWebElementBase {
    /**
     * Sets the value of "value" property for the Radioset component
     * @param value The value to set for "value"
     * @throws {ElementNotInteractableError} if the API is called when the control is readonly or disabled
     * @throws {InvalidArgumentError} if the value is non-existent
     */
    async changeValue(value) {
        // Check if the control is interactable
        if (!(await this.isInteractable())) {
            // Cannot interact when the control is disabled or readonly
            throw new selenium_webdriver_1.error.ElementNotInteractableError('oj-c-rich-radioset: Value cannot be changed when the control is disabled or readonly');
        }
        await this.whenBusyContextReady();
        // Get the oj-c-rich-radioset element using the value property
        const card = await this.getRadioCard(value);
        // If the label for the input was not found, then the provided value does not exist in the
        // oj-c-rich-radioset element
        if (card == null) {
            throw new selenium_webdriver_1.error.InvalidArgumentError(`oj-c-rich-radioset: ${value} is not a valid value.`);
        }
        await card?.click();
    }
    /**
     * Checks if the Radioset is in interactable state
     */
    async isInteractable() {
        const isReadonly = await this.getReadonly();
        const isDisabled = await this.getDisabled();
        return !(isReadonly || isDisabled);
    }
    /**
     * Finds the card of the input element for the provided value if it exists
     *
     * @param value The value for which the radio element has to be fetched
     * @returns The corresponding card of the input element if it exists, null otherwise
     */
    async getRadioCard(value) {
        return await this.getDriver().executeScript((element, searchValue) => {
            const inputElement = element.querySelector(`input[type="radio"][value="${searchValue}"]`);
            return inputElement?.closest('[role="listitem"]');
        }, this, value);
    }
}
exports.RichRadiosetWebElement = RichRadiosetWebElement;
//# sourceMappingURL=RichRadiosetWebElement.js.map