import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { InputDatePickerWebElement } from './InputDatePickerWebElement';
export { InputDatePickerWebElement };
/**
 * Retrieve an instance of [InputDatePickerWebElement](../classes/InputDatePickerWebElement.html).
 * @example
 * ```javascript
 * import { findInputDatePicker } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findInputDatePicker(driver, By.id('my-oj-c-input-date-picker'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findInputDatePicker(driver: DriverLike, by: By): Promise<InputDatePickerWebElement>;
