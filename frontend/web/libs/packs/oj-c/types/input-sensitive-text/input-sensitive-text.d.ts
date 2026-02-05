import { ComponentProps, ComponentType, Ref } from 'preact';
import { InputSensitiveText as PreactInputSensitiveText } from '@oracle/oraclejet-preact/UNSAFE_InputSensitiveText';
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
import { LayoutColumnSpan } from '@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout';
import { DisplayOptions, Help, HelpHints } from 'oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText';
import type Validator = require('ojs/ojvalidator');
import type AsyncValidator = require('ojs/ojvalidator-async');
import { ExtendGlobalProps, GlobalProps, ObservedGlobalProps, PropertyChanged, ReadOnlyPropertyChanged } from 'ojs/ojvcomponent';
import 'css!oj-c/input-sensitive-text/input-sensitive-text-styles.css';
type PreactInputSensitiveTextProps = ComponentProps<typeof PreactInputSensitiveText>;
/**
 * Defines the length limit for the field
 */
type Length = {
    /**
     * @description
     * Dictates how the input text characters are counted.
     *
     * @ojmetadata displayName "Count By"
     * @ojmetadata help "#length.countBy"
     * @ojmetadata propertyEditorValues {
     *   "codePoint": {
     *     "description": "Uses code point to calculate the text length (default, if unspecified)",
     *     "displayName": "Code Point"
     *   },
     *   "codeUnit": {
     *     "description": "Uses code unit to calculate the text length.",
     *     "displayName": "Code Unit"
     *   }
     * }
     */
    countBy?: 'codePoint' | 'codeUnit';
    /**
     * Maximum number of characters that can be entered in the input field.
     */
    max?: number | null;
};
/**
 * Various supported valid states
 */
type ValidState = 'valid' | 'pending' | 'invalidHidden' | 'invalidShown';
/**
 * Display options for auxiliary content that determines whether or not it should be displayed.
 */
type DisplayOptionsProps = Omit<DisplayOptions, 'converterHint'>;
/**
 * The properties of the InputSensitiveText component (aka oj-c-input-sensitive-text).
 */
type Props<V> = ObservedGlobalProps<'aria-describedby' | 'id'> & {
    /**
     * @description
     * Autofocus is a Boolean that reflects the autofocus attribute.
     * If it is set to true then the associated component will get input focus when the page is loaded.
     * Setting this property doesn't set the focus to the component:
     * it tells the browser to focus to it when the element is inserted in the document.
     *
     * @ojmetadata description "Reflects the component's autofocus"
     * @ojmetadata displayName "Autofocus"
     * @ojmetadata help "#autofocus"
     */
    autofocus?: GlobalProps['autofocus'];
    /**
     * @ojmetadata description "Specifies if an icon to clear the input field should be visible."
     * @ojmetadata displayName "Clear Icon"
     * @ojmetadata help "#clearIcon"
     * @ojmetadata propertyEditorValues {
     *   "always": {
     *     "description": "The clear icon will always be shown.",
     *     "displayName": "Always"
     *   },
     *   "never": {
     *     "description": "The clear icon will never be shown (default, if unspecified).",
     *     "displayName": "Never"
     *   },
     *   "conditional": {
     *     "description": "The clear icon is visible under the following conditions: if the component has a non-empty value, and it either has focus or the mouse is over the field.",
     *     "displayName": "Conditional"
     *   }
     * }
     */
    clearIcon?: 'always' | 'never' | 'conditional';
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
     * Specifies whether an ancestor container, like oj-c-form-layout, is readonly.
     * This affects whether a readonly component renders in full or mixed readonly mode.
     * @ojmetadata description "Specifies whether an ancestor container, like oj-c-form-layout, is readonly."
     * @ojmetadata displayName "Container Readonly"
     * @ojmetadata help "#containerReadonly"
     */
    containerReadonly?: boolean;
    /**
     * @description
     * Whether the component is disabled. The default is false.
     * @ojmetadata description "Specifies whether the component is disabled."
     * @ojmetadata displayName "Disabled"
     * @ojmetadata help "#disabled"
     */
    disabled?: boolean;
    /**
     * @description
     * Display options for auxiliary content that determines whether or not it should be displayed.
     *
     * @ojmetadata description "Display options for auxiliary content that determines whether or not it should be displayed."
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
     * The helpHints object contains a definition property and a source property.
     *
     * @ojmetadata description "The helpHints object contains a definition property and a source property."
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
     *   "inside": {
     *     "description": "The label floats over the input element, but moves up on focus or when the component has a value (default, if unspecified).",
     *     "displayName": "Inside"
     *   },
     *   "none": {
     *     "description": "The component will not create a label, but instead set the aria-label property on the input element.",
     *     "displayName": "None"
     *   },
     *   "start": {
     *     "description": "The label will be placed before the start of the component.",
     *     "displayName": "Start"
     *   },
     *   "top": {
     *     "description": "The label will be placed on top of the component.",
     *     "displayName": "Top"
     *   }
     * }
     */
    labelEdge?: PreactInputSensitiveTextProps['labelEdge'];
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
     * <code>0 | `--${string}` | `${number}%` | `${number}x` | `calc(${string})`</code></p>
     *
     * @ojmetadata description "The width of the label when labelEdge is 'start'."
     * @ojmetadata displayName "Label Start Width"
     * @ojmetadata help "#labelStartWidth"
     */
    labelStartWidth?: Size;
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
     * Defines the length limit for the field
     *
     * @ojmetadata description "Defines the length limit for the field"
     * @ojmetadata displayName "Length"
     * @ojmetadata help "#length"
     */
    length?: Length;
    /**
     * @description
     * The user can click on the mask icon to toggle the visibility of the text. When the user leaves the field,
     * the text is automatically masked. If "mask-icon" is set to "hidden", then the user has no way to toggle
     * the visibility of the text. If the input is set to "readonly" and "mask-icon" is set to "visible",
     * the user will still be able to see the icon and toggle the text if it's masked. However, if the input
     * is set to "disabled , the icon will never be visible and the user has no way to toggle the visibility of the text.
     * @ojmetadata description "Represents the mask icon."
     * @ojmetadata displayName "Mask Icon"
     * @ojmetadata help "#maskIcon"
     * @ojmetadata propertyEditorValues {
     *   "hidden": {
     *     "description": "The mask visibility icon is never visible.",
     *     "displayName": "Hidden"
     *   },
     *   "visible": {
     *     "description": "The mask visibility icon is always visible.",
     *     "displayName": "Visible"
     *   }
     * }
     */
    maskIcon?: 'visible' | 'hidden';
    /**
     * @description
     * The text used for the screen reader to describe the mask icon toggle.
     * @ojmetadata description "The text used for the screen reader to describe the mask icon toggle."
     * @ojmetadata displayName "Mask Icon Label"
     * @ojmetadata help "#maskIconLabel"
     * @ojmetadata translatable
     */
    maskIconLabel?: string;
    /**
     * @description
     * Specifies the component's max width.  If unset, the default max width is 100%.
     *
     * @ojmetadata description "The max width of the control."
     * @ojmetadata displayName "Max Width"
     * @ojmetadata help "#maxWidth"
     */
    maxWidth?: 'sm' | 'md' | Size;
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
    messagesCustom?: PreactInputSensitiveTextProps['messages'];
    /**
     * @description
     * The placeholder text to set on the element.
     *
     * @ojmetadata description "The placeholder text to set on the element."
     * @ojmetadata displayName "Placeholder"
     * @ojmetadata help "#placeholder"
     * @ojmetadata translatable
     */
    placeholder?: string;
    /**
     * @description
     * <p>
     * Whether the component is readonly. The readonly property sets or returns whether an element
     * is readonly, or not. A readonly element cannot be modified. However, a user can tab to it,
     * highlight it, focus on it, and copy the text from it. If "readonly" is set to "true"
     * and "mask-icon" is set to "visible", a user can still toggle the visibility of the sensitive text.
     * If you want to prevent the user from interacting with the element, use the disabled property instead.
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
     * If user-assistance-density is 'compact', it will show on the label as an icon.
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
     * Specifies how the text is aligned within the text field
     *
     * @ojmetadata description "Specifies how the text is aligned within the text field"
     * @ojmetadata displayName "Text Align"
     * @ojmetadata help "#textAlign"
     * @ojmetadata propertyEditorValues {
     *   "start": {
     *     "description": "Aligns text left when reading direction is ltr and right when reading direction is rtl (default, if unspecified).",
     *     "displayName": "Start"
     *   },
     *   "end": {
     *     "description": "Aligns text right when reading direction is ltr and left when reading direction is rtl.",
     *     "displayName": "End"
     *   },
     *   "right": {
     *     "description": "Aligns text right regardless of reading direction, often used for numbers.",
     *     "displayName": "Right"
     *   }
     * }
     */
    textAlign?: PreactInputSensitiveTextProps['textAlign'];
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
     *     "description": "Messages, help, hints, and required are all shown inline under the field with no reserved space.",
     *     "displayName": "Reflow"
     *   },
     *   "efficient": {
     *     "description": "Messages, help, hints, and required are all shown inline under the field with reserved space.",
     *     "displayName": "Efficient"
     *   },
     *   "compact": {
     *     "description": "Messages, help, hints, and required will not be shown inline; they will show in a mode that keeps the screen more compact, like a popup for the messages, and a required icon to indicate Required.",
     *     "displayName": "Compact"
     *   }
     * }
     */
    userAssistanceDensity?: PreactInputSensitiveTextProps['userAssistanceDensity'];
    /**
     * @description
     * List of validators, synchronous or asynchronous,
     * used by the component
     * and the implicit component validators when performing validation. Each item is either an
     * instance that duck types oj.Validator or oj.AsyncValidator.
     * <p>
     * Implicit validators are created by the element when certain attributes are present.
     * For example, if the <code class="prettyprint">required</code> attribute
     * is set, an implicit oj.RequiredValidator is created.
     * At runtime when the component runs validation, it
     * combines all the implicit validators with all the validators
     * specified through this <code class="prettyprint">validators</code> attribute
     * and the <code class="prettyprint">async-validators</code> attribute, and
     * runs all of them.
     * </p>
     * <p>
     * Hints exposed by validators are shown inline by default in the Redwood theme when the
     * field has focus.
     * You can turn off showing validator hints by using the
     * 'validatorHint' property set to 'none' on the <code class="prettyprint">display-options</code>
     * attribute.
     * </p>
     * <p>
     * In the Redwood theme, only one hint shows at a time, so the precedence rules are:
     * help.instruction shows; if no help.instruction then validator hints show;
     * if none, then help-hints.definition shows; if none, then converter hint shows.
     * help-hints.source always shows along with the other help or hint.
     * </p>
     *
     * <p>
     * When <code class="prettyprint">validators</code> property changes due to programmatic
     * intervention, the component may decide to clear messages and run validation, based on the
     * current state it is in. </br>
     *
     * <h4>Steps Performed Always</h4>
     * <ul>
     * <li>The cached list of validator instances are cleared and new validator hints is pushed to
     * messaging.
     * </li>
     * </ul>
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>if component is valid when validators changes, component does nothing other than the
     * steps it always performs.</li>
     * <li>if component is invalid and is showing messages when
     * <code class="prettyprint">validators</code> or
     * <code class="prettyprint">async-validators</code> changes then all component messages
     *  are cleared and full validation run using the display value on the component.
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code>
     *   property is not updated and the error is shown.
     *   </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
     *   event to clear custom errors.</li>
     * </ul>
     * </li>
     * <li>if component is invalid and has deferred messages when validators changes, it does
     * nothing other than the steps it performs always.</li>
     * </ul>
     * </p>
     *
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>Only messages created by the component are cleared.</li>
     * <li><code class="prettyprint">messagesCustom</code> property is not cleared.</li>
     * </ul>
     * </p>
     *
     * @ojmetadata description "Specifies the validators for the component."
     * @ojmetadata displayName "Validators"
     * @ojmetadata help "#validators"
     */
    validators?: (AsyncValidator<V> | Validator<V>)[] | null;
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
     * When the input field is cleared and the value is committed, the <code class="prettyprint">value</code>
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
    value?: V | null;
    /**
     * @description
     * The type of virtual keyboard to display for entering a value on mobile browsers. This attribute has no effect on desktop browsers.
     *
     * @ojmetadata description "The type of virtual keyboard to display for entering a value on mobile browsers"
     * @ojmetadata displayName "Virtual Keyboard"
     * @ojmetadata help "#virtualKeyboard"
     * @ojmetadata propertyEditorValues {
     *   "number": {
     *     "description": "Use a mobile virtual keyboard for entering numbers.",
     *     "displayName": "Number"
     *   },
     *   "auto": {
     *     "description": "The component will determine the best mobile virtual keyboard to use (default, if unspecified).",
     *     "displayName": "Auto"
     *   },
     *   "email": {
     *     "description": "Use a mobile virtual keyboard for entering email addresses.",
     *     "displayName": "Email"
     *   },
     *   "search": {
     *     "description": "Use a mobile virtual keyboard for entering search terms.",
     *     "displayName": "Search"
     *   },
     *   "tel": {
     *     "description": "Use a mobile virtual keyboard for entering telephone numbers.",
     *     "displayName": "Tel"
     *   },
     *   "text": {
     *     "description": "Use a mobile virtual keyboard for entering text.",
     *     "displayName": "Text"
     *   },
     *   "url": {
     *     "description": "Use a mobile virtual keyboard for URL entry.",
     *     "displayName": "URL"
     *   }
     * }
     */
    virtualKeyboard?: PreactInputSensitiveTextProps['virtualKeyboard'];
    /**
     * @description
     * Specifies the component's width.  If unset, the default width is 100%.
     * Note that by default max-width is 100%, which will override the width if the container is smaller than the width specified.
     *
     * @ojmetadata description "The width of the control."
     * @ojmetadata displayName "Width"
     * @ojmetadata help "#width"
     */
    width?: 'sm' | 'md' | Size;
    /**
     * Writeback support for the messagesCustom property
     */
    onMessagesCustomChanged?: PropertyChanged<PreactInputSensitiveTextProps['messages']>;
    /**
     * @description
     * <p>The  <code class="prettyprint">rawValue</code> is the read-only property for retrieving
     * the current value from the input field in string form. The main consumer of
     * <code class="prettyprint">rawValue</code> is a converter.</p>
     * <p>
     * The <code class="prettyprint">rawValue</code> updates on the 'input' javascript event,
     * so the <code class="prettyprint">rawValue</code> changes as the value of the input is changed.
     * If the user types in '1,200' into the field, the rawValue will be '1', then '1,', then '1,2',
     * ..., and finally '1,200'. Then when the user blurs or presses
     * Enter the <code class="prettyprint">value</code> property gets converted and validated
     * (if there is a converter or validators) and then gets updated if valid.
     * </p>
     * <p>This is a read-only attribute so page authors cannot set or change it directly.</p>
     *
     * @ojmetadata description "Specifies how the raw value of the component"
     * @ojmetadata displayName "Raw Value"
     * @ojmetadata help "#rawValue"
     */
    onRawValueChanged?: ReadOnlyPropertyChanged<string>;
    /**
     * @description
     * <p>
     * The current valid state of the component. It is evaluated on initial render.
     * It is re-evaluated
     * <ul>
     *   <li>after each validator (validators or async-validators) is run (full or deferred)</li>
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
     * @ojmetadata description "Specifies the current valid state of the component"
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
    onValueChanged?: PropertyChanged<V | null>;
};
type InputSensitiveTextHandle = {
    /**
     * blurs the input field
     * @ignore
     */
    blur: () => void;
    /**
     * focuses the input field
     * @ignore
     */
    focus: () => void;
    /**
     * Takes all deferred messages and shows them.
     * It then updates the valid property;
     * e.g., if the valid state was "invalidHidden" before showMessages(),
     * the valid state will become "invalidShown" after showMessages().
     * If there were no deferred messages this method simply returns.
     */
    showMessages: () => void;
    /**
     * Resets the component by clearing all messages and messagesCustom attribute
     * and updates the component's display value using the attribute value.
     * User entered values will be erased when this method is called.
     */
    reset: () => void;
    /**
     * If enabled, validates the component's display value using the converter and
     * all validators registered on the component and updates the value
     * option by performing the following steps.
     * <ol>
     * <li>All messages are cleared, including custom messages added by the app.</li>
     * <li>If the UI display value is empty, then the component normalizes the value to null.</li>
     * <li>
     *  If no converter is present, or the normalized value is null, then processing continues to next step. Otherwise,
     *  the UI value is first converted (i.e., parsed). If there is a parse error then the messages are shown and processing stops.
     * </li>
     * <li>
     *  If required is true, the implicit required validator is run. If the required validator throws an error, the message is shown.
     * </li>
     * <li>
     *  If there are no other validators registered on the component, or if the UI display value is empty,
     *  the value option is updated using the display value (an empty field's display value is null).
     *
     *  Otherwise all validators are run in sequence
     *  using the parsed value from the previous step.
     *  When a validation error is encountered it is remembered and the next validator in the sequence is run.
     * </li>
     * <li>
     *  At the end of validation if there are errors, the messages are shown.
     *  If there were no errors, then the value option is updated.
     * </li>
     * </ol>
     * <p>If the component is readonly or disabled, returns a Promise that resolves to 'valid'
     * without doing any validation.</p>
     * @returns Promise resolves to "valid" if there were no converter parse errors and the component
     *          passed all validations. The Promise resolves to "valid" if the component is disabled or readonly.
     *          The Promise resolves to "invalid" if there were converter
     *          parse errors or if there were validation errors.
     */
    validate: () => Promise<'valid' | 'invalid'>;
};
declare const FunctionalInputSensitiveText: import("preact").FunctionalComponent<import("preact/compat").PropsWithoutRef<Props<string>> & {
    ref?: Ref<InputSensitiveTextHandle> | undefined;
}>;
/**
 * This export corresponds to the InputSensitiveText Preact component. For the oj-c-input-sensitive-text custom element, import CInputSensitiveTextElement instead.
 */
export declare const InputSensitiveText: ComponentType<ExtendGlobalProps<ComponentProps<typeof FunctionalInputSensitiveText>> & {
    ref?: Ref<InputSensitiveTextHandle>;
}>;
export type InputSensitiveTextProps<V extends string = string> = Props<V>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-input-sensitive-text custom element. For the InputSensitiveText Preact component, import InputSensitiveText instead.
 */
export interface CInputSensitiveTextElement<V extends string = string> extends JetElement<CInputSensitiveTextElementSettableProperties<V>>, CInputSensitiveTextElementSettableProperties<V> {
    /**
     * <p>The  <code class="prettyprint">rawValue</code> is the read-only property for retrieving
     * the current value from the input field in string form. The main consumer of
     * <code class="prettyprint">rawValue</code> is a converter.</p>
     * <p>
     * The <code class="prettyprint">rawValue</code> updates on the 'input' javascript event,
     * so the <code class="prettyprint">rawValue</code> changes as the value of the input is changed.
     * If the user types in '1,200' into the field, the rawValue will be '1', then '1,', then '1,2',
     * ..., and finally '1,200'. Then when the user blurs or presses
     * Enter the <code class="prettyprint">value</code> property gets converted and validated
     * (if there is a converter or validators) and then gets updated if valid.
     * </p>
     * <p>This is a read-only attribute so page authors cannot set or change it directly.</p>
     */
    readonly rawValue?: Parameters<Required<Props<V>>['onRawValueChanged']>[0];
    /**
     * <p>
     * The current valid state of the component. It is evaluated on initial render.
     * It is re-evaluated
     * <ul>
     *   <li>after each validator (validators or async-validators) is run (full or deferred)</li>
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
    readonly valid?: Parameters<Required<Props<V>>['onValidChanged']>[0];
    addEventListener<T extends keyof CInputSensitiveTextElementEventMap<V>>(type: T, listener: (this: HTMLElement, ev: CInputSensitiveTextElementEventMap<V>[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CInputSensitiveTextElementSettableProperties<V>>(property: T): CInputSensitiveTextElement<V>[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CInputSensitiveTextElementSettableProperties<V>>(property: T, value: CInputSensitiveTextElementSettableProperties<V>[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CInputSensitiveTextElementSettableProperties<V>>): void;
    setProperties(properties: CInputSensitiveTextElementSettablePropertiesLenient<V>): void;
    /**
     * blurs the input field
     */
    blur: () => void;
    /**
     * focuses the input field
     */
    focus: () => void;
    /**
     * Resets the component by clearing all messages and messagesCustom attribute
     * and updates the component's display value using the attribute value.
     * User entered values will be erased when this method is called.
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
     * If enabled, validates the component's display value using the converter and
     * all validators registered on the component and updates the value
     * option by performing the following steps.
     * <ol>
     * <li>All messages are cleared, including custom messages added by the app.</li>
     * <li>If the UI display value is empty, then the component normalizes the value to null.</li>
     * <li>
     *  If no converter is present, or the normalized value is null, then processing continues to next step. Otherwise,
     *  the UI value is first converted (i.e., parsed). If there is a parse error then the messages are shown and processing stops.
     * </li>
     * <li>
     *  If required is true, the implicit required validator is run. If the required validator throws an error, the message is shown.
     * </li>
     * <li>
     *  If there are no other validators registered on the component, or if the UI display value is empty,
     *  the value option is updated using the display value (an empty field's display value is null).
     *
     *  Otherwise all validators are run in sequence
     *  using the parsed value from the previous step.
     *  When a validation error is encountered it is remembered and the next validator in the sequence is run.
     * </li>
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
export namespace CInputSensitiveTextElement {
    type clearIconChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['clearIcon']>;
    type columnSpanChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['columnSpan']>;
    type containerReadonlyChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['containerReadonly']>;
    type disabledChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['disabled']>;
    type displayOptionsChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['displayOptions']>;
    type helpChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['help']>;
    type helpHintsChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['helpHints']>;
    type labelEdgeChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['labelEdge']>;
    type labelHintChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['labelHint']>;
    type labelStartWidthChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['labelStartWidth']>;
    type labelWrappingChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['labelWrapping']>;
    type lengthChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['length']>;
    type maskIconChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['maskIcon']>;
    type maskIconLabelChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['maskIconLabel']>;
    type maxWidthChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['maxWidth']>;
    type messagesCustomChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['messagesCustom']>;
    type placeholderChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['placeholder']>;
    type rawValueChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['rawValue']>;
    type readonlyChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['readonly']>;
    type readonlyUserAssistanceShownChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['readonlyUserAssistanceShown']>;
    type requiredChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['required']>;
    type requiredMessageDetailChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['requiredMessageDetail']>;
    type textAlignChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['textAlign']>;
    type userAssistanceDensityChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['userAssistanceDensity']>;
    type validChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['valid']>;
    type validatorsChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['validators']>;
    type valueChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['value']>;
    type virtualKeyboardChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['virtualKeyboard']>;
    type widthChanged<V extends string = string> = JetElementCustomEventStrict<CInputSensitiveTextElement<V>['width']>;
}
export interface CInputSensitiveTextElementEventMap<V extends string = string> extends HTMLElementEventMap {
    'clearIconChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['clearIcon']>;
    'columnSpanChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['columnSpan']>;
    'containerReadonlyChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['containerReadonly']>;
    'disabledChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['disabled']>;
    'displayOptionsChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['displayOptions']>;
    'helpChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['help']>;
    'helpHintsChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['helpHints']>;
    'labelEdgeChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['labelEdge']>;
    'labelHintChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['labelHint']>;
    'labelStartWidthChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['labelStartWidth']>;
    'labelWrappingChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['labelWrapping']>;
    'lengthChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['length']>;
    'maskIconChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['maskIcon']>;
    'maskIconLabelChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['maskIconLabel']>;
    'maxWidthChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['maxWidth']>;
    'messagesCustomChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['messagesCustom']>;
    'placeholderChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['placeholder']>;
    'rawValueChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['rawValue']>;
    'readonlyChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['readonly']>;
    'readonlyUserAssistanceShownChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['readonlyUserAssistanceShown']>;
    'requiredChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['required']>;
    'requiredMessageDetailChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['requiredMessageDetail']>;
    'textAlignChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['textAlign']>;
    'userAssistanceDensityChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['userAssistanceDensity']>;
    'validChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['valid']>;
    'validatorsChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['validators']>;
    'valueChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['value']>;
    'virtualKeyboardChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['virtualKeyboard']>;
    'widthChanged': JetElementCustomEventStrict<CInputSensitiveTextElement<V>['width']>;
}
export interface CInputSensitiveTextElementSettableProperties<V> extends JetSettableProperties {
    clearIcon?: Props<V>['clearIcon'];
    /**
     * Specifies how many columns this component should span.
     * This only takes effect when this component is a child of a form layout
     * that has direction 'row'.
     */
    columnSpan?: Props<V>['columnSpan'];
    /**
     * Specifies whether an ancestor container, like oj-c-form-layout, is readonly.
     * This affects whether a readonly component renders in full or mixed readonly mode.
     */
    containerReadonly?: Props<V>['containerReadonly'];
    /**
     * Whether the component is disabled. The default is false.
     */
    disabled?: Props<V>['disabled'];
    /**
     * Display options for auxiliary content that determines whether or not it should be displayed.
     */
    displayOptions?: Props<V>['displayOptions'];
    /**
     * Form component help information.
     */
    help?: Props<V>['help'];
    /**
     * The helpHints object contains a definition property and a source property.
     */
    helpHints?: Props<V>['helpHints'];
    /**
     * Specifies how the label of the component is positioned when the label-hint
     * attribute is set on the component.
     */
    labelEdge?: Props<V>['labelEdge'];
    /**
     * Represents a hint for rendering a label on the component.
     * This is used in combination with the label-edge attribute to control how the label should be rendered.
     */
    labelHint: Props<V>['labelHint'];
    /**
     * <p> The width of the label when labelEdge is 'start'.</p>
     * <p> This attribute accepts values of type
     * <code>0 | `--${string}` | `${number}%` | `${number}x` | `calc(${string})`</code></p>
     */
    labelStartWidth?: Props<V>['labelStartWidth'];
    /**
     * @deprecated since 18.0.0  - Label truncation for 'start' and 'top' aligned labels is no longer recommended by the Redwood Design System. The default for labelWrapping was 'wrap' and that is now the only suggested pattern by UX design for 'start' and 'top' aligned labels. 'inside' aligned labels are always truncated per UX design and are not affected by this property's value.
     */
    labelWrapping?: Props<V>['labelWrapping'];
    /**
     * Defines the length limit for the field
     */
    length?: Props<V>['length'];
    /**
     * The user can click on the mask icon to toggle the visibility of the text. When the user leaves the field,
     * the text is automatically masked. If "mask-icon" is set to "hidden", then the user has no way to toggle
     * the visibility of the text. If the input is set to "readonly" and "mask-icon" is set to "visible",
     * the user will still be able to see the icon and toggle the text if it's masked. However, if the input
     * is set to "disabled , the icon will never be visible and the user has no way to toggle the visibility of the text.
     */
    maskIcon?: Props<V>['maskIcon'];
    /**
     * The text used for the screen reader to describe the mask icon toggle.
     */
    maskIconLabel?: Props<V>['maskIconLabel'];
    /**
     * Specifies the component's max width.  If unset, the default max width is 100%.
     */
    maxWidth?: Props<V>['maxWidth'];
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
    messagesCustom?: Props<V>['messagesCustom'];
    /**
     * The placeholder text to set on the element.
     */
    placeholder?: Props<V>['placeholder'];
    /**
     * <p>
     * Whether the component is readonly. The readonly property sets or returns whether an element
     * is readonly, or not. A readonly element cannot be modified. However, a user can tab to it,
     * highlight it, focus on it, and copy the text from it. If "readonly" is set to "true"
     * and "mask-icon" is set to "visible", a user can still toggle the visibility of the sensitive text.
     * If you want to prevent the user from interacting with the element, use the disabled property instead.
     * </p>
     * <p>
     * If the property value is not set either directly on the component or inherited from
     * a parent form layout, then the property is treated as if its value were false.
     * </p>
     */
    readonly?: Props<V>['readonly'];
    /**
     * <p>
     * Specifies which user assistance types should be shown when the component is readonly.
     * </p>
     */
    readonlyUserAssistanceShown?: Props<V>['readonlyUserAssistanceShown'];
    /**
     * <p>
     * This property set to <code class="prettyprint">false</code> implies that a value is not required to be provided by the user.
     * This is the default.
     * This property set to <code class="prettyprint">true</code> implies that a value is required to be provided by the user.
     * </p>
     * <p>
     * In the Redwood theme, by default, a Required text is rendered inline when the field is empty.
     * If user-assistance-density is 'compact', it will show on the label as an icon.
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
    required?: Props<V>['required'];
    /**
     * <p>
     * The component-specific message detail when the required validation fails.
     * If the component needs a required validation error message that is different from the default,
     * set this property. It should be a translated string.
     * </p>
     */
    requiredMessageDetail?: Props<V>['requiredMessageDetail'];
    /**
     * Specifies how the text is aligned within the text field
     */
    textAlign?: Props<V>['textAlign'];
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
    userAssistanceDensity?: Props<V>['userAssistanceDensity'];
    /**
     * List of validators, synchronous or asynchronous,
     * used by the component
     * and the implicit component validators when performing validation. Each item is either an
     * instance that duck types oj.Validator or oj.AsyncValidator.
     * <p>
     * Implicit validators are created by the element when certain attributes are present.
     * For example, if the <code class="prettyprint">required</code> attribute
     * is set, an implicit oj.RequiredValidator is created.
     * At runtime when the component runs validation, it
     * combines all the implicit validators with all the validators
     * specified through this <code class="prettyprint">validators</code> attribute
     * and the <code class="prettyprint">async-validators</code> attribute, and
     * runs all of them.
     * </p>
     * <p>
     * Hints exposed by validators are shown inline by default in the Redwood theme when the
     * field has focus.
     * You can turn off showing validator hints by using the
     * 'validatorHint' property set to 'none' on the <code class="prettyprint">display-options</code>
     * attribute.
     * </p>
     * <p>
     * In the Redwood theme, only one hint shows at a time, so the precedence rules are:
     * help.instruction shows; if no help.instruction then validator hints show;
     * if none, then help-hints.definition shows; if none, then converter hint shows.
     * help-hints.source always shows along with the other help or hint.
     * </p>
     *
     * <p>
     * When <code class="prettyprint">validators</code> property changes due to programmatic
     * intervention, the component may decide to clear messages and run validation, based on the
     * current state it is in. </br>
     *
     * <h4>Steps Performed Always</h4>
     * <ul>
     * <li>The cached list of validator instances are cleared and new validator hints is pushed to
     * messaging.
     * </li>
     * </ul>
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>if component is valid when validators changes, component does nothing other than the
     * steps it always performs.</li>
     * <li>if component is invalid and is showing messages when
     * <code class="prettyprint">validators</code> or
     * <code class="prettyprint">async-validators</code> changes then all component messages
     *  are cleared and full validation run using the display value on the component.
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code>
     *   property is not updated and the error is shown.
     *   </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
     *   event to clear custom errors.</li>
     * </ul>
     * </li>
     * <li>if component is invalid and has deferred messages when validators changes, it does
     * nothing other than the steps it performs always.</li>
     * </ul>
     * </p>
     *
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>Only messages created by the component are cleared.</li>
     * <li><code class="prettyprint">messagesCustom</code> property is not cleared.</li>
     * </ul>
     * </p>
     */
    validators?: Props<V>['validators'];
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
     * When the input field is cleared and the value is committed, the <code class="prettyprint">value</code>
     * property is set to <code>null</code>.
     * </p>
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>component always runs deferred validation; the
     * <code class="prettyprint">valid</code> property is updated with the result.</li>
     * </ul>
     */
    value?: Props<V>['value'];
    /**
     * The type of virtual keyboard to display for entering a value on mobile browsers. This attribute has no effect on desktop browsers.
     */
    virtualKeyboard?: Props<V>['virtualKeyboard'];
    /**
     * Specifies the component's width.  If unset, the default width is 100%.
     * Note that by default max-width is 100%, which will override the width if the container is smaller than the width specified.
     */
    width?: Props<V>['width'];
}
export interface CInputSensitiveTextElementSettablePropertiesLenient<V> extends Partial<CInputSensitiveTextElementSettableProperties<V>> {
    [key: string]: any;
}
export interface InputSensitiveTextIntrinsicProps extends Partial<Readonly<CInputSensitiveTextElementSettableProperties<any>>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    rawValue?: never;
    valid?: never;
    onclearIconChanged?: (value: CInputSensitiveTextElementEventMap<any>['clearIconChanged']) => void;
    oncolumnSpanChanged?: (value: CInputSensitiveTextElementEventMap<any>['columnSpanChanged']) => void;
    oncontainerReadonlyChanged?: (value: CInputSensitiveTextElementEventMap<any>['containerReadonlyChanged']) => void;
    ondisabledChanged?: (value: CInputSensitiveTextElementEventMap<any>['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: CInputSensitiveTextElementEventMap<any>['displayOptionsChanged']) => void;
    onhelpChanged?: (value: CInputSensitiveTextElementEventMap<any>['helpChanged']) => void;
    onhelpHintsChanged?: (value: CInputSensitiveTextElementEventMap<any>['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: CInputSensitiveTextElementEventMap<any>['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: CInputSensitiveTextElementEventMap<any>['labelHintChanged']) => void;
    onlabelStartWidthChanged?: (value: CInputSensitiveTextElementEventMap<any>['labelStartWidthChanged']) => void;
    /** @deprecated since 18.0.0 */ onlabelWrappingChanged?: (value: CInputSensitiveTextElementEventMap<any>['labelWrappingChanged']) => void;
    onlengthChanged?: (value: CInputSensitiveTextElementEventMap<any>['lengthChanged']) => void;
    onmaskIconChanged?: (value: CInputSensitiveTextElementEventMap<any>['maskIconChanged']) => void;
    onmaskIconLabelChanged?: (value: CInputSensitiveTextElementEventMap<any>['maskIconLabelChanged']) => void;
    onmaxWidthChanged?: (value: CInputSensitiveTextElementEventMap<any>['maxWidthChanged']) => void;
    onmessagesCustomChanged?: (value: CInputSensitiveTextElementEventMap<any>['messagesCustomChanged']) => void;
    onplaceholderChanged?: (value: CInputSensitiveTextElementEventMap<any>['placeholderChanged']) => void;
    onrawValueChanged?: (value: CInputSensitiveTextElementEventMap<any>['rawValueChanged']) => void;
    onreadonlyChanged?: (value: CInputSensitiveTextElementEventMap<any>['readonlyChanged']) => void;
    onreadonlyUserAssistanceShownChanged?: (value: CInputSensitiveTextElementEventMap<any>['readonlyUserAssistanceShownChanged']) => void;
    onrequiredChanged?: (value: CInputSensitiveTextElementEventMap<any>['requiredChanged']) => void;
    onrequiredMessageDetailChanged?: (value: CInputSensitiveTextElementEventMap<any>['requiredMessageDetailChanged']) => void;
    ontextAlignChanged?: (value: CInputSensitiveTextElementEventMap<any>['textAlignChanged']) => void;
    onuserAssistanceDensityChanged?: (value: CInputSensitiveTextElementEventMap<any>['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: CInputSensitiveTextElementEventMap<any>['validChanged']) => void;
    onvalidatorsChanged?: (value: CInputSensitiveTextElementEventMap<any>['validatorsChanged']) => void;
    onvalueChanged?: (value: CInputSensitiveTextElementEventMap<any>['valueChanged']) => void;
    onvirtualKeyboardChanged?: (value: CInputSensitiveTextElementEventMap<any>['virtualKeyboardChanged']) => void;
    onwidthChanged?: (value: CInputSensitiveTextElementEventMap<any>['widthChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-input-sensitive-text': InputSensitiveTextIntrinsicProps;
        }
    }
}
