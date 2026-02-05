"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitMenuButtonWebElement = void 0;
const SplitMenuButtonWebElementBase_1 = require("./SplitMenuButtonWebElementBase");
const UNSAFE_Locators_1 = require("@oracle/oraclejet-testing/UNSAFE_Locators");
const testing_1 = require("@oracle/oraclejet-preact/UNSAFE_Button/testing");
const selenium_webdriver_1 = require("selenium-webdriver");
const PRIVATE_preact_webdriver_1 = require("../../../webdriver/PRIVATE_preact-webdriver");
/**
 * The component WebElement for [oj-c-split-menu-button](../../jsdocs/oj-c.SplitMenuButton.html).
 * Do not instantiate this class directly, instead, use
 * [findSplitMenuButton](../functions/findSplitMenuButton.html).
 */
class SplitMenuButtonWebElement extends SplitMenuButtonWebElementBase_1.SplitMenuButtonWebElementBase {
    constructor() {
        // Put overrides here
        super(...arguments);
        /**
         * delay - delays the milliseconds
         * await delay(2000);
         */
        // private delay = (ms: number) => new Promise((fn) => setTimeout(fn, ms));
        this.delay = (ms) => new Promise((fn) => setTimeout(fn, ms));
    }
    /**
     * Perform a click on the button action
     */
    async click() {
        // Find the action part of <button> element top element
        return (0, testing_1.findButton)((0, UNSAFE_Locators_1.byCss)('[role=button] span:first-child'), (0, PRIVATE_preact_webdriver_1.getTestElement)(this)).doAction();
    }
    /**
     * Perform a click on the button
     */
    doAction() {
        return this.click();
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
     * Fire the ojMenuAction event on the oj-c-split-menu-button, and
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
        return (0, testing_1.findButton)((0, UNSAFE_Locators_1.byCss)('span[role=none]:last-child'), (0, PRIVATE_preact_webdriver_1.getTestElement)(this)).doAction();
    }
    /**
     * In order to do nested selections, we need an isolated menu clicker
     */
    async doMenuClick(selectedValue) {
        // Find the <menu-item> element to click
        await this.delay(350);
        const menuItems = await this.getDriver().findElements(selenium_webdriver_1.By.css('#__root_layer_host [role^=menuitem], #__oj_zorder_container [role^=menuitem]'));
        const match = await this.findAsyncSequential(menuItems, async (item) => {
            const text = await item.getText();
            return text === selectedValue;
        });
        await match?.click();
    }
}
exports.SplitMenuButtonWebElement = SplitMenuButtonWebElement;
//# sourceMappingURL=SplitMenuButtonWebElement.js.map