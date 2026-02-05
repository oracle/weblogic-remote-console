define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "preact/compat", "preact/hooks", "@oracle/oraclejet-preact/hooks/UNSAFE_useAccessibleContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormContext", "oj-c/hooks/UNSAFE_useMergedFormContext/useMergedFormContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormVariantContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/UNSAFE_InputText", "@oracle/oraclejet-preact/hooks/UNSAFE_useComponentTheme", "@oracle/oraclejet-preact/UNSAFE_TextField", "oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText", "ojs/ojcontext", "ojs/ojvcomponent", "@oracle/oraclejet-preact/utils/UNSAFE_classNames", "@oracle/oraclejet-preact/utils/UNSAFE_styles/FormControl", "@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout", "./useInputTextPreact", "css!oj-c/input-text/input-text-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, compat_1, hooks_1, UNSAFE_useAccessibleContext_1, UNSAFE_useFormContext_1, useMergedFormContext_1, UNSAFE_useFormVariantContext_1, UNSAFE_useTabbableMode_1, UNSAFE_InputText_1, UNSAFE_useComponentTheme_1, UNSAFE_TextField_1, useAssistiveText_1, Context, ojvcomponent_1, UNSAFE_classNames_1, FormControl_1, Layout_1, useInputTextPreact_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InputText = void 0;
    // Define constants for object literal default values to prevent extra re-renders.
    const displayOptionsDefault = {
        converterHint: 'display',
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
    const lengthDefault = {
        countBy: 'codePoint',
        max: null
    };
    const messagesCustomDefault = [];
    const validatorsDefault = [];
    /**
     * @classdesc
     * <h3 id="inputTextOverview-section">
     *   JET InputText Component
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#inputTextOverview-section"></a>
     * </h3>
     *
     * <p>Description: The oj-c-input-text component enhances a browser input type="text" element.</p>
     *
     * <pre class="prettyprint"><code>&lt;oj-c-input-text value="value text" label-hint="Input Text">&lt;/oj-c-input-text></code></pre>
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
     * implicit required is run first if the component is marked required. When a validation error is
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
     *       <td>Input</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Sets focus to input. Show user assistance text.</td>
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
     *       <td>Input</td>
     *       <td><kbd>Tab In</kbd></td>
     *       <td>Set focus to the input. Show user assistance text.</td>
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
     * @ojmetadata displayName "InputText"
     * @ojmetadata description "An input text allows the user to enter a text value."
     * @ojmetadata help "oj-c.InputText.html"
     * @ojmetadata main "oj-c/input-text"
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Forms"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/input-text",
     *     "defaultColumns": 6,
     *     "minColumns": 2
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-text-input",
     *     "uxSpecs": [
     *       "input-text"
     *     ]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "clearIcon",
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
     * @ojmetadata since "13.0.0"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "16.0.0",
     *     "value": ["oj-input-text"]
     *   }
     * ]
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
    function InputTextImpl({ autocomplete = 'on', clearIcon = 'never', columnSpan = 1, containerReadonly: propContainerReadonly, converter = null, disabled = false, displayOptions = displayOptionsDefault, help = helpDefault, helpHints = helpHintsDefault, id, labelWrapping: propLabelWrapping, length = lengthDefault, maxWidth, messagesCustom = messagesCustomDefault, readonly: propReadonly, readonlyUserAssistanceShown = 'none', required = false, textAlign: propTextAlign, userAssistanceDensity: propUserAssistanceDensity, validators = validatorsDefault, value = null, virtualKeyboard = 'auto', width, ...otherProps }, ref) {
        const rootRef = (0, hooks_1.useRef)();
        const inputTextRef = (0, hooks_1.useRef)();
        const addBusyState = (0, hooks_1.useCallback)((desc = 'InputText: busyState') => {
            return rootRef.current
                ? Context.getContext(rootRef.current)
                    .getBusyContext()
                    .addBusyState({ description: `oj-c-input-text id=${id} is ${desc}` })
                : () => { }; // if the component is not mounted return Noop
        }, [id]);
        const { containerProps, uadValue, readonlyValue } = (0, useMergedFormContext_1.useMergedFormContext)({
            propContainerReadonly,
            propLabelWrapping,
            propReadonly,
            propUserAssistanceDensity,
            propTextAlign
        });
        const { inputTextProps, methods } = (0, useInputTextPreact_1.useInputTextPreact)({
            autocomplete,
            clearIcon,
            converter,
            disabled,
            displayOptions,
            length,
            messagesCustom,
            readonly: readonlyValue,
            readonlyUserAssistanceShown,
            required,
            userAssistanceDensity: uadValue,
            validators,
            value,
            virtualKeyboard,
            ...otherProps
        }, addBusyState);
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => inputTextRef.current?.blur(),
            focus: () => {
                inputTextRef.current?.focus();
            },
            ...methods
        }), [methods]);
        const assistiveTextProps = (0, useAssistiveText_1.useAssistiveText)({
            converter,
            displayOptions,
            help,
            helpHints,
            userAssistanceDensity: inputTextProps.userAssistanceDensity,
            validators
        });
        const variant = (0, UNSAFE_useFormVariantContext_1.useFormVariantContext)();
        // JET-52089: temporarily add support for unsafe_labelledBy and pass it through context.
        const accessibleProps = {
            UNSAFE_ariaLabelledBy: otherProps.unsafe_labelledBy
        };
        const { classes } = (0, UNSAFE_useComponentTheme_1.useComponentTheme)(UNSAFE_TextField_1.TextFieldRedwoodTheme, {
            maxWidth: maxWidth === 'md' || maxWidth === 'sm' ? maxWidth : 'none',
            width: width === 'md' || width === 'sm' ? width : 'none'
        });
        const rootClasses = (0, UNSAFE_classNames_1.classNames)([
            Layout_1.layoutSpanStyles.layoutSpanColumn[columnSpan],
            variant && ['embedded', 'legacyEmbedded'].includes(variant) && FormControl_1.formControlStyles.embeddedRoot,
            containerProps.isFormLayout && 'in-form-layout',
            classes
        ]);
        const widthStyle = width === 'md' || width === 'sm' ? undefined : width;
        const maxWidthStyle = maxWidth === 'md' || maxWidth === 'sm' ? undefined : maxWidth;
        const styleProps = { style: { width: widthStyle, maxWidth: maxWidthStyle } };
        return (
        // Even though we are handling the styling here, we pass the columnSpan property down to the
        // Preact component because it may be needed for other purposes, like calculating the start
        // label width.
        // The layoutSpanColumn style class needs to be applied to the root
        // dom element, otherwise the css grid will ignore it.
        (0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: id, ref: rootRef, class: rootClasses, ...styleProps, "data-oj-renders-label": true, children: (0, jsx_runtime_1.jsx)(UNSAFE_useFormContext_1.FormContext.Provider, { value: containerProps, children: (0, jsx_runtime_1.jsx)(UNSAFE_useAccessibleContext_1.AccessibleContext.Provider, { value: accessibleProps, children: (0, jsx_runtime_1.jsx)(UNSAFE_InputText_1.InputText, { ref: inputTextRef, ...assistiveTextProps, ...inputTextProps, columnSpan: columnSpan, variant: variant }) }) }) }));
    }
    // This custom element supports generic parameters, but was introduced before the pattern for exposing
    // generic parameters on the functional value-based element was established.  In order to introduce the generics in
    // a backwards-compatible way, they must be defaulted, but we don't want the defaults to be added to the existing
    // types which had generics from the start.  The solution is to use two consts:
    //   * the first is not exported, but is used as the basis for the custom element types and does not default its generics
    //   * the second is the exported functional value-based element and defaults the generics for backwards compatibility
    const InputTextWithoutDefaultedGenerics = (0, ojvcomponent_1.registerCustomElement)('oj-c-input-text', (0, compat_1.forwardRef)(InputTextImpl), "InputText", { "properties": { "autocomplete": { "type": "string" }, "clearIcon": { "type": "string", "enumValues": ["conditional", "always", "never"] }, "columnSpan": { "type": "number" }, "containerReadonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "converter": { "type": "object|null" }, "disabled": { "type": "boolean" }, "displayOptions": { "type": "object", "properties": { "converterHint": { "type": "string", "enumValues": ["none", "display"] }, "messages": { "type": "string", "enumValues": ["none", "display"] }, "validatorHint": { "type": "string", "enumValues": ["none", "display"] } } }, "help": { "type": "object", "properties": { "instruction": { "type": "string" } } }, "helpHints": { "type": "object", "properties": { "definition": { "type": "string" }, "source": { "type": "string" }, "sourceText": { "type": "string" } } }, "inputPrefix": { "type": "string" }, "inputSuffix": { "type": "string" }, "labelEdge": { "type": "string", "enumValues": ["none", "start", "top", "inside"], "binding": { "consume": { "name": "containerLabelEdge" } } }, "labelHint": { "type": "string" }, "labelStartWidth": { "type": "number|string", "binding": { "consume": { "name": "labelWidth" } } }, "labelWrapping": { "type": "string", "enumValues": ["truncate", "wrap"], "binding": { "consume": { "name": "labelWrapping" } } }, "length": { "type": "object", "properties": { "countBy": { "type": "string", "enumValues": ["codePoint", "codeUnit"] }, "max": { "type": "number|null" } } }, "maxWidth": { "type": "number|string" }, "messagesCustom": { "type": "Array<object>", "writeback": true }, "placeholder": { "type": "string" }, "readonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "readonlyUserAssistanceShown": { "type": "string", "enumValues": ["none", "confirmationAndInfoMessages"] }, "required": { "type": "boolean" }, "requiredMessageDetail": { "type": "string" }, "textAlign": { "type": "string", "enumValues": ["end", "start", "right"] }, "unsafe_labelledBy": { "type": "string" }, "userAssistanceDensity": { "type": "string", "enumValues": ["compact", "reflow", "efficient"], "binding": { "consume": { "name": "containerUserAssistanceDensity" } } }, "validators": { "type": "Array<object>|null" }, "value": { "type": "any", "writeback": true }, "virtualKeyboard": { "type": "string", "enumValues": ["number", "search", "auto", "url", "text", "email", "tel"] }, "width": { "type": "number|string" }, "rawValue": { "type": "string", "readOnly": true, "writeback": true }, "valid": { "type": "string", "enumValues": ["pending", "valid", "invalidHidden", "invalidShown"], "readOnly": true, "writeback": true } }, "slots": { "end": {}, "start": {} }, "extension": { "_WRITEBACK_PROPS": ["messagesCustom", "rawValue", "valid", "value"], "_READ_ONLY_PROPS": ["rawValue", "valid"], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "id", "autofocus"] }, "methods": { "blur": {}, "focus": {}, "showMessages": {}, "reset": {}, "validate": {} } }, { "autocomplete": "on", "clearIcon": "never", "columnSpan": 1, "converter": null, "disabled": false, "displayOptions": { "converterHint": "display", "messages": "display", "validatorHint": "display" }, "help": { "instruction": "" }, "helpHints": { "definition": "", "source": "" }, "length": { "countBy": "codePoint", "max": null }, "messagesCustom": [], "readonlyUserAssistanceShown": "none", "required": false, "validators": [], "value": null, "virtualKeyboard": "auto" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useFormContext_1.FormContext, UNSAFE_useFormVariantContext_1.FormVariantContext, UNSAFE_useTabbableMode_1.TabbableModeContext] });
    exports.InputText = InputTextWithoutDefaultedGenerics;
});
