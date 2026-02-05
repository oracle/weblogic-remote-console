import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { ButtonWebElement } from './ButtonWebElement';
export { ButtonWebElement };
/**
 * Retrieve an instance of [ButtonWebElement](../classes/ButtonWebElement.html).
 * @example
 * ```javascript
 * import { findButton } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findButton(driver, By.id('my-oj-c-button'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findButton(driver: DriverLike, by: By): Promise<ButtonWebElement>;
