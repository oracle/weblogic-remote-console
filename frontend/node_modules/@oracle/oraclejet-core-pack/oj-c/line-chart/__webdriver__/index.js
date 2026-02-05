"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineChartWebElement = void 0;
exports.findLineChart = findLineChart;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const LineChartWebElement_1 = require("./LineChartWebElement");
Object.defineProperty(exports, "LineChartWebElement", { enumerable: true, get: function () { return LineChartWebElement_1.LineChartWebElement; } });
/**
 * Retrieve an instance of [LineChartWebElement](../classes/LineChartWebElement.html).
 * @example
 * ```javascript
 * import { findLineChart } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findLineChart(driver, By.id('my-oj-c-line-chart'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findLineChart(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type LineChartWebElement
    if (!(webEl instanceof LineChartWebElement_1.LineChartWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'LineChartWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findLineChart(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${LineChartWebElement_1.LineChartWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-line-chart', LineChartWebElement_1.LineChartWebElement);
//# sourceMappingURL=index.js.map