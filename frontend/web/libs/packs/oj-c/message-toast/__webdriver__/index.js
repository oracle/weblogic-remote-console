"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageToastWebElement = void 0;
exports.findMessageToast = findMessageToast;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const MessageToastWebElement_1 = require("./MessageToastWebElement");
Object.defineProperty(exports, "MessageToastWebElement", { enumerable: true, get: function () { return MessageToastWebElement_1.MessageToastWebElement; } });
/**
 * Retrieve an instance of [MessageToastWebElement](../classes/MessageToastWebElement.html).
 * @example
 * ```javascript
 * import { findMessageToast } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findMessageToast(driver, By.id('my-oj-c-message-toast'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findMessageToast(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type MessageToastWebElement
    if (!(webEl instanceof MessageToastWebElement_1.MessageToastWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'MessageToastWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findMessageToast(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${MessageToastWebElement_1.MessageToastWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-message-toast', MessageToastWebElement_1.MessageToastWebElement);
//# sourceMappingURL=index.js.map