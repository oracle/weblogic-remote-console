define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_RadioItem", "@oracle/oraclejet-preact/UNSAFE_RadioSet", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormContext", "oj-c/hooks/UNSAFE_useMergedFormContext/useMergedFormContext", "oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText", "ojs/ojvcomponent", "preact/hooks", "preact/compat", "oj-c/hooks/UNSAFE_useDataProvider/useDataProvider", "./useRadiosetPreact", "ojs/ojcontext", "@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout", "@oracle/oraclejet-preact/utils/UNSAFE_classNames", "css!oj-c/radioset/radioset-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_RadioItem_1, UNSAFE_RadioSet_1, UNSAFE_useTabbableMode_1, UNSAFE_useFormContext_1, useMergedFormContext_1, useAssistiveText_1, ojvcomponent_1, hooks_1, compat_1, useDataProvider_1, useRadiosetPreact_1, Context, Layout_1, UNSAFE_classNames_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Radioset = void 0;
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
    const FunctionalRadioset = (0, compat_1.forwardRef)(
    /**
     * @classdesc
     * <h3 id="radiosetOverview-section">
     *   JET Radioset Component
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#radiosetOverview-section"></a>
     * </h3>
     * <p>
     * Description: The oj-c-radioset component allows the user to select one option from a set of mutually exclusive options.
     * </p>
     * <p>
     * To use an oj-c-radioset, set the options attribute to an array of data items or to a DataProvider.
     *  <pre class="prettyprint"><code>&lt;oj-c-radioset
     *    value="current value"
     *    label-hint="Radioset"
     *    options="[[data]]">&lt;/oj-c-radioset></code></pre>
     *
     * It is recommended that the array option should only be used for static data and the DataProvider should always be used for mutable data.
     * </p>
     * <p>
     *  You can enable and disable an oj-c-radioset, which will enable and disable all contained radio items.
     * </p>
     * <p>
     *  You can also set an oj-c-radioset to readonly, which will make all the radio items readonly while making the selected radio option visually distinctive.
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
     * By default all user assistance text shows inline at the top of the radioset and is always displayed if there is any defined for the set.
     * See the user-assistance-density property for other ways the user assistance text can render. User assistance can also be provided at the
     * individual radio item level which renders as a "?" icon and when clicked will display the assistive text in a pop-up.
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
     * In this case, the word Required will be rendered under the radioset when no value was set for the component.
     * </p>
     *
     * <h3 id="touch-section">
     *   Touch End User Information
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
     * </h3>
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
     *       <td>Radio button</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Select the radio button.</td>
     *     </tr>
     *     <tr>
     *       <td>Radio button's label</td>
     *       <td><kbd>Tap</kbd></td>
     *      <td>Select the corresponding radio button.</td>
     *     </tr>
     *     <tr>
     *       <td>Assistive help icon</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>If assistive text was setup for the radio button, pop up the notewindow.</td>
     *    </tr>
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
     *       <td rowspan="2">Input</td>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Select the previous radio button in the group.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Select the next radio button in the group.</td>
     *     </tr>
     *     <tr>
     *       <td>Radioset</td>
     *       <td><kbd>Tab In</kbd></td>
     *       <td>If the radioset has help-hints.source, sets the focus on the link, otherwise sets the focus on the
     *        checked radio button. If no button was selected, sets the focus on the first radio button.</td>
     *     </tr>
     *     <tr>
     *       <td>Assistive help icon</td>
     *       <td><kbd>Tab In</kbd></td>
     *       <td>If the radio item has assistive text, sets the focus on the icon. Hitting Enter or Space on the icon will launch a pop-up.
     *           Pressing F6 transfers the focus inside the popup and tabbing inside the popup will move focus to the link inside the popup, if one exists.
     *           Hitting Enter on the link will launch a new window with the url that was setup in the helpSourceLink property of the radio item.
     *           See <a href="#RadiosetDataItem">RadiosetDataItem</a> for information on assistive properties of the radio item.
     *       </td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>JET oj-c-radioset takes care of setting
     * <code class="prettyprint">role="radiogroup"</code> on the oj-c-radioset element.
     *
     * <p>
     * <p>
     * For accessibility, set the label-hint property.
     * If the desire is to not have a visible label, then to make this accessible to screen reader users,
     * set label-hint to a value and the label-edge to 'none' which renders an aria-label with the label-hint text.
     * </p>
     * {@include accessibility_doc.ts#a11y-section-disabled-content}
     * </p>
     * @ojmetadata description "A radio set allows the user to select one option from a set of mutually exclusive options."
     * @ojmetadata displayName "Radioset"
     * @ojmetadata help "oj-c.Radioset.html"
     * @ojmetadata main "oj-c/radioset"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "16.0.0",
     *     "value": ["oj-radioset"]
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Forms"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/radioset"
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-radioset",
     *     "uxSpecs": [
     *       "radioset"
     *     ]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "disabled",
     *       "labelHint",
     *       "direction",
     *       "placeholder",
     *       "readonly",
     *       "required",
     *     ]
     *   },
     *   {
     *     "propertyGroup": "data",
     *     "items": [
     *       "options",
     *       "value"
     *     ]
     *   }
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
    ({ containerReadonly: propContainerReadonly, displayOptions = displayOptionsDefault, help = helpDefault, helpHints = helpHintsDefault, labelWrapping: propLabelWrapping, columnSpan = 1, disabled = false, direction = 'column', messagesCustom = messagesCustomDefault, readonly: propReadonly, readonlyUserAssistanceShown = 'none', required = false, userAssistanceDensity: propUserAssistanceDensity, value = null, ...otherProps }, ref) => {
        const { options } = otherProps;
        const rootRef = (0, hooks_1.useRef)();
        const radiosetRef = (0, hooks_1.useRef)();
        const addBusyState = (0, hooks_1.useCallback)((desc = 'Radioset: busyState') => {
            return rootRef.current
                ? Context.getContext(rootRef.current)
                    .getBusyContext()
                    .addBusyState({ description: `oj-c-radioset id=${otherProps.id} is ${desc}` })
                : () => { }; // if the component is not mounted return Noop
        }, [otherProps.id]);
        const { containerProps, uadValue, readonlyValue } = (0, useMergedFormContext_1.useMergedFormContext)({
            propContainerReadonly,
            propLabelWrapping,
            propReadonly,
            propUserAssistanceDensity
        });
        const { radiosetProps, methods } = (0, useRadiosetPreact_1.useRadiosetPreact)({
            direction,
            disabled,
            displayOptions,
            messagesCustom,
            readonly: readonlyValue,
            readonlyUserAssistanceShown,
            required,
            userAssistanceDensity: uadValue,
            value,
            ...otherProps
        }, addBusyState);
        let dataArr = [];
        const { data } = (0, useDataProvider_1.useDataProvider)({
            data: isDataProvider(options) ? options : undefined,
            addBusyState
        });
        dataArr = (0, hooks_1.useMemo)(() => {
            let retDataArr = [];
            if (isDataProvider(options)) {
                if (Array.isArray(data)) {
                    retDataArr = data.map((item) => {
                        return { value: item.key, ...item.data };
                    });
                }
            }
            else if (options) {
                retDataArr = [...options];
            }
            return retDataArr;
        }, [options, data]);
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => radiosetRef.current?.blur(),
            focus: () => radiosetRef.current?.focus(),
            ...methods
        }), [methods]);
        const assistiveTextProps = (0, useAssistiveText_1.useAssistiveText)({
            displayOptions,
            help,
            helpHints,
            userAssistanceDensity: radiosetProps.userAssistanceDensity
        });
        const rootClasses = (0, UNSAFE_classNames_1.classNames)([
            Layout_1.layoutSpanStyles.layoutSpanColumn[columnSpan],
            containerProps.isFormLayout && 'in-form-layout'
        ]);
        // layoutSpanColumn style class needs to be applied to the root dom element,
        // otherwise the css grid will ignore it.
        // Even though we are handling the styling here, we pass the columnSpan property down to the
        // Preact component because it may be needed for other purposes, like calculating the start
        // label width.
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: otherProps.id, ref: rootRef, class: rootClasses, "data-oj-renders-label": true, children: (0, jsx_runtime_1.jsx)(UNSAFE_useFormContext_1.FormContext.Provider, { value: containerProps, children: (0, jsx_runtime_1.jsx)(UNSAFE_RadioSet_1.RadioSet, { ref: radiosetRef, direction: direction, ...assistiveTextProps, ...radiosetProps, columnSpan: columnSpan, children: dataArr.map((radioItem) => ((0, jsx_runtime_1.jsx)(UNSAFE_RadioItem_1.RadioItem, { assistiveText: radioItem.assistiveText, helpSourceLink: radioItem.helpSourceLink, helpSourceText: radioItem.helpSourceText, value: radioItem.value, children: radioItem.label }, radioItem.value))) }) }) }));
    });
    // This custom element supports generic parameters, but was introduced before the pattern for exposing
    // generic parameters on the functional value-based element was established.  In order to introduce the generics in
    // a backwards-compatible way, they must be defaulted, but we don't want the defaults to be added to the existing
    // types which had generics from the start.  The solution is to use two consts:
    //   * the first is not exported, but is used as the basis for the custom element types and does not default its generics
    //   * the second is the exported functional value-based element and defaults the generics for backwards compatibility
    const RadiosetWithoutDefaultedGenerics = (0, ojvcomponent_1.registerCustomElement)('oj-c-radioset', FunctionalRadioset, "Radioset", { "properties": { "containerReadonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "columnSpan": { "type": "number" }, "direction": { "type": "string", "enumValues": ["row", "column"] }, "disabled": { "type": "boolean" }, "displayOptions": { "type": "object", "properties": { "messages": { "type": "string", "enumValues": ["none", "display"] } } }, "help": { "type": "object", "properties": { "instruction": { "type": "string" } } }, "helpHints": { "type": "object", "properties": { "definition": { "type": "string" }, "source": { "type": "string" }, "sourceText": { "type": "string" } } }, "labelHint": { "type": "string" }, "labelEdge": { "type": "string", "enumValues": ["none", "start", "top", "inside"], "binding": { "consume": { "name": "containerLabelEdge" } } }, "labelStartWidth": { "type": "number|string", "binding": { "consume": { "name": "labelWidth" } } }, "labelWrapping": { "type": "string", "enumValues": ["truncate", "wrap"], "binding": { "consume": { "name": "labelWrapping" } } }, "messagesCustom": { "type": "Array<object>", "writeback": true }, "options": { "type": "Array<object>|DataProvider" }, "valid": { "type": "string", "enumValues": ["pending", "valid", "invalidHidden", "invalidShown"], "readOnly": true, "writeback": true }, "readonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "readonlyUserAssistanceShown": { "type": "string", "enumValues": ["none", "confirmationAndInfoMessages"] }, "required": { "type": "boolean" }, "requiredMessageDetail": { "type": "string" }, "userAssistanceDensity": { "type": "string", "enumValues": ["compact", "reflow", "efficient"], "binding": { "consume": { "name": "containerUserAssistanceDensity" } } }, "value": { "type": "string|number|null", "writeback": true } }, "extension": { "_WRITEBACK_PROPS": ["messagesCustom", "valid", "value"], "_READ_ONLY_PROPS": ["valid"], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "id"] }, "methods": { "blur": {}, "focus": {}, "showMessages": {}, "reset": {}, "validate": {} } }, { "displayOptions": { "messages": "display" }, "help": { "instruction": "" }, "helpHints": { "definition": "", "source": "" }, "columnSpan": 1, "disabled": false, "direction": "column", "messagesCustom": [], "readonlyUserAssistanceShown": "none", "required": false, "value": null }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
    exports.Radioset = RadiosetWithoutDefaultedGenerics;
});
