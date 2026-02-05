import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { MessageToastWebElement } from './MessageToastWebElement';
export { MessageToastWebElement };
/**
 * Retrieve an instance of [MessageToastWebElement](../classes/MessageToastWebElement.html).
 * @example
 * ```javascript
 * import { findMessageToast } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findMessageToast(driver, By.id('my-oj-c-message-toast'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findMessageToast(driver: DriverLike, by: By): Promise<MessageToastWebElement>;
