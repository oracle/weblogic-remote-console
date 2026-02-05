"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighlightTextWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-highlight-text WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, HighlightTextWebElement.ts.
 */
class HighlightTextWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>matchText</code> property.
     * The text string to match.
     * @return The value of <code>matchText</code> property.
     *
     */
    getMatchText() {
        return this.getProperty('matchText');
    }
    /**
     * Gets the value of <code>text</code> property.
     * The text string to apply highlighting to.
     * @return The value of <code>text</code> property.
     *
     */
    getTextProperty() {
        return this.getProperty('text');
    }
}
exports.HighlightTextWebElementBase = HighlightTextWebElementBase;
//# sourceMappingURL=HighlightTextWebElementBase.js.map