import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { SkeletonWebElement } from './SkeletonWebElement';
export { SkeletonWebElement };
/**
 * Retrieve an instance of [SkeletonWebElement](../classes/SkeletonWebElement.html).
 * @example
 * ```javascript
 * import { findSkeleton } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findSkeleton(driver, By.id('my-oj-c-skeleton'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findSkeleton(driver: DriverLike, by: By): Promise<SkeletonWebElement>;
