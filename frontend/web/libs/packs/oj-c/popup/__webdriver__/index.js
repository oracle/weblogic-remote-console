"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopupWebElement = void 0;
exports.findPopup = findPopup;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const PopupWebElement_1 = require("./PopupWebElement");
Object.defineProperty(exports, "PopupWebElement", { enumerable: true, get: function () { return PopupWebElement_1.PopupWebElement; } });
/**
 * Retrieve an instance of [PopupWebElement](../classes/PopupWebElement.html).
 * @example
 * ```javascript
 * import { findPopup } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findPopup(driver, By.id('my-oj-c-popup'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findPopup(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type PopupWebElement
    if (!(webEl instanceof PopupWebElement_1.PopupWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'PopupWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findPopup(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${PopupWebElement_1.PopupWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-popup', PopupWebElement_1.PopupWebElement);
//# sourceMappingURL=index.js.map