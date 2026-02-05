"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageToastWebElement = void 0;
const oraclejet_webdriver_1 = require("@oracle/oraclejet-webdriver");
const selenium_webdriver_1 = require("selenium-webdriver");
const MessageToastWebElementBase_1 = require("./MessageToastWebElementBase");
/**
 * The component WebElement for [oj-c-message-toast](../../jsdocs/oj-c.MessageToast.html).
 * Do not instantiate this class directly, instead, use
 * [findMessageToast](../functions/findMessageToast.html).
 */
class MessageToastWebElement extends MessageToastWebElementBase_1.MessageToastWebElementBase {
    /**
     * Retrieve a SlotProxy which represents the custom detail content of a single message.
     * @param messageLocator.key The key within the MessageToast's dataset associated with the individual message.
     * @throws {Error} when the detail content rendered is not provided by the application
     * @returns The detail content of the message rendered by the application
     * @since "15.0.4"
     */
    async findDetail(messageLocator) {
        const key = messageLocator.key;
        const layerId = await this.getAttribute('data-oj-messages-layer-id');
        const messagesContainer = await this.getMessagesContainer(layerId);
        const messageSelector = this.getMessageSelector(key);
        const customDetailContentSelector = '[data-oj-message-custom-detail]';
        try {
            const el = await messagesContainer.findElement(selenium_webdriver_1.By.css(`${messageSelector} ${customDetailContentSelector}`));
            return (0, oraclejet_webdriver_1.slotProxy)(el, this);
        }
        catch (e) {
            throw new selenium_webdriver_1.error.NoSuchElementError('No corresponding detail template or renderer found for the messageLocator.');
        }
    }
    /**
     * Retrieve a SlotProxy which represents the custom icon content of a single message.
     * @param messageLocator.key The key within the MessageToast's dataset associated with the individual message.
     * @throws {Error} when the icon content rendered is not provided by the application
     * @returns The icon content of the message rendered by the application
     * @since "15.0.4"
     */
    async findIcon(messageLocator) {
        const key = messageLocator.key;
        const layerId = await this.getAttribute('data-oj-messages-layer-id');
        const messagesContainer = await this.getMessagesContainer(layerId);
        const messageSelector = this.getMessageSelector(key);
        const customIconContentSelector = '[data-oj-message-custom-icon]';
        try {
            const el = await messagesContainer.findElement(selenium_webdriver_1.By.css(`${messageSelector} ${customIconContentSelector}`));
            return (0, oraclejet_webdriver_1.slotProxy)(el, this);
        }
        catch (e) {
            throw new selenium_webdriver_1.error.NoSuchElementError('No corresponding icon template or renderer found for the messageLocator.');
        }
    }
    /**
     * Closes the message identified by the provided key.
     * @param messageLocator.key The key within the MessageToast's dataset associated with the individual message.
     * @throws {Error} when the specified is not closable (closeAffordance set to "off")
     * @since "15.0.4"
     */
    async doClose(messageLocator) {
        const key = messageLocator.key;
        const layerId = await this.getAttribute('data-oj-messages-layer-id');
        const messagesContainer = await this.getMessagesContainer(layerId);
        const messageSelector = this.getMessageSelector(key);
        const closeButtonSelector = '[data-oj-message-close-button] button';
        try {
            const el = await messagesContainer.findElement(selenium_webdriver_1.By.css(`${messageSelector} ${closeButtonSelector}`));
            await el.click();
        }
        catch (e) {
            throw new selenium_webdriver_1.error.UnsupportedOperationError('The close operation is not applicable for the messageLocator.');
        }
    }
    /**
     * Finds the layered content of this messages instance.
     *
     * @param id The layer id for this instance of the message
     * @returns The layer content
     */
    getMessagesContainer(id) {
        const driver = this.getDriver();
        return driver.findElement(selenium_webdriver_1.By.id(id));
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
exports.MessageToastWebElement = MessageToastWebElement;
//# sourceMappingURL=MessageToastWebElement.js.map