"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectSingleWebElement = void 0;
exports.findSelectSingle = findSelectSingle;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const SelectSingleWebElement_1 = require("./SelectSingleWebElement");
Object.defineProperty(exports, "SelectSingleWebElement", { enumerable: true, get: function () { return SelectSingleWebElement_1.SelectSingleWebElement; } });
/**
 * Retrieve an instance of [SelectSingleWebElement](../classes/SelectSingleWebElement.html).
 * @example
 * ```javascript
 * import { findSelectSingle } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findSelectSingle(driver, By.id('my-oj-c-select-single'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findSelectSingle(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type SelectSingleWebElement
    if (!(webEl instanceof SelectSingleWebElement_1.SelectSingleWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'SelectSingleWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findSelectSingle(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${SelectSingleWebElement_1.SelectSingleWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-select-single', SelectSingleWebElement_1.SelectSingleWebElement);
//# sourceMappingURL=index.js.map