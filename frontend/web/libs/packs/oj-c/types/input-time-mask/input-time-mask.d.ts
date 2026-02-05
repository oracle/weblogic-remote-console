import { InputTimeMask as PreactInputTimeMask, type Time } from '@oracle/oraclejet-preact/UNSAFE_InputTimeMask';
import type { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
import { type LayoutColumnSpan } from '@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout';
import { type DisplayOptions, type Help, type HelpHints } from 'oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText';
import { type ExtendGlobalProps, type ObservedGlobalProps, type PropertyChanged, type ReadOnlyPropertyChanged } from 'ojs/ojvcomponent';
import type { ComponentProps, ComponentType, Ref } from 'preact';
import AsyncValidator = require('ojs/ojvalidator-async');
import Validator = require('ojs/ojvalidator');
import 'css!oj-c/input-time-mask/input-time-mask-styles.css';
import { OverflowMessageDetailParameters, UnderflowMessageDetailParameters } from './TimeRangeValidator';
import type { TimeISOStr } from '@oracle/oraclejet-preact/UNSAFE_IntlDateTime';
type PreactInputTimeMaskProps = ComponentProps<typeof PreactInputTimeMask>;
/**
 * Various supported valid states
 */
type ValidState = 'valid' | 'pending' | 'invalidHidden' | 'invalidShown';
/**
 * Display options for auxiliary content that determines whether or not it should be displayed.
 */
type DisplayOptionsProps = Omit<DisplayOptions, 'converterHint'>;
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
     * Specifies the smallest time unit that is displayed by the component.
     * If set to minute, only hour and minute are shown.
     * If set to second then hour, minute, and second are shown.
     * If set to millisecond then hour, minute, second and millisecond are shown.
     * @ojmetadata description "Specifies the smallest time unit that is displayed by the component."
     * @ojmetadata displayName "Granularity"
     * @ojmetadata help "#granularity"
     */
    granularity?: PreactInputTimeMaskProps['granularity'];
    /**
     * @description
     * Specifies whether to always show a leading zero in the hour field when the hour is 1-digit,
     * or to never show a leading zero in the hour field when the hour is 1-digit.
     * By default this is 'fromLocale' which means it is determined by the user's locale.
     * @ojmetadata description "Specifies whether to show or hide a leading zero in the hour field or determine it from the locale."
     * @ojmetadata displayName "Leading Zero For Hour"
     * @ojmetadata help "#leadingZeroForHour"
     */
    leadingZeroForHour?: PreactInputTimeMaskProps['leadingZeroForHour'];
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
     * Specifies whether to display the time as a 12-hour clock with a day period or a 24-hour clock.
     * By default this is 'fromLocale' which means the hour clock is determined by the user's locale.
     * @ojmetadata description "Specifies whether to display the time as a 12-hour clock or 24-hour clock or if the hour clock is determined from the locale."
     * @ojmetadata displayName "Hour Clock"
     * @ojmetadata help "#hourClock"
     */
    hourClock?: PreactInputTimeMaskProps['hourClock'];
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
    labelEdge?: PreactInputTimeMaskProps['labelEdge'];
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
     * @ojmetadata status [
     *   {
     *     type: "deprecated",
     *     since: "19.0.0",
     *     description: "Label truncation for 'start' and 'top' aligned labels is no longer recommended by the Redwood Design System. The default for labelWrapping was 'wrap' and that is now the only suggested pattern by UX design for 'start' and 'top' aligned labels. 'inside' aligned labels are always truncated per UX design and are not affected by this property's value."
     *   }
     * ]
     */
    labelWrapping?: 'truncate' | 'wrap';
    /**
     * @description
     * The maximum selectable time in ISO format.
     * The time the user enters must be less than or equal to the max time, otherwise the user will see an error.
     * This must be a time only ISO string with no date, otherwise an error is thrown and the component will not render.
     * When set to null, there is no maximum.
     *
     * @ojmetadata description "The maximum selectable time"
     * @ojmetadata displayName "Max"
     * @ojmetadata help "#max"
     */
    max?: TimeISOStr | null;
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
    messagesCustom?: PreactInputTimeMaskProps['messages'];
    /**
     * @description
     * The minimum selectable time in ISO format.
     * The time the user enters must be greater than or equal to the min time, otherwise the user will see an error.
     * This must be a time only ISO string with no date, otherwise an error is thrown and the component will not render.
     * When set to null, there is no minimum.
     *
     * @ojmetadata description "The minimum selectable time"
     * @ojmetadata displayName "Min"
     * @ojmetadata help "#min"
     */
    min?: TimeISOStr | null;
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
    textAlign?: PreactInputTimeMaskProps['textAlign'];
    /**
     * @description
     * <p>
     * A callback function that returns a component-specific message detail when the time range validation fails when user's input is greater than the max.
     * If the component needs a validation error message for overflow that is different from the default,
     * set this property. The function should return a translated string.
     * </p>
     * Usage: <br/>
     * timeRangeOverflowMessageDetail = (p: { value: string; max: string }) => `The time ${p.value} needs to be on or before ${p.max}.`<br/>
     * timeRangeOverflowMessageDetail = (p: {max: string }) => `The time needs to be on or before ${p.max}.`<br/>
     * timeRangeOverflowMessageDetail = () => `The time is out of range.`
     *
     * @ojmetadata description "Overrides the default validator's rangeOverflow message detail."
     * @ojmetadata displayName "Time Range Overflow Message Detail"
     * @ojmetadata help "#timeRangeOverflowMessageDetail"
     */
    timeRangeOverflowMessageDetail?: (p: OverflowMessageDetailParameters) => string;
    /**
     * @description
     * <p>
     * A callback function that returns a component-specific message when the time range validation fails when the user's input is less than the min.
     * If the component needs a validation error message for underflow that is different from the default,
     * set this property. The function should return a translated string.
     * </p>
     * Usage: <br/>
     * timeRangeUnderflowMessageDetail = (p: { value: string; min: string }) => `The time ${p.value} needs to be on or after ${p.min}.`<br/>
     * timeRangeUnderflowMessageDetail = (p: {min: string }) => `The time is too low. Min limit is ${p.min}.`<br/>
     * timeRangeUnderflowMessageDetail = () => `The time is out of range.`
     * @ojmetadata description "Overrides the default validator's rangeUnderflow message detail."
     * @ojmetadata displayName "Time Range Underflow Message Detail"
     * @ojmetadata help "#timeRangeUnderflowMessageDetail"
     */
    timeRangeUnderflowMessageDetail?: (p: UnderflowMessageDetailParameters) => string;
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
    userAssistanceDensity?: PreactInputTimeMaskProps['userAssistanceDensity'];
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
    validators?: (AsyncValidator<TimeISOStr> | Validator<TimeISOStr>)[] | null;
    /**
     * @description
     * The value of the component.
     * <p>
     * The value must be a local time (no date) ISO string such as 'T01:45', otherwise the component will throw an error.
     * If needed, use IntlConverterUtils.offsetTimeToLocalIsoTimeString(value, date, timeZone) to convert a time with an offset to a local ISO string that contains only the time to set as the initial value.
     * </p>
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
    value?: TimeISOStr | null;
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
    onMessagesCustomChanged?: PropertyChanged<PreactInputTimeMaskProps['messages']>;
    /**
     * @description
     * <p>The  <code class="prettyprint">rawValue</code> is the read-only property for retrieving
     * the current displayed value from the component.</p>
     * <p>
     * The <code class="prettyprint">rawValue</code> updates when the user types into the field,
     * so the <code class="prettyprint">rawValue</code> changes as the value of the field is changed,
     * whether or not it is valid.
     * If the user types '10' into the hour field in an otherwise empty field with granularity='minute',
     * the rawValue will be {hour:1, minute:undefined}, then {hour:10, minute:0}. When the hour is complete,
     * the rest of the segments auto-fill to 0, which is why the minute property is set to 0.
     * When the user blurs or presses
     * Enter the <code class="prettyprint">rawValue</code> property gets parsed into an time only ISO string (an error is thrown if
     * the time is not complete), and the time only ISO string gets validated. If valid, the <code class="prettyprint">value</code> property
     * gets updated with the time only ISO string.
     * </p>
     * <p>If the user clears the field, rawValue is undefined.
     * </p>
     * <p>This is a read-only attribute so page authors cannot set or change it directly.</p>
     *
     * @ojmetadata description "Specifies how the raw value of the component"
     * @ojmetadata displayName "Raw Value"
     * @ojmetadata help "#rawValue"
     */
    onRawValueChanged?: ReadOnlyPropertyChanged<Time | undefined>;
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
    onValueChanged?: PropertyChanged<TimeISOStr | null>;
};
type InputTimeMaskHandle = {
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
     *  the UI value is first converted (i.e., parsed). If there is a parse error (e.g., the field does not contain an hour)
     *  then the message is shown and processing stops.
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
 * <h3 id="InputTimeMaskOverview-section">
 *   JET Input Time Mask Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#InputTimeMaskOverview-section"></a>
 * </h3>
 *
 * <p>Description: A JET Input Time Mask allows a user to individually edit, step, or spin the
 * values of the hour, minute, second, and millisecond fields of a time.</p>
 *
 * <pre class="prettyprint"><code>&lt;oj-c-input-time-mask label-hint="Time">&lt;/oj-c-input-time-mask></code></pre>
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
 * present, the UI value is first converted (i.e., parsed). If there is a parse error then
 * the messages are shown and processing returns.</li>
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
 *       <td>If the time is complete, selects the entire time. Hitting backspace clears it.</td>
 *     </tr>
 *     <tr>
 *       <td>Day Period Segment</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Sets focus to the day period segment. Type the first letter of the desired day period to select it. The 'AM'/'PM' string is localized to the user's locale. For example, in locale 'en-US', 'A' sets the day period segment to 'AM' and 'P' sets the day period segment to 'PM'. If the localized 'AM'/'PM' strings start with the same letter, then typing the first letter will toggle between them.</td>
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
 *       <td><kbd>Ctrl + A</kbd> or <kbd>Command + A</kbd></td>
 *       <td>If the time is complete, selects the entire time. Double clicking on the field also selects the time.</td>
 *     </tr>
 *     <tr>
 *       <td>Field with time selected</td>
 *       <td><kbd>Backspace/Delete</kbd></td>
 *       <td>Backspace or delete key clears the time. The mask placeholders will be shown again and focus will be on the first segment.</td>
 *     </tr>
 *     <tr>
 *       <td>Time Segment</td>
 *       <td><kbd>Backspace/Delete</kbd></td>
 *       <td>Clears the time segment. Focus remains on the time segment.</td>
 *     </tr>
 *     <tr>
 *       <td>Time Segment</td>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Moves focus to the segment on the right. If focus is on the rightmost segment, the focus does not move.</td>
 *     </tr>
 *     <tr>
 *       <td>Time Segment</td>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Moves focus to the segment on the left. If focus is on the leftmost segment, the focus does not move.</td>
 *     </tr>
 *    <tr>
 *       <td>Hour Segment</td>
 *       <td><kbd>UpArrow/DownArrow</kbd></td>
 *       <td>
 *        <p>
 *          Increments or decrements the number by one in the segment. The value wraps around when it reaches the minimum or maximum allowed for the segment.</p>
 *       <p>
 *          If there is no number in the segment, and the time is a 12-hour clock, it initializes the hour segment to 12, and auto-fills any empty segments; minute, second and millisecond to 0, and the dayPeriod segment to AM (the string will be localized to the user's locale).
 *       </p>
 *       <p>
 *         If there is no number in the segment, and the time is a 24-hour clock, it initializes the hour segment to 0, and auto-fills any empty segments to 0.
 *       </p>
 *       </td>
 *    </tr>
 *    <tr>
 *       <td>Minute, Second, or Millisecond Segment</td>
 *       <td><kbd>UpArrow/DownArrow</kbd></td>
 *       <td>Increments or decrements the number by one in the segment. The value wraps around when it reaches the minimum or maximum allowed for the segment.
 *         If there is no number in the segment, it initializes the segment to 0.
 *       </td>
 *    </tr>
 *   <tr>
 *       <td>Day Period Segment</td>
 *       <td><kbd>UpArrow/DownArrow</kbd></td>
 *       <td>Toggles the day period. If the day period is empty, it initializes it to AM (the 'AM'/'PM' string is localized to the user's locale).</td>
 *    </tr>
 *    <tr>
 *       <td>Hour Segment</td>
 *       <td><kbd>End</kbd></td>
 *       <td>
 *        <p>
 *          Sets the segment to the maximum number for the segment, and auto-fills the rest of the empty segments;
 *          sets minute, second and millisecond segments to 0, and the dayPeriod segment to AM (the 'AM'/'PM' string is localized to the user's locale).
 *        </p>
 *        <p>
 *           For example, if on the hour segment for a 12-hour clock with granularity="minute", and all segments are empty,
 *           this will set the hour to 12, and minute to 0, and day period to AM. If on the hour segment for a 24-hour clock
 *           with granularity="minute", and all segments are empty, this will set the hour to 23 and minute to 0.
 *        </p>
 *      </td>
 *    </tr>
 *    <tr>
 *       <td>Minute, Second, or Millisecond Segment</td>
 *       <td><kbd>End</kbd></td>
 *       <td>Sets the segment to the maximum number for the segment.</td>
 *    </tr>
 *    <tr>
 *       <td>Day Period Segment</td>
 *       <td><kbd>End</kbd></td>
 *       <td>Sets the segment to the maximum value for the segment which is PM for the day period segment (the 'AM'/'PM' string is localized to the user's locale).</td>
 *    </tr>
 *    <tr>
 *       <td>Hour Segment</td>
 *       <td><kbd>Home</kbd></td>
 *       <td>
 *        <p>
 *          Sets the segment to the minimum number for the segment, and auto-fills the rest of the empty segments;
 *          minute, second and millisecond segments to 0, and the dayPeriod segment to AM (the 'AM'/'PM' string is localized to the user's locale).
 *        </p>
 *        <p>
 *           For example, if on the hour segment for a 12-hour clock with granularity="minute", and all segments are empty,
 *           this will set the hour to 1, and minute to 0, and day period to AM. If on the hour segment for a 24-hour clock
 *           with granularity="minute", and all segments are empty, this will set the hour to 0 and minute to 0.
 *        </p>
 *      </td>
 *    </tr>
 *    <tr>
 *       <td>Minute, Second, or Millisecond Segment</td>
 *       <td><kbd>Home</kbd></td>
 *       <td>Sets the segment to the minimum number for the segment which is 0 for the minute, second, and millisecond segments.</td>
 *    </tr>
 *    <tr>
 *       <td>Day Period Segment</td>
 *       <td><kbd>Home</kbd></td>
 *       <td>Sets the segment to the minimum value for the segment which is AM for the day period segment (the 'AM'/'PM' string is localized to the user's locale).</td>
 *    </tr>
 *    <tr>
 *       <td>Hour Segment</td>
 *       <td><kbd>Page Up/Page Down</kbd></td>
 *       <td>
 *        <p>
 *          Increments or decrements the number by two in the hour segment, and auto-fills the rest of the empty segments;
 *          minute, second and millisecond segments to 0, and the dayPeriod segment to AM (the 'AM'/'PM' string is localized to the user's locale).
 *          The value wraps around when it reaches the minimum or maximum allowed for the segment.
 *        </p>
 *        <p>
 *          If there is no number in the segment, and the time is a 12-hour clock, it initializes the hour segment to 12, and auto-fills any empty segments; minute, second and millisecond to 0, and the dayPeriod segment to AM (the string will be localized to the user's locale).
 *        </p>
 *        <p>
 *         If there is no number in the segment, and the time is a 24-hour clock, it initializes the hour segment to 0, and auto-fills any empty segments to 0.
 *        </p>
 *      </td>
 *    </tr>
 *    <tr>
 *       <td>Minute, Second, or Millisecond Segment</td>
 *       <td><kbd>Page Up/Page Down</kbd></td>
 *       <td>Increments or decrements the number by 10 in the minute and second segments, or by 100 in the millisecond segment. The value wraps around when it reaches the minimum or maximum allowed for the segment.</td>
 *    </tr>
 *    <tr>
 *       <td>Day Period Segment</td>
 *       <td><kbd>Page Up/Page Down</kbd></td>
 *       <td>Toggles the day period segment between AM and PM (the 'AM'/'PM' string is localized to the user's locale).</td>
 *    </tr>
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
 * @ojmetadata displayName "InputTimeMask"
 * @ojmetadata description "An input time mask field allows a user to enter, edit, or display a time value."
 * @ojmetadata help "oj-c.InputTimeMask.html"
 * @ojmetadata main "oj-c/input-time-mask"
 * @ojmetadata status [
 *   {
 *     type: "candidate",
 *     since: "19.0.0"
 *   }
 * ]
 * @ojmetadata since "19.0.0"
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
declare const InputTimeMaskImpl: ({ columnSpan, containerReadonly: propContainerReadonly, disabled, displayOptions, granularity, leadingZeroForHour, help, helpHints, hourClock, labelWrapping: propLabelWrapping, messagesCustom, readonly: propReadonly, readonlyUserAssistanceShown, required, textAlign: propTextAlign, userAssistanceDensity: propUserAssistanceDensity, validators, value, ...otherProps }: Props, ref: Ref<InputTimeMaskHandle>) => import("preact").JSX.Element;
/**
 * This export corresponds to the InputTimeMask Preact component. For the oj-c-input-time-mask custom element, import CInputTimeMaskElement instead.
 */
export declare const InputTimeMask: ComponentType<ExtendGlobalProps<ComponentProps<typeof InputTimeMaskImpl>> & {
    ref?: Ref<InputTimeMaskHandle>;
}>;
export type InputTimeMaskProps = Props;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-input-time-mask custom element. For the InputTimeMask Preact component, import InputTimeMask instead.
 */
export interface CInputTimeMaskElement extends JetElement<CInputTimeMaskElementSettableProperties>, CInputTimeMaskElementSettableProperties {
    /**
     * <p>The  <code class="prettyprint">rawValue</code> is the read-only property for retrieving
     * the current displayed value from the component.</p>
     * <p>
     * The <code class="prettyprint">rawValue</code> updates when the user types into the field,
     * so the <code class="prettyprint">rawValue</code> changes as the value of the field is changed,
     * whether or not it is valid.
     * If the user types '10' into the hour field in an otherwise empty field with granularity='minute',
     * the rawValue will be {hour:1, minute:undefined}, then {hour:10, minute:0}. When the hour is complete,
     * the rest of the segments auto-fill to 0, which is why the minute property is set to 0.
     * When the user blurs or presses
     * Enter the <code class="prettyprint">rawValue</code> property gets parsed into an time only ISO string (an error is thrown if
     * the time is not complete), and the time only ISO string gets validated. If valid, the <code class="prettyprint">value</code> property
     * gets updated with the time only ISO string.
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
    addEventListener<T extends keyof CInputTimeMaskElementEventMap>(type: T, listener: (this: HTMLElement, ev: CInputTimeMaskElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CInputTimeMaskElementSettableProperties>(property: T): CInputTimeMaskElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CInputTimeMaskElementSettableProperties>(property: T, value: CInputTimeMaskElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CInputTimeMaskElementSettableProperties>): void;
    setProperties(properties: CInputTimeMaskElementSettablePropertiesLenient): void;
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
     *  the UI value is first converted (i.e., parsed). If there is a parse error (e.g., the field does not contain an hour)
     *  then the message is shown and processing stops.
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
export namespace CInputTimeMaskElement {
    type columnSpanChanged = JetElementCustomEventStrict<CInputTimeMaskElement['columnSpan']>;
    type containerReadonlyChanged = JetElementCustomEventStrict<CInputTimeMaskElement['containerReadonly']>;
    type disabledChanged = JetElementCustomEventStrict<CInputTimeMaskElement['disabled']>;
    type displayOptionsChanged = JetElementCustomEventStrict<CInputTimeMaskElement['displayOptions']>;
    type granularityChanged = JetElementCustomEventStrict<CInputTimeMaskElement['granularity']>;
    type helpChanged = JetElementCustomEventStrict<CInputTimeMaskElement['help']>;
    type helpHintsChanged = JetElementCustomEventStrict<CInputTimeMaskElement['helpHints']>;
    type hourClockChanged = JetElementCustomEventStrict<CInputTimeMaskElement['hourClock']>;
    type labelEdgeChanged = JetElementCustomEventStrict<CInputTimeMaskElement['labelEdge']>;
    type labelHintChanged = JetElementCustomEventStrict<CInputTimeMaskElement['labelHint']>;
    type labelStartWidthChanged = JetElementCustomEventStrict<CInputTimeMaskElement['labelStartWidth']>;
    type labelWrappingChanged = JetElementCustomEventStrict<CInputTimeMaskElement['labelWrapping']>;
    type leadingZeroForHourChanged = JetElementCustomEventStrict<CInputTimeMaskElement['leadingZeroForHour']>;
    type maxChanged = JetElementCustomEventStrict<CInputTimeMaskElement['max']>;
    type maxWidthChanged = JetElementCustomEventStrict<CInputTimeMaskElement['maxWidth']>;
    type messagesCustomChanged = JetElementCustomEventStrict<CInputTimeMaskElement['messagesCustom']>;
    type minChanged = JetElementCustomEventStrict<CInputTimeMaskElement['min']>;
    type rawValueChanged = JetElementCustomEventStrict<CInputTimeMaskElement['rawValue']>;
    type readonlyChanged = JetElementCustomEventStrict<CInputTimeMaskElement['readonly']>;
    type readonlyUserAssistanceShownChanged = JetElementCustomEventStrict<CInputTimeMaskElement['readonlyUserAssistanceShown']>;
    type requiredChanged = JetElementCustomEventStrict<CInputTimeMaskElement['required']>;
    type requiredMessageDetailChanged = JetElementCustomEventStrict<CInputTimeMaskElement['requiredMessageDetail']>;
    type textAlignChanged = JetElementCustomEventStrict<CInputTimeMaskElement['textAlign']>;
    type timeRangeOverflowMessageDetailChanged = JetElementCustomEventStrict<CInputTimeMaskElement['timeRangeOverflowMessageDetail']>;
    type timeRangeUnderflowMessageDetailChanged = JetElementCustomEventStrict<CInputTimeMaskElement['timeRangeUnderflowMessageDetail']>;
    type userAssistanceDensityChanged = JetElementCustomEventStrict<CInputTimeMaskElement['userAssistanceDensity']>;
    type validChanged = JetElementCustomEventStrict<CInputTimeMaskElement['valid']>;
    type validatorsChanged = JetElementCustomEventStrict<CInputTimeMaskElement['validators']>;
    type valueChanged = JetElementCustomEventStrict<CInputTimeMaskElement['value']>;
    type widthChanged = JetElementCustomEventStrict<CInputTimeMaskElement['width']>;
}
export interface CInputTimeMaskElementEventMap extends HTMLElementEventMap {
    'columnSpanChanged': JetElementCustomEventStrict<CInputTimeMaskElement['columnSpan']>;
    'containerReadonlyChanged': JetElementCustomEventStrict<CInputTimeMaskElement['containerReadonly']>;
    'disabledChanged': JetElementCustomEventStrict<CInputTimeMaskElement['disabled']>;
    'displayOptionsChanged': JetElementCustomEventStrict<CInputTimeMaskElement['displayOptions']>;
    'granularityChanged': JetElementCustomEventStrict<CInputTimeMaskElement['granularity']>;
    'helpChanged': JetElementCustomEventStrict<CInputTimeMaskElement['help']>;
    'helpHintsChanged': JetElementCustomEventStrict<CInputTimeMaskElement['helpHints']>;
    'hourClockChanged': JetElementCustomEventStrict<CInputTimeMaskElement['hourClock']>;
    'labelEdgeChanged': JetElementCustomEventStrict<CInputTimeMaskElement['labelEdge']>;
    'labelHintChanged': JetElementCustomEventStrict<CInputTimeMaskElement['labelHint']>;
    'labelStartWidthChanged': JetElementCustomEventStrict<CInputTimeMaskElement['labelStartWidth']>;
    'labelWrappingChanged': JetElementCustomEventStrict<CInputTimeMaskElement['labelWrapping']>;
    'leadingZeroForHourChanged': JetElementCustomEventStrict<CInputTimeMaskElement['leadingZeroForHour']>;
    'maxChanged': JetElementCustomEventStrict<CInputTimeMaskElement['max']>;
    'maxWidthChanged': JetElementCustomEventStrict<CInputTimeMaskElement['maxWidth']>;
    'messagesCustomChanged': JetElementCustomEventStrict<CInputTimeMaskElement['messagesCustom']>;
    'minChanged': JetElementCustomEventStrict<CInputTimeMaskElement['min']>;
    'rawValueChanged': JetElementCustomEventStrict<CInputTimeMaskElement['rawValue']>;
    'readonlyChanged': JetElementCustomEventStrict<CInputTimeMaskElement['readonly']>;
    'readonlyUserAssistanceShownChanged': JetElementCustomEventStrict<CInputTimeMaskElement['readonlyUserAssistanceShown']>;
    'requiredChanged': JetElementCustomEventStrict<CInputTimeMaskElement['required']>;
    'requiredMessageDetailChanged': JetElementCustomEventStrict<CInputTimeMaskElement['requiredMessageDetail']>;
    'textAlignChanged': JetElementCustomEventStrict<CInputTimeMaskElement['textAlign']>;
    'timeRangeOverflowMessageDetailChanged': JetElementCustomEventStrict<CInputTimeMaskElement['timeRangeOverflowMessageDetail']>;
    'timeRangeUnderflowMessageDetailChanged': JetElementCustomEventStrict<CInputTimeMaskElement['timeRangeUnderflowMessageDetail']>;
    'userAssistanceDensityChanged': JetElementCustomEventStrict<CInputTimeMaskElement['userAssistanceDensity']>;
    'validChanged': JetElementCustomEventStrict<CInputTimeMaskElement['valid']>;
    'validatorsChanged': JetElementCustomEventStrict<CInputTimeMaskElement['validators']>;
    'valueChanged': JetElementCustomEventStrict<CInputTimeMaskElement['value']>;
    'widthChanged': JetElementCustomEventStrict<CInputTimeMaskElement['width']>;
}
export interface CInputTimeMaskElementSettableProperties extends JetSettableProperties {
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
     * Specifies the smallest time unit that is displayed by the component.
     * If set to minute, only hour and minute are shown.
     * If set to second then hour, minute, and second are shown.
     * If set to millisecond then hour, minute, second and millisecond are shown.
     */
    granularity?: Props['granularity'];
    /**
     * Form component help information.
     */
    help?: Props['help'];
    /**
     * The helpHints object contains a definition property and a source property.
     */
    helpHints?: Props['helpHints'];
    /**
     * Specifies whether to display the time as a 12-hour clock with a day period or a 24-hour clock.
     * By default this is 'fromLocale' which means the hour clock is determined by the user's locale.
     */
    hourClock?: Props['hourClock'];
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
     * @deprecated since 19.0.0  - Label truncation for 'start' and 'top' aligned labels is no longer recommended by the Redwood Design System. The default for labelWrapping was 'wrap' and that is now the only suggested pattern by UX design for 'start' and 'top' aligned labels. 'inside' aligned labels are always truncated per UX design and are not affected by this property's value.
     */
    labelWrapping?: Props['labelWrapping'];
    /**
     * Specifies whether to always show a leading zero in the hour field when the hour is 1-digit,
     * or to never show a leading zero in the hour field when the hour is 1-digit.
     * By default this is 'fromLocale' which means it is determined by the user's locale.
     */
    leadingZeroForHour?: Props['leadingZeroForHour'];
    /**
     * The maximum selectable time in ISO format.
     * The time the user enters must be less than or equal to the max time, otherwise the user will see an error.
     * This must be a time only ISO string with no date, otherwise an error is thrown and the component will not render.
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
     * The minimum selectable time in ISO format.
     * The time the user enters must be greater than or equal to the min time, otherwise the user will see an error.
     * This must be a time only ISO string with no date, otherwise an error is thrown and the component will not render.
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
     * A callback function that returns a component-specific message detail when the time range validation fails when user's input is greater than the max.
     * If the component needs a validation error message for overflow that is different from the default,
     * set this property. The function should return a translated string.
     * </p>
     * Usage: <br/>
     * timeRangeOverflowMessageDetail = (p: { value: string; max: string }) => `The time ${p.value} needs to be on or before ${p.max}.`<br/>
     * timeRangeOverflowMessageDetail = (p: {max: string }) => `The time needs to be on or before ${p.max}.`<br/>
     * timeRangeOverflowMessageDetail = () => `The time is out of range.`
     */
    timeRangeOverflowMessageDetail?: Props['timeRangeOverflowMessageDetail'];
    /**
     * <p>
     * A callback function that returns a component-specific message when the time range validation fails when the user's input is less than the min.
     * If the component needs a validation error message for underflow that is different from the default,
     * set this property. The function should return a translated string.
     * </p>
     * Usage: <br/>
     * timeRangeUnderflowMessageDetail = (p: { value: string; min: string }) => `The time ${p.value} needs to be on or after ${p.min}.`<br/>
     * timeRangeUnderflowMessageDetail = (p: {min: string }) => `The time is too low. Min limit is ${p.min}.`<br/>
     * timeRangeUnderflowMessageDetail = () => `The time is out of range.`
     */
    timeRangeUnderflowMessageDetail?: Props['timeRangeUnderflowMessageDetail'];
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
     * <p>
     * The value must be a local time (no date) ISO string such as 'T01:45', otherwise the component will throw an error.
     * If needed, use IntlConverterUtils.offsetTimeToLocalIsoTimeString(value, date, timeZone) to convert a time with an offset to a local ISO string that contains only the time to set as the initial value.
     * </p>
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
export interface CInputTimeMaskElementSettablePropertiesLenient extends Partial<CInputTimeMaskElementSettableProperties> {
    [key: string]: any;
}
export interface InputTimeMaskIntrinsicProps extends Partial<Readonly<CInputTimeMaskElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    rawValue?: never;
    valid?: never;
    oncolumnSpanChanged?: (value: CInputTimeMaskElementEventMap['columnSpanChanged']) => void;
    oncontainerReadonlyChanged?: (value: CInputTimeMaskElementEventMap['containerReadonlyChanged']) => void;
    ondisabledChanged?: (value: CInputTimeMaskElementEventMap['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: CInputTimeMaskElementEventMap['displayOptionsChanged']) => void;
    ongranularityChanged?: (value: CInputTimeMaskElementEventMap['granularityChanged']) => void;
    onhelpChanged?: (value: CInputTimeMaskElementEventMap['helpChanged']) => void;
    onhelpHintsChanged?: (value: CInputTimeMaskElementEventMap['helpHintsChanged']) => void;
    onhourClockChanged?: (value: CInputTimeMaskElementEventMap['hourClockChanged']) => void;
    onlabelEdgeChanged?: (value: CInputTimeMaskElementEventMap['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: CInputTimeMaskElementEventMap['labelHintChanged']) => void;
    onlabelStartWidthChanged?: (value: CInputTimeMaskElementEventMap['labelStartWidthChanged']) => void;
    /** @deprecated since 19.0.0 */ onlabelWrappingChanged?: (value: CInputTimeMaskElementEventMap['labelWrappingChanged']) => void;
    onleadingZeroForHourChanged?: (value: CInputTimeMaskElementEventMap['leadingZeroForHourChanged']) => void;
    onmaxChanged?: (value: CInputTimeMaskElementEventMap['maxChanged']) => void;
    onmaxWidthChanged?: (value: CInputTimeMaskElementEventMap['maxWidthChanged']) => void;
    onmessagesCustomChanged?: (value: CInputTimeMaskElementEventMap['messagesCustomChanged']) => void;
    onminChanged?: (value: CInputTimeMaskElementEventMap['minChanged']) => void;
    onrawValueChanged?: (value: CInputTimeMaskElementEventMap['rawValueChanged']) => void;
    onreadonlyChanged?: (value: CInputTimeMaskElementEventMap['readonlyChanged']) => void;
    onreadonlyUserAssistanceShownChanged?: (value: CInputTimeMaskElementEventMap['readonlyUserAssistanceShownChanged']) => void;
    onrequiredChanged?: (value: CInputTimeMaskElementEventMap['requiredChanged']) => void;
    onrequiredMessageDetailChanged?: (value: CInputTimeMaskElementEventMap['requiredMessageDetailChanged']) => void;
    ontextAlignChanged?: (value: CInputTimeMaskElementEventMap['textAlignChanged']) => void;
    ontimeRangeOverflowMessageDetailChanged?: (value: CInputTimeMaskElementEventMap['timeRangeOverflowMessageDetailChanged']) => void;
    ontimeRangeUnderflowMessageDetailChanged?: (value: CInputTimeMaskElementEventMap['timeRangeUnderflowMessageDetailChanged']) => void;
    onuserAssistanceDensityChanged?: (value: CInputTimeMaskElementEventMap['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: CInputTimeMaskElementEventMap['validChanged']) => void;
    onvalidatorsChanged?: (value: CInputTimeMaskElementEventMap['validatorsChanged']) => void;
    onvalueChanged?: (value: CInputTimeMaskElementEventMap['valueChanged']) => void;
    onwidthChanged?: (value: CInputTimeMaskElementEventMap['widthChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-input-time-mask': InputTimeMaskIntrinsicProps;
        }
    }
}
