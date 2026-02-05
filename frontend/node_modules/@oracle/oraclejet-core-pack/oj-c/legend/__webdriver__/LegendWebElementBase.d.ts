import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-legend WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, LegendWebElement.ts.
 */
export declare class LegendWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>data</code> property.
     * Specifies the DataProvider for the sections and items of the legend.
     * @return The value of <code>data</code> property.
     * @deprecated Since 17.1.0. Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead.
     */
    getData(): Promise<null>;
    /**
     * Gets the value of <code>drilling</code> property.
     * Specifies whether drilling is enabled.
     * @return The value of <code>drilling</code> property.
     *
     */
    getDrilling(): Promise<string>;
    /**
     * Gets the value of <code>halign</code> property.
     * Defines the horizontal alignment of the legend contents.
     * @return The value of <code>halign</code> property.
     *
     */
    getHalign(): Promise<string>;
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
     * Gets the value of <code>hideAndShowBehavior</code> property.
     * Defines whether the legend can be used to initiate hide and show behavior on referenced data items.
     * @return The value of <code>hideAndShowBehavior</code> property.
     *
     */
    getHideAndShowBehavior(): Promise<string>;
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
     * Defines the behavior applied when hovering over a legend item.
     * @return The value of <code>hoverBehavior</code> property.
     *
     */
    getHoverBehavior(): Promise<string>;
    /**
     * Gets the value of <code>orientation</code> property.
     * Defines the orientation of the legend, which determines the direction in which the legend items are laid out.
     * @return The value of <code>orientation</code> property.
     *
     */
    getOrientation(): Promise<string>;
    /**
     * Gets the value of <code>symbolHeight</code> property.
     * The height of the legend symbol in pixels.
     * @return The value of <code>symbolHeight</code> property.
     *
     */
    getSymbolHeight(): Promise<number>;
    /**
     * Gets the value of <code>symbolWidth</code> property.
     * The width of the legend symbol in pixels.
     * @return The value of <code>symbolWidth</code> property.
     *
     */
    getSymbolWidth(): Promise<number>;
    /**
     * Gets the value of <code>textStyle</code> property.
     * The CSS style object defining the style of the legend item text.
     * @return The value of <code>textStyle</code> property.
     *
     */
    getTextStyle(): Promise<TextStyle>;
    /**
     * Gets the value of <code>valign</code> property.
     * Defines the vertical alignment of the legend contents.
     * @return The value of <code>valign</code> property.
     *
     */
    getValign(): Promise<string>;
    /**
     * Gets the value of <code>sectionTitleStyle</code> property.
     * The CSS style object defining the style of the section titles' text.
     * @return The value of <code>sectionTitleStyle</code> property.
     *
     */
    getSectionTitleStyle(): Promise<SectionTitleStyle>;
    /**
     * Gets the value of <code>sectionTitleHalign</code> property.
     * The horizontal alignment of the section titles.
     * @return The value of <code>sectionTitleHalign</code> property.
     *
     */
    getSectionTitleHalign(): Promise<string>;
    /**
     * Gets the value of <code>contextMenuConfig</code> property.
     * Specifies a context menu configuration.
     * @return The value of <code>contextMenuConfig</code> property.
     *
     */
    getContextMenuConfig(): Promise<ContextMenuConfig>;
}
export interface TextStyle {
    /**
     *
     */
    color: string;
    /**
     *
     */
    fontFamily: string;
    /**
     *
     */
    fontSize: string;
    /**
     *
     */
    fontStyle: string;
    /**
     *
     */
    fontWeight: string;
    /**
     *
     */
    textDecoration: string;
}
export interface SectionTitleStyle {
    /**
     *
     */
    color: string;
    /**
     *
     */
    fontFamily: string;
    /**
     *
     */
    fontSize: string;
    /**
     *
     */
    fontStyle: string;
    /**
     *
     */
    fontWeight: string;
    /**
     *
     */
    textDecoration: string;
}
export interface ContextMenuConfig {
    /**
     *
     */
    accessibleLabel: string;
}
