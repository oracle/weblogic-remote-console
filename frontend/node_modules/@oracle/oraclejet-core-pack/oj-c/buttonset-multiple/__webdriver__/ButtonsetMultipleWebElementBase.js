"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonsetMultipleWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-buttonset-multiple WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, ButtonsetMultipleWebElement.ts.
 */
class ButtonsetMultipleWebElementBase extends elements_1.OjWebElement {
    /**
     * Sets the value of <code>value</code> property.
     * Specifies which toggle button is selected
     * @param value The value to set for <code>value</code>
     *
     */
    changeValue(value) {
        return this.setProperty('value', value);
    }
    /**
     * Gets the value of <code>value</code> property.
     * Specifies which toggle button is selected
     * @return The value of <code>value</code> property.
     *
     */
    getValue() {
        return this.getProperty('value');
    }
    /**
     * Gets the value of <code>items</code> property.
     * Specifies the toggle buttons rendered by the buttonset.
     * @return The value of <code>items</code> property.
     *
     */
    getItems() {
        return this.getProperty('items');
    }
    /**
     * Gets the value of <code>display</code> property.
     * Display just the label, the icons, or all.
     * @return The value of <code>display</code> property.
     *
     */
    getDisplay() {
        return this.getProperty('display');
    }
    /**
     * Gets the value of <code>disabled</code> property.
     * Specifies that the buttonset should be disabled.
     * @return The value of <code>disabled</code> property.
     *
     */
    getDisabled() {
        return this.getProperty('disabled');
    }
    /**
     * Gets the value of <code>size</code> property.
     * Specifies the size of the toggle buttons
     * @return The value of <code>size</code> property.
     *
     */
    getSizeProperty() {
        return this.getProperty('size');
    }
    /**
     * Gets the value of <code>width</code> property.
     * Specifies the buttonset width
     * @return The value of <code>width</code> property.
     *
     */
    getWidth() {
        return this.getProperty('width');
    }
    /**
     * Gets the value of <code>maxWidth</code> property.
     * Specifies the buttonset max width
     * @return The value of <code>maxWidth</code> property.
     *
     */
    getMaxWidth() {
        return this.getProperty('maxWidth');
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
    /**
     * Gets the value of <code>layoutWidth</code> property.
     * Specifies if button width should be equal or based on contents.
     * @return The value of <code>layoutWidth</code> property.
     *
     */
    getLayoutWidth() {
        return this.getProperty('layoutWidth');
    }
}
exports.ButtonsetMultipleWebElementBase = ButtonsetMultipleWebElementBase;
//# sourceMappingURL=ButtonsetMultipleWebElementBase.js.map