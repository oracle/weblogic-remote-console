"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabBarWebElement = void 0;
exports.findTabBar = findTabBar;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const TabBarWebElement_1 = require("./TabBarWebElement");
Object.defineProperty(exports, "TabBarWebElement", { enumerable: true, get: function () { return TabBarWebElement_1.TabBarWebElement; } });
/**
 * Retrieve an instance of [TabBarWebElement](../classes/TabBarWebElement.html).
 * @example
 * ```javascript
 * import { findTabBar } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findTabBar(driver, By.id('my-oj-c-tab-bar'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findTabBar(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type TabBarWebElement
    if (!(webEl instanceof TabBarWebElement_1.TabBarWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'TabBarWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findTabBar(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${TabBarWebElement_1.TabBarWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-tab-bar', TabBarWebElement_1.TabBarWebElement);
//# sourceMappingURL=index.js.map