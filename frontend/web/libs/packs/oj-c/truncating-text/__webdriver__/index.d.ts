import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { TruncatingTextWebElement } from './TruncatingTextWebElement';
export { TruncatingTextWebElement };
/**
 * Retrieve an instance of [TruncatingTextWebElement](../classes/TruncatingTextWebElement.html).
 * @example
 * ```javascript
 * import { findTruncatingText } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findTruncatingText(driver, By.id('my-oj-c-truncating-text'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findTruncatingText(driver: DriverLike, by: By): Promise<TruncatingTextWebElement>;
