import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-split-menu-button WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, SplitMenuButtonWebElement.ts.
 */
export declare class SplitMenuButtonWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>label</code> property.
     * Text to show in the button.
     * @return The value of <code>label</code> property.
     *
     */
    getLabel(): Promise<string>;
    /**
     * Gets the value of <code>items</code> property.
     * Items describe the menu items rendered by the menu button.
     * @return The value of <code>items</code> property.
     *
     */
    getItems(): Promise<Array<Items>>;
    /**
     * Gets the value of <code>tooltip</code> property.
     * Text to show in the tooltip.
     * @return The value of <code>tooltip</code> property.
     *
     */
    getTooltip(): Promise<string>;
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
export interface Items {
    /**
     * Specifies the type of the menu item.
     */
    type: string;
    /**
     * Specifies the text to show for the menu item.
     */
    label: string;
    /**
     * Specifes a key value associated with the menu item.
     */
    key: string;
    /**
     * Specifies whether the menu item should be disabled.
     */
    disabled: boolean;
    /**
     * Specifies an icon to show at the start position of the menu item.
     */
    startIcon: ItemsStartIcon;
    /**
     * Specifies an icon to show at the end position of the menu item.
     */
    endIcon: ItemsEndIcon;
    /**
     * Specifies styling for the menu item based upon its associated action.
     */
    variant: string;
}
export interface ItemsStartIcon {
    /**
     *
     */
    type: string;
    /**
     *
     */
    class: string;
    /**
     *
     */
    src: string;
}
export interface ItemsEndIcon {
    /**
     *
     */
    type: string;
    /**
     *
     */
    class: string;
    /**
     *
     */
    src: string;
}
