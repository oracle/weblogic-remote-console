"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelledLinkWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-labelled-link WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, LabelledLinkWebElement.ts.
 */
class LabelledLinkWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>columnSpan</code> property.
     * Specifies how many columns this component should span.
     * @return The value of <code>columnSpan</code> property.
     *
     */
    getColumnSpan() {
        return this.getProperty('columnSpan');
    }
    /**
     * Gets the value of <code>containerReadonly</code> property.
     * Specifies whether an ancestor container, like oj-c-form-layout, is readonly.
     * @return The value of <code>containerReadonly</code> property.
     *
     */
    getContainerReadonly() {
        return this.getProperty('containerReadonly');
    }
    /**
     * Gets the value of <code>href</code> property.
     * Sets the URL that the link points to.
     * @return The value of <code>href</code> property.
     *
     */
    getHref() {
        return this.getProperty('href');
    }
    /**
     * Gets the value of <code>labelEdge</code> property.
     * Specifies how the label is positioned for the component
     * @return The value of <code>labelEdge</code> property.
     *
     */
    getLabelEdge() {
        return this.getProperty('labelEdge');
    }
    /**
     * Gets the value of <code>labelHint</code> property.
     * Represents a hint for rendering a label on the component.
     * @return The value of <code>labelHint</code> property.
     *
     */
    getLabelHint() {
        return this.getProperty('labelHint');
    }
    /**
     * Gets the value of <code>labelStartWidth</code> property.
     * The width of the label when labelEdge is 'start'.
     * @return The value of <code>labelStartWidth</code> property.
     *
     */
    getLabelStartWidth() {
        return this.getProperty('labelStartWidth');
    }
    /**
     * Gets the value of <code>labelWrapping</code> property.
     * Should the labels wrap or truncate when there is not enough available space.
     * @return The value of <code>labelWrapping</code> property.
     * @deprecated Since 18.0.0. Label truncation for 'start' and 'top' aligned labels is no longer recommended by the Redwood Design System. The default for labelWrapping was 'wrap' and that is now the only suggested pattern by UX design for 'start' and 'top' aligned labels. 'inside' aligned labels are always truncated per UX design and are not affected by this property's value.
     */
    getLabelWrapping() {
        return this.getProperty('labelWrapping');
    }
    /**
     * Gets the value of <code>target</code> property.
     * Sets the target attribute of the link.
     * @return The value of <code>target</code> property.
     *
     */
    getTarget() {
        return this.getProperty('target');
    }
    /**
     * Gets the value of <code>text</code> property.
     * Specifies the text that should appear in the field.
     * @return The value of <code>text</code> property.
     *
     */
    getTextProperty() {
        return this.getProperty('text');
    }
    /**
     * Gets the value of <code>textAlign</code> property.
     * Specifies how the text is aligned within the text field
     * @return The value of <code>textAlign</code> property.
     *
     */
    getTextAlign() {
        return this.getProperty('textAlign');
    }
    /**
     * Gets the value of <code>unsafe_labelledBy</code> property.
     *
     * @return The value of <code>unsafe_labelledBy</code> property.
     *
     */
    getUnsafeLabelledBy() {
        return this.getProperty('unsafe_labelledBy');
    }
    /**
     * Gets the value of <code>userAssistanceDensity</code> property.
     * Specifies the density of the form component's user assistance presentation.
     * @return The value of <code>userAssistanceDensity</code> property.
     *
     */
    getUserAssistanceDensity() {
        return this.getProperty('userAssistanceDensity');
    }
}
exports.LabelledLinkWebElementBase = LabelledLinkWebElementBase;
//# sourceMappingURL=LabelledLinkWebElementBase.js.map