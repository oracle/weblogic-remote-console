define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent", "@oracle/oraclejet-preact/UNSAFE_ButtonSetSingle", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "oj-c/utils/PRIVATE_toggleUtils/index", "@oracle/oraclejet-preact/UNSAFE_ButtonSetItem", "preact/compat", "preact/hooks", "css!oj-c/buttonset-single/buttonset-single-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, ojvcomponent_1, UNSAFE_ButtonSetSingle_1, UNSAFE_useTabbableMode_1, index_1, UNSAFE_ButtonSetItem_1, compat_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ButtonsetSingle = void 0;
    /**
     * @classdesc
     * <h3 id="ButtonsetSingleOverview-section">
     *   JET Buttonset Single
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#buttonSetSingleOverview-section"></a>
     * </h3>
     *
     * <p>Description: A Buttonset Single is a grouping of related buttons where only one button may be selected.
     *
     * <pre class="prettyprint"><code>&lt;oj-c-buttonset-single aria-label="Pick an Item" value="{{value}}" items="[[items]]">
     * &lt;/oj-c-buttonset-single>
     * </code></pre>
     *
     * <h3 id="toolbar-section">
     * Toolbar Usage
     * </h3>
     * <p>Note that oj-c-buttonset-single is not intended for usage inside oj-toolbar, it is only
     * supported in oj-c-toolbar.</p>
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
     *       <td>Push Toggle Button</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Toggle the button.</td>
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
     *       <td>Buttonset Single</td>
     *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
     *       <td>Toggle the focused Button.</td>
     *     </tr>
     *     <tr>
     *       <td>Buttonset Single</td>
     *       <td><kbd>Right Arrow</kbd></td>
     *       <td>Move focus to the next enabled Button, wrapping as needed.</td>
     *     </tr>
     *     <tr>
     *       <td>Buttonset Single</td>
     *       <td><kbd>Left Arrow</kbd></td>
     *       <td>Move focus to the previous enabled Button, wrapping as needed.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     *  <p>The application is responsible for applying <code class="prettyprint">aria-label</code> and/or
     * <code class="prettyprint">aria-controls</code> attributes like the following to the buttonset element, if applicable per the instructions that follow:
     *
     * <pre class="prettyprint">
     * <code>aria-label="Choose only one beverage."
     * aria-controls="myTextEditor"
     * </code></pre>
     *
     * <p>An <code class="prettyprint">aria-label</code> conveying the "choose only one" semantics should be included for a buttonset-single.
     *
     * <p>The <code class="prettyprint">aria-controls</code> attribute should be included if the buttonset is controlling something else on the page, e.g.
     * bold / italic / underline buttons controlling a rich text editor.  If the buttonset is contained in a toolbar, <code class="prettyprint">aria-controls</code>
     * should be placed on the toolbar, not on the buttonsets within the toolbar.
     *
     *  {@include accessibility_doc.ts#a11y-section-disabled-content}
     *
     * @ojmetadata description "A Buttonset Single allows a user to select the state of one or more related options."
     * @ojmetadata displayName "Buttonset Single"
     * @ojmetadata help "oj-c.ButtonsetSingle.html"
     * @ojmetadata main "oj-c/buttonset-single"
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Controls"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/buttonset-single",
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-buttonset-single",
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
     *       "edge",
     *       "disabled"
     *       "items",
     *       "layoutWidth",
     *       "maxWidth"
     *     ]
     *   }
     * ]
     * @ojmetadata since "17.0.0"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "17.0.0",
     *     "value": ["oj-buttonset-one"]
     *   }
     * ]
     */
    function ButtonsetSingleImpl({ chroming = 'outlined', disabled = false, value, onValueChanged, size = 'md', width, maxWidth, layoutWidth, items = [], display = 'all', 'aria-label': accessibleLabel, 'aria-describedby': ariaDescribedBy, ...otherProps }, ref) {
        const rootRef = (0, hooks_1.useRef)();
        const buttonsetRef = (0, hooks_1.useRef)();
        const widthProps = (0, index_1.widthStyle)(layoutWidth, width, maxWidth);
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => buttonsetRef.current?.blur(),
            focus: () => buttonsetRef.current?.focus()
        }), [buttonsetRef]);
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ...widthProps, ref: rootRef, children: (0, jsx_runtime_1.jsx)(FunctionalButtonSetSingle, { value: value, onCommit: (detail) => {
                    onValueChanged?.(detail.value);
                }, ref: buttonsetRef, display: display, variant: chroming, layoutWidth: layoutWidth, size: size, width: widthProps.style ? (widthProps.style.width ? '100%' : undefined) : undefined, "aria-label": accessibleLabel, "aria-describedby": ariaDescribedBy, isDisabled: disabled, ...otherProps, children: items?.map((item) => {
                    return ((0, jsx_runtime_1.jsx)(UNSAFE_ButtonSetItem_1.ButtonSetItem, { label: item.label, value: item.value, isDisabled: item.disabled, startIcon: item.startIcon && (0, jsx_runtime_1.jsx)(index_1.ToggleItemIcon, { icon: item.startIcon }), endIcon: item.endIcon && (0, jsx_runtime_1.jsx)(index_1.ToggleItemIcon, { icon: item.endIcon }) }));
                }) }) }));
    }
    exports.ButtonsetSingle = (0, ojvcomponent_1.registerCustomElement)('oj-c-buttonset-single', (0, compat_1.forwardRef)(ButtonsetSingleImpl), "ButtonsetSingle", { "properties": { "value": { "type": "string", "writeback": true }, "items": { "type": "Array<object>" }, "display": { "type": "string", "enumValues": ["all", "label", "icons"] }, "disabled": { "type": "boolean" }, "size": { "type": "string", "enumValues": ["sm", "md", "lg"] }, "width": { "type": "number|string" }, "maxWidth": { "type": "number|string" }, "chroming": { "type": "string", "enumValues": ["borderless", "outlined"], "binding": { "consume": { "name": "containerChroming" } } }, "layoutWidth": { "type": "string", "enumValues": ["auto", "equal"] } }, "extension": { "_WRITEBACK_PROPS": ["value"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "aria-label"] }, "methods": { "focus": {}, "blur": {} } }, { "chroming": "outlined", "disabled": false, "size": "md", "items": [], "display": "all" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
    const FunctionalButtonSetSingle = (0, compat_1.forwardRef)((props, ref) => {
        const buttonRef = (0, hooks_1.useRef)();
        // We need to support methods on the custom-element layer which can only
        // be done using a class-based component. So, we will wrap this
        // functionality-packed functional component in a class-based component.
        // But, the class-based component will still need a way to pass through
        // method calls, so we will be using useImperativeHandle to add these
        // methods to this functional component's ref which can then be called
        // by the wrapping class-based component.
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            focus: () => buttonRef.current?.focus(),
            blur: () => buttonRef.current?.blur()
        }), []);
        return (0, jsx_runtime_1.jsx)(UNSAFE_ButtonSetSingle_1.ButtonSetSingle, { ref: buttonRef, ...props });
    });
});
