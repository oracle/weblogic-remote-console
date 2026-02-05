"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConveyorBeltWebElement = void 0;
const ConveyorBeltWebElementBase_1 = require("./ConveyorBeltWebElementBase");
/**
 * The component WebElement for [oj-c-conveyor-belt](../../jsdocs/oj-c.ConveyorBelt.html).
 * Do not instantiate this class directly, instead, use
 * [findConveyorBelt](../functions/findConveyorBelt.html).
 */
class ConveyorBeltWebElement extends ConveyorBeltWebElementBase_1.ConveyorBeltWebElementBase {
    // Put overrides here
    /**
     * Scroll the conveyor belt, so that the conveyor belt's element (button, tab bar) of interest is in the view
     *
     * @param {Locator} locator The lookup to pass into findElement
     */
    async scrollElementIntoView(locator) {
        await this.whenReady();
        let el = await this.findElement(locator);
        return await this.getDriver().executeScript((cb, el) => cb.scrollElementIntoView(el), this, el);
    }
}
exports.ConveyorBeltWebElement = ConveyorBeltWebElement;
//# sourceMappingURL=ConveyorBeltWebElement.js.map