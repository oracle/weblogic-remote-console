import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { ListViewWebElement } from './ListViewWebElement';
export { ListViewWebElement };
/**
 * Retrieve an instance of [ListViewWebElement](../classes/ListViewWebElement.html).
 * @example
 * ```javascript
 * import { findListView } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findListView(driver, By.id('my-oj-c-list-view'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findListView(driver: DriverLike, by: By): Promise<ListViewWebElement>;
