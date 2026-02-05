import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-date-picker WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, DatePickerWebElement.ts.
 */
export declare class DatePickerWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>dayFormatter</code> property.
     *
     * @return The value of <code>dayFormatter</code> property.
     *
     */
    getDayFormatter(): Promise<null>;
    /**
     * Gets the value of <code>daysOutsideMonth</code> property.
     *
     * @return The value of <code>daysOutsideMonth</code> property.
     *
     */
    getDaysOutsideMonth(): Promise<string>;
    /**
     * Gets the value of <code>monthAndYearPicker</code> property.
     *
     * @return The value of <code>monthAndYearPicker</code> property.
     *
     */
    getMonthAndYearPicker(): Promise<string>;
    /**
     * Gets the value of <code>max</code> property.
     * The maximum selectable date, in ISO string format
     * @return The value of <code>max</code> property.
     *
     */
    getMax(): Promise<string | null>;
    /**
     * Gets the value of <code>maxWidth</code> property.
     * Specifies the component style maxWidth.
     * @return The value of <code>maxWidth</code> property.
     *
     */
    getMaxWidth(): Promise<number | string>;
    /**
     * Gets the value of <code>min</code> property.
     * The maximum selectable date, in ISO string format
     * @return The value of <code>min</code> property.
     *
     */
    getMin(): Promise<string | null>;
    /**
     * Gets the value of <code>readonly</code> property.
     *
     * @return The value of <code>readonly</code> property.
     *
     */
    getReadonly(): Promise<boolean>;
    /**
     * Gets the value of <code>todayButton</code> property.
     *
     * @return The value of <code>todayButton</code> property.
     *
     */
    getTodayButton(): Promise<string>;
    /**
     * Gets the value of <code>todayTimeZone</code> property.
     *
     * @return The value of <code>todayTimeZone</code> property.
     *
     */
    getTodayTimeZone(): Promise<string>;
    /**
     * Sets the value of <code>value</code> property.
     *
     * @param value The value to set for <code>value</code>
     *
     */
    changeValue(value: string | null): Promise<void>;
    /**
     * Gets the value of <code>value</code> property.
     *
     * @return The value of <code>value</code> property.
     *
     */
    getValue(): Promise<string | null>;
    /**
     * Gets the value of <code>weekDisplay</code> property.
     *
     * @return The value of <code>weekDisplay</code> property.
     *
     */
    getWeekDisplay(): Promise<string>;
    /**
     * Gets the value of <code>width</code> property.
     * Specifies the component style width.
     * @return The value of <code>width</code> property.
     *
     */
    getWidth(): Promise<number | string>;
}
