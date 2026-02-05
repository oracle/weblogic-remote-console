"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawerPopupWebElement = void 0;
exports.findDrawerPopup = findDrawerPopup;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const DrawerPopupWebElement_1 = require("./DrawerPopupWebElement");
Object.defineProperty(exports, "DrawerPopupWebElement", { enumerable: true, get: function () { return DrawerPopupWebElement_1.DrawerPopupWebElement; } });
/**
 * Retrieve an instance of [DrawerPopupWebElement](../classes/DrawerPopupWebElement.html).
 * @example
 * ```javascript
 * import { findDrawerPopup } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findDrawerPopup(driver, By.id('my-oj-c-drawer-popup'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findDrawerPopup(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type DrawerPopupWebElement
    if (!(webEl instanceof DrawerPopupWebElement_1.DrawerPopupWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'DrawerPopupWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findDrawerPopup(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${DrawerPopupWebElement_1.DrawerPopupWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-drawer-popup', DrawerPopupWebElement_1.DrawerPopupWebElement);
//# sourceMappingURL=index.js.map