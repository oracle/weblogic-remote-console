"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelledLinkWebElement = void 0;
const LabelledLinkWebElementBase_1 = require("./LabelledLinkWebElementBase");
/**
 * The component WebElement for [oj-c-labelled-link](../../jsdocs/oj-c.LabelledLink.html).
 * Do not instantiate this class directly, instead, use
 * [findLabelledLink](../functions/findLabelledLink.html).
 */
class LabelledLinkWebElement extends LabelledLinkWebElementBase_1.LabelledLinkWebElementBase {
    /**
     * Performs a click on the link
     */
    async click() {
        // find the link element
        const link = await this.findElement({ css: 'a' });
        await link.click();
    }
}
exports.LabelledLinkWebElement = LabelledLinkWebElement;
//# sourceMappingURL=LabelledLinkWebElement.js.map