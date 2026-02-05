import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { MenuButtonWebElement } from './MenuButtonWebElement';
export { MenuButtonWebElement };
/**
 * Retrieve an instance of [MenuButtonWebElement](../classes/MenuButtonWebElement.html).
 * @example
 * ```javascript
 * import { findMenuButton } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findMenuButton(driver, By.id('my-oj-c-menu-button'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findMenuButton(driver: DriverLike, by: By): Promise<MenuButtonWebElement>;
