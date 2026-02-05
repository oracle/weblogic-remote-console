import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { SelectorAllWebElement } from './SelectorAllWebElement';
export { SelectorAllWebElement };
/**
 * Retrieve an instance of [SelectorAllWebElement](../classes/SelectorAllWebElement.html).
 * @example
 * ```javascript
 * import { findSelectorAll } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findSelectorAll(driver, By.id('my-oj-c-selector-all'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findSelectorAll(driver: DriverLike, by: By): Promise<SelectorAllWebElement>;
