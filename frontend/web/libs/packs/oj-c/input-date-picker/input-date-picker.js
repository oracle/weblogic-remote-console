define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_InputDatePicker", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormVariantContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "ojs/ojvcomponent", "preact/compat", "./useInputDatePicker", "css!oj-c/input-date-picker/input-date-picker-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_InputDatePicker_1, UNSAFE_useFormContext_1, UNSAFE_useFormVariantContext_1, UNSAFE_useTabbableMode_1, ojvcomponent_1, compat_1, useInputDatePicker_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InputDatePicker = void 0;
    // Define constants for object literal default values to prevent extra re-renders.
    const displayOptionsDefault = {
        messages: 'display',
        validatorHint: 'display'
    };
    const helpDefault = {
        instruction: ''
    };
    const helpHintsDefault = {
        definition: '',
        source: ''
    };
    const messagesCustomDefault = [];
    const validatorsDefault = [];
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
    function InputDatePickerImpl({ columnSpan = 1, daysOutsideMonth = 'hidden', disabled = false, displayOptions = displayOptionsDefault, help = helpDefault, helpHints = helpHintsDefault, messagesCustom = messagesCustomDefault, monthAndYearPicker = 'on', readonlyUserAssistanceShown = 'none', required = false, todayButton = 'visible', validators = validatorsDefault, value = null, weekDisplay = 'none', ...otherProps }, ref) {
        const { formContextValue, inputDatePickerProps, rootProps } = (0, useInputDatePicker_1.useInputDatePicker)({
            columnSpan,
            daysOutsideMonth,
            disabled,
            displayOptions,
            help,
            helpHints,
            messagesCustom,
            monthAndYearPicker,
            readonlyUserAssistanceShown,
            required,
            todayButton,
            validators,
            value,
            weekDisplay,
            ...otherProps
        }, ref);
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ...rootProps, "data-oj-renders-label": true, children: (0, jsx_runtime_1.jsx)(UNSAFE_useFormContext_1.FormContext.Provider, { value: formContextValue, children: (0, jsx_runtime_1.jsx)(UNSAFE_InputDatePicker_1.InputDatePicker, { ...inputDatePickerProps, columnSpan: columnSpan }) }) }));
    }
    exports.InputDatePicker = (0, ojvcomponent_1.registerCustomElement)('oj-c-input-date-picker', (0, compat_1.forwardRef)(InputDatePickerImpl), "InputDatePicker", { "properties": { "columnSpan": { "type": "number" }, "containerReadonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "dateRangeOverflowMessageDetail": { "type": "function" }, "dateRangeUnderflowMessageDetail": { "type": "function" }, "dateRestrictionMessageDetail": { "type": "function" }, "dayFormatter": { "type": "function" }, "daysOutsideMonth": { "type": "string", "enumValues": ["hidden", "selectable"] }, "disabled": { "type": "boolean" }, "displayOptions": { "type": "object", "properties": { "messages": { "type": "string", "enumValues": ["none", "display"] }, "validatorHint": { "type": "string", "enumValues": ["none", "display"] } } }, "help": { "type": "object", "properties": { "instruction": { "type": "string" } } }, "helpHints": { "type": "object", "properties": { "definition": { "type": "string" }, "source": { "type": "string" }, "sourceText": { "type": "string" } } }, "labelEdge": { "type": "string", "enumValues": ["none", "start", "top", "inside"], "binding": { "consume": { "name": "containerLabelEdge" } } }, "labelHint": { "type": "string" }, "labelStartWidth": { "type": "number|string", "binding": { "consume": { "name": "labelWidth" } } }, "labelWrapping": { "type": "string", "enumValues": ["truncate", "wrap"], "binding": { "consume": { "name": "labelWrapping" } } }, "max": { "type": "string|null" }, "maxWidth": { "type": "number|string" }, "messagesCustom": { "type": "Array<object>", "writeback": true }, "min": { "type": "string|null" }, "monthAndYearPicker": { "type": "string", "enumValues": ["off", "on"] }, "readonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "readonlyUserAssistanceShown": { "type": "string", "enumValues": ["none", "confirmationAndInfoMessages"] }, "required": { "type": "boolean" }, "requiredMessageDetail": { "type": "string" }, "textAlign": { "type": "string", "enumValues": ["end", "start", "right"] }, "todayTimeZone": { "type": "string" }, "todayButton": { "type": "string", "enumValues": ["hidden", "visible"] }, "userAssistanceDensity": { "type": "string", "enumValues": ["compact", "reflow", "efficient"], "binding": { "consume": { "name": "containerUserAssistanceDensity" } } }, "validators": { "type": "Array<object>|null" }, "value": { "type": "string|null", "writeback": true }, "weekDisplay": { "type": "string", "enumValues": ["number", "none"] }, "width": { "type": "number|string" }, "rawValue": { "type": "object", "properties": { "year": { "type": "number" }, "month": { "type": "number" }, "day": { "type": "number" } }, "readOnly": true, "writeback": true }, "valid": { "type": "string", "enumValues": ["pending", "valid", "invalidHidden", "invalidShown"], "readOnly": true, "writeback": true } }, "extension": { "_WRITEBACK_PROPS": ["messagesCustom", "rawValue", "valid", "value"], "_READ_ONLY_PROPS": ["rawValue", "valid"], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "id"] }, "methods": { "blur": {}, "focus": {}, "showMessages": {}, "reset": {}, "validate": {} } }, { "columnSpan": 1, "daysOutsideMonth": "hidden", "disabled": false, "displayOptions": { "messages": "display", "validatorHint": "display" }, "help": { "instruction": "" }, "helpHints": { "definition": "", "source": "" }, "messagesCustom": [], "monthAndYearPicker": "on", "readonlyUserAssistanceShown": "none", "required": false, "todayButton": "visible", "validators": [], "value": null, "weekDisplay": "none" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useFormContext_1.FormContext, UNSAFE_useFormVariantContext_1.FormVariantContext, UNSAFE_useTabbableMode_1.TabbableModeContext] });
});
