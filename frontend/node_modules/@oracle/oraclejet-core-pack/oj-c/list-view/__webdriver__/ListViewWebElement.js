"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListViewWebElement = void 0;
const ListViewWebElementBase_1 = require("./ListViewWebElementBase");
const selenium_webdriver_1 = require("selenium-webdriver");
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const oj_module_proxy_1 = require("@oracle/oraclejet-webdriver/lib/oj-module-proxy");
const contextMenuUtils_1 = require("./contextMenuUtils");
/**
 * The component WebElement for [oj-c-list-view](../../jsdocs/oj-c.ListView.html).
 * Do not instantiate this class directly, instead, use
 * [findListView](../functions/findListView.html).
 */
class ListViewWebElement extends ListViewWebElementBase_1.ListViewWebElementBase {
    // Put overrides here
    /**
     * Sets the value of "selected" property.
     * Specifies the current selected items in the listview. See the Help documentation for more information.
     * @param selected The value to set for "selected"
     * @override
     * @typeparam K Type of keys
     */
    async changeSelected(selected) {
        await this.whenReady();
        return (0, oj_module_proxy_1.executeWithModules)(this.getDriver(), ['KeySet'], [this, selected], ({ KeySetImpl }, ele, selected) => (ele.selected = new KeySetImpl(selected)));
    }
    /**
     * Gets the value of "selected" property.
     * Retrieves the current selected items in the listview. See the Help documentation for more information.
     * @override
     * @typeparam K Type of keys
     * @return The value of "selected" property.
     */
    async getSelected() {
        await this.whenReady();
        const selected = await this.getDriver().executeScript((ele) => ele.selected.isAddAll()
            ? Array.from(ele.selected.deletedValues())
            : Array.from(ele.selected.values()), this);
        return selected;
    }
    /**
     * Retrieve a SlotProxy which represents a single listview item.
     * @param key The key within the Collection's dataset associated with the item.
     */
    async findItem(itemLocator) {
        await this.whenReady();
        try {
            return (0, oraclejet_webdriver_1.slotProxy)(await this.findElement(selenium_webdriver_1.By.css(`[data-oj-key="${itemLocator.key}"] [role="gridcell"]`)));
        }
        catch (ex) {
            throw Error(`No corresponding item found for the itemLocator ${JSON.stringify(itemLocator, null, 2)}`);
        }
    }
    /**
     * Find a listviewitem, trigger a context menu from it and click a menu item.
     * @param itemLocator The item locator key within the Collection's dataset associated with the item.
     * @param path Path that consist of the label/key of the menu item and the label/key of the submenu that leads to the menu item.
     *
     */
    async doContextMenuAction(itemLocator, path) {
        await this.whenReady();
        let el;
        try {
            el = await this.findElement(selenium_webdriver_1.By.css(`[data-oj-key="${itemLocator.key}"] [role="gridcell"]`));
        }
        catch (ex) {
            throw Error(`No corresponding item found for the itemLocator ${JSON.stringify(itemLocator, null, 2)}`);
        }
        await (0, contextMenuUtils_1.doContextMenuAction)(path, el, this);
    }
    /**
     * Find a listviewitem, trigger a context menu from it and click a select menu item.
     * @param itemLocator The item locator key within the Collection's dataset associated with the item.
     * @param path Path that consist of the label/key of the menu item and the label/key of the submenu that leads to the menu item. If key is specified it also include item value of the select menu item that is going to be clicked.
     *
     */
    async doContextMenuGroupAction(itemLocator, path) {
        await this.whenReady();
        let el;
        try {
            el = await this.findElement(selenium_webdriver_1.By.css(`[data-oj-key="${itemLocator.key}"] [role="gridcell"]`));
        }
        catch (ex) {
            throw Error(`No corresponding item found for the itemLocator ${JSON.stringify(itemLocator, null, 2)}`);
        }
        await (0, contextMenuUtils_1.doContextMenuGroupAction)(path, el, this);
    }
}
exports.ListViewWebElement = ListViewWebElement;
//# sourceMappingURL=ListViewWebElement.js.map