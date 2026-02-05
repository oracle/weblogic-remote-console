import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { ProgressCircleWebElement } from './ProgressCircleWebElement';
export { ProgressCircleWebElement };
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
export declare function findProgressCircle(driver: DriverLike, by: By): Promise<ProgressCircleWebElement>;
