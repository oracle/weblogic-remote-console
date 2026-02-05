"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressBarWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-progress-bar WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, ProgressBarWebElement.ts.
 */
class ProgressBarWebElementBase extends elements_1.OjWebElement {
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
     * The value of the Progress Bar.
     * @return The value of <code>value</code> property.
     *
     */
    getValue() {
        return this.getProperty('value');
    }
    /**
     * Gets the value of <code>edge</code> property.
     * Specifies whether the progress bar is on the top edge of a container
     * @return The value of <code>edge</code> property.
     *
     */
    getEdge() {
        return this.getProperty('edge');
    }
}
exports.ProgressBarWebElementBase = ProgressBarWebElementBase;
//# sourceMappingURL=ProgressBarWebElementBase.js.map