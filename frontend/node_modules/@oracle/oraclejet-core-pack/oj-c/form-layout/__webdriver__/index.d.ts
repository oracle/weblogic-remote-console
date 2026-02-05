import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { FormLayoutWebElement } from './FormLayoutWebElement';
export { FormLayoutWebElement };
/**
 * Retrieve an instance of [FormLayoutWebElement](../classes/FormLayoutWebElement.html).
 * @example
 * ```javascript
 * import { findFormLayout } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findFormLayout(driver, By.id('my-oj-c-form-layout'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findFormLayout(driver: DriverLike, by: By): Promise<FormLayoutWebElement>;
