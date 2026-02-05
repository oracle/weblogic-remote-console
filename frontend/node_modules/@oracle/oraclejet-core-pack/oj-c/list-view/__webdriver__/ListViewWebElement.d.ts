import { ListViewWebElementBase } from './ListViewWebElementBase';
import { SlotProxy } from '@oracle/oraclejet-webdriver';
import { doContextMenuAction as MenuUtilsDoContextMenuAction, doContextMenuGroupAction as MenuUtilsDoContextMenuGroupAction } from './contextMenuUtils';
/**
 * The component WebElement for [oj-c-list-view](../../jsdocs/oj-c.ListView.html).
 * Do not instantiate this class directly, instead, use
 * [findListView](../functions/findListView.html).
 */
export declare class ListViewWebElement extends ListViewWebElementBase {
    /**
     * Sets the value of "selected" property.
     * Specifies the current selected items in the listview. See the Help documentation for more information.
     * @param selected The value to set for "selected"
     * @override
     * @typeparam K Type of keys
     */
    changeSelected<K>(selected: Array<K>): Promise<K>;
    /**
     * Gets the value of "selected" property.
     * Retrieves the current selected items in the listview. See the Help documentation for more information.
     * @override
     * @typeparam K Type of keys
     * @return The value of "selected" property.
     */
    getSelected<K>(): Promise<Array<K>>;
    /**
     * Retrieve a SlotProxy which represents a single listview item.
     * @param key The key within the Collection's dataset associated with the item.
     */
    findItem<T>(itemLocator: {
        key: T;
    }): Promise<SlotProxy>;
    /**
     * Find a listviewitem, trigger a context menu from it and click a menu item.
     * @param itemLocator The item locator key within the Collection's dataset associated with the item.
     * @param path Path that consist of the label/key of the menu item and the label/key of the submenu that leads to the menu item.
     *
     */
    doContextMenuAction<T>(itemLocator: {
        key: T;
    }, path: Parameters<typeof MenuUtilsDoContextMenuAction>[0]): Promise<void>;
    /**
     * Find a listviewitem, trigger a context menu from it and click a select menu item.
     * @param itemLocator The item locator key within the Collection's dataset associated with the item.
     * @param path Path that consist of the label/key of the menu item and the label/key of the submenu that leads to the menu item. If key is specified it also include item value of the select menu item that is going to be clicked.
     *
     */
    doContextMenuGroupAction<T>(itemLocator: {
        key: T;
    }, path: Parameters<typeof MenuUtilsDoContextMenuGroupAction>[0]): Promise<void>;
}
