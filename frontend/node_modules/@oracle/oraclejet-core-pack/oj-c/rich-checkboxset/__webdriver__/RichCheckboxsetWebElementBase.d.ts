import { OjWebElement } from '@oracle/oraclejet-webdriver/elements';
/**
 * This is the base class for oj-c-rich-checkboxset WebElement, and is generated from the
 * component's metadata. Do not modify these contents since they'll be replaced
 * during the next generation.
 * Put overrides into the WebElements's subclass, RichCheckboxsetWebElement.ts.
 */
export declare class RichCheckboxsetWebElementBase extends OjWebElement {
    /**
     * Gets the value of <code>containerReadonly</code> property.
     * Specifies whether an ancestor container, like oj-c-form-layout, is readonly.
     * @return The value of <code>containerReadonly</code> property.
     *
     */
    getContainerReadonly(): Promise<boolean>;
    /**
     * Gets the value of <code>columnSpan</code> property.
     * Specifies how many columns this component should span.
     * @return The value of <code>columnSpan</code> property.
     *
     */
    getColumnSpan(): Promise<number>;
    /**
     * Gets the value of <code>disabled</code> property.
     * Specifies whether the component is disabled.
     * @return The value of <code>disabled</code> property.
     *
     */
    getDisabled(): Promise<boolean>;
    /**
     * Gets the value of <code>displayOptions</code> property.
     * Display options for auxiliary content that describes whether or not it should be displayed.
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
     * The helpHints object contains a definition property, sourceText property, and a source property.
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
     * Gets the value of <code>layout</code> property.
     * Specifies the layout of the cards and media.
     * @return The value of <code>layout</code> property.
     *
     */
    getLayout(): Promise<string>;
    /**
     * Gets the value of <code>maxSelected</code> property.
     * The maximum number of items to select. If defined, it must be greater than or equal to 2.
     * @return The value of <code>maxSelected</code> property.
     *
     */
    getMaxSelected(): Promise<number>;
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
     * Gets the value of <code>minSelected</code> property.
     * The minimal number of items to select. If defined, it must be greater than or equal to 2.
     * @return The value of <code>minSelected</code> property.
     *
     */
    getMinSelected(): Promise<number>;
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
     * Gets the value of <code>selectionExactMessageDetail</code> property.
     * Overrides the default Selection Exact message.
     * @return The value of <code>selectionExactMessageDetail</code> property.
     *
     */
    getSelectionExactMessageDetail(): Promise<null>;
    /**
     * Gets the value of <code>selectionOverflowMessageDetail</code> property.
     * Overrides the default Selection Overflow message.
     * @return The value of <code>selectionOverflowMessageDetail</code> property.
     *
     */
    getSelectionOverflowMessageDetail(): Promise<null>;
    /**
     * Gets the value of <code>selectionRangeMessageDetail</code> property.
     * Overrides the default Selection Range message.
     * @return The value of <code>selectionRangeMessageDetail</code> property.
     *
     */
    getSelectionRangeMessageDetail(): Promise<null>;
    /**
     * Gets the value of <code>selectionUnderflowMessageDetail</code> property.
     * Overrides the default Selection Underflow message.
     * @return The value of <code>selectionUnderflowMessageDetail</code> property.
     *
     */
    getSelectionUnderflowMessageDetail(): Promise<null>;
    /**
     * Gets the value of <code>userAssistanceDensity</code> property.
     * Specifies the density of the form component's user assistance presentation.
     * @return The value of <code>userAssistanceDensity</code> property.
     *
     */
    getUserAssistanceDensity(): Promise<string>;
    /**
     * Gets the value of <code>options</code> property.
     * An array of data items that returns the option items for the Rich Checkboxset.
     * @return The value of <code>options</code> property.
     *
     */
    getOptions(): Promise<Array<object>>;
    /**
     * Gets the value of <code>requiredMessageDetail</code> property.
     * Overrides the default Required error message.
     * @return The value of <code>requiredMessageDetail</code> property.
     *
     */
    getRequiredMessageDetail(): Promise<string>;
    /**
     * Gets the value of <code>valid</code> property.
     * Specifies whether the component is in a valid state
     * @return The value of <code>valid</code> property.
     *
     */
    getValid(): Promise<string>;
    /**
     * Sets the value of <code>value</code> property.
     * The value of the component.
     * @param value The value to set for <code>value</code>
     *
     */
    changeValue(value: Array<string | number> | null): Promise<void>;
    /**
     * Gets the value of <code>value</code> property.
     * The value of the component.
     * @return The value of <code>value</code> property.
     *
     */
    getValue(): Promise<Array<string | number> | null>;
}
export interface DisplayOptions {
    /**
     *
     */
    messages: string;
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
