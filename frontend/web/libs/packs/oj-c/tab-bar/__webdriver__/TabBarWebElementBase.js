"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabBarWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-tab-bar WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, TabBarWebElement.ts.
 */
class TabBarWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>data</code> property.
     * An array of tabs
     * @return The value of <code>data</code> property.
     *
     */
    getData() {
        return this.getProperty('data');
    }
    /**
     * Sets the value of <code>selection</code> property.
     * The key of the selected tab
     * @param selection The value to set for <code>selection</code>
     *
     */
    changeSelection(selection) {
        return this.setProperty('selection', selection);
    }
    /**
     * Gets the value of <code>selection</code> property.
     * The key of the selected tab
     * @return The value of <code>selection</code> property.
     *
     */
    getSelection() {
        return this.getProperty('selection');
    }
    /**
     * Gets the value of <code>reorderable</code> property.
     * The reorderable configuration for tabs.
     * @return The value of <code>reorderable</code> property.
     *
     */
    getReorderable() {
        return this.getProperty('reorderable');
    }
    /**
     * Gets the value of <code>overflow</code> property.
     * Specifies the overflow behavior.
     * @return The value of <code>overflow</code> property.
     *
     */
    getOverflow() {
        return this.getProperty('overflow');
    }
    /**
     * Gets the value of <code>display</code> property.
     * The display configuration for tabs.
     * @return The value of <code>display</code> property.
     *
     */
    getDisplay() {
        return this.getProperty('display');
    }
    /**
     * Gets the value of <code>layout</code> property.
     * The layout configuration for tabs.
     * @return The value of <code>layout</code> property.
     *
     */
    getLayout() {
        return this.getProperty('layout');
    }
    /**
     * Gets the value of <code>edge</code> property.
     * The edge configuration for tabs.
     * @return The value of <code>edge</code> property.
     *
     */
    getEdge() {
        return this.getProperty('edge');
    }
    /**
     * Gets the value of <code>truncation</code> property.
     * The truncation configuration for tab labels.
     * @return The value of <code>truncation</code> property.
     *
     */
    getTruncation() {
        return this.getProperty('truncation');
    }
    /**
     * Gets the value of <code>contextMenuConfig</code> property.
     * Specifies a context menu configuration.
     * @return The value of <code>contextMenuConfig</code> property.
     *
     */
    getContextMenuConfig() {
        return this.getProperty('contextMenuConfig');
    }
}
exports.TabBarWebElementBase = TabBarWebElementBase;
//# sourceMappingURL=TabBarWebElementBase.js.map