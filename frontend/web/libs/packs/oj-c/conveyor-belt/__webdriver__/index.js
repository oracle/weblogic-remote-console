"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConveyorBeltWebElement = void 0;
exports.findConveyorBelt = findConveyorBelt;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const ConveyorBeltWebElement_1 = require("./ConveyorBeltWebElement");
Object.defineProperty(exports, "ConveyorBeltWebElement", { enumerable: true, get: function () { return ConveyorBeltWebElement_1.ConveyorBeltWebElement; } });
/**
 * Retrieve an instance of [ConveyorBeltWebElement](../classes/ConveyorBeltWebElement.html).
 * @example
 * ```javascript
 * import { findConveyorBelt } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findConveyorBelt(driver, By.id('my-oj-c-conveyor-belt'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findConveyorBelt(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type ConveyorBeltWebElement
    if (!(webEl instanceof ConveyorBeltWebElement_1.ConveyorBeltWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'ConveyorBeltWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findConveyorBelt(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${ConveyorBeltWebElement_1.ConveyorBeltWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-conveyor-belt', ConveyorBeltWebElement_1.ConveyorBeltWebElement);
//# sourceMappingURL=index.js.map