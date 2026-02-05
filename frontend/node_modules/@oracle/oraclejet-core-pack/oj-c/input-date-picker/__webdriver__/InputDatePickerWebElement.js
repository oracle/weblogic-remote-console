"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputDatePickerWebElement = void 0;
const InputDatePickerWebElementBase_1 = require("./InputDatePickerWebElementBase");
const selenium_webdriver_1 = require("selenium-webdriver");
const UNSAFE_IntlDateTime_1 = require("@oracle/oraclejet-preact/UNSAFE_IntlDateTime");
/**
 * The component WebElement for [oj-c-input-date-picker](../../jsdocs/oj-c.InputDatePicker.html).
 * Do not instantiate this class directly, instead, use
 * [findInputDatePicker](../functions/findInputDatePicker.html).
 */
class InputDatePickerWebElement extends InputDatePickerWebElementBase_1.InputDatePickerWebElementBase {
    /**
     * Sets the value of the "value" property of the input component.
     * @param value The value to set for the <code>value</code>
     */
    async changeValue(value) {
        if (!UNSAFE_IntlDateTime_1.DateTimeUtils.isDateOnlyIsoString(value)) {
            throw new Error(`InputDatePickerWebElement - value must be a date-only ISO string: ${value}`);
        }
        const readonly = await this.getReadonly();
        const disabled = await this.getDisabled();
        if (!(disabled || readonly)) {
            await this.getDriver().executeScript((el) => el.focus(), this);
            await this.whenBusyContextReady();
            const segments = await this.findElements(selenium_webdriver_1.By.css('[role="spinbutton"]'));
            if (!value) {
                // Delete the text in each of the mask segments.
                for (const segment of segments) {
                    await segment.click();
                    await segment.sendKeys(selenium_webdriver_1.Key.BACK_SPACE);
                    await this.whenBusyContextReady();
                }
            }
            else {
                // Enter text in each of the mask segments.
                const tokenizedValue = value.split('-');
                if (segments.length === 3 && tokenizedValue.length === 3) {
                    for (const segment of segments) {
                        await segment.click();
                        const dataSegment = await segment.getAttribute('data-segment');
                        const segmentValue = dataSegment === 'month'
                            ? tokenizedValue[1]
                            : dataSegment === 'year'
                                ? tokenizedValue[0]
                                : tokenizedValue[2];
                        await segment.sendKeys(selenium_webdriver_1.Key.BACK_SPACE);
                        await this.whenBusyContextReady();
                        // send the keys one at a time, because otherwise the year segment only seems to
                        // end up with the last two digits of the year
                        for (let i = 0; i < segmentValue.length; i++) {
                            await segment.sendKeys(segmentValue.charAt(i));
                            await this.whenBusyContextReady();
                        }
                    }
                }
            }
            // Commit the new value.
            if (segments.length > 0) {
                await segments[segments.length - 1].sendKeys(selenium_webdriver_1.Key.ENTER);
            }
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
exports.InputDatePickerWebElement = InputDatePickerWebElement;
//# sourceMappingURL=InputDatePickerWebElement.js.map