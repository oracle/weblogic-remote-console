"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputDatePickerWebElement = void 0;
exports.findInputDatePicker = findInputDatePicker;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const InputDatePickerWebElement_1 = require("./InputDatePickerWebElement");
Object.defineProperty(exports, "InputDatePickerWebElement", { enumerable: true, get: function () { return InputDatePickerWebElement_1.InputDatePickerWebElement; } });
/**
 * Retrieve an instance of [InputDatePickerWebElement](../classes/InputDatePickerWebElement.html).
 * @example
 * ```javascript
 * import { findInputDatePicker } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findInputDatePicker(driver, By.id('my-oj-c-input-date-picker'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findInputDatePicker(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type InputDatePickerWebElement
    if (!(webEl instanceof InputDatePickerWebElement_1.InputDatePickerWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'InputDatePickerWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findInputDatePicker(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${InputDatePickerWebElement_1.InputDatePickerWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-input-date-picker', InputDatePickerWebElement_1.InputDatePickerWebElement);
//# sourceMappingURL=index.js.map