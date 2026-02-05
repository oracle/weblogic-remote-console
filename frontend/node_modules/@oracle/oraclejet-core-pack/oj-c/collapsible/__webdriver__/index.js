"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollapsibleWebElement = void 0;
exports.findCollapsible = findCollapsible;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const CollapsibleWebElement_1 = require("./CollapsibleWebElement");
Object.defineProperty(exports, "CollapsibleWebElement", { enumerable: true, get: function () { return CollapsibleWebElement_1.CollapsibleWebElement; } });
/**
 * Retrieve an instance of [CollapsibleWebElement](../classes/CollapsibleWebElement.html).
 * @example
 * ```javascript
 * import { findCollapsible } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findCollapsible(driver, By.id('my-oj-c-collapsible'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findCollapsible(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type CollapsibleWebElement
    if (!(webEl instanceof CollapsibleWebElement_1.CollapsibleWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'CollapsibleWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findCollapsible(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${CollapsibleWebElement_1.CollapsibleWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-collapsible', CollapsibleWebElement_1.CollapsibleWebElement);
//# sourceMappingURL=index.js.map