"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeterCircleWebElement = void 0;
exports.findMeterCircle = findMeterCircle;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const MeterCircleWebElement_1 = require("./MeterCircleWebElement");
Object.defineProperty(exports, "MeterCircleWebElement", { enumerable: true, get: function () { return MeterCircleWebElement_1.MeterCircleWebElement; } });
/**
 * Retrieve an instance of [MeterCircleWebElement](../classes/MeterCircleWebElement.html).
 * @example
 * ```javascript
 * import { findMeterCircle } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findMeterCircle(driver, By.id('my-oj-c-meter-circle'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findMeterCircle(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type MeterCircleWebElement
    if (!(webEl instanceof MeterCircleWebElement_1.MeterCircleWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'MeterCircleWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findMeterCircle(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${MeterCircleWebElement_1.MeterCircleWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-meter-circle', MeterCircleWebElement_1.MeterCircleWebElement);
//# sourceMappingURL=index.js.map