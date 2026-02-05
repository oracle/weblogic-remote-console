"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolbarWebElement = void 0;
exports.findToolbar = findToolbar;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const ToolbarWebElement_1 = require("./ToolbarWebElement");
Object.defineProperty(exports, "ToolbarWebElement", { enumerable: true, get: function () { return ToolbarWebElement_1.ToolbarWebElement; } });
/**
 * Retrieve an instance of [ToolbarWebElement](../classes/ToolbarWebElement.html).
 * @example
 * ```javascript
 * import { findToolbar } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findToolbar(driver, By.id('my-oj-c-toolbar'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findToolbar(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type ToolbarWebElement
    if (!(webEl instanceof ToolbarWebElement_1.ToolbarWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'ToolbarWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findToolbar(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${ToolbarWebElement_1.ToolbarWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-toolbar', ToolbarWebElement_1.ToolbarWebElement);
//# sourceMappingURL=index.js.map