import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { ButtonsetMultipleWebElement } from './ButtonsetMultipleWebElement';
export { ButtonsetMultipleWebElement };
/**
 * Retrieve an instance of [ButtonsetMultipleWebElement](../classes/ButtonsetMultipleWebElement.html).
 * @example
 * ```javascript
 * import { findButtonsetMultiple } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findButtonsetMultiple(driver, By.id('my-oj-c-buttonset-multiple'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findButtonsetMultiple(driver: DriverLike, by: By): Promise<ButtonsetMultipleWebElement>;
