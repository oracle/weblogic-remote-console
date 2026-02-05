define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent", "@oracle/oraclejet-preact/UNSAFE_MenuButton", "@oracle/oraclejet-preact/UNSAFE_IconMenuButton", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "@oracle/oraclejet-preact/hooks/UNSAFE_useTooltip", "@oracle/oraclejet-preact/utils/UNSAFE_mergeProps", "@oracle/oraclejet-preact/hooks/UNSAFE_useToggle", "oj-c/utils/PRIVATE_ItemsMenu/items-menu", "preact/hooks", "preact/compat", "css!oj-c/menu-button/menu-button-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, ojvcomponent_1, UNSAFE_MenuButton_1, UNSAFE_IconMenuButton_1, UNSAFE_useTabbableMode_1, UNSAFE_useTooltip_1, UNSAFE_mergeProps_1, UNSAFE_useToggle_1, items_menu_1, hooks_1, compat_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MenuButton = void 0;
    /**
     * @classdesc
     * <h3 id="MenuButtonOverview-section">
     *   JET Menu Button
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#buttonOverview-section"></a>
     * </h3>
     *
     * <p>Description: A menu button launches a menu when clicked.
     *
     * <pre class="prettyprint"><code>&lt;oj-c-menu-button label="Copy" items="[[items]]">
     * &lt;/oj-c-menu-button>
     * </code></pre>
     *
     * <h3 id="touch-section">
     *   Touch End User Information
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
     * </h3>
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
     *       <td>Menu Button</td>
     *       <td><kbd>Enter</kbd> or <kbd>Space</kbd> or <kbd>Down Arrow</kbd></td>
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
     * <p>For accessibility, the label and suffix are used as the accessible aria label.  This is required
     * as persistent menu buttons or suffixes modify the label depending on the last menu item selection.
     *
     * <p>oj-c-menu-button follows the ARIA Authoring Practices Guide patterns for
     * <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/">menu</a> and
     * <a href="https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/">menu button</a>.
     * Note that this is an implementation detail that may change in the future.
     *
     * {@include accessibility_doc.ts#a11y-section-disabled-content}
     *
     * @ojmetadata description "A menu button launches a menu when clicked."
     * @ojmetadata displayName "Menu Button"
     * @ojmetadata help "oj-c.MenuButton.html"
     * @ojmetadata main "oj-c/menu-button"
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Controls"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/menu-button",
     *     "pi":{
     *       "events":{
     *         "suggestions":[
     *             { "type":"component",
     *                "name": "ojMenuAction",
     *                "mappings": [
     *                  { "variableName": "menuItemKey",
     *                     "expression": "{{$event.detail.key}}",
     *                     "type": "string"
     *                  }
     *                ]
     *             },
     *             { "type":"component",
     *                "name": "onOjMenuSelection",
     *                "mappings": [
     *                  { "variableName": "menuSelectionValue",
     *                     "expression": "{{$event.detail.value}}",
     *                     "type": "string"
     *                  },
     *                  { "variableName": "menuSelectionGroupKey",
     *                     "expression": "{{$event.detail.menuSelectionGroupKey}}",
     *                     "type": "string"
     *                  }
     *                ]
     *              },
     *            ]
     *         }
     *      }
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
     *       "edge",
     *       "disabled"
     *     ]
     *    },
     *   {
     *     "propertyGroup": "data",
     *     "items": [
     *       "suffix",
     *       "items"
     *       "selection"
     *     ]
     *   }
     * ]
     * @ojmetadata since "16.0.0"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "16.0.0",
     *     "value": ["oj-menu-button","oj-menu-select-many"]
     *   }
     * ]
     */
    function MenuButtonImpl({ label = '', chroming = 'outlined', disabled = false, size = 'md', display = 'all', items = [], tooltip, suffix, startIcon, endIcon, selection, onSelectionChanged, onOjMenuAction, onOjMenuSelection, 'aria-label': accessibleLabel, 'aria-describedby': ariaDescribedBy, width }, ref) {
        const rootRef = (0, hooks_1.useRef)();
        const buttonRef = (0, hooks_1.useRef)(null);
        const isLabelButton = display !== 'icons' || (startIcon && endIcon);
        const { bool: isOpen, toggle: toggleOpen } = (0, UNSAFE_useToggle_1.useToggle)();
        const widthProps = width ? { style: { width: width } } : {};
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            blur: () => buttonRef.current?.blur(),
            focus: () => buttonRef.current?.focus(),
            click: () => buttonRef.current?.click()
        }), []);
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ...widthProps, ref: rootRef, children: isLabelButton ? ((0, jsx_runtime_1.jsx)(FunctionalMenuButton, { isMenuOpen: isOpen, onToggleMenu: toggleOpen, label: display === 'icons' ? (!startIcon ? label : '') : label, suffix: display === 'icons' ? (!startIcon ? suffix : '') : suffix, ref: buttonRef, variant: chroming, size: size, tooltip: tooltip, width: '100%', "aria-label": accessibleLabel, "aria-describedby": ariaDescribedBy, icon: display !== 'label' ? startIcon : null, isDisabled: disabled, children: (0, jsx_runtime_1.jsx)(items_menu_1.ItemsMenu, { items: items, selection: selection, onSelectionChanged: onSelectionChanged, onOjMenuSelection: onOjMenuSelection, onOjMenuAction: onOjMenuAction }) })) : ((0, jsx_runtime_1.jsx)(UNSAFE_IconMenuButton_1.IconMenuButton, { isMenuOpen: isOpen, width: '100%', onToggleMenu: toggleOpen, ref: buttonRef, variant: chroming, isDisabled: disabled, tooltip: tooltip, accessibleLabel: accessibleLabel && accessibleLabel !== '' ? accessibleLabel : label, "aria-describedby": ariaDescribedBy, size: size, isIconOnly: (!startIcon && endIcon) || (!startIcon && !endIcon) ? display === 'icons' : false, icon: startIcon ?? (endIcon ? endIcon : (0, jsx_runtime_1.jsx)(OverFlowIcon, {})), children: (0, jsx_runtime_1.jsx)(items_menu_1.ItemsMenu, { items: items, selection: selection, onSelectionChanged: onSelectionChanged, onOjMenuSelection: onOjMenuSelection, onOjMenuAction: onOjMenuAction }) })) }));
    }
    const OverFlowIcon = () => {
        return (0, jsx_runtime_1.jsx)("span", { class: "oj-ux-ico-overflow-h" });
    };
    exports.MenuButton = (0, ojvcomponent_1.registerCustomElement)('oj-c-menu-button', (0, compat_1.forwardRef)(MenuButtonImpl), "MenuButton", { "properties": { "label": { "type": "string" }, "suffix": { "type": "string" }, "tooltip": { "type": "string" }, "items": { "type": "Array<object>" }, "selection": { "type": "object", "writeback": true }, "display": { "type": "string", "enumValues": ["all", "label", "icons"] }, "disabled": { "type": "boolean" }, "size": { "type": "string", "enumValues": ["sm", "md", "lg", "xs"] }, "width": { "type": "number|string" }, "chroming": { "type": "string", "enumValues": ["solid", "borderless", "outlined", "ghost"], "binding": { "consume": { "name": "containerChroming" } } } }, "slots": { "startIcon": {}, "endIcon": {} }, "events": { "ojMenuAction": { "bubbles": true }, "ojMenuSelection": { "bubbles": true } }, "extension": { "_WRITEBACK_PROPS": ["selection"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "aria-label"] }, "methods": { "focus": {}, "blur": {}, "click": {} } }, { "label": "", "chroming": "outlined", "disabled": false, "size": "md", "display": "all", "items": [] }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
    const FunctionalMenuButton = (0, compat_1.forwardRef)((props, ref) => {
        const { tooltipContent, tooltipProps } = (0, UNSAFE_useTooltip_1.useTooltip)({
            text: props.tooltip,
            isDisabled: props.isDisabled
        });
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(UNSAFE_MenuButton_1.MenuButton, { ref: ref, ...(0, UNSAFE_mergeProps_1.mergeProps)(props, tooltipProps) }), tooltipContent] }));
    });
});
