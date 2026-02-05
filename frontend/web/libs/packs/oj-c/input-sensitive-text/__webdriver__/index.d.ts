import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { InputSensitiveTextWebElement } from './InputSensitiveTextWebElement';
export { InputSensitiveTextWebElement };
/**
 * Retrieve an instance of [InputSensitiveTextWebElement](../classes/InputSensitiveTextWebElement.html).
 * @example
 * ```javascript
 * import { findInputSensitiveText } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findInputSensitiveText(driver, By.id('my-oj-c-input-sensitive-text'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findInputSensitiveText(driver: DriverLike, by: By): Promise<InputSensitiveTextWebElement>;
