"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressButtonWebElement = void 0;
const ProgressButtonWebElementBase_1 = require("./ProgressButtonWebElementBase");
const selenium_webdriver_1 = require("selenium-webdriver");
/**
 * The component WebElement for [oj-c-progress-button](../../jsdocs/oj-c.ProgressButton.html).
 * Do not instantiate this class directly, instead, use
 * [findProgressButton](../functions/findProgressButton.html).
 */
class ProgressButtonWebElement extends ProgressButtonWebElementBase_1.ProgressButtonWebElementBase {
    // Put overrides here
    /**
     * Perform a click on the button
     */
    doAction() {
        return this.click();
    }
    /**
     * Perform a click on the button
     */
    async click() {
        // Find the <button> element to click so that it can receive focus
        const button = await this.findElement(selenium_webdriver_1.By.css('button'));
        return button.click();
    }
}
exports.ProgressButtonWebElement = ProgressButtonWebElement;
//# sourceMappingURL=ProgressButtonWebElement.js.map