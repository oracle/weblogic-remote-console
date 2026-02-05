"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingGaugeWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-rating-gauge WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, RatingGaugeWebElement.ts.
 */
class RatingGaugeWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>max</code> property.
     * The maximum value of the gauge.
     * @return The value of <code>max</code> property.
     *
     */
    getMax() {
        return this.getProperty('max');
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
     * Gets the value of <code>disabled</code> property.
     *
     * @return The value of <code>disabled</code> property.
     *
     */
    getDisabled() {
        return this.getProperty('disabled');
    }
    /**
     * Sets the value of <code>changed</code> property.
     * Whether there has been a value entered by the user even if it is the same as the initial value.
     * @param changed The value to set for <code>changed</code>
     *
     */
    changeChanged(changed) {
        return this.setProperty('changed', changed);
    }
    /**
     * Gets the value of <code>changed</code> property.
     * Whether there has been a value entered by the user even if it is the same as the initial value.
     * @return The value of <code>changed</code> property.
     *
     */
    getChanged() {
        return this.getProperty('changed');
    }
    /**
     * Sets the value of <code>value</code> property.
     * The value of the Rating Gauge.
     * @param value The value to set for <code>value</code>
     *
     */
    changeValue(value) {
        return this.setProperty('value', value);
    }
    /**
     * Gets the value of <code>value</code> property.
     * The value of the Rating Gauge.
     * @return The value of <code>value</code> property.
     *
     */
    getValue() {
        return this.getProperty('value');
    }
    /**
     * Gets the value of <code>step</code> property.
     *
     * @return The value of <code>step</code> property.
     *
     */
    getStep() {
        return this.getProperty('step');
    }
    /**
     * Gets the value of <code>describedBy</code> property.
     *
     * @return The value of <code>describedBy</code> property.
     *
     */
    getDescribedBy() {
        return this.getProperty('describedBy');
    }
    /**
     * Gets the value of <code>labelledBy</code> property.
     *
     * @return The value of <code>labelledBy</code> property.
     *
     */
    getLabelledBy() {
        return this.getProperty('labelledBy');
    }
    /**
     * Gets the value of <code>size</code> property.
     * Specifies the size of the rating gauge items.
     * @return The value of <code>size</code> property.
     *
     */
    getSizeProperty() {
        return this.getProperty('size');
    }
    /**
     * Gets the value of <code>color</code> property.
     * Specifies the color of the rating gauge items.
     * @return The value of <code>color</code> property.
     *
     */
    getColor() {
        return this.getProperty('color');
    }
    /**
     * Gets the value of <code>thresholds</code> property.
     *
     * @return The value of <code>thresholds</code> property.
     *
     */
    getThresholds() {
        return this.getProperty('thresholds');
    }
    /**
     * Gets the value of <code>datatip</code> property.
     *
     * @return The value of <code>datatip</code> property.
     *
     */
    getDatatip() {
        return this.getProperty('datatip');
    }
    /**
     * Gets the value of <code>tooltip</code> property.
     *
     * @return The value of <code>tooltip</code> property.
     *
     */
    getTooltip() {
        return this.getProperty('tooltip');
    }
    /**
     * Gets the value of <code>transientValue</code> property.
     *
     * @return The value of <code>transientValue</code> property.
     *
     */
    getTransientValue() {
        return this.getProperty('transientValue');
    }
}
exports.RatingGaugeWebElementBase = RatingGaugeWebElementBase;
//# sourceMappingURL=RatingGaugeWebElementBase.js.map