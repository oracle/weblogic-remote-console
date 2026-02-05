import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-highlight-text WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, HighlightTextWebElement.ts.
 */
export declare class HighlightTextWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>matchText</code> property.
     * The text string to match.
     * @return The value of <code>matchText</code> property.
     *
     */
    getMatchText(): Promise<string>;
    /**
     * Gets the value of <code>text</code> property.
     * The text string to apply highlighting to.
     * @return The value of <code>text</code> property.
     *
     */
    getTextProperty(): Promise<string>;
}
