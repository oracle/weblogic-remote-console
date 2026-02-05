"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagCloudWebElement = void 0;
exports.findTagCloud = findTagCloud;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const TagCloudWebElement_1 = require("./TagCloudWebElement");
Object.defineProperty(exports, "TagCloudWebElement", { enumerable: true, get: function () { return TagCloudWebElement_1.TagCloudWebElement; } });
/**
 * Retrieve an instance of [TagCloudWebElement](../classes/TagCloudWebElement.html).
 * @example
 * ```javascript
 * import { findTagCloud } from '@oracle/oraclejet-core-pack/webdriver';
 * const el = await findTagCloud(driver, By.id('my-oj-c-tag-cloud'));
 * ```
 * @param driver A WebDriver/WebElement instance from where the element will be
 * searched. If WebDriver is passed, the element will be searched globally in the
 * document. If WebElement is passed, the search will be relative to this element.
 * @param by The locator with which to find the element
 */
async function findTagCloud(driver, by) {
    const webEl = await driver.findElement(by);
    // Check that the element is of type TagCloudWebElement
    if (!(webEl instanceof TagCloudWebElement_1.TagCloudWebElement)) {
        const tagName = await webEl.getTagName();
        let supplemental = '';
        if (webEl.constructor.name === 'TagCloudWebElement') {
            supplemental = 'You likely have multiple installations of this package.';
        }
        throw Error(`findTagCloud(${by}) created ${webEl.constructor.name} for <${tagName}>, but expected ${TagCloudWebElement_1.TagCloudWebElement.name}. ${supplemental}`);
    }
    return webEl;
}
(0, oraclejet_webdriver_1.register)('oj-c-tag-cloud', TagCloudWebElement_1.TagCloudWebElement);
//# sourceMappingURL=index.js.map