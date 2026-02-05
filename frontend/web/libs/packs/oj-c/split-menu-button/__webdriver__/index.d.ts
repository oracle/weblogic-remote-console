import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { SplitMenuButtonWebElement } from './SplitMenuButtonWebElement';
export { SplitMenuButtonWebElement };
/**
 * Retrieve an instance of [SplitMenuButtonWebElement](../classes/SplitMenuButtonWebElement.html).
 * @example
 * ```javascript
 * import { findSplitMenuButton } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findSplitMenuButton(driver, By.id('my-oj-c-split-menu-button'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findSplitMenuButton(driver: DriverLike, by: By): Promise<SplitMenuButtonWebElement>;
