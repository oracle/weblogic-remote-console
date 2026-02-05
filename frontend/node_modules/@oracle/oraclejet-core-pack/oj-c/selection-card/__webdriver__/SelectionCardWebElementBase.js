"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectionCardWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-selection-card WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, SelectionCardWebElement.ts.
 */
class SelectionCardWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>selected</code> property.
     * Boolean that marks this card as selected.
     * @return The value of <code>selected</code> property.
     *
     */
    getSelected() {
        return this.getProperty('selected');
    }
}
exports.SelectionCardWebElementBase = SelectionCardWebElementBase;
//# sourceMappingURL=SelectionCardWebElementBase.js.map