import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { TabBarMixedWebElement } from './TabBarMixedWebElement';
export { TabBarMixedWebElement };
/**
 * Retrieve an instance of [TabBarMixedWebElement](../classes/TabBarMixedWebElement.html).
 * @example
 * ```javascript
 * import { findTabBarMixed } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findTabBarMixed(driver, By.id('my-oj-c-tab-bar-mixed'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findTabBarMixed(driver: DriverLike, by: By): Promise<TabBarMixedWebElement>;
