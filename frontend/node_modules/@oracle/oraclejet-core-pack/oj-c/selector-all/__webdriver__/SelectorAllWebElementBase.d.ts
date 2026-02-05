import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-selector-all WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, SelectorAllWebElement.ts.
 */
export declare class SelectorAllWebElementBase extends OjWebElement {
    /**
     * Sets the value of <code>selectedKeys</code> property.
     * Specifies the selectedKeys, should be hooked into the collection component.
     * @param selectedKeys The value to set for <code>selectedKeys</code>
     *
     */
    changeSelectedKeys(selectedKeys: object): Promise<void>;
    /**
     * Gets the value of <code>selectedKeys</code> property.
     * Specifies the selectedKeys, should be hooked into the collection component.
     * @return The value of <code>selectedKeys</code> property.
     *
     */
    getSelectedKeys(): Promise<object>;
    /**
     * Gets the value of <code>showTooltip</code> property.
     * Specifies whether tooltip should be shown on the SelectorAll checkbox
     * @return The value of <code>showTooltip</code> property.
     *
     */
    getShowTooltip(): Promise<string>;
}
