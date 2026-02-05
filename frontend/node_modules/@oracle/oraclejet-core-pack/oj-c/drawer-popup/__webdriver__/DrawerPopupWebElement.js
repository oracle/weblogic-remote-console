"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DrawerPopupWebElement = void 0;
const selenium_webdriver_1 = require("selenium-webdriver");
const DrawerPopupWebElementBase_1 = require("./DrawerPopupWebElementBase");
/**
 * The component WebElement for [oj-c-drawer-popup](../../jsdocs/oj-c.DrawerPopup.html).
 * Do not instantiate this class directly, instead, use
 * [findDrawerPopup](../functions/findDrawerPopup.html).
 */
class DrawerPopupWebElement extends DrawerPopupWebElementBase_1.DrawerPopupWebElementBase {
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
     * Dismisses the drawer.
     */
    doClose() {
        return this.setProperty('opened', false);
    }
    /**
     * Sets the value of <code>opened</code> property.
     * Specifies whether the Drawer is open.
     * @param opened The value to set for <code>opened</code>
     * @deprecated Since 18.0.0. Use a launcher action to open the drawer and <code>doClose</code> to dismiss it.
     */
    changeOpened(opened) {
        const localWhenReady = this.whenReady;
        this.whenReady = this.whenBusyContextReady;
        try {
            return super.changeOpened(opened);
        }
        finally {
            this.whenReady = localWhenReady;
        }
    }
}
exports.DrawerPopupWebElement = DrawerPopupWebElement;
//# sourceMappingURL=DrawerPopupWebElement.js.map