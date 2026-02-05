import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { CardViewWebElement } from './CardViewWebElement';
export { CardViewWebElement };
/**
 * Retrieve an instance of [CardViewWebElement](../classes/CardViewWebElement.html).
 * @example
 * ```javascript
 * import { findCardView } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findCardView(driver, By.id('my-oj-c-card-view'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findCardView(driver: DriverLike, by: By): Promise<CardViewWebElement>;
