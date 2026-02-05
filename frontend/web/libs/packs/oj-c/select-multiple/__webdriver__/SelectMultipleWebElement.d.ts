import { SelectMultipleWebElementBase } from './SelectMultipleWebElementBase';
/**
 * The component WebElement for [oj-c-select-multiple](../../jsdocs/oj-c.SelectMultiple.html).
 * Do not instantiate this class directly, instead, use
 * [findSelectMultiple](../functions/findSelectMultiple.html).
 */
export declare class SelectMultipleWebElement extends SelectMultipleWebElementBase {
    /**
     * Sets the value of the <code>value</code> property.
     * The value of the component.
     * @param value The value to set for <code>value</code>
     * @override
     */
    changeValue<K extends string | number>(value: Set<K> | null): Promise<void>;
    /**
     * Gets the value of <code>value</code> property.
     * The value of the component.
     * @return The value of <code>value</code> property.
     *
     */
    getValue(): Promise<Set<string | number> | null>;
    /**
     * Clears the value of the component.
     * @override
     */
    clear(): Promise<void>;
}
