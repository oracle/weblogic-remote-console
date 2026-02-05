"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeterBarWebElement = void 0;
exports.findMeterBar = findMeterBar;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const MeterBarWebElement_1 = require("./MeterBarWebElement");
Object.defineProperty(exports, "MeterBarWebElement", { enumerable: true, get: function () { return MeterBarWebElement_1.MeterBarWebElement; } });
/**
 * Retrieve an instance of [MeterBarWebElement](../classes/MeterBarWebElement.html).
 * @example
 * ```javascript
 * import { findMeterBar } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findMeterBar(driver, By.id('my-oj-c-meter-bar'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findMeterBar(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type MeterBarWebElement
    if (!(webEl instanceof MeterBarWebElement_1.MeterBarWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'MeterBarWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findMeterBar(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${MeterBarWebElement_1.MeterBarWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-meter-bar', MeterBarWebElement_1.MeterBarWebElement);
//# sourceMappingURL=index.js.map