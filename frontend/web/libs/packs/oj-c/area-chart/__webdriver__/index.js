"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreaChartWebElement = void 0;
exports.findAreaChart = findAreaChart;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const AreaChartWebElement_1 = require("./AreaChartWebElement");
Object.defineProperty(exports, "AreaChartWebElement", { enumerable: true, get: function () { return AreaChartWebElement_1.AreaChartWebElement; } });
/**
 * Retrieve an instance of [AreaChartWebElement](../classes/AreaChartWebElement.html).
 * @example
 * ```javascript
 * import { findAreaChart } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findAreaChart(driver, By.id('my-oj-c-area-chart'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findAreaChart(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type AreaChartWebElement
    if (!(webEl instanceof AreaChartWebElement_1.AreaChartWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'AreaChartWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findAreaChart(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${AreaChartWebElement_1.AreaChartWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-area-chart', AreaChartWebElement_1.AreaChartWebElement);
//# sourceMappingURL=index.js.map