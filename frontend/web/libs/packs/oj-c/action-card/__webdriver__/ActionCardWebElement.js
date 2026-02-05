"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionCardWebElement = void 0;
const ActionCardWebElementBase_1 = require("./ActionCardWebElementBase");
const selenium_webdriver_1 = require("selenium-webdriver");
/**
 * The component WebElement for [oj-c-action-card](../../jsdocs/oj-c.ActionCard.html).
 * Do not instantiate this class directly, instead, use
 * [findActionCard](../functions/findActionCard.html).
 */
class ActionCardWebElement extends ActionCardWebElementBase_1.ActionCardWebElementBase {
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
        const button = await this.findElement(selenium_webdriver_1.By.css('[role=button]'));
        return button.click();
    }
}
exports.ActionCardWebElement = ActionCardWebElement;
//# sourceMappingURL=ActionCardWebElement.js.map