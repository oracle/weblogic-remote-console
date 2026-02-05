import { SlotProxy } from '@oracle/oraclejet-webdriver';
import { MessageBannerWebElementBase } from './MessageBannerWebElementBase';
/**
 * The component WebElement for [oj-c-message-banner](../../jsdocs/oj-c.MessageBanner.html).
 * Do not instantiate this class directly, instead, use
 * [findMessageBanner](../functions/findMessageBanner.html).
 */
export declare class MessageBannerWebElement extends MessageBannerWebElementBase {
    /**
     * Retrieve a SlotProxy which represents the detail content of a single message.
     * @param messageLocator.key The key within the MessageBanner's dataset associated with the individual message.
     * @throws {Error} when the detail content rendered is not provided by the application
     * @returns The detail content of the message rendered by the application
     */
    findDetail<K>(messageLocator: {
        key: K;
    }): Promise<SlotProxy>;
    /**
     * Closes the message identified by the provided key.
     * @param messageLocator.key The key within the MessageBanner's dataset associated with the individual message.
     * @throws {Error} when the specified is not closable (closeAffordance set to "off")
     */
    doClose<K>(messageLocator: {
        key: K;
    }): Promise<void>;
    /**
     * Creates the CSS selector for the message with the provided key.
     *
     * @param key The key of the message
     * @returns the css selector that can used to fetch the message
     */
    private getMessageSelector;
}
