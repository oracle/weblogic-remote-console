"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckboxsetWebElement = void 0;
const CheckboxsetWebElementBase_1 = require("./CheckboxsetWebElementBase");
const selenium_webdriver_1 = require("selenium-webdriver");
/**
 * The component WebElement for [oj-c-checkboxset](../../jsdocs/oj-c.Checkboxset.html).
 * Do not instantiate this class directly, instead, use
 * [findCheckboxset](../functions/findCheckboxset.html).
 */
class CheckboxsetWebElement extends CheckboxsetWebElementBase_1.CheckboxsetWebElementBase {
    /**
     * Sets the value of "value" property for the Checkboxset component
     * @param value The value to set for "value"
     * @throws {ElementNotInteractableError} if the API is called when the control is readonly or disabled
     */
    async changeValue(value) {
        // Check if the control is interactable
        if (!(await this.isInteractable())) {
            // Cannot interact when the control is disabled or readonly
            throw new selenium_webdriver_1.error.ElementNotInteractableError('oj-c-checkboxset: Value cannot be changed when the control is disabled or readonly');
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
    async getInputsWithLabels() {
        const labelsAndInputs = [];
        const labels = await this.findElements(selenium_webdriver_1.By.css('label'));
        const promises = labels.map(async (label) => {
            const inputs = await label.findElements(selenium_webdriver_1.By.css('input'));
            // make sure the label is associated with an input
            if (inputs.length > 0) {
                labelsAndInputs.push({
                    label,
                    input: inputs[0]
                });
            }
        });
        await Promise.all(promises);
        return labelsAndInputs;
    }
    /**
     * Check checkboxes that have value within values array
     */
    async toggleValues(values) {
        const inputs = await this.getInputsWithLabels();
        const promises = inputs.map(async ({ label, input }) => {
            const value = await input.getAttribute('value');
            const isSelected = await input.isSelected();
            const isInValues = values?.includes(value);
            if ((isInValues && !isSelected) || (!isInValues && isSelected)) {
                // toggle checkbox
                await label.sendKeys(selenium_webdriver_1.Key.SPACE);
            }
        });
        await Promise.all(promises);
    }
}
exports.CheckboxsetWebElement = CheckboxsetWebElement;
//# sourceMappingURL=CheckboxsetWebElement.js.map