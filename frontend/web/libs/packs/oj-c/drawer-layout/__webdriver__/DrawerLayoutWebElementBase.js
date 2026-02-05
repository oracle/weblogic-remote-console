"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawerLayoutWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-drawer-layout WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, DrawerLayoutWebElement.ts.
 */
class DrawerLayoutWebElementBase extends elements_1.OjWebElement {
    /**
     * Sets the value of <code>startOpened</code> property.
     * Specifies whether the Drawer is open.
     * @param startOpened The value to set for <code>startOpened</code>
     *
     */
    changeStartOpened(startOpened) {
        return this.setProperty('startOpened', startOpened);
    }
    /**
     * Gets the value of <code>startOpened</code> property.
     * Specifies whether the Drawer is open.
     * @return The value of <code>startOpened</code> property.
     *
     */
    getStartOpened() {
        return this.getProperty('startOpened');
    }
    /**
     * Sets the value of <code>endOpened</code> property.
     * Specifies whether the Drawer is open.
     * @param endOpened The value to set for <code>endOpened</code>
     *
     */
    changeEndOpened(endOpened) {
        return this.setProperty('endOpened', endOpened);
    }
    /**
     * Gets the value of <code>endOpened</code> property.
     * Specifies whether the Drawer is open.
     * @return The value of <code>endOpened</code> property.
     *
     */
    getEndOpened() {
        return this.getProperty('endOpened');
    }
    /**
     * Sets the value of <code>bottomOpened</code> property.
     * Specifies whether the Drawer is open.
     * @param bottomOpened The value to set for <code>bottomOpened</code>
     *
     */
    changeBottomOpened(bottomOpened) {
        return this.setProperty('bottomOpened', bottomOpened);
    }
    /**
     * Gets the value of <code>bottomOpened</code> property.
     * Specifies whether the Drawer is open.
     * @return The value of <code>bottomOpened</code> property.
     *
     */
    getBottomOpened() {
        return this.getProperty('bottomOpened');
    }
    /**
     * Gets the value of <code>startDisplay</code> property.
     * Specifies display mode of the Start drawer.
     * @return The value of <code>startDisplay</code> property.
     *
     */
    getStartDisplay() {
        return this.getProperty('startDisplay');
    }
    /**
     * Gets the value of <code>endDisplay</code> property.
     * Specifies display mode of the End drawer.
     * @return The value of <code>endDisplay</code> property.
     *
     */
    getEndDisplay() {
        return this.getProperty('endDisplay');
    }
    /**
     * Gets the value of <code>bottomDisplay</code> property.
     * Specifies display mode of the Start drawer.
     * @return The value of <code>bottomDisplay</code> property.
     *
     */
    getBottomDisplay() {
        return this.getProperty('bottomDisplay');
    }
}
exports.DrawerLayoutWebElementBase = DrawerLayoutWebElementBase;
//# sourceMappingURL=DrawerLayoutWebElementBase.js.map