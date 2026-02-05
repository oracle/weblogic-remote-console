"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressCircleWebElement = void 0;
exports.findProgressCircle = findProgressCircle;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const ProgressCircleWebElement_1 = require("./ProgressCircleWebElement");
Object.defineProperty(exports, "ProgressCircleWebElement", { enumerable: true, get: function () { return ProgressCircleWebElement_1.ProgressCircleWebElement; } });
/**
 * Retrieve an instance of [ProgressCircleWebElement](../classes/ProgressCircleWebElement.html).
 * @example
 * ```javascript
 * import { findProgressCircle } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findProgressCircle(driver, By.id('my-oj-c-progress-circle'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findProgressCircle(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type ProgressCircleWebElement
    if (!(webEl instanceof ProgressCircleWebElement_1.ProgressCircleWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'ProgressCircleWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findProgressCircle(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${ProgressCircleWebElement_1.ProgressCircleWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-progress-circle', ProgressCircleWebElement_1.ProgressCircleWebElement);
//# sourceMappingURL=index.js.map