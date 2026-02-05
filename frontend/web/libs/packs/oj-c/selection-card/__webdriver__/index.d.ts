import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { SelectionCardWebElement } from './SelectionCardWebElement';
export { SelectionCardWebElement };
/**
 * Retrieve an instance of [SelectionCardWebElement](../classes/SelectionCardWebElement.html).
 * @example
 * ```javascript
 * import { findSelectionCard } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findSelectionCard(driver, By.id('my-oj-c-selection-card'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findSelectionCard(driver: DriverLike, by: By): Promise<SelectionCardWebElement>;
