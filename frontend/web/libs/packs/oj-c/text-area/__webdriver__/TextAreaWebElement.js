"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextAreaWebElement = void 0;
const TextAreaWebElementBase_1 = require("./TextAreaWebElementBase");
const selenium_webdriver_1 = require("selenium-webdriver");
/**
 * The component WebElement for [oj-c-text-area](../../jsdocs/oj-c.TextArea.html).
 * Do not instantiate this class directly, instead, use
 * [findTextArea](../functions/findTextArea.html).
 */
class TextAreaWebElement extends TextAreaWebElementBase_1.TextAreaWebElementBase {
    /**
     * Sets the value of the "value" property of the input component.
     * @param value The value to set for the <code>value</code>
     */
    async changeValue(value) {
        const readonly = await this.getReadonly();
        const disabled = await this.getDisabled();
        if (!(disabled || readonly)) {
            await this.whenBusyContextReady();
            await this.getDriver().executeScript((el) => el.focus(), this);
            // Note that using element.clear() will blur, which commits the change and calls
            // onValueChanged, which we don't want until we're done updating the value.
            // Instead do select-all, then delete to clear the value.
            const input = await this.findElement(selenium_webdriver_1.By.css('textarea'));
            const currValue = await this.getRawValue();
            if (currValue) {
                const platform = await (await this.getDriver().getCapabilities()).getPlatform();
                await input.sendKeys(platform === 'mac' ? selenium_webdriver_1.Key.COMMAND : selenium_webdriver_1.Key.CONTROL, 'a');
                await input.sendKeys(selenium_webdriver_1.Key.DELETE);
            }
            value !== null && (await input.sendKeys(value));
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
exports.TextAreaWebElement = TextAreaWebElement;
//# sourceMappingURL=TextAreaWebElement.js.map