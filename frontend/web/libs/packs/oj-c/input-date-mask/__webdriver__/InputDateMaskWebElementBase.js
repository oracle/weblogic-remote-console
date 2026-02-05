"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputDateMaskWebElementBase = void 0;
const elements_1 = require("@oracle/oraclejet-webdriver/elements");
/**
 * This is the base class for oj-c-input-date-mask WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, InputDateMaskWebElement.ts.
 */
class InputDateMaskWebElementBase extends elements_1.OjWebElement {
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
     * Gets the value of <code>dateRangeOverflowMessageDetail</code> property.
     * Overrides the default validator's rangeOverflow message detail.
     * @return The value of <code>dateRangeOverflowMessageDetail</code> property.
     *
     */
    getDateRangeOverflowMessageDetail() {
        return this.getProperty('dateRangeOverflowMessageDetail');
    }
    /**
     * Gets the value of <code>dateRangeUnderflowMessageDetail</code> property.
     * Overrides the default validator's rangeUnderflow message detail.
     * @return The value of <code>dateRangeUnderflowMessageDetail</code> property.
     *
     */
    getDateRangeUnderflowMessageDetail() {
        return this.getProperty('dateRangeUnderflowMessageDetail');
    }
    /**
     * Gets the value of <code>disabled</code> property.
     * Specifies whether the component is disabled.
     * @return The value of <code>disabled</code> property.
     *
     */
    getDisabled() {
        return this.getProperty('disabled');
    }
    /**
     * Gets the value of <code>displayOptions</code> property.
     * Display options for auxiliary content that determines whether or not it should be displayed.
     * @return The value of <code>displayOptions</code> property.
     *
     */
    getDisplayOptions() {
        return this.getProperty('displayOptions');
    }
    /**
     * Gets the value of <code>help</code> property.
     * Form component help information.
     * @return The value of <code>help</code> property.
     *
     */
    getHelp() {
        return this.getProperty('help');
    }
    /**
     * Gets the value of <code>helpHints</code> property.
     * The helpHints object contains a definition property and a source property.
     * @return The value of <code>helpHints</code> property.
     *
     */
    getHelpHints() {
        return this.getProperty('helpHints');
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
     * Gets the value of <code>max</code> property.
     * The maximum selectable date, in ISO string format
     * @return The value of <code>max</code> property.
     *
     */
    getMax() {
        return this.getProperty('max');
    }
    /**
     * Gets the value of <code>maxWidth</code> property.
     * The max width of the control.
     * @return The value of <code>maxWidth</code> property.
     *
     */
    getMaxWidth() {
        return this.getProperty('maxWidth');
    }
    /**
     * Sets the value of <code>messagesCustom</code> property.
     * List of custom component messages
     * @param messagesCustom The value to set for <code>messagesCustom</code>
     *
     */
    changeMessagesCustom(messagesCustom) {
        return this.setProperty('messagesCustom', messagesCustom);
    }
    /**
     * Gets the value of <code>messagesCustom</code> property.
     * List of custom component messages
     * @return The value of <code>messagesCustom</code> property.
     *
     */
    getMessagesCustom() {
        return this.getProperty('messagesCustom');
    }
    /**
     * Gets the value of <code>min</code> property.
     * The minimum selectable date, in ISO string format
     * @return The value of <code>min</code> property.
     *
     */
    getMin() {
        return this.getProperty('min');
    }
    /**
     * Gets the value of <code>readonly</code> property.
     * Whether the component is readonly
     * @return The value of <code>readonly</code> property.
     *
     */
    getReadonly() {
        return this.getProperty('readonly');
    }
    /**
     * Gets the value of <code>readonlyUserAssistanceShown</code> property.
     * Specifies which user assistance types should be shown when the component is readonly.
     * @return The value of <code>readonlyUserAssistanceShown</code> property.
     *
     */
    getReadonlyUserAssistanceShown() {
        return this.getProperty('readonlyUserAssistanceShown');
    }
    /**
     * Gets the value of <code>required</code> property.
     * Specifies whether or not the component is required.
     * @return The value of <code>required</code> property.
     *
     */
    getRequired() {
        return this.getProperty('required');
    }
    /**
     * Gets the value of <code>requiredMessageDetail</code> property.
     * Overrides the default Required error message.
     * @return The value of <code>requiredMessageDetail</code> property.
     *
     */
    getRequiredMessageDetail() {
        return this.getProperty('requiredMessageDetail');
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
     * Gets the value of <code>userAssistanceDensity</code> property.
     * Specifies the density of the form component's user assistance presentation.
     * @return The value of <code>userAssistanceDensity</code> property.
     *
     */
    getUserAssistanceDensity() {
        return this.getProperty('userAssistanceDensity');
    }
    /**
     * Gets the value of <code>validators</code> property.
     * Specifies the validators for the component.
     * @return The value of <code>validators</code> property.
     *
     */
    getValidators() {
        return this.getProperty('validators');
    }
    /**
     * Sets the value of <code>value</code> property.
     * The value of the component.
     * @param value The value to set for <code>value</code>
     *
     */
    changeValue(value) {
        return this.setProperty('value', value);
    }
    /**
     * Gets the value of <code>value</code> property.
     * The value of the component.
     * @return The value of <code>value</code> property.
     *
     */
    getValue() {
        return this.getProperty('value');
    }
    /**
     * Gets the value of <code>width</code> property.
     * The width of the control.
     * @return The value of <code>width</code> property.
     *
     */
    getWidth() {
        return this.getProperty('width');
    }
    /**
     * Gets the value of <code>rawValue</code> property.
     * Specifies how the raw value of the component
     * @return The value of <code>rawValue</code> property.
     *
     */
    getRawValue() {
        return this.getProperty('rawValue');
    }
    /**
     * Gets the value of <code>valid</code> property.
     * Specifies how the valid state of the component
     * @return The value of <code>valid</code> property.
     *
     */
    getValid() {
        return this.getProperty('valid');
    }
}
exports.InputDateMaskWebElementBase = InputDateMaskWebElementBase;
//# sourceMappingURL=InputDateMaskWebElementBase.js.map