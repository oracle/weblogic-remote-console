"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputMonthMaskWebElement = void 0;
const InputMonthMaskWebElementBase_1 = require("./InputMonthMaskWebElementBase");
/**
 * The component WebElement for [oj-c-input-month-mask](../../jsdocs/oj-c.InputMonthMask.html).
 * Do not instantiate this class directly, instead, use
 * [findInputMonthMask](../modules.html#findInputMonthMask).
 */
class InputMonthMaskWebElement extends InputMonthMaskWebElementBase_1.InputMonthMaskWebElementBase {
    // Put overrides here
    /**
     * Sets the value of <code>value</code> property.
     * The value of the component.
     * @param value The value to set for <code>value</code>
     *
     */
    async changeDate(value) {
        return this.setProperty('value', value);
    }
}
exports.InputMonthMaskWebElement = InputMonthMaskWebElement;
//# sourceMappingURL=InputMonthMaskWebElement.js.map