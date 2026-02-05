"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatePickerWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-date-picker WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, DatePickerWebElement.ts.
 */
class DatePickerWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>dayFormatter</code> property.
     *
     * @return The value of <code>dayFormatter</code> property.
     *
     */
    getDayFormatter() {
        return this.getProperty('dayFormatter');
    }
    /**
     * Gets the value of <code>daysOutsideMonth</code> property.
     *
     * @return The value of <code>daysOutsideMonth</code> property.
     *
     */
    getDaysOutsideMonth() {
        return this.getProperty('daysOutsideMonth');
    }
    /**
     * Gets the value of <code>monthAndYearPicker</code> property.
     *
     * @return The value of <code>monthAndYearPicker</code> property.
     *
     */
    getMonthAndYearPicker() {
        return this.getProperty('monthAndYearPicker');
    }
    /**
     * Gets the value of <code>max</code> property.
     * The maximum selectable date, in ISO string format
     * @return The value of <code>max</code> property.
     *
     */
    getMax() {
        return this.getProperty('max');
    }
    /**
     * Gets the value of <code>maxWidth</code> property.
     * Specifies the component style maxWidth.
     * @return The value of <code>maxWidth</code> property.
     *
     */
    getMaxWidth() {
        return this.getProperty('maxWidth');
    }
    /**
     * Gets the value of <code>min</code> property.
     * The maximum selectable date, in ISO string format
     * @return The value of <code>min</code> property.
     *
     */
    getMin() {
        return this.getProperty('min');
    }
    /**
     * Gets the value of <code>readonly</code> property.
     *
     * @return The value of <code>readonly</code> property.
     *
     */
    getReadonly() {
        return this.getProperty('readonly');
    }
    /**
     * Gets the value of <code>todayButton</code> property.
     *
     * @return The value of <code>todayButton</code> property.
     *
     */
    getTodayButton() {
        return this.getProperty('todayButton');
    }
    /**
     * Gets the value of <code>todayTimeZone</code> property.
     *
     * @return The value of <code>todayTimeZone</code> property.
     *
     */
    getTodayTimeZone() {
        return this.getProperty('todayTimeZone');
    }
    /**
     * Sets the value of <code>value</code> property.
     *
     * @param value The value to set for <code>value</code>
     *
     */
    changeValue(value) {
        return this.setProperty('value', value);
    }
    /**
     * Gets the value of <code>value</code> property.
     *
     * @return The value of <code>value</code> property.
     *
     */
    getValue() {
        return this.getProperty('value');
    }
    /**
     * Gets the value of <code>weekDisplay</code> property.
     *
     * @return The value of <code>weekDisplay</code> property.
     *
     */
    getWeekDisplay() {
        return this.getProperty('weekDisplay');
    }
    /**
     * Gets the value of <code>width</code> property.
     * Specifies the component style width.
     * @return The value of <code>width</code> property.
     *
     */
    getWidth() {
        return this.getProperty('width');
    }
}
exports.DatePickerWebElementBase = DatePickerWebElementBase;
//# sourceMappingURL=DatePickerWebElementBase.js.map