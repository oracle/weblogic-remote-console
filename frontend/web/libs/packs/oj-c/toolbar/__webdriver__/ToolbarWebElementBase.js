"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolbarWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-toolbar WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, ToolbarWebElement.ts.
 */
class ToolbarWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>spacing</code> property.
     * Specifies the spacing between content. 'sm' spacing is recommended for button variants that don't have a background or border, for example borderless buttons. 'lg' spacing is recommended for button variants that have a background or border, for example outlined or solid buttons.
     * @return The value of <code>spacing</code> property.
     *
     */
    getSpacing() {
        return this.getProperty('spacing');
    }
    /**
     * Gets the value of <code>chroming</code> property.
     * Specifies the chroming to be set on content to be placed into the toolbar.
     * @return The value of <code>chroming</code> property.
     *
     */
    getChroming() {
        return this.getProperty('chroming');
    }
    /**
     * Gets the value of <code>size</code> property.
     * Specifies the size of content to be placed into the toolbar.
     * @return The value of <code>size</code> property.
     *
     */
    getSizeProperty() {
        return this.getProperty('size');
    }
    /**
     * Sets the value of <code>toolbarSelection</code> property.
     * An array containing key/value objects for selection groups.
     * @param toolbarSelection The value to set for <code>toolbarSelection</code>
     *
     */
    changeToolbarSelection(toolbarSelection) {
        return this.setProperty('toolbarSelection', toolbarSelection);
    }
    /**
     * Gets the value of <code>toolbarSelection</code> property.
     * An array containing key/value objects for selection groups.
     * @return The value of <code>toolbarSelection</code> property.
     *
     */
    getToolbarSelection() {
        return this.getProperty('toolbarSelection');
    }
}
exports.ToolbarWebElementBase = ToolbarWebElementBase;
//# sourceMappingURL=ToolbarWebElementBase.js.map