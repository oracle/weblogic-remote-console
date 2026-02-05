"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectorAllWebElement = void 0;
const selenium_webdriver_1 = require("selenium-webdriver");
const SelectorAllWebElementBase_1 = require("./SelectorAllWebElementBase");
/**
 * The component WebElement for [oj-c-selector-all](../../jsdocs/oj-c.SelectorAll.html).
 * Do not instantiate this class directly, instead, use
 * [findSelectorAll](../functions/findSelectorAll.html).
 */
class SelectorAllWebElement extends SelectorAllWebElementBase_1.SelectorAllWebElementBase {
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
        const checkbox = await this.findElement(selenium_webdriver_1.By.xpath('.//input'));
        const l = checkbox.getAttribute('aria-checked');
        return (await l) === 'false' ? false : true;
    }
}
exports.SelectorAllWebElement = SelectorAllWebElement;
//# sourceMappingURL=SelectorAllWebElement.js.map