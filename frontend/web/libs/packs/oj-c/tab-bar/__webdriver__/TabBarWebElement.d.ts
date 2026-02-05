import { TabBarWebElementBase } from './TabBarWebElementBase';
/**
 * The component WebElement for [oj-c-tab-bar](../../jsdocs/oj-c.TabBar.html).
 * Do not instantiate this class directly, instead, use
 * [findTabBar](../functions/findTabBar.html).
 */
export declare class TabBarWebElement extends TabBarWebElementBase {
    /**
     * Selects tab specified by key.
     * Triggers ojSelectionAction regardless if the key passed is same as the current selection value or not.
     * @param key key of the tab to be selected
     * @override
     * @typeparam K Type of keys
     */
    doSelection<K>(key: K): Promise<void>;
    /**
     * Remove tab specified by key.
     * @param key key of the tab to be removed
     * @override
     * @typeparam K Type of keys
     */
    doRemove<K>(key: K): Promise<void>;
    /**
     * Selects tab specified by key.
     * Put the tab to the specified place
     * @param key key of the tab to be reordered
     * @param position the index or the key of the tab that user want to move in front of, if the key is null, the tab will move to the end of the tabbar
     * @override
     * @typeparam K Type of keys
     * @typeparam number Type of index
     */
    doReorder<K>(key: K, position: {
        index: number;
    } | {
        key: K | null;
    }): Promise<any>;
}
