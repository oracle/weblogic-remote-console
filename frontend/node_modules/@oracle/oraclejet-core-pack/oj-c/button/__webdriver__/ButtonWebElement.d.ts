import { ButtonWebElementBase } from './ButtonWebElementBase';
/**
 * The component WebElement for [oj-c-button](../../jsdocs/oj-c.Button.html).
 * Do not instantiate this class directly, instead, use
 * [findButton](../functions/findButton.html).
 */
export declare class ButtonWebElement extends ButtonWebElementBase {
    /**
     * Perform a click on the button
     */
    doAction(): Promise<void>;
    click(): Promise<void>;
}
