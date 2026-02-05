"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageToastWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-message-toast WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, MessageToastWebElement.ts.
 */
class MessageToastWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>data</code> property.
     * Data for the Message Toast component.
     * @return The value of <code>data</code> property.
     * @deprecated Since 15.0.0. Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead.
     */
    getData() {
        return this.getProperty('data');
    }
    /**
     * Gets the value of <code>detailTemplateValue</code> property.
     * A dynamic template key or a function that determines the detail template for the current row.
     * @return The value of <code>detailTemplateValue</code> property.
     *
     */
    getDetailTemplateValue() {
        return this.getProperty('detailTemplateValue');
    }
    /**
     * Gets the value of <code>iconTemplateValue</code> property.
     * A dynamic template key or a function that determines the icon template for the current row.
     * @return The value of <code>iconTemplateValue</code> property.
     *
     */
    getIconTemplateValue() {
        return this.getProperty('iconTemplateValue');
    }
    /**
     * Gets the value of <code>offset</code> property.
     * Offset for the Message Toast component's position.
     * @return The value of <code>offset</code> property.
     *
     */
    getOffset() {
        return this.getProperty('offset');
    }
    /**
     * Gets the value of <code>position</code> property.
     * Position for the Message Toast component.
     * @return The value of <code>position</code> property.
     *
     */
    getPosition() {
        return this.getProperty('position');
    }
}
exports.MessageToastWebElementBase = MessageToastWebElementBase;
//# sourceMappingURL=MessageToastWebElementBase.js.map