"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressBarWebElement = void 0;
exports.findProgressBar = findProgressBar;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const ProgressBarWebElement_1 = require("./ProgressBarWebElement");
Object.defineProperty(exports, "ProgressBarWebElement", { enumerable: true, get: function () { return ProgressBarWebElement_1.ProgressBarWebElement; } });
/**
 * Retrieve an instance of [ProgressBarWebElement](../classes/ProgressBarWebElement.html).
 * @example
 * ```javascript
 * import { findProgressBar } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findProgressBar(driver, By.id('my-oj-c-progress-bar'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findProgressBar(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type ProgressBarWebElement
    if (!(webEl instanceof ProgressBarWebElement_1.ProgressBarWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'ProgressBarWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findProgressBar(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${ProgressBarWebElement_1.ProgressBarWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-progress-bar', ProgressBarWebElement_1.ProgressBarWebElement);
//# sourceMappingURL=index.js.map