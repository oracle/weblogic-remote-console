import { CalendarMonth, CalendarMonthRequired, InputDateMask as PreactInputDateMask } from '@oracle/oraclejet-preact/UNSAFE_InputDateMask';
import { DisplayOptions, Help, HelpHints } from 'oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText';
import Validator = require('ojs/ojvalidator');
import AsyncValidator = require('ojs/ojvalidator-async');
import { ExtendGlobalProps, ObservedGlobalProps, PropertyChanged, ReadOnlyPropertyChanged } from 'ojs/ojvcomponent';
import { ComponentProps, ComponentType, Ref } from 'preact';
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
import { LayoutColumnSpan } from '@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout';
import 'css!oj-c/input-month-mask/input-month-mask-styles.css';
import type { OverflowMessageDetailParameters, UnderflowMessageDetailParameters } from './CalendarMonthRangeValidator';
type PreactInputDateMaskProps = ComponentProps<typeof PreactInputDateMask>;
/**
 * Various supported valid states
 */
type ValidState = 'valid' | 'pending' | 'invalidHidden' | 'invalidShown';
/**
 * Display options for auxiliary content that determines whether or not it should be displayed.
 */
type DisplayOptionsProps = Omit<DisplayOptions, 'converterHint'>;
/**
 * The properties of the InputMonthMask component
 */
type Props = ObservedGlobalProps<'aria-describedby' | 'id'> & {
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
     * <p>
     * A callback function that returns a component-specific message detail when the date range validation fails when user's input is greater than the max.
     * If the component needs a validation error message for overflow that is different from the default,
     * set this property. The function should return a translated string.
     * </p>
     * Usage: <br/>
     * dateRangeOverflowMessageDetail = (p: { value: string; max: string }) => `The date ${p.value} is too high. Max limit is ${p.max}.`<br/>
     * dateRangeOverflowMessageDetail = (p: {max: string }) => `The date needs to be on or before ${p.max}.`<br/>
     * dateRangeOverflowMessageDetail = () => `The date is out of range.`
     *
     * @ojmetadata description "Overrides the default validator's rangeOverflow message detail."
     * @ojmetadata displayName "Date Range Overflow Message Detail"
     * @ojmetadata help "#dateRangeOverflowMessageDetail"
     */
    dateRangeOverflowMessageDetail?: (p: OverflowMessageDetailParameters) => string;
    /**
     * @description
     * <p>
     * A callback function that returns a component-specific message when the date range validation fails when the user's input is less than the min.
     * If the component needs a validation error message for underflow that is different from the default,
     * set this property. The function should return a translated string.
     * </p>
     * Usage: <br/>
     * dateRangeUnderflowMessageDetail = (p: { value: string; min: string }) => `The date ${p.value} is too low. Min limit is ${p.min}.`<br/>
     * dateRangeUnderflowMessageDetail = (p: {min: string }) => `The date is too low. Min limit is ${p.min}.`<br/>
     * dateRangeUnderflowMessageDetail = () => `The date is out of range.`
     * @ojmetadata description "Overrides the default validator's rangeUnderflow message detail."
     * @ojmetadata displayName "Date Range Underflow Message Detail"
     * @ojmetadata help "#dateRangeUnderflowMessageDetail"
     */
    dateRangeUnderflowMessageDetail?: (p: UnderflowMessageDetailParameters) => string;
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
    labelEdge?: PreactInputDateMaskProps['labelEdge'];
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
     * The maximum selectable year and month.
     * The year and month the user enters must be less than or equal to the max year and month, otherwise the user will see an error.
     * This must be an object with year and month defined, {year: number, month: IsoMonth},
     * where the IsoMonth type is a number 1-12, month: 1 for January, month: 2 for February, and so on.
     * If not, an error will be thrown and the component will not render.
     * When set to null, there is no maximum.
     *
     * @ojmetadata description "The maximum selectable year and month"
     * @ojmetadata displayName "Max"
     * @ojmetadata help "#max"
     */
    max?: CalendarMonthRequired | null;
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
    messagesCustom?: PreactInputDateMaskProps['messages'];
    /**
     * @description
     * The minimum selectable year and month.
     * The year and month the user enters must be greater than or equal to the min year and month, otherwise the user will see an error.
     * This must be an object with year and month defined, {year: number, month: IsoMonth},
     * where the IsoMonth type is a number 1-12, month: 1 for January, month: 2 for February, and so on.
     * If not, an error will be thrown and the component will not render.
     * When set to null, there is no minimum.
     *
     * @ojmetadata description "The minimum selectable year and month"
     * @ojmetadata displayName "Min"
     * @ojmetadata help "#min"
     */
    min?: CalendarMonthRequired | null;
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
     * If user-assistance-density is 'compact', it will show on the label as an icon.
     * </p>
     * <p>The Required error text is based on Redwood UX designs, and it is not recommended that it be changed.
     * To override the required error message,
     * use the <code class="prettyprint">required-message-detail</code> attribute.
     * The component's label text is passed in as a token {label} and can be used in the message detail.
     * </p>
     * <p>When required is set to true, an implicit required validator is created, i.e.,
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
    textAlign?: PreactInputDateMaskProps['textAlign'];
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
    userAssistanceDensity?: PreactInputDateMaskProps['userAssistanceDensity'];
    /**
     * @description
     * List of validators, synchronous or asynchronous, used by the component
     * when performing validation. Each item is either an
     * instance that duck types oj.Validator or oj.AsyncValidator.
     * <p>
     * At runtime when the component runs validation, it
     * combines all the validators
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
    validators?: (AsyncValidator<CalendarMonthRequired> | Validator<CalendarMonthRequired>)[] | null;
    /**
     * @description
     * The value of the component.
     * <p>The value must be an object with year and month defined, {year: number, month: IsoMonth},
     * where the IsoMonth type is a number 1-12, month: 1 for January, month: 2 for February, and so on.
     * If not, the component will throw an error and not render.</p>
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
    value?: CalendarMonthRequired | null;
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
    onMessagesCustomChanged?: PropertyChanged<PreactInputDateMaskProps['messages']>;
    /**
     * @description
     * <p>The  <code class="prettyprint">rawValue</code> is the read-only property for retrieving
     * the current displayed value from the component.</p>
     * <p>
     * The <code class="prettyprint">rawValue</code> updates when the user types into the field,
     * so the <code class="prettyprint">rawValue</code> changes as the value of the field is changed,
     * whether or not it is valid.
     * If the user types '2023' into the year field in an otherwise empty field,
     * the rawValue will be {year:2, month:undefined}, then {year:20, month:undefined},
     * then {year:202, month:undefined},
     * and finally {year:2023, month:undefined}. When the user blurs or presses
     * Enter the <code class="prettyprint">rawValue</code> property gets parsed into a CalendarMonthRequired object. An error is thrown if
     * the year and month are not both defined. Then the CalendarMonthRequired object gets validated. If valid, the <code class="prettyprint">value</code> property
     * gets updated with the CalendarMonthRequired object, {year: number, month: number}.
     * </p>
     * <p>If the user clears the field, rawValue is undefined.
     * </p>
     * <p>This is a read-only attribute so page authors cannot set or change it directly.</p>
     *
     * @ojmetadata description "Specifies how the raw value of the component"
     * @ojmetadata displayName "Raw Value"
     * @ojmetadata help "#rawValue"
     */
    onRawValueChanged?: ReadOnlyPropertyChanged<CalendarMonth | undefined>;
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
     * @ojmetadata description "Specifies how the valid state of the component"
     * @ojmetadata displayName "Valid"
     * @ojmetadata help "#valid"
     * @ojmetadata propertyEditorValues {
     *   "valid": {
     *     "description": "The component is valid",
     *     "displayName": "Valid"
     *   },
     *   "pending": {
     *     "description": "The component is waiting for the validation state to be determined. The 'pending' state is set at the start of the validation process.",
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
    onValueChanged?: PropertyChanged<CalendarMonthRequired | null>;
};
type InputMonthMaskHandle = {
    /**
     * @ojmetadata description "Blurs the field."
     * @ignore
     */
    blur: () => void;
    /**
     * @ojmetadata description "Focuses the field."
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
     * User entered values will be erased when this method is called.
     * @ojmetadata description "Resets the component by clearing all messages
     * and updating the component's display value using the attribute value."
     */
    reset: () => void;
    /**
     * If enabled, validates the component's display value using the component's implicit converter
     * and all validators registered on the component and updates the value
     * option by performing the following steps.
     * <ol>
     * <li>All messages are cleared, including custom messages added by the app.</li>
     * <li>If the UI display value is empty, then the component normalizes the value to null.</li>
     * <li>
     *  If the normalized value is null, then processing continues to next step. Otherwise,
     *  the UI value is first converted (i.e., parsed). If there is a parse error (the field does not contain both a month
     *  and a year) then the message is shown and processing stops.
     * </li>
     * <li>
     *  If required is true, the implicit required validator is run. If the required validator throws an error, the message is shown.
     * </li>
     * <li>
     *  If there are no other validators registered on the component, or if the UI display value is empty,
     *  the value option is updated.
     *
     *  Otherwise all validators are run in sequence using the parsed value from the previous step.
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
     *          parse errors or if there were validation errors
     *
     * @ojmetadata description "If enabled, validates the component's display value using the converter and all validators
     * registered on the component. The Promise resolves to 'valid' if there were no converter parse errors and the component
     * passed all validations, or if the component is disabled or readonly."
     */
    validate: () => Promise<'valid' | 'invalid'>;
};
/**
 * @classdesc
 * <h3 id="InputMonthMaskOverview-section">
 *   JET Input Month Mask Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#InputMonthMaskOverview-section"></a>
 * </h3>
 *
 * <p>Description: A JET Input Month Mask allows a user to individually edit, step, or spin the
 * values of the month and year fields of a calendar month and year.</p>
 *
 * <pre class="prettyprint"><code>&lt;oj-c-input-month-mask label-hint="Expiration Date">&lt;/oj-c-input-month-mask></code></pre>
 *
 * <h3 id="validation-section">
 *   Validation and Messaging
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#validation-section"></a>
 * </h3>
 *
 * <p>
 * For components that support validators, any invalid values entered by the user are not pushed into the value
 * if validation fails: the <a href="#valid">valid property</a> will change but the original value will remain unchanged.
 * The same thing applies to required validation: if required is set to true and the user clears the field,
 * valid will change, but empty values will not be pushed so the original value remains unchanged.
 * </p>
 * <p>
 * Use <a href="../jetCookbook.html?component=validationGroup&demo=requiredFieldValidation">
 * &lt;oj-validation-group></a> to handle tracking valid across multiple components.
 * </p>
 * <p>
 * An editable component runs validation (normal or deferred) based on the action performed on it
 * (either by end-user or page author), and the state it was in when the action occurred. Examples
 * of actions are - creating a component, user changing the value of the component by interacting
 * with it, the app setting a value programmatically, the app calling the validate() method etc. At
 * the time the action occurs, the component could already be showing errors, or can have a deferred
 * error or have no errors.
 * </p>
 * <p>
 * These factors also determine whether validation errors/messages get shown to the user immediately
 * or get deferred. The following sections highlight the kinds of validation that are run and how
 * messages get handled.
 * </p>
 *
 * <h4 id="normal-validation-section">
 *   Normal Validation
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#normal-validation-section"></a>
 * </h4>
 * Normal validation is run in the following cases on the display value, using the converter and
 * validators (this includes async-validators) set on the component (for components that support these properties),

 * and validation errors are reported to user immediately.
 * <ul>
 * <li>When value changes as a result of user interaction all messages are cleared, including custom
 * messages added by the app, and full validation is run on the UI value. The steps performed are
 * outlined below.
 * <ol>
 * <li>All messages are cleared and <code class="prettyprint">messagesCustom</code> property is cleared</li>
 * <li>If no converter is present then processing continues to next step. If a converter is
 * present (even if it the component's implicit converter), the UI value is first converted (i.e., parsed).
 * If there is a parse error then the messages are shown and processing returns.</li>
 * <li>If there are no validators setup for the component then the value is set on the component.
 * Otherwise all validators are run in sequence using the parsed value from the previous step. The
 * implicit required validator is run first if the component is marked required. When a validation error is
 * encountered it is remembered and the next validator in the sequence is run.
 * <ul><li>NOTE: The value is trimmed before required validation is run</li></ul>
 * </li>
 * <li>At the end of the validation run if there are errors, the messages are shown
 * and processing returns. If there are async-validators, those errors are shown as soon as they
 * come in, and not until all validators, sync and async validators, are complete, does processing
 * return, that is, value and valid are updated. If there are no errors, then the
 * <code class="prettyprint">value</code> property is updated and the formatted value displayed on the
 * UI.</li>
 * </ol>
 * </li>
 * <li>When the <code class="prettyprint">validate</code> method is called by app, all messages are
 * cleared and full validation is run using the display value. See <code class="prettyprint">validate</code>
 * method on the sub-classes for details. Note: JET validation is designed to catch user input errors, and not invalid
 * data passed from the server; this should be caught on the server.</li>
 * <li>When certain properties change through programmatic intervention by app, the component
 * determines whether it needs to run normal validation based on the state the component is in.
 * Refer to the <a href="#mixed-validation-section">Mixed Validation</a> section below for details. </li>
 * </ul>
 *
 * <h4 id="deferred-validation-section">
 *   Deferred Validation
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#deferred-validation-section"></a>
 * </h4>
 * Deferred validation is run in the following cases on the component value using the implicit
 * required validator if required is true, and validation errors are deferred, i.e., not shown to user immediately.
 * Refer to the <a href="#deferred-messages-section">Showing Deferred Messages</a> section to
 * understand how deferred messages can be shown.
 * <ul>
 *  <li>When a component is created and it is required deferred validation is run and no messages are cleared
 *  prior to running validation.
 *  Refer to the <a href="#deferred-validators-section">Validators
 *  Participating in Deferred Validation</a> section for details.</li>
 *  <li>When the <code class="prettyprint">value</code> property changes due to programmatic
 *  intervention deferred validation is run, after all messages and messagesCustom property are cleared.</li>
 *  <li>When the <code class="prettyprint">reset</code> method is called, deferred validation is run
 *   after all messages and messagesCustom property are cleared.</li>
 *  <li>When certain properties change through programmatic intervention by app, the component
 *  determines whether it needs to run deferred validation based on the state the component is in.
 *  Refer to the <a href="#mixed-validation-section">Mixed Validation</a> section below for details.</li>
 * </ul>
 *
 * <h4 id="mixed-validation-section">
 *   Mixed Validation
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#mixed-validation-section"></a>
 * </h4>
 * Either deferred or normal validation is run in the following cases based on the state the
 * component is in and any validation errors encountered are either hidden or shown to user.
 * <ul>
 *  <li>when disabled property changes. See <a href="#disabled">disabled</a> property for details.</li>
 *  <li>when converter property (if available) changes.</li>
 *  <li>when required property changes. See <a href="#required">required</a> property for details.</li>
 *  <li>when validators property changes (for components that support validators). See <a href="#validators">validators</a> property for details.</li>
 * </ul>
 *
 * <h3 id="deferred-messages-section">
 *   Showing Deferred Messages
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#deferred-messages-section"></a>
 * </h3>
 * Deferred validation messages are displayed only when page author requests for it explicitly in
 * one of the following ways:
 * <ul>
 * <li>calls the <a href="#showMessages"><code class="prettyprint">showMessages</code></a> method on the component</li>
 * </ul>
 *
 * <h3 id="deferred-validators-section">
 *   Validators Participating in Deferred Validation
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#deferred-validators-section"></a>
 * </h3>
 * The required validator is the only validator type that participates in deferred validation.
 * The required property needs to be set to true for the required validator to run.
 *
 * <h3 id="user-assistance-text-section">
 *   User Assistance Text
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#user-assistance-text-section"></a>
 * </h3>
 * <p>
 * User assistive text provides guidance to help the user understand what data to enter or select.
 * </p>
 * <p>
 * By default all user assistance text shows inline.
 * For input components, it shows when the field takes focus. In other components
 * it shows all the time. See the user-assistance-density property for other ways
 * the user assistance text can render, like in 'compact' mode, it will render as an icon on the label
 * which when clicked will show the user assistance text in a notewindow.
 * </p>
 * <p>
 * The JET form component properties that are used for user assistance text are help.instruction,
 * validator and converter hints (for components that support these properties), and help-hints.
 * In the Redwood theme for clarity only one user assistance text shows to the user.
 * The precedence rules are:
 * <ul>
 * <li>help.instruction shows;</li>
 * <li>if no help.instruction, then validator hint shows;</li>
 * <li>if no help.instruction or validator hint, then help-hints.definition shows;</li>
 * <li>if no help.instruction, validator hint, or help-hints.definition, then converter hint shows.</li>
 * <li>help-hints.source always shows along side the above.</li>
 * </ul>
 * </p>
 * <p>For components that support validators or converters, sometimes a hint shows that you do not want to show. To not show it,
 *  set the display-options.validator-hint and/or display-options.converter-hint property to 'none'.
 * </p>
 * <p>required property can be used to guide the user.
 * In Redwood, a required field shows the word Required under the field
 * when the field is empty and does not have focus.
 * The mask placeholder is shown when the field is empty and has focus. The mask placeholder is not configurable.
 * </p>
 *
 * <h3 id="touch-section">
 *   Touch End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
 * </h3>
 *
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Gesture</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Field (Not a Segment)</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Sets focus to first segment. Show user assistance text.</td>
 *     </tr>
 *     <tr>
 *       <td>Segment</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Sets focus to segment. Show user assistance text.</td>
 *     </tr>
 *     <tr>
 *       <td>Segment</td>
 *       <td><kbd>Double Tap</kbd></td>
 *       <td>If the date is complete (both month and year are filled in), selects the entire date. Hitting backspace clears it.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="keyboard-section">
 *   Keyboard End User Information
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
 * </h3>
 *
 * <table class="keyboard-table">
 *   <thead>
 *     <tr>
 *       <th>Target</th>
 *       <th>Key</th>
 *       <th>Action</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>Field</td>
 *       <td><kbd>Tab In</kbd></td>
 *       <td>Sets focus to first segment. Show user assistance text.</td>
 *     </tr>
 *     <tr>
 *       <td>Field</td>
 *       <td><kbd>Control + A or Command + A</kbd></td>
 *       <td>If the date is complete (both month and year are filled in), selects the entire date. Double clicking on the field also selects the date.</td>
 *     </tr>
 *     <tr>
 *       <td>Field with date selected</td>
 *       <td><kbd>Backspace/Delete</kbd></td>
 *       <td>If the date is complete (both month and year are filled in), double click on the field selects the entire date. Backspace or delete key clears the date. The mask placeholders will be shown again and focus will be on the first segment.</td>
 *     </tr>
 *     <tr>
 *       <td>Date Segment</td>
 *       <td><kbd>Backspace/Delete</kbd></td>
 *       <td>Clears the date segment. Focus remains on the date segment.</td>
 *     </tr>
 *     <tr>
 *       <td>Date Segment</td>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Moves focus to the segment on the right. If focus is on the rightmost segment, the focus does not move.</td>
 *     </tr>
 *     <tr>
 *       <td>Date Segment</td>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Moves focus to the segment on the left. If focus is on the leftmost segment, the focus does not move.</td>
 *     </tr>
 *    <tr>
 *       <td>Date Segment</td>
 *       <td><kbd>UpArrow/DownArrow</kbd></td>
 *       <td>Increments or decrements the number by one in the segment. If there is no number in the segment, it initializes it to the current month and year.</td>
 *     </tr>
 *    <tr>
 *       <td>Date Segment</td>
 *       <td><kbd>End</kbd></td>
 *       <td>Increments the segment to the maximum number for the segment. For example, if on the month segment, this will set the number to 12. If on the year segment, this will set the number to 2100.</td>
 *     </tr>
 *    <tr>
 *       <td>Date Segment</td>
 *       <td><kbd>Home</kbd></td>
 *       <td>Decrements the segment to the minimum number for the segment. For example, if on the month segment, this will set the number to 1. If on the year segment, this will set the number to 1900.</td>
 *     </tr>
 *    <tr>
 *       <td>Date Segment</td>
 *       <td><kbd>Page Up/Page Down</kbd></td>
 *       <td>Increments or decrements the number by two in the month segment or by five in the year segment. If there is no number in the segment, it initializes it to the current month and year.</td>
 *     </tr>
 *   </tbody>
 * </table>
 *
 * <h3 id="a11y-section">
 *   Accessibility
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
 * </h3>
 *
 * <p>
 * For accessibility, set the <a href="#labelHint">label-hint</a> property.
 * If there is no visible label, then to make this accessible to screen reader users,
 * set the <a href="#labelHint">label-hint</a> and <a href="#labelEdge">label-edge</a>='none'
 * which renders an aria-label with the label-hint text.
 * </p>
 *
 *
 * <p>
 * Disabled content: JET supports an accessible luminosity contrast ratio,
 * as specified in <a href="http://www.w3.org/TR/WCAG20/#visual-audio-contrast-contrast">WCAG 2.0 - Section 1.4.3 "Contrast"</a>,
 * in the themes that are accessible.  (See the "Theming" chapter of the JET Developer Guide for more information on which
 * themes are accessible.)  Note that Section 1.4.3 says that text or images of text that are part of an inactive user
 * interface component have no contrast requirement.  Because disabled content may not meet the minimum contrast ratio
 * required of enabled content, it cannot be used to convey meaningful information.
 * </p>
 *
 * @ojmetadata displayName "InputMonthMask"
 * @ojmetadata description "An input month mask field allows a user to individually edit, step, or spin the values of the month and year fields."
 * @ojmetadata help "oj-c.InputMonthMask.html"
 * @ojmetadata main "oj-c/input-month-mask"
 * @ojmetadata status [
 *   {
 *     type: "production",
 *     since: "17.0.0"
 *   }
 * ]
 * @ojmetadata extension {
 *   "catalog": {
 *     "category": "Forms"
 *   },
 *   "vbdt": {
 *     "module": "oj-c/input-month-mask",
 *     "defaultColumns": 6,
 *     "minColumns": 2
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-date",
 *     "uxSpecs": [
 *       "input-month-mask"
 *     ]
 *   }
 * }
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "common",
 *     "items": [
 *       "disabled",
 *       "labelHint",
 *       "readonly",
 *       "required"
 *     ]
 *   },
 *   {
 *     "propertyGroup": "data",
 *     "items": [
 *       "value"
 *     ]
 *   }
 * ]
 * @ojmetadata since "16.1.0"
 * @ojmetadata requirements [
 *  {
 *    type: "anyOf",
 *    label: "accessibility",
 *    properties: ["labelHint"]
 *  },
 *  {
 *    type: "not",
 *    label: "accessibility",
 *    properties: ["aria-label", "aria-labelledby"]
 *  }
 * ]
 */
declare const InputMonthMaskImpl: ({ columnSpan, containerReadonly: propContainerReadonly, disabled, displayOptions, help, helpHints, labelWrapping: propLabelWrapping, messagesCustom, readonly: propReadonly, readonlyUserAssistanceShown, required, textAlign: propTextAlign, userAssistanceDensity: propUserAssistanceDensity, validators, value, ...otherProps }: Props, ref: Ref<InputMonthMaskHandle>) => import("preact").JSX.Element;
/**
 * This export corresponds to the InputMonthMask Preact component. For the oj-c-input-month-mask custom element, import CInputMonthMaskElement instead.
 */
export declare const InputMonthMask: ComponentType<ExtendGlobalProps<ComponentProps<typeof InputMonthMaskImpl>> & {
    ref?: Ref<InputMonthMaskHandle>;
}>;
export type InputMonthMaskProps = Props;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-input-month-mask custom element. For the InputMonthMask Preact component, import InputMonthMask instead.
 */
export interface CInputMonthMaskElement extends JetElement<CInputMonthMaskElementSettableProperties>, CInputMonthMaskElementSettableProperties {
    /**
     * <p>The  <code class="prettyprint">rawValue</code> is the read-only property for retrieving
     * the current displayed value from the component.</p>
     * <p>
     * The <code class="prettyprint">rawValue</code> updates when the user types into the field,
     * so the <code class="prettyprint">rawValue</code> changes as the value of the field is changed,
     * whether or not it is valid.
     * If the user types '2023' into the year field in an otherwise empty field,
     * the rawValue will be {year:2, month:undefined}, then {year:20, month:undefined},
     * then {year:202, month:undefined},
     * and finally {year:2023, month:undefined}. When the user blurs or presses
     * Enter the <code class="prettyprint">rawValue</code> property gets parsed into a CalendarMonthRequired object. An error is thrown if
     * the year and month are not both defined. Then the CalendarMonthRequired object gets validated. If valid, the <code class="prettyprint">value</code> property
     * gets updated with the CalendarMonthRequired object, {year: number, month: number}.
     * </p>
     * <p>If the user clears the field, rawValue is undefined.
     * </p>
     * <p>This is a read-only attribute so page authors cannot set or change it directly.</p>
     */
    readonly rawValue?: Parameters<Required<Props>['onRawValueChanged']>[0];
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
    readonly valid?: Parameters<Required<Props>['onValidChanged']>[0];
    addEventListener<T extends keyof CInputMonthMaskElementEventMap>(type: T, listener: (this: HTMLElement, ev: CInputMonthMaskElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CInputMonthMaskElementSettableProperties>(property: T): CInputMonthMaskElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CInputMonthMaskElementSettableProperties>(property: T, value: CInputMonthMaskElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CInputMonthMaskElementSettableProperties>): void;
    setProperties(properties: CInputMonthMaskElementSettablePropertiesLenient): void;
    blur: () => void;
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
     * If enabled, validates the component's display value using the component's implicit converter
     * and all validators registered on the component and updates the value
     * option by performing the following steps.
     * <ol>
     * <li>All messages are cleared, including custom messages added by the app.</li>
     * <li>If the UI display value is empty, then the component normalizes the value to null.</li>
     * <li>
     *  If the normalized value is null, then processing continues to next step. Otherwise,
     *  the UI value is first converted (i.e., parsed). If there is a parse error (the field does not contain both a month
     *  and a year) then the message is shown and processing stops.
     * </li>
     * <li>
     *  If required is true, the implicit required validator is run. If the required validator throws an error, the message is shown.
     * </li>
     * <li>
     *  If there are no other validators registered on the component, or if the UI display value is empty,
     *  the value option is updated.
     *
     *  Otherwise all validators are run in sequence using the parsed value from the previous step.
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
export namespace CInputMonthMaskElement {
    type columnSpanChanged = JetElementCustomEventStrict<CInputMonthMaskElement['columnSpan']>;
    type containerReadonlyChanged = JetElementCustomEventStrict<CInputMonthMaskElement['containerReadonly']>;
    type dateRangeOverflowMessageDetailChanged = JetElementCustomEventStrict<CInputMonthMaskElement['dateRangeOverflowMessageDetail']>;
    type dateRangeUnderflowMessageDetailChanged = JetElementCustomEventStrict<CInputMonthMaskElement['dateRangeUnderflowMessageDetail']>;
    type disabledChanged = JetElementCustomEventStrict<CInputMonthMaskElement['disabled']>;
    type displayOptionsChanged = JetElementCustomEventStrict<CInputMonthMaskElement['displayOptions']>;
    type helpChanged = JetElementCustomEventStrict<CInputMonthMaskElement['help']>;
    type helpHintsChanged = JetElementCustomEventStrict<CInputMonthMaskElement['helpHints']>;
    type labelEdgeChanged = JetElementCustomEventStrict<CInputMonthMaskElement['labelEdge']>;
    type labelHintChanged = JetElementCustomEventStrict<CInputMonthMaskElement['labelHint']>;
    type labelStartWidthChanged = JetElementCustomEventStrict<CInputMonthMaskElement['labelStartWidth']>;
    type labelWrappingChanged = JetElementCustomEventStrict<CInputMonthMaskElement['labelWrapping']>;
    type maxChanged = JetElementCustomEventStrict<CInputMonthMaskElement['max']>;
    type maxWidthChanged = JetElementCustomEventStrict<CInputMonthMaskElement['maxWidth']>;
    type messagesCustomChanged = JetElementCustomEventStrict<CInputMonthMaskElement['messagesCustom']>;
    type minChanged = JetElementCustomEventStrict<CInputMonthMaskElement['min']>;
    type rawValueChanged = JetElementCustomEventStrict<CInputMonthMaskElement['rawValue']>;
    type readonlyChanged = JetElementCustomEventStrict<CInputMonthMaskElement['readonly']>;
    type readonlyUserAssistanceShownChanged = JetElementCustomEventStrict<CInputMonthMaskElement['readonlyUserAssistanceShown']>;
    type requiredChanged = JetElementCustomEventStrict<CInputMonthMaskElement['required']>;
    type requiredMessageDetailChanged = JetElementCustomEventStrict<CInputMonthMaskElement['requiredMessageDetail']>;
    type textAlignChanged = JetElementCustomEventStrict<CInputMonthMaskElement['textAlign']>;
    type userAssistanceDensityChanged = JetElementCustomEventStrict<CInputMonthMaskElement['userAssistanceDensity']>;
    type validChanged = JetElementCustomEventStrict<CInputMonthMaskElement['valid']>;
    type validatorsChanged = JetElementCustomEventStrict<CInputMonthMaskElement['validators']>;
    type valueChanged = JetElementCustomEventStrict<CInputMonthMaskElement['value']>;
    type widthChanged = JetElementCustomEventStrict<CInputMonthMaskElement['width']>;
}
export interface CInputMonthMaskElementEventMap extends HTMLElementEventMap {
    'columnSpanChanged': JetElementCustomEventStrict<CInputMonthMaskElement['columnSpan']>;
    'containerReadonlyChanged': JetElementCustomEventStrict<CInputMonthMaskElement['containerReadonly']>;
    'dateRangeOverflowMessageDetailChanged': JetElementCustomEventStrict<CInputMonthMaskElement['dateRangeOverflowMessageDetail']>;
    'dateRangeUnderflowMessageDetailChanged': JetElementCustomEventStrict<CInputMonthMaskElement['dateRangeUnderflowMessageDetail']>;
    'disabledChanged': JetElementCustomEventStrict<CInputMonthMaskElement['disabled']>;
    'displayOptionsChanged': JetElementCustomEventStrict<CInputMonthMaskElement['displayOptions']>;
    'helpChanged': JetElementCustomEventStrict<CInputMonthMaskElement['help']>;
    'helpHintsChanged': JetElementCustomEventStrict<CInputMonthMaskElement['helpHints']>;
    'labelEdgeChanged': JetElementCustomEventStrict<CInputMonthMaskElement['labelEdge']>;
    'labelHintChanged': JetElementCustomEventStrict<CInputMonthMaskElement['labelHint']>;
    'labelStartWidthChanged': JetElementCustomEventStrict<CInputMonthMaskElement['labelStartWidth']>;
    'labelWrappingChanged': JetElementCustomEventStrict<CInputMonthMaskElement['labelWrapping']>;
    'maxChanged': JetElementCustomEventStrict<CInputMonthMaskElement['max']>;
    'maxWidthChanged': JetElementCustomEventStrict<CInputMonthMaskElement['maxWidth']>;
    'messagesCustomChanged': JetElementCustomEventStrict<CInputMonthMaskElement['messagesCustom']>;
    'minChanged': JetElementCustomEventStrict<CInputMonthMaskElement['min']>;
    'rawValueChanged': JetElementCustomEventStrict<CInputMonthMaskElement['rawValue']>;
    'readonlyChanged': JetElementCustomEventStrict<CInputMonthMaskElement['readonly']>;
    'readonlyUserAssistanceShownChanged': JetElementCustomEventStrict<CInputMonthMaskElement['readonlyUserAssistanceShown']>;
    'requiredChanged': JetElementCustomEventStrict<CInputMonthMaskElement['required']>;
    'requiredMessageDetailChanged': JetElementCustomEventStrict<CInputMonthMaskElement['requiredMessageDetail']>;
    'textAlignChanged': JetElementCustomEventStrict<CInputMonthMaskElement['textAlign']>;
    'userAssistanceDensityChanged': JetElementCustomEventStrict<CInputMonthMaskElement['userAssistanceDensity']>;
    'validChanged': JetElementCustomEventStrict<CInputMonthMaskElement['valid']>;
    'validatorsChanged': JetElementCustomEventStrict<CInputMonthMaskElement['validators']>;
    'valueChanged': JetElementCustomEventStrict<CInputMonthMaskElement['value']>;
    'widthChanged': JetElementCustomEventStrict<CInputMonthMaskElement['width']>;
}
export interface CInputMonthMaskElementSettableProperties extends JetSettableProperties {
    /**
     * Specifies how many columns this component should span.
     * This only takes effect when this component is a child of a form layout
     * that has direction 'row'.
     */
    columnSpan?: Props['columnSpan'];
    /**
     * Specifies whether an ancestor container, like oj-c-form-layout, is readonly.
     * This affects whether a readonly component renders in full or mixed readonly mode.
     */
    containerReadonly?: Props['containerReadonly'];
    /**
     * <p>
     * A callback function that returns a component-specific message detail when the date range validation fails when user's input is greater than the max.
     * If the component needs a validation error message for overflow that is different from the default,
     * set this property. The function should return a translated string.
     * </p>
     * Usage: <br/>
     * dateRangeOverflowMessageDetail = (p: { value: string; max: string }) => `The date ${p.value} is too high. Max limit is ${p.max}.`<br/>
     * dateRangeOverflowMessageDetail = (p: {max: string }) => `The date needs to be on or before ${p.max}.`<br/>
     * dateRangeOverflowMessageDetail = () => `The date is out of range.`
     */
    dateRangeOverflowMessageDetail?: Props['dateRangeOverflowMessageDetail'];
    /**
     * <p>
     * A callback function that returns a component-specific message when the date range validation fails when the user's input is less than the min.
     * If the component needs a validation error message for underflow that is different from the default,
     * set this property. The function should return a translated string.
     * </p>
     * Usage: <br/>
     * dateRangeUnderflowMessageDetail = (p: { value: string; min: string }) => `The date ${p.value} is too low. Min limit is ${p.min}.`<br/>
     * dateRangeUnderflowMessageDetail = (p: {min: string }) => `The date is too low. Min limit is ${p.min}.`<br/>
     * dateRangeUnderflowMessageDetail = () => `The date is out of range.`
     */
    dateRangeUnderflowMessageDetail?: Props['dateRangeUnderflowMessageDetail'];
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
    disabled?: Props['disabled'];
    /**
     * Display options for auxiliary content that determines whether or not it should be displayed.
     */
    displayOptions?: Props['displayOptions'];
    /**
     * Form component help information.
     */
    help?: Props['help'];
    /**
     * The helpHints object contains a definition property and a source property.
     */
    helpHints?: Props['helpHints'];
    /**
     * Specifies how the label of the component is positioned when the label-hint
     * attribute is set on the component.
     */
    labelEdge?: Props['labelEdge'];
    /**
     * Represents a hint for rendering a label on the component.
     * This is used in combination with the label-edge attribute to control how the label should be rendered.
     */
    labelHint: Props['labelHint'];
    /**
     * <p> The width of the label when labelEdge is 'start'.</p>
     * <p> This attribute accepts values of type
     * <code>0 | `--${string}` | `${number}%` | `${number}x` | `calc(${string})`</code></p>
     */
    labelStartWidth?: Props['labelStartWidth'];
    /**
     * @deprecated since 18.0.0  - Label truncation for 'start' and 'top' aligned labels is no longer recommended by the Redwood Design System. The default for labelWrapping was 'wrap' and that is now the only suggested pattern by UX design for 'start' and 'top' aligned labels. 'inside' aligned labels are always truncated per UX design and are not affected by this property's value.
     */
    labelWrapping?: Props['labelWrapping'];
    /**
     * The maximum selectable year and month.
     * The year and month the user enters must be less than or equal to the max year and month, otherwise the user will see an error.
     * This must be an object with year and month defined, {year: number, month: IsoMonth},
     * where the IsoMonth type is a number 1-12, month: 1 for January, month: 2 for February, and so on.
     * If not, an error will be thrown and the component will not render.
     * When set to null, there is no maximum.
     */
    max?: Props['max'];
    /**
     * Specifies the component's max width.  If unset, the default max width is 100%.
     */
    maxWidth?: Props['maxWidth'];
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
    messagesCustom?: Props['messagesCustom'];
    /**
     * The minimum selectable year and month.
     * The year and month the user enters must be greater than or equal to the min year and month, otherwise the user will see an error.
     * This must be an object with year and month defined, {year: number, month: IsoMonth},
     * where the IsoMonth type is a number 1-12, month: 1 for January, month: 2 for February, and so on.
     * If not, an error will be thrown and the component will not render.
     * When set to null, there is no minimum.
     */
    min?: Props['min'];
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
    readonly?: Props['readonly'];
    /**
     * <p>
     * Specifies which user assistance types should be shown when the component is readonly.
     * </p>
     */
    readonlyUserAssistanceShown?: Props['readonlyUserAssistanceShown'];
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
     * <p>The Required error text is based on Redwood UX designs, and it is not recommended that it be changed.
     * To override the required error message,
     * use the <code class="prettyprint">required-message-detail</code> attribute.
     * The component's label text is passed in as a token {label} and can be used in the message detail.
     * </p>
     * <p>When required is set to true, an implicit required validator is created, i.e.,
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
    required?: Props['required'];
    /**
     * <p>
     * The component-specific message detail when the required validation fails.
     * If the component needs a required validation error message that is different from the default,
     * set this property. It should be a translated string.
     * </p>
     */
    requiredMessageDetail?: Props['requiredMessageDetail'];
    /**
     * Specifies how the text is aligned within the text field
     */
    textAlign?: Props['textAlign'];
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
    userAssistanceDensity?: Props['userAssistanceDensity'];
    /**
     * List of validators, synchronous or asynchronous, used by the component
     * when performing validation. Each item is either an
     * instance that duck types oj.Validator or oj.AsyncValidator.
     * <p>
     * At runtime when the component runs validation, it
     * combines all the validators
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
    validators?: Props['validators'];
    /**
     * The value of the component.
     * <p>The value must be an object with year and month defined, {year: number, month: IsoMonth},
     * where the IsoMonth type is a number 1-12, month: 1 for January, month: 2 for February, and so on.
     * If not, the component will throw an error and not render.</p>
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
    value?: Props['value'];
    /**
     * Specifies the component's width.  If unset, the default width is 100%.
     * Note that by default max-width is 100%, which will override the width if the container is smaller than the width specified.
     */
    width?: Props['width'];
}
export interface CInputMonthMaskElementSettablePropertiesLenient extends Partial<CInputMonthMaskElementSettableProperties> {
    [key: string]: any;
}
export interface InputMonthMaskIntrinsicProps extends Partial<Readonly<CInputMonthMaskElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    rawValue?: never;
    valid?: never;
    oncolumnSpanChanged?: (value: CInputMonthMaskElementEventMap['columnSpanChanged']) => void;
    oncontainerReadonlyChanged?: (value: CInputMonthMaskElementEventMap['containerReadonlyChanged']) => void;
    ondateRangeOverflowMessageDetailChanged?: (value: CInputMonthMaskElementEventMap['dateRangeOverflowMessageDetailChanged']) => void;
    ondateRangeUnderflowMessageDetailChanged?: (value: CInputMonthMaskElementEventMap['dateRangeUnderflowMessageDetailChanged']) => void;
    ondisabledChanged?: (value: CInputMonthMaskElementEventMap['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: CInputMonthMaskElementEventMap['displayOptionsChanged']) => void;
    onhelpChanged?: (value: CInputMonthMaskElementEventMap['helpChanged']) => void;
    onhelpHintsChanged?: (value: CInputMonthMaskElementEventMap['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: CInputMonthMaskElementEventMap['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: CInputMonthMaskElementEventMap['labelHintChanged']) => void;
    onlabelStartWidthChanged?: (value: CInputMonthMaskElementEventMap['labelStartWidthChanged']) => void;
    /** @deprecated since 18.0.0 */ onlabelWrappingChanged?: (value: CInputMonthMaskElementEventMap['labelWrappingChanged']) => void;
    onmaxChanged?: (value: CInputMonthMaskElementEventMap['maxChanged']) => void;
    onmaxWidthChanged?: (value: CInputMonthMaskElementEventMap['maxWidthChanged']) => void;
    onmessagesCustomChanged?: (value: CInputMonthMaskElementEventMap['messagesCustomChanged']) => void;
    onminChanged?: (value: CInputMonthMaskElementEventMap['minChanged']) => void;
    onrawValueChanged?: (value: CInputMonthMaskElementEventMap['rawValueChanged']) => void;
    onreadonlyChanged?: (value: CInputMonthMaskElementEventMap['readonlyChanged']) => void;
    onreadonlyUserAssistanceShownChanged?: (value: CInputMonthMaskElementEventMap['readonlyUserAssistanceShownChanged']) => void;
    onrequiredChanged?: (value: CInputMonthMaskElementEventMap['requiredChanged']) => void;
    onrequiredMessageDetailChanged?: (value: CInputMonthMaskElementEventMap['requiredMessageDetailChanged']) => void;
    ontextAlignChanged?: (value: CInputMonthMaskElementEventMap['textAlignChanged']) => void;
    onuserAssistanceDensityChanged?: (value: CInputMonthMaskElementEventMap['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: CInputMonthMaskElementEventMap['validChanged']) => void;
    onvalidatorsChanged?: (value: CInputMonthMaskElementEventMap['validatorsChanged']) => void;
    onvalueChanged?: (value: CInputMonthMaskElementEventMap['valueChanged']) => void;
    onwidthChanged?: (value: CInputMonthMaskElementEventMap['widthChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-input-month-mask': InputMonthMaskIntrinsicProps;
        }
    }
}
