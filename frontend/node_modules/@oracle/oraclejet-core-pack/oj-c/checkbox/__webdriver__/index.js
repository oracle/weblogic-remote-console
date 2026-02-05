"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckboxWebElement = void 0;
exports.findCheckbox = findCheckbox;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const CheckboxWebElement_1 = require("./CheckboxWebElement");
Object.defineProperty(exports, "CheckboxWebElement", { enumerable: true, get: function () { return CheckboxWebElement_1.CheckboxWebElement; } });
/**
 * Retrieve an instance of [CheckboxWebElement](../classes/CheckboxWebElement.html).
 * @example
 * ```javascript
 * import { findCheckbox } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findCheckbox(driver, By.id('my-oj-c-checkbox'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findCheckbox(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type CheckboxWebElement
    if (!(webEl instanceof CheckboxWebElement_1.CheckboxWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'CheckboxWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findCheckbox(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${CheckboxWebElement_1.CheckboxWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-checkbox', CheckboxWebElement_1.CheckboxWebElement);
//# sourceMappingURL=index.js.map