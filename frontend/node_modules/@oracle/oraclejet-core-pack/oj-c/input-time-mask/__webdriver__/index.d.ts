import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { InputTimeMaskWebElement } from './InputTimeMaskWebElement';
export { InputTimeMaskWebElement };
/**
 * Retrieve an instance of [InputTimeMaskWebElement](../classes/InputTimeMaskWebElement.html).
 * @example
 * ```javascript
 * import { findInputTimeMask } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findInputTimeMask(driver, By.id('my-oj-c-input-time-mask'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findInputTimeMask(driver: DriverLike, by: By): Promise<InputTimeMaskWebElement>;
