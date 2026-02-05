define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_SelectSingle", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormVariantContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/utils/UNSAFE_classNames", "@oracle/oraclejet-preact/utils/UNSAFE_styles/FormControl", "@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout", "oj-c/editable-value/UNSAFE_useAssistiveText/useAssistiveText", "oj-c/hooks/UNSAFE_useMergedFormContext/useMergedFormContext", "ojs/ojvcomponent", "preact/compat", "preact/hooks", "./useSelectSinglePreact", "ojs/ojcontext", "@oracle/oraclejet-preact/UNSAFE_TextField", "@oracle/oraclejet-preact/hooks/UNSAFE_useComponentTheme", "css!oj-c/select-single/select-single-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_SelectSingle_1, UNSAFE_useFormContext_1, UNSAFE_useFormVariantContext_1, UNSAFE_useTabbableMode_1, UNSAFE_classNames_1, FormControl_1, Layout_1, useAssistiveText_1, useMergedFormContext_1, ojvcomponent_1, compat_1, hooks_1, useSelectSinglePreact_1, Context, UNSAFE_TextField_1, UNSAFE_useComponentTheme_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SelectSingle = void 0;
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
    /**
     * @classdesc
     * <h3 id="selectSingleOverview-section">
     *   JET Select Single
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#selectSingleOverview-section"></a>
     * </h3>
     * <p>Description: JET Select Single provides support for single-select and search filtering.</p>
     *
     * <p>A JET Select Single can be created with the following markup.</p>
     *
     * <pre class="prettyprint"><code>
     * &lt;oj-c-select-single data="[[dataProvider]]" item-text="label" label-hint="Select Single">
     * &lt;/oj-c-select-single>
     * </code></pre>
     *
     * <h4>Data</h4>
     * <p>The only way to provide data to JET Select Single is through a
     * <a href="DataProvider.html">DataProvider</a>. For cases with
     * a small set of fixed data, use an <a href="ArrayDataProvider.html">ArrayDataProvider</a>.</p>
     *
     * <h3 id="diff-section">
     *   Differences between Select and Combobox components
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#diff-section"></a>
     * </h3>
     *
     * <p>
     * oj-c-select-* components and oj-combobox-* components may look and feel similar,
     * but these components are different and are intended for very different use cases.
     * </p>
     *
     * <p>
     * While oj-c-select-* components allow a user to filter the data in the dropdown,
     * it is not possible to enter values that are not available in the data.
     * This makes oj-c-select-* components ideal for usecases where the user can only
     * select values that are available in the dropdown, but not provide custom
     * values of their own.
     * </p>
     *
     * <p>
     * In contrast, oj-combobox-* components allow a user to enter new values that are
     * not available in the data in addition to using the text field for filtering dropdown data.
     * This makes oj-combobox-* components ideal for usecases where the users can provide
     * custom values in addition to those that are already available in the dropdown data.
     * </p>
     *
     * <p>
     * Application developers should consider the above differences when choosing between
     * Select and Combobox components.
     * Additionally, applications are advised to use oj-c-select-single instead of oj-select-single.
     * </p>
     *
     * <h3 id="disableditems-section">
     *   Disabled Items
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#disableditems-section"></a>
     * </h3>
     *
     * <p>
     * Disabled items are not supported in oj-c-select-* components; items that aren't selectable
     * should be removed rather than shown as disabled. Keep in mind disabled items usually don't pass
     * contrast and therefore people with low vision can't see them, so for accessibility reasons
     * you can't use disabled for "meaningful content".
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
     *
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
     *       <td>Input field</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td> If the dropdown is not open, expand the dropdown list.
     *       If hints, title or messages exist in a notewindow,
     *        pop up the notewindow.</td>
     *     </tr>
     *     <tr>
     *       <td>Arrow button</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td> If the dropdown is not open, expand the dropdown list. Otherwise, close the dropdown list.</td>
     *     </tr>
     *     <tr>
     *       <td>Option item</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td> Tap on an option item in the dropdown list to select.</td>
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
     *       <td>Option item</td>
     *       <td><kbd>Enter or Space</kbd></td>
     *       <td> Select the highlighted choice from the dropdown and close the dropdown.</td>
     *     </tr>
     *     <tr>
     *       <td>Option item</td>
     *       <td><kbd>Tab</kbd></td>
     *       <td> Select the highlighted choice from the dropdown and transfer focus to the next
     *         tabbable element on the page.</td>
     *     </tr>
     *     <tr>
     *       <td>Input field</td>
     *       <td><kbd>Esc</kbd></td>
     *       <td> Collapse the dropdown list. If the dropdown is already closed, do nothing.</td>
     *     </tr>
     *     <tr>
     *       <td>Input field</td>
     *       <td><kbd>Enter</kbd></td>
     *       <td> If the selected value text has been deleted, clear the value and close the dropdown.
     *         If filtering, select the highlighted choice from the dropdown and close the
     *         dropdown.</td>
     *     </tr>
     *     <tr>
     *       <td>Input field</td>
     *       <td><kbd>Tab</kbd></td>
     *       <td> If the selected value text has been deleted, clear the value and transfer focus
     *         to the next tabbable element on the page. If filtering, select the highlighted choice
     *         from the dropdown and transfer focus to the next tabbable element on the page.</td>
     *     </tr>
     *     <tr>
     *       <td>Input field</td>
     *       <td><kbd>UpArrow or DownArrow</kbd></td>
     *       <td> If the dropdown is not open, expand the dropdown list.  Otherwise, transfer
     *         focus into the dropdown list.</td>
     *     </tr>
     *     <tr>
     *       <td>Dropdown</td>
     *       <td><kbd>UpArrow or DownArrow</kbd></td>
     *       <td> Highlight the option item in the dropdown list in the direction of the arrow.</td>
     *     </tr>
     *     <tr>
     *       <td>Dropdown</td>
     *       <td><kbd>Esc</kbd></td>
     *       <td> Collapse the dropdown list.</td>
     *     </tr>
     *     <tr>
     *       <td>Select</td>
     *       <td><kbd>Tab In</kbd></td>
     *       <td>Set focus to the Select. If hints, title or messages exist in a notewindow,
     *        pop up the notewindow.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <h3 id="perf-section">
     *   Performance
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#perf-section"></a>
     * </h3>
     *
     * <h4>Page Load</h4>
     * <p>If there is an initially selected value, setting the <a href="#valueItem">valueItem</a> attribute initially can improve page load performance because the element will not have to fetch the selected data from the data provider.</p>
     * <p>The dropdown data isn't fetched until the user opens the dropdown.</p>
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
     *
     * @ojmetadata displayName 'SelectSingle'
     * @ojmetadata description 'A select single is a dropdown list that supports single selection and search filtering.'
     * @ojmetadata help "oj-c.SelectSingle.html"
     * @ojmetadata main "oj-c/select-single"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "19.0.0",
     *     "value": ["oj-select-single"]
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Forms"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/select-single",
     *     "defaultColumns": 6,
     *     "minColumns": 2
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-select",
     *     "uxSpecs": [
     *       "select-single-items"
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
     *       "data",
     *       "itemText",
     *       "value",
     *       "valueItem"
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
    function SelectSingleImpl({ 
    // addToList: 'off',
    advancedSearch = 'off', columnSpan = 1, containerReadonly: propContainerReadonly, data = null, disabled = false, displayOptions = displayOptionsDefault, help = helpDefault, helpHints = helpHintsDefault, id, labelWrapping: propLabelWrapping, matchBy = null, messagesCustom = messagesCustomDefault, readonly: propReadonly, readonlyUserAssistanceShown = 'none', required = false, textAlign: propTextAlign, userAssistanceDensity: propUserAssistanceDensity, value = null, valueItem = null, virtualKeyboard = 'auto', ...otherProps }, ref) {
        const rootRef = (0, hooks_1.useRef)();
        const selectSingleRef = (0, hooks_1.useRef)();
        const addBusyState = (0, hooks_1.useCallback)((desc) => {
            return rootRef.current
                ? Context.getContext(rootRef.current)
                    .getBusyContext()
                    .addBusyState({ description: `oj-c-select-single id=${id}: ${desc}` })
                : () => { }; // if the component is not mounted return Noop
        }, [id]);
        const { containerProps, uadValue, readonlyValue } = (0, useMergedFormContext_1.useMergedFormContext)({
            propContainerReadonly,
            propLabelWrapping,
            propReadonly,
            propUserAssistanceDensity,
            propTextAlign
        });
        const { selectSingleProps, methods, 
        /*_doAddToListAction,*/ _doAdvancedSearchAction, _selectItemByValue } = (0, useSelectSinglePreact_1.useSelectSinglePreact)({
            advancedSearch,
            data,
            disabled,
            displayOptions,
            matchBy,
            messagesCustom,
            readonly: readonlyValue,
            readonlyUserAssistanceShown,
            required,
            userAssistanceDensity: uadValue,
            value,
            valueItem,
            virtualKeyboard,
            ...otherProps
        }, addBusyState);
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => selectSingleRef.current?.blur(),
            focus: () => selectSingleRef.current?.focus(),
            //_doAddToListAction,
            _doAdvancedSearchAction,
            _selectItemByValue,
            UNSAFE_focusAndOpenDropdown: () => {
                // JET-70461 - Add a new method for automatically disclosing select options
                // Dispatch mousedown on the SelectSingleField container element. This will be the first child
                // of the custom element. The event handler that listens to the mouse down and opens the dropdown
                // is attached to this element. So, dispatching the mousedown on this element will focus the field
                // and also opens the dropdown at the same time.
                // We do not need to check for readonly/disabled, as we only add the mousedown event listener when
                // the component is enabled. So, in readonly/disabled this will be a no-op.
                if (rootRef.current) {
                    const rootElem = rootRef.current;
                    const run = () => rootElem.firstElementChild?.dispatchEvent(new MouseEvent('mousedown'));
                    const busyContext = Context.getContext(rootElem).getBusyContext();
                    busyContext.whenReady().then(run);
                }
            },
            ...methods
        }), [methods, /*_doAddToListAction,*/ _doAdvancedSearchAction, _selectItemByValue]);
        const assistiveTextProps = (0, useAssistiveText_1.useAssistiveText)({
            displayOptions,
            help,
            helpHints,
            userAssistanceDensity: selectSingleProps.userAssistanceDensity
        });
        const variant = (0, UNSAFE_useFormVariantContext_1.useFormVariantContext)();
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
        // The layoutSpanColumn style class needs to be applied to the root dom element, otherwise the
        // css grid will ignore it.
        (0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: id, ref: rootRef, class: rootClasses, ...styleProps, "data-oj-renders-label": true, children: (0, jsx_runtime_1.jsx)(UNSAFE_useFormContext_1.FormContext.Provider, { value: containerProps, children: (0, jsx_runtime_1.jsx)(UNSAFE_SelectSingle_1.SelectSingle, { ref: selectSingleRef, ...assistiveTextProps, ...selectSingleProps, columnSpan: columnSpan, variant: variant }) }) }));
    }
    // This custom element supports generic parameters, but was introduced before the pattern for exposing
    // generic parameters on the functional value-based element was established.  In order to introduce the generics in
    // a backwards-compatible way, they must be defaulted, but we don't want the defaults to be added to the existing
    // types which had generics from the start.  The solution is to use two consts:
    //   * the first is not exported, but is used as the basis for the custom element types and does not default its generics
    //   * the second is the exported functional value-based element and defaults the generics for backwards compatibility
    const SelectSingleWithoutDefaultedGenerics = (0, ojvcomponent_1.registerCustomElement)('oj-c-select-single', (0, compat_1.forwardRef)(SelectSingleImpl), "SelectSingle", { "properties": { "advancedSearch": { "type": "string", "enumValues": ["off", "on"] }, "columnSpan": { "type": "number" }, "containerReadonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "data": { "type": "DataProvider|null" }, "disabled": { "type": "boolean" }, "displayOptions": { "type": "object", "properties": { "messages": { "type": "string", "enumValues": ["none", "display"] } } }, "help": { "type": "object", "properties": { "instruction": { "type": "string" } } }, "helpHints": { "type": "object", "properties": { "definition": { "type": "string" }, "source": { "type": "string" }, "sourceText": { "type": "string" } } }, "itemText": { "type": "string|number|function" }, "labelEdge": { "type": "string", "enumValues": ["none", "start", "top", "inside"], "binding": { "consume": { "name": "containerLabelEdge" } } }, "labelHint": { "type": "string" }, "labelStartWidth": { "type": "number|string", "binding": { "consume": { "name": "labelWidth" } } }, "labelWrapping": { "type": "string", "enumValues": ["truncate", "wrap"], "binding": { "consume": { "name": "labelWrapping" } } }, "matchBy": { "type": "Array<string>|null" }, "maxWidth": { "type": "number|string" }, "messagesCustom": { "type": "Array<object>", "writeback": true }, "placeholder": { "type": "string" }, "readonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "readonlyUserAssistanceShown": { "type": "string", "enumValues": ["none", "confirmationAndInfoMessages"] }, "required": { "type": "boolean" }, "requiredMessageDetail": { "type": "string" }, "textAlign": { "type": "string", "enumValues": ["end", "start", "right"] }, "userAssistanceDensity": { "type": "string", "enumValues": ["compact", "reflow", "efficient"], "binding": { "consume": { "name": "containerUserAssistanceDensity" } } }, "value": { "type": "string|number|null", "writeback": true }, "valueItem": { "type": "object|null", "properties": { "data": { "type": "any" }, "key": { "type": "string|number" }, "metadata": { "type": "object", "properties": { "indexFromParent": { "type": "number" }, "isLeaf": { "type": "boolean" }, "key": { "type": "string|number" }, "message": { "type": "object", "properties": { "detail": { "type": "string" }, "severity": { "type": "string|number" }, "summary": { "type": "string" } } }, "parentKey": { "type": "string|number" }, "suggestion": { "type": "object" }, "treeDepth": { "type": "number" } } } }, "writeback": true }, "virtualKeyboard": { "type": "string", "enumValues": ["number", "search", "auto", "url", "text", "email", "tel"] }, "width": { "type": "number|string" }, "valid": { "type": "string", "enumValues": ["pending", "valid", "invalidHidden", "invalidShown"], "readOnly": true, "writeback": true } }, "slots": { "collectionTemplate": { "data": {} }, "itemTemplate": { "data": {} } }, "events": { "ojAdvancedSearchAction": {}, "ojValueAction": {} }, "extension": { "_WRITEBACK_PROPS": ["messagesCustom", "valid", "value", "valueItem"], "_READ_ONLY_PROPS": ["valid"], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "id"] }, "methods": { "blur": {}, "focus": {}, "showMessages": {}, "reset": {}, "validate": {}, "_doAdvancedSearchAction": {}, "_selectItemByValue": {}, "UNSAFE_focusAndOpenDropdown": {} } }, { "advancedSearch": "off", "columnSpan": 1, "data": null, "disabled": false, "displayOptions": { "messages": "display" }, "help": { "instruction": "" }, "helpHints": { "definition": "", "source": "" }, "matchBy": null, "messagesCustom": [], "readonlyUserAssistanceShown": "none", "required": false, "value": null, "valueItem": null, "virtualKeyboard": "auto" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useFormContext_1.FormContext, UNSAFE_useFormVariantContext_1.FormVariantContext, UNSAFE_useTabbableMode_1.TabbableModeContext] });
    exports.SelectSingle = SelectSingleWithoutDefaultedGenerics;
});
