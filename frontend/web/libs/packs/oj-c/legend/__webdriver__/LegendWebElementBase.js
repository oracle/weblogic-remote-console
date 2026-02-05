"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LegendWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-legend WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, LegendWebElement.ts.
 */
class LegendWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>data</code> property.
     * Specifies the DataProvider for the sections and items of the legend.
     * @return The value of <code>data</code> property.
     * @deprecated Since 17.1.0. Data sets from a DataProvider cannot be sent to WebDriverJS; use ViewModels or page variables instead.
     */
    getData() {
        return this.getProperty('data');
    }
    /**
     * Gets the value of <code>drilling</code> property.
     * Specifies whether drilling is enabled.
     * @return The value of <code>drilling</code> property.
     *
     */
    getDrilling() {
        return this.getProperty('drilling');
    }
    /**
     * Gets the value of <code>halign</code> property.
     * Defines the horizontal alignment of the legend contents.
     * @return The value of <code>halign</code> property.
     *
     */
    getHalign() {
        return this.getProperty('halign');
    }
    /**
     * Sets the value of <code>hiddenCategories</code> property.
     * An array of categories that will be hidden.
     * @param hiddenCategories The value to set for <code>hiddenCategories</code>
     *
     */
    changeHiddenCategories(hiddenCategories) {
        return this.setProperty('hiddenCategories', hiddenCategories);
    }
    /**
     * Gets the value of <code>hiddenCategories</code> property.
     * An array of categories that will be hidden.
     * @return The value of <code>hiddenCategories</code> property.
     *
     */
    getHiddenCategories() {
        return this.getProperty('hiddenCategories');
    }
    /**
     * Gets the value of <code>hideAndShowBehavior</code> property.
     * Defines whether the legend can be used to initiate hide and show behavior on referenced data items.
     * @return The value of <code>hideAndShowBehavior</code> property.
     *
     */
    getHideAndShowBehavior() {
        return this.getProperty('hideAndShowBehavior');
    }
    /**
     * Sets the value of <code>highlightedCategories</code> property.
     * An array of categories that will be highlighted.
     * @param highlightedCategories The value to set for <code>highlightedCategories</code>
     *
     */
    changeHighlightedCategories(highlightedCategories) {
        return this.setProperty('highlightedCategories', highlightedCategories);
    }
    /**
     * Gets the value of <code>highlightedCategories</code> property.
     * An array of categories that will be highlighted.
     * @return The value of <code>highlightedCategories</code> property.
     *
     */
    getHighlightedCategories() {
        return this.getProperty('highlightedCategories');
    }
    /**
     * Gets the value of <code>hoverBehavior</code> property.
     * Defines the behavior applied when hovering over a legend item.
     * @return The value of <code>hoverBehavior</code> property.
     *
     */
    getHoverBehavior() {
        return this.getProperty('hoverBehavior');
    }
    /**
     * Gets the value of <code>orientation</code> property.
     * Defines the orientation of the legend, which determines the direction in which the legend items are laid out.
     * @return The value of <code>orientation</code> property.
     *
     */
    getOrientation() {
        return this.getProperty('orientation');
    }
    /**
     * Gets the value of <code>symbolHeight</code> property.
     * The height of the legend symbol in pixels.
     * @return The value of <code>symbolHeight</code> property.
     *
     */
    getSymbolHeight() {
        return this.getProperty('symbolHeight');
    }
    /**
     * Gets the value of <code>symbolWidth</code> property.
     * The width of the legend symbol in pixels.
     * @return The value of <code>symbolWidth</code> property.
     *
     */
    getSymbolWidth() {
        return this.getProperty('symbolWidth');
    }
    /**
     * Gets the value of <code>textStyle</code> property.
     * The CSS style object defining the style of the legend item text.
     * @return The value of <code>textStyle</code> property.
     *
     */
    getTextStyle() {
        return this.getProperty('textStyle');
    }
    /**
     * Gets the value of <code>valign</code> property.
     * Defines the vertical alignment of the legend contents.
     * @return The value of <code>valign</code> property.
     *
     */
    getValign() {
        return this.getProperty('valign');
    }
    /**
     * Gets the value of <code>sectionTitleStyle</code> property.
     * The CSS style object defining the style of the section titles' text.
     * @return The value of <code>sectionTitleStyle</code> property.
     *
     */
    getSectionTitleStyle() {
        return this.getProperty('sectionTitleStyle');
    }
    /**
     * Gets the value of <code>sectionTitleHalign</code> property.
     * The horizontal alignment of the section titles.
     * @return The value of <code>sectionTitleHalign</code> property.
     *
     */
    getSectionTitleHalign() {
        return this.getProperty('sectionTitleHalign');
    }
    /**
     * Gets the value of <code>contextMenuConfig</code> property.
     * Specifies a context menu configuration.
     * @return The value of <code>contextMenuConfig</code> property.
     *
     */
    getContextMenuConfig() {
        return this.getProperty('contextMenuConfig');
    }
}
exports.LegendWebElementBase = LegendWebElementBase;
//# sourceMappingURL=LegendWebElementBase.js.map