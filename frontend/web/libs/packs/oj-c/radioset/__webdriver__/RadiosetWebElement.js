"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadiosetWebElement = void 0;
const RadiosetWebElementBase_1 = require("./RadiosetWebElementBase");
const selenium_webdriver_1 = require("selenium-webdriver");
/**
 * The component WebElement for [oj-c-radioset](../../jsdocs/oj-c.Radioset.html).
 * Do not instantiate this class directly, instead, use
 * [findRadioset](../functions/findRadioset.html).
 */
class RadiosetWebElement extends RadiosetWebElementBase_1.RadiosetWebElementBase {
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
            throw new selenium_webdriver_1.error.ElementNotInteractableError('oj-c-radioset: Value cannot be changed when the control is disabled or readonly');
        }
        await this.whenBusyContextReady();
        // Get the oj-c-radioset element using the value property
        const label = await this.getRadioItemLabel(value);
        // If the label for the input was not found, then the provided value does not exist in the
        // oj-c-radioset element
        if (label == null) {
            throw new selenium_webdriver_1.error.InvalidArgumentError(`oj-c-radioset: ${value} is not a valid value.`);
        }
        await label?.click();
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
     * Finds the label of the input element for the provided value if it exists
     *
     * @param value The value for which the radio element has to be fetched
     * @returns The corresponding label of the input element if it exists, null otherwise
     */
    async getRadioItemLabel(value) {
        return await this.getDriver().executeScript((element, searchValue) => {
            const result = element.querySelector(`input[type="radio"][value="${searchValue}"]`);
            return result?.closest('label');
        }, this, value);
    }
}
exports.RadiosetWebElement = RadiosetWebElement;
//# sourceMappingURL=RadiosetWebElement.js.map