"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormLayoutWebElement = void 0;
exports.findFormLayout = findFormLayout;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const FormLayoutWebElement_1 = require("./FormLayoutWebElement");
Object.defineProperty(exports, "FormLayoutWebElement", { enumerable: true, get: function () { return FormLayoutWebElement_1.FormLayoutWebElement; } });
/**
 * Retrieve an instance of [FormLayoutWebElement](../classes/FormLayoutWebElement.html).
 * @example
 * ```javascript
 * import { findFormLayout } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findFormLayout(driver, By.id('my-oj-c-form-layout'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findFormLayout(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type FormLayoutWebElement
    if (!(webEl instanceof FormLayoutWebElement_1.FormLayoutWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'FormLayoutWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findFormLayout(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${FormLayoutWebElement_1.FormLayoutWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-form-layout', FormLayoutWebElement_1.FormLayoutWebElement);
//# sourceMappingURL=index.js.map