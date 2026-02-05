import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { TagCloudWebElement } from './TagCloudWebElement';
export { TagCloudWebElement };
/**
 * Retrieve an instance of [TagCloudWebElement](../classes/TagCloudWebElement.html).
 * @example
 * ```javascript
 * import { findTagCloud } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findTagCloud(driver, By.id('my-oj-c-tag-cloud'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findTagCloud(driver: DriverLike, by: By): Promise<TagCloudWebElement>;
