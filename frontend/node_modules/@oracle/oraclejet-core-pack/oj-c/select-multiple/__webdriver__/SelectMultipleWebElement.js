"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectMultipleWebElement = void 0;
const SelectMultipleWebElementBase_1 = require("./SelectMultipleWebElementBase");
/**
 * The component WebElement for [oj-c-select-multiple](../../jsdocs/oj-c.SelectMultiple.html).
 * Do not instantiate this class directly, instead, use
 * [findSelectMultiple](../functions/findSelectMultiple.html).
 */
class SelectMultipleWebElement extends SelectMultipleWebElementBase_1.SelectMultipleWebElementBase {
    // Put overrides here
    /**
     * Sets the value of the <code>value</code> property.
     * The value of the component.
     * @param value The value to set for <code>value</code>
     * @override
     */
    async changeValue(value) {
        // Only mutate if not readonly/disabled
        const readonly = await this.getReadonly();
        const disabled = await this.getDisabled();
        if (!(readonly || disabled)) {
            await this.getDriver().executeScript((element) => element.focus(), this);
            await this.whenBusyContextReady();
            await this.getDriver().executeScript((element, arValue) => {
                // the value is passed as an array, not a Set
                const value = arValue != null ? new Set(arValue) : arValue;
                return element._selectItemsByValue(value);
            }, this, 
            // pass the value as an array, not a Set
            value != null ? Array.from(value.values()) : value);
        }
    }
    /**
     * Gets the value of <code>value</code> property.
     * The value of the component.
     * @return The value of <code>value</code> property.
     *
     */
    async getValue() {
        // since we can't return Set through WebDriver or change the return type of the inherited
        // method, convert Set -> Array on the client, then Array -> Set to the caller
        const value = await this.getDriver().executeScript((el) => {
            return el.value ? Array.from(el.value) : null;
        }, this);
        return value ? new Set(value) : value;
    }
    /**
     * Clears the value of the component.
     * @override
     */
    clear() {
        return this.changeValue(null);
    }
}
exports.SelectMultipleWebElement = SelectMultipleWebElement;
//# sourceMappingURL=SelectMultipleWebElement.js.map