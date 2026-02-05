"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonWebElement = void 0;
const ButtonWebElementBase_1 = require("./ButtonWebElementBase");
const PRIVATE_preact_webdriver_1 = require("../../../webdriver/PRIVATE_preact-webdriver");
const testing_1 = require("@oracle/oraclejet-preact/UNSAFE_Button/testing");
const UNSAFE_Locators_1 = require("@oracle/oraclejet-testing/UNSAFE_Locators");
/**
 * The component WebElement for [oj-c-button](../../jsdocs/oj-c.Button.html).
 * Do not instantiate this class directly, instead, use
 * [findButton](../functions/findButton.html).
 */
class ButtonWebElement extends ButtonWebElementBase_1.ButtonWebElementBase {
    /**
     * Perform a click on the button
     */
    doAction() {
        return this.click();
    }
    async click() {
        return (0, testing_1.findButton)((0, UNSAFE_Locators_1.byCss)('*'), (0, PRIVATE_preact_webdriver_1.getTestElement)(this)).doAction();
    }
}
exports.ButtonWebElement = ButtonWebElement;
//# sourceMappingURL=ButtonWebElement.js.map