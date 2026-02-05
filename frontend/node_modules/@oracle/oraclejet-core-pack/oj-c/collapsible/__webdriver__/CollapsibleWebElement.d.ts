import { CollapsibleWebElementBase } from './CollapsibleWebElementBase';
/**
 * The component WebElement for [oj-c-collapsible](../../jsdocs/oj-c.Collapsible.html).
 * Do not instantiate this class directly, instead, use
 * [findCollapsible](../functions/findCollapsible.html).
 */
export declare class CollapsibleWebElement extends CollapsibleWebElementBase {
    private toggleButton;
    /**
     * Collapse the content. If already collapsed, this method will do nothing.
     * @returns Promise<void>
     */
    doCollapse(): Promise<void>;
    /**
     * Expand the content. If already expanded, this method will do nothing.
     * @returns Promise<void>
     */
    doExpand(): Promise<void>;
    private getToggleButton;
}
