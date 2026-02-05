import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { ToggleButtonWebElement } from './ToggleButtonWebElement';
export { ToggleButtonWebElement };
/**
 * Retrieve an instance of [ToggleButtonWebElement](../classes/ToggleButtonWebElement.html).
 * @example
 * ```javascript
 * import { findToggleButton } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findToggleButton(driver, By.id('my-oj-c-toggle-button'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findToggleButton(driver: DriverLike, by: By): Promise<ToggleButtonWebElement>;
