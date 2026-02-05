"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputDateTextWebElement = void 0;
exports.findInputDateText = findInputDateText;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const InputDateTextWebElement_1 = require("./InputDateTextWebElement");
Object.defineProperty(exports, "InputDateTextWebElement", { enumerable: true, get: function () { return InputDateTextWebElement_1.InputDateTextWebElement; } });
/**
 * Retrieve an instance of [InputDateTextWebElement](../classes/InputDateTextWebElement.html).
 * @example
 * ```javascript
 * import { findInputDateText } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findInputDateText(driver, By.id('my-oj-c-input-date-text'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findInputDateText(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type InputDateTextWebElement
    if (!(webEl instanceof InputDateTextWebElement_1.InputDateTextWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'InputDateTextWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findInputDateText(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${InputDateTextWebElement_1.InputDateTextWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-input-date-text', InputDateTextWebElement_1.InputDateTextWebElement);
//# sourceMappingURL=index.js.map