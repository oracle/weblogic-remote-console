import { SelectorAllWebElementBase } from './SelectorAllWebElementBase';
/**
 * The component WebElement for [oj-c-selector-all](../../jsdocs/oj-c.SelectorAll.html).
 * Do not instantiate this class directly, instead, use
 * [findSelectorAll](../functions/findSelectorAll.html).
 */
export declare class SelectorAllWebElement extends SelectorAllWebElementBase {
    /**
     * Gets the selected value of the selector.
     * @return boolean selection checked state.
     * Note test authors should not use this method to check whether an item is selected
     * when this is used with ListView or other collection components.
     * Rather, tests should use the test adapter method on ListView (or other collection) to get the selection
     * and check whether the item key is in it.
     */
    isSelected(): Promise<boolean>;
}
