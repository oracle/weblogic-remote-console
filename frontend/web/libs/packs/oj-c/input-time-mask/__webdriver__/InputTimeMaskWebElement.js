"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputTimeMaskWebElement = void 0;
const InputTimeMaskWebElementBase_1 = require("./InputTimeMaskWebElementBase");
const PRIVATE_preact_webdriver_1 = require("../../../webdriver/PRIVATE_preact-webdriver");
const testing_1 = require("@oracle/oraclejet-preact/UNSAFE_InputTimeMask/testing");
const UNSAFE_Locators_1 = require("@oracle/oraclejet-testing/UNSAFE_Locators");
const UNSAFE_IntlDateTime_1 = require("@oracle/oraclejet-preact/UNSAFE_IntlDateTime");
const UNSAFE_timeUtils_1 = require("@oracle/oraclejet-preact/utils/UNSAFE_timeUtils");
/**
 * The component WebElement for [oj-c-input-time-mask](../../jsdocs/oj-c.InputTimeMask.html).
 * Do not instantiate this class directly, instead, use
 * [findInputTimeMask](../functions/findInputTimeMask.html).
 */
class InputTimeMaskWebElement extends InputTimeMaskWebElementBase_1.InputTimeMaskWebElementBase {
    // Put overrides here
    /**
     * Sets the value of the "value" property of the input component.
     * @param value The value to set for the <code>value</code>
     */
    async changeValue(value) {
        if (!UNSAFE_IntlDateTime_1.DateTimeUtils.isTimeOnlyIsoString(value)) {
            throw new Error(`InputTimeMaskWebElement - value must be a time-only ISO string: ${value}`);
        }
        const readonly = await this.getReadonly();
        const disabled = await this.getDisabled();
        if (!(disabled || readonly)) {
            const timeValue = (0, UNSAFE_timeUtils_1.getTimeObjFromTimeOnlyISOStr)(value);
            // the getTestElement(this) locates the root of the corepack custom element (oj-c-input-time-mask),
            // and byCss('*') finds the first child element underneath the root which is the root of the preact component.
            return (0, testing_1.findInputTimeMask)((0, UNSAFE_Locators_1.byCss)('*'), (0, PRIVATE_preact_webdriver_1.getTestElement)(this)).changeValue(timeValue);
        }
        return this.whenBusyContextReady();
    }
    /**
     * Clears the value of the component.
     */
    clear() {
        return this.changeValue(null);
    }
}
exports.InputTimeMaskWebElement = InputTimeMaskWebElement;
//# sourceMappingURL=InputTimeMaskWebElement.js.map