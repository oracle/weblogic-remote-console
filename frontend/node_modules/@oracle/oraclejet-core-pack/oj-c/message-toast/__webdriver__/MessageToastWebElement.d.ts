import { SlotProxy } from '@oracle/oraclejet-webdriver';
import { MessageToastWebElementBase } from './MessageToastWebElementBase';
/**
 * The component WebElement for [oj-c-message-toast](../../jsdocs/oj-c.MessageToast.html).
 * Do not instantiate this class directly, instead, use
 * [findMessageToast](../functions/findMessageToast.html).
 */
export declare class MessageToastWebElement extends MessageToastWebElementBase {
    /**
     * Retrieve a SlotProxy which represents the custom detail content of a single message.
     * @param messageLocator.key The key within the MessageToast's dataset associated with the individual message.
     * @throws {Error} when the detail content rendered is not provided by the application
     * @returns The detail content of the message rendered by the application
     * @since "15.0.4"
     */
    findDetail<K>(messageLocator: {
        key: K;
    }): Promise<SlotProxy>;
    /**
     * Retrieve a SlotProxy which represents the custom icon content of a single message.
     * @param messageLocator.key The key within the MessageToast's dataset associated with the individual message.
     * @throws {Error} when the icon content rendered is not provided by the application
     * @returns The icon content of the message rendered by the application
     * @since "15.0.4"
     */
    findIcon<K>(messageLocator: {
        key: K;
    }): Promise<SlotProxy>;
    /**
     * Closes the message identified by the provided key.
     * @param messageLocator.key The key within the MessageToast's dataset associated with the individual message.
     * @throws {Error} when the specified is not closable (closeAffordance set to "off")
     * @since "15.0.4"
     */
    doClose<K>(messageLocator: {
        key: K;
    }): Promise<void>;
    /**
     * Finds the layered content of this messages instance.
     *
     * @param id The layer id for this instance of the message
     * @returns The layer content
     */
    private getMessagesContainer;
    /**
     * Creates the CSS selector for the message with the provided key.
     *
     * @param key The key of the message
     * @returns the css selector that can used to fetch the message
     */
    private getMessageSelector;
}
