"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabBarMixedWebElement = void 0;
exports.findTabBarMixed = findTabBarMixed;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const TabBarMixedWebElement_1 = require("./TabBarMixedWebElement");
Object.defineProperty(exports, "TabBarMixedWebElement", { enumerable: true, get: function () { return TabBarMixedWebElement_1.TabBarMixedWebElement; } });
/**
 * Retrieve an instance of [TabBarMixedWebElement](../classes/TabBarMixedWebElement.html).
 * @example
 * ```javascript
 * import { findTabBarMixed } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findTabBarMixed(driver, By.id('my-oj-c-tab-bar-mixed'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findTabBarMixed(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type TabBarMixedWebElement
    if (!(webEl instanceof TabBarMixedWebElement_1.TabBarMixedWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'TabBarMixedWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findTabBarMixed(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${TabBarMixedWebElement_1.TabBarMixedWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-tab-bar-mixed', TabBarMixedWebElement_1.TabBarMixedWebElement);
//# sourceMappingURL=index.js.map