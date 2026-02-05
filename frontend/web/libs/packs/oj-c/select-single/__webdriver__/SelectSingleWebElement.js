"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectSingleWebElement = void 0;
const SelectSingleWebElementBase_1 = require("./SelectSingleWebElementBase");
/**
 * The component WebElement for [oj-c-select-single](../../jsdocs/oj-c.SelectSingle.html).
 * Do not instantiate this class directly, instead, use
 * [findSelectSingle](../functions/findSelectSingle.html).
 */
class SelectSingleWebElement extends SelectSingleWebElementBase_1.SelectSingleWebElementBase {
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
            await this.getDriver().executeScript((element, value) => {
                return element._selectItemByValue(value);
            }, this, value);
        }
    }
    /**
     * Clears the value of the component.
     * @override
     */
    clear() {
        return this.changeValue(null);
    }
    // /**
    //  * Triggers the <code>ojAddToListAction</code> event.
    //  * @param searchText The <code>searchText</code> to include in the
    //  * <code>ojAddToListAction</code> event.
    //  */
    // async doAddToListAction(searchText: string) {
    //   // Call focus() on the root element
    //   await this.getDriver().executeScript('arguments[0].focus()', this);
    //   // Only fire event if advanced search is on and component is not readonly/disabled
    //   const readonly = await this.getReadonly();
    //   const disabled = await this.getDisabled();
    //   const addToList = await this.getAddToList();
    //   if (!(readonly || disabled) && addToList === 'on') {
    //     await this.whenBusyContextReady();
    //     await this.getDriver().executeAsyncScript(
    //       `
    //       var element = arguments[0];
    //       var searchText = arguments[1];
    //       // Last argument will be the done function
    //       var doneFunc = arguments[arguments.length - 1];
    //       element._doAddToListAction(searchText)
    //         .then(doneFunc, doneFunc)
    //         .catch(doneFunc);
    //     `,
    //       this,
    //       searchText
    //     );
    //   }
    // }
    /**
     * Triggers the <code>ojAdvancedSearchAction</code> event.
     * @param searchText The <code>searchText</code> to include in the
     * <code>ojAdvancedSearchAction</code> event.
     */
    async doAdvancedSearchAction(searchText) {
        // Only fire event if advanced search is on and component is not readonly/disabled
        const readonly = await this.getReadonly();
        const disabled = await this.getDisabled();
        const advancedSearch = await this.getAdvancedSearch();
        if (!(readonly || disabled) && advancedSearch === 'on') {
            await this.getDriver().executeScript((element) => element.focus(), this);
            await this.whenBusyContextReady();
            await this.getDriver().executeScript((element, searchText) => {
                return element._doAdvancedSearchAction(searchText);
            }, this, searchText);
        }
    }
}
exports.SelectSingleWebElement = SelectSingleWebElement;
//# sourceMappingURL=SelectSingleWebElement.js.map