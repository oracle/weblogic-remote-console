import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { RadiosetWebElement } from './RadiosetWebElement';
export { RadiosetWebElement };
/**
 * Retrieve an instance of [RadiosetWebElement](../classes/RadiosetWebElement.html).
 * @example
 * ```javascript
 * import { findRadioset } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findRadioset(driver, By.id('my-oj-c-radioset'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findRadioset(driver: DriverLike, by: By): Promise<RadiosetWebElement>;
