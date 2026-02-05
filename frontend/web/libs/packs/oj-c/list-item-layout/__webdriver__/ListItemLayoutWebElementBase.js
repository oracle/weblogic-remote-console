"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListItemLayoutWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-list-item-layout WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, ListItemLayoutWebElement.ts.
 */
class ListItemLayoutWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>inset</code> property.
     * Controls padding around outside of list item layouts.
     * @return The value of <code>inset</code> property.
     *
     */
    getInset() {
        return this.getProperty('inset');
    }
    /**
     * Gets the value of <code>verticalAlignment</code> property.
     * Default is 'middle' which vertically aligns layout content to center of the row.
     * @return The value of <code>verticalAlignment</code> property.
     *
     */
    getVerticalAlignment() {
        return this.getProperty('verticalAlignment');
    }
}
exports.ListItemLayoutWebElementBase = ListItemLayoutWebElementBase;
//# sourceMappingURL=ListItemLayoutWebElementBase.js.map