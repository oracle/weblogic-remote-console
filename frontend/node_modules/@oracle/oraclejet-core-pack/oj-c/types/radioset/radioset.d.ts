import { RadioSet as PreactRadioSet } from '@oracle/oraclejet-preact/UNSAFE_RadioSet';
import 'css!oj-c/radioset/radioset-styles.css';
import { DisplayOptions, Help, HelpHints } from 'oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText';
import { DataProvider } from 'ojs/ojdataprovider';
import { ExtendGlobalProps, ObservedGlobalProps, PropertyChanged, ReadOnlyPropertyChanged } from 'ojs/ojvcomponent';
import { ComponentProps, Ref, ComponentChildren } from 'preact';
import { LayoutColumnSpan } from '@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout';
/**
 * An object that represents the value and corresponding data associated with a radio item in a rendered radioset.
 * The label property is required and provides the text for the radio element.
 */
type RadiosetArrayDataItem<V extends string | number> = RadiosetDataItem & {
    value: V;
};
/**
 * Display options for auxiliary content that determines whether or not it should be displayed.
 */
type DisplayOptionsProps = Pick<DisplayOptions, 'messages'>;
/**
 * An object that represents the data associated with a radio item in a rendered radioset. The label property is required and
 * provides the text for the radio item.
 */
type RadiosetDataItem = {
    /**
     * @description
     * The value of this required property will provide the text for the radio button's label.
     */
    label: string;
    /**
     * @description
     * Optional value to provide guidance to the user about the radio item this applies to.
     */
    assistiveText?: string;
    /**
     * @description
     * Optional link to aid the user in the radio item this applies to.
     */
    helpSourceLink?: string;
    /**
     * @description
     * Optional custom text to be rendered for the <code>helpSourceLink</code>.
     */
    helpSourceText?: string;
};
type ValidState = 'valid' | 'pending' | 'invalidHidden' | 'invalidShown';
type PreactRadioSetProps = ComponentProps<typeof PreactRadioSet>;
type RadiosetProps<V extends string | number, D extends RadiosetDataItem> = ObservedGlobalProps<'aria-describedby' | 'id'> & {
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
     * Layout direction of the radioset radio elements.
     *
     * @ojmetadata description "Layout direction of the radioset radio elements."
     * @ojmetadata displayName "Direction"
     * @ojmetadata help "#direction"
     */
    direction?: PreactRadioSetProps['direction'];
    /**
     * @description
     * Specifies whether the component is disabled or not. The default is false.
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
     *  <li>if the component is invalid and showing messages then all component messages are cleared,
     *  and full validation will be run using the display value.
     *   <ul>
     *    <li>if there are validation errors, they are shown.</li>
     *    <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *    property is updated. Page authors can listen to the <code class="prettyprint">valueChanged</code>
     *    event to clear custom errors.</li>
     *   </ul>
     *  </li>
     *
     *  <li>if the component is valid and has no errors then deferred validation is run.
     *    <ul>
     *    <li>if there is a deferred validation error, then the valid property is updated. </li>
     *    </ul>
     *  </li>
     *  <li>if the component is invalid and has deferred errors then component messages are cleared and
     *  deferred validation is re-run.
     *    <ul>
     *    <li>if there is a deferred validation error, then the valid property is updated.</li>
     *    </ul>
     *  </li>
     *  </ul>
     * </li>
     * <li>when and enabled component is disabled then no validation is run and the component appears
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
     * Display options for auxiliary content that describes whether or not the auxiliary content should be displayed.
     *
     * @ojmetadata description "Display options for auxiliary content that describes whether or not the auxiliary content should be displayed."
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
     * @ojmetadata description "The helpHints object contains a definition property, sourceText property, and a source property."
     * @ojmetadata displayName "Help Hints"
     * @ojmetadata help "#helpHints"
     */
    helpHints?: HelpHints;
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
     * Specifies how the label of the component is positioned when the label-hint
     * attribute is set on the component.
     *
     * @ojmetadata description "Specifies how the label is positioned for the component relative to the field."
     * @ojmetadata displayName "Label Edge"
     * @ojmetadata help "#labelEdge"
     * @ojmetadata propertyEditorValues {
     *   "inside": {
     *     "description": "The label will be placed on top of the radioset, but is smaller than the 'top' option.",
     *     "displayName": "Inside"
     *   },
     *   "none": {
     *     "description": "The radioset will not create a label, but instead will set the aria-label property on the radioset.",
     *     "displayName": "None"
     *   },
     *   "start": {
     *     "description": "The label will be placed before the start of the radioset.",
     *     "displayName": "Start"
     *   },
     *   "top": {
     *     "description": "The label will be placed on top of the radioset.",
     *     "displayName": "Top"
     *   }
     * }
     */
    labelEdge?: PreactRadioSetProps['labelEdge'];
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
    labelStartWidth?: PreactRadioSetProps['labelStartWidth'];
    /**
     * A property that applications can use to specify how the radioset label should render when there is not enough available space.
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
     *   "truncate": {
     *     "description": "Label will truncate if needed.",
     *     "displayName": "Truncate"
     *   },
     *   "wrap": {
     *     "description": "Label will wrap if needed.",
     *     "displayName": "Wrap"
     *   }
     * }
     */
    labelWrapping?: 'truncate' | 'wrap';
    /**
     * @description
     * List of messages an app would add to the component when it has business/custom validation
     * errors that it wants the component to show. This allows the app to perform further validation
     * before sending data to the server. When this option is set the message will be shown to the
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
    messagesCustom?: PreactRadioSetProps['messages'];
    /**
     * @description
     * The data provided to the radioset that represents one or more radio items. Regardless of the type used for this attribute (whether it's a
     * DataProvider implementation or an Array of data items) the value and label properties are required. In the DataProvider case, the
     * key of the DataProvider will be used as the radio item value. See the <a href="#usage-section">custom element usage section</a> for details on the type parameter definitions.
     * @ojmetadata description "The data provided to the radioset that represents one or more radio items."
     * @ojmetadata displayName "Options"
     * @ojmetadata help "#options"
     */
    options: Array<RadiosetArrayDataItem<V>> | DataProvider<V, D>;
    onMessagesCustomChanged?: PropertyChanged<PreactRadioSetProps['messages']>;
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
     * @ojmetadata description Writeback support for the value property, allowing value property to be mutable
     * not only be the application but by the component as well.
     * @ojmetadata displayName "Value"
     * @ojmetadata help "#value"
     */
    onValueChanged?: PropertyChanged<V | null | undefined>;
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
     * @ojmetadata description "Whether the component is readonly or not."
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
     * When this property is set to <code class="prettyprint">false</code> it implies that a value is not required to be provided by the user.
     * This is the default.
     * When this property set to <code class="prettyprint">true</code> implies that a value is required to be provided by the user.
     * </p>
     * <p>
     * In the Redwood theme, by default, a Required text is rendered inline when no radio option is selected.
     * </p>
     * <p>The Required error text is based on Redwood UX designs, and it is not recommended to be changed.
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
    userAssistanceDensity?: PreactRadioSetProps['userAssistanceDensity'];
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
    value?: V | null;
};
type RadiosetHandle = {
    /**
     * @ojmetadata description "Blurs the radioset."
     * @ignore
     */
    blur: () => void;
    /**
     * @ojmetadata description "Sets focus on the selected radio button or the first tabbable radio button."
     * @ignore
     */
    focus: () => void;
    /**
     * Takes all deferred messages and shows them. It then updates
     * the valid property; e.g., if the valid state was "invalidHidden"
     * before showMessages(), the valid state will become "invalidShown"
     * after showMessages().</br>
     * </br>
     * If there were no deferred messages this method simply returns.
     * @ojmetadata description "Takes all deferred messages and shows them."
     */
    showMessages: () => void;
    /**
     * @ojmetadata description "Resets the component by clearing all messages."
     */
    reset: () => void;
    /**
     * Validates the component's display value using all validators
     * registered on the component and updates the
     * <code class="prettyprint">value</code> option by performing
     * the following steps.
     * <ol>
     * <li>All messages are cleared, including custom messages added by the app.</li>
     * <li>The implicit required validator is run if the component is marked required.</li>
     * <li>At the end of validation if there are errors, the messages are shown. If there were no errors,
     * then the <code class="prettyprint">value</code> property is updated.</li>
     * </ol>
     *
     * @returns Promise resolves to "valid" if the component passed
     * all validations, or "invalid" if there were validation errors.
     *
     * @ojmetadata description "Validates the component's display value using all
     * validators registered on the component. If there are no validation errors,
     * then the value is updated. See the Help documentation for more information."
     */
    validate: () => Promise<'valid' | 'invalid'>;
};
/**
 * This export corresponds to the Radioset Preact component. For the oj-c-radioset custom element, import CRadiosetElement instead.
 */
export declare const Radioset: <V extends string | number = string | number, D extends RadiosetDataItem = RadiosetDataItem>(props: ExtendGlobalProps<RadiosetProps<V, D>> & {
    ref?: Ref<RadiosetHandle>;
}) => ComponentChildren;
export type { RadiosetDataItem, RadiosetProps };
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-radioset custom element. For the Radioset Preact component, import Radioset instead.
 */
export interface CRadiosetElement<V extends string | number, D extends RadiosetDataItem> extends JetElement<CRadiosetElementSettableProperties<V, D>>, CRadiosetElementSettableProperties<V, D> {
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
    readonly valid?: Parameters<Required<RadiosetProps<V, D>>['onValidChanged']>[0];
    addEventListener<T extends keyof CRadiosetElementEventMap<V, D>>(type: T, listener: (this: HTMLElement, ev: CRadiosetElementEventMap<V, D>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CRadiosetElementSettableProperties<V, D>>(property: T): CRadiosetElement<V, D>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CRadiosetElementSettableProperties<V, D>>(property: T, value: CRadiosetElementSettableProperties<V, D>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CRadiosetElementSettableProperties<V, D>>): void;
    setProperties(properties: CRadiosetElementSettablePropertiesLenient<V, D>): void;
    blur: () => void;
    focus: () => void;
    reset: () => void;
    /**
     * Takes all deferred messages and shows them. It then updates
     * the valid property; e.g., if the valid state was "invalidHidden"
     * before showMessages(), the valid state will become "invalidShown"
     * after showMessages().</br>
     * </br>
     * If there were no deferred messages this method simply returns.
     */
    showMessages: () => void;
    /**
     * Validates the component's display value using all validators
     * registered on the component and updates the
     * <code class="prettyprint">value</code> option by performing
     * the following steps.
     * <ol>
     * <li>All messages are cleared, including custom messages added by the app.</li>
     * <li>The implicit required validator is run if the component is marked required.</li>
     * <li>At the end of validation if there are errors, the messages are shown. If there were no errors,
     * then the <code class="prettyprint">value</code> property is updated.</li>
     * </ol>
     */
    validate: () => Promise<'invalid' | 'valid'>;
}
export namespace CRadiosetElement {
    type columnSpanChanged<V extends string | number, D extends RadiosetDataItem> = JetElementCustomEventStrict<CRadiosetElement<V, D>['columnSpan']>;
    type containerReadonlyChanged<V extends string | number, D extends RadiosetDataItem> = JetElementCustomEventStrict<CRadiosetElement<V, D>['containerReadonly']>;
    type directionChanged<V extends string | number, D extends RadiosetDataItem> = JetElementCustomEventStrict<CRadiosetElement<V, D>['direction']>;
    type disabledChanged<V extends string | number, D extends RadiosetDataItem> = JetElementCustomEventStrict<CRadiosetElement<V, D>['disabled']>;
    type displayOptionsChanged<V extends string | number, D extends RadiosetDataItem> = JetElementCustomEventStrict<CRadiosetElement<V, D>['displayOptions']>;
    type helpChanged<V extends string | number, D extends RadiosetDataItem> = JetElementCustomEventStrict<CRadiosetElement<V, D>['help']>;
    type helpHintsChanged<V extends string | number, D extends RadiosetDataItem> = JetElementCustomEventStrict<CRadiosetElement<V, D>['helpHints']>;
    type labelEdgeChanged<V extends string | number, D extends RadiosetDataItem> = JetElementCustomEventStrict<CRadiosetElement<V, D>['labelEdge']>;
    type labelHintChanged<V extends string | number, D extends RadiosetDataItem> = JetElementCustomEventStrict<CRadiosetElement<V, D>['labelHint']>;
    type labelStartWidthChanged<V extends string | number, D extends RadiosetDataItem> = JetElementCustomEventStrict<CRadiosetElement<V, D>['labelStartWidth']>;
    type labelWrappingChanged<V extends string | number, D extends RadiosetDataItem> = JetElementCustomEventStrict<CRadiosetElement<V, D>['labelWrapping']>;
    type messagesCustomChanged<V extends string | number, D extends RadiosetDataItem> = JetElementCustomEventStrict<CRadiosetElement<V, D>['messagesCustom']>;
    type optionsChanged<V extends string | number, D extends RadiosetDataItem> = JetElementCustomEventStrict<CRadiosetElement<V, D>['options']>;
    type readonlyChanged<V extends string | number, D extends RadiosetDataItem> = JetElementCustomEventStrict<CRadiosetElement<V, D>['readonly']>;
    type readonlyUserAssistanceShownChanged<V extends string | number, D extends RadiosetDataItem> = JetElementCustomEventStrict<CRadiosetElement<V, D>['readonlyUserAssistanceShown']>;
    type requiredChanged<V extends string | number, D extends RadiosetDataItem> = JetElementCustomEventStrict<CRadiosetElement<V, D>['required']>;
    type requiredMessageDetailChanged<V extends string | number, D extends RadiosetDataItem> = JetElementCustomEventStrict<CRadiosetElement<V, D>['requiredMessageDetail']>;
    type userAssistanceDensityChanged<V extends string | number, D extends RadiosetDataItem> = JetElementCustomEventStrict<CRadiosetElement<V, D>['userAssistanceDensity']>;
    type validChanged<V extends string | number, D extends RadiosetDataItem> = JetElementCustomEventStrict<CRadiosetElement<V, D>['valid']>;
    type valueChanged<V extends string | number, D extends RadiosetDataItem> = JetElementCustomEventStrict<CRadiosetElement<V, D>['value']>;
}
export interface CRadiosetElementEventMap<V extends string | number, D extends RadiosetDataItem> extends HTMLElementEventMap {
    'columnSpanChanged': JetElementCustomEventStrict<CRadiosetElement<V, D>['columnSpan']>;
    'containerReadonlyChanged': JetElementCustomEventStrict<CRadiosetElement<V, D>['containerReadonly']>;
    'directionChanged': JetElementCustomEventStrict<CRadiosetElement<V, D>['direction']>;
    'disabledChanged': JetElementCustomEventStrict<CRadiosetElement<V, D>['disabled']>;
    'displayOptionsChanged': JetElementCustomEventStrict<CRadiosetElement<V, D>['displayOptions']>;
    'helpChanged': JetElementCustomEventStrict<CRadiosetElement<V, D>['help']>;
    'helpHintsChanged': JetElementCustomEventStrict<CRadiosetElement<V, D>['helpHints']>;
    'labelEdgeChanged': JetElementCustomEventStrict<CRadiosetElement<V, D>['labelEdge']>;
    'labelHintChanged': JetElementCustomEventStrict<CRadiosetElement<V, D>['labelHint']>;
    'labelStartWidthChanged': JetElementCustomEventStrict<CRadiosetElement<V, D>['labelStartWidth']>;
    'labelWrappingChanged': JetElementCustomEventStrict<CRadiosetElement<V, D>['labelWrapping']>;
    'messagesCustomChanged': JetElementCustomEventStrict<CRadiosetElement<V, D>['messagesCustom']>;
    'optionsChanged': JetElementCustomEventStrict<CRadiosetElement<V, D>['options']>;
    'readonlyChanged': JetElementCustomEventStrict<CRadiosetElement<V, D>['readonly']>;
    'readonlyUserAssistanceShownChanged': JetElementCustomEventStrict<CRadiosetElement<V, D>['readonlyUserAssistanceShown']>;
    'requiredChanged': JetElementCustomEventStrict<CRadiosetElement<V, D>['required']>;
    'requiredMessageDetailChanged': JetElementCustomEventStrict<CRadiosetElement<V, D>['requiredMessageDetail']>;
    'userAssistanceDensityChanged': JetElementCustomEventStrict<CRadiosetElement<V, D>['userAssistanceDensity']>;
    'validChanged': JetElementCustomEventStrict<CRadiosetElement<V, D>['valid']>;
    'valueChanged': JetElementCustomEventStrict<CRadiosetElement<V, D>['value']>;
}
export interface CRadiosetElementSettableProperties<V extends string | number, D extends RadiosetDataItem> extends JetSettableProperties {
    /**
     * Specifies how many columns this component should span.
     * This only takes effect when this component is a child of a form layout
     * that has direction 'row'.
     */
    columnSpan?: RadiosetProps<V, D>['columnSpan'];
    /**
     * Specifies whether an ancestor container, like oj-c-form-layout, is readonly.
     * This affects whether a readonly component renders in full or mixed readonly mode.
     */
    containerReadonly?: RadiosetProps<V, D>['containerReadonly'];
    /**
     * Layout direction of the radioset radio elements.
     */
    direction?: RadiosetProps<V, D>['direction'];
    /**
     * Specifies whether the component is disabled or not. The default is false.
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
     *  <li>if the component is invalid and showing messages then all component messages are cleared,
     *  and full validation will be run using the display value.
     *   <ul>
     *    <li>if there are validation errors, they are shown.</li>
     *    <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *    property is updated. Page authors can listen to the <code class="prettyprint">valueChanged</code>
     *    event to clear custom errors.</li>
     *   </ul>
     *  </li>
     *
     *  <li>if the component is valid and has no errors then deferred validation is run.
     *    <ul>
     *    <li>if there is a deferred validation error, then the valid property is updated. </li>
     *    </ul>
     *  </li>
     *  <li>if the component is invalid and has deferred errors then component messages are cleared and
     *  deferred validation is re-run.
     *    <ul>
     *    <li>if there is a deferred validation error, then the valid property is updated.</li>
     *    </ul>
     *  </li>
     *  </ul>
     * </li>
     * <li>when and enabled component is disabled then no validation is run and the component appears
     * disabled.</li>
     * </ul>
     * </p>
     */
    disabled?: RadiosetProps<V, D>['disabled'];
    /**
     * Display options for auxiliary content that describes whether or not the auxiliary content should be displayed.
     */
    displayOptions?: RadiosetProps<V, D>['displayOptions'];
    /**
     * Form component help information.
     */
    help?: RadiosetProps<V, D>['help'];
    /**
     * The helpHints object contains a definition property, sourceText property, and a source property.
     */
    helpHints?: RadiosetProps<V, D>['helpHints'];
    /**
     * Specifies how the label of the component is positioned when the label-hint
     * attribute is set on the component.
     */
    labelEdge?: RadiosetProps<V, D>['labelEdge'];
    /**
     * Represents a hint for rendering a label on the component.
     * This is used in combination with the label-edge attribute to control how the label should be rendered.
     */
    labelHint: RadiosetProps<V, D>['labelHint'];
    /**
     * <p> The width of the label when labelEdge is 'start'.</p>
     * <p> This attribute accepts values of type
     * <code>0 | `var(${string})` | `--${string}` | `${number}%` | `${number}x` | `calc(${string})` | `${number}${CssUnits}</code></p>
     */
    labelStartWidth?: RadiosetProps<V, D>['labelStartWidth'];
    /**
     * A property that applications can use to specify how the radioset label should render when there is not enough available space.
     * @deprecated since 18.0.0 - Label truncation for 'start' and 'top' aligned labels is no longer recommended by the Redwood Design System. The default for labelWrapping was 'wrap' and that is now the only suggested pattern by UX design for 'start' and 'top' aligned labels. 'inside' aligned labels are always truncated per UX design and are not affected by this property's value.
     */
    labelWrapping?: RadiosetProps<V, D>['labelWrapping'];
    /**
     * List of messages an app would add to the component when it has business/custom validation
     * errors that it wants the component to show. This allows the app to perform further validation
     * before sending data to the server. When this option is set the message will be shown to the
     * user right away. To clear the custom message, set <code class="prettyprint">messagesCustom</code>
     * back to an empty array.<br/>
     * <p>
     * See the <a href="#validation-section">Validation and Messages</a> section
     * for details on when the component clears <code class="prettyprint">messagesCustom</code>;
     * for example, when full validation is run.
     * </p>
     */
    messagesCustom?: RadiosetProps<V, D>['messagesCustom'];
    /**
     * The data provided to the radioset that represents one or more radio items. Regardless of the type used for this attribute (whether it's a
     * DataProvider implementation or an Array of data items) the value and label properties are required. In the DataProvider case, the
     * key of the DataProvider will be used as the radio item value. See the <a href="#usage-section">custom element usage section</a> for details on the type parameter definitions.
     */
    options: RadiosetProps<V, D>['options'];
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
    readonly?: RadiosetProps<V, D>['readonly'];
    /**
     * <p>
     * Specifies which user assistance types should be shown when the component is readonly.
     * </p>
     */
    readonlyUserAssistanceShown?: RadiosetProps<V, D>['readonlyUserAssistanceShown'];
    /**
     * <p>
     * When this property is set to <code class="prettyprint">false</code> it implies that a value is not required to be provided by the user.
     * This is the default.
     * When this property set to <code class="prettyprint">true</code> implies that a value is required to be provided by the user.
     * </p>
     * <p>
     * In the Redwood theme, by default, a Required text is rendered inline when no radio option is selected.
     * </p>
     * <p>The Required error text is based on Redwood UX designs, and it is not recommended to be changed.
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
    required?: RadiosetProps<V, D>['required'];
    /**
     * <p>
     * The component-specific message detail when the required validation fails.
     * If the component needs a required validation error message that is different from the default,
     * set this property. It should be a translated string.
     * </p>
     */
    requiredMessageDetail?: RadiosetProps<V, D>['requiredMessageDetail'];
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
    userAssistanceDensity?: RadiosetProps<V, D>['userAssistanceDensity'];
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
     * <h4>Running Validation</h4>
     * <ul>
     * <li>component always runs deferred validation; the
     * <code class="prettyprint">valid</code> property is updated with the result.</li>
     * </ul>
     */
    value?: RadiosetProps<V, D>['value'];
}
export interface CRadiosetElementSettablePropertiesLenient<V extends string | number, D extends RadiosetDataItem> extends Partial<CRadiosetElementSettableProperties<V, D>> {
    [key: string]: any;
}
export interface RadiosetIntrinsicProps extends Partial<Readonly<CRadiosetElementSettableProperties<any, any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    valid?: never;
    oncolumnSpanChanged?: (value: CRadiosetElementEventMap<any, any>['columnSpanChanged']) => void;
    oncontainerReadonlyChanged?: (value: CRadiosetElementEventMap<any, any>['containerReadonlyChanged']) => void;
    ondirectionChanged?: (value: CRadiosetElementEventMap<any, any>['directionChanged']) => void;
    ondisabledChanged?: (value: CRadiosetElementEventMap<any, any>['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: CRadiosetElementEventMap<any, any>['displayOptionsChanged']) => void;
    onhelpChanged?: (value: CRadiosetElementEventMap<any, any>['helpChanged']) => void;
    onhelpHintsChanged?: (value: CRadiosetElementEventMap<any, any>['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: CRadiosetElementEventMap<any, any>['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: CRadiosetElementEventMap<any, any>['labelHintChanged']) => void;
    onlabelStartWidthChanged?: (value: CRadiosetElementEventMap<any, any>['labelStartWidthChanged']) => void;
    /** @deprecated since 18.0.0 */ onlabelWrappingChanged?: (value: CRadiosetElementEventMap<any, any>['labelWrappingChanged']) => void;
    onmessagesCustomChanged?: (value: CRadiosetElementEventMap<any, any>['messagesCustomChanged']) => void;
    onoptionsChanged?: (value: CRadiosetElementEventMap<any, any>['optionsChanged']) => void;
    onreadonlyChanged?: (value: CRadiosetElementEventMap<any, any>['readonlyChanged']) => void;
    onreadonlyUserAssistanceShownChanged?: (value: CRadiosetElementEventMap<any, any>['readonlyUserAssistanceShownChanged']) => void;
    onrequiredChanged?: (value: CRadiosetElementEventMap<any, any>['requiredChanged']) => void;
    onrequiredMessageDetailChanged?: (value: CRadiosetElementEventMap<any, any>['requiredMessageDetailChanged']) => void;
    onuserAssistanceDensityChanged?: (value: CRadiosetElementEventMap<any, any>['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: CRadiosetElementEventMap<any, any>['validChanged']) => void;
    onvalueChanged?: (value: CRadiosetElementEventMap<any, any>['valueChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-radioset': RadiosetIntrinsicProps;
        }
    }
}
