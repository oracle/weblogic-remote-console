"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListItemLayoutWebElement = void 0;
const ListItemLayoutWebElementBase_1 = require("./ListItemLayoutWebElementBase");
/**
 * ListItemLayout is not accessible to WebDriverJS.
 * These methods are deprecated since 16.0.0 and are not to be used.
 */
class ListItemLayoutWebElement extends ListItemLayoutWebElementBase_1.ListItemLayoutWebElementBase {
    /**
     * This method is deprecated since 16.0.0
     *
     * Gets the value of <code>primary</code> property.
     * Returns primary text.
     * @return The value of <code>primary</code> property.
     *
     */
    getPrimary() {
        return this.getProperty('primary');
    }
    /**
     * This method is deprecated since 16.0.0
     *
     * Gets the value of <code>secondary</code> property.
     * Returns secondary text.
     * @return The value of <code>secondary</code> property.
     *
     */
    getSecondary() {
        return this.getProperty('secondary');
    }
    /**
     * This method is deprecated since 16.0.0
     *
     * Gets the value of <code>tertiary</code> property.
     * Returns tertiary text.
     * @return The value of <code>tertiary</code> property.
     *
     */
    getTertiary() {
        return this.getProperty('tertiary');
    }
    /**
     * This method is deprecated since 16.0.0
     *
     * Gets the value of <code>quaternary</code> property.
     * Returns quaternary text.
     * @return The value of <code>quaternary</code> property.
     *
     */
    getQuaternary() {
        return this.getProperty('quaternary');
    }
    /**
     * This method is deprecated since 16.0.0
     *
     * Gets the value of <code>overline</code> property.
     * Returns overline text.
     * @return The value of <code>overline</code> property.
     *
     */
    getOverline() {
        return this.getProperty('overline');
    }
}
exports.ListItemLayoutWebElement = ListItemLayoutWebElement;
//# sourceMappingURL=ListItemLayoutWebElement.js.map