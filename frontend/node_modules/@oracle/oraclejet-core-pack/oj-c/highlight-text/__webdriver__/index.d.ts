import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { HighlightTextWebElement } from './HighlightTextWebElement';
export { HighlightTextWebElement };
/**
 * Retrieve an instance of [HighlightTextWebElement](../classes/HighlightTextWebElement.html).
 * @example
 * ```javascript
 * import { findHighlightText } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findHighlightText(driver, By.id('my-oj-c-highlight-text'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findHighlightText(driver: DriverLike, by: By): Promise<HighlightTextWebElement>;
