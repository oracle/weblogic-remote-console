"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelledLinkWebElement = void 0;
exports.findLabelledLink = findLabelledLink;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const LabelledLinkWebElement_1 = require("./LabelledLinkWebElement");
Object.defineProperty(exports, "LabelledLinkWebElement", { enumerable: true, get: function () { return LabelledLinkWebElement_1.LabelledLinkWebElement; } });
/**
 * Retrieve an instance of [LabelledLinkWebElement](../classes/LabelledLinkWebElement.html).
 * @example
 * ```javascript
 * import { findLabelledLink } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findLabelledLink(driver, By.id('my-oj-c-labelled-link'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findLabelledLink(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type LabelledLinkWebElement
    if (!(webEl instanceof LabelledLinkWebElement_1.LabelledLinkWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'LabelledLinkWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findLabelledLink(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${LabelledLinkWebElement_1.LabelledLinkWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-labelled-link', LabelledLinkWebElement_1.LabelledLinkWebElement);
//# sourceMappingURL=index.js.map