"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonsetSingleWebElement = void 0;
exports.findButtonsetSingle = findButtonsetSingle;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const ButtonsetSingleWebElement_1 = require("./ButtonsetSingleWebElement");
Object.defineProperty(exports, "ButtonsetSingleWebElement", { enumerable: true, get: function () { return ButtonsetSingleWebElement_1.ButtonsetSingleWebElement; } });
/**
 * Retrieve an instance of [ButtonsetSingleWebElement](../classes/ButtonsetSingleWebElement.html).
 * @example
 * ```javascript
 * import { findButtonsetSingle } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findButtonsetSingle(driver, By.id('my-oj-c-buttonset-single'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findButtonsetSingle(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type ButtonsetSingleWebElement
    if (!(webEl instanceof ButtonsetSingleWebElement_1.ButtonsetSingleWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'ButtonsetSingleWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findButtonsetSingle(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${ButtonsetSingleWebElement_1.ButtonsetSingleWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-buttonset-single', ButtonsetSingleWebElement_1.ButtonsetSingleWebElement);
//# sourceMappingURL=index.js.map