"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardViewWebElement = void 0;
exports.findCardView = findCardView;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const CardViewWebElement_1 = require("./CardViewWebElement");
Object.defineProperty(exports, "CardViewWebElement", { enumerable: true, get: function () { return CardViewWebElement_1.CardViewWebElement; } });
/**
 * Retrieve an instance of [CardViewWebElement](../classes/CardViewWebElement.html).
 * @example
 * ```javascript
 * import { findCardView } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findCardView(driver, By.id('my-oj-c-card-view'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findCardView(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type CardViewWebElement
    if (!(webEl instanceof CardViewWebElement_1.CardViewWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'CardViewWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findCardView(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${CardViewWebElement_1.CardViewWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-card-view', CardViewWebElement_1.CardViewWebElement);
//# sourceMappingURL=index.js.map