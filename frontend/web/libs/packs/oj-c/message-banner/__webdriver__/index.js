"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBannerWebElement = void 0;
exports.findMessageBanner = findMessageBanner;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const MessageBannerWebElement_1 = require("./MessageBannerWebElement");
Object.defineProperty(exports, "MessageBannerWebElement", { enumerable: true, get: function () { return MessageBannerWebElement_1.MessageBannerWebElement; } });
/**
 * Retrieve an instance of [MessageBannerWebElement](../classes/MessageBannerWebElement.html).
 * @example
 * ```javascript
 * import { findMessageBanner } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findMessageBanner(driver, By.id('my-oj-c-message-banner'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findMessageBanner(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type MessageBannerWebElement
    if (!(webEl instanceof MessageBannerWebElement_1.MessageBannerWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'MessageBannerWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findMessageBanner(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${MessageBannerWebElement_1.MessageBannerWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-message-banner', MessageBannerWebElement_1.MessageBannerWebElement);
//# sourceMappingURL=index.js.map