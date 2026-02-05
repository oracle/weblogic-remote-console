define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "preact/hooks", "preact/compat", "ojs/ojvcomponent", "oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText", "ojs/ojcontext", "oj-c/hooks/UNSAFE_useMergedFormContext/useMergedFormContext", "@oracle/oraclejet-preact/UNSAFE_RichRadioSet", "@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormContext", "@oracle/oraclejet-preact/UNSAFE_RichSelectionItem", "./useRichRadiosetPreact", "@oracle/oraclejet-preact/utils/UNSAFE_classNames", "css!oj-c/rich-radioset/rich-radioset-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, hooks_1, compat_1, ojvcomponent_1, useAssistiveText_1, Context, useMergedFormContext_1, UNSAFE_RichRadioSet_1, Layout_1, UNSAFE_useTabbableMode_1, UNSAFE_useFormContext_1, UNSAFE_RichSelectionItem_1, useRichRadiosetPreact_1, UNSAFE_classNames_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RichRadioset = void 0;
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
    const FunctionalRichRadioset = (0, compat_1.forwardRef)(
    /**
     * @classdesc
     * <h3 id="richRadiosetOverview-section">
     *   JET Rich Radioset Component
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#richRadiosetOverview-section"></a>
     * </h3>
     * <p>
     * Description: A JET Rich Radio Set component allows the user to select one option from a set of mutually exclusive rich options.
     * </p>
     * <p>The options content can be configured via an array.
     * Once an array is set it should not be mutated. In order to change the data, a new array instance must be set.
     * </p>
     * <p>
     *  You can enable and disable an oj-c-rich-radioset, which will enable and disable all contained radio items.
     * </p>
     * <p>
     *  You can also set an oj-c-rich-radioset to readonly,
     *  which will make all the radio items readonly.
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
     * By default all user assistance text shows inline at the top of the rich radioset and is always displayed if there is any defined for the set.
     * See the user-assistance-density property for other ways the user assistance text can render.
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
     * In this case, the word Required will be rendered under the rich radioset when no value was set for the component.
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
     *       <td>Rich Radio Card</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Select the corresponding radio button.</td>
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
     *       <td>Rich Radioset</td>
     *       <td><kbd>Tab In</kbd></td>
     *       <td>Sets focus to the selected card in the rich radioset.
     *       Otherwise, it will set focus to the first focusable card in the rich radioset.
     *       Disabled radio cards are not focusable.</td>
     *     </tr>
     *     <tr>
     *       <td rowspan="2">Rich Radio Card</td>
     *       <td><kbd>UpArrow</kbd></td>
     *       <td>Select the previous radio button in the group.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>DownArrow</kbd></td>
     *       <td>Select the next radio button in the group.</td>
     *     </tr>
     *     <tr>
     *       <td>Rich Radioset</td>
     *       <td><kbd>Shift+Tab</kbd></td>
     *       <td>Sets focus to the selected card in the rich radioset.
     *        If the focus is currently on the first focusable radio card in the set, it will
     *        shift to the "Learn More" link if help source exists. If no help source is available,
     *        the focus will move to the previous focusable element on the page before the `oj-c-rich-radioset`.
     *        Disabled radio cards are not focusable.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>JET oj-c-rich-radioset takes care of setting
     * <code class="prettyprint">role="radiogroup"</code> on the oj-c-rich-radioset element.
     * </p>
     *
     * <p>
     * For accessibility, set the label-hint property.
     * If the desire is to not have a visible label, then to make this accessible to screen reader users,
     * set label-hint to a value and the label-edge to 'none' which renders an aria-label with the label-hint text.
     *
     * {@include accessibility_doc.ts#a11y-section-disabled-content}
     *
     * @ojmetadata description "A rich radio set allows the user to select one option from a set of mutually exclusive rich options."
     * @ojmetadata displayName "RichRadioset"
     * @ojmetadata main "oj-c/rich-radioset"
     * @ojmetadata status [
     *   {
     *     type: "production",
     *     since: "18.1.0"
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Forms"
     *   },
     *  "vbdt": {
     *    "module": "oj-c/rich-radioset",
     *    "defaultColumns": 6,
     *    "minColumns": 2
     *  },
     *  "oracle": {
     *    "icon": "oj-ux-ico-radio-set",
     *    "uxSpecs": [
     *      "radioset"
     *    ]
     *  }
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
     * @ojmetadata since "18.1.0"
     * @ojmetadata requirements [
     *  {
     *    type: "anyOf",
     *    label: "accessibility",
     *    properties: ["labelHint", "layout", "options"]
     *  },
     *  {
     *    type: "not",
     *    label: "accessibility",
     *    properties: ["aria-label", "aria-labelledby"]
     *  }
     * ]
     */
    ({ id, options, containerReadonly: propContainerReadonly, displayOptions = displayOptionsDefault, help = helpDefault, helpHints = helpHintsDefault, disabled = false, layout, messagesCustom = messagesCustomDefault, columnSpan = 1, readonly: propReadonly, readonlyUserAssistanceShown = 'none', userAssistanceDensity: propUserAssistanceDensity, required = false, value, ...otherProps }, ref) => {
        const rootRef = (0, hooks_1.useRef)();
        const richRadiosetRef = (0, hooks_1.useRef)();
        const addBusyState = (0, hooks_1.useCallback)((description) => {
            return rootRef.current
                ? Context.getContext(rootRef.current)
                    .getBusyContext()
                    .addBusyState({ description: `oj-c-rich-radioset id=${id} is ${description}` })
                : () => { }; // if the component is not mounted return Noop
        }, [id]);
        const { containerProps, uadValue, readonlyValue } = (0, useMergedFormContext_1.useMergedFormContext)({
            propContainerReadonly,
            propLabelWrapping: 'wrap',
            propReadonly,
            propUserAssistanceDensity
        });
        const { richRadiosetProps, methods } = (0, useRichRadiosetPreact_1.useRichRadiosetPreact)({
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
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => richRadiosetRef.current?.blur(),
            focus: () => richRadiosetRef.current?.focus(),
            ...methods
        }), [methods]);
        const { value: hookValue, ...richRadiosetRest } = richRadiosetProps;
        const assistiveTextProps = (0, useAssistiveText_1.useAssistiveText)({
            displayOptions,
            help,
            helpHints,
            userAssistanceDensity: uadValue
        });
        // to prevent the component from rerendering with mutated data, we need to memoize the options array
        // if a developer wants to refresh the component with new data, they must explicitly provide a new reference
        const memoizedOptions = (0, hooks_1.useMemo)(() => (options ? [...options] : []), [options]);
        const rootClasses = (0, UNSAFE_classNames_1.classNames)([
            Layout_1.layoutSpanStyles.layoutSpanColumn[columnSpan],
            containerProps.isFormLayout && 'in-form-layout'
        ]);
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: id, ref: rootRef, class: rootClasses, "data-oj-renders-label": true, children: (0, jsx_runtime_1.jsx)(UNSAFE_useFormContext_1.FormContext.Provider, { value: containerProps, children: (0, jsx_runtime_1.jsx)(UNSAFE_RichRadioSet_1.RichRadioSet, { ref: richRadiosetRef, ...assistiveTextProps, ...richRadiosetRest, columnSpan: columnSpan, layout: layout, userAssistanceDensity: uadValue, value: hookValue, children: memoizedOptions.map(({ secondaryText, thumbnailSrc, iconClass, avatar, label, value }) => {
                        const mediaObj = iconClass
                            ? { iconClass }
                            : thumbnailSrc
                                ? { thumbnailSrc }
                                : avatar
                                    ? { avatar }
                                    : {};
                        return ((0, jsx_runtime_1.jsx)(UNSAFE_RichSelectionItem_1.RichSelectionItem, { label: label, secondaryText: secondaryText, value: value, ...mediaObj }, value));
                    }) }) }) }));
    });
    // This custom element supports generic parameters, but was introduced before the pattern for exposing
    // generic parameters on the functional value-based element was established.  In order to introduce the generics in
    // a backwards-compatible way, they must be defaulted, but we don't want the defaults to be added to the existing
    // types which had generics from the start.  The solution is to use two consts:
    //   * the first is not exported, but is used as the basis for the custom element types and does not default its generics
    //   * the second is the exported functional value-based element and defaults the generics for backwards compatibility
    const RichRadiosetWithoutDefaultedGenerics = (0, ojvcomponent_1.registerCustomElement)('oj-c-rich-radioset', FunctionalRichRadioset, "RichRadioset", { "properties": { "containerReadonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "columnSpan": { "type": "number" }, "disabled": { "type": "boolean" }, "displayOptions": { "type": "object", "properties": { "messages": { "type": "string", "enumValues": ["none", "display"] } } }, "help": { "type": "object", "properties": { "instruction": { "type": "string" } } }, "helpHints": { "type": "object", "properties": { "definition": { "type": "string" }, "source": { "type": "string" }, "sourceText": { "type": "string" } } }, "labelEdge": { "type": "string", "enumValues": ["none", "start", "top", "inside"], "binding": { "consume": { "name": "containerLabelEdge" } } }, "labelHint": { "type": "string" }, "labelStartWidth": { "type": "number|string", "binding": { "consume": { "name": "labelWidth" } } }, "layout": { "type": "string", "enumValues": ["sm", "md", "xl"] }, "messagesCustom": { "type": "Array<object>", "writeback": true }, "readonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "readonlyUserAssistanceShown": { "type": "string", "enumValues": ["none", "confirmationAndInfoMessages"] }, "required": { "type": "boolean" }, "userAssistanceDensity": { "type": "string", "enumValues": ["compact", "reflow", "efficient"], "binding": { "consume": { "name": "containerUserAssistanceDensity" } } }, "options": { "type": "Array<object>" }, "requiredMessageDetail": { "type": "string" }, "valid": { "type": "string", "enumValues": ["pending", "valid", "invalidHidden", "invalidShown"], "readOnly": true, "writeback": true }, "value": { "type": "string|number|null", "writeback": true } }, "extension": { "_WRITEBACK_PROPS": ["messagesCustom", "valid", "value"], "_READ_ONLY_PROPS": ["valid"], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "id"] }, "methods": { "blur": {}, "focus": {}, "showMessages": {}, "reset": {}, "validate": {} } }, { "displayOptions": { "messages": "display" }, "help": { "instruction": "" }, "helpHints": { "definition": "", "source": "" }, "disabled": false, "messagesCustom": [], "columnSpan": 1, "readonlyUserAssistanceShown": "none", "required": false }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
    const RichRadioset = RichRadiosetWithoutDefaultedGenerics;
    exports.RichRadioset = RichRadioset;
});
