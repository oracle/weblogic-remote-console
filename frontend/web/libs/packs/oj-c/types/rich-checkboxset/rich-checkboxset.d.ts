import { ComponentProps, Ref, ComponentChildren } from 'preact';
import { ExtendGlobalProps, ObservedGlobalProps, PropertyChanged, ReadOnlyPropertyChanged } from 'ojs/ojvcomponent';
import { DisplayOptions, Help, HelpHints } from 'oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText';
import { ExactMessageDetailParameters, OverflowMessageDetailParameters, RangeMessageDetailParameters, UnderflowMessageDetailParameters } from 'oj-c/editable-value/UNSAFE_useSelectionRangeValidator';
import { RichCheckboxSet as PreactRichCheckboxSet } from '@oracle/oraclejet-preact/UNSAFE_RichCheckboxSet';
import { type RichSelectionItemData } from '@oracle/oraclejet-preact/UNSAFE_RichSelectionItem';
import { LayoutColumnSpan } from '@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout';
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
import 'css!oj-c/rich-checkboxset/rich-checkboxset-styles.css';
type ValidState = 'valid' | 'pending' | 'invalidHidden' | 'invalidShown';
type PreactRichCheckboxSetProps = ComponentProps<typeof PreactRichCheckboxSet>;
type RichCheckboxsetHandle = {
    /**
     * @ojmetadata description "Blurs the rich checkboxset."
     * @ignore
     */
    blur: () => void;
    /**
     * @ojmetadata description "Sets focus on the first tabbable checkbox card."
     * @ignore
     */
    focus: () => void;
    /**
     * Takes all deferred messages and shows them.
     * It then updates the valid property;
     * e.g., if the valid state was "invalidHidden" before showMessages(),
     * the valid state will become "invalidShown" after showMessages().
     * If there were no deferred messages this method simply returns.
     * While actively editing the component selections, the valid state may be "invalidHidden" until showMessages().
     * @ojmetadata description "Takes all deferred messages and shows them."
     */
    showMessages: () => void;
    /**
     * Resets the component by clearing all messages as well as the <code class="prettyprint">messagesCustom</code>
     * attribute, and also resets the component instance's <code class="prettyprint">value</code> to its default.
     * Any user entered value will be erased.
     * @ojmetadata description "Resets the component by clearing all messages."
     */
    reset: () => void;
    /**
     * If enabled, validates the component's display value (or null if display value is empty) and updates the value
     * option by performing the following steps.
     * <ol>
     * <li>All messages are cleared, including custom messages added by the app.</li>
     * <li>
     *  At the end of validation if there are errors, the messages are shown.
     *  If there were no errors, then the value option is updated.
     * </li>
     * </ol>
     * <p>While actively editing the component selections, the valid state may be "invalidHidden" until validate() is called.
     * If the component is readonly or disabled, returns a Promise that resolves to 'valid'
     * without doing any validation.</p>
     * @returns The Promise resolves to "valid" if the component is disabled or readonly.
     *    The Promise resolves to "invalid" if there were errors.
     * @ojmetadata description "If enabled, validates the component's display value."
     */
    validate: () => Promise<'valid' | 'invalid'>;
};
/**
 * Display options for auxiliary content that determines whether or not it should be displayed.
 */
type DisplayOptionsProps = Pick<DisplayOptions, 'messages'>;
type RichCheckboxsetProps<V extends string | number> = ObservedGlobalProps<'aria-describedby' | 'id'> & {
    /**
     * @description
     * Specifies whether an ancestor container, like oj-c-form-layout, is readonly.
     * This affects whether a readonly component renders in full or mixed readonly mode.
     * @ojmetadata description "Specifies whether an ancestor container, like oj-c-form-layout, is readonly."
     * @ojmetadata displayName "Container Readonly"
     * @ojmetadata help "#containerReadonly"
     */
    containerReadonly?: boolean;
    /**
     * @description
     * Specifies how many columns this component should span.
     * This only takes effect when this component is a child of a form layout
     * that has direction 'row'.
     * @ojmetadata description Specifies how many columns this component should span.
     * @ojmetadata displayName "Column Span"
     * @ojmetadata help "#columnSpan"
     */
    columnSpan?: LayoutColumnSpan;
    /**
     * @description
     * Whether the component is disabled. The default is false.
     *
     * <p>
     * When the <code class="prettyprint">disabled</code> property changes due to programmatic
     * intervention, the component may clear messages and run validation in some cases. </br>
     * <ul>
     * <li>when a required component is initialized as disabled
     * <code class="prettyprint">value="{{currentValue}}" required disabled</code>,
     * deferred validation is skipped.</li>
     * <li>when a disabled component is enabled,
     *  <ul>
     *  <li>if component is invalid and showing messages then all component messages are cleared,
     *  and full validation run using the display value.
     * <ul>
     *  <li>if there are validation errors, they are shown.</li>
     *  <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *  property is updated. Page authors can listen to the <code class="prettyprint">valueChanged</code>
     *  event to clear custom errors.</li>
     * </ul>
     *  </li>
     *
     *  <li>if component is valid and has no errors then deferred validation is run.
     *  <ul>
     *  <li>if there is a deferred validation error, then the valid property is updated. </li>
     *  </ul>
     *  </li>
     *  <li>if component is invalid and deferred errors then component messages are cleared and
     *  deferred validation re-run.
     *  <ul>
     *  <li>if there is a deferred validation error, then the valid property is updated.</li>
     *  </ul>
     *  </li>
     *  </ul>
     * </li>
     * <li>when enabled component is disabled then no validation is run and the component appears
     * disabled.</li>
     * </ul>
     * </p>
     * @ojmetadata description "Specifies whether the component is disabled."
     * @ojmetadata displayName "Disabled"
     */
    disabled?: boolean;
    /**
     * @description
     * Display options for auxiliary content that describes whether or not it should be displayed.
     *
     * @ojmetadata description "Display options for auxiliary content that describes whether or not it should be displayed."
     * @ojmetadata displayName "Display Options"
     */
    displayOptions?: DisplayOptionsProps;
    /**
     * @description
     * Form component help information.
     *
     * @ojmetadata description "Form component help information."
     * @ojmetadata displayName "Help"
     */
    help?: Help;
    /**
     * @description
     * The helpHints object contains a definition property, sourceText property, and a source property.
     * @ojmetadata description "The helpHints object contains a definition property, sourceText property, and a source property."
     * @ojmetadata displayName "Help Hints"
     */
    helpHints?: HelpHints;
    /**
     * @description
     * Specifies how the label of the component is positioned when the label-hint
     * attribute is set on the component.
     * @ojmetadata description "Specifies how the label is positioned for the component"
     * @ojmetadata displayName "Label Edge"
     * @ojmetadata propertyEditorValues {
     * "inside": {
     *   "description": "The label will be placed on top of the rich checkboxset, but is smaller than 'top' option.",
     *   "displayName": "Inside"
     * },
     * "none": {
     *   "description": "The rich checkboxset will not create a label, but instead set the aria-label property on the rich checkboxset.",
     *   "displayName": "None"
     * },
     * "start": {
     *   "description": "The label will be placed before the start of the rich checkboxset.",
     *   "displayName": "Start"
     * },
     * "top": {
     *   "description": "The label will be placed on top of the rich checkboxset.",
     *   "displayName": "Top"
     * }
     * }
     */
    labelEdge?: 'none' | 'top' | 'inside' | 'start';
    /**
     * @description
     * Represents a hint for rendering a label on the component.
     * This is used in combination with the label-edge attribute to control how the label should be rendered.
     *
     * @ojmetadata description "Represents a hint for rendering a label on the component."
     * @ojmetadata displayName "Label Hint"
     * @ojmetadata required
     * @ojmetadata translatable
     */
    labelHint: string;
    /**
     * @description
     * <p> The width of the label when labelEdge is 'start'.</p>
     * <p> This attribute accepts values of type
     * <code>0 | `var(${string})` | `--${string}` | `${number}%` | `${number}x` | `calc(${string})` | `${number}${CssUnits}</code></p>
     *
     * @ojmetadata description "The width of the label when labelEdge is 'start'."
     * @ojmetadata displayName "Label Start Width"
     * @ojmetadata help "#labelStartWidth"
     */
    labelStartWidth?: Size;
    /**
     * @description
     * Specifies the layout of the cards and media.
     * @ojmetadata description "Specifies the layout of the cards and media."
     * @ojmetadata displayName "Layout"
     */
    layout: PreactRichCheckboxSetProps['layout'];
    /**
     * @description
     * Specifies the maximum number of selectable options. If defined, it must be greater than or equal to 2.
     * If both "maxSelected" and "minSelected" are defined, "maxSelected" must be greater than or equal to
     * "minSelected". To require an exact number of options to be selected, set "maxSelected" and "minSelected"
     * to the same value. To require exactly one or a maximum of one item, use "RichRadioSet."
     * @ojmetadata description "The maximum number of items to select. If defined, it must be greater than or equal to 2."
     * @ojmetadata displayName "Max Selected"
     */
    maxSelected?: number;
    /**
     * @description
     * List of messages an app would add to the component when it has business/custom validation
     * errors that it wants the component to show. This allows the app to perform further validation
     * before sending data to the server. When this option is set the message shows to the
     * user right away. To clear the custom message, set <code class="prettyprint">messagesCustom</code>
     * back to an empty array.<br/>
     * <p>
     * See the <a href="#validation-section">Validation and Messages</a> section
     * for details on when the component clears <code class="prettyprint">messagesCustom</code>;
     * for example, when full validation is run.
     * </p>
     *
     * @ojmetadata description "List of custom component messages"
     * @ojmetadata displayName "Messages Custom"
     */
    messagesCustom?: PreactRichCheckboxSetProps['messages'];
    /**
     * @description
     * Specifies the minimum number of selectable options. If defined, it must be greater than or equal to 2.
     * If both "minSelected" and "maxSelected" are defined, "minSelected" must be less than or equal to "maxSelected".
     * To require an exact number of options to be selected, set "minSelected" and "maxSelected" to the same value.
     * To require at least one item to be selected, use "isRequired." To require exactly one item to be selected,
     * use "RichRadioSet." If not required, a value of null will validate to "valid" even if "minSelected" is set.
     * @ojmetadata description "The minimal number of items to select. If defined, it must be greater than or equal to 2."
     * @ojmetadata displayName "Min Selected"
     */
    minSelected?: number;
    /**
     * @description
     * <p>
     * Whether the component is readonly. The readonly property sets or returns whether an element
     * is readonly, or not. A readonly element cannot be modified. However, a user can tab to it,
     * highlight it, focus on it, and copy the text from it. If you want to prevent the user from
     * interacting with the element, use the disabled property instead.
     * </p>
     * <p>
     * If the property value is not set either directly on the component or inherited from
     * a parent form layout, then the property is treated as if its value were false.
     * </p>
     *
     * @ojmetadata description "Whether the component is readonly"
     * @ojmetadata displayName "Readonly"
     */
    readonly?: boolean;
    /**
     * @description
     * <p>
     * Specifies which user assistance types should be shown when the component is readonly.
     * </p>
     *
     * @ojmetadata description "Specifies which user assistance types should be shown when the component is readonly."
     * @ojmetadata displayName "ReadonlyUserAssistanceShown"
     * @ojmetadata help "#readonlyUserAssistanceShown"
     */
    readonlyUserAssistanceShown?: 'confirmationAndInfoMessages' | 'none';
    /**
     * @description
     * <p>
     * This property set to <code class="prettyprint">false</code> implies that a value is not required to be provided by the user.
     * This is the default.
     * This property set to <code class="prettyprint">true</code> implies that a value is required to be provided by the user.
     * </p>
     * <p>
     * In the Redwood theme, by default, a Required text is rendered inline when the field is empty.
     * </p>
     * <p>The Required error text is based on Redwood UX designs, and it is not recommended that
     * it be changed.
     * To override the required error message,
     * use the <code class="prettyprint">required-message-detail</code> attribute.
     * The component's label text is passed in as a token {label} and can be used in the message detail.
     * </p>
     * <p>When required is set to true, an implicit
     * required validator is created, i.e.,
     * <code class="prettyprint">new RequiredValidator()</code>. The required validator is the only
     * validator to run during initial render, and its error is not shown to the user at this time;
     * this is called deferred validation. The required validator also runs during normal validation;
     * this is when the errors are shown to the user.
     * See the <a href="#validation-section">Validation and Messaging</a> section for details.
     * </p>
     * <p>
     * When the <code class="prettyprint">required</code> property changes due to programmatic intervention,
     * the component may clear component messages and run validation, based on the current state it's in. </br>
     *
     * <h4>Running Validation when required property changes</h4>
     * <ul>
     * <li>if component is valid when required is set to true, then it runs deferred validation on
     * the value property. If the field is empty, the valid state is invalidHidden. No errors are
     * shown to the user.
     * </li>
     * <li>if component is valid when required is set from true to false, then no validation is run.
     * </li>
     * <li>if component is invalid and has deferred messages (invalidHidden) when required is set to false, then
     * component messages are cleared (messages-custom messages are not cleared)
     * but no deferred validation is run because required is false.
     * </li>
     * <li>if component is invalid and currently showing invalid messages (invalidShown) when required is changed
     * to either true or false, then
     * component messages are cleared and normal validation is run using the current display value.
     * <ul>
     * <li>if there are validation errors, then <code class="prettyprint">value</code>
     * property is not updated and the error is shown.
     * </li>
     * <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     * property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
     * event on the component to clear custom errors.</li>
     * </ul>
     * </li>
     * </ul>
     *
     * <h4>Clearing Messages when required property changes</h4>
     * <ul>
     * <li>Only messages created by the component, like validation messages, are cleared when the required property changes.</li>
     * <li><code class="prettyprint">messagesCustom</code> property is not cleared.</li>
     * </ul>
     *
     * </p>
     *
     * @ojmetadata description "Specifies whether or not the component is required."
     * @ojmetadata displayName "Required"
     * @ojmetadata help "#required"
     */
    required?: boolean;
    /**
     * @description
     * <p>
     * A callback function that returns a component-specific message detail when the exact selection validation fails when a user's input is not the exact amount.
     * If the component needs an exact selection error message that is different from the default, set this property.
     * The function should return a translated string.
     * </p>
     * Usage: <br/>
     * selectionExactMessageDetail = (p: {exact: number }) => `Select {exact} values.`<br/>
     * selectionExactMessageDetail = () => `Select exactly five values.`
     *
     * @ojmetadata description "Overrides the default Selection Exact message."
     * @ojmetadata displayName "Selection Exact Message Detail"
     * @ojmetadata help "#selectionExactMessageDetail"
     * @ojmetadata translatable
     */
    selectionExactMessageDetail?: (p: ExactMessageDetailParameters) => string;
    /**
     * @description
     * <p>
     * A callback function that returns a component-specific message detail when the rich checkboxset validation fails when a user's input is greater than the max.
     * If the component needs an overflow selection error message that is different from the default, set this property.
     * The function should return a translated string.
     * </p>
     * Usage: <br/>
     * selectionOverflowMessageDetail = (p: {max: number }) => `You’ve reached the {max}-selection limit.`<br/>
     * selectionOverflowMessageDetail = () => `You’ve reached the limit.`
     *
     * @ojmetadata description "Overrides the default Selection Overflow message."
     * @ojmetadata displayName "Selection Overflow Message Detail"
     * @ojmetadata help "#selectionOverflowMessageDetail"
     * @ojmetadata translatable
     */
    selectionOverflowMessageDetail?: (p: OverflowMessageDetailParameters) => string;
    /**
     * @description
     * <p>
     * A callback function that returns a component-specific message detail when the range selection validation fails when a user's input is not within the range amount.
     * If the component needs a range selection error message that is different from the default, set this property.
     * The function should return a translated string.
     * </p>
     * Usage: <br/>
     * selectionRangeMessageDetail = (p: {min: number, max: number }) => `Select {min} to {max} values.`<br/>
     * selectionRangeMessageDetail = () => `Select between two to three values.`
     * @ojmetadata description "Overrides the default Selection Range message."
     * @ojmetadata displayName "Selection Range Message Detail"
     * @ojmetadata help "#selectionRangeMessageDetail"
     * @ojmetadata translatable
     */
    selectionRangeMessageDetail?: (p: RangeMessageDetailParameters) => string;
    /**
     * @description
     * <p>
     * A callback function that returns a component-specific message detail when the underflow selection validation fails when a user's input is less than the min.
     * If the component needs an underflow selection error message that is different from the default, set this property.
     * The function should return a translated string.
     * </p>
     * Usage: <br/>
     * selectionUnderflowMessageDetail = (p: {min: number }) => `Select at least {min} values.`<br/>
     * selectionUnderflowMessageDetail = () => `Select a minimum of three values.`
     *
     * @ojmetadata description "Overrides the default Selection Underflow message."
     * @ojmetadata displayName "Selection Underflow Message Detail"
     * @ojmetadata help "#selectionUnderflowMessageDetail"
     * @ojmetadata translatable
     */
    selectionUnderflowMessageDetail?: (p: UnderflowMessageDetailParameters) => string;
    /**
     * @description
     * <p>
     * Specifies the density of the form component's user assistance presentation. It can be shown inline with
     * reserved rows to prevent reflow if a user assistance text shows up, inline without reserved rows that would
     * reflow if a user assistance text shows up, or it can be shown compactly in a popup instead.
     * </p>
     * <p>
     * If the property value is not set either directly on the component or inherited from
     * a parent form layout, then the property is treated as if its value were "reflow".
     * </p>
     *
     * @ojmetadata description "Specifies the density of the form component's user assistance presentation."
     * @ojmetadata displayName "User Assistance Density"
     * @ojmetadata help "#userAssistanceDensity"
     * @ojmetadata propertyEditorValues {
     * "reflow": {
     *   "description": "Help and hints are shown above the field. Messages and required are shown inline under the field with no reserved space.",
     *   "displayName": "Reflow"
     * },
     * "efficient": {
     *   "description": "Help and hints are shown above the field. Messages and required are shown inline under the field with reserved space.",
     *   "displayName": "Efficient"
     * },
     * "compact": {
     *   "description": "Help and hints are shown above the field. Messages and required are shown inline under the field with reserved space.",
     *   "displayName": "Compact"
     * }
     * }
     */
    userAssistanceDensity?: PreactRichCheckboxSetProps['userAssistanceDensity'];
    /**
     * @description
     * An array of data items that returns the option items for the Rich Checkboxset.
     *
     * @ojmetadata description "An array of data items that returns the option items for the Rich Checkboxset."
     * @ojmetadata displayName "Options"
     * @ojmetadata help "#options"
     */
    options: Array<RichSelectionItemData<V>>;
    /**
     * @description
     * <p>
     * The component-specific message detail when the required validation fails.
     * If the component needs a required validation error message that is different from the default,
     * set this property. It should be a translated string.
     * </p>
     *
     * @ojmetadata description "Overrides the default Required error message."
     * @ojmetadata displayName "Required Message Detail"
     * @ojmetadata help "#requiredMessageDetail"
     * @ojmetadata translatable
     */
    requiredMessageDetail?: string;
    /**
     * Writeback support for the messagesCustom property
     */
    onMessagesCustomChanged?: PropertyChanged<PreactRichCheckboxSetProps['messages']>;
    /**
     * @description
     * <p>
     * The current valid state of the component. It is evaluated on initial render.
     * It is re-evaluated
     * <ul>
     * <li>when messagesCustom is updated,
     * since messagesCustom can be added by the app developer any time.</li>
     * <li>when showMessages() is called. Since showMessages() moves the
     * hidden messages into messages shown,
     * if the valid state was "invalidHidden" then it would become "invalidShown".</li>
     * <li>when the required property has changed. If a component is empty and has required
     * set, the valid state may be "invalidHidden" (if no invalid messages are being shown as well).
     * If required property is removed, the valid state would change to "valid".</li>
     * </ul>
     * </p>
     * <p>
     *  Note: New valid states may be added to the list of valid values in future releases.
     *  Any new values will start with "invalid"
     *  if it is an invalid state, "pending" if it is pending state,
     *  and "valid" if it is a valid state.
     * </p>
     *
     * @ojmetadata description "Specifies whether the component is in a valid state"
     * @ojmetadata displayName "Valid"
     * @ojmetadata help "#valid"
     * @ojmetadata propertyEditorValues {
     * "valid": {
     *   "description": "The component is valid",
     *   "displayName": "Valid"
     * },
     * "pending": {
     *   "description": "The component is waiting for the validation state to be determined. The 'pending' state is set at the start of the convert/validate process.",
     *   "displayName": "Pending"
     * },
     * "invalidHidden": {
     *   "description": "The component has invalid messages hidden and no invalid messages showing. An invalid message is one with severity 'error'.",
     *   "displayName": "Invalid Hidden"
     * },
     * "invalidShown": {
     *   "description": "The component has invalid messages showing. An invalid message is one with severity 'error'.",
     *   "displayName": "Invalid Shown"
     * }
     * }
     */
    onValidChanged?: ReadOnlyPropertyChanged<ValidState>;
    /**
     * @ojmetadata description Writeback support for the value property
     * @ojmetadata displayName "Value"
     * @ojmetadata help "#value"
     */
    onValueChanged?: PropertyChanged<Array<V> | null>;
    /**
     * @description
     * The value of the component.
     *
     * <p>
     * When <code class="prettyprint">value</code> property changes due to programmatic
     * intervention, the component always clears all messages
     * including <code class="prettyprint">messagesCustom</code>, runs deferred validation, and
     * always refreshes UI display value.
     * </p>
     *
     * <p>
     * When the rich checkboxset is cleared and the value is committed, the <code class="prettyprint">value</code>
     * property is set to <code>null</code>.
     * </p>
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>component always runs deferred validation; the
     * <code class="prettyprint">valid</code> property is updated with the result.</li>
     * </ul>
     *
     * @ojmetadata description "The value of the component."
     * @ojmetadata displayName "Value"
     * @ojmetadata help "#value"
     */
    value?: Array<V> | null;
};
/**
 * This export corresponds to the RichCheckboxset Preact component. For the oj-c-rich-checkboxset custom element, import CRichCheckboxsetElement instead.
 */
declare const RichCheckboxset: <V extends string | number = string | number>(props: ExtendGlobalProps<RichCheckboxsetProps<V>> & {
    ref?: Ref<RichCheckboxsetHandle>;
}) => ComponentChildren;
export { RichCheckboxset };
export type { RichSelectionItemData, RichCheckboxsetProps };
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-rich-checkboxset custom element. For the RichCheckboxset Preact component, import RichCheckboxset instead.
 */
export interface CRichCheckboxsetElement<V extends string | number> extends JetElement<CRichCheckboxsetElementSettableProperties<V>>, CRichCheckboxsetElementSettableProperties<V> {
    /**
     * <p>
     * The current valid state of the component. It is evaluated on initial render.
     * It is re-evaluated
     * <ul>
     * <li>when messagesCustom is updated,
     * since messagesCustom can be added by the app developer any time.</li>
     * <li>when showMessages() is called. Since showMessages() moves the
     * hidden messages into messages shown,
     * if the valid state was "invalidHidden" then it would become "invalidShown".</li>
     * <li>when the required property has changed. If a component is empty and has required
     * set, the valid state may be "invalidHidden" (if no invalid messages are being shown as well).
     * If required property is removed, the valid state would change to "valid".</li>
     * </ul>
     * </p>
     * <p>
     *  Note: New valid states may be added to the list of valid values in future releases.
     *  Any new values will start with "invalid"
     *  if it is an invalid state, "pending" if it is pending state,
     *  and "valid" if it is a valid state.
     * </p>
     */
    readonly valid?: Parameters<Required<RichCheckboxsetProps<V>>['onValidChanged']>[0];
    addEventListener<T extends keyof CRichCheckboxsetElementEventMap<V>>(type: T, listener: (this: HTMLElement, ev: CRichCheckboxsetElementEventMap<V>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CRichCheckboxsetElementSettableProperties<V>>(property: T): CRichCheckboxsetElement<V>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CRichCheckboxsetElementSettableProperties<V>>(property: T, value: CRichCheckboxsetElementSettableProperties<V>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CRichCheckboxsetElementSettableProperties<V>>): void;
    setProperties(properties: CRichCheckboxsetElementSettablePropertiesLenient<V>): void;
    blur: () => void;
    focus: () => void;
    /**
     * Resets the component by clearing all messages as well as the <code class="prettyprint">messagesCustom</code>
     * attribute, and also resets the component instance's <code class="prettyprint">value</code> to its default.
     * Any user entered value will be erased.
     */
    reset: () => void;
    /**
     * Takes all deferred messages and shows them.
     * It then updates the valid property;
     * e.g., if the valid state was "invalidHidden" before showMessages(),
     * the valid state will become "invalidShown" after showMessages().
     * If there were no deferred messages this method simply returns.
     * While actively editing the component selections, the valid state may be "invalidHidden" until showMessages().
     */
    showMessages: () => void;
    /**
     * If enabled, validates the component's display value (or null if display value is empty) and updates the value
     * option by performing the following steps.
     * <ol>
     * <li>All messages are cleared, including custom messages added by the app.</li>
     * <li>
     *  At the end of validation if there are errors, the messages are shown.
     *  If there were no errors, then the value option is updated.
     * </li>
     * </ol>
     * <p>While actively editing the component selections, the valid state may be "invalidHidden" until validate() is called.
     * If the component is readonly or disabled, returns a Promise that resolves to 'valid'
     * without doing any validation.</p>
     */
    validate: () => Promise<'invalid' | 'valid'>;
}
export namespace CRichCheckboxsetElement {
    type columnSpanChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['columnSpan']>;
    type containerReadonlyChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['containerReadonly']>;
    type disabledChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['disabled']>;
    type displayOptionsChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['displayOptions']>;
    type helpChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['help']>;
    type helpHintsChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['helpHints']>;
    type labelEdgeChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['labelEdge']>;
    type labelHintChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['labelHint']>;
    type labelStartWidthChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['labelStartWidth']>;
    type layoutChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['layout']>;
    type maxSelectedChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['maxSelected']>;
    type messagesCustomChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['messagesCustom']>;
    type minSelectedChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['minSelected']>;
    type optionsChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['options']>;
    type readonlyChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['readonly']>;
    type readonlyUserAssistanceShownChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['readonlyUserAssistanceShown']>;
    type requiredChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['required']>;
    type requiredMessageDetailChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['requiredMessageDetail']>;
    type selectionExactMessageDetailChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['selectionExactMessageDetail']>;
    type selectionOverflowMessageDetailChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['selectionOverflowMessageDetail']>;
    type selectionRangeMessageDetailChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['selectionRangeMessageDetail']>;
    type selectionUnderflowMessageDetailChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['selectionUnderflowMessageDetail']>;
    type userAssistanceDensityChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['userAssistanceDensity']>;
    type validChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['valid']>;
    type valueChanged<V extends string | number> = JetElementCustomEventStrict<CRichCheckboxsetElement<V>['value']>;
}
export interface CRichCheckboxsetElementEventMap<V extends string | number> extends HTMLElementEventMap {
    'columnSpanChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['columnSpan']>;
    'containerReadonlyChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['containerReadonly']>;
    'disabledChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['disabled']>;
    'displayOptionsChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['displayOptions']>;
    'helpChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['help']>;
    'helpHintsChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['helpHints']>;
    'labelEdgeChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['labelEdge']>;
    'labelHintChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['labelHint']>;
    'labelStartWidthChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['labelStartWidth']>;
    'layoutChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['layout']>;
    'maxSelectedChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['maxSelected']>;
    'messagesCustomChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['messagesCustom']>;
    'minSelectedChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['minSelected']>;
    'optionsChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['options']>;
    'readonlyChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['readonly']>;
    'readonlyUserAssistanceShownChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['readonlyUserAssistanceShown']>;
    'requiredChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['required']>;
    'requiredMessageDetailChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['requiredMessageDetail']>;
    'selectionExactMessageDetailChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['selectionExactMessageDetail']>;
    'selectionOverflowMessageDetailChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['selectionOverflowMessageDetail']>;
    'selectionRangeMessageDetailChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['selectionRangeMessageDetail']>;
    'selectionUnderflowMessageDetailChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['selectionUnderflowMessageDetail']>;
    'userAssistanceDensityChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['userAssistanceDensity']>;
    'validChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['valid']>;
    'valueChanged': JetElementCustomEventStrict<CRichCheckboxsetElement<V>['value']>;
}
export interface CRichCheckboxsetElementSettableProperties<V extends string | number> extends JetSettableProperties {
    /**
     * Specifies how many columns this component should span.
     * This only takes effect when this component is a child of a form layout
     * that has direction 'row'.
     */
    columnSpan?: RichCheckboxsetProps<V>['columnSpan'];
    /**
     * Specifies whether an ancestor container, like oj-c-form-layout, is readonly.
     * This affects whether a readonly component renders in full or mixed readonly mode.
     */
    containerReadonly?: RichCheckboxsetProps<V>['containerReadonly'];
    /**
     * Whether the component is disabled. The default is false.
     *
     * <p>
     * When the <code class="prettyprint">disabled</code> property changes due to programmatic
     * intervention, the component may clear messages and run validation in some cases. </br>
     * <ul>
     * <li>when a required component is initialized as disabled
     * <code class="prettyprint">value="{{currentValue}}" required disabled</code>,
     * deferred validation is skipped.</li>
     * <li>when a disabled component is enabled,
     *  <ul>
     *  <li>if component is invalid and showing messages then all component messages are cleared,
     *  and full validation run using the display value.
     * <ul>
     *  <li>if there are validation errors, they are shown.</li>
     *  <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *  property is updated. Page authors can listen to the <code class="prettyprint">valueChanged</code>
     *  event to clear custom errors.</li>
     * </ul>
     *  </li>
     *
     *  <li>if component is valid and has no errors then deferred validation is run.
     *  <ul>
     *  <li>if there is a deferred validation error, then the valid property is updated. </li>
     *  </ul>
     *  </li>
     *  <li>if component is invalid and deferred errors then component messages are cleared and
     *  deferred validation re-run.
     *  <ul>
     *  <li>if there is a deferred validation error, then the valid property is updated.</li>
     *  </ul>
     *  </li>
     *  </ul>
     * </li>
     * <li>when enabled component is disabled then no validation is run and the component appears
     * disabled.</li>
     * </ul>
     * </p>
     */
    disabled?: RichCheckboxsetProps<V>['disabled'];
    /**
     * Display options for auxiliary content that describes whether or not it should be displayed.
     */
    displayOptions?: RichCheckboxsetProps<V>['displayOptions'];
    /**
     * Form component help information.
     */
    help?: RichCheckboxsetProps<V>['help'];
    /**
     * The helpHints object contains a definition property, sourceText property, and a source property.
     */
    helpHints?: RichCheckboxsetProps<V>['helpHints'];
    /**
     * Specifies how the label of the component is positioned when the label-hint
     * attribute is set on the component.
     */
    labelEdge?: RichCheckboxsetProps<V>['labelEdge'];
    /**
     * Represents a hint for rendering a label on the component.
     * This is used in combination with the label-edge attribute to control how the label should be rendered.
     */
    labelHint: RichCheckboxsetProps<V>['labelHint'];
    /**
     * <p> The width of the label when labelEdge is 'start'.</p>
     * <p> This attribute accepts values of type
     * <code>0 | `var(${string})` | `--${string}` | `${number}%` | `${number}x` | `calc(${string})` | `${number}${CssUnits}</code></p>
     */
    labelStartWidth?: RichCheckboxsetProps<V>['labelStartWidth'];
    /**
     * Specifies the layout of the cards and media.
     */
    layout: RichCheckboxsetProps<V>['layout'];
    /**
     * Specifies the maximum number of selectable options. If defined, it must be greater than or equal to 2.
     * If both "maxSelected" and "minSelected" are defined, "maxSelected" must be greater than or equal to
     * "minSelected". To require an exact number of options to be selected, set "maxSelected" and "minSelected"
     * to the same value. To require exactly one or a maximum of one item, use "RichRadioSet.
     */
    maxSelected?: RichCheckboxsetProps<V>['maxSelected'];
    /**
     * List of messages an app would add to the component when it has business/custom validation
     * errors that it wants the component to show. This allows the app to perform further validation
     * before sending data to the server. When this option is set the message shows to the
     * user right away. To clear the custom message, set <code class="prettyprint">messagesCustom</code>
     * back to an empty array.<br/>
     * <p>
     * See the <a href="#validation-section">Validation and Messages</a> section
     * for details on when the component clears <code class="prettyprint">messagesCustom</code>;
     * for example, when full validation is run.
     * </p>
     */
    messagesCustom?: RichCheckboxsetProps<V>['messagesCustom'];
    /**
     * Specifies the minimum number of selectable options. If defined, it must be greater than or equal to 2.
     * If both "minSelected" and "maxSelected" are defined, "minSelected" must be less than or equal to "maxSelected".
     * To require an exact number of options to be selected, set "minSelected" and "maxSelected" to the same value.
     * To require at least one item to be selected, use "isRequired." To require exactly one item to be selected,
     * use "RichRadioSet." If not required, a value of null will validate to "valid" even if "minSelected" is set.
     */
    minSelected?: RichCheckboxsetProps<V>['minSelected'];
    /**
     * An array of data items that returns the option items for the Rich Checkboxset.
     */
    options: RichCheckboxsetProps<V>['options'];
    /**
     * <p>
     * Whether the component is readonly. The readonly property sets or returns whether an element
     * is readonly, or not. A readonly element cannot be modified. However, a user can tab to it,
     * highlight it, focus on it, and copy the text from it. If you want to prevent the user from
     * interacting with the element, use the disabled property instead.
     * </p>
     * <p>
     * If the property value is not set either directly on the component or inherited from
     * a parent form layout, then the property is treated as if its value were false.
     * </p>
     */
    readonly?: RichCheckboxsetProps<V>['readonly'];
    /**
     * <p>
     * Specifies which user assistance types should be shown when the component is readonly.
     * </p>
     */
    readonlyUserAssistanceShown?: RichCheckboxsetProps<V>['readonlyUserAssistanceShown'];
    /**
     * <p>
     * This property set to <code class="prettyprint">false</code> implies that a value is not required to be provided by the user.
     * This is the default.
     * This property set to <code class="prettyprint">true</code> implies that a value is required to be provided by the user.
     * </p>
     * <p>
     * In the Redwood theme, by default, a Required text is rendered inline when the field is empty.
     * </p>
     * <p>The Required error text is based on Redwood UX designs, and it is not recommended that
     * it be changed.
     * To override the required error message,
     * use the <code class="prettyprint">required-message-detail</code> attribute.
     * The component's label text is passed in as a token {label} and can be used in the message detail.
     * </p>
     * <p>When required is set to true, an implicit
     * required validator is created, i.e.,
     * <code class="prettyprint">new RequiredValidator()</code>. The required validator is the only
     * validator to run during initial render, and its error is not shown to the user at this time;
     * this is called deferred validation. The required validator also runs during normal validation;
     * this is when the errors are shown to the user.
     * See the <a href="#validation-section">Validation and Messaging</a> section for details.
     * </p>
     * <p>
     * When the <code class="prettyprint">required</code> property changes due to programmatic intervention,
     * the component may clear component messages and run validation, based on the current state it's in. </br>
     *
     * <h4>Running Validation when required property changes</h4>
     * <ul>
     * <li>if component is valid when required is set to true, then it runs deferred validation on
     * the value property. If the field is empty, the valid state is invalidHidden. No errors are
     * shown to the user.
     * </li>
     * <li>if component is valid when required is set from true to false, then no validation is run.
     * </li>
     * <li>if component is invalid and has deferred messages (invalidHidden) when required is set to false, then
     * component messages are cleared (messages-custom messages are not cleared)
     * but no deferred validation is run because required is false.
     * </li>
     * <li>if component is invalid and currently showing invalid messages (invalidShown) when required is changed
     * to either true or false, then
     * component messages are cleared and normal validation is run using the current display value.
     * <ul>
     * <li>if there are validation errors, then <code class="prettyprint">value</code>
     * property is not updated and the error is shown.
     * </li>
     * <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     * property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
     * event on the component to clear custom errors.</li>
     * </ul>
     * </li>
     * </ul>
     *
     * <h4>Clearing Messages when required property changes</h4>
     * <ul>
     * <li>Only messages created by the component, like validation messages, are cleared when the required property changes.</li>
     * <li><code class="prettyprint">messagesCustom</code> property is not cleared.</li>
     * </ul>
     *
     * </p>
     */
    required?: RichCheckboxsetProps<V>['required'];
    /**
     * <p>
     * The component-specific message detail when the required validation fails.
     * If the component needs a required validation error message that is different from the default,
     * set this property. It should be a translated string.
     * </p>
     */
    requiredMessageDetail?: RichCheckboxsetProps<V>['requiredMessageDetail'];
    /**
     * <p>
     * A callback function that returns a component-specific message detail when the exact selection validation fails when a user's input is not the exact amount.
     * If the component needs an exact selection error message that is different from the default, set this property.
     * The function should return a translated string.
     * </p>
     * Usage: <br/>
     * selectionExactMessageDetail = (p: {exact: number }) => `Select {exact} values.`<br/>
     * selectionExactMessageDetail = () => `Select exactly five values.`
     */
    selectionExactMessageDetail?: RichCheckboxsetProps<V>['selectionExactMessageDetail'];
    /**
     * <p>
     * A callback function that returns a component-specific message detail when the rich checkboxset validation fails when a user's input is greater than the max.
     * If the component needs an overflow selection error message that is different from the default, set this property.
     * The function should return a translated string.
     * </p>
     * Usage: <br/>
     * selectionOverflowMessageDetail = (p: {max: number }) => `You’ve reached the {max}-selection limit.`<br/>
     * selectionOverflowMessageDetail = () => `You’ve reached the limit.`
     */
    selectionOverflowMessageDetail?: RichCheckboxsetProps<V>['selectionOverflowMessageDetail'];
    /**
     * <p>
     * A callback function that returns a component-specific message detail when the range selection validation fails when a user's input is not within the range amount.
     * If the component needs a range selection error message that is different from the default, set this property.
     * The function should return a translated string.
     * </p>
     * Usage: <br/>
     * selectionRangeMessageDetail = (p: {min: number, max: number }) => `Select {min} to {max} values.`<br/>
     * selectionRangeMessageDetail = () => `Select between two to three values.`
     */
    selectionRangeMessageDetail?: RichCheckboxsetProps<V>['selectionRangeMessageDetail'];
    /**
     * <p>
     * A callback function that returns a component-specific message detail when the underflow selection validation fails when a user's input is less than the min.
     * If the component needs an underflow selection error message that is different from the default, set this property.
     * The function should return a translated string.
     * </p>
     * Usage: <br/>
     * selectionUnderflowMessageDetail = (p: {min: number }) => `Select at least {min} values.`<br/>
     * selectionUnderflowMessageDetail = () => `Select a minimum of three values.`
     */
    selectionUnderflowMessageDetail?: RichCheckboxsetProps<V>['selectionUnderflowMessageDetail'];
    /**
     * <p>
     * Specifies the density of the form component's user assistance presentation. It can be shown inline with
     * reserved rows to prevent reflow if a user assistance text shows up, inline without reserved rows that would
     * reflow if a user assistance text shows up, or it can be shown compactly in a popup instead.
     * </p>
     * <p>
     * If the property value is not set either directly on the component or inherited from
     * a parent form layout, then the property is treated as if its value were "reflow".
     * </p>
     */
    userAssistanceDensity?: RichCheckboxsetProps<V>['userAssistanceDensity'];
    /**
     * The value of the component.
     *
     * <p>
     * When <code class="prettyprint">value</code> property changes due to programmatic
     * intervention, the component always clears all messages
     * including <code class="prettyprint">messagesCustom</code>, runs deferred validation, and
     * always refreshes UI display value.
     * </p>
     *
     * <p>
     * When the rich checkboxset is cleared and the value is committed, the <code class="prettyprint">value</code>
     * property is set to <code>null</code>.
     * </p>
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>component always runs deferred validation; the
     * <code class="prettyprint">valid</code> property is updated with the result.</li>
     * </ul>
     */
    value?: RichCheckboxsetProps<V>['value'];
}
export interface CRichCheckboxsetElementSettablePropertiesLenient<V extends string | number> extends Partial<CRichCheckboxsetElementSettableProperties<V>> {
    [key: string]: any;
}
export interface RichCheckboxsetIntrinsicProps extends Partial<Readonly<CRichCheckboxsetElementSettableProperties<any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    valid?: never;
    oncolumnSpanChanged?: (value: CRichCheckboxsetElementEventMap<any>['columnSpanChanged']) => void;
    oncontainerReadonlyChanged?: (value: CRichCheckboxsetElementEventMap<any>['containerReadonlyChanged']) => void;
    ondisabledChanged?: (value: CRichCheckboxsetElementEventMap<any>['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: CRichCheckboxsetElementEventMap<any>['displayOptionsChanged']) => void;
    onhelpChanged?: (value: CRichCheckboxsetElementEventMap<any>['helpChanged']) => void;
    onhelpHintsChanged?: (value: CRichCheckboxsetElementEventMap<any>['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: CRichCheckboxsetElementEventMap<any>['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: CRichCheckboxsetElementEventMap<any>['labelHintChanged']) => void;
    onlabelStartWidthChanged?: (value: CRichCheckboxsetElementEventMap<any>['labelStartWidthChanged']) => void;
    onlayoutChanged?: (value: CRichCheckboxsetElementEventMap<any>['layoutChanged']) => void;
    onmaxSelectedChanged?: (value: CRichCheckboxsetElementEventMap<any>['maxSelectedChanged']) => void;
    onmessagesCustomChanged?: (value: CRichCheckboxsetElementEventMap<any>['messagesCustomChanged']) => void;
    onminSelectedChanged?: (value: CRichCheckboxsetElementEventMap<any>['minSelectedChanged']) => void;
    onoptionsChanged?: (value: CRichCheckboxsetElementEventMap<any>['optionsChanged']) => void;
    onreadonlyChanged?: (value: CRichCheckboxsetElementEventMap<any>['readonlyChanged']) => void;
    onreadonlyUserAssistanceShownChanged?: (value: CRichCheckboxsetElementEventMap<any>['readonlyUserAssistanceShownChanged']) => void;
    onrequiredChanged?: (value: CRichCheckboxsetElementEventMap<any>['requiredChanged']) => void;
    onrequiredMessageDetailChanged?: (value: CRichCheckboxsetElementEventMap<any>['requiredMessageDetailChanged']) => void;
    onselectionExactMessageDetailChanged?: (value: CRichCheckboxsetElementEventMap<any>['selectionExactMessageDetailChanged']) => void;
    onselectionOverflowMessageDetailChanged?: (value: CRichCheckboxsetElementEventMap<any>['selectionOverflowMessageDetailChanged']) => void;
    onselectionRangeMessageDetailChanged?: (value: CRichCheckboxsetElementEventMap<any>['selectionRangeMessageDetailChanged']) => void;
    onselectionUnderflowMessageDetailChanged?: (value: CRichCheckboxsetElementEventMap<any>['selectionUnderflowMessageDetailChanged']) => void;
    onuserAssistanceDensityChanged?: (value: CRichCheckboxsetElementEventMap<any>['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: CRichCheckboxsetElementEventMap<any>['validChanged']) => void;
    onvalueChanged?: (value: CRichCheckboxsetElementEventMap<any>['valueChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-rich-checkboxset': RichCheckboxsetIntrinsicProps;
        }
    }
}
