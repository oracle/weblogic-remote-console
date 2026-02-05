"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TruncatingBadgeWebElement = void 0;
exports.findTruncatingBadge = findTruncatingBadge;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const TruncatingBadgeWebElement_1 = require("./TruncatingBadgeWebElement");
Object.defineProperty(exports, "TruncatingBadgeWebElement", { enumerable: true, get: function () { return TruncatingBadgeWebElement_1.TruncatingBadgeWebElement; } });
/**
 * Retrieve an instance of [TruncatingBadgeWebElement](../classes/TruncatingBadgeWebElement.html).
 * @example
 * ```javascript
 * import { findTruncatingBadge } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findTruncatingBadge(driver, By.id('my-oj-c-truncating-badge'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findTruncatingBadge(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type TruncatingBadgeWebElement
    if (!(webEl instanceof TruncatingBadgeWebElement_1.TruncatingBadgeWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'TruncatingBadgeWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findTruncatingBadge(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${TruncatingBadgeWebElement_1.TruncatingBadgeWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-truncating-badge', TruncatingBadgeWebElement_1.TruncatingBadgeWebElement);
//# sourceMappingURL=index.js.map