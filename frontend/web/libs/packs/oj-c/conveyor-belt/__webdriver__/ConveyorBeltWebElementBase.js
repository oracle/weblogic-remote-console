"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConveyorBeltWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-conveyor-belt WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, ConveyorBeltWebElement.ts.
 */
class ConveyorBeltWebElementBase extends elements_1.OjWebElement {
    /**
     * Sets the value of <code>scrollPosition</code> property.
     * Gets or sets the number of pixels that an element's content is scrolled from its initial position.
     * @param scrollPosition The value to set for <code>scrollPosition</code>
     *
     */
    changeScrollPosition(scrollPosition) {
        return this.setProperty('scrollPosition', scrollPosition);
    }
    /**
     * Gets the value of <code>scrollPosition</code> property.
     * Gets or sets the number of pixels that an element's content is scrolled from its initial position.
     * @return The value of <code>scrollPosition</code> property.
     *
     */
    getScrollPosition() {
        return this.getProperty('scrollPosition');
    }
    /**
     * Gets the value of <code>arrowVisibility</code> property.
     * Specifies visibility of overflow arrow buttons.
     * @return The value of <code>arrowVisibility</code> property.
     *
     */
    getArrowVisibility() {
        return this.getProperty('arrowVisibility');
    }
    /**
     * Gets the value of <code>items</code> property.
     * An array of data items or a data provider that returns the items for the ConveyorBelt.
     * @return The value of <code>items</code> property.
     *
     */
    getItems() {
        return this.getProperty('items');
    }
    /**
     * Gets the value of <code>orientation</code> property.
     *
     * @return The value of <code>orientation</code> property.
     *
     */
    getOrientation() {
        return this.getProperty('orientation');
    }
}
exports.ConveyorBeltWebElementBase = ConveyorBeltWebElementBase;
//# sourceMappingURL=ConveyorBeltWebElementBase.js.map