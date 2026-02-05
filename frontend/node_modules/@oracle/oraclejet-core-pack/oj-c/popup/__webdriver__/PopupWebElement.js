"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PopupWebElement = void 0;
const PopupWebElementBase_1 = require("./PopupWebElementBase");
const selenium_webdriver_1 = require("selenium-webdriver");
/**
 * The component WebElement for [oj-c-popup](../../jsdocs/oj-c.Popup.html).
 * Do not instantiate this class directly, instead, use
 * [findPopup](../modules.html#findPopup).
 */
class PopupWebElement extends PopupWebElementBase_1.PopupWebElementBase {
    async isDisplayed() {
        const content = await this.getContent();
        if (!content)
            return false;
        return content.isDisplayed();
    }
    getSize() {
        return this.getContent()
            .then((content) => content.getRect())
            .then((rect) => Promise.resolve({ width: rect.width, height: rect.height }));
    }
    getRect() {
        return this.getContent().then((content) => content.getRect());
    }
    getText() {
        return this.getContent().then((content) => content.getText());
    }
    findElement(locator) {
        const p = this.whenReady()
            .then(() => this.getContent())
            .then((content) => content.findElement(locator));
        return new selenium_webdriver_1.WebElementPromise(this.getDriver(), p);
    }
    async findElements(locator) {
        const content = await this.getContent();
        return content.findElements(locator);
    }
    async getContent() {
        await this.whenBusyContextReady();
        const content = await this.getDriver().executeScript((el) => {
            const LAYER_CONTENT = Symbol.for('__oj_c_layer_content');
            return el[LAYER_CONTENT];
        }, this);
        return content;
    }
    /**
     * Dismisses the popup.
     */
    doClose() {
        return this.setProperty('opened', false);
    }
}
exports.PopupWebElement = PopupWebElement;
//# sourceMappingURL=PopupWebElement.js.map