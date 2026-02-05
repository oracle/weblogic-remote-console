"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-avatar WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, AvatarWebElement.ts.
 */
class AvatarWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>background</code> property.
     * Specifies the background of the avatar.
     * @return The value of <code>background</code> property.
     *
     */
    getBackground() {
        return this.getProperty('background');
    }
    /**
     * Gets the value of <code>initials</code> property.
     * Specifies the initials of the avatar.
     * @return The value of <code>initials</code> property.
     *
     */
    getInitials() {
        return this.getProperty('initials');
    }
    /**
     * Gets the value of <code>size</code> property.
     * Specifies the size of the avatar.
     * @return The value of <code>size</code> property.
     *
     */
    getSizeProperty() {
        return this.getProperty('size');
    }
    /**
     * Gets the value of <code>src</code> property.
     * Specifies the source for the image of the avatar.
     * @return The value of <code>src</code> property.
     *
     */
    getSrc() {
        return this.getProperty('src');
    }
    /**
     * Gets the value of <code>iconClass</code> property.
     * The icon class to be displayed.
     * @return The value of <code>iconClass</code> property.
     *
     */
    getIconClass() {
        return this.getProperty('iconClass');
    }
    /**
     * Gets the value of <code>shape</code> property.
     * Specifies the shape of the avatar.
     * @return The value of <code>shape</code> property.
     *
     */
    getShape() {
        return this.getProperty('shape');
    }
}
exports.AvatarWebElementBase = AvatarWebElementBase;
//# sourceMappingURL=AvatarWebElementBase.js.map