import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-collapsible WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, CollapsibleWebElement.ts.
 */
export declare class CollapsibleWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>disabled</code> property.
     * Disables the collapsible if set to true.
     * @return The value of <code>disabled</code> property.
     *
     */
    getDisabled(): Promise<boolean>;
    /**
     * Gets the value of <code>expanded</code> property.
     * Specifies if the content is expanded.
     * @return The value of <code>expanded</code> property.
     *
     */
    getExpanded(): Promise<boolean>;
    /**
     * Gets the value of <code>iconPosition</code> property.
     * Controls placement of the icon in the header.
     * @return The value of <code>iconPosition</code> property.
     *
     */
    getIconPosition(): Promise<string>;
    /**
     * Gets the value of <code>variant</code> property.
     * Controls display of the optional divider below the header.
     * @return The value of <code>variant</code> property.
     *
     */
    getVariant(): Promise<string>;
}
