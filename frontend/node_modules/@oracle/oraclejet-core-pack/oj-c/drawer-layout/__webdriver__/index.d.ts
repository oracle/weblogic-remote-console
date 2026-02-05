import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { DrawerLayoutWebElement } from './DrawerLayoutWebElement';
export { DrawerLayoutWebElement };
/**
 * Retrieve an instance of [DrawerLayoutWebElement](../classes/DrawerLayoutWebElement.html).
 * @example
 * ```javascript
 * import { findDrawerLayout } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findDrawerLayout(driver, By.id('my-oj-c-drawer-layout'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findDrawerLayout(driver: DriverLike, by: By): Promise<DrawerLayoutWebElement>;
