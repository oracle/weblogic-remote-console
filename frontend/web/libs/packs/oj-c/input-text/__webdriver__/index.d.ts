import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { InputTextWebElement } from './InputTextWebElement';
export { InputTextWebElement };
/**
 * Retrieve an instance of [InputTextWebElement](../classes/InputTextWebElement.html).
 * @example
 * ```javascript
 * import { findInputText } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findInputText(driver, By.id('my-oj-c-input-text'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findInputText(driver: DriverLike, by: By): Promise<InputTextWebElement>;
