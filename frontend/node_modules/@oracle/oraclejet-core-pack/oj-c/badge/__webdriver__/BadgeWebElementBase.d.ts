import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-badge WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, BadgeWebElement.ts.
 */
export declare class BadgeWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>variant</code> property.
     * Sets the variant for the badge. Badge can be subtle or solid with different colors. The default value of this property is theme driven.
     * @return The value of <code>variant</code> property.
     *
     */
    getVariant(): Promise<string>;
    /**
     * Gets the value of <code>size</code> property.
     * Specifies the size of the badge. Consists of two options: medium and small. The default value of this property is theme driven.
     * @return The value of <code>size</code> property.
     *
     */
    getSizeProperty(): Promise<string>;
    /**
     * Gets the value of <code>edge</code> property.
     * Specifies the edge of the badge. Badges can be attached to the end edge of another component. They lose their default corner rounding on right side for ltr direction or left side for rtl direction.
     * @return The value of <code>edge</code> property.
     *
     */
    getEdge(): Promise<string>;
    /**
     * Gets the value of <code>label</code> property.
     * "Specifies the text to be displayed in the badge.
     * @return The value of <code>label</code> property.
     *
     */
    getLabel(): Promise<string>;
}
