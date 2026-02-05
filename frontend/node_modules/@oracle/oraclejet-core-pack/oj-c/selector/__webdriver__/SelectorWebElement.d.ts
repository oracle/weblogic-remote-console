import { SelectorWebElementBase } from './SelectorWebElementBase';
/**
 * The component WebElement for [oj-c-selector](../../jsdocs/oj-c.Selector.html).
 * Do not instantiate this class directly, instead, use
 * [findSelector](../functions/findSelector.html).
 */
export declare class SelectorWebElement extends SelectorWebElementBase {
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
