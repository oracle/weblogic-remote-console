"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-button WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, ButtonWebElement.ts.
 */
class ButtonWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>label</code> property.
     * Text to show in the button.
     * @return The value of <code>label</code> property.
     *
     */
    getLabel() {
        return this.getProperty('label');
    }
    /**
     * Gets the value of <code>tooltip</code> property.
     * Text to show in the tooltip. This overrides the default tooltip that renders the label when in icon mode.
     * @return The value of <code>tooltip</code> property.
     *
     */
    getTooltip() {
        return this.getProperty('tooltip');
    }
    /**
     * Gets the value of <code>disabled</code> property.
     * Specifies that the button element should be disabled.
     * @return The value of <code>disabled</code> property.
     *
     */
    getDisabled() {
        return this.getProperty('disabled');
    }
    /**
     * Gets the value of <code>width</code> property.
     * Specifies that the button style width
     * @return The value of <code>width</code> property.
     *
     */
    getWidth() {
        return this.getProperty('width');
    }
    /**
     * Gets the value of <code>display</code> property.
     * Display just the label, the icons, or all. Label is used as tooltip and should be set in all cases.
     * @return The value of <code>display</code> property.
     *
     */
    getDisplay() {
        return this.getProperty('display');
    }
    /**
     * Gets the value of <code>size</code> property.
     * Size of button
     * @return The value of <code>size</code> property.
     *
     */
    getSizeProperty() {
        return this.getProperty('size');
    }
    /**
     * Gets the value of <code>edge</code> property.
     * Specifies whether the button is attached to an edge. For example setting edge='bottom' can be used to attach a button to the bottom of a card. The button is then stretched to 100% width, and borders adjusted.
     * @return The value of <code>edge</code> property.
     *
     */
    getEdge() {
        return this.getProperty('edge');
    }
    /**
     * Gets the value of <code>chroming</code> property.
     * Indicates in what states the button has variants in background and border.
     * @return The value of <code>chroming</code> property.
     *
     */
    getChroming() {
        return this.getProperty('chroming');
    }
}
exports.ButtonWebElementBase = ButtonWebElementBase;
//# sourceMappingURL=ButtonWebElementBase.js.map