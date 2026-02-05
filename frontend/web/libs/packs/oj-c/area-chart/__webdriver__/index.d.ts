import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { AreaChartWebElement } from './AreaChartWebElement';
export { AreaChartWebElement };
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
export declare function findAreaChart(driver: DriverLike, by: By): Promise<AreaChartWebElement>;
