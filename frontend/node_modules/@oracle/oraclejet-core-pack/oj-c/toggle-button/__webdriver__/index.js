"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleButtonWebElement = void 0;
exports.findToggleButton = findToggleButton;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const ToggleButtonWebElement_1 = require("./ToggleButtonWebElement");
Object.defineProperty(exports, "ToggleButtonWebElement", { enumerable: true, get: function () { return ToggleButtonWebElement_1.ToggleButtonWebElement; } });
/**
 * Retrieve an instance of [ToggleButtonWebElement](../classes/ToggleButtonWebElement.html).
 * @example
 * ```javascript
 * import { findToggleButton } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findToggleButton(driver, By.id('my-oj-c-toggle-button'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findToggleButton(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type ToggleButtonWebElement
    if (!(webEl instanceof ToggleButtonWebElement_1.ToggleButtonWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'ToggleButtonWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findToggleButton(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${ToggleButtonWebElement_1.ToggleButtonWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-toggle-button', ToggleButtonWebElement_1.ToggleButtonWebElement);
//# sourceMappingURL=index.js.map