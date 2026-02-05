"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitMenuButtonWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-split-menu-button WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, SplitMenuButtonWebElement.ts.
 */
class SplitMenuButtonWebElementBase extends elements_1.OjWebElement {
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
     * Gets the value of <code>items</code> property.
     * Items describe the menu items rendered by the menu button.
     * @return The value of <code>items</code> property.
     *
     */
    getItems() {
        return this.getProperty('items');
    }
    /**
     * Gets the value of <code>tooltip</code> property.
     * Text to show in the tooltip.
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
     * Gets the value of <code>size</code> property.
     * Size of button
     * @return The value of <code>size</code> property.
     *
     */
    getSizeProperty() {
        return this.getProperty('size');
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
     * Gets the value of <code>chroming</code> property.
     * Indicates in what states the button has chromings in background and border.
     * @return The value of <code>chroming</code> property.
     *
     */
    getChroming() {
        return this.getProperty('chroming');
    }
}
exports.SplitMenuButtonWebElementBase = SplitMenuButtonWebElementBase;
//# sourceMappingURL=SplitMenuButtonWebElementBase.js.map