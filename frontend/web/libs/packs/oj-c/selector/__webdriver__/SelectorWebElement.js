"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectorWebElement = void 0;
const selenium_webdriver_1 = require("selenium-webdriver");
const SelectorWebElementBase_1 = require("./SelectorWebElementBase");
/**
 * The component WebElement for [oj-c-selector](../../jsdocs/oj-c.Selector.html).
 * Do not instantiate this class directly, instead, use
 * [findSelector](../functions/findSelector.html).
 */
class SelectorWebElement extends SelectorWebElementBase_1.SelectorWebElementBase {
    // Put overrides here
    /**
     * Gets the selected value of the selector.
     * @return boolean selection checked state.
     * Note test authors should not use this method to check whether an item is selected
     * when this is used with ListView or other collection components.
     * Rather, tests should use the test adapter method on ListView (or other collection) to get the selection
     * and check whether the item key is in it.
     */
    async isSelected() {
        const checkbox = await this.findElements(selenium_webdriver_1.By.xpath('.//input'));
        const l = checkbox[0].getAttribute('aria-checked');
        return (await l) === 'false' ? false : true;
    }
}
exports.SelectorWebElement = SelectorWebElement;
//# sourceMappingURL=SelectorWebElement.js.map