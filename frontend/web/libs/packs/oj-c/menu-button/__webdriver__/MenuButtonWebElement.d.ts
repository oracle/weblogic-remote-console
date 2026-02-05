import { MenuButtonWebElementBase } from './MenuButtonWebElementBase';
/**
 * The component WebElement for [oj-c-menu-button](../../jsdocs/oj-c.MenuButton.html).
 * Do not instantiate this class directly, instead, use
 * [findMenuButton](../functions/findMenuButton.html).
 */
export declare class MenuButtonWebElement extends MenuButtonWebElementBase {
    /**
     * Perform a click on the button to open the menu or close the menu
     */
    click(): Promise<void>;
    /**
     * Helper util
     * */
    findAsyncSequential<T>(array: T[], predicate: (t: T) => Promise<boolean>): Promise<T | undefined>;
    /**
     * Fire the ojMenuAction event on the oj-c-menu-button, and
     * invoke the Action handler of the selected value.
     *
     */
    doMenuAction(selectedValue: string | string[]): Promise<void>;
    /**
     * openMenu - opens the menu
     */
    private openMenu;
    /**
     * delay - delays the milliseconds
     * await delay(2000);
     */
    private delay;
    /**
     * In order to do nested selections, we need an isolated menu clicker
     */
    private doMenuClick;
}
