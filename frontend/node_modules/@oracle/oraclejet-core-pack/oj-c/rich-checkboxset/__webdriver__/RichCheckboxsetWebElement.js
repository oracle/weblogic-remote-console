"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichCheckboxsetWebElement = void 0;
const RichCheckboxsetWebElementBase_1 = require("./RichCheckboxsetWebElementBase");
const selenium_webdriver_1 = require("selenium-webdriver");
/**
 * The component WebElement for [oj-c-rich-checkboxset](../../jsdocs/oj-c.RichCheckboxset.html).
 * Do not instantiate this class directly, instead, use
 * [findRichCheckboxset](../functions/findRichCheckboxset.html).
 */
class RichCheckboxsetWebElement extends RichCheckboxsetWebElementBase_1.RichCheckboxsetWebElementBase {
    /**
     * Sets the value of "value" property for the RichCheckboxset component
     * @param value The value to set for "value"
     * @throws {ElementNotInteractableError} if the API is called when the control is readonly or disabled
     */
    async changeValue(value) {
        // Check if the control is interactable
        if (!(await this.isInteractable())) {
            // Cannot interact when the control is disabled or readonly
            throw new selenium_webdriver_1.error.ElementNotInteractableError('oj-c-rich-checkboxset: Value cannot be changed when the control is disabled or readonly');
        }
        await this.whenBusyContextReady();
        await this.toggleValues(value);
    }
    /**
     * Checks if the Checkboxset is in interactable state
     */
    async isInteractable() {
        const isReadonly = await this.getReadonly();
        const isDisabled = await this.getDisabled();
        return !(isReadonly || isDisabled);
    }
    async getInputsWithCards() {
        const cards = await this.findElements(selenium_webdriver_1.By.xpath('//*[@role="listitem"]'));
        const cardsAndInputs = [];
        const promises = cards.map(async (card) => {
            const input = await card.findElement(selenium_webdriver_1.By.css('input'));
            cardsAndInputs.push({
                card,
                input
            });
        });
        await Promise.all(promises);
        return cardsAndInputs;
    }
    /**
     * Check checkboxes that have value within values array
     */
    async toggleValues(values) {
        const inputs = await this.getInputsWithCards();
        const promises = inputs.map(async ({ card, input }) => {
            const value = await input.getAttribute('value');
            const isSelected = await input.isSelected();
            const isInValues = values?.includes(value);
            if ((isInValues && !isSelected) || (!isInValues && isSelected)) {
                // toggle checkbox
                await card.click();
            }
        });
        await Promise.all(promises);
    }
}
exports.RichCheckboxsetWebElement = RichCheckboxsetWebElement;
//# sourceMappingURL=RichCheckboxsetWebElement.js.map