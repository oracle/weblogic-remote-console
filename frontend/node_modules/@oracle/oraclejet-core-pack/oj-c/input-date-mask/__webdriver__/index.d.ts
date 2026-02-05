import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { InputDateMaskWebElement } from './InputDateMaskWebElement';
export { InputDateMaskWebElement };
/**
 * Retrieve an instance of [InputDateMaskWebElement](../classes/InputDateMaskWebElement.html).
 * @example
 * ```javascript
 * import { findInputDateMask } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findInputDateMask(driver, By.id('my-oj-c-input-date-mask'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findInputDateMask(driver: DriverLike, by: By): Promise<InputDateMaskWebElement>;
