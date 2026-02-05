"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkeletonWebElement = void 0;
exports.findSkeleton = findSkeleton;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const SkeletonWebElement_1 = require("./SkeletonWebElement");
Object.defineProperty(exports, "SkeletonWebElement", { enumerable: true, get: function () { return SkeletonWebElement_1.SkeletonWebElement; } });
/**
 * Retrieve an instance of [SkeletonWebElement](../classes/SkeletonWebElement.html).
 * @example
 * ```javascript
 * import { findSkeleton } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findSkeleton(driver, By.id('my-oj-c-skeleton'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findSkeleton(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type SkeletonWebElement
    if (!(webEl instanceof SkeletonWebElement_1.SkeletonWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'SkeletonWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findSkeleton(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${SkeletonWebElement_1.SkeletonWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-skeleton', SkeletonWebElement_1.SkeletonWebElement);
//# sourceMappingURL=index.js.map