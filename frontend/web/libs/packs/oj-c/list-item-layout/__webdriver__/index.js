"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListItemLayoutWebElement = void 0;
exports.findListItemLayout = findListItemLayout;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const ListItemLayoutWebElement_1 = require("./ListItemLayoutWebElement");
Object.defineProperty(exports, "ListItemLayoutWebElement", { enumerable: true, get: function () { return ListItemLayoutWebElement_1.ListItemLayoutWebElement; } });
/**
 * Retrieve an instance of [ListItemLayoutWebElement](../classes/ListItemLayoutWebElement.html).
 * @example
 * ```javascript
 * import { findListItemLayout } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findListItemLayout(driver, By.id('my-oj-c-list-item-layout'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findListItemLayout(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type ListItemLayoutWebElement
    if (!(webEl instanceof ListItemLayoutWebElement_1.ListItemLayoutWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'ListItemLayoutWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findListItemLayout(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${ListItemLayoutWebElement_1.ListItemLayoutWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-list-item-layout', ListItemLayoutWebElement_1.ListItemLayoutWebElement);
//# sourceMappingURL=index.js.map