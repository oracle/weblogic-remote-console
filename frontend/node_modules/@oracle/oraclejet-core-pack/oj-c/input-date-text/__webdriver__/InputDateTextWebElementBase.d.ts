import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-input-date-text WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, InputDateTextWebElement.ts.
 */
export declare class InputDateTextWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>autocomplete</code> property.
     * Dictates component's autocomplete state
     * @return The value of <code>autocomplete</code> property.
     *
     */
    getAutocomplete(): Promise<string>;
    /**
     * Gets the value of <code>columnSpan</code> property.
     * Specifies how many columns this component should span.
     * @return The value of <code>columnSpan</code> property.
     *
     */
    getColumnSpan(): Promise<number>;
    /**
     * Gets the value of <code>containerReadonly</code> property.
     * Specifies whether an ancestor container, like oj-c-form-layout, is readonly.
     * @return The value of <code>containerReadonly</code> property.
     *
     */
    getContainerReadonly(): Promise<boolean>;
    /**
     * Gets the value of <code>dateRangeOverflowMessageDetail</code> property.
     * Overrides the default validator's rangeOverflow message detail.
     * @return The value of <code>dateRangeOverflowMessageDetail</code> property.
     *
     */
    getDateRangeOverflowMessageDetail(): Promise<string>;
    /**
     * Gets the value of <code>dateRangeUnderflowMessageDetail</code> property.
     * Overrides the default validator's rangeUnderflow message detail.
     * @return The value of <code>dateRangeUnderflowMessageDetail</code> property.
     *
     */
    getDateRangeUnderflowMessageDetail(): Promise<string>;
    /**
     * Gets the value of <code>disabled</code> property.
     * Specifies whether the component is disabled.
     * @return The value of <code>disabled</code> property.
     *
     */
    getDisabled(): Promise<boolean>;
    /**
     * Gets the value of <code>displayOptions</code> property.
     * Display options for auxiliary content that determines whether or not it should be displayed.
     * @return The value of <code>displayOptions</code> property.
     *
     */
    getDisplayOptions(): Promise<DisplayOptions>;
    /**
     * Gets the value of <code>help</code> property.
     * Form component help information.
     * @return The value of <code>help</code> property.
     *
     */
    getHelp(): Promise<Help>;
    /**
     * Gets the value of <code>helpHints</code> property.
     * The helpHints object contains a definition property and a source property.
     * @return The value of <code>helpHints</code> property.
     *
     */
    getHelpHints(): Promise<HelpHints>;
    /**
     * Gets the value of <code>labelEdge</code> property.
     * Specifies how the label is positioned for the component
     * @return The value of <code>labelEdge</code> property.
     *
     */
    getLabelEdge(): Promise<string>;
    /**
     * Gets the value of <code>labelHint</code> property.
     * Represents a hint for rendering a label on the component.
     * @return The value of <code>labelHint</code> property.
     *
     */
    getLabelHint(): Promise<string>;
    /**
     * Gets the value of <code>labelStartWidth</code> property.
     * The width of the label when labelEdge is 'start'.
     * @return The value of <code>labelStartWidth</code> property.
     *
     */
    getLabelStartWidth(): Promise<number | string>;
    /**
     * Gets the value of <code>labelWrapping</code> property.
     * Should the labels wrap or truncate when there is not enough available space.
     * @return The value of <code>labelWrapping</code> property.
     * @deprecated Since 18.0.0. Label truncation for 'start' and 'top' aligned labels is no longer recommended by the Redwood Design System. The default for labelWrapping was 'wrap' and that is now the only suggested pattern by UX design for 'start' and 'top' aligned labels. 'inside' aligned labels are always truncated per UX design and are not affected by this property's value.
     */
    getLabelWrapping(): Promise<string>;
    /**
     * Gets the value of <code>max</code> property.
     * The maximum selectable date, in ISO string format
     * @return The value of <code>max</code> property.
     *
     */
    getMax(): Promise<string | null>;
    /**
     * Gets the value of <code>maxWidth</code> property.
     * The max width of the control.
     * @return The value of <code>maxWidth</code> property.
     *
     */
    getMaxWidth(): Promise<number | string>;
    /**
     * Sets the value of <code>messagesCustom</code> property.
     * List of custom component messages
     * @param messagesCustom The value to set for <code>messagesCustom</code>
     *
     */
    changeMessagesCustom(messagesCustom: Array<MessagesCustom>): Promise<void>;
    /**
     * Gets the value of <code>messagesCustom</code> property.
     * List of custom component messages
     * @return The value of <code>messagesCustom</code> property.
     *
     */
    getMessagesCustom(): Promise<Array<MessagesCustom>>;
    /**
     * Gets the value of <code>min</code> property.
     * The minimum selectable date, in ISO string format
     * @return The value of <code>min</code> property.
     *
     */
    getMin(): Promise<string | null>;
    /**
     * Gets the value of <code>readonly</code> property.
     * Whether the component is readonly
     * @return The value of <code>readonly</code> property.
     *
     */
    getReadonly(): Promise<boolean>;
    /**
     * Gets the value of <code>readonlyUserAssistanceShown</code> property.
     * Specifies which user assistance types should be shown when the component is readonly.
     * @return The value of <code>readonlyUserAssistanceShown</code> property.
     *
     */
    getReadonlyUserAssistanceShown(): Promise<string>;
    /**
     * Gets the value of <code>required</code> property.
     * Specifies whether or not the component is required.
     * @return The value of <code>required</code> property.
     *
     */
    getRequired(): Promise<boolean>;
    /**
     * Gets the value of <code>requiredMessageDetail</code> property.
     * Overrides the default Required error message.
     * @return The value of <code>requiredMessageDetail</code> property.
     *
     */
    getRequiredMessageDetail(): Promise<string>;
    /**
     * Gets the value of <code>textAlign</code> property.
     * Specifies how the text is aligned within the text field
     * @return The value of <code>textAlign</code> property.
     *
     */
    getTextAlign(): Promise<string>;
    /**
     * Gets the value of <code>userAssistanceDensity</code> property.
     * Specifies the density of the form component's user assistance presentation.
     * @return The value of <code>userAssistanceDensity</code> property.
     *
     */
    getUserAssistanceDensity(): Promise<string>;
    /**
     * Gets the value of <code>validators</code> property.
     * Specifies the validators for the component.
     * @return The value of <code>validators</code> property.
     *
     */
    getValidators(): Promise<Array<object> | null>;
    /**
     * Sets the value of <code>value</code> property.
     * The value of the component.
     * @param value The value to set for <code>value</code>
     *
     */
    changeValue(value: string | null): Promise<void>;
    /**
     * Gets the value of <code>value</code> property.
     * The value of the component.
     * @return The value of <code>value</code> property.
     *
     */
    getValue(): Promise<string | null>;
    /**
     * Gets the value of <code>width</code> property.
     * The width of the control.
     * @return The value of <code>width</code> property.
     *
     */
    getWidth(): Promise<number | string>;
    /**
     * Gets the value of <code>rawValue</code> property.
     * Specifies how the raw value of the component
     * @return The value of <code>rawValue</code> property.
     *
     */
    getRawValue(): Promise<string>;
    /**
     * Gets the value of <code>valid</code> property.
     * Specifies how the valid state of the component
     * @return The value of <code>valid</code> property.
     *
     */
    getValid(): Promise<string>;
}
export interface DisplayOptions {
    /**
     *
     */
    converterHint: string;
    /**
     *
     */
    messages: string;
    /**
     *
     */
    validatorHint: string;
}
export interface Help {
    /**
     *
     */
    instruction: string;
}
export interface HelpHints {
    /**
     *
     */
    definition: string;
    /**
     *
     */
    source: string;
    /**
     *
     */
    sourceText: string;
}
export interface MessagesCustom {
    /**
     *
     */
    summary: string;
    /**
     *
     */
    detail: string;
    /**
     *
     */
    severity: string;
}
