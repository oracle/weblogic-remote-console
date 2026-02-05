"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarWebElement = void 0;
exports.findAvatar = findAvatar;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const AvatarWebElement_1 = require("./AvatarWebElement");
Object.defineProperty(exports, "AvatarWebElement", { enumerable: true, get: function () { return AvatarWebElement_1.AvatarWebElement; } });
/**
 * Retrieve an instance of [AvatarWebElement](../classes/AvatarWebElement.html).
 * @example
 * ```javascript
 * import { findAvatar } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findAvatar(driver, By.id('my-oj-c-avatar'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findAvatar(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type AvatarWebElement
    if (!(webEl instanceof AvatarWebElement_1.AvatarWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'AvatarWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findAvatar(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${AvatarWebElement_1.AvatarWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-avatar', AvatarWebElement_1.AvatarWebElement);
//# sourceMappingURL=index.js.map