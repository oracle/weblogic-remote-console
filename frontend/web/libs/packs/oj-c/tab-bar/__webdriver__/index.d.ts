import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { TabBarWebElement } from './TabBarWebElement';
export { TabBarWebElement };
/**
 * Retrieve an instance of [TabBarWebElement](../classes/TabBarWebElement.html).
 * @example
 * ```javascript
 * import { findTabBar } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findTabBar(driver, By.id('my-oj-c-tab-bar'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findTabBar(driver: DriverLike, by: By): Promise<TabBarWebElement>;
