"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkeletonWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-skeleton WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, SkeletonWebElement.ts.
 */
class SkeletonWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>height</code> property.
     * Specifies the height of the skeleton
     * @return The value of <code>height</code> property.
     *
     */
    getHeight() {
        return this.getProperty('height');
    }
    /**
     * Gets the value of <code>width</code> property.
     * Specifies the width of the skeleton
     * @return The value of <code>width</code> property.
     *
     */
    getWidth() {
        return this.getProperty('width');
    }
    /**
     * Gets the value of <code>borderRadius</code> property.
     * Specifies the border radius of the skeleton
     * @return The value of <code>borderRadius</code> property.
     *
     */
    getBorderRadius() {
        return this.getProperty('borderRadius');
    }
}
exports.SkeletonWebElementBase = SkeletonWebElementBase;
//# sourceMappingURL=SkeletonWebElementBase.js.map