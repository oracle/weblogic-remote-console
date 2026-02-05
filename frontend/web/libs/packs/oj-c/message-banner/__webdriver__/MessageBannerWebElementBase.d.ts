import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-message-banner WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, MessageBannerWebElement.ts.
 */
export declare class MessageBannerWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>type</code> property.
     * The type of the Banner message.
     * @return The value of <code>type</code> property.
     *
     */
    getType(): Promise<string>;
    /**
     * Gets the value of <code>detailTemplateValue</code> property.
     * The function that determines the detail template for the current row.
     * @return The value of <code>detailTemplateValue</code> property.
     *
     */
    getDetailTemplateValue(): Promise<string | null>;
    /**
     * Gets the value of <code>sorting</code> property.
     * Specifies how to sort the messages from the dataprovider.
     * @return The value of <code>sorting</code> property.
     *
     */
    getSorting(): Promise<string>;
}
