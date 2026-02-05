"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuButtonWebElement = void 0;
const MenuButtonWebElementBase_1 = require("./MenuButtonWebElementBase");
const selenium_webdriver_1 = require("selenium-webdriver");
const MENU_ITEM_LOCATION = '#__oj_zorder_container [role=menuitem], #__root_layer_host [role=menuitem], ' +
    '#__oj_zorder_container [role=menuitemradio], #__root_layer_host [role=menuitemradio], ' +
    '#__oj_zorder_container [role=menuitemcheckbox], #__root_layer_host [role=menuitemcheckbox]';
/**
 * The component WebElement for [oj-c-menu-button](../../jsdocs/oj-c.MenuButton.html).
 * Do not instantiate this class directly, instead, use
 * [findMenuButton](../functions/findMenuButton.html).
 */
class MenuButtonWebElement extends MenuButtonWebElementBase_1.MenuButtonWebElementBase {
    constructor() {
        super(...arguments);
        /**
         * delay - delays the milliseconds
         * await delay(2000);
         */
        this.delay = (ms) => new Promise((fn) => setTimeout(fn, ms));
    }
    /**
     * Perform a click on the button to open the menu or close the menu
     */
    async click() {
        // Find the <button> element to click so that it can receive focus
        const button = await this.findElement(selenium_webdriver_1.By.css('button'));
        return button.click();
    }
    /**
     * Helper util
     * */
    async findAsyncSequential(array, predicate) {
        for (const t of array) {
            if (await predicate(t)) {
                return t;
            }
        }
        return undefined;
    }
    /**
     * Fire the ojMenuAction event on the oj-c-menu-button, and
     * invoke the Action handler of the selected value.
     *
     */
    async doMenuAction(selectedValue) {
        // open the menu
        await this.openMenu();
        if (Array.isArray(selectedValue)) {
            for (const value of selectedValue) {
                await this.doMenuClick(value);
            }
        }
        else {
            await this.doMenuClick(selectedValue);
        }
    }
    /**
     * openMenu - opens the menu
     */
    async openMenu() {
        const button = await this.findElement(selenium_webdriver_1.By.css('button[type=button]'));
        await button.click();
    }
    /**
     * In order to do nested selections, we need an isolated menu clicker
     */
    async doMenuClick(selectedValue) {
        // Find the <menu-item> element to click
        await this.delay(350);
        const menuItems = await this.getDriver().findElements(selenium_webdriver_1.By.css(MENU_ITEM_LOCATION));
        const match = await this.findAsyncSequential(menuItems, async (item) => {
            const text = await item.getText();
            return text === selectedValue;
        });
        await match?.click();
    }
}
exports.MenuButtonWebElement = MenuButtonWebElement;
//# sourceMappingURL=MenuButtonWebElement.js.map