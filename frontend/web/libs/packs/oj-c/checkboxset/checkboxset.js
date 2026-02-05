define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "preact/hooks", "preact/compat", "ojs/ojcontext", "@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout", "ojs/ojvcomponent", "@oracle/oraclejet-preact/UNSAFE_CheckboxSet", "@oracle/oraclejet-preact/UNSAFE_CheckboxItem", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormContext", "oj-c/hooks/UNSAFE_useMergedFormContext/useMergedFormContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText", "oj-c/hooks/UNSAFE_useDataProvider/useDataProvider", "./useCheckboxsetPreact", "@oracle/oraclejet-preact/utils/UNSAFE_classNames", "css!oj-c/checkboxset/checkboxset-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, hooks_1, compat_1, Context, Layout_1, ojvcomponent_1, UNSAFE_CheckboxSet_1, UNSAFE_CheckboxItem_1, UNSAFE_useFormContext_1, useMergedFormContext_1, UNSAFE_useTabbableMode_1, useAssistiveText_1, useDataProvider_1, useCheckboxsetPreact_1, UNSAFE_classNames_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Checkboxset = void 0;
    // TODO: refactor to a single util along with radioset 
    function isDataProvider(options) {
        return options && 'fetchFirst' in options;
    }
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
    // Functional Component ------------------------------------------------------------- //
    const FunctionalCheckboxset = (0, compat_1.forwardRef)(
    /**
     *
     * @classdesc
     * <h3 id="checkboxsetOverview-section">
     *   JET Checkboxset Component
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#checkboxsetOverview-section"></a>
     * </h3>
     *
     * <p>
     * Description: A checkbox set enables the users to select one or multiple options in a set.
     * </p>
     *
     * <p>The options content can be configured via an array or a DataProvider.
     * It is recommended that a DataProvider should always be used for mutable data.
     * </p>
     *
     * <p>A JET Checkbox Set can be created with an array or DataProvider.</p>
     *
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-c-checkboxset options="[[arrayOrDP]]">
     * &lt;/oj-c-checkboxset>
     * </code>
     * </pre>
     *
     * <p>
     *  You can enable and disable an oj-c-checkboxset,
     *  which will enable and disable all contained checkboxes.
     * </p>
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
     * By default all user assistance text shows inline at the top of the checkboxset and is always displayed if there is any defined for the set.
     * See the user-assistance-density property for other ways the user assistance text can render. User assistance can also be provided at the
     * individual checkbox level which renders as a "?" icon and when clicked will display the assistive text in a pop-up.
     * </p>
     * <p>
     * The JET form component properties that are used for user assistance text are help.instruction, and help-hints.
     * In the Redwood theme for clarity only one user assistance text shows to the user.
     * The precedence rules are:
     * <ul>
     * <li>help.instruction shows;</li>
     * <li>if no help.instruction, then help-hints.definition shows;</li>
     * <li>help-hints.source always shows along side the above.</li>
     * </ul>
     * </p>
     * <p>
     * If the required property was set to true, this can also be used to guide the user.
     * In this case, the word Required will be rendered under the checkboxset when no value was set for the component.
     * </p>
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
     *     <tr>
     *       <td>Assistive help icon</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>If assistive text was setup for the checkbox, pop up the notewindow.</td>
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
     *       <td>Checkboxset</td>
     *       <td><kbd>Tab In</kbd></td>
     *       <td>Set focus to the first focusable checkbox in the checkboxset.
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
     *       <td>Sets focus to the next focusable checkbox in the checkboxset or help icon if it is present.
     *        Disabled checkboxes are not focusable. If focus is on the last focusable checkbox in the
     *        checkboxset, focus goes to the next focusable item after the oj-c-checkboxset.</td>
     *     </tr>
     *    <tr>
     *       <td>Checkbox</td>
     *       <td><kbd>Shift+Tab</kbd></td>
     *       <td>Sets focus to the previous focusable checkbox in the checkboxset.
     *        Disabled checkboxes are not focusable. If focus is on the first focusable checkbox in the
     *        checkboxset, focus goes to the previous focusable item before the oj-c-checkboxset.</td>
     *     </tr>
     *     <tr>
     *       <td>Assistive help icon</td>
     *       <td><kbd>Tab In</kbd></td>
     *       <td>If the checkbox has assistive text, sets the focus on the icon. Hitting Enter or Space on the icon will launch a pop-up.
     *           Pressing F6 transfers the focus inside the popup and tabbing inside the popup will move focus to the link inside the popup, if one exists.
     *           Hitting Enter on the link will launch a new window with the url that was setup in the helpSourceLink property of the checkbox.
     *           See <a href="#CheckboxsetDataItem">CheckboxsetDataItem</a> for information on assistive properties of the checkbox.
     *       </td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <h3 id="a11y-section">
     * Accessibility
     * <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>JET Checkboxset takes care of setting <code class="prettyprint">role="group"</code>.
     *
     * @ojmetadata displayName "Checkboxset"
     * @ojmetadata description "A checkbox set allows the user to select one or more options from a set."
     * @ojmetadata help "oj-c.Checkboxset.html"
     * @ojmetadata main "oj-c/checkboxset"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "16.0.0",
     *     "value": ["oj-checkboxset"]
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Forms"
     *   },
     *  "vbdt": {
     *    "module": "oj-c/checkboxset",
     *    "defaultColumns": 6,
     *    "minColumns": 2
     *  },
     *  "oracle": {
     *    "icon": "oj-ux-ico-checkbox-on",
     *    "uxSpecs": [
     *    "checkboxset"
     *   ]
     *  }
     * }
     * @ojmetadata propertyLayout [
     * {
     *   "propertyGroup": "common",
     *   "items": [
     *   "disabled",
     *   "labelHint",
     *   "readonly",
     *   "required"
     *   ]
     * },
     * {
     *   "propertyGroup": "data",
     *   "items": [
     *   "value"
     *   ]
     * }
     * ]
     * @ojmetadata since "16.0.0"
     * @ojmetadata requirements [
     *  {
     *    type: "anyOf",
     *    label: "accessibility",
     *    properties: ["labelHint", "options"]
     *  },
     *  {
     *    type: "not",
     *    label: "accessibility",
     *    properties: ["aria-label", "aria-labelledby"]
     *  }
     * ]
     */
    ({ id, options, containerReadonly: propContainerReadonly, displayOptions = displayOptionsDefault, help = helpDefault, helpHints = helpHintsDefault, disabled = false, direction = 'column', labelWrapping: propLabelWrapping, messagesCustom = messagesCustomDefault, columnSpan = 1, readonly: propReadonly, readonlyUserAssistanceShown = 'none', userAssistanceDensity: propUserAssistanceDensity, required = false, value = null, ...otherProps }, ref) => {
        const rootRef = (0, hooks_1.useRef)();
        const checkboxsetRef = (0, hooks_1.useRef)();
        const addBusyState = (0, hooks_1.useCallback)((description = 'Checkboxset: busyState') => {
            return rootRef.current
                ? Context.getContext(rootRef.current).getBusyContext().addBusyState({ description })
                : () => { }; // if the component is not mounted return Noop
        }, []);
        const isFromDataProvider = isDataProvider(options);
        const { containerProps, uadValue, readonlyValue } = (0, useMergedFormContext_1.useMergedFormContext)({
            propContainerReadonly,
            propLabelWrapping,
            propReadonly,
            propUserAssistanceDensity
        });
        const { checkboxsetProps, methods } = (0, useCheckboxsetPreact_1.useCheckboxsetPreact)({
            displayOptions,
            readonly: readonlyValue,
            readonlyUserAssistanceShown,
            required,
            messagesCustom,
            disabled,
            value,
            userAssistanceDensity: uadValue,
            ...otherProps
        }, addBusyState);
        const { value: hookValue, ...checkboxsetRest } = checkboxsetProps;
        const { data } = (0, useDataProvider_1.useDataProvider)({
            data: isFromDataProvider ? options : undefined,
            addBusyState
        });
        const dataArr = (0, hooks_1.useMemo)(() => {
            // if the options are an array, we want to clone the prop
            const clonedOptions = !isFromDataProvider && options ? [...options] : [];
            return isFromDataProvider
                ? Array.isArray(data)
                    ? data.map((item) => ({ value: item.key, ...item.data }))
                    : []
                : clonedOptions;
        }, [data, isFromDataProvider, options]);
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => checkboxsetRef.current?.blur(),
            focus: () => checkboxsetRef.current?.focus(),
            ...methods
        }), [methods]);
        const assistiveTextProps = (0, useAssistiveText_1.useAssistiveText)({
            displayOptions,
            help,
            helpHints,
            userAssistanceDensity: uadValue
        });
        // ensure that the value is a Set type and memoize to prevent creating a new set with every rerender
        const memoizedSetValue = (0, hooks_1.useMemo)(() => (hookValue ? new Set(hookValue) : undefined), [hookValue]);
        const rootClasses = (0, UNSAFE_classNames_1.classNames)([
            Layout_1.layoutSpanStyles.layoutSpanColumn[columnSpan],
            containerProps.isFormLayout && 'in-form-layout'
        ]);
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: id, ref: rootRef, class: rootClasses, "data-oj-renders-label": true, children: (0, jsx_runtime_1.jsx)(UNSAFE_useFormContext_1.FormContext.Provider, { value: containerProps, children: (0, jsx_runtime_1.jsx)(UNSAFE_CheckboxSet_1.CheckboxSet, { ref: checkboxsetRef, direction: direction, ...assistiveTextProps, ...checkboxsetRest, columnSpan: columnSpan, userAssistanceDensity: uadValue, value: memoizedSetValue, children: dataArr.map(({ assistiveText, helpSourceLink, helpSourceText, label, value }) => ((0, jsx_runtime_1.jsx)(UNSAFE_CheckboxItem_1.CheckboxItem, { assistiveText: assistiveText, helpSourceLink: helpSourceLink, helpSourceText: helpSourceText, value: value, children: label }, value))) }) }) }));
    });
    // This custom element supports generic parameters, but was introduced before the pattern for exposing
    // generic parameters on the functional value-based element was established.  In order to introduce the generics in
    // a backwards-compatible way, they must be defaulted, but we don't want the defaults to be added to the existing
    // types which had generics from the start.  The solution is to use two consts:
    //   * the first is not exported, but is used as the basis for the custom element types and does not default its generics
    //   * the second is the exported functional value-based element and defaults the generics for backwards compatibility
    const CheckboxsetWithoutDefaultedGenerics = (0, ojvcomponent_1.registerCustomElement)('oj-c-checkboxset', FunctionalCheckboxset, "Checkboxset", { "properties": { "containerReadonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "columnSpan": { "type": "number" }, "disabled": { "type": "boolean" }, "direction": { "type": "string", "enumValues": ["row", "column"] }, "displayOptions": { "type": "object", "properties": { "messages": { "type": "string", "enumValues": ["none", "display"] } } }, "help": { "type": "object", "properties": { "instruction": { "type": "string" } } }, "helpHints": { "type": "object", "properties": { "definition": { "type": "string" }, "source": { "type": "string" }, "sourceText": { "type": "string" } } }, "labelEdge": { "type": "string", "enumValues": ["none", "start", "top", "inside"], "binding": { "consume": { "name": "containerLabelEdge" } } }, "labelHint": { "type": "string" }, "labelStartWidth": { "type": "number|string", "binding": { "consume": { "name": "labelWidth" } } }, "messagesCustom": { "type": "Array<object>", "writeback": true }, "readonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "readonlyUserAssistanceShown": { "type": "string", "enumValues": ["none", "confirmationAndInfoMessages"] }, "required": { "type": "boolean" }, "userAssistanceDensity": { "type": "string", "enumValues": ["compact", "reflow", "efficient"], "binding": { "consume": { "name": "containerUserAssistanceDensity" } } }, "options": { "type": "Array<object>|DataProvider" }, "labelWrapping": { "type": "string", "enumValues": ["truncate", "wrap"], "binding": { "consume": { "name": "labelWrapping" } } }, "requiredMessageDetail": { "type": "string" }, "valid": { "type": "string", "enumValues": ["pending", "valid", "invalidHidden", "invalidShown"], "readOnly": true, "writeback": true }, "value": { "type": "Array<string|number>|null", "writeback": true } }, "extension": { "_WRITEBACK_PROPS": ["messagesCustom", "valid", "value"], "_READ_ONLY_PROPS": ["valid"], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "id"] }, "methods": { "blur": {}, "focus": {}, "showMessages": {}, "reset": {}, "validate": {} } }, { "displayOptions": { "messages": "display" }, "help": { "instruction": "" }, "helpHints": { "definition": "", "source": "" }, "disabled": false, "direction": "column", "messagesCustom": [], "columnSpan": 1, "readonlyUserAssistanceShown": "none", "required": false, "value": null }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
    const Checkboxset = CheckboxsetWithoutDefaultedGenerics;
    exports.Checkboxset = Checkboxset;
});
