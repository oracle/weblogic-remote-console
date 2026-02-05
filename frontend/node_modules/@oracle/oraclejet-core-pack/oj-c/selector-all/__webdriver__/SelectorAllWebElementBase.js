"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectorAllWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-selector-all WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, SelectorAllWebElement.ts.
 */
class SelectorAllWebElementBase extends elements_1.OjWebElement {
    /**
     * Sets the value of <code>selectedKeys</code> property.
     * Specifies the selectedKeys, should be hooked into the collection component.
     * @param selectedKeys The value to set for <code>selectedKeys</code>
     *
     */
    changeSelectedKeys(selectedKeys) {
        return this.setProperty('selectedKeys', selectedKeys);
    }
    /**
     * Gets the value of <code>selectedKeys</code> property.
     * Specifies the selectedKeys, should be hooked into the collection component.
     * @return The value of <code>selectedKeys</code> property.
     *
     */
    getSelectedKeys() {
        return this.getProperty('selectedKeys');
    }
    /**
     * Gets the value of <code>showTooltip</code> property.
     * Specifies whether tooltip should be shown on the SelectorAll checkbox
     * @return The value of <code>showTooltip</code> property.
     *
     */
    getShowTooltip() {
        return this.getProperty('showTooltip');
    }
}
exports.SelectorAllWebElementBase = SelectorAllWebElementBase;
//# sourceMappingURL=SelectorAllWebElementBase.js.map