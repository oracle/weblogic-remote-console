"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonsetMultipleWebElement = void 0;
exports.findButtonsetMultiple = findButtonsetMultiple;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const ButtonsetMultipleWebElement_1 = require("./ButtonsetMultipleWebElement");
Object.defineProperty(exports, "ButtonsetMultipleWebElement", { enumerable: true, get: function () { return ButtonsetMultipleWebElement_1.ButtonsetMultipleWebElement; } });
/**
 * Retrieve an instance of [ButtonsetMultipleWebElement](../classes/ButtonsetMultipleWebElement.html).
 * @example
 * ```javascript
 * import { findButtonsetMultiple } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findButtonsetMultiple(driver, By.id('my-oj-c-buttonset-multiple'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findButtonsetMultiple(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type ButtonsetMultipleWebElement
    if (!(webEl instanceof ButtonsetMultipleWebElement_1.ButtonsetMultipleWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'ButtonsetMultipleWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findButtonsetMultiple(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${ButtonsetMultipleWebElement_1.ButtonsetMultipleWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-buttonset-multiple', ButtonsetMultipleWebElement_1.ButtonsetMultipleWebElement);
//# sourceMappingURL=index.js.map