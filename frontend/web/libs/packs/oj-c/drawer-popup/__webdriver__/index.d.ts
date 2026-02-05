import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { DrawerPopupWebElement } from './DrawerPopupWebElement';
export { DrawerPopupWebElement };
/**
 * Retrieve an instance of [DrawerPopupWebElement](../classes/DrawerPopupWebElement.html).
 * @example
 * ```javascript
 * import { findDrawerPopup } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findDrawerPopup(driver, By.id('my-oj-c-drawer-popup'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findDrawerPopup(driver: DriverLike, by: By): Promise<DrawerPopupWebElement>;
