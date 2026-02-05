define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent", "@oracle/oraclejet-preact/UNSAFE_ProgressButton", "@oracle/oraclejet-preact/UNSAFE_IconProgressButton", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/hooks/UNSAFE_useTooltip", "@oracle/oraclejet-preact/utils/UNSAFE_mergeProps", "preact/hooks", "preact/compat", "css!oj-c/progress-button/progress-button-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, ojvcomponent_1, UNSAFE_ProgressButton_1, UNSAFE_IconProgressButton_1, UNSAFE_useTabbableMode_1, UNSAFE_useTooltip_1, UNSAFE_mergeProps_1, hooks_1, compat_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProgressButton = void 0;
    /**
     * @classdesc
     * <h3 id="progressButtonOverview-section">
     *   JET Progress Button
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#progressButtonOverview-section"></a>
     * </h3>
     *
     * <p>Description: A Progress button represents button-level action initiation.
     *
     * <pre class="prettyprint"><code>&lt;oj-c-progress-button id="myButton" label="My Button">
     * &lt;/oj-c-progress-button>
     * &lt;oj-c-progress-button label="start icon" is-loading="[[loading]]" on-oj-action="[[handler]]" >
     *   &lt;span slot='startIcon' class='myIconClass'>&lt;/span>
     * &lt;/oj-c-progress-button>
     * </code></pre>
     *
     * <h3 id="progressButtons-section">
     *   Progress Buttons
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#progressButtons-section"></a>
     * </h3>
     *
     * <p>Progress buttons communicate
     * button-level initiation of an indeterminate action with a typical progress span of less
     * than 8 seconds.  They reflect a user's brief interaction with a button.
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
     *       <td>Progress Button</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Push the button.</td>
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
     *       <td>Progress Button</td>
     *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
     *       <td>Push the button.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>For accessibility, it is not required to set an aria label on a JET button as it uses the label text to generate an aria label.
     * Therefore the label should be specified even if the button is <a href="#display">icon-only (display=icons)</a>. However,
     * you can override the default behavior by setting <code class="prettyprint">aria-label</code>.
     * The label can be hidden using the display attribute.
     *
     * {@include accessibility_doc.ts#a11y-section-disabled-content}
     *
     * @ojmetadata description "A Progress button represents button-level initiation."
     * @ojmetadata displayName "Progress Button"
     * @ojmetadata help "oj-c.ProgressButton.html"
     * @ojmetadata main "oj-c/progress-button"
     * @ojmetadata since "17.1.0"
     * @ojmetadata status [
     *   {
     *     "type": "production",
     *     "since": "17.1.0"
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Controls"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/progress-button",
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-button",
     *     "uxSpecs": [
     *       "button"
     *     ]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "label",
     *       "tooltip",
     *       "display",
     *       "chroming",
     *       "isloading",
     *       "size",
     *       "width",
     *       "edge",
     *       "disabled"
     *     ]
     *   }
     * ]
     */
    function ProgressButtonImpl({ chroming = 'outlined', disabled = false, size = 'md', display = 'all', startIcon, edge = 'none', tooltip, isLoading, width, label, onOjAction, ...otherProps }, ref) {
        const rootRef = (0, hooks_1.useRef)();
        const buttonRef = (0, hooks_1.useRef)(null);
        const isLabelButton = display != 'icons' || (!startIcon && display == 'icons');
        const widthSize = { width: edge === 'bottom' ? '100%' : width };
        const widthProps = width || edge !== 'none' ? { style: widthSize } : {};
        const ariaProps = { 'aria-label': label };
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => buttonRef?.current?.blur(),
            focus: () => buttonRef?.current?.focus(),
            click: () => buttonRef?.current?.click()
        }), []);
        if (isLabelButton) {
            return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, ...widthProps, children: (0, jsx_runtime_1.jsx)(FunctionalProgressButton, { ref: buttonRef, type: "submit", variant: chroming, isDisabled: disabled, width: '100%', onAction: onOjAction, startIcon: startIcon, isLoading: isLoading, size: size, label: display == 'icons' ? (!startIcon ? label : '') : label, display: display != 'icons' ? display : 'all', ...otherProps }) }));
        }
        else {
            return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, ...widthProps, children: (0, jsx_runtime_1.jsx)(UNSAFE_IconProgressButton_1.IconProgressButton, { width: '100%', ref: buttonRef, type: "submit", variant: chroming, isDisabled: disabled, isLoading: isLoading, tooltip: label, onAction: onOjAction, size: size, ...ariaProps, ...otherProps, children: startIcon }) }));
        }
    }
    exports.ProgressButton = (0, ojvcomponent_1.registerCustomElement)('oj-c-progress-button', (0, compat_1.forwardRef)(ProgressButtonImpl), "ProgressButton", { "properties": { "label": { "type": "string" }, "tooltip": { "type": "string" }, "disabled": { "type": "boolean" }, "isLoading": { "type": "boolean" }, "width": { "type": "number|string" }, "display": { "type": "string", "enumValues": ["all", "label", "icons"] }, "size": { "type": "string", "enumValues": ["sm", "md", "lg"] }, "edge": { "type": "string", "enumValues": ["none", "bottom"] }, "chroming": { "type": "string", "enumValues": ["solid", "borderless", "outlined", "callToAction"], "binding": { "consume": { "name": "containerChroming" } } } }, "slots": { "startIcon": {} }, "events": { "ojAction": { "bubbles": true } }, "methods": { "focus": {}, "blur": {}, "click": {} } }, { "chroming": "outlined", "disabled": false, "size": "md", "display": "all", "edge": "none" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
    const FunctionalProgressButton = (0, compat_1.forwardRef)((props, ref) => {
        const { tooltipContent, tooltipProps } = (0, UNSAFE_useTooltip_1.useTooltip)({
            text: props.tooltip,
            isDisabled: props.isDisabled
        });
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(UNSAFE_ProgressButton_1.ProgressButton, { ref: ref, ...(0, UNSAFE_mergeProps_1.mergeProps)(props, tooltipProps) }), tooltipContent] }));
    });
});
