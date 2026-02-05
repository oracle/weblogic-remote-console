"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectionCardWebElement = void 0;
exports.findSelectionCard = findSelectionCard;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const SelectionCardWebElement_1 = require("./SelectionCardWebElement");
Object.defineProperty(exports, "SelectionCardWebElement", { enumerable: true, get: function () { return SelectionCardWebElement_1.SelectionCardWebElement; } });
/**
 * Retrieve an instance of [SelectionCardWebElement](../classes/SelectionCardWebElement.html).
 * @example
 * ```javascript
 * import { findSelectionCard } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findSelectionCard(driver, By.id('my-oj-c-selection-card'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findSelectionCard(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type SelectionCardWebElement
    if (!(webEl instanceof SelectionCardWebElement_1.SelectionCardWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'SelectionCardWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findSelectionCard(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${SelectionCardWebElement_1.SelectionCardWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-selection-card', SelectionCardWebElement_1.SelectionCardWebElement);
//# sourceMappingURL=index.js.map