"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingGaugeWebElement = void 0;
exports.findRatingGauge = findRatingGauge;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const RatingGaugeWebElement_1 = require("./RatingGaugeWebElement");
Object.defineProperty(exports, "RatingGaugeWebElement", { enumerable: true, get: function () { return RatingGaugeWebElement_1.RatingGaugeWebElement; } });
/**
 * Retrieve an instance of [RatingGaugeWebElement](../classes/RatingGaugeWebElement.html).
 * @example
 * ```javascript
 * import { findRatingGauge } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findRatingGauge(driver, By.id('my-oj-c-rating-gauge'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findRatingGauge(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type RatingGaugeWebElement
    if (!(webEl instanceof RatingGaugeWebElement_1.RatingGaugeWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'RatingGaugeWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findRatingGauge(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${RatingGaugeWebElement_1.RatingGaugeWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-rating-gauge', RatingGaugeWebElement_1.RatingGaugeWebElement);
//# sourceMappingURL=index.js.map