"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormLayoutWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-form-layout WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, FormLayoutWebElement.ts.
 */
class FormLayoutWebElementBase extends elements_1.OjWebElement {
    /**
     * Gets the value of <code>columns</code> property.
     * Specifies how many columns should be displayed (fixed). If positive, overrides maxColumns.
     * @return The value of <code>columns</code> property.
     *
     */
    getColumns() {
        return this.getProperty('columns');
    }
    /**
     * Gets the value of <code>columnSpan</code> property.
     * Specifies how many columns this component should span when this it is a child of a form layout.
     * @return The value of <code>columnSpan</code> property.
     *
     */
    getColumnSpan() {
        return this.getProperty('columnSpan');
    }
    /**
     * Gets the value of <code>direction</code> property.
     * Specifies the layout direction of the form layout children.
     * @return The value of <code>direction</code> property.
     *
     */
    getDirection() {
        return this.getProperty('direction');
    }
    /**
     * Gets the value of <code>fullWidth</code> property.
     * Indicates if the form layout will use 100% of the container's width.
     * @return The value of <code>fullWidth</code> property.
     *
     */
    getFullWidth() {
        return this.getProperty('fullWidth');
    }
    /**
     * Gets the value of <code>labelEdge</code> property.
     * Specifies how the child form components should position their labels.
     * @return The value of <code>labelEdge</code> property.
     *
     */
    getLabelEdge() {
        return this.getProperty('labelEdge');
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
     * Gets the value of <code>maxColumns</code> property.
     * Specifies how many columns should be displayed (responsive). This prop is ignored if columns has a positive value.
     * @return The value of <code>maxColumns</code> property.
     *
     */
    getMaxColumns() {
        return this.getProperty('maxColumns');
    }
    /**
     * Gets the value of <code>readonly</code> property.
     * Whether the child components should be rendered as readonly.
     * @return The value of <code>readonly</code> property.
     *
     */
    getReadonly() {
        return this.getProperty('readonly');
    }
    /**
     * Gets the value of <code>userAssistanceDensity</code> property.
     * Specifies the density of the children form component's user assistance presentation.
     * @return The value of <code>userAssistanceDensity</code> property.
     *
     */
    getUserAssistanceDensity() {
        return this.getProperty('userAssistanceDensity');
    }
}
exports.FormLayoutWebElementBase = FormLayoutWebElementBase;
//# sourceMappingURL=FormLayoutWebElementBase.js.map