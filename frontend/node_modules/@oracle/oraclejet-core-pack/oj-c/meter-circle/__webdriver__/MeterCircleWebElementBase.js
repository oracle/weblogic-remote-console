"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeterCircleWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-meter-circle WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, MeterCircleWebElement.ts.
 */
class MeterCircleWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>max</code> property.
     * The maximum value of the meter circle.
     * @return The value of <code>max</code> property.
     *
     */
    getMax() {
        return this.getProperty('max');
    }
    /**
     * Gets the value of <code>min</code> property.
     * The minimum value of the meter circle.
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
     * Sets the value of <code>value</code> property.
     * The value of the meter circle.
     * @param value The value to set for <code>value</code>
     *
     */
    changeValue(value) {
        return this.setProperty('value', value);
    }
    /**
     * Gets the value of <code>value</code> property.
     * The value of the meter circle.
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
     * Gets the value of <code>color</code> property.
     *
     * @return The value of <code>color</code> property.
     *
     */
    getColor() {
        return this.getProperty('color');
    }
    /**
     * Gets the value of <code>indicatorSize</code> property.
     *
     * @return The value of <code>indicatorSize</code> property.
     *
     */
    getIndicatorSize() {
        return this.getProperty('indicatorSize');
    }
    /**
     * Gets the value of <code>innerRadius</code> property.
     *
     * @return The value of <code>innerRadius</code> property.
     *
     */
    getInnerRadius() {
        return this.getProperty('innerRadius');
    }
    /**
     * Gets the value of <code>plotArea</code> property.
     *
     * @return The value of <code>plotArea</code> property.
     *
     */
    getPlotArea() {
        return this.getProperty('plotArea');
    }
    /**
     * Gets the value of <code>angleExtent</code> property.
     *
     * @return The value of <code>angleExtent</code> property.
     *
     */
    getAngleExtent() {
        return this.getProperty('angleExtent');
    }
    /**
     * Gets the value of <code>startAngle</code> property.
     *
     * @return The value of <code>startAngle</code> property.
     *
     */
    getStartAngle() {
        return this.getProperty('startAngle');
    }
    /**
     * Gets the value of <code>referenceLines</code> property.
     *
     * @return The value of <code>referenceLines</code> property.
     *
     */
    getReferenceLines() {
        return this.getProperty('referenceLines');
    }
    /**
     * Gets the value of <code>thresholdDisplay</code> property.
     *
     * @return The value of <code>thresholdDisplay</code> property.
     *
     */
    getThresholdDisplay() {
        return this.getProperty('thresholdDisplay');
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
     * Specifies the size of the meter circle.
     * @return The value of <code>size</code> property.
     *
     */
    getSizeProperty() {
        return this.getProperty('size');
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
     * Gets the value of <code>transientValue</code> property.
     *
     * @return The value of <code>transientValue</code> property.
     *
     */
    getTransientValue() {
        return this.getProperty('transientValue');
    }
}
exports.MeterCircleWebElementBase = MeterCircleWebElementBase;
//# sourceMappingURL=MeterCircleWebElementBase.js.map