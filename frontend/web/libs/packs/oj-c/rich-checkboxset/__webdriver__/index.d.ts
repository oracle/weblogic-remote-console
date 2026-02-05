import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { RichCheckboxsetWebElement } from './RichCheckboxsetWebElement';
export { RichCheckboxsetWebElement };
/**
 * Retrieve an instance of [RichCheckboxsetWebElement](../classes/RichCheckboxsetWebElement.html).
 * @example
 * ```javascript
 * import { findRichCheckboxset } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findRichCheckboxset(driver, By.id('my-oj-c-rich-checkboxset'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findRichCheckboxset(driver: DriverLike, by: By): Promise<RichCheckboxsetWebElement>;
