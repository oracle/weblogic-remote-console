import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { MessageBannerWebElement } from './MessageBannerWebElement';
export { MessageBannerWebElement };
/**
 * Retrieve an instance of [MessageBannerWebElement](../classes/MessageBannerWebElement.html).
 * @example
 * ```javascript
 * import { findMessageBanner } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findMessageBanner(driver, By.id('my-oj-c-message-banner'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findMessageBanner(driver: DriverLike, by: By): Promise<MessageBannerWebElement>;
