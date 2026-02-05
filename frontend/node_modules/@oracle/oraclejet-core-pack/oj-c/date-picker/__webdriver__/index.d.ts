import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { DatePickerWebElement } from './DatePickerWebElement';
export { DatePickerWebElement };
/**
 * Retrieve an instance of [DatePickerWebElement](../classes/DatePickerWebElement.html).
 * @example
 * ```javascript
 * import { findDatePicker } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findDatePicker(driver, By.id('my-oj-c-date-picker'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findDatePicker(driver: DriverLike, by: By): Promise<DatePickerWebElement>;
