"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputTextWebElement = void 0;
exports.findInputText = findInputText;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const InputTextWebElement_1 = require("./InputTextWebElement");
Object.defineProperty(exports, "InputTextWebElement", { enumerable: true, get: function () { return InputTextWebElement_1.InputTextWebElement; } });
/**
 * Retrieve an instance of [InputTextWebElement](../classes/InputTextWebElement.html).
 * @example
 * ```javascript
 * import { findInputText } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findInputText(driver, By.id('my-oj-c-input-text'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findInputText(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type InputTextWebElement
    if (!(webEl instanceof InputTextWebElement_1.InputTextWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'InputTextWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findInputText(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${InputTextWebElement_1.InputTextWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-input-text', InputTextWebElement_1.InputTextWebElement);
//# sourceMappingURL=index.js.map