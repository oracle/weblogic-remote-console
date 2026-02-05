"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollapsibleWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-collapsible WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, CollapsibleWebElement.ts.
 */
class CollapsibleWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>disabled</code> property.
     * Disables the collapsible if set to true.
     * @return The value of <code>disabled</code> property.
     *
     */
    getDisabled() {
        return this.getProperty('disabled');
    }
    /**
     * Gets the value of <code>expanded</code> property.
     * Specifies if the content is expanded.
     * @return The value of <code>expanded</code> property.
     *
     */
    getExpanded() {
        return this.getProperty('expanded');
    }
    /**
     * Gets the value of <code>iconPosition</code> property.
     * Controls placement of the icon in the header.
     * @return The value of <code>iconPosition</code> property.
     *
     */
    getIconPosition() {
        return this.getProperty('iconPosition');
    }
    /**
     * Gets the value of <code>variant</code> property.
     * Controls display of the optional divider below the header.
     * @return The value of <code>variant</code> property.
     *
     */
    getVariant() {
        return this.getProperty('variant');
    }
}
exports.CollapsibleWebElementBase = CollapsibleWebElementBase;
//# sourceMappingURL=CollapsibleWebElementBase.js.map