"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawerLayoutWebElement = void 0;
exports.findDrawerLayout = findDrawerLayout;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const DrawerLayoutWebElement_1 = require("./DrawerLayoutWebElement");
Object.defineProperty(exports, "DrawerLayoutWebElement", { enumerable: true, get: function () { return DrawerLayoutWebElement_1.DrawerLayoutWebElement; } });
/**
 * Retrieve an instance of [DrawerLayoutWebElement](../classes/DrawerLayoutWebElement.html).
 * @example
 * ```javascript
 * import { findDrawerLayout } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findDrawerLayout(driver, By.id('my-oj-c-drawer-layout'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findDrawerLayout(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type DrawerLayoutWebElement
    if (!(webEl instanceof DrawerLayoutWebElement_1.DrawerLayoutWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'DrawerLayoutWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findDrawerLayout(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${DrawerLayoutWebElement_1.DrawerLayoutWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-drawer-layout', DrawerLayoutWebElement_1.DrawerLayoutWebElement);
//# sourceMappingURL=index.js.map