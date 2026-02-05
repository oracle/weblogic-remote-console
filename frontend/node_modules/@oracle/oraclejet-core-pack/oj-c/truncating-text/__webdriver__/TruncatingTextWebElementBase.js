"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TruncatingTextWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-truncating-text WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, TruncatingTextWebElement.ts.
 */
class TruncatingTextWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>variant</code> property.
     * Specifies text color. If set as 'inherit', takes text color from its parent element.
     * @return The value of <code>variant</code> property.
     *
     */
    getVariant() {
        return this.getProperty('variant');
    }
    /**
     * Gets the value of <code>size</code> property.
     * Specifies font size and line height. If set as 'inherit', takes font size and line height from its parent element.
     * @return The value of <code>size</code> property.
     *
     */
    getSizeProperty() {
        return this.getProperty('size');
    }
    /**
     * Gets the value of <code>weight</code> property.
     * Specifies the font weight. If set as 'inherit', takes font weight from its parent element.
     * @return The value of <code>weight</code> property.
     *
     */
    getWeight() {
        return this.getProperty('weight');
    }
    /**
     * Gets the value of <code>overflowWrap</code> property.
     * Specifies the overflow-wrap.
     * @return The value of <code>overflowWrap</code> property.
     *
     */
    getOverflowWrap() {
        return this.getProperty('overflowWrap');
    }
    /**
     * Gets the value of <code>hyphens</code> property.
     * Specifies if hyphens should be included when handling long words with no spaces.
     * @return The value of <code>hyphens</code> property.
     *
     */
    getHyphens() {
        return this.getProperty('hyphens');
    }
    /**
     * Gets the value of <code>truncation</code> property.
     * Determines text behavior when text is truncated. Be aware of setting either lineClamp or truncation. Setting both props would produce a type error. In most cases, lineClamp=1 tries to put the ellipsis at the end of a "word". On the other hand, using truncation="ellipsis" will show as much as possible text, then put the ellipsis at the end.
     * @return The value of <code>truncation</code> property.
     *
     */
    getTruncation() {
        return this.getProperty('truncation');
    }
    /**
     * Gets the value of <code>lineClamp</code> property.
     * Truncates text at a specific number of lines and then displays an ellipsis (…) at the end of the last line. Parent of the element needs to have a specific width so text starts overflowing and produce a truncation.
     * @return The value of <code>lineClamp</code> property.
     *
     */
    getLineClamp() {
        return this.getProperty('lineClamp');
    }
    /**
     * Gets the value of <code>value</code> property.
     * "Specifies the text to be displayed.
     * @return The value of <code>value</code> property.
     *
     */
    getValue() {
        return this.getProperty('value');
    }
}
exports.TruncatingTextWebElementBase = TruncatingTextWebElementBase;
//# sourceMappingURL=TruncatingTextWebElementBase.js.map