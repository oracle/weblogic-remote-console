"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectorAllWebElement = void 0;
exports.findSelectorAll = findSelectorAll;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const SelectorAllWebElement_1 = require("./SelectorAllWebElement");
Object.defineProperty(exports, "SelectorAllWebElement", { enumerable: true, get: function () { return SelectorAllWebElement_1.SelectorAllWebElement; } });
/**
 * Retrieve an instance of [SelectorAllWebElement](../classes/SelectorAllWebElement.html).
 * @example
 * ```javascript
 * import { findSelectorAll } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findSelectorAll(driver, By.id('my-oj-c-selector-all'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findSelectorAll(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type SelectorAllWebElement
    if (!(webEl instanceof SelectorAllWebElement_1.SelectorAllWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'SelectorAllWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findSelectorAll(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${SelectorAllWebElement_1.SelectorAllWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-selector-all', SelectorAllWebElement_1.SelectorAllWebElement);
//# sourceMappingURL=index.js.map