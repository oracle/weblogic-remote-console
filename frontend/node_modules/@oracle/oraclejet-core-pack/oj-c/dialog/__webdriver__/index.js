"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogWebElement = void 0;
exports.findDialog = findDialog;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const DialogWebElement_1 = require("./DialogWebElement");
Object.defineProperty(exports, "DialogWebElement", { enumerable: true, get: function () { return DialogWebElement_1.DialogWebElement; } });
/**
 * Retrieve an instance of [DialogWebElement](../classes/DialogWebElement.html).
 * @example
 * ```javascript
 * import { findDialog } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findDialog(driver, By.id('my-oj-c-dialog'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findDialog(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type DialogWebElement
    if (!(webEl instanceof DialogWebElement_1.DialogWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'DialogWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findDialog(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${DialogWebElement_1.DialogWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-dialog', DialogWebElement_1.DialogWebElement);
//# sourceMappingURL=index.js.map