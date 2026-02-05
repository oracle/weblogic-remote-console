"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadgeWebElement = void 0;
exports.findBadge = findBadge;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const BadgeWebElement_1 = require("./BadgeWebElement");
Object.defineProperty(exports, "BadgeWebElement", { enumerable: true, get: function () { return BadgeWebElement_1.BadgeWebElement; } });
/**
 * Retrieve an instance of [BadgeWebElement](../classes/BadgeWebElement.html).
 * @example
 * ```javascript
 * import { findBadge } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findBadge(driver, By.id('my-oj-c-badge'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findBadge(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type BadgeWebElement
    if (!(webEl instanceof BadgeWebElement_1.BadgeWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'BadgeWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findBadge(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${BadgeWebElement_1.BadgeWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-badge', BadgeWebElement_1.BadgeWebElement);
//# sourceMappingURL=index.js.map