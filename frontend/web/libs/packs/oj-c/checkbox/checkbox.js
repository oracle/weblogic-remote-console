define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "preact/hooks", "preact/compat", "ojs/ojcontext", "ojs/ojvcomponent", "@oracle/oraclejet-preact/UNSAFE_Checkbox", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormContext", "oj-c/hooks/UNSAFE_useMergedFormContext/useMergedFormContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout", "oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText", "./useCheckboxPreact", "@oracle/oraclejet-preact/utils/UNSAFE_classNames", "css!oj-c/checkbox/checkbox-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, hooks_1, compat_1, Context, ojvcomponent_1, UNSAFE_Checkbox_1, UNSAFE_useFormContext_1, useMergedFormContext_1, UNSAFE_useTabbableMode_1, Layout_1, useAssistiveText_1, useCheckboxPreact_1, UNSAFE_classNames_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Checkbox = void 0;
    // Define constants for object literal default values to prevent extra re-renders.
    const displayOptionsDefault = {
        messages: 'display'
    };
    const helpDefault = {
        instruction: ''
    };
    const helpHintsDefault = {
        definition: '',
        source: ''
    };
    const messagesCustomDefault = [];
    const FunctionalCheckbox = (0, compat_1.forwardRef)(
    /**
     * @classdesc
     * <h3 id="checkboxOverview-section">
     *   JET Checkbox Component
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#checkboxOverview-section"></a>
     * </h3>
     *
     * Checkbox is a single standalone checkbox control. It represents a boolean value.
     *
     * <p>The Checkbox label is placed in the default slot and can be a short string or block of text
     * </p>
     *
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-c-checkbox value="false">
     * I Agree
     * &lt;/oj-c-checkbox>
     * </code>
     * </pre>
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
     * <h3 id="touch-section">
     * Touch End User Information
     * <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
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
     *    <tr>
     *       <td>Checkbox</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td> Select/unselect the checkbox</td>
     *     </tr>
     *     <tr>
     *       <td>Checkbox's Label</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td> Select/unselect the corresponding checkbox</td>
     *    </tr>
     *   </tbody>
     * </table>
     *
     * <h3 id="keyboard-section">
     * Keyboard End User Information
     * <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
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
     *       <td>Checkbox</td>
     *       <td><kbd>Tab In</kbd></td>
     *       <td>Set focus on the checkbox.
     *       Disabled checkboxes are not focusable.</td>
     *     </tr>
     *     <tr>
     *       <td>Checkbox</td>
     *       <td><kbd>Space</kbd></td>
     *       <td>Toggles the checkbox; If the checkbox is unselected, it will select it and vice versa.</td>
     *     </tr>
     *    <tr>
     *       <td>Checkbox</td>
     *       <td><kbd>Tab</kbd></td>
     *       <td>Focus goes to the next focusable item after the oj-c-checkbox or help icon if present.</td>
     *     </tr>
     *    <tr>
     *       <td>Checkbox</td>
     *       <td><kbd>Shift+Tab</kbd></td>
     *       <td>Sets focus to the previous focusable item before the oj-c-checkbox.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <h3 id="a11y-section">
     * Accessibility
     * <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>Text as a label is required in the default slot to associate with the checkbox element</p>
     *
     *
     * @ojmetadata displayName "Checkbox"
     * @ojmetadata description "Checkbox is a single standalone checkbox control. It represents a boolean value."
     * @ojmetadata help "oj-c.Checkbox.html"
     * @ojmetadata main "oj-c/checkbox"
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
     *     "module": "oj-c/checkbox",
     *     "defaultColumns": 6,
     *     "minColumns": 2
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-checkbox-on",
     *     "uxSpecs": [
     *       "checkbox"
     *     ]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "disabled",
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
     * @ojmetadata requirements [
     *   {
     *     type: "anyOf",
     *     label: "accessibility",
     *     slots: [""]
     *   },
     *   {
     *     type: "not",
     *     label: "accessibility",
     *     properties: ["aria-label", "aria-labelledby"]
     *   }
     * ]
     * @ojmetadata since "16.0.0"
     */
    ({ ['aria-describedby']: ariaDescribedBy, children, columnSpan = 1, containerReadonly: propContainerReadonly, disabled = false, displayOptions = displayOptionsDefault, help = helpDefault, helpHints = helpHintsDefault, id, messagesCustom = messagesCustomDefault, onMessagesCustomChanged, onValidChanged, onValueChanged, readonly: propReadonly, readonlyUserAssistanceShown = 'none', required = false, requiredMessageDetail, userAssistanceDensity: propUserAssistanceDensity, value = false }, ref) => {
        const rootRef = (0, hooks_1.useRef)();
        const checkboxRef = (0, hooks_1.useRef)();
        const addBusyState = (0, hooks_1.useCallback)((description) => {
            return rootRef.current
                ? Context.getContext(rootRef.current)
                    .getBusyContext()
                    .addBusyState({ description: `oj-c-checkbox id=${id} is ${description}` })
                : () => { }; // if the component is not mounted return Noop
        }, [id]);
        const { containerProps, uadValue, readonlyValue } = (0, useMergedFormContext_1.useMergedFormContext)({
            propContainerReadonly,
            propLabelWrapping: undefined, // This component doesn't have labelWrapping
            propReadonly,
            propUserAssistanceDensity
        });
        const { checkboxProps, methods } = (0, useCheckboxPreact_1.useCheckboxPreact)({
            ['aria-describedby']: ariaDescribedBy,
            disabled,
            displayOptions,
            messagesCustom,
            onMessagesCustomChanged,
            onValidChanged,
            onValueChanged,
            readonly: readonlyValue,
            readonlyUserAssistanceShown,
            required,
            requiredMessageDetail,
            userAssistanceDensity: uadValue,
            value
        }, addBusyState);
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => checkboxRef.current?.blur(),
            focus: () => checkboxRef.current?.focus(),
            ...methods
        }), [methods]);
        const assistiveTextProps = (0, useAssistiveText_1.useAssistiveText)({
            displayOptions,
            help,
            helpHints,
            userAssistanceDensity: checkboxProps.userAssistanceDensity
        });
        const rootClasses = (0, UNSAFE_classNames_1.classNames)([
            Layout_1.layoutSpanStyles.layoutSpanColumn[columnSpan],
            containerProps.isFormLayout && 'in-form-layout'
        ]);
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: id, ref: rootRef, class: rootClasses, children: (0, jsx_runtime_1.jsx)(UNSAFE_useFormContext_1.FormContext.Provider, { value: containerProps, children: (0, jsx_runtime_1.jsx)(UNSAFE_Checkbox_1.Checkbox, { ref: checkboxRef, ...assistiveTextProps, ...checkboxProps, columnSpan: columnSpan, children: children }) }) }));
    });
    const Checkbox = (0, ojvcomponent_1.registerCustomElement)('oj-c-checkbox', FunctionalCheckbox, "Checkbox", { "slots": { "": {} }, "properties": { "containerReadonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "columnSpan": { "type": "number" }, "disabled": { "type": "boolean" }, "displayOptions": { "type": "object", "properties": { "messages": { "type": "string", "enumValues": ["none", "display"] } } }, "help": { "type": "object", "properties": { "instruction": { "type": "string" } } }, "helpHints": { "type": "object", "properties": { "definition": { "type": "string" }, "source": { "type": "string" }, "sourceText": { "type": "string" } } }, "messagesCustom": { "type": "Array<object>", "writeback": true }, "readonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "readonlyUserAssistanceShown": { "type": "string", "enumValues": ["none", "confirmationAndInfoMessages"] }, "required": { "type": "boolean" }, "userAssistanceDensity": { "type": "string", "enumValues": ["compact", "reflow", "efficient"], "binding": { "consume": { "name": "containerUserAssistanceDensity" } } }, "requiredMessageDetail": { "type": "string" }, "valid": { "type": "string", "enumValues": ["pending", "valid", "invalidHidden", "invalidShown"], "readOnly": true, "writeback": true }, "value": { "type": "boolean", "writeback": true } }, "extension": { "_WRITEBACK_PROPS": ["messagesCustom", "valid", "value"], "_READ_ONLY_PROPS": ["valid"], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "id"] }, "methods": { "blur": {}, "focus": {}, "showMessages": {}, "reset": {}, "validate": {} } }, { "columnSpan": 1, "disabled": false, "displayOptions": { "messages": "display" }, "help": { "instruction": "" }, "helpHints": { "definition": "", "source": "" }, "messagesCustom": [], "readonlyUserAssistanceShown": "none", "required": false, "value": false }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
    exports.Checkbox = Checkbox;
});
