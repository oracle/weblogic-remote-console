"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollapsibleWebElement = void 0;
const selenium_webdriver_1 = require("selenium-webdriver");
const CollapsibleWebElementBase_1 = require("./CollapsibleWebElementBase");
/**
 * The component WebElement for [oj-c-collapsible](../../jsdocs/oj-c.Collapsible.html).
 * Do not instantiate this class directly, instead, use
 * [findCollapsible](../functions/findCollapsible.html).
 */
class CollapsibleWebElement extends CollapsibleWebElementBase_1.CollapsibleWebElementBase {
    /**
     * Collapse the content. If already collapsed, this method will do nothing.
     * @returns Promise<void>
     */
    async doCollapse() {
        if (await this.getExpanded()) {
            return (await this.getToggleButton()).click();
        }
    }
    /**
     * Expand the content. If already expanded, this method will do nothing.
     * @returns Promise<void>
     */
    async doExpand() {
        if (!(await this.getExpanded())) {
            return (await this.getToggleButton()).click();
        }
    }
    getToggleButton() {
        if (!this.toggleButton) {
            this.toggleButton = this.findElement(
            // Need to use Xpath to partial-match header Id
            selenium_webdriver_1.By.xpath('.//*[starts-with(@id, "oj-collapsible-header-")]/*/*[starts-with(@aria-labelledby, "oj-collapsible-header-")]'));
        }
        return this.toggleButton;
    }
}
exports.CollapsibleWebElement = CollapsibleWebElement;
//# sourceMappingURL=CollapsibleWebElement.js.map