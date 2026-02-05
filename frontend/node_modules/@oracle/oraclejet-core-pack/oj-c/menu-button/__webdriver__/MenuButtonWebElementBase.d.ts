import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-menu-button WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, MenuButtonWebElement.ts.
 */
export declare class MenuButtonWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>label</code> property.
     * Text to show in the button.
     * @return The value of <code>label</code> property.
     *
     */
    getLabel(): Promise<string>;
    /**
     * Gets the value of <code>suffix</code> property.
     * Suffix appended to menu label to indicate last selection.
     * @return The value of <code>suffix</code> property.
     *
     */
    getSuffix(): Promise<string>;
    /**
     * Gets the value of <code>tooltip</code> property.
     * Text to show in the tooltip. This overrides the default tooltip that renders the label when in icon mode.
     * @return The value of <code>tooltip</code> property.
     *
     */
    getTooltip(): Promise<string>;
    /**
     * Gets the value of <code>items</code> property.
     * Items describe the menu items rendered by the menu button.
     * @return The value of <code>items</code> property.
     *
     */
    getItems(): Promise<Array<object>>;
    /**
     * Sets the value of <code>selection</code> property.
     * An array containing key/value objects for menu selection groups.
     * @param selection The value to set for <code>selection</code>
     *
     */
    changeSelection(selection: object): Promise<void>;
    /**
     * Gets the value of <code>selection</code> property.
     * An array containing key/value objects for menu selection groups.
     * @return The value of <code>selection</code> property.
     *
     */
    getSelection(): Promise<object>;
    /**
     * Gets the value of <code>display</code> property.
     * Display just the label, the icons, or all. Label is used as tooltip and should be set in all cases.
     * @return The value of <code>display</code> property.
     *
     */
    getDisplay(): Promise<string>;
    /**
     * Gets the value of <code>disabled</code> property.
     * Specifies that the button element should be disabled.
     * @return The value of <code>disabled</code> property.
     *
     */
    getDisabled(): Promise<boolean>;
    /**
     * Gets the value of <code>size</code> property.
     * Size of button
     * @return The value of <code>size</code> property.
     *
     */
    getSizeProperty(): Promise<string>;
    /**
     * Gets the value of <code>width</code> property.
     * Specifies that the button style width
     * @return The value of <code>width</code> property.
     *
     */
    getWidth(): Promise<number | string>;
    /**
     * Gets the value of <code>chroming</code> property.
     * Indicates in what states the button has chromings in background and border.
     * @return The value of <code>chroming</code> property.
     *
     */
    getChroming(): Promise<string>;
}
