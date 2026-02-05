import { SplitMenuButtonWebElementBase } from './SplitMenuButtonWebElementBase';
/**
 * The component WebElement for [oj-c-split-menu-button](../../jsdocs/oj-c.SplitMenuButton.html).
 * Do not instantiate this class directly, instead, use
 * [findSplitMenuButton](../functions/findSplitMenuButton.html).
 */
export declare class SplitMenuButtonWebElement extends SplitMenuButtonWebElementBase {
    /**
     * Perform a click on the button action
     */
    click(): Promise<void>;
    /**
     * Perform a click on the button
     */
    doAction(): Promise<void>;
    /**
     * Helper util
     * */
    private findAsyncSequential;
    /**
     * Fire the ojMenuAction event on the oj-c-split-menu-button, and
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
