import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { TruncatingBadgeWebElement } from './TruncatingBadgeWebElement';
export { TruncatingBadgeWebElement };
/**
 * Retrieve an instance of [TruncatingBadgeWebElement](../classes/TruncatingBadgeWebElement.html).
 * @example
 * ```javascript
 * import { findTruncatingBadge } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findTruncatingBadge(driver, By.id('my-oj-c-truncating-badge'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findTruncatingBadge(driver: DriverLike, by: By): Promise<TruncatingBadgeWebElement>;
