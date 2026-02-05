import { WebElement, ISize, IRectangle, Locator, WebElementPromise } from 'selenium-webdriver';
import { DrawerPopupWebElementBase } from './DrawerPopupWebElementBase';
/**
 * The component WebElement for [oj-c-drawer-popup](../../jsdocs/oj-c.DrawerPopup.html).
 * Do not instantiate this class directly, instead, use
 * [findDrawerPopup](../functions/findDrawerPopup.html).
 */
export declare class DrawerPopupWebElement extends DrawerPopupWebElementBase {
    isDisplayed(): Promise<boolean>;
    getSize(): Promise<ISize>;
    getRect(): Promise<IRectangle>;
    getText(): Promise<string>;
    findElement(locator: Locator): WebElementPromise;
    findElements(locator: Locator): Promise<WebElement[]>;
    private getContent;
    /**
     * Dismisses the drawer.
     */
    doClose(): Promise<void>;
    /**
     * Sets the value of <code>opened</code> property.
     * Specifies whether the Drawer is open.
     * @param opened The value to set for <code>opened</code>
     * @deprecated Since 18.0.0. Use a launcher action to open the drawer and <code>doClose</code> to dismiss it.
     */
    changeOpened(opened: boolean): Promise<void>;
}
