"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RichCheckboxsetWebElement = void 0;
exports.findRichCheckboxset = findRichCheckboxset;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const RichCheckboxsetWebElement_1 = require("./RichCheckboxsetWebElement");
Object.defineProperty(exports, "RichCheckboxsetWebElement", { enumerable: true, get: function () { return RichCheckboxsetWebElement_1.RichCheckboxsetWebElement; } });
/**
 * Retrieve an instance of [RichCheckboxsetWebElement](../classes/RichCheckboxsetWebElement.html).
 * @example
 * ```javascript
 * import { findRichCheckboxset } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findRichCheckboxset(driver, By.id('my-oj-c-rich-checkboxset'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findRichCheckboxset(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type RichCheckboxsetWebElement
    if (!(webEl instanceof RichCheckboxsetWebElement_1.RichCheckboxsetWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'RichCheckboxsetWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findRichCheckboxset(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${RichCheckboxsetWebElement_1.RichCheckboxsetWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-rich-checkboxset', RichCheckboxsetWebElement_1.RichCheckboxsetWebElement);
//# sourceMappingURL=index.js.map