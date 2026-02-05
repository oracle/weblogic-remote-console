import { ComponentProps, Ref, ComponentChildren } from 'preact';
import { LayoutColumnSpan } from '@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout';
import { ExtendGlobalProps, ObservedGlobalProps, PropertyChanged, ReadOnlyPropertyChanged } from 'ojs/ojvcomponent';
import { DataProvider } from 'ojs/ojdataprovider';
import { CheckboxSet as PreactCheckboxSet } from '@oracle/oraclejet-preact/UNSAFE_CheckboxSet';
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
import { DisplayOptions, Help, HelpHints } from 'oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText';
import 'css!oj-c/checkboxset/checkboxset-styles.css';
type ValidState = 'valid' | 'pending' | 'invalidHidden' | 'invalidShown';
type PreactCheckboxSetProps = ComponentProps<typeof PreactCheckboxSet>;
/**
 * Display options for auxiliary content that determines whether or not it should be displayed.
 */
type DisplayOptionsProps = Pick<DisplayOptions, 'messages'>;
type CheckboxsetHandle = {
    /**
     * @ojmetadata description "Blurs the checkboxset."
     * @ignore
     */
    blur: () => void;
    /**
     * @ojmetadata description "Sets focus on the first tabbable checkbox."
     * @ignore
     */
    focus: () => void;
    /**
     * Takes all deferred messages and shows them.
     * It then updates the valid property;
     * e.g., if the valid state was "invalidHidden" before showMessages(),
     * the valid state will become "invalidShown" after showMessages().
     * If there were no deferred messages this method simply returns.
     * @ojmetadata description "Takes all deferred messages and shows them."
     */
    showMessages: () => void;
    /**
     * Resets the component by clearing all messages and messagesCustom attribute and
     * updates the component's display value using the attribute value. User entered
     * value will be erased when this method is called.
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
     * <p>If the component is readonly or disabled, returns a Promise that resolves to 'valid'
     * without doing any validation.</p>
     * @returns The Promise resolves to "valid" if the component is disabled or readonly.
     *    The Promise resolves to "invalid" if there were errors.
     * @ojmetadata description "If enabled, validates the component's display value."
     */
    validate: () => Promise<'valid' | 'invalid'>;
};
/**
 * An object that represents the value and corresponding data associated with a checkbox in the rendered checkboxset.
 * The label property is required and provides the text for the checkbox.
 */
type CheckboxsetArrayDataItem<V extends string | number> = CheckboxsetDataItem & {
    value: V;
};
/**
 * An object that represents the data associated with a checkbox in the rendered checkboxset. The label property is required and
 * provides the text for the checkbox.
 */
type CheckboxsetDataItem = {
    /**
     * @description
     * The value of this required property will provide the text for the checkbox's label.
     */
    label: string;
    /**
     * @description
     * Optional value to provide guidance to the user about the checkbox this applies to.
     */
    assistiveText?: string;
    /**
     * @description
     * Optional link to aid the user in the checkbox this applies to.
     */
    helpSourceLink?: string;
    /**
     * @description
     * Optional custom text to be rendered for the <code>helpSourceLink</code>.
     */
    helpSourceText?: string;
};
type CheckboxsetProps<V extends string | number, D extends CheckboxsetDataItem> = ObservedGlobalProps<'aria-describedby' | 'id'> & {
    /**
     * @description
     * Specifies whether an ancestor container, like oj-c-form-layout, is readonly.
     * This affects whether a readonly component renders in full or mixed readonly mode.
     * @ojmetadata description "Specifies whether an ancestor container, like oj-form-layout, is readonly."
     * @ojmetadata displayName "Container Readonly"
     * @ojmetadata help "#containerReadonly"
     */
    containerReadonly?: boolean;
    /**
     * @description
     * Specifies how many columns this component should span.
     * This only takes effect when this component is a child of a form layout
     * that has direction 'row'.
     *
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
     *
     * @ojmetadata description "Specifies whether the component is disabled."
     * @ojmetadata displayName "Disabled"
     * @ojmetadata help "#disabled"
     */
    disabled?: boolean;
    /**
     * @description
     * Layout direction of the checkbox elements.
     *
     * @ojmetadata description "Layout direction of the checkbox elements."
     * @ojmetadata displayName "Direction"
     * @ojmetadata help "#direction"
     */
    direction?: PreactCheckboxSetProps['direction'];
    /**
     * @description
     * Display options for auxiliary content that describes whether or not it should be displayed.
     *
     * @ojmetadata description "Display options for auxiliary content that describes whether or not it should be displayed."
     * @ojmetadata displayName "Display Options"
     * @ojmetadata help "#displayOptions"
     */
    displayOptions?: DisplayOptionsProps;
    /**
     * @description
     * Form component help information.
     *
     * @ojmetadata description "Form component help information."
     * @ojmetadata displayName "Help"
     * @ojmetadata help "#help"
     */
    help?: Help;
    /**
     * @description
     * The helpHints object contains a definition property, sourceText property, and a source property.
     *
     * @ojmetadata description "The helpHints object contains a definition property, sourceText property, and a source property."
     * @ojmetadata displayName "Help Hints"
     * @ojmetadata help "#helpHints"
     */
    helpHints?: HelpHints;
    /**
     * @description
     * Specifies how the label of the component is positioned when the label-hint
     * attribute is set on the component.
     *
     * @ojmetadata description "Specifies how the label is positioned for the component"
     * @ojmetadata displayName "Label Edge"
     * @ojmetadata help "#labelEdge"
     * @ojmetadata propertyEditorValues {
     * "inside": {
     *   "description": "The label will be placed on top of the checkboxset, but is smaller than 'top' option.",
     *   "displayName": "Inside"
     * },
     * "none": {
     *   "description": "The checkboxset will not create a label, but instead set the aria-label property on the checkboxset.",
     *   "displayName": "None"
     * },
     * "start": {
     *   "description": "The label will be placed before the start of the checkboxset.",
     *   "displayName": "Start"
     * },
     * "top": {
     *   "description": "The label will be placed on top of the checkboxset.",
     *   "displayName": "Top"
     * }
     * }
     */
    labelEdge?: PreactCheckboxSetProps['labelEdge'];
    /**
     * @description
     * Represents a hint for rendering a label on the component.
     * This is used in combination with the label-edge attribute to control how the label should be rendered.
     *
     * @ojmetadata description "Represents a hint for rendering a label on the component."
     * @ojmetadata displayName "Label Hint"
     * @ojmetadata help "#labelHint"
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
     * @ojmetadata help "#messagesCustom"
     */
    messagesCustom?: PreactCheckboxSetProps['messages'];
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
     * @ojmetadata help "#readonly"
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
    userAssistanceDensity?: PreactCheckboxSetProps['userAssistanceDensity'];
    /**
     * @description
     * An array of data items or a data provider that returns the option items for the Checkboxset.
     *
     * @ojmetadata description "An array of data items or a data provider that returns the option items for the Checkboxset."
     * @ojmetadata displayName "Options"
     * @ojmetadata help "#options"
     */
    options: Array<CheckboxsetArrayDataItem<V>> | DataProvider<V, D>;
    /**
     * @deprecated
     * @ojmetadata status [
     *   {
     *     type: "deprecated",
     *     since: "18.0.0",
     *     description: "Label truncation for 'start' and 'top' aligned labels is no longer recommended by the Redwood Design System. The default for labelWrapping was 'wrap' and that is now the only suggested pattern by UX design for 'start' and 'top' aligned labels. 'inside' aligned labels are always truncated per UX design and are not affected by this property's value."
     *   }
     * ]
     * @ojmetadata description "Should the labels wrap or truncate when there is not enough available space."
     * @ojmetadata displayName "Label Wrapping"
     * @ojmetadata help "#labelWrapping"
     * @ojmetadata propertyEditorValues {
     *  "truncate": {
     *    "description": "Label will truncate if needed.",
     *    "displayName": "Truncate"
     *  },
     *  "wrap": {
     *    "description": "Label will wrap if needed.",
     *    "displayName": "Wrap"
     *  }
     * }
     */
    labelWrapping?: 'truncate' | 'wrap';
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
    onMessagesCustomChanged?: PropertyChanged<PreactCheckboxSetProps['messages']>;
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
     * @ojmetadata description "Specifies how the valid state of the component"
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
    onValueChanged?: PropertyChanged<Array<V> | null | undefined>;
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
     * When the checkboxset is cleared and the value is committed, the <code class="prettyprint">value</code>
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
 * This export corresponds to the Checkboxset Preact component. For the oj-c-checkboxset custom element, import CCheckboxsetElement instead.
 */
declare const Checkboxset: <V extends string | number = string | number, D extends CheckboxsetDataItem = CheckboxsetDataItem>(props: ExtendGlobalProps<CheckboxsetProps<V, D>> & {
    ref?: Ref<CheckboxsetHandle>;
}) => ComponentChildren;
export { Checkboxset };
export type { CheckboxsetDataItem, CheckboxsetArrayDataItem, CheckboxsetProps };
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-checkboxset custom element. For the Checkboxset Preact component, import Checkboxset instead.
 */
export interface CCheckboxsetElement<V extends string | number, D extends CheckboxsetDataItem> extends JetElement<CCheckboxsetElementSettableProperties<V, D>>, CCheckboxsetElementSettableProperties<V, D> {
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
    readonly valid?: Parameters<Required<CheckboxsetProps<V, D>>['onValidChanged']>[0];
    addEventListener<T extends keyof CCheckboxsetElementEventMap<V, D>>(type: T, listener: (this: HTMLElement, ev: CCheckboxsetElementEventMap<V, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CCheckboxsetElementSettableProperties<V, D>>(property: T): CCheckboxsetElement<V, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CCheckboxsetElementSettableProperties<V, D>>(property: T, value: CCheckboxsetElementSettableProperties<V, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CCheckboxsetElementSettableProperties<V, D>>): void;
    setProperties(properties: CCheckboxsetElementSettablePropertiesLenient<V, D>): void;
    blur: () => void;
    focus: () => void;
    /**
     * Resets the component by clearing all messages and messagesCustom attribute and
     * updates the component's display value using the attribute value. User entered
     * value will be erased when this method is called.
     */
    reset: () => void;
    /**
     * Takes all deferred messages and shows them.
     * It then updates the valid property;
     * e.g., if the valid state was "invalidHidden" before showMessages(),
     * the valid state will become "invalidShown" after showMessages().
     * If there were no deferred messages this method simply returns.
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
     * <p>If the component is readonly or disabled, returns a Promise that resolves to 'valid'
     * without doing any validation.</p>
     */
    validate: () => Promise<'invalid' | 'valid'>;
}
export namespace CCheckboxsetElement {
    type columnSpanChanged<V extends string | number, D extends CheckboxsetDataItem> = JetElementCustomEventStrict<CCheckboxsetElement<V, D>['columnSpan']>;
    type containerReadonlyChanged<V extends string | number, D extends CheckboxsetDataItem> = JetElementCustomEventStrict<CCheckboxsetElement<V, D>['containerReadonly']>;
    type directionChanged<V extends string | number, D extends CheckboxsetDataItem> = JetElementCustomEventStrict<CCheckboxsetElement<V, D>['direction']>;
    type disabledChanged<V extends string | number, D extends CheckboxsetDataItem> = JetElementCustomEventStrict<CCheckboxsetElement<V, D>['disabled']>;
    type displayOptionsChanged<V extends string | number, D extends CheckboxsetDataItem> = JetElementCustomEventStrict<CCheckboxsetElement<V, D>['displayOptions']>;
    type helpChanged<V extends string | number, D extends CheckboxsetDataItem> = JetElementCustomEventStrict<CCheckboxsetElement<V, D>['help']>;
    type helpHintsChanged<V extends string | number, D extends CheckboxsetDataItem> = JetElementCustomEventStrict<CCheckboxsetElement<V, D>['helpHints']>;
    type labelEdgeChanged<V extends string | number, D extends CheckboxsetDataItem> = JetElementCustomEventStrict<CCheckboxsetElement<V, D>['labelEdge']>;
    type labelHintChanged<V extends string | number, D extends CheckboxsetDataItem> = JetElementCustomEventStrict<CCheckboxsetElement<V, D>['labelHint']>;
    type labelStartWidthChanged<V extends string | number, D extends CheckboxsetDataItem> = JetElementCustomEventStrict<CCheckboxsetElement<V, D>['labelStartWidth']>;
    type labelWrappingChanged<V extends string | number, D extends CheckboxsetDataItem> = JetElementCustomEventStrict<CCheckboxsetElement<V, D>['labelWrapping']>;
    type messagesCustomChanged<V extends string | number, D extends CheckboxsetDataItem> = JetElementCustomEventStrict<CCheckboxsetElement<V, D>['messagesCustom']>;
    type optionsChanged<V extends string | number, D extends CheckboxsetDataItem> = JetElementCustomEventStrict<CCheckboxsetElement<V, D>['options']>;
    type readonlyChanged<V extends string | number, D extends CheckboxsetDataItem> = JetElementCustomEventStrict<CCheckboxsetElement<V, D>['readonly']>;
    type readonlyUserAssistanceShownChanged<V extends string | number, D extends CheckboxsetDataItem> = JetElementCustomEventStrict<CCheckboxsetElement<V, D>['readonlyUserAssistanceShown']>;
    type requiredChanged<V extends string | number, D extends CheckboxsetDataItem> = JetElementCustomEventStrict<CCheckboxsetElement<V, D>['required']>;
    type requiredMessageDetailChanged<V extends string | number, D extends CheckboxsetDataItem> = JetElementCustomEventStrict<CCheckboxsetElement<V, D>['requiredMessageDetail']>;
    type userAssistanceDensityChanged<V extends string | number, D extends CheckboxsetDataItem> = JetElementCustomEventStrict<CCheckboxsetElement<V, D>['userAssistanceDensity']>;
    type validChanged<V extends string | number, D extends CheckboxsetDataItem> = JetElementCustomEventStrict<CCheckboxsetElement<V, D>['valid']>;
    type valueChanged<V extends string | number, D extends CheckboxsetDataItem> = JetElementCustomEventStrict<CCheckboxsetElement<V, D>['value']>;
}
export interface CCheckboxsetElementEventMap<V extends string | number, D extends CheckboxsetDataItem> extends HTMLElementEventMap {
    'columnSpanChanged': JetElementCustomEventStrict<CCheckboxsetElement<V, D>['columnSpan']>;
    'containerReadonlyChanged': JetElementCustomEventStrict<CCheckboxsetElement<V, D>['containerReadonly']>;
    'directionChanged': JetElementCustomEventStrict<CCheckboxsetElement<V, D>['direction']>;
    'disabledChanged': JetElementCustomEventStrict<CCheckboxsetElement<V, D>['disabled']>;
    'displayOptionsChanged': JetElementCustomEventStrict<CCheckboxsetElement<V, D>['displayOptions']>;
    'helpChanged': JetElementCustomEventStrict<CCheckboxsetElement<V, D>['help']>;
    'helpHintsChanged': JetElementCustomEventStrict<CCheckboxsetElement<V, D>['helpHints']>;
    'labelEdgeChanged': JetElementCustomEventStrict<CCheckboxsetElement<V, D>['labelEdge']>;
    'labelHintChanged': JetElementCustomEventStrict<CCheckboxsetElement<V, D>['labelHint']>;
    'labelStartWidthChanged': JetElementCustomEventStrict<CCheckboxsetElement<V, D>['labelStartWidth']>;
    'labelWrappingChanged': JetElementCustomEventStrict<CCheckboxsetElement<V, D>['labelWrapping']>;
    'messagesCustomChanged': JetElementCustomEventStrict<CCheckboxsetElement<V, D>['messagesCustom']>;
    'optionsChanged': JetElementCustomEventStrict<CCheckboxsetElement<V, D>['options']>;
    'readonlyChanged': JetElementCustomEventStrict<CCheckboxsetElement<V, D>['readonly']>;
    'readonlyUserAssistanceShownChanged': JetElementCustomEventStrict<CCheckboxsetElement<V, D>['readonlyUserAssistanceShown']>;
    'requiredChanged': JetElementCustomEventStrict<CCheckboxsetElement<V, D>['required']>;
    'requiredMessageDetailChanged': JetElementCustomEventStrict<CCheckboxsetElement<V, D>['requiredMessageDetail']>;
    'userAssistanceDensityChanged': JetElementCustomEventStrict<CCheckboxsetElement<V, D>['userAssistanceDensity']>;
    'validChanged': JetElementCustomEventStrict<CCheckboxsetElement<V, D>['valid']>;
    'valueChanged': JetElementCustomEventStrict<CCheckboxsetElement<V, D>['value']>;
}
export interface CCheckboxsetElementSettableProperties<V extends string | number, D extends CheckboxsetDataItem> extends JetSettableProperties {
    /**
     * Specifies how many columns this component should span.
     * This only takes effect when this component is a child of a form layout
     * that has direction 'row'.
     */
    columnSpan?: CheckboxsetProps<V, D>['columnSpan'];
    /**
     * Specifies whether an ancestor container, like oj-c-form-layout, is readonly.
     * This affects whether a readonly component renders in full or mixed readonly mode.
     */
    containerReadonly?: CheckboxsetProps<V, D>['containerReadonly'];
    /**
     * Layout direction of the checkbox elements.
     */
    direction?: CheckboxsetProps<V, D>['direction'];
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
    disabled?: CheckboxsetProps<V, D>['disabled'];
    /**
     * Display options for auxiliary content that describes whether or not it should be displayed.
     */
    displayOptions?: CheckboxsetProps<V, D>['displayOptions'];
    /**
     * Form component help information.
     */
    help?: CheckboxsetProps<V, D>['help'];
    /**
     * The helpHints object contains a definition property, sourceText property, and a source property.
     */
    helpHints?: CheckboxsetProps<V, D>['helpHints'];
    /**
     * Specifies how the label of the component is positioned when the label-hint
     * attribute is set on the component.
     */
    labelEdge?: CheckboxsetProps<V, D>['labelEdge'];
    /**
     * Represents a hint for rendering a label on the component.
     * This is used in combination with the label-edge attribute to control how the label should be rendered.
     */
    labelHint: CheckboxsetProps<V, D>['labelHint'];
    /**
     * <p> The width of the label when labelEdge is 'start'.</p>
     * <p> This attribute accepts values of type
     * <code>0 | `var(${string})` | `--${string}` | `${number}%` | `${number}x` | `calc(${string})` | `${number}${CssUnits}</code></p>
     */
    labelStartWidth?: CheckboxsetProps<V, D>['labelStartWidth'];
    /**
     * @deprecated since 18.0.0  - Label truncation for 'start' and 'top' aligned labels is no longer recommended by the Redwood Design System. The default for labelWrapping was 'wrap' and that is now the only suggested pattern by UX design for 'start' and 'top' aligned labels. 'inside' aligned labels are always truncated per UX design and are not affected by this property's value.
     */
    labelWrapping?: CheckboxsetProps<V, D>['labelWrapping'];
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
    messagesCustom?: CheckboxsetProps<V, D>['messagesCustom'];
    /**
     * An array of data items or a data provider that returns the option items for the Checkboxset.
     */
    options: CheckboxsetProps<V, D>['options'];
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
    readonly?: CheckboxsetProps<V, D>['readonly'];
    /**
     * <p>
     * Specifies which user assistance types should be shown when the component is readonly.
     * </p>
     */
    readonlyUserAssistanceShown?: CheckboxsetProps<V, D>['readonlyUserAssistanceShown'];
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
    required?: CheckboxsetProps<V, D>['required'];
    /**
     * <p>
     * The component-specific message detail when the required validation fails.
     * If the component needs a required validation error message that is different from the default,
     * set this property. It should be a translated string.
     * </p>
     */
    requiredMessageDetail?: CheckboxsetProps<V, D>['requiredMessageDetail'];
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
    userAssistanceDensity?: CheckboxsetProps<V, D>['userAssistanceDensity'];
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
     * When the checkboxset is cleared and the value is committed, the <code class="prettyprint">value</code>
     * property is set to <code>null</code>.
     * </p>
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>component always runs deferred validation; the
     * <code class="prettyprint">valid</code> property is updated with the result.</li>
     * </ul>
     */
    value?: CheckboxsetProps<V, D>['value'];
}
export interface CCheckboxsetElementSettablePropertiesLenient<V extends string | number, D extends CheckboxsetDataItem> extends Partial<CCheckboxsetElementSettableProperties<V, D>> {
    [key: string]: any;
}
export interface CheckboxsetIntrinsicProps extends Partial<Readonly<CCheckboxsetElementSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    valid?: never;
    oncolumnSpanChanged?: (value: CCheckboxsetElementEventMap<any, any>['columnSpanChanged']) => void;
    oncontainerReadonlyChanged?: (value: CCheckboxsetElementEventMap<any, any>['containerReadonlyChanged']) => void;
    ondirectionChanged?: (value: CCheckboxsetElementEventMap<any, any>['directionChanged']) => void;
    ondisabledChanged?: (value: CCheckboxsetElementEventMap<any, any>['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: CCheckboxsetElementEventMap<any, any>['displayOptionsChanged']) => void;
    onhelpChanged?: (value: CCheckboxsetElementEventMap<any, any>['helpChanged']) => void;
    onhelpHintsChanged?: (value: CCheckboxsetElementEventMap<any, any>['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: CCheckboxsetElementEventMap<any, any>['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: CCheckboxsetElementEventMap<any, any>['labelHintChanged']) => void;
    onlabelStartWidthChanged?: (value: CCheckboxsetElementEventMap<any, any>['labelStartWidthChanged']) => void;
    /** @deprecated since 18.0.0 */ onlabelWrappingChanged?: (value: CCheckboxsetElementEventMap<any, any>['labelWrappingChanged']) => void;
    onmessagesCustomChanged?: (value: CCheckboxsetElementEventMap<any, any>['messagesCustomChanged']) => void;
    onoptionsChanged?: (value: CCheckboxsetElementEventMap<any, any>['optionsChanged']) => void;
    onreadonlyChanged?: (value: CCheckboxsetElementEventMap<any, any>['readonlyChanged']) => void;
    onreadonlyUserAssistanceShownChanged?: (value: CCheckboxsetElementEventMap<any, any>['readonlyUserAssistanceShownChanged']) => void;
    onrequiredChanged?: (value: CCheckboxsetElementEventMap<any, any>['requiredChanged']) => void;
    onrequiredMessageDetailChanged?: (value: CCheckboxsetElementEventMap<any, any>['requiredMessageDetailChanged']) => void;
    onuserAssistanceDensityChanged?: (value: CCheckboxsetElementEventMap<any, any>['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: CCheckboxsetElementEventMap<any, any>['validChanged']) => void;
    onvalueChanged?: (value: CCheckboxsetElementEventMap<any, any>['valueChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-checkboxset': CheckboxsetIntrinsicProps;
        }
    }
}
