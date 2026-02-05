"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolbarWebElement = void 0;
const selenium_webdriver_1 = require("selenium-webdriver");
const ToolbarWebElementBase_1 = require("./ToolbarWebElementBase");
const webdriver_1 = require("../../../webdriver");
/**
 * The component WebElement for [oj-c-toolbar](../../jsdocs/oj-c.Toolbar.html).
 * Do not instantiate this class directly, instead, use
 * [findToolbar](../functions/findToolbar.html).
 */
class ToolbarWebElement extends ToolbarWebElementBase_1.ToolbarWebElementBase {
    // Put overrides here
    /**
     * Gets the value of <code>items</code> property.
     * Specifies the content to be placed into the toolbar.
     * @return The value of <code>items</code> property.
     *
     */
    getItems() {
        return this.getProperty('items');
    }
    /**
     * Performs action of toolbar item specified by key.
     * @param itemLocation object containing key of the item to be activated.
     * Used for triggering the action on an item of type 'button' or 'progress-button', triggering the action on the button portion of an item of type 'oj-c-split-menu-button', or triggering the action on a menu item inside of an item of type 'menu-button' or 'split-menu-button'.
     * For changing the selection state of an item of type buttonset-single or buttonset-multiple, changing the selection state of a menu selection group inside of an item of type oj-c-menu-button or oj-c-split-menu-button, or changing the value of an item of type toggle-button, use the changeToolbarSelection method.
     * @override
     * @typeparam string
     * @param path optional object of label or labels, only needed for menu items
     */
    async doToolbarAction(itemLocator, path) {
        const toolbarItem = await this.findElement(selenium_webdriver_1.By.css(`[data-oj-private-key="${itemLocator.key}"]`));
        const elementType = toolbarItem.constructor;
        switch (elementType) {
            case webdriver_1.ButtonWebElement:
            case webdriver_1.ProgressButtonWebElement:
                if (path) {
                    throw Error(`A path was supplied, but item types of 'button' or 'progress-button' do not support menus`);
                }
                else {
                    await toolbarItem.doAction();
                }
                break;
            case webdriver_1.MenuButtonWebElement:
                if (path) {
                    await toolbarItem.doMenuAction(path.label);
                }
                break;
            case webdriver_1.SplitMenuButtonWebElement:
                if (path) {
                    await toolbarItem.doMenuAction(path.label);
                }
                else {
                    await toolbarItem.doAction();
                }
                break;
            case webdriver_1.ButtonsetSingleWebElement:
            case webdriver_1.ButtonsetMultipleWebElement:
            case webdriver_1.ToggleButtonWebElement:
                throw Error(`The toolbar item found for the itemLocator ${JSON.stringify(itemLocator, null, 2)} is of item type 'buttonset-single', 'buttonset-multiple', or 'toggle-button', which do not support actions. Try using the changeToolbarSelection method instead.`);
        }
    }
}
exports.ToolbarWebElement = ToolbarWebElement;
//# sourceMappingURL=ToolbarWebElement.js.map