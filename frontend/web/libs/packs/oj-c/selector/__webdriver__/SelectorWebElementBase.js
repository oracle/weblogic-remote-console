"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectorWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-selector WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, SelectorWebElement.ts.
 */
class SelectorWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>rowKey</code> property.
     * Specifies the row key of each selector.
     * @return The value of <code>rowKey</code> property.
     *
     */
    getRowKey() {
        return this.getProperty('rowKey');
    }
    /**
     * Sets the value of <code>selectedKeys</code> property.
     * Specifies the selectedKeys.
     * @param selectedKeys The value to set for <code>selectedKeys</code>
     *
     */
    changeSelectedKeys(selectedKeys) {
        return this.setProperty('selectedKeys', selectedKeys);
    }
    /**
     * Gets the value of <code>selectedKeys</code> property.
     * Specifies the selectedKeys.
     * @return The value of <code>selectedKeys</code> property.
     *
     */
    getSelectedKeys() {
        return this.getProperty('selectedKeys');
    }
    /**
     * Gets the value of <code>indeterminate</code> property.
     * Visual only state to indicate partial selection
     * @return The value of <code>indeterminate</code> property.
     *
     */
    getIndeterminate() {
        return this.getProperty('indeterminate');
    }
    /**
     * Gets the value of <code>selectionMode</code> property.
     * Specifies the selection mode.
     * @return The value of <code>selectionMode</code> property.
     *
     */
    getSelectionMode() {
        return this.getProperty('selectionMode');
    }
}
exports.SelectorWebElementBase = SelectorWebElementBase;
//# sourceMappingURL=SelectorWebElementBase.js.map