import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { ButtonsetSingleWebElement } from './ButtonsetSingleWebElement';
export { ButtonsetSingleWebElement };
/**
 * Retrieve an instance of [ButtonsetSingleWebElement](../classes/ButtonsetSingleWebElement.html).
 * @example
 * ```javascript
 * import { findButtonsetSingle } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findButtonsetSingle(driver, By.id('my-oj-c-buttonset-single'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findButtonsetSingle(driver: DriverLike, by: By): Promise<ButtonsetSingleWebElement>;
