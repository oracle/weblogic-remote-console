import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-tag-cloud WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, TagCloudWebElement.ts.
 */
export declare class TagCloudWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>data</code> property.
     * Specifies the DataProvider for the sections and items of the tag-cloud
     * @return The value of <code>data</code> property.
     * @deprecated Since 17.1.0. Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead.
     */
    getData(): Promise<null>;
    /**
     * Gets the value of <code>datatip</code> property.
     *
     * @return The value of <code>datatip</code> property.
     *
     */
    getDatatip(): Promise<null>;
    /**
     * Sets the value of <code>hiddenCategories</code> property.
     * An array of categories that will be hidden.
     * @param hiddenCategories The value to set for <code>hiddenCategories</code>
     *
     */
    changeHiddenCategories(hiddenCategories: Array<string>): Promise<void>;
    /**
     * Gets the value of <code>hiddenCategories</code> property.
     * An array of categories that will be hidden.
     * @return The value of <code>hiddenCategories</code> property.
     *
     */
    getHiddenCategories(): Promise<Array<string>>;
    /**
     * Gets the value of <code>touchResponse</code> property.
     * Data visualizations require a press and hold delay before triggering tooltips and rollover effects on mobile devices to avoid interfering with page panning, but these hold delays can make applications seem slower and less responsive. For a better user experience, the application can remove the touch and hold delay when data visualizations are used within a non scrolling container or if there is sufficient space outside of the visualization for panning. If touchResponse is touchStart the element will instantly trigger the touch gesture and consume the page pan events. If touchResponse is auto, the element will behave like touchStart if it determines that it is not rendered within scrolling content and if element panning is not available for those elements that support the feature.
     * @return The value of <code>touchResponse</code> property.
     *
     */
    getTouchResponse(): Promise<string>;
    /**
     * Gets the value of <code>highlightMatch</code> property.
     * The matching condition for the highlightedCategories option. By default, highlightMatch is 'all' and only items whose categories match all of the values specified in the highlightedCategories array will be highlighted. If highlightMatch is 'any', then items that match at least one of the highlightedCategories values will be highlighted.
     * @return The value of <code>highlightMatch</code> property.
     *
     */
    getHighlightMatch(): Promise<string>;
    /**
     * Sets the value of <code>highlightedCategories</code> property.
     * An array of categories that will be highlighted.
     * @param highlightedCategories The value to set for <code>highlightedCategories</code>
     *
     */
    changeHighlightedCategories(highlightedCategories: Array<string>): Promise<void>;
    /**
     * Gets the value of <code>highlightedCategories</code> property.
     * An array of categories that will be highlighted.
     * @return The value of <code>highlightedCategories</code> property.
     *
     */
    getHighlightedCategories(): Promise<Array<string>>;
    /**
     * Gets the value of <code>hoverBehavior</code> property.
     * Defines the behavior applied when hovering over data items.
     * @return The value of <code>hoverBehavior</code> property.
     *
     */
    getHoverBehavior(): Promise<string>;
    /**
     * Gets the value of <code>layout</code> property.
     * The layout to use for tag display.
     * @return The value of <code>layout</code> property.
     *
     */
    getLayout(): Promise<string>;
    /**
     * Gets the value of <code>selectionMode</code> property.
     * Specifies the selection mode.
     * @return The value of <code>selectionMode</code> property.
     *
     */
    getSelectionMode(): Promise<string>;
    /**
     * Sets the value of <code>selection</code> property.
     * An array containing the ids of the initially selected data items.
     * @param selection The value to set for <code>selection</code>
     *
     */
    changeSelection(selection: Array<string | number>): Promise<void>;
    /**
     * Gets the value of <code>selection</code> property.
     * An array containing the ids of the initially selected data items.
     * @return The value of <code>selection</code> property.
     *
     */
    getSelection(): Promise<Array<string | number>>;
    /**
     * Gets the value of <code>contextMenuConfig</code> property.
     * Specifies a context menu configuration.
     * @return The value of <code>contextMenuConfig</code> property.
     *
     */
    getContextMenuConfig(): Promise<ContextMenuConfig>;
}
export interface ContextMenuConfig {
    /**
     *
     */
    accessibleLabel: string;
}
