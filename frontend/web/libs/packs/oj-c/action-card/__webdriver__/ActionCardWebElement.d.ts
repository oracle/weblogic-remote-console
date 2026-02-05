import { ActionCardWebElementBase } from './ActionCardWebElementBase';
/**
 * The component WebElement for [oj-c-action-card](../../jsdocs/oj-c.ActionCard.html).
 * Do not instantiate this class directly, instead, use
 * [findActionCard](../functions/findActionCard.html).
 */
export declare class ActionCardWebElement extends ActionCardWebElementBase {
    /**
     * Perform a click on the button
     */
    doAction(): Promise<void>;
    /**
     * Perform a click on the button
     */
    click(): Promise<void>;
}
