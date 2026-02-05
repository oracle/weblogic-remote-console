/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { InputDatePicker as PreactInputDatePicker } from '@oracle/oraclejet-preact/UNSAFE_InputDatePicker';
import type { DateISOStr } from '@oracle/oraclejet-preact/UNSAFE_IntlDateTime';
import type { CalendarDate, CalendarDateRequired } from '@oracle/oraclejet-preact/utils/UNSAFE_calendarDateUtils';
import type { LayoutColumnSpan } from '@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout';
import type { DisplayOptions, Help, HelpHints } from 'oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText';
import type { ValidState } from 'oj-c/hooks/UNSAFE_useEditableValue';
import { type ExtendGlobalProps, type ObservedGlobalProps, type PropertyChanged, type ReadOnlyPropertyChanged } from 'ojs/ojvcomponent';
import type { ComponentProps, ComponentType, Ref } from 'preact';
import type { OverflowMessageDetailParameters, UnderflowMessageDetailParameters } from './DateRangeValidator';
import type { RestrictionMessageDetailParameters } from './DateRestrictionValidator';
import type Validator = require('ojs/ojvalidator');
import type AsyncValidator = require('ojs/ojvalidator-async');
import 'css!oj-c/input-date-picker/input-date-picker-styles.css';
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
type PreactInputDatePickerProps = ComponentProps<typeof PreactInputDatePicker>;
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
     * <p>
     * A callback function that returns a component-specific message detail when the date range validation fails when user's input is greater than the max.
     * If the component needs a validation error message for overflow that is different from the default,
     * set this property. The function should return a translated string.
     * </p>
     * Usage: <br/>
     * dateRangeOverflowMessageDetail = (p: { value: string; max: string }) => `The date ${p.value} needs to be on or before ${p.max}.`<br/>
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
     * dateRangeUnderflowMessageDetail = (p: { value: string; min: string }) => `The date ${p.value} needs to be on or after ${p.min}.`<br/>
     * dateRangeUnderflowMessageDetail = (p: {min: string }) => `The date needs to be on or after ${p.min}.`<br/>
     * dateRangeUnderflowMessageDetail = () => `The date is out of range.`
     * @ojmetadata description "Overrides the default validator's rangeUnderflow message detail."
     * @ojmetadata displayName "Date Range Underflow Message Detail"
     * @ojmetadata help "#dateRangeUnderflowMessageDetail"
     */
    dateRangeUnderflowMessageDetail?: (p: UnderflowMessageDetailParameters) => string;
    /**
     * @description
     * <p>
     * A callback function that returns a component-specific message when the date restriction validation fails when the user's input is disabled or restricted.
     * If the component needs a validation error message for restriction that is different from the default,
     * set this property. The function should return a translated string.
     * </p>
     * Usage: <br/>
     * dateRestrictionMessageDetail = (p: { value: string }) => `The date ${p.value} is not available.`<br/>
     * dateRestrictionMessageDetail = () => `The date is not available.`
     * @ojmetadata description "Overrides the default validator's rangeUnderflow message detail."
     * @ojmetadata displayName "Date Range Underflow Message Detail"
     * @ojmetadata help "#dateRangeUnderflowMessageDetail"
     */
    dateRestrictionMessageDetail?: (p: RestrictionMessageDetailParameters) => string;
    /**
     * @description
     * <p>
     * A callback function that returns additional information for rendering a day in the Date Picker.
     * If you want to restrict or disable some of the days, set this property. When this property is set,
     * this will be used to validate the value. If a selected date is either 'disabled' or 'restricted',
     * it will fail the validation and a validation error will be shown.
     * <p>
     * @ojmetadata description "Provides additional information for rendering a day."
     * @ojmetadata displayName "Day Formatter"
     * @ojmetadata help "#dayFormatter"
     */
    dayFormatter?: (date: CalendarDateRequired) => {
        state: 'disabled' | 'enabled' | 'restricted';
    };
    /**
     * @description
     * The days-outside-month attribute affects the day cells that are outside of the current month.
     *
     * @ojmetadata description "Specifies the behavior of days outside of the current month in the Date Picker."
     * @ojmetadata displayName "Days Outside Month"
     * @ojmetadata help "#daysOutsideMonth"
     * @ojmetadata propertyEditorValues {
     *   "hidden": {
     *     "description": "The days outside of the current month will be hidden.",
     *     "displayName": "Hidden"
     *   },
     *   "selectable": {
     *     "description": "The days outside of the current month will be visible and selectable.",
     *     "displayName": "Selectable"
     *   }
     * }
     */
    daysOutsideMonth?: PreactInputDatePickerProps['daysOutsideMonth'];
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
    disabled?: PreactInputDatePickerProps['isDisabled'];
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
    labelEdge?: PreactInputDatePickerProps['labelEdge'];
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
    labelHint: PreactInputDatePickerProps['label'];
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
    labelStartWidth?: PreactInputDatePickerProps['labelStartWidth'];
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
     * The maximum selectable date, in date only ISO string format.
     * The date the user enters must be less than or equal to the max date, otherwise the user will see an error.
     * Also, the dates in the date picker that are greater than this date will not be selectable.
     * This must be a date only ISO string with no time, otherwise an error is thrown and the component will not render.
     * When set to null, there is no maximum.
     *
     * @ojmetadata description "The maximum selectable date, in ISO string format"
     * @ojmetadata displayName "Max"
     * @ojmetadata help "#max"
     * @ojmetadata format "date"
     */
    max?: DateISOStr | null;
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
    messagesCustom?: PreactInputDatePickerProps['messages'];
    /**
     * @description
     * The minimum selectable date, in date only ISO string format.
     * The date the user enters must be greater than or equal to the min date, otherwise the user will see an error.
     * Also, the dates in the date picker that are less than this date will not be selectable.
     * This must be a date only ISO string with no time, otherwise an error is thrown and the component will not render.
     * When set to null, there is no minimum.
     *
     * @ojmetadata description "The minimum selectable date, in ISO string format"
     * @ojmetadata displayName "Min"
     * @ojmetadata help "#min"
     * @ojmetadata format "date"
     */
    min?: DateISOStr | null;
    /**
     * @description
     * The month-and-year-picker attribute can be used to specify whether or not the DatePicker should show the
     * toggle buttons that toggle the month grid picker and year grid picker. The month picker grid allows
     * the user to select a month to display in the date picker and the year picker grid allows the user to
     * select the year to display in the date picker.
     *
     * @ojmetadata description "Specifies whether or not the DatePicker should show the toggle buttons that toggle the month grid picker and year grid picker."
     * @ojmetadata displayName "Month And Year Picker"
     * @ojmetadata help "#monthAndYearPicker"
     * @ojmetadata propertyEditorValues {
     *   "on": {
     *     "description": "The month and year toggle buttons will be shown.",
     *     "displayName": "On"
     *   },
     *   "off": {
     *     "description": "The month and year toggle buttons will not be shown and the date picker renders the month and the year as text.",
     *     "displayName": "Off"
     *   }
     * }
     */
    monthAndYearPicker?: PreactInputDatePickerProps['monthAndYearPicker'];
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
    readonly?: PreactInputDatePickerProps['isReadonly'];
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
    required?: PreactInputDatePickerProps['isRequired'];
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
    textAlign?: PreactInputDatePickerProps['textAlign'];
    /**
     * @description
     * <p>
     * The today-time-zone attribute is used to compute today's date.
     * This defaults to the user's system timezone.
     * </p>
     * <p>
     * The only reason an application would set the today-time-zone property is if they want the
     * highlighted today cell to be in a different timezone than the user's system's timezone,
     * like if the user has a preferred timezone that is not where they are physically working.
     * </p>
     *
     * @ojmetadata description "The time zone used for computing today for the Date Picker."
     * @ojmetadata displayName "Time Zone For Computing Today"
     * @ojmetadata help "#todayTimeZone"
     */
    todayTimeZone?: PreactInputDatePickerProps['todayTimeZone'];
    /**
     * @description
     * Specifies the visibility of the 'Go to today' button.
     *
     * @ojmetadata description "Specifies how to render the 'Go to today' button."
     * @ojmetadata displayName "Today Button"
     * @ojmetadata help "#todayButton"
     * @ojmetadata propertyEditorValues {
     *   "visible": {
     *     "description": "The 'Go to Today' button will be shown and it can be pressed to navigate to Today.",
     *     "displayName": "Visible"
     *   },
     *   "hidden": {
     *     "description": "The 'Go to Today' button will be hidden.",
     *     "displayName": "Hidden"
     *   }
     * }
     */
    todayButton?: PreactInputDatePickerProps['todayButton'];
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
    userAssistanceDensity?: PreactInputDatePickerProps['userAssistanceDensity'];
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
    validators?: (AsyncValidator<DateISOStr> | Validator<DateISOStr>)[] | null;
    /**
     * @description
     * The value of the component.
     * <p>The value must be a local date (no time) ISO string such as '2021-03-14',
     * otherwise the component will throw an error.</p>
     * <p>
     * If needed, use IntlConverterUtils.dateToLocalIsoDateString to convert a Date to
     * a local ISO string that contains only the date to set as the initial value.
     * IntlConverterUtils.dateToLocalIsoDateString(new Date(2014, 1, 1)));
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
     * @ojmetadata format "date"
     */
    value?: DateISOStr | null;
    /**
     * @description
     * Whether week of the year will be shown in the DatePicker. The default calculation follows the
     * rule for ISO 8601 as follows: The first week of the year is defined as the week that contains
     * the first Thursday. Therefore, if January 1st falls on a Friday, it is considered part of the last week
     * of the previous year. Conversely, if December 31st falls on a Wednesday, it is part of week 1 of the following year.
     *
     * @ojmetadata propertyEditorValues {
     *   "none": {
     *     "description": "The week of the year column will not be shown.",
     *     "displayName": "None"
     *   },
     *   "number": {
     *     "description": "Will show the week of the year as a number.",
     *     "displayName": "Number"
     *   }
     * }
     * @ojmetadata description "Whether week of the year will be shown in the DatePicker."
     * @ojmetadata displayName "Week Display"
     * @ojmetadata help "#weekDisplay"
     */
    weekDisplay?: PreactInputDatePickerProps['weekDisplay'];
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
    onMessagesCustomChanged?: PropertyChanged<PreactInputDatePickerProps['messages']>;
    /**
     * @description
     * <p>The  <code class="prettyprint">rawValue</code> is the read-only property for retrieving
     * the current displayed value from the component.</p>
     * <p>
     * The <code class="prettyprint">rawValue</code> updates when the user types into the field,
     * so the <code class="prettyprint">rawValue</code> changes as the value of the field is changed,
     * whether or not it is valid.
     * If the user types '2023' into the year field in an otherwise empty field,
     * the rawValue will be {year:2, month:undefined, day:undefined}, then {year:20, month:undefined, day:undefined},
     * then {year:202, month:undefined, day:undefined},
     * and finally {year:2023, month:undefined, day:undefined}. When the user blurs or presses
     * Enter the <code class="prettyprint">rawValue</code> property gets parsed into an date only ISO string (an error is thrown if
     * the date is not complete), and the date only ISO string gets validated. If valid, the <code class="prettyprint">value</code> property
     * gets updated with the date only ISO string.
     * </p>
     * <p>If the user clears the field, rawValue is undefined.
     * </p>
     * <p>This is a read-only attribute so page authors cannot set or change it directly.</p>
     *
     * @ojmetadata description "Specifies how the raw value of the component"
     * @ojmetadata displayName "Raw Value"
     * @ojmetadata help "#rawValue"
     */
    onRawValueChanged?: ReadOnlyPropertyChanged<CalendarDate | undefined>;
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
    onValueChanged?: PropertyChanged<string | null>;
};
type InputDatePickerHandle = {
    /**
     * @ojmetadata description "Blurs the date field."
     * @ignore
     */
    blur: () => void;
    /**
     * @ojmetadata description "Focuses the date field."
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
     * If enabled, validates the component's display value using the component's implicit converter which converts from
     * a CalendarDate object to a date only ISO string and all validators registered on the component and updates the value
     * option by performing the following steps.
     * <ol>
     * <li>All messages are cleared, including custom messages added by the app.</li>
     * <li>If the UI display value is empty, then the component normalizes the value to null.</li>
     * <li>
     *  If the normalized value is null, then processing continues to next step. Otherwise,
     *  the UI value is first converted (i.e., parsed). If there is a parse error (the field does not contain a complete date)
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
 * <h3 id="InputDatePickerOverview-section">
 *   JET Input Date Picker Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#InputDatePickerOverview-section"></a>
 * </h3>
 *
 * <p>Description: A JET Input Date Picker allows users to enter or select a single date using a
 * calendar interface.</p>
 *
 * <pre class="prettyprint"><code>&lt;oj-c-input-date-picker label-hint="Date">&lt;/oj-c-input-date-picker></code></pre>
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
 *       <td>Input field (Not a Segment)</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Sets focus to first segment. Show user assistance text.</td>
 *     </tr>
 *     <tr>
 *       <td>Input field segment</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Sets focus to segment. Show user assistance text.</td>
 *     </tr>
 *     <tr>
 *       <td>Input field segment</td>
 *       <td><kbd>Double Tap</kbd></td>
 *       <td>If the date is complete, selects the entire date. Hitting backspace clears it.</td>
 *     </tr>
 *      <tr>
 *       <td>Calendar icon (When the date picker is not open)</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Opens the Date Picker and moves the focus to the first focusable element in the DatePicker.</td>
 *     </tr>
 *     <tr>
 *       <td>Calendar icon (When the date picker is open)</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Closes the Date Picker.</td>
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
 *       <td>Input field</td>
 *       <td><kbd>Tab In</kbd></td>
 *       <td>Sets focus to first segment. Show user assistance text.</td>
 *     </tr>
 *     <tr>
 *       <td>Input field</td>
 *       <td><kbd>Ctrl + A</kbd> or <kbd>Command + A</kbd></td>
 *       <td>If the date is complete, selects the entire date. Double clicking on the field also selects the date.</td>
 *     </tr>
 *     <tr>
 *       <td>Input field with date selected</td>
 *       <td><kbd>Backspace/Delete</kbd></td>
 *       <td>Backspace or delete key clears the date. The mask placeholders will be shown again and focus will be on the first segment.</td>
 *     </tr>
 *     <tr>
 *       <td>Input field segment</td>
 *       <td><kbd>Backspace/Delete</kbd></td>
 *       <td>Clears the date segment. Focus remains on the date segment.</td>
 *     </tr>
 *     <tr>
 *       <td>Input field segment</td>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Moves focus to the segment on the right. If focus is on the rightmost segment, the focus does not move.</td>
 *     </tr>
 *     <tr>
 *       <td>Input field segment</td>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Moves focus to the segment on the left. If focus is on the leftmost segment, the focus does not move.</td>
 *     </tr>
 *    <tr>
 *       <td>Input field segment</td>
 *       <td><kbd>UpArrow/DownArrow</kbd></td>
 *       <td>Increments or decrements the number by one in the segment. If there is no number in the segment, it initializes it to the current date.</td>
 *     </tr>
 *    <tr>
 *       <td>Input field segment</td>
 *       <td><kbd>End</kbd></td>
 *       <td>Increments the segment to the maximum number for the segment. For example, if on the month segment, this will set the number to 12. If on the year segment, this will set the number to 2100.</td>
 *     </tr>
 *    <tr>
 *       <td>Input field segment</td>
 *       <td><kbd>Home</kbd></td>
 *       <td>Decrements the segment to the minimum number for the segment. For example, if on the month segment, this will set the number to 1. If on the year segment, this will set the number to 1900.</td>
 *     </tr>
 *    <tr>
 *       <td>Input field segment</td>
 *       <td><kbd>Page Up/Page Down</kbd></td>
 *       <td>Increments or decrements the number by two in the month segment, by seven in the day segment, or by five in the year segment. If there is no number in the segment, it initializes it to the current date.</td>
 *     </tr>
 *     <tr>
 *       <td>Date Picker</td>
 *       <td><kbd>Esc</kbd></td>
 *       <td>Closes the date picker.</td>
 *     </tr>
 *     <tr>
 *       <td>Date Picker</td>
 *       <td><kbd>Tab</kbd></td>
 *       <td>
 *         Moves the focus to next element in the date picker sequence. Only one element in the calendar grid is in the Tab sequence
 *         (current day/month/year or selected day/month/year depending on scenario). If focus is on the last tabbable element
 *         inside the date picker, moves focus to the first tabbable element inside the date picker.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>Date Picker</td>
 *       <td><kbd>Shift + Tab</kbd></td>
 *       <td>
 *         Moves the focus to the previous tabbable element inside the date picker. If focus is on the first tabbable element
 *         inside the date picker, moves focus to the last tabbable element inside the date picker.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>Date Picker</td>
 *       <td><kbd>Enter/Space</kbd></td>
 *       <td>
 *         Selects the currently focused day or activates the button currently focused.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>Calendar Grid</td>
 *       <td><kbd>PageUp</kbd></td>
 *       <td>Changes the calendar grid to the previous month. Moves focus to the closest day in the previous month.</td>
 *     </tr>
 *     <tr>
 *       <td>Calendar Grid</td>
 *       <td><kbd>PageDown</kbd></td>
 *       <td>Changes the calendar grid to the next month. Moves focus to the closest day in the next month.</td>
 *     </tr>
 *     <tr>
 *       <td>Calendar Grid</td>
 *       <td><kbd>Shift + PageUp</kbd></td>
 *       <td>Changes the calendar grid to the previous year. Moves focus to the closest day of the same month in the previous year.</td>
 *     </tr>
 *     <tr>
 *       <td>Calendar Grid</td>
 *       <td><kbd>Shift + PageDown</kbd></td>
 *       <td>Changes the calendar grid to the next year. Moves focus to the closest day of the same month in the next year.</td>
 *     </tr>
 *     <tr>
 *       <td>Calendar Grid</td>
 *       <td><kbd>Ctrl + Alt + T or Ctrl + Option + T</kbd></td>
 *      <td>Changes the calendar grid to the year and month that contains today's date. Moves focus to Today.</td>
 *     </tr>
 *     <tr>
 *       <td>Calendar Grid</td>
 *       <td><kbd>Home</kbd></td>
 *       <td>Go to the first day of the current month.</td>
 *     </tr>
 *     <tr>
 *       <td>Calendar Grid</td>
 *       <td><kbd>End</kbd></td>
 *       <td>Go to the last day of the current month.</td>
 *     </tr>
 *     <tr>
 *       <td>Calendar Grid</td>
 *       <td><kbd>ArrowLeft</kbd></td>
 *       <td>Moves focus to the previous day. In RTL, this will move focus to the next day.</td>
 *     </tr>
 *     <tr>
 *       <td>Calendar Grid</td>
 *       <td><kbd>ArrowRight</kbd></td>
 *       <td>Moves focus to the next day. In RTL, this will move focus to the previous day.</td>
 *     </tr>
 *     <tr>
 *       <td>Calendar Grid</td>
 *       <td><kbd>ArrowUp</kbd></td>
 *       <td>Moves focus to the same day of the previous week.</td>
 *     </tr>
 *     <tr>
 *       <td>Calendar Grid</td>
 *       <td><kbd>ArrowDown</kbd></td>
 *       <td>Moves focus to the same day of the next week.</td>
 *     </tr>
 *     <tr>
 *       <td>Months Grid</td>
 *       <td><kbd>Enter/Space</kbd></td>
 *       <td>
 *         Selects the currently focused month and returns to the date picker, refreshing the display to show the selected month.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>Months Grid</td>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Moves focus to four months back from the current focused month.</td>
 *     </tr>
 *     <tr>
 *       <td>Months Grid</td>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Moves focus to four months ahead from the current focused month.</td>
 *     </tr>
 *     <tr>
 *       <td>Months Grid</td>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Moves focus to the next month. In RTL, this will move focus to the previous month.</td>
 *     </tr>
 *     <tr>
 *       <td>Months Grid</td>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Moves focus to the previous month. In RTL, this will move focus to the next month.</td>
 *     </tr>
 *     <tr>
 *       <td>Years Grid</td>
 *       <td><kbd>Enter/Space</kbd></td>
 *       <td>
 *         Selects the currently focused year and returns to the date picker, refreshing the display to show the selected month.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>Years Grid</td>
 *       <td><kbd>PageUp</kbd></td>
 *       <td>Changes the year grid to the previous decade. The focus remains in the same location with respect to the current decade.</td>
 *     </tr>
 *     <tr>
 *       <td>Years Grid</td>
 *       <td><kbd>PageDown</kbd></td>
 *       <td>Changes the year grid to the next decade. The focus remains in the same location with respect to the current decade.</td>
 *     </tr>
 *     <tr>
 *       <td>Years Grid</td>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Moves focus to four years back from the current focused year. If that year is not in the year grid, go back 1 decade.</td>
 *     </tr>
 *     <tr>
 *       <td>Years Grid</td>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Moves focus to four years ahead from the current focused year. If that year is not in the year grid, go ahead 1 decade.</td>
 *     </tr>
 *     <tr>
 *       <td>Years Grid</td>
 *       <td><kbd>RightArrow</kbd></td>
 *       <td>Moves focus to the next year. In RTL, this will move focus to the previous year.</td>
 *     </tr>
 *     <tr>
 *       <td>Years Grid</td>
 *       <td><kbd>LeftArrow</kbd></td>
 *       <td>Moves focus to the previous year. In RTL, this will move focus to the next year.</td>
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
 * {@include accessibility_doc.ts#a11y-section-disabled-content}
 *
 * @ojmetadata displayName "InputDatePicker"
 * @ojmetadata description "An input date picker allows users to enter or select a single date using a calendar interface."
 * @ojmetadata help "oj-c.InputDatePicker.html"
 * @ojmetadata main "oj-c/input-date-picker"
 * @ojmetadata status [
 *   {
 *     "type": "supersedes",
 *     "since": "17.1.0",
 *     "value": ["oj-input-date"]
 *   }
 * ]
 * @ojmetadata extension {
 *   "catalog": {
 *     "category": "Forms"
 *   },
 *   "vbdt": {
 *     "module": "oj-c/input-date-picker",
 *     "defaultColumns": 6,
 *     "minColumns": 2
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-type-date-input"
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
 * @ojmetadata since "17.0.0"
 */
declare function InputDatePickerImpl({ columnSpan, daysOutsideMonth, disabled, displayOptions, help, helpHints, messagesCustom, monthAndYearPicker, readonlyUserAssistanceShown, required, todayButton, validators, value, weekDisplay, ...otherProps }: Props, ref: Ref<InputDatePickerHandle>): import("preact").JSX.Element;
/**
 * This export corresponds to the InputDatePicker Preact component. For the oj-c-input-date-picker custom element, import CInputDatePickerElement instead.
 */
export declare const InputDatePicker: ComponentType<ExtendGlobalProps<ComponentProps<typeof InputDatePickerImpl>> & {
    ref?: Ref<InputDatePickerHandle>;
}>;
export type InputDatePickerProps = Props;
export type InputDatePickerRef = Ref<InputDatePickerHandle>;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import { GlobalProps } from 'ojs/ojvcomponent';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-input-date-picker custom element. For the InputDatePicker Preact component, import InputDatePicker instead.
 */
export interface CInputDatePickerElement extends JetElement<CInputDatePickerElementSettableProperties>, CInputDatePickerElementSettableProperties {
    /**
     * <p>The  <code class="prettyprint">rawValue</code> is the read-only property for retrieving
     * the current displayed value from the component.</p>
     * <p>
     * The <code class="prettyprint">rawValue</code> updates when the user types into the field,
     * so the <code class="prettyprint">rawValue</code> changes as the value of the field is changed,
     * whether or not it is valid.
     * If the user types '2023' into the year field in an otherwise empty field,
     * the rawValue will be {year:2, month:undefined, day:undefined}, then {year:20, month:undefined, day:undefined},
     * then {year:202, month:undefined, day:undefined},
     * and finally {year:2023, month:undefined, day:undefined}. When the user blurs or presses
     * Enter the <code class="prettyprint">rawValue</code> property gets parsed into an date only ISO string (an error is thrown if
     * the date is not complete), and the date only ISO string gets validated. If valid, the <code class="prettyprint">value</code> property
     * gets updated with the date only ISO string.
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
    addEventListener<T extends keyof CInputDatePickerElementEventMap>(type: T, listener: (this: HTMLElement, ev: CInputDatePickerElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CInputDatePickerElementSettableProperties>(property: T): CInputDatePickerElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CInputDatePickerElementSettableProperties>(property: T, value: CInputDatePickerElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CInputDatePickerElementSettableProperties>): void;
    setProperties(properties: CInputDatePickerElementSettablePropertiesLenient): void;
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
     * If enabled, validates the component's display value using the component's implicit converter which converts from
     * a CalendarDate object to a date only ISO string and all validators registered on the component and updates the value
     * option by performing the following steps.
     * <ol>
     * <li>All messages are cleared, including custom messages added by the app.</li>
     * <li>If the UI display value is empty, then the component normalizes the value to null.</li>
     * <li>
     *  If the normalized value is null, then processing continues to next step. Otherwise,
     *  the UI value is first converted (i.e., parsed). If there is a parse error (the field does not contain a complete date)
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
export namespace CInputDatePickerElement {
    type columnSpanChanged = JetElementCustomEventStrict<CInputDatePickerElement['columnSpan']>;
    type containerReadonlyChanged = JetElementCustomEventStrict<CInputDatePickerElement['containerReadonly']>;
    type dateRangeOverflowMessageDetailChanged = JetElementCustomEventStrict<CInputDatePickerElement['dateRangeOverflowMessageDetail']>;
    type dateRangeUnderflowMessageDetailChanged = JetElementCustomEventStrict<CInputDatePickerElement['dateRangeUnderflowMessageDetail']>;
    type dateRestrictionMessageDetailChanged = JetElementCustomEventStrict<CInputDatePickerElement['dateRestrictionMessageDetail']>;
    type dayFormatterChanged = JetElementCustomEventStrict<CInputDatePickerElement['dayFormatter']>;
    type daysOutsideMonthChanged = JetElementCustomEventStrict<CInputDatePickerElement['daysOutsideMonth']>;
    type disabledChanged = JetElementCustomEventStrict<CInputDatePickerElement['disabled']>;
    type displayOptionsChanged = JetElementCustomEventStrict<CInputDatePickerElement['displayOptions']>;
    type helpChanged = JetElementCustomEventStrict<CInputDatePickerElement['help']>;
    type helpHintsChanged = JetElementCustomEventStrict<CInputDatePickerElement['helpHints']>;
    type labelEdgeChanged = JetElementCustomEventStrict<CInputDatePickerElement['labelEdge']>;
    type labelHintChanged = JetElementCustomEventStrict<CInputDatePickerElement['labelHint']>;
    type labelStartWidthChanged = JetElementCustomEventStrict<CInputDatePickerElement['labelStartWidth']>;
    type labelWrappingChanged = JetElementCustomEventStrict<CInputDatePickerElement['labelWrapping']>;
    type maxChanged = JetElementCustomEventStrict<CInputDatePickerElement['max']>;
    type maxWidthChanged = JetElementCustomEventStrict<CInputDatePickerElement['maxWidth']>;
    type messagesCustomChanged = JetElementCustomEventStrict<CInputDatePickerElement['messagesCustom']>;
    type minChanged = JetElementCustomEventStrict<CInputDatePickerElement['min']>;
    type monthAndYearPickerChanged = JetElementCustomEventStrict<CInputDatePickerElement['monthAndYearPicker']>;
    type rawValueChanged = JetElementCustomEventStrict<CInputDatePickerElement['rawValue']>;
    type readonlyChanged = JetElementCustomEventStrict<CInputDatePickerElement['readonly']>;
    type readonlyUserAssistanceShownChanged = JetElementCustomEventStrict<CInputDatePickerElement['readonlyUserAssistanceShown']>;
    type requiredChanged = JetElementCustomEventStrict<CInputDatePickerElement['required']>;
    type requiredMessageDetailChanged = JetElementCustomEventStrict<CInputDatePickerElement['requiredMessageDetail']>;
    type textAlignChanged = JetElementCustomEventStrict<CInputDatePickerElement['textAlign']>;
    type todayButtonChanged = JetElementCustomEventStrict<CInputDatePickerElement['todayButton']>;
    type todayTimeZoneChanged = JetElementCustomEventStrict<CInputDatePickerElement['todayTimeZone']>;
    type userAssistanceDensityChanged = JetElementCustomEventStrict<CInputDatePickerElement['userAssistanceDensity']>;
    type validChanged = JetElementCustomEventStrict<CInputDatePickerElement['valid']>;
    type validatorsChanged = JetElementCustomEventStrict<CInputDatePickerElement['validators']>;
    type valueChanged = JetElementCustomEventStrict<CInputDatePickerElement['value']>;
    type weekDisplayChanged = JetElementCustomEventStrict<CInputDatePickerElement['weekDisplay']>;
    type widthChanged = JetElementCustomEventStrict<CInputDatePickerElement['width']>;
}
export interface CInputDatePickerElementEventMap extends HTMLElementEventMap {
    'columnSpanChanged': JetElementCustomEventStrict<CInputDatePickerElement['columnSpan']>;
    'containerReadonlyChanged': JetElementCustomEventStrict<CInputDatePickerElement['containerReadonly']>;
    'dateRangeOverflowMessageDetailChanged': JetElementCustomEventStrict<CInputDatePickerElement['dateRangeOverflowMessageDetail']>;
    'dateRangeUnderflowMessageDetailChanged': JetElementCustomEventStrict<CInputDatePickerElement['dateRangeUnderflowMessageDetail']>;
    'dateRestrictionMessageDetailChanged': JetElementCustomEventStrict<CInputDatePickerElement['dateRestrictionMessageDetail']>;
    'dayFormatterChanged': JetElementCustomEventStrict<CInputDatePickerElement['dayFormatter']>;
    'daysOutsideMonthChanged': JetElementCustomEventStrict<CInputDatePickerElement['daysOutsideMonth']>;
    'disabledChanged': JetElementCustomEventStrict<CInputDatePickerElement['disabled']>;
    'displayOptionsChanged': JetElementCustomEventStrict<CInputDatePickerElement['displayOptions']>;
    'helpChanged': JetElementCustomEventStrict<CInputDatePickerElement['help']>;
    'helpHintsChanged': JetElementCustomEventStrict<CInputDatePickerElement['helpHints']>;
    'labelEdgeChanged': JetElementCustomEventStrict<CInputDatePickerElement['labelEdge']>;
    'labelHintChanged': JetElementCustomEventStrict<CInputDatePickerElement['labelHint']>;
    'labelStartWidthChanged': JetElementCustomEventStrict<CInputDatePickerElement['labelStartWidth']>;
    'labelWrappingChanged': JetElementCustomEventStrict<CInputDatePickerElement['labelWrapping']>;
    'maxChanged': JetElementCustomEventStrict<CInputDatePickerElement['max']>;
    'maxWidthChanged': JetElementCustomEventStrict<CInputDatePickerElement['maxWidth']>;
    'messagesCustomChanged': JetElementCustomEventStrict<CInputDatePickerElement['messagesCustom']>;
    'minChanged': JetElementCustomEventStrict<CInputDatePickerElement['min']>;
    'monthAndYearPickerChanged': JetElementCustomEventStrict<CInputDatePickerElement['monthAndYearPicker']>;
    'rawValueChanged': JetElementCustomEventStrict<CInputDatePickerElement['rawValue']>;
    'readonlyChanged': JetElementCustomEventStrict<CInputDatePickerElement['readonly']>;
    'readonlyUserAssistanceShownChanged': JetElementCustomEventStrict<CInputDatePickerElement['readonlyUserAssistanceShown']>;
    'requiredChanged': JetElementCustomEventStrict<CInputDatePickerElement['required']>;
    'requiredMessageDetailChanged': JetElementCustomEventStrict<CInputDatePickerElement['requiredMessageDetail']>;
    'textAlignChanged': JetElementCustomEventStrict<CInputDatePickerElement['textAlign']>;
    'todayButtonChanged': JetElementCustomEventStrict<CInputDatePickerElement['todayButton']>;
    'todayTimeZoneChanged': JetElementCustomEventStrict<CInputDatePickerElement['todayTimeZone']>;
    'userAssistanceDensityChanged': JetElementCustomEventStrict<CInputDatePickerElement['userAssistanceDensity']>;
    'validChanged': JetElementCustomEventStrict<CInputDatePickerElement['valid']>;
    'validatorsChanged': JetElementCustomEventStrict<CInputDatePickerElement['validators']>;
    'valueChanged': JetElementCustomEventStrict<CInputDatePickerElement['value']>;
    'weekDisplayChanged': JetElementCustomEventStrict<CInputDatePickerElement['weekDisplay']>;
    'widthChanged': JetElementCustomEventStrict<CInputDatePickerElement['width']>;
}
export interface CInputDatePickerElementSettableProperties extends JetSettableProperties {
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
     * dateRangeOverflowMessageDetail = (p: { value: string; max: string }) => `The date ${p.value} needs to be on or before ${p.max}.`<br/>
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
     * dateRangeUnderflowMessageDetail = (p: { value: string; min: string }) => `The date ${p.value} needs to be on or after ${p.min}.`<br/>
     * dateRangeUnderflowMessageDetail = (p: {min: string }) => `The date needs to be on or after ${p.min}.`<br/>
     * dateRangeUnderflowMessageDetail = () => `The date is out of range.`
     */
    dateRangeUnderflowMessageDetail?: Props['dateRangeUnderflowMessageDetail'];
    /**
     * <p>
     * A callback function that returns a component-specific message when the date restriction validation fails when the user's input is disabled or restricted.
     * If the component needs a validation error message for restriction that is different from the default,
     * set this property. The function should return a translated string.
     * </p>
     * Usage: <br/>
     * dateRestrictionMessageDetail = (p: { value: string }) => `The date ${p.value} is not available.`<br/>
     * dateRestrictionMessageDetail = () => `The date is not available.`
     */
    dateRestrictionMessageDetail?: Props['dateRestrictionMessageDetail'];
    /**
     * <p>
     * A callback function that returns additional information for rendering a day in the Date Picker.
     * If you want to restrict or disable some of the days, set this property. When this property is set,
     * this will be used to validate the value. If a selected date is either 'disabled' or 'restricted',
     * it will fail the validation and a validation error will be shown.
     * <p>
     */
    dayFormatter?: Props['dayFormatter'];
    /**
     * The days-outside-month attribute affects the day cells that are outside of the current month.
     */
    daysOutsideMonth?: Props['daysOutsideMonth'];
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
     * The maximum selectable date, in date only ISO string format.
     * The date the user enters must be less than or equal to the max date, otherwise the user will see an error.
     * Also, the dates in the date picker that are greater than this date will not be selectable.
     * This must be a date only ISO string with no time, otherwise an error is thrown and the component will not render.
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
     * The minimum selectable date, in date only ISO string format.
     * The date the user enters must be greater than or equal to the min date, otherwise the user will see an error.
     * Also, the dates in the date picker that are less than this date will not be selectable.
     * This must be a date only ISO string with no time, otherwise an error is thrown and the component will not render.
     * When set to null, there is no minimum.
     */
    min?: Props['min'];
    /**
     * The month-and-year-picker attribute can be used to specify whether or not the DatePicker should show the
     * toggle buttons that toggle the month grid picker and year grid picker. The month picker grid allows
     * the user to select a month to display in the date picker and the year picker grid allows the user to
     * select the year to display in the date picker.
     */
    monthAndYearPicker?: Props['monthAndYearPicker'];
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
     * Specifies the visibility of the 'Go to today' button.
     */
    todayButton?: Props['todayButton'];
    /**
     * <p>
     * The today-time-zone attribute is used to compute today's date.
     * This defaults to the user's system timezone.
     * </p>
     * <p>
     * The only reason an application would set the today-time-zone property is if they want the
     * highlighted today cell to be in a different timezone than the user's system's timezone,
     * like if the user has a preferred timezone that is not where they are physically working.
     * </p>
     */
    todayTimeZone?: Props['todayTimeZone'];
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
     * <p>The value must be a local date (no time) ISO string such as '2021-03-14',
     * otherwise the component will throw an error.</p>
     * <p>
     * If needed, use IntlConverterUtils.dateToLocalIsoDateString to convert a Date to
     * a local ISO string that contains only the date to set as the initial value.
     * IntlConverterUtils.dateToLocalIsoDateString(new Date(2014, 1, 1)));
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
     * Whether week of the year will be shown in the DatePicker. The default calculation follows the
     * rule for ISO 8601 as follows: The first week of the year is defined as the week that contains
     * the first Thursday. Therefore, if January 1st falls on a Friday, it is considered part of the last week
     * of the previous year. Conversely, if December 31st falls on a Wednesday, it is part of week 1 of the following year.
     */
    weekDisplay?: Props['weekDisplay'];
    /**
     * Specifies the component's width.  If unset, the default width is 100%.
     * Note that by default max-width is 100%, which will override the width if the container is smaller than the width specified.
     */
    width?: Props['width'];
}
export interface CInputDatePickerElementSettablePropertiesLenient extends Partial<CInputDatePickerElementSettableProperties> {
    [key: string]: any;
}
export interface InputDatePickerIntrinsicProps extends Partial<Readonly<CInputDatePickerElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    rawValue?: never;
    valid?: never;
    oncolumnSpanChanged?: (value: CInputDatePickerElementEventMap['columnSpanChanged']) => void;
    oncontainerReadonlyChanged?: (value: CInputDatePickerElementEventMap['containerReadonlyChanged']) => void;
    ondateRangeOverflowMessageDetailChanged?: (value: CInputDatePickerElementEventMap['dateRangeOverflowMessageDetailChanged']) => void;
    ondateRangeUnderflowMessageDetailChanged?: (value: CInputDatePickerElementEventMap['dateRangeUnderflowMessageDetailChanged']) => void;
    ondateRestrictionMessageDetailChanged?: (value: CInputDatePickerElementEventMap['dateRestrictionMessageDetailChanged']) => void;
    ondayFormatterChanged?: (value: CInputDatePickerElementEventMap['dayFormatterChanged']) => void;
    ondaysOutsideMonthChanged?: (value: CInputDatePickerElementEventMap['daysOutsideMonthChanged']) => void;
    ondisabledChanged?: (value: CInputDatePickerElementEventMap['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: CInputDatePickerElementEventMap['displayOptionsChanged']) => void;
    onhelpChanged?: (value: CInputDatePickerElementEventMap['helpChanged']) => void;
    onhelpHintsChanged?: (value: CInputDatePickerElementEventMap['helpHintsChanged']) => void;
    onlabelEdgeChanged?: (value: CInputDatePickerElementEventMap['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: CInputDatePickerElementEventMap['labelHintChanged']) => void;
    onlabelStartWidthChanged?: (value: CInputDatePickerElementEventMap['labelStartWidthChanged']) => void;
    /** @deprecated since 18.0.0 */ onlabelWrappingChanged?: (value: CInputDatePickerElementEventMap['labelWrappingChanged']) => void;
    onmaxChanged?: (value: CInputDatePickerElementEventMap['maxChanged']) => void;
    onmaxWidthChanged?: (value: CInputDatePickerElementEventMap['maxWidthChanged']) => void;
    onmessagesCustomChanged?: (value: CInputDatePickerElementEventMap['messagesCustomChanged']) => void;
    onminChanged?: (value: CInputDatePickerElementEventMap['minChanged']) => void;
    onmonthAndYearPickerChanged?: (value: CInputDatePickerElementEventMap['monthAndYearPickerChanged']) => void;
    onrawValueChanged?: (value: CInputDatePickerElementEventMap['rawValueChanged']) => void;
    onreadonlyChanged?: (value: CInputDatePickerElementEventMap['readonlyChanged']) => void;
    onreadonlyUserAssistanceShownChanged?: (value: CInputDatePickerElementEventMap['readonlyUserAssistanceShownChanged']) => void;
    onrequiredChanged?: (value: CInputDatePickerElementEventMap['requiredChanged']) => void;
    onrequiredMessageDetailChanged?: (value: CInputDatePickerElementEventMap['requiredMessageDetailChanged']) => void;
    ontextAlignChanged?: (value: CInputDatePickerElementEventMap['textAlignChanged']) => void;
    ontodayButtonChanged?: (value: CInputDatePickerElementEventMap['todayButtonChanged']) => void;
    ontodayTimeZoneChanged?: (value: CInputDatePickerElementEventMap['todayTimeZoneChanged']) => void;
    onuserAssistanceDensityChanged?: (value: CInputDatePickerElementEventMap['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: CInputDatePickerElementEventMap['validChanged']) => void;
    onvalidatorsChanged?: (value: CInputDatePickerElementEventMap['validatorsChanged']) => void;
    onvalueChanged?: (value: CInputDatePickerElementEventMap['valueChanged']) => void;
    onweekDisplayChanged?: (value: CInputDatePickerElementEventMap['weekDisplayChanged']) => void;
    onwidthChanged?: (value: CInputDatePickerElementEventMap['widthChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-input-date-picker': InputDatePickerIntrinsicProps;
        }
    }
}
