"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputDateMaskWebElement = void 0;
exports.findInputDateMask = findInputDateMask;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const InputDateMaskWebElement_1 = require("./InputDateMaskWebElement");
Object.defineProperty(exports, "InputDateMaskWebElement", { enumerable: true, get: function () { return InputDateMaskWebElement_1.InputDateMaskWebElement; } });
/**
 * Retrieve an instance of [InputDateMaskWebElement](../classes/InputDateMaskWebElement.html).
 * @example
 * ```javascript
 * import { findInputDateMask } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findInputDateMask(driver, By.id('my-oj-c-input-date-mask'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findInputDateMask(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type InputDateMaskWebElement
    if (!(webEl instanceof InputDateMaskWebElement_1.InputDateMaskWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'InputDateMaskWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findInputDateMask(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${InputDateMaskWebElement_1.InputDateMaskWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-input-date-mask', InputDateMaskWebElement_1.InputDateMaskWebElement);
//# sourceMappingURL=index.js.map