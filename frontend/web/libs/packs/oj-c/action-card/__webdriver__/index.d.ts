import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { ActionCardWebElement } from './ActionCardWebElement';
export { ActionCardWebElement };
/**
 * Retrieve an instance of [ActionCardWebElement](../classes/ActionCardWebElement.html).
 * @example
 * ```javascript
 * import { findActionCard } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findActionCard(driver, By.id('my-oj-c-action-card'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findActionCard(driver: DriverLike, by: By): Promise<ActionCardWebElement>;
