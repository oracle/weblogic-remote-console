import { ComponentType, ComponentProps, ComponentChildren, Ref } from 'preact';
import { ExtendGlobalProps, ObservedGlobalProps, PropertyChanged, ReadOnlyPropertyChanged } from 'ojs/ojvcomponent';
import { Checkbox as PreactCheckbox } from '@oracle/oraclejet-preact/UNSAFE_Checkbox';
import { LayoutColumnSpan } from '@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout';
import { DisplayOptions, Help, HelpHints } from 'oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText';
import 'css!oj-c/checkbox/checkbox-styles.css';
type ValidState = 'valid' | 'pending' | 'invalidHidden' | 'invalidShown';
type PreactCheckboxProps = ComponentProps<typeof PreactCheckbox>;
/**
 * Display options for auxiliary content that determines whether or not it should be displayed.
 */
type DisplayOptionsProps = Pick<DisplayOptions, 'messages'>;
type CheckboxHandle = {
    /**
     * @ojmetadata description "Blurs the input field."
     * @ignore
     */
    blur: () => void;
    /**
     * @ojmetadata description "Focuses the input field."
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
     * Resets the component by clearing all messages and messagesCustom attribute
     * and updates the component's display value using the attribute value.
     * User entered value will be erased when this method is called.
     * @ojmetadata description "Resets the component by clearing all messages."
     */
    reset: () => void;
    /**
     * If enabled, validates the component's display value (or undefined if display value is empty) and updates the value
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
     *          The Promise resolves to "invalid" if there were errors.
     * @ojmetadata description "If enabled, validates the component's display value."
     */
    validate: () => Promise<'valid' | 'invalid'>;
};
type CheckboxProps = ObservedGlobalProps<'aria-describedby' | 'id'> & {
    /**
     * @ojmetadata description "The default slot is the content associated with the checkbox. This can be a label or a block of text."
     * @ojmetadata displayName "Default"
     * @ojmetadata help "#default"
     */
    children: ComponentChildren;
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
     *   <ul>
     *    <li>if there are validation errors, they are shown.</li>
     *    <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *    property is updated. Page authors can listen to the <code class="prettyprint">valueChanged</code>
     *    event to clear custom errors.</li>
     *   </ul>
     *  </li>
     *
     *  <li>if component is valid and has no errors then deferred validation is run.
     *    <ul>
     *    <li>if there is a deferred validation error, then the valid property is updated. </li>
     *    </ul>
     *  </li>
     *  <li>if component is invalid and deferred errors then component messages are cleared and
     *  deferred validation re-run.
     *    <ul>
     *    <li>if there is a deferred validation error, then the valid property is updated.</li>
     *    </ul>
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
    messagesCustom?: PreactCheckboxProps['messages'];
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
     *   <li>if there are validation errors, then <code class="prettyprint">value</code>
     *   property is not updated and the error is shown.
     *   </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
     *   event on the component to clear custom errors.</li>
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
     *   "reflow": {
     *     "description": "Messages and required are shown inline under the field with no reserved space. Help & hints will appear in a popup with a help icon.",
     *     "displayName": "Reflow"
     *   },
     *   "efficient": {
     *     "description": "Messages and required are shown inline under the field with reserved space. Help & hints will appear in a popup with a help icon.",
     *     "displayName": "Efficient"
     *   },
     *   "compact": {
     *     "description": "Messages and required are shown inline under the field with reserved space. Help & hints will appear in a popup with a help icon.",
     *     "displayName": "Compact"
     *   }
     * }
     */
    userAssistanceDensity?: PreactCheckboxProps['userAssistanceDensity'];
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
    onMessagesCustomChanged?: PropertyChanged<PreactCheckboxProps['messages']>;
    /**
     * @description
     * <p>
     * The current valid state of the component. It is evaluated on initial render.
     * It is re-evaluated
     * <ul>
     *   <li>when messagesCustom is updated,
     *   since messagesCustom can be added by the app developer any time.</li>
     *   <li>when showMessages() is called. Since showMessages() moves the
     *   hidden messages into messages shown,
     *   if the valid state was "invalidHidden" then it would become "invalidShown".</li>
     *   <li>when the required property has changed. If a component is empty and has required
     *   set, the valid state may be "invalidHidden" (if no invalid messages are being shown as well).
     *   If required property is removed, the valid state would change to "valid".</li>
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
     *   "valid": {
     *     "description": "The component is valid",
     *     "displayName": "Valid"
     *   },
     *   "pending": {
     *     "description": "The component is waiting for the validation state to be determined. The 'pending' state is set at the start of the convert/validate process.",
     *     "displayName": "Pending"
     *   },
     *   "invalidHidden": {
     *     "description": "The component has invalid messages hidden and no invalid messages showing. An invalid message is one with severity 'error'.",
     *     "displayName": "Invalid Hidden"
     *   },
     *   "invalidShown": {
     *     "description": "The component has invalid messages showing. An invalid message is one with severity 'error'.",
     *     "displayName": "Invalid Shown"
     *   }
     * }
     */
    onValidChanged?: ReadOnlyPropertyChanged<ValidState>;
    /**
     * @ojmetadata description Writeback support for the value property
     * @ojmetadata displayName "Value"
     * @ojmetadata help "#value"
     */
    onValueChanged?: PropertyChanged<boolean | undefined>;
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
     * When the checkbox is cleared and the value is committed, the <code class="prettyprint">value</code>
     * property is set to <code>false</code>.
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
    value?: boolean;
};
/**
 * This export corresponds to the Checkbox Preact component. For the oj-c-checkbox custom element, import CCheckboxElement instead.
 */
declare const Checkbox: ComponentType<ExtendGlobalProps<CheckboxProps> & {
    ref?: Ref<CheckboxHandle>;
}>;
export { Checkbox };
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-checkbox custom element. For the Checkbox Preact component, import Checkbox instead.
 */
export interface CCheckboxElement extends JetElement<CCheckboxElementSettableProperties>, CCheckboxElementSettableProperties {
    /**
     * <p>
     * The current valid state of the component. It is evaluated on initial render.
     * It is re-evaluated
     * <ul>
     *   <li>when messagesCustom is updated,
     *   since messagesCustom can be added by the app developer any time.</li>
     *   <li>when showMessages() is called. Since showMessages() moves the
     *   hidden messages into messages shown,
     *   if the valid state was "invalidHidden" then it would become "invalidShown".</li>
     *   <li>when the required property has changed. If a component is empty and has required
     *   set, the valid state may be "invalidHidden" (if no invalid messages are being shown as well).
     *   If required property is removed, the valid state would change to "valid".</li>
     * </ul>
     * </p>
     * <p>
     *  Note: New valid states may be added to the list of valid values in future releases.
     *  Any new values will start with "invalid"
     *  if it is an invalid state, "pending" if it is pending state,
     *  and "valid" if it is a valid state.
     * </p>
     */
    readonly valid?: Parameters<Required<CheckboxProps>['onValidChanged']>[0];
    addEventListener<T extends keyof CCheckboxElementEventMap>(type: T, listener: (this: HTMLElement, ev: CCheckboxElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CCheckboxElementSettableProperties>(property: T): CCheckboxElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CCheckboxElementSettableProperties>(property: T, value: CCheckboxElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CCheckboxElementSettableProperties>): void;
    setProperties(properties: CCheckboxElementSettablePropertiesLenient): void;
    blur: () => void;
    focus: () => void;
    /**
     * Resets the component by clearing all messages and messagesCustom attribute
     * and updates the component's display value using the attribute value.
     * User entered value will be erased when this method is called.
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
     * If enabled, validates the component's display value (or undefined if display value is empty) and updates the value
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
export namespace CCheckboxElement {
    type columnSpanChanged = JetElementCustomEventStrict<CCheckboxElement['columnSpan']>;
    type containerReadonlyChanged = JetElementCustomEventStrict<CCheckboxElement['containerReadonly']>;
    type disabledChanged = JetElementCustomEventStrict<CCheckboxElement['disabled']>;
    type displayOptionsChanged = JetElementCustomEventStrict<CCheckboxElement['displayOptions']>;
    type helpChanged = JetElementCustomEventStrict<CCheckboxElement['help']>;
    type helpHintsChanged = JetElementCustomEventStrict<CCheckboxElement['helpHints']>;
    type messagesCustomChanged = JetElementCustomEventStrict<CCheckboxElement['messagesCustom']>;
    type readonlyChanged = JetElementCustomEventStrict<CCheckboxElement['readonly']>;
    type readonlyUserAssistanceShownChanged = JetElementCustomEventStrict<CCheckboxElement['readonlyUserAssistanceShown']>;
    type requiredChanged = JetElementCustomEventStrict<CCheckboxElement['required']>;
    type requiredMessageDetailChanged = JetElementCustomEventStrict<CCheckboxElement['requiredMessageDetail']>;
    type userAssistanceDensityChanged = JetElementCustomEventStrict<CCheckboxElement['userAssistanceDensity']>;
    type validChanged = JetElementCustomEventStrict<CCheckboxElement['valid']>;
    type valueChanged = JetElementCustomEventStrict<CCheckboxElement['value']>;
}
export interface CCheckboxElementEventMap extends HTMLElementEventMap {
    'columnSpanChanged': JetElementCustomEventStrict<CCheckboxElement['columnSpan']>;
    'containerReadonlyChanged': JetElementCustomEventStrict<CCheckboxElement['containerReadonly']>;
    'disabledChanged': JetElementCustomEventStrict<CCheckboxElement['disabled']>;
    'displayOptionsChanged': JetElementCustomEventStrict<CCheckboxElement['displayOptions']>;
    'helpChanged': JetElementCustomEventStrict<CCheckboxElement['help']>;
    'helpHintsChanged': JetElementCustomEventStrict<CCheckboxElement['helpHints']>;
    'messagesCustomChanged': JetElementCustomEventStrict<CCheckboxElement['messagesCustom']>;
    'readonlyChanged': JetElementCustomEventStrict<CCheckboxElement['readonly']>;
    'readonlyUserAssistanceShownChanged': JetElementCustomEventStrict<CCheckboxElement['readonlyUserAssistanceShown']>;
    'requiredChanged': JetElementCustomEventStrict<CCheckboxElement['required']>;
    'requiredMessageDetailChanged': JetElementCustomEventStrict<CCheckboxElement['requiredMessageDetail']>;
    'userAssistanceDensityChanged': JetElementCustomEventStrict<CCheckboxElement['userAssistanceDensity']>;
    'validChanged': JetElementCustomEventStrict<CCheckboxElement['valid']>;
    'valueChanged': JetElementCustomEventStrict<CCheckboxElement['value']>;
}
export interface CCheckboxElementSettableProperties extends JetSettableProperties {
    /**
     * Specifies how many columns this component should span.
     * This only takes effect when this component is a child of a form layout
     * that has direction 'row'.
     */
    columnSpan?: CheckboxProps['columnSpan'];
    /**
     * Specifies whether an ancestor container, like oj-c-form-layout, is readonly.
     * This affects whether a readonly component renders in full or mixed readonly mode.
     */
    containerReadonly?: CheckboxProps['containerReadonly'];
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
     *   <ul>
     *    <li>if there are validation errors, they are shown.</li>
     *    <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *    property is updated. Page authors can listen to the <code class="prettyprint">valueChanged</code>
     *    event to clear custom errors.</li>
     *   </ul>
     *  </li>
     *
     *  <li>if component is valid and has no errors then deferred validation is run.
     *    <ul>
     *    <li>if there is a deferred validation error, then the valid property is updated. </li>
     *    </ul>
     *  </li>
     *  <li>if component is invalid and deferred errors then component messages are cleared and
     *  deferred validation re-run.
     *    <ul>
     *    <li>if there is a deferred validation error, then the valid property is updated.</li>
     *    </ul>
     *  </li>
     *  </ul>
     * </li>
     * <li>when enabled component is disabled then no validation is run and the component appears
     * disabled.</li>
     * </ul>
     * </p>
     */
    disabled?: CheckboxProps['disabled'];
    /**
     * Display options for auxiliary content that describes whether or not it should be displayed.
     */
    displayOptions?: CheckboxProps['displayOptions'];
    /**
     * Form component help information.
     */
    help?: CheckboxProps['help'];
    /**
     * The helpHints object contains a definition property, sourceText property, and a source property.
     */
    helpHints?: CheckboxProps['helpHints'];
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
    messagesCustom?: CheckboxProps['messagesCustom'];
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
    readonly?: CheckboxProps['readonly'];
    /**
     * <p>
     * Specifies which user assistance types should be shown when the component is readonly.
     * </p>
     */
    readonlyUserAssistanceShown?: CheckboxProps['readonlyUserAssistanceShown'];
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
     *   <li>if there are validation errors, then <code class="prettyprint">value</code>
     *   property is not updated and the error is shown.
     *   </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
     *   event on the component to clear custom errors.</li>
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
    required?: CheckboxProps['required'];
    /**
     * <p>
     * The component-specific message detail when the required validation fails.
     * If the component needs a required validation error message that is different from the default,
     * set this property. It should be a translated string.
     * </p>
     */
    requiredMessageDetail?: CheckboxProps['requiredMessageDetail'];
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
    userAssistanceDensity?: CheckboxProps['userAssistanceDensity'];
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
     * When the checkbox is cleared and the value is committed, the <code class="prettyprint">value</code>
     * property is set to <code>false</code>.
     * </p>
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>component always runs deferred validation; the
     * <code class="prettyprint">valid</code> property is updated with the result.</li>
     * </ul>
     */
    value?: CheckboxProps['value'];
}
export interface CCheckboxElementSettablePropertiesLenient extends Partial<CCheckboxElementSettableProperties> {
    [key: string]: any;
}
export interface CheckboxIntrinsicProps extends Partial<Readonly<CCheckboxElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    valid?: never;
    children?: import('preact').ComponentChildren;
    oncolumnSpanChanged?: (value: CCheckboxElementEventMap['columnSpanChanged']) => void;
    oncontainerReadonlyChanged?: (value: CCheckboxElementEventMap['containerReadonlyChanged']) => void;
    ondisabledChanged?: (value: CCheckboxElementEventMap['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: CCheckboxElementEventMap['displayOptionsChanged']) => void;
    onhelpChanged?: (value: CCheckboxElementEventMap['helpChanged']) => void;
    onhelpHintsChanged?: (value: CCheckboxElementEventMap['helpHintsChanged']) => void;
    onmessagesCustomChanged?: (value: CCheckboxElementEventMap['messagesCustomChanged']) => void;
    onreadonlyChanged?: (value: CCheckboxElementEventMap['readonlyChanged']) => void;
    onreadonlyUserAssistanceShownChanged?: (value: CCheckboxElementEventMap['readonlyUserAssistanceShownChanged']) => void;
    onrequiredChanged?: (value: CCheckboxElementEventMap['requiredChanged']) => void;
    onrequiredMessageDetailChanged?: (value: CCheckboxElementEventMap['requiredMessageDetailChanged']) => void;
    onuserAssistanceDensityChanged?: (value: CCheckboxElementEventMap['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: CCheckboxElementEventMap['validChanged']) => void;
    onvalueChanged?: (value: CCheckboxElementEventMap['valueChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-checkbox': CheckboxIntrinsicProps;
        }
    }
}
