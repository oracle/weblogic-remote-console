"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressButtonWebElement = void 0;
exports.findProgressButton = findProgressButton;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const ProgressButtonWebElement_1 = require("./ProgressButtonWebElement");
Object.defineProperty(exports, "ProgressButtonWebElement", { enumerable: true, get: function () { return ProgressButtonWebElement_1.ProgressButtonWebElement; } });
/**
 * Retrieve an instance of [ProgressButtonWebElement](../classes/ProgressButtonWebElement.html).
 * @example
 * ```javascript
 * import { findProgressButton } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findProgressButton(driver, By.id('my-oj-c-progress-button'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findProgressButton(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type ProgressButtonWebElement
    if (!(webEl instanceof ProgressButtonWebElement_1.ProgressButtonWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'ProgressButtonWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findProgressButton(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${ProgressButtonWebElement_1.ProgressButtonWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-progress-button', ProgressButtonWebElement_1.ProgressButtonWebElement);
//# sourceMappingURL=index.js.map