import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { PopupWebElement } from './PopupWebElement';
export { PopupWebElement };
/**
 * Retrieve an instance of [PopupWebElement](../classes/PopupWebElement.html).
 * @example
 * ```javascript
 * import { findPopup } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findPopup(driver, By.id('my-oj-c-popup'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findPopup(driver: DriverLike, by: By): Promise<PopupWebElement>;
