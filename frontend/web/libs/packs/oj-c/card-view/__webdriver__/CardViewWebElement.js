"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CardViewWebElement = void 0;
const CardViewWebElementBase_1 = require("./CardViewWebElementBase");
const selenium_webdriver_1 = require("selenium-webdriver");
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const oj_module_proxy_1 = require("@oracle/oraclejet-webdriver/lib/oj-module-proxy");
/**
/**
 * The component WebElement for [oj-c-card-view](../../jsdocs/oj-c.CardView.html).
 * Do not instantiate this class directly, instead, use
 * [findCardView](../modules.html#findCardView).
 */
class CardViewWebElement extends CardViewWebElementBase_1.CardViewWebElementBase {
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
        const selected = await this.getDriver().executeScript((ele) => {
            const selected = ele.selected.isAddAll()
                ? Array.from(ele.selected.deletedValues())
                : Array.from(ele.selected.values());
            return selected;
        }, this);
        return selected;
    }
    /**
     * Retrieve a SlotProxy which represents a single listview item.
     * @param key The key within the Collection's dataset associated with the item.
     */
    async findItem(itemLocator) {
        try {
            await this.whenReady();
            return (0, oraclejet_webdriver_1.slotProxy)(await this.findElement(selenium_webdriver_1.By.css(`[role="gridcell"][data-oj-key="${itemLocator.key}"]`)));
        }
        catch (ex) {
            throw Error(`No corresponding item found for the itemLocator ${JSON.stringify(itemLocator, null, 2)}`);
        }
    }
}
exports.CardViewWebElement = CardViewWebElement;
//# sourceMappingURL=CardViewWebElement.js.map