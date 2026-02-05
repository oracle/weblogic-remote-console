import { TabBarMixedWebElementBase } from './TabBarMixedWebElementBase';
/**
 * The component WebElement for [oj-c-tab-bar-mixed](../../jsdocs/oj-c.TabBarMixed.html).
 * Do not instantiate this class directly, instead, use
 * [findTabBarMixed](../modules.html#findTabBarMixed).
 */
export declare class TabBarMixedWebElement extends TabBarMixedWebElementBase {
    /**
     * Selects tab specified by key.
     * Triggers ojSelectionAction regardless if the key passed is same as the current selection value or not.
     * @param key key of the tab to be selected
     * @override
     * @typeparam K Type of keys
     */
    doSelection<K>(key: K): Promise<void>;
    /**
     * Removes tab specified by key.
     * @param key key of the tab to be removed
     * @override
     * @typeparam K Type of keys
     */
    doRemove<K>(key: K): Promise<void>;
}
