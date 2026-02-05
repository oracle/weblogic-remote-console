"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabBarWebElement = void 0;
const selenium_webdriver_1 = require("selenium-webdriver");
const TabBarWebElementBase_1 = require("./TabBarWebElementBase");
/**
 * The component WebElement for [oj-c-tab-bar](../../jsdocs/oj-c.TabBar.html).
 * Do not instantiate this class directly, instead, use
 * [findTabBar](../functions/findTabBar.html).
 */
class TabBarWebElement extends TabBarWebElementBase_1.TabBarWebElementBase {
    // Put overrides here
    /**
     * Selects tab specified by key.
     * Triggers ojSelectionAction regardless if the key passed is same as the current selection value or not.
     * @param key key of the tab to be selected
     * @override
     * @typeparam K Type of keys
     */
    async doSelection(key) {
        await this.whenReady();
        try {
            const tab = await this.findElement(selenium_webdriver_1.By.css(`[data-oj-key="${key}"]`));
            await tab?.click();
        }
        catch (e) {
            throw new selenium_webdriver_1.error.NoSuchElementError(`Tab with specified key cannot be found`);
        }
    }
    /**
     * Remove tab specified by key.
     * @param key key of the tab to be removed
     * @override
     * @typeparam K Type of keys
     */
    async doRemove(key) {
        await this.whenReady();
        try {
            const tab = await this.findElement(selenium_webdriver_1.By.css(`[data-oj-key="${key}"]`));
            const button = tab.findElement(selenium_webdriver_1.By.css('[data-oj-tabbar-item-remove-icon="true"]'));
            await button?.click();
        }
        catch (e) {
            throw new selenium_webdriver_1.error.NoSuchElementError(`Tab with specified key cannot be found`);
        }
    }
    /**
     * Selects tab specified by key.
     * Put the tab to the specified place
     * @param key key of the tab to be reordered
     * @param position the index or the key of the tab that user want to move in front of, if the key is null, the tab will move to the end of the tabbar
     * @override
     * @typeparam K Type of keys
     * @typeparam number Type of index
     */
    async doReorder(key, position) {
        await this.whenReady();
        await this.getDriver().executeScript((root, key, position) => {
            const ele = root.querySelectorAll('[role=tab]');
            if ('index' in position && (position.index < 0 || position.index > ele.length - 1)) {
                throw new Error('invaild index');
            }
            const tabBarKeys = [];
            let desIndex = -1;
            let srcIndex = -1;
            for (let i = 0; i < ele.length; i++) {
                if (ele[i].getAttribute('data-oj-key') === key) {
                    srcIndex = i;
                }
                if ('key' in position && position.key !== null) {
                    if (ele[i].getAttribute('data-oj-key') === position.key) {
                        desIndex = i;
                    }
                }
                tabBarKeys.push(ele[i].getAttribute('data-oj-key'));
            }
            if ('index' in position && position.index) {
                desIndex = position.index;
            }
            if ('key' in position && position.key === null) {
                desIndex = tabBarKeys.length;
            }
            if (srcIndex < desIndex) {
                desIndex--;
            }
            if (desIndex === -1 || srcIndex === -1) {
                throw new Error('invaild key');
            }
            const [el] = tabBarKeys.splice(srcIndex, 1);
            tabBarKeys.splice(desIndex, 0, el);
            return root._doReorderHelper(tabBarKeys);
        }, this, key, position);
    }
}
exports.TabBarWebElement = TabBarWebElement;
//# sourceMappingURL=TabBarWebElement.js.map