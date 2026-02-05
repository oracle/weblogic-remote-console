import { SelectSingleWebElementBase } from './SelectSingleWebElementBase';
/**
 * The component WebElement for [oj-c-select-single](../../jsdocs/oj-c.SelectSingle.html).
 * Do not instantiate this class directly, instead, use
 * [findSelectSingle](../functions/findSelectSingle.html).
 */
export declare class SelectSingleWebElement extends SelectSingleWebElementBase {
    /**
     * Sets the value of the <code>value</code> property.
     * The value of the component.
     * @param value The value to set for <code>value</code>
     * @override
     */
    changeValue<V extends string | number>(value: V | null): Promise<void>;
    /**
     * Clears the value of the component.
     * @override
     */
    clear(): Promise<void>;
    /**
     * Triggers the <code>ojAdvancedSearchAction</code> event.
     * @param searchText The <code>searchText</code> to include in the
     * <code>ojAdvancedSearchAction</code> event.
     */
    doAdvancedSearchAction(searchText: string): Promise<void>;
}
