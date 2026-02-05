import { PopupWebElementBase } from './PopupWebElementBase';
import { Locator, ISize, WebElementPromise, WebElement, IRectangle } from 'selenium-webdriver';
/**
 * The component WebElement for [oj-c-popup](../../jsdocs/oj-c.Popup.html).
 * Do not instantiate this class directly, instead, use
 * [findPopup](../modules.html#findPopup).
 */
export declare class PopupWebElement extends PopupWebElementBase {
    isDisplayed(): Promise<boolean>;
    getSize(): Promise<ISize>;
    getRect(): Promise<IRectangle>;
    getText(): Promise<string>;
    findElement(locator: Locator): WebElementPromise;
    findElements(locator: Locator): Promise<WebElement[]>;
    private getContent;
    /**
     * Dismisses the popup.
     */
    doClose(): Promise<void>;
}
