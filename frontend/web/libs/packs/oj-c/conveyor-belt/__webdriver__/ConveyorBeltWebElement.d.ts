import { Locator } from 'selenium-webdriver';
import { ConveyorBeltWebElementBase } from './ConveyorBeltWebElementBase';
/**
 * The component WebElement for [oj-c-conveyor-belt](../../jsdocs/oj-c.ConveyorBelt.html).
 * Do not instantiate this class directly, instead, use
 * [findConveyorBelt](../functions/findConveyorBelt.html).
 */
export declare class ConveyorBeltWebElement extends ConveyorBeltWebElementBase {
    /**
     * Scroll the conveyor belt, so that the conveyor belt's element (button, tab bar) of interest is in the view
     *
     * @param {Locator} locator The lookup to pass into findElement
     */
    scrollElementIntoView(locator: Locator): Promise<void>;
}
