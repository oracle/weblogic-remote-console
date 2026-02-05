import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { InputMonthMaskWebElement } from './InputMonthMaskWebElement';
export { InputMonthMaskWebElement };
/**
 * Retrieve an instance of [InputMonthMaskWebElement](../classes/InputMonthMaskWebElement.html).
 * @example
 * ```javascript
 * import { findInputMonthMask } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findInputMonthMask(driver, By.id('my-oj-c-input-month-mask'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findInputMonthMask(driver: DriverLike, by: By): Promise<InputMonthMaskWebElement>;
