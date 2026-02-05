import { NumberInputText as PreactNumberInputText } from '@oracle/oraclejet-preact/UNSAFE_NumberInputText';
import { DisplayOptions, Help, HelpHints } from 'oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText';
import Converter = require('ojs/ojconverter');
import Validator = require('ojs/ojvalidator');
import AsyncValidator = require('ojs/ojvalidator-async');
import { ExtendGlobalProps, GlobalProps, ObservedGlobalProps, PropertyChanged, ReadOnlyPropertyChanged } from 'ojs/ojvcomponent';
import { ComponentProps, ComponentType, Ref } from 'preact';
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
import { LayoutColumnSpan } from '@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout';
import 'css!oj-c/input-number/input-number-styles.css';
type PreactNumberInputTextProps = ComponentProps<typeof PreactNumberInputText>;
/**
 * Various supported valid states
 */
type ValidState = 'valid' | 'pending' | 'invalidHidden' | 'invalidShown';
/**
 * The properties of the InputNumber component
 */
type Props = ObservedGlobalProps<'aria-describedby' | 'id'> & {
    /**
     * @description
     * Dictates component's autocomplete state. This attribute indicates whether the value of
     * the control can be automatically completed by the browser. The common values are 'on' and 'off'.
     *
     * Since this attribute passes through to the input element unchanged, you can look at the html specs for
     * detailed information for how browsers behave and what values besides 'on' and 'off' you can set.
     * The html spec says the default is 'on', so when autocomplete is not explicitly set, the browsers treat it as 'on'.
     *
     * @ojmetadata description "Dictates component's autocomplete state"
     * @ojmetadata displayName "Autocomplete"
     * @ojmetadata help "#autocomplete"
     */
    autocomplete?: 'on' | 'off' | string;
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
     * A converter instance or one that duck types oj.Converter.
     * <p>
     * When no converter is specified, an instance of NumberConverter with no options will be used.
     * </p>
     * <p>
     * When <code class="prettyprint">converter</code> property changes due to programmatic
     * intervention, the element performs various tasks based on the current state it is in. </br>
     *
     * <h4>Steps Performed Always</h4>
     * <ul>
     * <li>Any cached converter instance is cleared and new converter created. The converter hint is
     * pushed to messaging. E.g., notewindow displays the new hint(s).
     * </li>
     * </ul>
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>if element is valid when <code class="prettyprint">converter</code> property changes, the
     *  display value is refreshed.</li>
     * <li>if element is invalid and is showing messages when
     * <code class="prettyprint">converter</code> property changes then all element messages are
     * cleared and full validation run using the current display value on the element.
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code>
     *   property is not updated, and the error is shown.
     *   The display value is not refreshed in this case. </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
     *   event to clear custom errors. The
     *   display value is refreshed with the formatted value provided by converter.</li>
     * </ul>
     * </li>
     * <li>if element is invalid and has deferred messages when converter property changes, the
     *   display value is again refreshed with the formatted value provided by converter.</li>
     * </ul>
     *
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>Only messages created by the element are cleared.</li>
     * <li><code class="prettyprint">messagesCustom</code> property is not cleared.
     * Page authors can
     * choose to clear it explicitly when setting the converter option.</li>
     * </ul>
     * </p>
     * <p>
     *  During validation, the converter takes the input value which is a string
     *  and parses it into the type of the component's value property
     *  (e.g. a number)
     *  before it passes it to the validator. It then takes the validated value property
     *  and formats it into a string to be displayed and puts it into the input.
     *  If the converter's format or parse functions
     *  throw an error, it will be displayed to the user inline on the field.
     * </p>
     * <p>
     * The hint exposed by the converter is shown inline by default in the Redwood theme when
     * the field has focus.
     * You can turn off showing converter hints by using the
     * 'converterHint' property set to 'none' on the <code class="prettyprint">display-options</code>
     * attribute.
     * </p>
     * <p>
     * In the Redwood theme, only one hint shows at a time, so the precedence rules are:
     * help.instruction shows; if no help.instruction then validator hints show;
     * if none, then help-hints.definition shows; if none, then converter hint shows.
     * help-hints.source always shows along with the other help or hint.
     * </p>
     *
     * @ojmetadata description "Specifies the converter instance."
     * @ojmetadata displayName "Converter"
     * @ojmetadata help "#converter"
     */
    converter?: Converter<number> | null;
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
    displayOptions?: DisplayOptions;
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
     * The inputPrefix displays as regular text before the input text.
     * The inputPrefix is not editable or focusable.
     *
     * @ojmetadata description "The text before the input text."
     * @ojmetadata displayName "Input Prefix"
     * @ojmetadata help "#inputPrefix"
     * @ojmetadata translatable
     */
    inputPrefix?: PreactNumberInputTextProps['prefix'];
    /**
     * @description
     * The inputSuffix displays as regular text after the input text.
     * The inputSuffix is not editable or focusable.
     *
     * @ojmetadata description "The text after the input text."
     * @ojmetadata displayName "Input Suffix"
     * @ojmetadata help "#inputSuffix"
     * @ojmetadata translatable
     */
    inputSuffix?: PreactNumberInputTextProps['suffix'];
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
    labelEdge?: PreactNumberInputTextProps['labelEdge'];
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
     * The maximum allowed value. This number is used in the range validator; if the
     * <code class="prettyprint">value</code> is greater than the <code class="prettyprint">max</code>,
     * then the range validator flags an error to the user. The increase button and up arrow
     * are disabled when the maximum value is reached.
     * <p>
     * The <code class="prettyprint">max</code> must not be less than the
     * <code class="prettyprint">min</code>, else an Error is thrown during initialization.
     * </p>
     * @ojmetadata description "The maximum allowed value"
     * @ojmetadata displayName "Max"
     * @ojmetadata help "#max"
     */
    max?: number | null;
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
     * The minimum allowed value. This number is used in the range validator; if the
     * <code class="prettyprint">value</code> is less than the <code class="prettyprint">min</code>,
     * then the range validator flags an error to the user. The decrease button and down arrow
     * are disabled when the minimum value is reached.
     * The <code class="prettyprint">min</code> must not be greater than the
     * <code class="prettyprint">max</code>, else an Error is thrown during initialization.
     * @ojmetadata description "The minimum allowed value"
     * @ojmetadata displayName "Min"
     * @ojmetadata help "#min"
     */
    min?: number | null;
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
    messagesCustom?: PreactNumberInputTextProps['messages'];
    /**
     * @description
     * <p>
     * The component-specific message detail when the number range validation fails when the input value is not between min and max
     * when min and max are equal.
     * If the component needs a number range validation error message for an exact number that is different from the default,
     * set this property. It should be a translated string.
     * </p>
     * Tokens:<br/>
     * {num} - the allowed value<p>
     * Usage: <br/>
     * The number must be {num}.
     *
     * @ojmetadata description "Overrides the default NumberRangeValidator's exact message detail."
     * @ojmetadata displayName "Number Range Exact Message Detail"
     * @ojmetadata help "#numberRangeExactMessageDetail"
     * @ojmetadata translatable
     */
    numberRangeExactMessageDetail?: string;
    /**
     * @description
     * <p>
     * The component-specific message detail when the number range validation fails when the input value is greater than the max.
     * If the component needs a number range validation error message for overflow that is different from the default,
     * set this property. It should be a translated string.
     * </p>
     * Tokens:<br/>
     * {value} - value entered by the user<br/>
     * {max} - the maximum allowed value<p>
     * Usage: <br/>
     * The number must be less than or equal to {max}.
     *
     * @ojmetadata description "Overrides the default NumberRangeValidator's exact message detail."
     * @ojmetadata displayName "Number Range Exact Message Detail"
     * @ojmetadata help "#numberRangeExactMessageDetail"
     * @ojmetadata translatable
     */
    numberRangeOverflowMessageDetail?: string;
    /**
     * @description
     * <p>
     * The component-specific message detail when the number range validation fails when the input value is less than the min.
     * If the component needs a number range validation error message for underflow that is different from the default,
     * set this property. It should be a translated string.
     * </p>
     * Tokens:<br/>
     * {value} - value entered by the user<br/>
     * {min} - the minimum allowed value<p>
     * Usage: <br/>
     * The number must be greater than or equal to {min}.
     *
     * @ojmetadata description "Overrides the default NumberRangeValidator's exact message detail."
     * @ojmetadata displayName "Number Range Exact Message Detail"
     * @ojmetadata help "#numberRangeExactMessageDetail"
     * @ojmetadata translatable
     */
    numberRangeUnderflowMessageDetail?: string;
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
     * The size of the step to take when spinning via the step buttons or up/down arrows.
     * If step is 0, inputNumber will not have the step buttons or up/down spin functionality.
     * If step is less than 0, an exception is thrown.
     * <p><code class="prettyprint">step</code> defaults to <code class="prettyprint">0</code>.
     * </p>
     * <p>
     * <p>
     * The <code class="prettyprint">step</code> attribute can be used together
     * with the <code class="prettyprint">min</code> and
     * <code class="prettyprint">max</code> attributes
     * to create a range of values the step buttons or up/down arrows will step through. For example,
     * if min is 0 and step is 3, the range of values is 0, 3, 6, etc.
     * </p>
     * <p>
     * The step buttons or up/down arrows will spin the value and adjust it to keep it a
     * 'step match' value.
     * A 'step match' value is when the value is a multiple
     * of <code class="prettyprint">step</code>,
     * starting at the <code class="prettyprint">min</code>, and if
     * <code class="prettyprint">min</code> is not set,
     * then starting at the initial <code class="prettyprint">value</code>,
     * and if neither <code class="prettyprint">min</code> and initial
     * <code class="prettyprint">value</code> are set,
     * then starting at 0.
     * </p>
     * <p>When using step > 1 with min and/or max,
     * make sure the initial value and max are both a 'step match' value,
     * otherwise the first step will adjust the value in a way
     * that could confuse the user.</p>
     * </p>
     * <p>
     * A value can be a step mismatch; if the <code class="prettyprint">value</code> is set
     * to be a step mismatch, it will not be flagged as a validation error.
     * </p>
     * @ojmetadata description Specifies the amount to increase or decrease the value when moving in step increments. If 0, no step functionality.
     * @ojmetadata displayName "Step"
     * @ojmetadata help "#step"
     *
     */
    step?: number;
    /**
     * @description
     * Variant style of step buttons. Quantitative is recommended only for non-negative integers where the step value is 1, which is common in ecommerce or procurement cases.
     *
     * @ojmetadata description Variant style of step buttons. Quantitative is recommended only for non-negative integers where the step value is 1, which is common in ecommerce or procurement cases.
     * @ojmetadata displayName "Stepper Variant"
     * @ojmetadata help "#stepperVariant"
     * @ojmetadata propertyEditorValues {
     *   "directional": {
     *     "description": "Displays directional buttons, grouped together and located at end of input.",
     *     "displayName": "Directional"
     *   },
     *   "quantitative": {
     *     "description": "Displays quantitative buttons, separated and located at start and end of input.",
     *     "displayName": "Quantitative"
     *   },
     * }
     */
    stepperVariant?: PreactNumberInputTextProps['stepperVariant'];
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
    textAlign?: PreactNumberInputTextProps['textAlign'];
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
    userAssistanceDensity?: PreactNumberInputTextProps['userAssistanceDensity'];
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
    validators?: (AsyncValidator<number> | Validator<number>)[] | null;
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
    value?: number | null;
    /**
     * @description
     * The type of virtual keyboard to display for entering a value on mobile browsers. This attribute has no effect on desktop browsers.
     *
     * @ojmetadata description "The type of virtual keyboard to display for entering a value on mobile browsers"
     * @ojmetadata displayName "Virtual Keyboard"
     * @ojmetadata help "#virtualKeyboard"
     * @ojmetadata propertyEditorValues {
     *   "number": {
     *     "description": "Use a mobile virtual keyboard for entering numbers. If using 'number', you must set the converter attribute to a converter that formats to numeric characters only, otherwise the value will not be shown. The reason for this is oj-c-input-number uses the browser native input type='number' and when you set a value that contains a non-numeric character, browsers do not display the value. For example, '1,000' would not be shown. Note that on Android and Windows Mobile, the 'number' keyboard does not contain the minus sign. This value should not be used on fields that accept negative values.",
     *     "displayName": "Number"
     *   },
     *   "auto": {
     *     "description": "The component will determine the best mobile virtual keyboard to use (default, if unspecified).",
     *     "displayName": "Auto"
     *   },
     *   "text": {
     *     "description": "Use a mobile virtual keyboard for entering text.",
     *     "displayName": "Text"
     *   }
     * }
     */
    virtualKeyboard?: PreactNumberInputTextProps['virtualKeyboard'];
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
    onMessagesCustomChanged?: PropertyChanged<PreactNumberInputTextProps['messages']>;
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
     * <p>The  <code class="prettyprint">transientValue</code> is the read-only property for retrieving
     * the current transient value.</p>
     * <p>
     * The <code class="prettyprint">transientValue</code> updates to display the transient
     * changes from pressing the step buttons or up/down arrow (subject to the step constraints).
     * <code class="prettyprint">transientValue</code> will update only if it passes
     * validation.
     * </p>
     * <p>
     * The difference in behavior is
     * <code class="prettyprint">transientValue</code> will be updated
     * as the step buttons or up/down arrow is pressed (and only if validation succeeds),
     * whereas <code class="prettyprint">value</code>
     * is updated only after the step buttons or up/down arrow is released
     * (and only if validation succeeds).
     * </p>
     * <p>This is a read-only attribute so page authors cannot set or change it directly.</p>
     *
     * @ojmetadata description "Specifies the transient value of the component"
     * @ojmetadata displayName "Transient Value"
     * @ojmetadata help "#transientValue"
     */
    onTransientValueChanged?: ReadOnlyPropertyChanged<number | null>;
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
    onValueChanged?: PropertyChanged<number | null>;
};
type InputNumberHandle = {
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
     * User entered values will be erased when this method is called.
     * @ojmetadata description "Resets the component by clearing all messages
     * and updating the component's display value using the attribute value."
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
     *          parse errors or if there were validation errors.
     *
     * @ojmetadata description "If enabled, validates the component's display value using the converter and all validators
     * registered on the component. The Promise resolves to 'valid' if there were no converter parse errors and the component
     * passed all validations, or if the component is disabled or readonly."
     */
    validate: () => Promise<'valid' | 'invalid'>;
};
/**
 * @classdesc
 * <h3 id="inputNumberOverview-section">
 *   JET InputNumber Component
 *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputNumberOverview-section"></a>
 * </h3>
 *
 * <p>Description: The JET Input Number component enhances a browser input element into one that
 * holds numbers and it has a spinbox to quickly increment or decrement the number.
 * The value attribute must be a number and must be within the min and max range..</p>
 *
 * <pre class="prettyprint"><code>&lt;oj-c-input-number value="20" label-hint="Input Number">&lt;/oj-c-input-number></code></pre>
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
 * messages added by the app, and full validation lifecycle is run on the UI value. The steps performed are
 * outlined below.
 * <ol>
 * <li>All messages are cleared and <code class="prettyprint">messagesCustom</code> property is cleared</li>
 * <li>If the UI display value is empty, then the component normalizes the value to null.</li>
 * <li>
 *  If no converter is present, or the normalized value is null, then processing continues to next step. Otherwise,
 *  the UI value is first converted (i.e., parsed). If there is a parse error then the messages are shown and processing stops.
 * </li>
 * <li>If there are no validators setup for the component then the value is set on the component.
 * Otherwise all validators are run in sequence using the parsed value from the previous step. The
 * implicit required is run first if the component is marked required. When a validation error is
 * encountered it is remembered and the next validator in the sequence is run.
 * If the normalized value is null, then only the required validator is run.
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
 * cleared and full validation run using the display value. See <code class="prettyprint">validate</code>
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
 *  <li>when converter property changes (for components that support converters). See <a href="#converter">converter</a> property for details.</li>
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
 * <p>The required and placeholder properties also can be used to guide the user.
 * In Redwood, a required field shows the word Required under the field
 * when the field is empty and does not have focus.
 * Placeholder is shown when the field is empty and has focus.
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
 *       <td>Up Button</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Increment the number.</td>
 *     </tr>
 *     <tr>
 *       <td>Down Button</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Decrement the number.</td>
 *     </tr>
 *     <tr>
 *       <td>Input</td>
 *       <td><kbd>Tap</kbd></td>
 *       <td>Set focus to the input. Show user assistance text. This may be inline or in a notewindow
 * depending upon theme and property settings.</td>
 *     </tr>
 *     <tr>
 *       <td>Elsewhere on Page</td>
 *       <td><kbd>Touch</kbd></td>
 *       <td>Submit the value you typed in the input field.</td>
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
 *       <td rowspan="4">Input</td>
 *       <td><kbd>Enter</kbd> or <kbd>Tab</kbd></td>
 *       <td>Submit the value you typed in the input field.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>Tab In</kbd></td>
 *       <td>Set focus to input. Show user assistance text. This may be inline or in a notewindow
 * depending upon theme and property settings.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>UpArrow</kbd></td>
 *       <td>Increment the number.</td>
 *     </tr>
 *     <tr>
 *       <td><kbd>DownArrow</kbd></td>
 *       <td>Decrement the number.</td>
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
 * <p>
 * The placeholder text is not read reliably by the screen reader. For accessibility reasons,
 * you need to associate the text to its JET form component using aria-describedby.
 * </p>
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
 * @ojmetadata displayName "InputNumber"
 * @ojmetadata description "An input number allows the user to enter a number value."
 * @ojmetadata help "oj-c.InputNumber.html"
 * @ojmetadata main "oj-c/input-number"
 * @ojmetadata status [
 *   {
 *     "type": "supersedes",
 *     "since": "16.0.0",
 *     "value": ["oj-input-number"]
 *   }
 * ]
 * @ojmetadata extension {
 *   "catalog": {
 *     "category": "Forms"
 *   },
 *   "vbdt": {
 *     "module": "oj-c/input-number",
 *     "defaultColumns": 6,
 *     "minColumns": 2
 *   },
 *   "oracle": {
 *     "icon": "oj-ux-ico-input-number",
 *     "uxSpecs": [
 *       "input-number"
 *     ]
 *   }
 * }
 * @ojmetadata propertyLayout [
 *   {
 *     "propertyGroup": "common",
 *     "items": [
 *       "disabled",
 *       "labelHint",
 *       "placeholder",
 *       "readonly",
 *       "required",
 *       "virtualKeyboard"
 *     ]
 *   },
 *   {
 *     "propertyGroup": "data",
 *     "items": [
 *       "value"
 *     ]
 *   }
 * ]
 * @ojmetadata since "14.0.0"
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
declare const InputNumberImpl: ({ autocomplete, columnSpan, converter, containerReadonly: propContainerReadonly, disabled, displayOptions, help, helpHints, id, labelWrapping: propLabelWrapping, messagesCustom, readonly: propReadonly, readonlyUserAssistanceShown, required, stepperVariant, textAlign: propTextAlign, userAssistanceDensity: propUserAssistanceDensity, validators, virtualKeyboard, value, ...otherProps }: Props, ref: Ref<InputNumberHandle>) => import("preact").JSX.Element;
/**
 * This export corresponds to the InputNumber Preact component. For the oj-c-input-number custom element, import CInputNumberElement instead.
 */
export declare const InputNumber: ComponentType<ExtendGlobalProps<ComponentProps<typeof InputNumberImpl>> & {
    ref?: Ref<InputNumberHandle>;
}>;
export type InputNumberProps = Props;
export {};
import { JetElement, JetSettableProperties, JetElementCustomEventStrict, JetSetPropertyType } from 'ojs/index';
import 'ojs/oj-jsx-interfaces';
/**
 * This export corresponds to the oj-c-input-number custom element. For the InputNumber Preact component, import InputNumber instead.
 */
export interface CInputNumberElement extends JetElement<CInputNumberElementSettableProperties>, CInputNumberElementSettableProperties {
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
    readonly rawValue?: Parameters<Required<Props>['onRawValueChanged']>[0];
    /**
     * <p>The  <code class="prettyprint">transientValue</code> is the read-only property for retrieving
     * the current transient value.</p>
     * <p>
     * The <code class="prettyprint">transientValue</code> updates to display the transient
     * changes from pressing the step buttons or up/down arrow (subject to the step constraints).
     * <code class="prettyprint">transientValue</code> will update only if it passes
     * validation.
     * </p>
     * <p>
     * The difference in behavior is
     * <code class="prettyprint">transientValue</code> will be updated
     * as the step buttons or up/down arrow is pressed (and only if validation succeeds),
     * whereas <code class="prettyprint">value</code>
     * is updated only after the step buttons or up/down arrow is released
     * (and only if validation succeeds).
     * </p>
     * <p>This is a read-only attribute so page authors cannot set or change it directly.</p>
     */
    readonly transientValue?: Parameters<Required<Props>['onTransientValueChanged']>[0];
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
    addEventListener<T extends keyof CInputNumberElementEventMap>(type: T, listener: (this: HTMLElement, ev: CInputNumberElementEventMap[T]) => any, options?: (boolean | AddEventListenerOptions)): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: (boolean | AddEventListenerOptions)): void;
    getProperty<T extends keyof CInputNumberElementSettableProperties>(property: T): CInputNumberElement[T];
    getProperty(property: string): any;
    setProperty<T extends keyof CInputNumberElementSettableProperties>(property: T, value: CInputNumberElementSettableProperties[T]): void;
    setProperty<T extends string>(property: T, value: JetSetPropertyType<T, CInputNumberElementSettableProperties>): void;
    setProperties(properties: CInputNumberElementSettablePropertiesLenient): void;
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
export namespace CInputNumberElement {
    type autocompleteChanged = JetElementCustomEventStrict<CInputNumberElement['autocomplete']>;
    type columnSpanChanged = JetElementCustomEventStrict<CInputNumberElement['columnSpan']>;
    type containerReadonlyChanged = JetElementCustomEventStrict<CInputNumberElement['containerReadonly']>;
    type converterChanged = JetElementCustomEventStrict<CInputNumberElement['converter']>;
    type disabledChanged = JetElementCustomEventStrict<CInputNumberElement['disabled']>;
    type displayOptionsChanged = JetElementCustomEventStrict<CInputNumberElement['displayOptions']>;
    type helpChanged = JetElementCustomEventStrict<CInputNumberElement['help']>;
    type helpHintsChanged = JetElementCustomEventStrict<CInputNumberElement['helpHints']>;
    type inputPrefixChanged = JetElementCustomEventStrict<CInputNumberElement['inputPrefix']>;
    type inputSuffixChanged = JetElementCustomEventStrict<CInputNumberElement['inputSuffix']>;
    type labelEdgeChanged = JetElementCustomEventStrict<CInputNumberElement['labelEdge']>;
    type labelHintChanged = JetElementCustomEventStrict<CInputNumberElement['labelHint']>;
    type labelStartWidthChanged = JetElementCustomEventStrict<CInputNumberElement['labelStartWidth']>;
    type labelWrappingChanged = JetElementCustomEventStrict<CInputNumberElement['labelWrapping']>;
    type maxChanged = JetElementCustomEventStrict<CInputNumberElement['max']>;
    type maxWidthChanged = JetElementCustomEventStrict<CInputNumberElement['maxWidth']>;
    type messagesCustomChanged = JetElementCustomEventStrict<CInputNumberElement['messagesCustom']>;
    type minChanged = JetElementCustomEventStrict<CInputNumberElement['min']>;
    type numberRangeExactMessageDetailChanged = JetElementCustomEventStrict<CInputNumberElement['numberRangeExactMessageDetail']>;
    type numberRangeOverflowMessageDetailChanged = JetElementCustomEventStrict<CInputNumberElement['numberRangeOverflowMessageDetail']>;
    type numberRangeUnderflowMessageDetailChanged = JetElementCustomEventStrict<CInputNumberElement['numberRangeUnderflowMessageDetail']>;
    type placeholderChanged = JetElementCustomEventStrict<CInputNumberElement['placeholder']>;
    type rawValueChanged = JetElementCustomEventStrict<CInputNumberElement['rawValue']>;
    type readonlyChanged = JetElementCustomEventStrict<CInputNumberElement['readonly']>;
    type readonlyUserAssistanceShownChanged = JetElementCustomEventStrict<CInputNumberElement['readonlyUserAssistanceShown']>;
    type requiredChanged = JetElementCustomEventStrict<CInputNumberElement['required']>;
    type requiredMessageDetailChanged = JetElementCustomEventStrict<CInputNumberElement['requiredMessageDetail']>;
    type stepChanged = JetElementCustomEventStrict<CInputNumberElement['step']>;
    type stepperVariantChanged = JetElementCustomEventStrict<CInputNumberElement['stepperVariant']>;
    type textAlignChanged = JetElementCustomEventStrict<CInputNumberElement['textAlign']>;
    type transientValueChanged = JetElementCustomEventStrict<CInputNumberElement['transientValue']>;
    type userAssistanceDensityChanged = JetElementCustomEventStrict<CInputNumberElement['userAssistanceDensity']>;
    type validChanged = JetElementCustomEventStrict<CInputNumberElement['valid']>;
    type validatorsChanged = JetElementCustomEventStrict<CInputNumberElement['validators']>;
    type valueChanged = JetElementCustomEventStrict<CInputNumberElement['value']>;
    type virtualKeyboardChanged = JetElementCustomEventStrict<CInputNumberElement['virtualKeyboard']>;
    type widthChanged = JetElementCustomEventStrict<CInputNumberElement['width']>;
}
export interface CInputNumberElementEventMap extends HTMLElementEventMap {
    'autocompleteChanged': JetElementCustomEventStrict<CInputNumberElement['autocomplete']>;
    'columnSpanChanged': JetElementCustomEventStrict<CInputNumberElement['columnSpan']>;
    'containerReadonlyChanged': JetElementCustomEventStrict<CInputNumberElement['containerReadonly']>;
    'converterChanged': JetElementCustomEventStrict<CInputNumberElement['converter']>;
    'disabledChanged': JetElementCustomEventStrict<CInputNumberElement['disabled']>;
    'displayOptionsChanged': JetElementCustomEventStrict<CInputNumberElement['displayOptions']>;
    'helpChanged': JetElementCustomEventStrict<CInputNumberElement['help']>;
    'helpHintsChanged': JetElementCustomEventStrict<CInputNumberElement['helpHints']>;
    'inputPrefixChanged': JetElementCustomEventStrict<CInputNumberElement['inputPrefix']>;
    'inputSuffixChanged': JetElementCustomEventStrict<CInputNumberElement['inputSuffix']>;
    'labelEdgeChanged': JetElementCustomEventStrict<CInputNumberElement['labelEdge']>;
    'labelHintChanged': JetElementCustomEventStrict<CInputNumberElement['labelHint']>;
    'labelStartWidthChanged': JetElementCustomEventStrict<CInputNumberElement['labelStartWidth']>;
    'labelWrappingChanged': JetElementCustomEventStrict<CInputNumberElement['labelWrapping']>;
    'maxChanged': JetElementCustomEventStrict<CInputNumberElement['max']>;
    'maxWidthChanged': JetElementCustomEventStrict<CInputNumberElement['maxWidth']>;
    'messagesCustomChanged': JetElementCustomEventStrict<CInputNumberElement['messagesCustom']>;
    'minChanged': JetElementCustomEventStrict<CInputNumberElement['min']>;
    'numberRangeExactMessageDetailChanged': JetElementCustomEventStrict<CInputNumberElement['numberRangeExactMessageDetail']>;
    'numberRangeOverflowMessageDetailChanged': JetElementCustomEventStrict<CInputNumberElement['numberRangeOverflowMessageDetail']>;
    'numberRangeUnderflowMessageDetailChanged': JetElementCustomEventStrict<CInputNumberElement['numberRangeUnderflowMessageDetail']>;
    'placeholderChanged': JetElementCustomEventStrict<CInputNumberElement['placeholder']>;
    'rawValueChanged': JetElementCustomEventStrict<CInputNumberElement['rawValue']>;
    'readonlyChanged': JetElementCustomEventStrict<CInputNumberElement['readonly']>;
    'readonlyUserAssistanceShownChanged': JetElementCustomEventStrict<CInputNumberElement['readonlyUserAssistanceShown']>;
    'requiredChanged': JetElementCustomEventStrict<CInputNumberElement['required']>;
    'requiredMessageDetailChanged': JetElementCustomEventStrict<CInputNumberElement['requiredMessageDetail']>;
    'stepChanged': JetElementCustomEventStrict<CInputNumberElement['step']>;
    'stepperVariantChanged': JetElementCustomEventStrict<CInputNumberElement['stepperVariant']>;
    'textAlignChanged': JetElementCustomEventStrict<CInputNumberElement['textAlign']>;
    'transientValueChanged': JetElementCustomEventStrict<CInputNumberElement['transientValue']>;
    'userAssistanceDensityChanged': JetElementCustomEventStrict<CInputNumberElement['userAssistanceDensity']>;
    'validChanged': JetElementCustomEventStrict<CInputNumberElement['valid']>;
    'validatorsChanged': JetElementCustomEventStrict<CInputNumberElement['validators']>;
    'valueChanged': JetElementCustomEventStrict<CInputNumberElement['value']>;
    'virtualKeyboardChanged': JetElementCustomEventStrict<CInputNumberElement['virtualKeyboard']>;
    'widthChanged': JetElementCustomEventStrict<CInputNumberElement['width']>;
}
export interface CInputNumberElementSettableProperties extends JetSettableProperties {
    /**
     * Dictates component's autocomplete state. This attribute indicates whether the value of
     * the control can be automatically completed by the browser. The common values are 'on' and 'off'.
     *
     * Since this attribute passes through to the input element unchanged, you can look at the html specs for
     * detailed information for how browsers behave and what values besides 'on' and 'off' you can set.
     * The html spec says the default is 'on', so when autocomplete is not explicitly set, the browsers treat it as 'on'.
     */
    autocomplete?: Props['autocomplete'];
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
     * A converter instance or one that duck types oj.Converter.
     * <p>
     * When no converter is specified, an instance of NumberConverter with no options will be used.
     * </p>
     * <p>
     * When <code class="prettyprint">converter</code> property changes due to programmatic
     * intervention, the element performs various tasks based on the current state it is in. </br>
     *
     * <h4>Steps Performed Always</h4>
     * <ul>
     * <li>Any cached converter instance is cleared and new converter created. The converter hint is
     * pushed to messaging. E.g., notewindow displays the new hint(s).
     * </li>
     * </ul>
     *
     * <h4>Running Validation</h4>
     * <ul>
     * <li>if element is valid when <code class="prettyprint">converter</code> property changes, the
     *  display value is refreshed.</li>
     * <li>if element is invalid and is showing messages when
     * <code class="prettyprint">converter</code> property changes then all element messages are
     * cleared and full validation run using the current display value on the element.
     * <ul>
     *   <li>if there are validation errors, then <code class="prettyprint">value</code>
     *   property is not updated, and the error is shown.
     *   The display value is not refreshed in this case. </li>
     *   <li>if no errors result from the validation, the <code class="prettyprint">value</code>
     *   property is updated; page author can listen to the <code class="prettyprint">valueChanged</code>
     *   event to clear custom errors. The
     *   display value is refreshed with the formatted value provided by converter.</li>
     * </ul>
     * </li>
     * <li>if element is invalid and has deferred messages when converter property changes, the
     *   display value is again refreshed with the formatted value provided by converter.</li>
     * </ul>
     *
     * <h4>Clearing Messages</h4>
     * <ul>
     * <li>Only messages created by the element are cleared.</li>
     * <li><code class="prettyprint">messagesCustom</code> property is not cleared.
     * Page authors can
     * choose to clear it explicitly when setting the converter option.</li>
     * </ul>
     * </p>
     * <p>
     *  During validation, the converter takes the input value which is a string
     *  and parses it into the type of the component's value property
     *  (e.g. a number)
     *  before it passes it to the validator. It then takes the validated value property
     *  and formats it into a string to be displayed and puts it into the input.
     *  If the converter's format or parse functions
     *  throw an error, it will be displayed to the user inline on the field.
     * </p>
     * <p>
     * The hint exposed by the converter is shown inline by default in the Redwood theme when
     * the field has focus.
     * You can turn off showing converter hints by using the
     * 'converterHint' property set to 'none' on the <code class="prettyprint">display-options</code>
     * attribute.
     * </p>
     * <p>
     * In the Redwood theme, only one hint shows at a time, so the precedence rules are:
     * help.instruction shows; if no help.instruction then validator hints show;
     * if none, then help-hints.definition shows; if none, then converter hint shows.
     * help-hints.source always shows along with the other help or hint.
     * </p>
     */
    converter?: Props['converter'];
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
     * The inputPrefix displays as regular text before the input text.
     * The inputPrefix is not editable or focusable.
     */
    inputPrefix?: Props['inputPrefix'];
    /**
     * The inputSuffix displays as regular text after the input text.
     * The inputSuffix is not editable or focusable.
     */
    inputSuffix?: Props['inputSuffix'];
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
     * The maximum allowed value. This number is used in the range validator; if the
     * <code class="prettyprint">value</code> is greater than the <code class="prettyprint">max</code>,
     * then the range validator flags an error to the user. The increase button and up arrow
     * are disabled when the maximum value is reached.
     * <p>
     * The <code class="prettyprint">max</code> must not be less than the
     * <code class="prettyprint">min</code>, else an Error is thrown during initialization.
     * </p>
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
     * The minimum allowed value. This number is used in the range validator; if the
     * <code class="prettyprint">value</code> is less than the <code class="prettyprint">min</code>,
     * then the range validator flags an error to the user. The decrease button and down arrow
     * are disabled when the minimum value is reached.
     * The <code class="prettyprint">min</code> must not be greater than the
     * <code class="prettyprint">max</code>, else an Error is thrown during initialization.
     */
    min?: Props['min'];
    /**
     * <p>
     * The component-specific message detail when the number range validation fails when the input value is not between min and max
     * when min and max are equal.
     * If the component needs a number range validation error message for an exact number that is different from the default,
     * set this property. It should be a translated string.
     * </p>
     * Tokens:<br/>
     * {num} - the allowed value<p>
     * Usage: <br/>
     * The number must be {num}.
     */
    numberRangeExactMessageDetail?: Props['numberRangeExactMessageDetail'];
    /**
     * <p>
     * The component-specific message detail when the number range validation fails when the input value is greater than the max.
     * If the component needs a number range validation error message for overflow that is different from the default,
     * set this property. It should be a translated string.
     * </p>
     * Tokens:<br/>
     * {value} - value entered by the user<br/>
     * {max} - the maximum allowed value<p>
     * Usage: <br/>
     * The number must be less than or equal to {max}.
     */
    numberRangeOverflowMessageDetail?: Props['numberRangeOverflowMessageDetail'];
    /**
     * <p>
     * The component-specific message detail when the number range validation fails when the input value is less than the min.
     * If the component needs a number range validation error message for underflow that is different from the default,
     * set this property. It should be a translated string.
     * </p>
     * Tokens:<br/>
     * {value} - value entered by the user<br/>
     * {min} - the minimum allowed value<p>
     * Usage: <br/>
     * The number must be greater than or equal to {min}.
     */
    numberRangeUnderflowMessageDetail?: Props['numberRangeUnderflowMessageDetail'];
    /**
     * The placeholder text to set on the element.
     */
    placeholder?: Props['placeholder'];
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
     * The size of the step to take when spinning via the step buttons or up/down arrows.
     * If step is 0, inputNumber will not have the step buttons or up/down spin functionality.
     * If step is less than 0, an exception is thrown.
     * <p><code class="prettyprint">step</code> defaults to <code class="prettyprint">0</code>.
     * </p>
     * <p>
     * <p>
     * The <code class="prettyprint">step</code> attribute can be used together
     * with the <code class="prettyprint">min</code> and
     * <code class="prettyprint">max</code> attributes
     * to create a range of values the step buttons or up/down arrows will step through. For example,
     * if min is 0 and step is 3, the range of values is 0, 3, 6, etc.
     * </p>
     * <p>
     * The step buttons or up/down arrows will spin the value and adjust it to keep it a
     * 'step match' value.
     * A 'step match' value is when the value is a multiple
     * of <code class="prettyprint">step</code>,
     * starting at the <code class="prettyprint">min</code>, and if
     * <code class="prettyprint">min</code> is not set,
     * then starting at the initial <code class="prettyprint">value</code>,
     * and if neither <code class="prettyprint">min</code> and initial
     * <code class="prettyprint">value</code> are set,
     * then starting at 0.
     * </p>
     * <p>When using step > 1 with min and/or max,
     * make sure the initial value and max are both a 'step match' value,
     * otherwise the first step will adjust the value in a way
     * that could confuse the user.</p>
     * </p>
     * <p>
     * A value can be a step mismatch; if the <code class="prettyprint">value</code> is set
     * to be a step mismatch, it will not be flagged as a validation error.
     * </p>
     */
    step?: Props['step'];
    /**
     * Variant style of step buttons. Quantitative is recommended only for non-negative integers where the step value is 1, which is common in ecommerce or procurement cases.
     */
    stepperVariant?: Props['stepperVariant'];
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
    validators?: Props['validators'];
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
    value?: Props['value'];
    /**
     * The type of virtual keyboard to display for entering a value on mobile browsers. This attribute has no effect on desktop browsers.
     */
    virtualKeyboard?: Props['virtualKeyboard'];
    /**
     * Specifies the component's width.  If unset, the default width is 100%.
     * Note that by default max-width is 100%, which will override the width if the container is smaller than the width specified.
     */
    width?: Props['width'];
}
export interface CInputNumberElementSettablePropertiesLenient extends Partial<CInputNumberElementSettableProperties> {
    [key: string]: any;
}
export interface InputNumberIntrinsicProps extends Partial<Readonly<CInputNumberElementSettableProperties>>, GlobalProps, Pick<preact.JSX.HTMLAttributes, 'ref' | 'key'> {
    rawValue?: never;
    transientValue?: never;
    valid?: never;
    onautocompleteChanged?: (value: CInputNumberElementEventMap['autocompleteChanged']) => void;
    oncolumnSpanChanged?: (value: CInputNumberElementEventMap['columnSpanChanged']) => void;
    oncontainerReadonlyChanged?: (value: CInputNumberElementEventMap['containerReadonlyChanged']) => void;
    onconverterChanged?: (value: CInputNumberElementEventMap['converterChanged']) => void;
    ondisabledChanged?: (value: CInputNumberElementEventMap['disabledChanged']) => void;
    ondisplayOptionsChanged?: (value: CInputNumberElementEventMap['displayOptionsChanged']) => void;
    onhelpChanged?: (value: CInputNumberElementEventMap['helpChanged']) => void;
    onhelpHintsChanged?: (value: CInputNumberElementEventMap['helpHintsChanged']) => void;
    oninputPrefixChanged?: (value: CInputNumberElementEventMap['inputPrefixChanged']) => void;
    oninputSuffixChanged?: (value: CInputNumberElementEventMap['inputSuffixChanged']) => void;
    onlabelEdgeChanged?: (value: CInputNumberElementEventMap['labelEdgeChanged']) => void;
    onlabelHintChanged?: (value: CInputNumberElementEventMap['labelHintChanged']) => void;
    onlabelStartWidthChanged?: (value: CInputNumberElementEventMap['labelStartWidthChanged']) => void;
    /** @deprecated since 18.0.0 */ onlabelWrappingChanged?: (value: CInputNumberElementEventMap['labelWrappingChanged']) => void;
    onmaxChanged?: (value: CInputNumberElementEventMap['maxChanged']) => void;
    onmaxWidthChanged?: (value: CInputNumberElementEventMap['maxWidthChanged']) => void;
    onmessagesCustomChanged?: (value: CInputNumberElementEventMap['messagesCustomChanged']) => void;
    onminChanged?: (value: CInputNumberElementEventMap['minChanged']) => void;
    onnumberRangeExactMessageDetailChanged?: (value: CInputNumberElementEventMap['numberRangeExactMessageDetailChanged']) => void;
    onnumberRangeOverflowMessageDetailChanged?: (value: CInputNumberElementEventMap['numberRangeOverflowMessageDetailChanged']) => void;
    onnumberRangeUnderflowMessageDetailChanged?: (value: CInputNumberElementEventMap['numberRangeUnderflowMessageDetailChanged']) => void;
    onplaceholderChanged?: (value: CInputNumberElementEventMap['placeholderChanged']) => void;
    onrawValueChanged?: (value: CInputNumberElementEventMap['rawValueChanged']) => void;
    onreadonlyChanged?: (value: CInputNumberElementEventMap['readonlyChanged']) => void;
    onreadonlyUserAssistanceShownChanged?: (value: CInputNumberElementEventMap['readonlyUserAssistanceShownChanged']) => void;
    onrequiredChanged?: (value: CInputNumberElementEventMap['requiredChanged']) => void;
    onrequiredMessageDetailChanged?: (value: CInputNumberElementEventMap['requiredMessageDetailChanged']) => void;
    onstepChanged?: (value: CInputNumberElementEventMap['stepChanged']) => void;
    onstepperVariantChanged?: (value: CInputNumberElementEventMap['stepperVariantChanged']) => void;
    ontextAlignChanged?: (value: CInputNumberElementEventMap['textAlignChanged']) => void;
    ontransientValueChanged?: (value: CInputNumberElementEventMap['transientValueChanged']) => void;
    onuserAssistanceDensityChanged?: (value: CInputNumberElementEventMap['userAssistanceDensityChanged']) => void;
    onvalidChanged?: (value: CInputNumberElementEventMap['validChanged']) => void;
    onvalidatorsChanged?: (value: CInputNumberElementEventMap['validatorsChanged']) => void;
    onvalueChanged?: (value: CInputNumberElementEventMap['valueChanged']) => void;
    onvirtualKeyboardChanged?: (value: CInputNumberElementEventMap['virtualKeyboardChanged']) => void;
    onwidthChanged?: (value: CInputNumberElementEventMap['widthChanged']) => void;
}
declare global {
    namespace preact.JSX {
        interface IntrinsicElements {
            'oj-c-input-number': InputNumberIntrinsicProps;
        }
    }
}
