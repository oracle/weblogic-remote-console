import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { CheckboxsetWebElement } from './CheckboxsetWebElement';
export { CheckboxsetWebElement };
/**
 * Retrieve an instance of [CheckboxsetWebElement](../classes/CheckboxsetWebElement.html).
 * @example
 * ```javascript
 * import { findCheckboxset } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findCheckboxset(driver, By.id('my-oj-c-checkboxset'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findCheckboxset(driver: DriverLike, by: By): Promise<CheckboxsetWebElement>;
