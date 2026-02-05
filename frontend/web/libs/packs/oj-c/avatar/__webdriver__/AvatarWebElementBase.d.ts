import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-avatar WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, AvatarWebElement.ts.
 */
export declare class AvatarWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>background</code> property.
     * Specifies the background of the avatar.
     * @return The value of <code>background</code> property.
     *
     */
    getBackground(): Promise<string>;
    /**
     * Gets the value of <code>initials</code> property.
     * Specifies the initials of the avatar.
     * @return The value of <code>initials</code> property.
     *
     */
    getInitials(): Promise<string | null>;
    /**
     * Gets the value of <code>size</code> property.
     * Specifies the size of the avatar.
     * @return The value of <code>size</code> property.
     *
     */
    getSizeProperty(): Promise<string>;
    /**
     * Gets the value of <code>src</code> property.
     * Specifies the source for the image of the avatar.
     * @return The value of <code>src</code> property.
     *
     */
    getSrc(): Promise<string | null>;
    /**
     * Gets the value of <code>iconClass</code> property.
     * The icon class to be displayed.
     * @return The value of <code>iconClass</code> property.
     *
     */
    getIconClass(): Promise<string>;
    /**
     * Gets the value of <code>shape</code> property.
     * Specifies the shape of the avatar.
     * @return The value of <code>shape</code> property.
     *
     */
    getShape(): Promise<string>;
}
