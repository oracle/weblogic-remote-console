"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputTimeMaskWebElement = void 0;
exports.findInputTimeMask = findInputTimeMask;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const InputTimeMaskWebElement_1 = require("./InputTimeMaskWebElement");
Object.defineProperty(exports, "InputTimeMaskWebElement", { enumerable: true, get: function () { return InputTimeMaskWebElement_1.InputTimeMaskWebElement; } });
/**
 * Retrieve an instance of [InputTimeMaskWebElement](../classes/InputTimeMaskWebElement.html).
 * @example
 * ```javascript
 * import { findInputTimeMask } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findInputTimeMask(driver, By.id('my-oj-c-input-time-mask'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findInputTimeMask(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type InputTimeMaskWebElement
    if (!(webEl instanceof InputTimeMaskWebElement_1.InputTimeMaskWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'InputTimeMaskWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findInputTimeMask(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${InputTimeMaskWebElement_1.InputTimeMaskWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-input-time-mask', InputTimeMaskWebElement_1.InputTimeMaskWebElement);
//# sourceMappingURL=index.js.map