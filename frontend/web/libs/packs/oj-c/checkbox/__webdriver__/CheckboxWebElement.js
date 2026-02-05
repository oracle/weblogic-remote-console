"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckboxWebElement = void 0;
const CheckboxWebElementBase_1 = require("./CheckboxWebElementBase");
const selenium_webdriver_1 = require("selenium-webdriver");
/**
 * The component WebElement for [oj-c-checkbox](../../jsdocs/oj-c.Checkbox.html).
 * Do not instantiate this class directly, instead, use
 * [findCheckbox](../functions/findCheckbox.html).
 */
class CheckboxWebElement extends CheckboxWebElementBase_1.CheckboxWebElementBase {
    /**
     * Sets the value of "value" property for the Checkbox component
     * @param value The value to set for "value"
     * @throws {ElementNotInteractableError} if the API is called when the control is readonly or disabled
     */
    async changeValue(value) {
        // Check if the control is interactable
        if (!(await this.isInteractable())) {
            // Cannot interact when the control is disabled or readonly
            throw new selenium_webdriver_1.error.ElementNotInteractableError('oj-c-checkbox: Value cannot be changed when the control is disabled or readonly');
        }
        await this.whenBusyContextReady();
        await this.selectValue(value);
    }
    /**
     * Checks if the Checkbox is in interactable state
     */
    async isInteractable() {
        const isReadonly = await this.getReadonly();
        const isDisabled = await this.getDisabled();
        return !(isReadonly || isDisabled);
    }
    /**
     * Toggle Checkbox value if needed
     */
    async selectValue(value) {
        const label = await this.findElement(selenium_webdriver_1.By.css('label'));
        const input = await label.findElement(selenium_webdriver_1.By.css('input'));
        const checked = await input.isSelected();
        if (checked !== value) {
            await label.sendKeys(selenium_webdriver_1.Key.SPACE);
        }
    }
}
exports.CheckboxWebElement = CheckboxWebElement;
//# sourceMappingURL=CheckboxWebElement.js.map