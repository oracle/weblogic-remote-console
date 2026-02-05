import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-dialog WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, DialogWebElement.ts.
 */
export declare class DialogWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>cancelBehavior</code> property.
     * Specifies the cancel behavior of the Dialog. Note that the cancelBehavior applies to both automatic and user-defined headers.
     * @return The value of <code>cancelBehavior</code> property.
     *
     */
    getCancelBehavior(): Promise<string>;
    /**
     * Gets the value of <code>dialogTitle</code> property.
     * Specifies title if header slot is not defined (custom header).
     * @return The value of <code>dialogTitle</code> property.
     *
     */
    getDialogTitle(): Promise<string>;
    /**
     * Gets the value of <code>dragAffordance</code> property.
     * Specifies whether the Dialog is draggable.
     * @return The value of <code>dragAffordance</code> property.
     *
     */
    getDragAffordance(): Promise<string>;
    /**
     * Gets the value of <code>headerDecoration</code> property.
     * Specifies whether decorative stripe at the top is present.
     * @return The value of <code>headerDecoration</code> property.
     *
     */
    getHeaderDecoration(): Promise<string>;
    /**
     * Gets the value of <code>launcher</code> property.
     * Specifies Dialog's launcher. After Dialog closes, it returns focus to the launcher.
     * @return The value of <code>launcher</code> property.
     *
     */
    getLauncher(): Promise<string>;
    /**
     * Gets the value of <code>modality</code> property.
     * Specifies modality of the Dialog.
     * @return The value of <code>modality</code> property.
     *
     */
    getModality(): Promise<string>;
    /**
     * Gets the value of <code>opened</code> property.
     * Specifies whether the Dialog is open.
     * @return The value of <code>opened</code> property.
     *
     */
    getOpened(): Promise<boolean>;
    /**
     * Gets the value of <code>resizeBehavior</code> property.
     * Specifies whether the Dialog is resizable.
     * @return The value of <code>resizeBehavior</code> property.
     *
     */
    getResizeBehavior(): Promise<string>;
    /**
     * Gets the value of <code>anchor</code> property.
     * Specifies Dialog's anchor. Dialog is placed relative to its anchor. If not specified, it is placed relative to window.
     * @return The value of <code>anchor</code> property.
     *
     */
    getAnchor(): Promise<string | object>;
    /**
     * Gets the value of <code>placement</code> property.
     * Specifies the location the dialog will appear relative to another element. If not specified, the default dialog position is "center" on desktop and "bottom-start" on phone.
     * @return The value of <code>placement</code> property.
     *
     */
    getPlacement(): Promise<string>;
    /**
     * Gets the value of <code>offset</code> property.
     * Specifies displacement of the Dialog from the anchor element placement along the specified axes. The offset object consists of mainAxis and crossAxis properties. The direction in which these propertie are applied depends on the current value of the position property. If a number is used, it represents the main axis. The &lt;code>mainAxis&lt;/code> property represents the distance between the Popup and the anchor. The &lt;code>crossAxis&lt;/code> property represents the deviation in the opposite axis to the main axis - the skidding between the Popup and the anchor.
     * @return The value of <code>offset</code> property.
     *
     */
    getOffset(): Promise<number | object>;
    /**
     * Gets the value of <code>width</code> property.
     * Specifies width of the Dialog.
     * @return The value of <code>width</code> property.
     *
     */
    getWidth(): Promise<number | string>;
    /**
     * Gets the value of <code>minWidth</code> property.
     * Specifies minWidth of the Dialog.
     * @return The value of <code>minWidth</code> property.
     *
     */
    getMinWidth(): Promise<number | string>;
    /**
     * Gets the value of <code>maxWidth</code> property.
     * Specifies maxWidth of the Dialog.
     * @return The value of <code>maxWidth</code> property.
     *
     */
    getMaxWidth(): Promise<number | string>;
    /**
     * Gets the value of <code>height</code> property.
     * Specifies height of the Dialog.
     * @return The value of <code>height</code> property.
     *
     */
    getHeight(): Promise<number | string>;
    /**
     * Gets the value of <code>minHeight</code> property.
     * Specifies minHeight of the Dialog.
     * @return The value of <code>minHeight</code> property.
     *
     */
    getMinHeight(): Promise<number | string>;
    /**
     * Gets the value of <code>maxHeight</code> property.
     * Specifies maxHeight of the Dialog.
     * @return The value of <code>maxHeight</code> property.
     *
     */
    getMaxHeight(): Promise<number | string>;
}
