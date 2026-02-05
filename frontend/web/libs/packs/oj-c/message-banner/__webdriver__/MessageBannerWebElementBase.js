"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBannerWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-message-banner WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, MessageBannerWebElement.ts.
 */
class MessageBannerWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>type</code> property.
     * The type of the Banner message.
     * @return The value of <code>type</code> property.
     *
     */
    getType() {
        return this.getProperty('type');
    }
    /**
     * Gets the value of <code>detailTemplateValue</code> property.
     * The function that determines the detail template for the current row.
     * @return The value of <code>detailTemplateValue</code> property.
     *
     */
    getDetailTemplateValue() {
        return this.getProperty('detailTemplateValue');
    }
    /**
     * Gets the value of <code>sorting</code> property.
     * Specifies how to sort the messages from the dataprovider.
     * @return The value of <code>sorting</code> property.
     *
     */
    getSorting() {
        return this.getProperty('sorting');
    }
}
exports.MessageBannerWebElementBase = MessageBannerWebElementBase;
//# sourceMappingURL=MessageBannerWebElementBase.js.map