"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawerPopupWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-drawer-popup WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, DrawerPopupWebElement.ts.
 */
class DrawerPopupWebElementBase extends elements_1.OjWebElement {
    /**
     * Sets the value of <code>opened</code> property.
     * Specifies whether the Drawer is open.
     * @param opened The value to set for <code>opened</code>
     *
     */
    changeOpened(opened) {
        return this.setProperty('opened', opened);
    }
    /**
     * Gets the value of <code>opened</code> property.
     * Specifies whether the Drawer is open.
     * @return The value of <code>opened</code> property.
     *
     */
    getOpened() {
        return this.getProperty('opened');
    }
    /**
     * Gets the value of <code>modality</code> property.
     * Controls the modality of the drawer.
     * @return The value of <code>modality</code> property.
     *
     */
    getModality() {
        return this.getProperty('modality');
    }
    /**
     * Gets the value of <code>edge</code> property.
     * Specifies at what edge the drawer opens.
     * @return The value of <code>edge</code> property.
     *
     */
    getEdge() {
        return this.getProperty('edge');
    }
    /**
     * Gets the value of <code>autoDismiss</code> property.
     * Specifies the close auto-dismiss behaviour to close the drawer.
     * @return The value of <code>autoDismiss</code> property.
     *
     */
    getAutoDismiss() {
        return this.getProperty('autoDismiss');
    }
    /**
     * Gets the value of <code>closeGesture</code> property.
     * Specifies whether a gesture closes the drawer.
     * @return The value of <code>closeGesture</code> property.
     *
     */
    getCloseGesture() {
        return this.getProperty('closeGesture');
    }
    /**
     * Gets the value of <code>backgroundColor</code> property.
     * Specifies background color of the Drawer.
     * @return The value of <code>backgroundColor</code> property.
     *
     */
    getBackgroundColor() {
        return this.getProperty('backgroundColor');
    }
}
exports.DrawerPopupWebElementBase = DrawerPopupWebElementBase;
//# sourceMappingURL=DrawerPopupWebElementBase.js.map