import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { CheckboxWebElement } from './CheckboxWebElement';
export { CheckboxWebElement };
/**
 * Retrieve an instance of [CheckboxWebElement](../classes/CheckboxWebElement.html).
 * @example
 * ```javascript
 * import { findCheckbox } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findCheckbox(driver, By.id('my-oj-c-checkbox'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findCheckbox(driver: DriverLike, by: By): Promise<CheckboxWebElement>;
