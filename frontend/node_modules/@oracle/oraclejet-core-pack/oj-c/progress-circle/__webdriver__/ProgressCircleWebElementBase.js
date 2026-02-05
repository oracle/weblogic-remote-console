"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressCircleWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-progress-circle WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, ProgressCircleWebElement.ts.
 */
class ProgressCircleWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>max</code> property.
     * The maximum allowed value.
     * @return The value of <code>max</code> property.
     *
     */
    getMax() {
        return this.getProperty('max');
    }
    /**
     * Gets the value of <code>value</code> property.
     * The value of the Progress Circle.
     * @return The value of <code>value</code> property.
     *
     */
    getValue() {
        return this.getProperty('value');
    }
    /**
     * Gets the value of <code>size</code> property.
     * Specifies the size of the progress circle.
     * @return The value of <code>size</code> property.
     *
     */
    getSizeProperty() {
        return this.getProperty('size');
    }
}
exports.ProgressCircleWebElementBase = ProgressCircleWebElementBase;
//# sourceMappingURL=ProgressCircleWebElementBase.js.map