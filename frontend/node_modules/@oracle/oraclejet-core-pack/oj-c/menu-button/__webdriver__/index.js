"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuButtonWebElement = void 0;
exports.findMenuButton = findMenuButton;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const MenuButtonWebElement_1 = require("./MenuButtonWebElement");
Object.defineProperty(exports, "MenuButtonWebElement", { enumerable: true, get: function () { return MenuButtonWebElement_1.MenuButtonWebElement; } });
/**
 * Retrieve an instance of [MenuButtonWebElement](../classes/MenuButtonWebElement.html).
 * @example
 * ```javascript
 * import { findMenuButton } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findMenuButton(driver, By.id('my-oj-c-menu-button'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findMenuButton(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type MenuButtonWebElement
    if (!(webEl instanceof MenuButtonWebElement_1.MenuButtonWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'MenuButtonWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findMenuButton(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${MenuButtonWebElement_1.MenuButtonWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-menu-button', MenuButtonWebElement_1.MenuButtonWebElement);
//# sourceMappingURL=index.js.map