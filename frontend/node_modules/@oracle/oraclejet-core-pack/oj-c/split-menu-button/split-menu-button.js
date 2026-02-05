define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent", "@oracle/oraclejet-preact/UNSAFE_SplitMenuButton", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/hooks/UNSAFE_useTooltip", "@oracle/oraclejet-preact/utils/UNSAFE_mergeProps", "../utils/PRIVATE_ItemsMenu/items-menu", "preact/hooks", "preact/compat", "css!oj-c/split-menu-button/split-menu-button-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, ojvcomponent_1, UNSAFE_SplitMenuButton_1, UNSAFE_useTabbableMode_1, UNSAFE_useTooltip_1, UNSAFE_mergeProps_1, items_menu_1, hooks_1, compat_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SplitMenuButton = void 0;
    /**
     * @classdesc
     * <h3 id="splitMenuButtonOverview-section">
     *   JET Split Menu Button
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#buttonOverview-section"></a>
     * </h3>
     *
     * <p>Description: A Split Menu Button combines a push button and menu button.
     *
     * <pre class="prettyprint"><code>&lt;oj-c-split-menu-button label="Copy" onAction="[[action]]" items="[[items]]">
     * &lt;/oj-c-split-menu-button>
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
     *       <td>Button</td>
     *       <td><kbd>Tap on action side</kbd></td>
     *       <td>Invoke the action.</td>
     *     </tr>
     *     <tr>
     *       <td>Button</td>
     *       <td><kbd>Tap on menu side</kbd></td>
     *       <td>Invoke the menu.</td>
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
     *       <td>Split Menu Button</td>
     *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
     *       <td>Invoke the Button action.</td>
     *     </tr>
     *     <tr>
     *       <td>Split Menu Button</td>
     *       <td><kbd>Down Arrow</kbd></td>
     *       <td>Invoke the Button menu.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>For accessibility, the label is used as the accessible aria label.  This is required
     * as persistent split menu buttons modify the label depending on the last menu item selection.
     *
     * <p>oj-c-split-menu-button follows the ARIA Authoring Practices Guide patterns for
     * <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/">menu</a> and
     * <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/">menu button</a>.
     * Note that this is an implementation detail that may change in the future.
     *
     * {@include accessibility_doc.ts#a11y-section-disabled-content}
     *
     * @ojmetadata description "A Split Menu Button combines a push button and menu button."
     * @ojmetadata displayName "Split Menu Button"
     * @ojmetadata help "oj-c.SplitMenuButton.html"
     * @ojmetadata main "oj-c/split-menu-button"
     * @ojmetadata status [
     *   {
     *     type: "production",
     *     since: "17.0.0"
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Controls"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/split-menu-button",
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-menu-button",
     *     "uxSpecs": [
     *       "menu-button"
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
     *   },
     *   {
     *     "propertyGroup": "data",
     *     "items": [
     *       "items"
     *     ]
     *   }
     * ]
     * @ojmetadata since "14.0.0"
     */
    function SplitMenuButtonImpl({ label, chroming = 'outlined', disabled = false, size = 'md', items = [], width, tooltip, onOjMenuAction, onOjAction, 'aria-describedby': ariaDescribedBy, ...otherProps }, ref) {
        const rootRef = (0, hooks_1.useRef)();
        const buttonRef = (0, hooks_1.useRef)(null);
        const widthSize = width ? { width: width } : {};
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => buttonRef.current?.blur(),
            focus: () => buttonRef.current?.focus(),
            click: () => buttonRef.current?.click()
        }), [buttonRef]);
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { style: widthSize, ref: rootRef, children: (0, jsx_runtime_1.jsx)(FunctionalSplitMenuButton, { tooltip: tooltip, label: label, ref: buttonRef, variant: chroming, size: size, width: '100%', "aria-describedby": ariaDescribedBy, isDisabled: disabled, onAction: onOjAction, ...otherProps, children: (0, jsx_runtime_1.jsx)(items_menu_1.ItemsMenu, { isSplitMenu: true, items: items, onOjMenuAction: onOjMenuAction }) }) }));
    }
    exports.SplitMenuButton = (0, ojvcomponent_1.registerCustomElement)('oj-c-split-menu-button', (0, compat_1.forwardRef)(SplitMenuButtonImpl), "SplitMenuButton", { "properties": { "label": { "type": "string" }, "items": { "type": "Array<object>" }, "tooltip": { "type": "string" }, "disabled": { "type": "boolean" }, "size": { "type": "string", "enumValues": ["sm", "md", "lg"] }, "width": { "type": "number|string" }, "chroming": { "type": "string", "enumValues": ["solid", "outlined", "callToAction"], "binding": { "consume": { "name": "containerChroming" } } } }, "events": { "ojMenuAction": { "bubbles": true }, "ojAction": { "bubbles": true } }, "extension": { "_OBSERVED_GLOBAL_PROPS": ["aria-describedby"] }, "methods": { "focus": {}, "blur": {}, "click": {} } }, { "chroming": "outlined", "disabled": false, "size": "md", "items": [] }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
    const FunctionalSplitMenuButton = (0, compat_1.forwardRef)((props, ref) => {
        const { tooltipContent, tooltipProps } = (0, UNSAFE_useTooltip_1.useTooltip)({
            text: props.tooltip,
            isDisabled: props.isDisabled
        });
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(UNSAFE_SplitMenuButton_1.SplitMenuButton, { ref: ref, ...(0, UNSAFE_mergeProps_1.mergeProps)(props, tooltipProps) }), tooltipContent] }));
    });
});
