"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionCardWebElement = void 0;
exports.findActionCard = findActionCard;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const ActionCardWebElement_1 = require("./ActionCardWebElement");
Object.defineProperty(exports, "ActionCardWebElement", { enumerable: true, get: function () { return ActionCardWebElement_1.ActionCardWebElement; } });
/**
 * Retrieve an instance of [ActionCardWebElement](../classes/ActionCardWebElement.html).
 * @example
 * ```javascript
 * import { findActionCard } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findActionCard(driver, By.id('my-oj-c-action-card'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findActionCard(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type ActionCardWebElement
    if (!(webEl instanceof ActionCardWebElement_1.ActionCardWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'ActionCardWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findActionCard(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${ActionCardWebElement_1.ActionCardWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-action-card', ActionCardWebElement_1.ActionCardWebElement);
//# sourceMappingURL=index.js.map