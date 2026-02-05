define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_LabelledLink", "@oracle/oraclejet-preact/hooks/UNSAFE_useAccessibleContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useFormContext", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/utils/UNSAFE_styles/Layout", "ojs/ojvcomponent", "preact/compat", "preact/hooks", "../utils/UNSAFE_focusTabUtils/index", "./useLabelledLinkPreact", "css!oj-c/labelled-link/labelled-link-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_LabelledLink_1, UNSAFE_useAccessibleContext_1, UNSAFE_useFormContext_1, UNSAFE_useTabbableMode_1, Layout_1, ojvcomponent_1, compat_1, hooks_1, index_1, useLabelledLinkPreact_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LabelledLink = void 0;
    /**
     * @classdesc
     * <h3 id="labelledLinkOverview-section">
     *   JET LabelledLink
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#labelledLinkOverview-section"></a>
     * </h3>
     *
     * <p>
     * Description: LabelledLink component can be used to render a readonly form control
     * field that has a link for its content.
     * </p>
     *
     * <pre class="prettyprint"><code>
     * &lt;oj-c-labelled-link
     *   href="www.oracle.com"
     *   text="Website"
     *   label-hint="Labelled Link">
     * &lt;/oj-c-linked-link>
     * </code></pre>
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
     *       <td>Link</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Sets focus to the link. Opens the link or invokes the ojAction event.</td>
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
     *       <td>Link</td>
     *       <td><kbd>Tab In</kbd></td>
     *       <td>Set focus to the link.</td>
     *     </tr>
     *
     *      <tr>
     *       <td>Link</td>
     *       <td><kbd>Enter</kbd></td>
     *       <td>Opens the link or invokes the ojAction event.</td>
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
     * which renders a visually hidden and screen-reader accessible label.
     * </p>
     *
     * @ojmetadata displayName "LabelledLink"
     * @ojmetadata description "The Labelled Link component displays a readonly field that has a link for its content."
     * @ojmetadata help "oj-c.LabelledLink.html"
     * @ojmetadata main "oj-c/labelled-link"
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
     *     "module": "oj-c/labelled-link",
     *     "defaultColumns": 6,
     *     "minColumns": 2,
     *     "componentPalette": {
     *       "visibility": "never"
     *     },
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-link",
     *     "uxSpecs": [
     *       "input-text"
     *     ]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "labelHint",
     *       "textAlign"
     *     ]
     *   },
     *   {
     *     "propertyGroup": "data",
     *     "items": [
     *       "href",
     *       "target",
     *       "text"
     *     ]
     *   }
     * ]
     * @ojmetadata since "16.0.0"
     */
    const LabelledLinkImpl = (props, ref) => {
        // add the needed form context to allow for mixed readonly
        const containerProps = {
            isFormLayout: props.containerReadonly !== undefined,
            isReadonly: props.containerReadonly,
            labelWrapping: props.labelWrapping
        };
        // JET-52089: temporarily add support for unsafe_labelledBy and pass it through context
        const accessibleProps = {
            UNSAFE_ariaLabelledBy: props.unsafe_labelledBy
        };
        // get the preact component props
        const preactProps = (0, useLabelledLinkPreact_1.useLabelledLinkPreact)(props);
        // ref for the root element
        const rootRef = (0, hooks_1.useRef)(null);
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => {
                if (rootRef.current?.contains(document.activeElement)) {
                    document.activeElement.blur();
                }
            },
            focus: () => (0, index_1.focusFirstTabStop)(rootRef.current)
        }));
        const { columnSpan = 1 } = props;
        // layoutSpanColumn style class needs to be applied to the root dom element,
        // otherwise the css grid will ignore it.
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, class: Layout_1.layoutSpanStyles.layoutSpanColumn[columnSpan], "data-oj-renders-label": true, children: (0, jsx_runtime_1.jsx)(UNSAFE_useFormContext_1.FormContext.Provider, { value: containerProps, children: (0, jsx_runtime_1.jsx)(UNSAFE_useAccessibleContext_1.AccessibleContext.Provider, { value: accessibleProps, children: (0, jsx_runtime_1.jsx)(UNSAFE_LabelledLink_1.LabelledLink, { ...preactProps, columnSpan: columnSpan }) }) }) }));
    };
    exports.LabelledLink = (0, ojvcomponent_1.registerCustomElement)('oj-c-labelled-link', (0, compat_1.forwardRef)(LabelledLinkImpl), "LabelledLink", { "properties": { "columnSpan": { "type": "number" }, "containerReadonly": { "type": "boolean", "binding": { "consume": { "name": "containerReadonly" } } }, "href": { "type": "string" }, "labelEdge": { "type": "string", "enumValues": ["none", "start", "top", "inside"], "binding": { "consume": { "name": "containerLabelEdge" } } }, "labelHint": { "type": "string" }, "labelStartWidth": { "type": "number|string", "binding": { "consume": { "name": "labelWidth" } } }, "labelWrapping": { "type": "string", "enumValues": ["truncate", "wrap"], "binding": { "consume": { "name": "labelWrapping" } } }, "target": { "type": "string" }, "text": { "type": "string" }, "textAlign": { "type": "string", "enumValues": ["end", "start", "right"] }, "unsafe_labelledBy": { "type": "string" }, "userAssistanceDensity": { "type": "string", "enumValues": ["compact", "reflow", "efficient"], "binding": { "consume": { "name": "containerUserAssistanceDensity" } } } }, "events": { "ojAction": {} }, "extension": { "_OBSERVED_GLOBAL_PROPS": ["aria-describedby"] }, "methods": { "blur": {}, "focus": {} } }, undefined, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, {
        consume: [UNSAFE_useTabbableMode_1.TabbableModeContext]
    });
});
