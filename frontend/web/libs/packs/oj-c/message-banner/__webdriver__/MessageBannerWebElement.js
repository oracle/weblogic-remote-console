"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageBannerWebElement = void 0;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const selenium_webdriver_1 = require("selenium-webdriver");
const MessageBannerWebElementBase_1 = require("./MessageBannerWebElementBase");
/**
 * The component WebElement for [oj-c-message-banner](../../jsdocs/oj-c.MessageBanner.html).
 * Do not instantiate this class directly, instead, use
 * [findMessageBanner](../functions/findMessageBanner.html).
 */
class MessageBannerWebElement extends MessageBannerWebElementBase_1.MessageBannerWebElementBase {
    /**
     * Retrieve a SlotProxy which represents the detail content of a single message.
     * @param messageLocator.key The key within the MessageBanner's dataset associated with the individual message.
     * @throws {Error} when the detail content rendered is not provided by the application
     * @returns The detail content of the message rendered by the application
     */
    async findDetail(messageLocator) {
        const key = messageLocator.key;
        const messageSelector = this.getMessageSelector(key);
        const customDetailContentSelector = '[data-oj-message-custom-detail]';
        try {
            const el = await this.findElement(selenium_webdriver_1.By.css(`${messageSelector} ${customDetailContentSelector}`));
            return (0, oraclejet_webdriver_1.slotProxy)(el, this);
        }
        catch (e) {
            throw new selenium_webdriver_1.error.NoSuchElementError('No corresponding detail template or renderer found for the messageLocator.');
        }
    }
    /**
     * Closes the message identified by the provided key.
     * @param messageLocator.key The key within the MessageBanner's dataset associated with the individual message.
     * @throws {Error} when the specified is not closable (closeAffordance set to "off")
     */
    async doClose(messageLocator) {
        const key = messageLocator.key;
        const messageSelector = this.getMessageSelector(key);
        const closeButtonSelector = '[data-oj-message-close-button] button';
        try {
            const el = await this.findElement(selenium_webdriver_1.By.css(`${messageSelector} ${closeButtonSelector}`));
            await el.click();
        }
        catch (e) {
            throw new selenium_webdriver_1.error.UnsupportedOperationError('The close operation is not applicable for the messageLocator.');
        }
    }
    /**
     * Creates the CSS selector for the message with the provided key.
     *
     * @param key The key of the message
     * @returns the css selector that can used to fetch the message
     */
    getMessageSelector(key) {
        return typeof key === 'number'
            ? `[data-oj-key="number-${key}"]`
            : `[data-oj-key="string-${key}"]`;
    }
}
exports.MessageBannerWebElement = MessageBannerWebElement;
//# sourceMappingURL=MessageBannerWebElement.js.map