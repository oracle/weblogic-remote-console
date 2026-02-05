"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputSensitiveTextWebElement = void 0;
const InputSensitiveTextWebElementBase_1 = require("./InputSensitiveTextWebElementBase");
const selenium_webdriver_1 = require("selenium-webdriver");
/**
 * The component WebElement for [oj-c-input-sensitive-text](../../jsdocs/oj-c.InputSensitiveText.html).
 * Do not instantiate this class directly, instead, use
 * [findInputSensitiveText](../functions/findInputSensitiveText.html).
 */
class InputSensitiveTextWebElement extends InputSensitiveTextWebElementBase_1.InputSensitiveTextWebElementBase {
    /**
     * Sets the value of the "value" property of the input component.
     * @param value The value to set for the <code>value</code>
     */
    async changeValue(value) {
        const readonly = await this.getReadonly();
        const disabled = await this.getDisabled();
        if (!(disabled || readonly)) {
            await this.getDriver().executeScript((el) => el.focus(), this);
            await this.whenBusyContextReady();
            // Note that using element.clear() will blur, which commits the change and calls
            // onValueChanged, which we don't want until we're done updating the value.
            // Instead do select-all, then delete to clear the value.
            const input = await this.findElement(selenium_webdriver_1.By.css('input'));
            const currValue = await this.getRawValue();
            if (currValue) {
                const platform = await (await this.getDriver().getCapabilities()).getPlatform();
                await input.sendKeys(platform === 'mac' ? selenium_webdriver_1.Key.COMMAND : selenium_webdriver_1.Key.CONTROL, 'a');
                await input.sendKeys(selenium_webdriver_1.Key.DELETE);
            }
            // Regular sendKeys does not work with InputSensitiveText, so we use the action
            // framework instead. This uses the native gestures framework of the drivers
            // and simulates keyboard entry. Note: actions.sendKeys doesn't target a specific
            // element - it just sends keys to the browser as though the user were to type it.
            // The input must have focus for it to work (which we already do earlier).
            const actions = this.getDriver().actions();
            value && (await actions.sendKeys(value).perform());
            return this.getDriver().executeScript((el) => el.validate(), this);
        }
    }
    /**
     * Clears the value of the component.
     */
    clear() {
        return this.changeValue(null);
    }
}
exports.InputSensitiveTextWebElement = InputSensitiveTextWebElement;
//# sourceMappingURL=InputSensitiveTextWebElement.js.map