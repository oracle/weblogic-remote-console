import { By } from 'selenium-webdriver';
import { DriverLike } from '@oracle/oraclejet-webdriver';
import { RatingGaugeWebElement } from './RatingGaugeWebElement';
export { RatingGaugeWebElement };
/**
 * Retrieve an instance of [RatingGaugeWebElement](../classes/RatingGaugeWebElement.html).
 * @example
 * ```javascript
 * import { findRatingGauge } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findRatingGauge(driver, By.id('my-oj-c-rating-gauge'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
export declare function findRatingGauge(driver: DriverLike, by: By): Promise<RatingGaugeWebElement>;
