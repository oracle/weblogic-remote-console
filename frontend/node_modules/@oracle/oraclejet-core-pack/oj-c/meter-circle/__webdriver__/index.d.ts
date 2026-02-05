import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { MeterCircleWebElement } from './MeterCircleWebElement';
export { MeterCircleWebElement };
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
export declare function findMeterCircle(driver: DriverLike, by: By): Promise<MeterCircleWebElement>;
