import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { InputNumberWebElement } from './InputNumberWebElement';
export { InputNumberWebElement };
/**
 * Retrieve an instance of [InputNumberWebElement](../classes/InputNumberWebElement.html).
 * @example
 * ```javascript
 * import { findInputNumber } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findInputNumber(driver, By.id('my-oj-c-input-number'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findInputNumber(driver: DriverLike, by: By): Promise<InputNumberWebElement>;
