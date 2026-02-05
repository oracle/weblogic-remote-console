"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableWebElement = void 0;
exports.findTable = findTable;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const TableWebElement_1 = require("./TableWebElement");
Object.defineProperty(exports, "TableWebElement", { enumerable: true, get: function () { return TableWebElement_1.TableWebElement; } });
/**
 * Retrieve an instance of [TableWebElement](../classes/TableWebElement.html).
 * @example
 * ```javascript
 * import { findTable } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findTable(driver, By.id('my-oj-c-table'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findTable(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type TableWebElement
    if (!(webEl instanceof TableWebElement_1.TableWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'TableWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findTable(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${TableWebElement_1.TableWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-table', TableWebElement_1.TableWebElement);
//# sourceMappingURL=index.js.map