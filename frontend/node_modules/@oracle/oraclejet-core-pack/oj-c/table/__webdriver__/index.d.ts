import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { TableWebElement } from './TableWebElement';
export { TableWebElement };
/**
 * Retrieve an instance of [TableWebElement](../classes/TableWebElement.html).
 * @example
 * ```javascript
 * import { findTable } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findTable(driver, By.id('my-oj-c-table'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findTable(driver: DriverLike, by: By): Promise<TableWebElement>;
