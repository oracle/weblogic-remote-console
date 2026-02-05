"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-dialog WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, DialogWebElement.ts.
 */
class DialogWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>cancelBehavior</code> property.
     * Specifies the cancel behavior of the Dialog. Note that the cancelBehavior applies to both automatic and user-defined headers.
     * @return The value of <code>cancelBehavior</code> property.
     *
     */
    getCancelBehavior() {
        return this.getProperty('cancelBehavior');
    }
    /**
     * Gets the value of <code>dialogTitle</code> property.
     * Specifies title if header slot is not defined (custom header).
     * @return The value of <code>dialogTitle</code> property.
     *
     */
    getDialogTitle() {
        return this.getProperty('dialogTitle');
    }
    /**
     * Gets the value of <code>dragAffordance</code> property.
     * Specifies whether the Dialog is draggable.
     * @return The value of <code>dragAffordance</code> property.
     *
     */
    getDragAffordance() {
        return this.getProperty('dragAffordance');
    }
    /**
     * Gets the value of <code>headerDecoration</code> property.
     * Specifies whether decorative stripe at the top is present.
     * @return The value of <code>headerDecoration</code> property.
     *
     */
    getHeaderDecoration() {
        return this.getProperty('headerDecoration');
    }
    /**
     * Gets the value of <code>launcher</code> property.
     * Specifies Dialog's launcher. After Dialog closes, it returns focus to the launcher.
     * @return The value of <code>launcher</code> property.
     *
     */
    getLauncher() {
        return this.getProperty('launcher');
    }
    /**
     * Gets the value of <code>modality</code> property.
     * Specifies modality of the Dialog.
     * @return The value of <code>modality</code> property.
     *
     */
    getModality() {
        return this.getProperty('modality');
    }
    /**
     * Gets the value of <code>opened</code> property.
     * Specifies whether the Dialog is open.
     * @return The value of <code>opened</code> property.
     *
     */
    getOpened() {
        return this.getProperty('opened');
    }
    /**
     * Gets the value of <code>resizeBehavior</code> property.
     * Specifies whether the Dialog is resizable.
     * @return The value of <code>resizeBehavior</code> property.
     *
     */
    getResizeBehavior() {
        return this.getProperty('resizeBehavior');
    }
    /**
     * Gets the value of <code>anchor</code> property.
     * Specifies Dialog's anchor. Dialog is placed relative to its anchor. If not specified, it is placed relative to window.
     * @return The value of <code>anchor</code> property.
     *
     */
    getAnchor() {
        return this.getProperty('anchor');
    }
    /**
     * Gets the value of <code>placement</code> property.
     * Specifies the location the dialog will appear relative to another element. If not specified, the default dialog position is "center" on desktop and "bottom-start" on phone.
     * @return The value of <code>placement</code> property.
     *
     */
    getPlacement() {
        return this.getProperty('placement');
    }
    /**
     * Gets the value of <code>offset</code> property.
     * Specifies displacement of the Dialog from the anchor element placement along the specified axes. The offset object consists of mainAxis and crossAxis properties. The direction in which these propertie are applied depends on the current value of the position property. If a number is used, it represents the main axis. The &lt;code>mainAxis&lt;/code> property represents the distance between the Popup and the anchor. The &lt;code>crossAxis&lt;/code> property represents the deviation in the opposite axis to the main axis - the skidding between the Popup and the anchor.
     * @return The value of <code>offset</code> property.
     *
     */
    getOffset() {
        return this.getProperty('offset');
    }
    /**
     * Gets the value of <code>width</code> property.
     * Specifies width of the Dialog.
     * @return The value of <code>width</code> property.
     *
     */
    getWidth() {
        return this.getProperty('width');
    }
    /**
     * Gets the value of <code>minWidth</code> property.
     * Specifies minWidth of the Dialog.
     * @return The value of <code>minWidth</code> property.
     *
     */
    getMinWidth() {
        return this.getProperty('minWidth');
    }
    /**
     * Gets the value of <code>maxWidth</code> property.
     * Specifies maxWidth of the Dialog.
     * @return The value of <code>maxWidth</code> property.
     *
     */
    getMaxWidth() {
        return this.getProperty('maxWidth');
    }
    /**
     * Gets the value of <code>height</code> property.
     * Specifies height of the Dialog.
     * @return The value of <code>height</code> property.
     *
     */
    getHeight() {
        return this.getProperty('height');
    }
    /**
     * Gets the value of <code>minHeight</code> property.
     * Specifies minHeight of the Dialog.
     * @return The value of <code>minHeight</code> property.
     *
     */
    getMinHeight() {
        return this.getProperty('minHeight');
    }
    /**
     * Gets the value of <code>maxHeight</code> property.
     * Specifies maxHeight of the Dialog.
     * @return The value of <code>maxHeight</code> property.
     *
     */
    getMaxHeight() {
        return this.getProperty('maxHeight');
    }
}
exports.DialogWebElementBase = DialogWebElementBase;
//# sourceMappingURL=DialogWebElementBase.js.map