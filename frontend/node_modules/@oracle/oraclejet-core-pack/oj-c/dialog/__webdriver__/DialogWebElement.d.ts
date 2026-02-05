import { WebElement, ISize, IRectangle, Locator, WebElementPromise } from 'selenium-webdriver';
import { DialogWebElementBase } from './DialogWebElementBase';
/**
 * The component WebElement for [oj-c-dialog](../../jsdocs/oj-c.Dialog.html).
 * Do not instantiate this class directly, instead, use
 * [findDialog](../functions/findDialog.html).
 */
export declare class DialogWebElement extends DialogWebElementBase {
    isDisplayed(): Promise<boolean>;
    getSize(): Promise<ISize>;
    getRect(): Promise<IRectangle>;
    getText(): Promise<string>;
    findElement(locator: Locator): WebElementPromise;
    findElements(locator: Locator): Promise<WebElement[]>;
    private getContent;
    /**
     * Dismisses the dialog.
     */
    doClose(): Promise<void>;
}
