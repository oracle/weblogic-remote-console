define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/hooks/UNSAFE_useFormContext", "oj-c/hooks/UNSAFE_useMergedFormContext/useMergedFormContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormVariantContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/UNSAFE_InputDateMask", "oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText", "ojs/ojcontext", "ojs/ojvcomponent", "preact/compat", "preact/hooks", "./useInputMonthMaskPreact", "@oracle/oraclejet-preact/utils/UNSAFE_classNames", "@oracle/oraclejet-preact/utils/UNSAFE_styles/FormControl", "@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout", "@oracle/oraclejet-preact/utils/UNSAFE_calendarDateUtils", "@oracle/oraclejet-preact/UNSAFE_TextField", "@oracle/oraclejet-preact/hooks/UNSAFE_useComponentTheme", "css!oj-c/input-month-mask/input-month-mask-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_useFormContext_1, useMergedFormContext_1, UNSAFE_useFormVariantContext_1, UNSAFE_useTabbableMode_1, UNSAFE_InputDateMask_1, useAssistiveText_1, Context, ojvcomponent_1, compat_1, hooks_1, useInputMonthMaskPreact_1, UNSAFE_classNames_1, FormControl_1, Layout_1, UNSAFE_calendarDateUtils_1, UNSAFE_TextField_1, UNSAFE_useComponentTheme_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InputMonthMask = void 0;
    // Define constants for object literal default values and [] to prevent extra re-renders.
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
    const InputMonthMaskImpl = ({ columnSpan = 1, containerReadonly: propContainerReadonly, disabled = false, displayOptions = displayOptionsDefault, help = helpDefault, helpHints = helpHintsDefault, labelWrapping: propLabelWrapping, messagesCustom = messagesCustomDefault, readonly: propReadonly, readonlyUserAssistanceShown = 'none', required = false, textAlign: propTextAlign, userAssistanceDensity: propUserAssistanceDensity, validators = validatorsDefault, value = null, ...otherProps }, ref) => {
        const rootRef = (0, hooks_1.useRef)();
        const inputMonthMaskRef = (0, hooks_1.useRef)();
        const addBusyState = (0, hooks_1.useCallback)((description = 'InputMonthMask: busyState') => {
            return rootRef.current
                ? Context.getContext(rootRef.current).getBusyContext().addBusyState({ description })
                : () => { }; // if the component is not mounted return Noop
        }, []);
        const { containerProps, uadValue, readonlyValue } = (0, useMergedFormContext_1.useMergedFormContext)({
            propContainerReadonly,
            propLabelWrapping,
            propReadonly,
            propUserAssistanceDensity,
            propTextAlign
        });
        const { inputMonthMaskProps, methods } = (0, useInputMonthMaskPreact_1.useInputMonthMaskPreact)({
            disabled,
            displayOptions,
            messagesCustom,
            readonly: readonlyValue,
            readonlyUserAssistanceShown,
            required,
            userAssistanceDensity: uadValue,
            validators,
            value,
            ...otherProps
        }, addBusyState);
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => inputMonthMaskRef.current?.blur(),
            focus: () => inputMonthMaskRef.current?.focus(),
            ...methods
        }), [methods]);
        const assistiveTextProps = (0, useAssistiveText_1.useAssistiveText)({
            displayOptions,
            help,
            helpHints,
            userAssistanceDensity: inputMonthMaskProps.userAssistanceDensity,
            validators
        });
        const variant = (0, UNSAFE_useFormVariantContext_1.useFormVariantContext)();
        if (!(0, UNSAFE_calendarDateUtils_1.isValidCalendarMonthRequired)(value)) {
            throw new Error('If the value property is defined, it must be an object with year and month defined.');
        }
        if (!(0, UNSAFE_calendarDateUtils_1.isValidCalendarMonthRequired)(otherProps.min)) {
            throw new Error('If the min property is defined, it must be an object with year and month defined.');
        }
        if (!(0, UNSAFE_calendarDateUtils_1.isValidCalendarMonthRequired)(otherProps.max)) {
            throw new Error('If the max property is defined, it must be an object with year and month defined.');
        }
        const { classes } = (0, UNSAFE_useComponentTheme_1.useComponentTheme)(UNSAFE_TextField_1.TextFieldRedwoodTheme, {
            maxWidth: otherProps.maxWidth === 'md' || otherProps.maxWidth === 'sm' ? otherProps.maxWidth : 'none',
            width: otherProps.width === 'md' || otherProps.width === 'sm' ? otherProps.width : 'none'
        });
        const rootClasses = (0, UNSAFE_classNames_1.classNames)([
            Layout_1.layoutSpanStyles.layoutSpanColumn[columnSpan],
            variant && ['embedded', 'legacyEmbedded'].includes(variant) && FormControl_1.formControlStyles.embeddedRoot,
            containerProps.isFormLayout && 'in-form-layout',
            classes
        ]);
        const widthStyle = otherProps.width === 'md' || otherProps.width === 'sm' ? undefined : otherProps.width;
        const maxWidthStyle = otherProps.maxWidth === 'md' || otherProps.maxWidth === 'sm' ? undefined : otherProps.maxWidth;
        const styleProps = { style: { width: widthStyle, maxWidth: maxWidthStyle } };
        return (
        // Even though we are handling the styling here, we pass the columnSpan property down to the
        // Preact component because it may be needed for other purposes, like calculating the start
        // label width.
        (0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: otherProps.id, ref: rootRef, class: rootClasses, ...styleProps, "data-oj-renders-label": true, children: (0, jsx_runtime_1.jsx)(UNSAFE_useFormContext_1.FormContext.Provider, { value: containerProps, children: (0, jsx_runtime_1.jsx)(UNSAFE_InputDateMask_1.InputDateMask, { ref: inputMonthMaskRef, ...assistiveTextProps, ...inputMonthMaskProps, columnSpan: columnSpan, variant: variant, granularity: "month" }) }) }));
    };
    exports.InputMonthMask = (0, ojvcomponent_1.registerCustomElement)('oj-c-input-month-mask', (0, compat_1.forwardRef)(InputMonthMaskImpl), "InputMonthMask", { "properties": { "columnSpan": { "type": "number" }, "containerReadonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "dateRangeOverflowMessageDetail": { "type": "function" }, "dateRangeUnderflowMessageDetail": { "type": "function" }, "disabled": { "type": "boolean" }, "displayOptions": { "type": "object", "properties": { "messages": { "type": "string", "enumValues": ["none", "display"] }, "validatorHint": { "type": "string", "enumValues": ["none", "display"] } } }, "help": { "type": "object", "properties": { "instruction": { "type": "string" } } }, "helpHints": { "type": "object", "properties": { "definition": { "type": "string" }, "source": { "type": "string" }, "sourceText": { "type": "string" } } }, "labelEdge": { "type": "string", "enumValues": ["none", "start", "top", "inside"], "binding": { "consume": { "name": "containerLabelEdge" } } }, "labelHint": { "type": "string" }, "labelStartWidth": { "type": "number|string", "binding": { "consume": { "name": "labelWidth" } } }, "labelWrapping": { "type": "string", "enumValues": ["truncate", "wrap"], "binding": { "consume": { "name": "labelWrapping" } } }, "max": { "type": "object|null", "properties": { "year": { "type": "number" }, "month": { "type": "number" } } }, "maxWidth": { "type": "number|string" }, "messagesCustom": { "type": "Array<object>", "writeback": true }, "min": { "type": "object|null", "properties": { "year": { "type": "number" }, "month": { "type": "number" } } }, "readonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "readonlyUserAssistanceShown": { "type": "string", "enumValues": ["none", "confirmationAndInfoMessages"] }, "required": { "type": "boolean" }, "requiredMessageDetail": { "type": "string" }, "textAlign": { "type": "string", "enumValues": ["end", "start", "right"] }, "userAssistanceDensity": { "type": "string", "enumValues": ["compact", "reflow", "efficient"], "binding": { "consume": { "name": "containerUserAssistanceDensity" } } }, "validators": { "type": "Array<object>|null" }, "value": { "type": "object|null", "properties": { "year": { "type": "number" }, "month": { "type": "number" } }, "writeback": true }, "width": { "type": "number|string" }, "rawValue": { "type": "object", "properties": { "year": { "type": "number" }, "month": { "type": "number" } }, "readOnly": true, "writeback": true }, "valid": { "type": "string", "enumValues": ["pending", "valid", "invalidHidden", "invalidShown"], "readOnly": true, "writeback": true } }, "extension": { "_WRITEBACK_PROPS": ["messagesCustom", "rawValue", "valid", "value"], "_READ_ONLY_PROPS": ["rawValue", "valid"], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "id"] }, "methods": { "blur": {}, "focus": {}, "showMessages": {}, "reset": {}, "validate": {} } }, { "columnSpan": 1, "disabled": false, "displayOptions": { "messages": "display", "validatorHint": "display" }, "help": { "instruction": "" }, "helpHints": { "definition": "", "source": "" }, "messagesCustom": [], "readonlyUserAssistanceShown": "none", "required": false, "validators": [], "value": null }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useFormContext_1.FormContext, UNSAFE_useFormVariantContext_1.FormVariantContext, UNSAFE_useTabbableMode_1.TabbableModeContext] });
});
