define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent", "@oracle/oraclejet-preact/UNSAFE_Button", "@oracle/oraclejet-preact/UNSAFE_IconButton", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/hooks/UNSAFE_useTooltip", "@oracle/oraclejet-preact/utils/UNSAFE_mergeProps", "preact/hooks", "preact/compat", "css!oj-c/button/button-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, ojvcomponent_1, UNSAFE_Button_1, UNSAFE_IconButton_1, UNSAFE_useTabbableMode_1, UNSAFE_useTooltip_1, UNSAFE_mergeProps_1, hooks_1, compat_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Button = void 0;
    /**
     * @classdesc
     * <h3 id="buttonOverview-section">
     *   JET Button
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#buttonOverview-section"></a>
     * </h3>
     *
     * <p>Description: Themeable, WAI-ARIA-compliant push buttons, with appropriate styles for hover, active, and disabled.
     *
     * <pre class="prettyprint"><code>&lt;oj-c-button id="myButton" label="My Button">
     * &lt;/oj-c-button>
     * &lt;oj-c-button label="start icon">
     *   &lt;span slot='startIcon' class='myIconClass'>&lt;/span>
     * &lt;/oj-c-button>
     *  &lt;oj-c-button label="end icon">
     *   &lt;span slot='endIcon' class='myIconClass'>&lt;/span>
     * &lt;/oj-c-button>
     * </code></pre>
     *
     * <h3 id="pushButtons-section">
     *   Push Buttons
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pushButtons-section"></a>
     * </h3>
     *
     * <p>Push buttons are ordinary buttons that do not stay pressed in when clicked.
     * Push buttons are created from <code class="prettyprint">oj-c-button</code> elements.
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
     *       <td>Push Button</td>
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
     *       <td>Push Button</td>
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
     * @ojmetadata description "Buttons direct users to initiate or take actions and work with a single tap, click, or keystroke."
     * @ojmetadata displayName "Button"
     * @ojmetadata help "oj-c.Button.html"
     * @ojmetadata main "oj-c/button"
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Controls"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/button",
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
     *       "size",
     *       "width",
     *       "edge",
     *       "disabled"
     *     ]
     *   }
     * ]
     * @ojmetadata since "13.0.0"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "15.0.0",
     *     "value": ["oj-button"]
     *   }
     * ]
     */
    function ButtonImpl({ chroming = 'outlined', disabled = false, size = 'md', display = 'all', endIcon, startIcon, edge = 'none', tooltip, width, label, onOjAction, 'aria-label': accessibleLabel, 'aria-describedby': ariaDescribedBy, ...otherProps }, ref) {
        const rootRef = (0, hooks_1.useRef)();
        const buttonRef = (0, hooks_1.useRef)(null);
        const isLabelButton = display != 'icons' ||
            (startIcon && endIcon && display == 'icons') ||
            (!startIcon && !endIcon && display == 'icons');
        const widthSize = { width: edge === 'bottom' ? '100%' : width };
        const widthProps = width || edge !== 'none' ? { style: widthSize } : {};
        const ariaProps = { 'aria-describedby': ariaDescribedBy, 'aria-label': accessibleLabel };
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => buttonRef.current?.blur(),
            focus: () => buttonRef.current?.focus(),
            click: () => buttonRef.current?.click()
        }), []);
        if (isLabelButton) {
            return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, ...widthProps, "aria-describedby": ariaDescribedBy, children: (0, jsx_runtime_1.jsx)(FunctionalButton, { ref: buttonRef, type: "submit", variant: chroming, tooltip: tooltip, isDisabled: disabled, width: '100%', onAction: onOjAction, startIcon: startIcon, endIcon: endIcon, size: size, label: display == 'icons' ? (!startIcon && !endIcon ? label : '') : label, display: display != 'icons' ? display : 'all', ...ariaProps, ...otherProps }) }));
        }
        else {
            return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, ...widthProps, "aria-describedby": ariaDescribedBy, children: (0, jsx_runtime_1.jsx)(UNSAFE_IconButton_1.IconButton, { width: '100%', ref: buttonRef, type: "submit", variant: chroming, isDisabled: disabled, tooltip: tooltip && tooltip !== '' ? tooltip : label, onAction: onOjAction, "aria-label": accessibleLabel && accessibleLabel !== '' ? accessibleLabel : label, "aria-describedby": ariaDescribedBy, size: size, ...otherProps, children: startIcon ?? endIcon }) }));
        }
    }
    exports.Button = (0, ojvcomponent_1.registerCustomElement)('oj-c-button', (0, compat_1.forwardRef)(ButtonImpl), "Button", { "properties": { "label": { "type": "string" }, "tooltip": { "type": "string" }, "disabled": { "type": "boolean" }, "width": { "type": "number|string" }, "display": { "type": "string", "enumValues": ["all", "label", "icons"] }, "size": { "type": "string", "enumValues": ["sm", "md", "lg", "xs"] }, "edge": { "type": "string", "enumValues": ["none", "bottom"] }, "chroming": { "type": "string", "enumValues": ["solid", "borderless", "outlined", "ghost", "callToAction", "danger"], "binding": { "consume": { "name": "containerChroming" } } } }, "slots": { "startIcon": {}, "endIcon": {} }, "events": { "ojAction": { "bubbles": true } }, "extension": { "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "aria-label"] }, "methods": { "focus": {}, "blur": {}, "click": {} } }, { "chroming": "outlined", "disabled": false, "size": "md", "display": "all", "edge": "none" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
    const FunctionalButton = (0, compat_1.forwardRef)((props, ref) => {
        const { tooltipContent, tooltipProps } = (0, UNSAFE_useTooltip_1.useTooltip)({
            text: props.tooltip,
            isDisabled: props.isDisabled
        });
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(UNSAFE_Button_1.Button, { ref: ref, ...(0, UNSAFE_mergeProps_1.mergeProps)(props, tooltipProps) }), tooltipContent] }));
    });
});
