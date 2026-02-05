import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-selection-card WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, SelectionCardWebElement.ts.
 */
export declare class SelectionCardWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>selected</code> property.
     * Boolean that marks this card as selected.
     * @return The value of <code>selected</code> property.
     *
     */
    getSelected(): Promise<boolean>;
}
