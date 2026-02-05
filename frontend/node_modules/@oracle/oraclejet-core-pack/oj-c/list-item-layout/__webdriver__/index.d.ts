import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { ListItemLayoutWebElement } from './ListItemLayoutWebElement';
export { ListItemLayoutWebElement };
/**
 * Retrieve an instance of [ListItemLayoutWebElement](../classes/ListItemLayoutWebElement.html).
 * @example
 * ```javascript
 * import { findListItemLayout } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findListItemLayout(driver, By.id('my-oj-c-list-item-layout'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findListItemLayout(driver: DriverLike, by: By): Promise<ListItemLayoutWebElement>;
