"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectorWebElement = void 0;
exports.findSelector = findSelector;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const SelectorWebElement_1 = require("./SelectorWebElement");
Object.defineProperty(exports, "SelectorWebElement", { enumerable: true, get: function () { return SelectorWebElement_1.SelectorWebElement; } });
/**
 * Retrieve an instance of [SelectorWebElement](../classes/SelectorWebElement.html).
 * @example
 * ```javascript
 * import { findSelector } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findSelector(driver, By.id('my-oj-c-selector'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findSelector(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type SelectorWebElement
    if (!(webEl instanceof SelectorWebElement_1.SelectorWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'SelectorWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findSelector(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${SelectorWebElement_1.SelectorWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-selector', SelectorWebElement_1.SelectorWebElement);
//# sourceMappingURL=index.js.map