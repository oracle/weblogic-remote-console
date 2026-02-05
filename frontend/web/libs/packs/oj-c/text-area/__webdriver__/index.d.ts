import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { TextAreaWebElement } from './TextAreaWebElement';
export { TextAreaWebElement };
/**
 * Retrieve an instance of [TextAreaWebElement](../classes/TextAreaWebElement.html).
 * @example
 * ```javascript
 * import { findTextArea } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findTextArea(driver, By.id('my-oj-c-text-area'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findTextArea(driver: DriverLike, by: By): Promise<TextAreaWebElement>;
