"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopupWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-popup WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, PopupWebElement.ts.
 */
class PopupWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>opened</code> property.
     * Specifies whether the Popup is open.
     * @return The value of <code>opened</code> property.
     *
     */
    getOpened() {
        return this.getProperty('opened');
    }
    /**
     * Gets the value of <code>launcher</code> property.
     * Specifies Popup's launcher. After Popup closes, it returns focus to the launcher.
     * @return The value of <code>launcher</code> property.
     *
     */
    getLauncher() {
        return this.getProperty('launcher');
    }
    /**
     * Gets the value of <code>anchor</code> property.
     * Specifies Popup's anchor. Popup is placed relative to its anchor.
     * @return The value of <code>anchor</code> property.
     *
     */
    getAnchor() {
        return this.getProperty('anchor');
    }
    /**
     * Gets the value of <code>placement</code> property.
     * Specifies the location the popup will appear relative to another element.
     * @return The value of <code>placement</code> property.
     *
     */
    getPlacement() {
        return this.getProperty('placement');
    }
    /**
     * Gets the value of <code>modality</code> property.
     * Specifies modality of the Popup.
     * @return The value of <code>modality</code> property.
     *
     */
    getModality() {
        return this.getProperty('modality');
    }
    /**
     * Gets the value of <code>autoDismiss</code> property.
     * Specifies the auto dismissal behavior.
     * @return The value of <code>autoDismiss</code> property.
     *
     */
    getAutoDismiss() {
        return this.getProperty('autoDismiss');
    }
    /**
     * Gets the value of <code>tail</code> property.
     * Specifies Popup's tail. Simple tail is an arrow pointing to Popup's anchor.
     * @return The value of <code>tail</code> property.
     *
     */
    getTail() {
        return this.getProperty('tail');
    }
    /**
     * Gets the value of <code>variant</code> property.
     * Specifies Popup's style variant.
     * @return The value of <code>variant</code> property.
     *
     */
    getVariant() {
        return this.getProperty('variant');
    }
    /**
     * Gets the value of <code>initialFocus</code> property.
     * Specifies if the Popup sets focus to its content when initially open.
     * @return The value of <code>initialFocus</code> property.
     *
     */
    getInitialFocus() {
        return this.getProperty('initialFocus');
    }
    /**
     * Gets the value of <code>offset</code> property.
     * Specifies displacement of the Popup from the anchor element along the specified axes.
     * @return The value of <code>offset</code> property.
     *
     */
    getOffset() {
        return this.getProperty('offset');
    }
    /**
     * Gets the value of <code>collision</code> property.
     * Specifies rule for alternate placement alignment.
     * @return The value of <code>collision</code> property.
     *
     */
    getCollision() {
        return this.getProperty('collision');
    }
    /**
     * Gets the value of <code>width</code> property.
     * Specifies width of the Popup content.
     * @return The value of <code>width</code> property.
     *
     */
    getWidth() {
        return this.getProperty('width');
    }
    /**
     * Gets the value of <code>minWidth</code> property.
     * Specifies minWidth of the Popup content.
     * @return The value of <code>minWidth</code> property.
     *
     */
    getMinWidth() {
        return this.getProperty('minWidth');
    }
    /**
     * Gets the value of <code>maxWidth</code> property.
     * Specifies maxWidth of the Popup content.
     * @return The value of <code>maxWidth</code> property.
     *
     */
    getMaxWidth() {
        return this.getProperty('maxWidth');
    }
    /**
     * Gets the value of <code>height</code> property.
     * Specifies height of the Popup content.
     * @return The value of <code>height</code> property.
     *
     */
    getHeight() {
        return this.getProperty('height');
    }
    /**
     * Gets the value of <code>minHeight</code> property.
     * Specifies minHeight of the Popup content.
     * @return The value of <code>minHeight</code> property.
     *
     */
    getMinHeight() {
        return this.getProperty('minHeight');
    }
    /**
     * Gets the value of <code>maxHeight</code> property.
     * Specifies maxHeight of the Popup content.
     * @return The value of <code>maxHeight</code> property.
     *
     */
    getMaxHeight() {
        return this.getProperty('maxHeight');
    }
    /**
     * Gets the value of <code>backgroundColor</code> property.
     * Specifies background color of the Popup.
     * @return The value of <code>backgroundColor</code> property.
     *
     */
    getBackgroundColor() {
        return this.getProperty('backgroundColor');
    }
}
exports.PopupWebElementBase = PopupWebElementBase;
//# sourceMappingURL=PopupWebElementBase.js.map