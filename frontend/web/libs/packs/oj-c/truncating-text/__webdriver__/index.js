"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TruncatingTextWebElement = void 0;
exports.findTruncatingText = findTruncatingText;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const TruncatingTextWebElement_1 = require("./TruncatingTextWebElement");
Object.defineProperty(exports, "TruncatingTextWebElement", { enumerable: true, get: function () { return TruncatingTextWebElement_1.TruncatingTextWebElement; } });
/**
 * Retrieve an instance of [TruncatingTextWebElement](../classes/TruncatingTextWebElement.html).
 * @example
 * ```javascript
 * import { findTruncatingText } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findTruncatingText(driver, By.id('my-oj-c-truncating-text'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findTruncatingText(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type TruncatingTextWebElement
    if (!(webEl instanceof TruncatingTextWebElement_1.TruncatingTextWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'TruncatingTextWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findTruncatingText(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${TruncatingTextWebElement_1.TruncatingTextWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-truncating-text', TruncatingTextWebElement_1.TruncatingTextWebElement);
//# sourceMappingURL=index.js.map