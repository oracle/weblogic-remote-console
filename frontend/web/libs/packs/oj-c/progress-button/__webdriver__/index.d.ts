import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { ProgressButtonWebElement } from './ProgressButtonWebElement';
export { ProgressButtonWebElement };
/**
 * Retrieve an instance of [ProgressButtonWebElement](../classes/ProgressButtonWebElement.html).
 * @example
 * ```javascript
 * import { findProgressButton } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findProgressButton(driver, By.id('my-oj-c-progress-button'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findProgressButton(driver: DriverLike, by: By): Promise<ProgressButtonWebElement>;
