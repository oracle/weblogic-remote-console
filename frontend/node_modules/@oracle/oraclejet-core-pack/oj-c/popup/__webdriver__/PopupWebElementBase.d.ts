import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-popup WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, PopupWebElement.ts.
 */
export declare class PopupWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>opened</code> property.
     * Specifies whether the Popup is open.
     * @return The value of <code>opened</code> property.
     *
     */
    getOpened(): Promise<boolean>;
    /**
     * Gets the value of <code>launcher</code> property.
     * Specifies Popup's launcher. After Popup closes, it returns focus to the launcher.
     * @return The value of <code>launcher</code> property.
     *
     */
    getLauncher(): Promise<string>;
    /**
     * Gets the value of <code>anchor</code> property.
     * Specifies Popup's anchor. Popup is placed relative to its anchor.
     * @return The value of <code>anchor</code> property.
     *
     */
    getAnchor(): Promise<string | object>;
    /**
     * Gets the value of <code>placement</code> property.
     * Specifies the location the popup will appear relative to another element.
     * @return The value of <code>placement</code> property.
     *
     */
    getPlacement(): Promise<string>;
    /**
     * Gets the value of <code>modality</code> property.
     * Specifies modality of the Popup.
     * @return The value of <code>modality</code> property.
     *
     */
    getModality(): Promise<string>;
    /**
     * Gets the value of <code>autoDismiss</code> property.
     * Specifies the auto dismissal behavior.
     * @return The value of <code>autoDismiss</code> property.
     *
     */
    getAutoDismiss(): Promise<string>;
    /**
     * Gets the value of <code>tail</code> property.
     * Specifies Popup's tail. Simple tail is an arrow pointing to Popup's anchor.
     * @return The value of <code>tail</code> property.
     *
     */
    getTail(): Promise<string>;
    /**
     * Gets the value of <code>variant</code> property.
     * Specifies Popup's style variant.
     * @return The value of <code>variant</code> property.
     *
     */
    getVariant(): Promise<string>;
    /**
     * Gets the value of <code>initialFocus</code> property.
     * Specifies if the Popup sets focus to its content when initially open.
     * @return The value of <code>initialFocus</code> property.
     *
     */
    getInitialFocus(): Promise<string>;
    /**
     * Gets the value of <code>offset</code> property.
     * Specifies displacement of the Popup from the anchor element along the specified axes.
     * @return The value of <code>offset</code> property.
     *
     */
    getOffset(): Promise<Offset>;
    /**
     * Gets the value of <code>collision</code> property.
     * Specifies rule for alternate placement alignment.
     * @return The value of <code>collision</code> property.
     *
     */
    getCollision(): Promise<string>;
    /**
     * Gets the value of <code>width</code> property.
     * Specifies width of the Popup content.
     * @return The value of <code>width</code> property.
     *
     */
    getWidth(): Promise<number | string>;
    /**
     * Gets the value of <code>minWidth</code> property.
     * Specifies minWidth of the Popup content.
     * @return The value of <code>minWidth</code> property.
     *
     */
    getMinWidth(): Promise<number | string>;
    /**
     * Gets the value of <code>maxWidth</code> property.
     * Specifies maxWidth of the Popup content.
     * @return The value of <code>maxWidth</code> property.
     *
     */
    getMaxWidth(): Promise<number | string>;
    /**
     * Gets the value of <code>height</code> property.
     * Specifies height of the Popup content.
     * @return The value of <code>height</code> property.
     *
     */
    getHeight(): Promise<number | string>;
    /**
     * Gets the value of <code>minHeight</code> property.
     * Specifies minHeight of the Popup content.
     * @return The value of <code>minHeight</code> property.
     *
     */
    getMinHeight(): Promise<number | string>;
    /**
     * Gets the value of <code>maxHeight</code> property.
     * Specifies maxHeight of the Popup content.
     * @return The value of <code>maxHeight</code> property.
     *
     */
    getMaxHeight(): Promise<number | string>;
    /**
     * Gets the value of <code>backgroundColor</code> property.
     * Specifies background color of the Popup.
     * @return The value of <code>backgroundColor</code> property.
     *
     */
    getBackgroundColor(): Promise<string>;
}
export interface Offset {
    /**
     *
     */
    x: number;
    /**
     *
     */
    y: number;
}
