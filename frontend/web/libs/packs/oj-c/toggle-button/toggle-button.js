define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent", "@oracle/oraclejet-preact/UNSAFE_ToggleButton", "@oracle/oraclejet-preact/UNSAFE_IconToggleButton", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/hooks/UNSAFE_useTooltip", "@oracle/oraclejet-preact/utils/UNSAFE_mergeProps", "preact/hooks", "preact/compat", "css!oj-c/button/button-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, ojvcomponent_1, UNSAFE_ToggleButton_1, UNSAFE_IconToggleButton_1, UNSAFE_useTabbableMode_1, UNSAFE_useTooltip_1, UNSAFE_mergeProps_1, hooks_1, compat_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ToggleButton = void 0;
    /**
     * @classdesc
     * <h3 id="toggleButtonOverview-section">
     *   JET ToggleButton
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#toggleButtonOverview-section"></a>
     * </h3>
     *
     * <p>Description: Themeable, WAI-ARIA-compliant toggle button, with appropriate styles for hover, active, and disabled.
     *
     * <pre class="prettyprint"><code>&lt;oj-c-toggle-button id="myToggleButton" value="{{value}}" label="My ToggleButton">
     * &lt;/oj-c-toggle-button>
     * &lt;oj-c-toggle-button label="start icon">
     *   &lt;span slot='startIcon' class='myIconClass'>&lt;/span>
     * &lt;/oj-c-toggle-button>
     *  &lt;oj-c-toggle-button label="end icon">
     *   &lt;span slot='endIcon' class='myIconClass'>&lt;/span>
     * &lt;/oj-c-toggle-button>
     * </code></pre>
     *
     * <h3 id="toggleButtons-section">
     *   Toggle Buttons
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#pushToggleButtons-section"></a>
     * </h3>
     *
     * <p>Toggle Buttons allow users to switch between states when clicked or tapped.
     * Toggle buttons are created from <code class="prettyprint">oj-c-toggle-button</code> elements.
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
     *       <td>Push ToggleButton</td>
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
     *       <td>Push Toggle Button</td>
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
     * @ojmetadata description "Toggle Buttons allow users to switch between states when clicked or tapped."
     * @ojmetadata displayName "Toggle Button"
     * @ojmetadata help "oj-c.ToggleButton.html"
     * @ojmetadata main "oj-c/toggle-button"
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Controls"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/toggle-button",
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-button",
     *     "uxSpecs": [
     *       "Toggle%20Button"
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
     *       "disabled"
     *     ]
     *   }
     * ]
     * @ojmetadata since "17.0.0"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "17.0.0",
     *     "value": ["oj-buttonset-many"]
     *   }
     * ]
     */
    function ToggleButtonImpl({ chroming = 'outlined', disabled = false, 'aria-label': accessibleLabel, 'aria-describedby': ariaDescribedBy, width, display = 'all', value = false, label, tooltip, startIcon, endIcon, size = 'md', onValueChanged }, ref) {
        const rootRef = (0, hooks_1.useRef)();
        const buttonRef = (0, hooks_1.useRef)(null);
        const isLabelButton = display != 'icons' ||
            (startIcon && endIcon && display == 'icons') ||
            (!startIcon && !endIcon && display == 'icons');
        const widthProps = width ? { style: { width } } : {};
        const ariaProps = { 'aria-describedby': ariaDescribedBy, 'aria-label': accessibleLabel };
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => buttonRef.current?.blur(),
            focus: () => buttonRef.current?.focus(),
            click: () => buttonRef.current?.click()
        }), []);
        if (isLabelButton) {
            return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, ...widthProps, "aria-describedby": ariaDescribedBy, children: (0, jsx_runtime_1.jsx)(FunctionalToggleButton, { ref: buttonRef, isSelected: value, tooltip: tooltip, onToggle: () => {
                        onValueChanged?.(!value);
                    }, variant: chroming, isDisabled: disabled, width: width ? '100%' : undefined, startIcon: startIcon, endIcon: endIcon, size: size, label: display == 'icons' ? (!startIcon && !endIcon ? label : '') : label, display: display != 'icons' ? display : 'all', ...ariaProps }) }));
        }
        else {
            return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, ...widthProps, "aria-describedby": ariaDescribedBy, children: (0, jsx_runtime_1.jsx)(UNSAFE_IconToggleButton_1.IconToggleButton, { isSelected: value, onToggle: () => {
                        onValueChanged?.(!value);
                    }, width: width ? '100%' : undefined, ref: buttonRef, variant: chroming, isDisabled: disabled, tooltip: tooltip && tooltip !== '' ? tooltip : label, "aria-label": accessibleLabel && accessibleLabel !== '' ? accessibleLabel : label, "aria-describedby": ariaDescribedBy, size: size, children: startIcon ?? endIcon }) }));
        }
    }
    exports.ToggleButton = (0, ojvcomponent_1.registerCustomElement)('oj-c-toggle-button', (0, compat_1.forwardRef)(ToggleButtonImpl), "ToggleButton", { "properties": { "label": { "type": "string" }, "value": { "type": "boolean", "writeback": true }, "tooltip": { "type": "string" }, "disabled": { "type": "boolean" }, "width": { "type": "number|string" }, "display": { "type": "string", "enumValues": ["all", "label", "icons"] }, "size": { "type": "string", "enumValues": ["sm", "md", "lg"] }, "chroming": { "type": "string", "enumValues": ["borderless", "outlined"], "binding": { "consume": { "name": "containerChroming" } } } }, "slots": { "startIcon": {}, "endIcon": {} }, "extension": { "_WRITEBACK_PROPS": ["value"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "aria-label"] }, "methods": { "focus": {}, "blur": {}, "click": {} } }, { "chroming": "outlined", "disabled": false, "display": "all", "value": false, "size": "md" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
    const FunctionalToggleButton = (0, compat_1.forwardRef)((props, ref) => {
        const { tooltipContent, tooltipProps } = (0, UNSAFE_useTooltip_1.useTooltip)({
            text: props.tooltip,
            isDisabled: props.isDisabled
        });
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(UNSAFE_ToggleButton_1.ToggleButton, { ref: ref, ...(0, UNSAFE_mergeProps_1.mergeProps)(props, tooltipProps) }), tooltipContent] }));
    });
});
