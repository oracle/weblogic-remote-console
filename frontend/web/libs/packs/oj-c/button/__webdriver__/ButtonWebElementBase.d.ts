import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-button WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, ButtonWebElement.ts.
 */
export declare class ButtonWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>label</code> property.
     * Text to show in the button.
     * @return The value of <code>label</code> property.
     *
     */
    getLabel(): Promise<string>;
    /**
     * Gets the value of <code>tooltip</code> property.
     * Text to show in the tooltip. This overrides the default tooltip that renders the label when in icon mode.
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
     * Gets the value of <code>width</code> property.
     * Specifies that the button style width
     * @return The value of <code>width</code> property.
     *
     */
    getWidth(): Promise<number | string>;
    /**
     * Gets the value of <code>display</code> property.
     * Display just the label, the icons, or all. Label is used as tooltip and should be set in all cases.
     * @return The value of <code>display</code> property.
     *
     */
    getDisplay(): Promise<string>;
    /**
     * Gets the value of <code>size</code> property.
     * Size of button
     * @return The value of <code>size</code> property.
     *
     */
    getSizeProperty(): Promise<string>;
    /**
     * Gets the value of <code>edge</code> property.
     * Specifies whether the button is attached to an edge. For example setting edge='bottom' can be used to attach a button to the bottom of a card. The button is then stretched to 100% width, and borders adjusted.
     * @return The value of <code>edge</code> property.
     *
     */
    getEdge(): Promise<string>;
    /**
     * Gets the value of <code>chroming</code> property.
     * Indicates in what states the button has variants in background and border.
     * @return The value of <code>chroming</code> property.
     *
     */
    getChroming(): Promise<string>;
}
