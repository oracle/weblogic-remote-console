"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckboxsetWebElement = void 0;
exports.findCheckboxset = findCheckboxset;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const CheckboxsetWebElement_1 = require("./CheckboxsetWebElement");
Object.defineProperty(exports, "CheckboxsetWebElement", { enumerable: true, get: function () { return CheckboxsetWebElement_1.CheckboxsetWebElement; } });
/**
 * Retrieve an instance of [CheckboxsetWebElement](../classes/CheckboxsetWebElement.html).
 * @example
 * ```javascript
 * import { findCheckboxset } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findCheckboxset(driver, By.id('my-oj-c-checkboxset'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findCheckboxset(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type CheckboxsetWebElement
    if (!(webEl instanceof CheckboxsetWebElement_1.CheckboxsetWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'CheckboxsetWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findCheckboxset(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${CheckboxsetWebElement_1.CheckboxsetWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-checkboxset', CheckboxsetWebElement_1.CheckboxsetWebElement);
//# sourceMappingURL=index.js.map