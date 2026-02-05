"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichRadiosetWebElement = void 0;
exports.findRichRadioset = findRichRadioset;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const RichRadiosetWebElement_1 = require("./RichRadiosetWebElement");
Object.defineProperty(exports, "RichRadiosetWebElement", { enumerable: true, get: function () { return RichRadiosetWebElement_1.RichRadiosetWebElement; } });
/**
 * Retrieve an instance of [RichRadiosetWebElement](../classes/RichRadiosetWebElement.html).
 * @example
 * ```javascript
 * import { findRichRadioset } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findRichRadioset(driver, By.id('my-oj-c-rich-radioset'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findRichRadioset(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type RichRadiosetWebElement
    if (!(webEl instanceof RichRadiosetWebElement_1.RichRadiosetWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'RichRadiosetWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findRichRadioset(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${RichRadiosetWebElement_1.RichRadiosetWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-rich-radioset', RichRadiosetWebElement_1.RichRadiosetWebElement);
//# sourceMappingURL=index.js.map