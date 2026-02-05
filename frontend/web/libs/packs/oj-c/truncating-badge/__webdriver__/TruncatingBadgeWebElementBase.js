"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TruncatingBadgeWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-truncating-badge WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, TruncatingBadgeWebElement.ts.
 */
class TruncatingBadgeWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>variant</code> property.
     * Sets the variant for the badge. Badge can be subtle or solid with different colors. The default value of this property is theme driven.
     * @return The value of <code>variant</code> property.
     *
     */
    getVariant() {
        return this.getProperty('variant');
    }
    /**
     * Gets the value of <code>size</code> property.
     * Specifies the size of the badge. Consists of two options: medium and small. The default value of this property is theme driven.
     * @return The value of <code>size</code> property.
     *
     */
    getSizeProperty() {
        return this.getProperty('size');
    }
    /**
     * Gets the value of <code>edge</code> property.
     * Specifies the edge of the badge. Badges can be attached to the end edge of another component. They lose their default corner rounding on right side for ltr direction or left side for rtl direction.
     * @return The value of <code>edge</code> property.
     *
     */
    getEdge() {
        return this.getProperty('edge');
    }
    /**
     * Gets the value of <code>label</code> property.
     * "Specifies the text to be displayed in the badge.
     * @return The value of <code>label</code> property.
     *
     */
    getLabel() {
        return this.getProperty('label');
    }
}
exports.TruncatingBadgeWebElementBase = TruncatingBadgeWebElementBase;
//# sourceMappingURL=TruncatingBadgeWebElementBase.js.map