"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogWebElement = void 0;
const selenium_webdriver_1 = require("selenium-webdriver");
const DialogWebElementBase_1 = require("./DialogWebElementBase");
/**
 * The component WebElement for [oj-c-dialog](../../jsdocs/oj-c.Dialog.html).
 * Do not instantiate this class directly, instead, use
 * [findDialog](../functions/findDialog.html).
 */
class DialogWebElement extends DialogWebElementBase_1.DialogWebElementBase {
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
     * Dismisses the dialog.
     */
    doClose() {
        return this.setProperty('opened', false);
    }
}
exports.DialogWebElement = DialogWebElement;
//# sourceMappingURL=DialogWebElement.js.map