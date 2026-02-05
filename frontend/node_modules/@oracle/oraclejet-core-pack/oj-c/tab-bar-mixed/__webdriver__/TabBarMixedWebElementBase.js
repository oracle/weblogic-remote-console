"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabBarMixedWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-tab-bar-mixed WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, TabBarMixedWebElement.ts.
 */
class TabBarMixedWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>dynamicTabs</code> property.
     * An array of dynamic tabs
     * @return The value of <code>dynamicTabs</code> property.
     *
     */
    getDynamicTabs() {
        return this.getProperty('dynamicTabs');
    }
    /**
     * Gets the value of <code>dynamicTabsOverflow</code> property.
     * Dynamic tabs overflow configurations
     * @return The value of <code>dynamicTabsOverflow</code> property.
     *
     */
    getDynamicTabsOverflow() {
        return this.getProperty('dynamicTabsOverflow');
    }
    /**
     * Gets the value of <code>dynamicTabsOverflowIcon</code> property.
     * The icon used on the overflow tab
     * @return The value of <code>dynamicTabsOverflowIcon</code> property.
     *
     */
    getDynamicTabsOverflowIcon() {
        return this.getProperty('dynamicTabsOverflowIcon');
    }
    /**
     * Gets the value of <code>size</code> property.
     * Size of TabBarMixed
     * @return The value of <code>size</code> property.
     *
     */
    getSizeProperty() {
        return this.getProperty('size');
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
     * Gets the value of <code>separatorPadding</code> property.
     * The padding around the vertical divider that seperates collections of tabs.
     * @return The value of <code>separatorPadding</code> property.
     *
     */
    getSeparatorPadding() {
        return this.getProperty('separatorPadding');
    }
    /**
     * Gets the value of <code>staticTabs</code> property.
     * An array of static tabs
     * @return The value of <code>staticTabs</code> property.
     *
     */
    getStaticTabs() {
        return this.getProperty('staticTabs');
    }
    /**
     * Gets the value of <code>staticTabsDisplay</code> property.
     * The display configuration for static tabs.
     * @return The value of <code>staticTabsDisplay</code> property.
     *
     */
    getStaticTabsDisplay() {
        return this.getProperty('staticTabsDisplay');
    }
}
exports.TabBarMixedWebElementBase = TabBarMixedWebElementBase;
//# sourceMappingURL=TabBarMixedWebElementBase.js.map