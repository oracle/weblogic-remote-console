import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { SelectorWebElement } from './SelectorWebElement';
export { SelectorWebElement };
/**
 * Retrieve an instance of [SelectorWebElement](../classes/SelectorWebElement.html).
 * @example
 * ```javascript
 * import { findSelector } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findSelector(driver, By.id('my-oj-c-selector'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findSelector(driver: DriverLike, by: By): Promise<SelectorWebElement>;
