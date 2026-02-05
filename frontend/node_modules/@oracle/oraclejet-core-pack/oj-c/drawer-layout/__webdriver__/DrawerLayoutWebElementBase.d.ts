import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-drawer-layout WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, DrawerLayoutWebElement.ts.
 */
export declare class DrawerLayoutWebElementBase extends OjWebElement {
    /**
     * Sets the value of <code>startOpened</code> property.
     * Specifies whether the Drawer is open.
     * @param startOpened The value to set for <code>startOpened</code>
     *
     */
    changeStartOpened(startOpened: boolean): Promise<void>;
    /**
     * Gets the value of <code>startOpened</code> property.
     * Specifies whether the Drawer is open.
     * @return The value of <code>startOpened</code> property.
     *
     */
    getStartOpened(): Promise<boolean>;
    /**
     * Sets the value of <code>endOpened</code> property.
     * Specifies whether the Drawer is open.
     * @param endOpened The value to set for <code>endOpened</code>
     *
     */
    changeEndOpened(endOpened: boolean): Promise<void>;
    /**
     * Gets the value of <code>endOpened</code> property.
     * Specifies whether the Drawer is open.
     * @return The value of <code>endOpened</code> property.
     *
     */
    getEndOpened(): Promise<boolean>;
    /**
     * Sets the value of <code>bottomOpened</code> property.
     * Specifies whether the Drawer is open.
     * @param bottomOpened The value to set for <code>bottomOpened</code>
     *
     */
    changeBottomOpened(bottomOpened: boolean): Promise<void>;
    /**
     * Gets the value of <code>bottomOpened</code> property.
     * Specifies whether the Drawer is open.
     * @return The value of <code>bottomOpened</code> property.
     *
     */
    getBottomOpened(): Promise<boolean>;
    /**
     * Gets the value of <code>startDisplay</code> property.
     * Specifies display mode of the Start drawer.
     * @return The value of <code>startDisplay</code> property.
     *
     */
    getStartDisplay(): Promise<string>;
    /**
     * Gets the value of <code>endDisplay</code> property.
     * Specifies display mode of the End drawer.
     * @return The value of <code>endDisplay</code> property.
     *
     */
    getEndDisplay(): Promise<string>;
    /**
     * Gets the value of <code>bottomDisplay</code> property.
     * Specifies display mode of the Start drawer.
     * @return The value of <code>bottomDisplay</code> property.
     *
     */
    getBottomDisplay(): Promise<string>;
}
