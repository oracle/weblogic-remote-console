import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { InputDateTextWebElement } from './InputDateTextWebElement';
export { InputDateTextWebElement };
/**
 * Retrieve an instance of [InputDateTextWebElement](../classes/InputDateTextWebElement.html).
 * @example
 * ```javascript
 * import { findInputDateText } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findInputDateText(driver, By.id('my-oj-c-input-date-text'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findInputDateText(driver: DriverLike, by: By): Promise<InputDateTextWebElement>;
