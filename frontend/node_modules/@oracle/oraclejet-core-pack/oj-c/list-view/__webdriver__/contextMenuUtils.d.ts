import { WebElement } from 'selenium-webdriver';
type DoContextMenuAction<T = {
    label: string | string[];
    key?: never;
    itemValue?: never;
} | {
    key: string | string[];
    itemValue?: string;
    label?: never;
}> = (path: T, webElement: WebElement, parentWebElement: WebElement) => Promise<void>;
/**
 * doContextMenuAction - Triggers contextmenu and click a menu item
 * @param path Path that consist of the label/key of the menu item and the label/key of the submenu that leads to the menu item.
 * @param webElement WebElement that represents the element where the context click is done.
 * @param parentWebElement The component WebElement where the context menu config is set.
 * @returns Promise<void>
 */
export declare const doContextMenuAction: DoContextMenuAction<{
    label: string | string[];
    key?: never;
} | {
    key: string | string[];
    label?: never;
}>;
/**
 * doContextMenuGroupAction - Triggers contextmenu and click a menu item
 * @param path Path that consist of the label/key of the menu item and the label/key of the submenu that leads to the menu item. If key is specified it also include item value of the select menu item that is going to be clicked.
 * @param webElement WebElement that represents the element where the context click is done.
 * @param parentWebElement The component WebElement where the context menu config is set.
 * @returns Promise<void>
 */
export declare const doContextMenuGroupAction: DoContextMenuAction;
export {};
