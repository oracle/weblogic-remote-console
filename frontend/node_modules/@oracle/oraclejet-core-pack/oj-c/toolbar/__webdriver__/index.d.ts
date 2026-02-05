import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { ToolbarWebElement } from './ToolbarWebElement';
export { ToolbarWebElement };
/**
 * Retrieve an instance of [ToolbarWebElement](../classes/ToolbarWebElement.html).
 * @example
 * ```javascript
 * import { findToolbar } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findToolbar(driver, By.id('my-oj-c-toolbar'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findToolbar(driver: DriverLike, by: By): Promise<ToolbarWebElement>;
