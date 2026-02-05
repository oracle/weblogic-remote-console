define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_Collapsible", "ojs/ojvcomponent", "preact/hooks", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "ojs/ojcontext", "css!oj-c/collapsible/collapsible-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_Collapsible_1, ojvcomponent_1, hooks_1, UNSAFE_useTabbableMode_1, Context) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Collapsible = void 0;
    exports.Collapsible = (0, ojvcomponent_1.registerCustomElement)('oj-c-collapsible', 
    /**
     * @classdesc
     * <h3 id="collapsibleOverview-section">
     *   JET Collapsible
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#collapsibleOverview-section"></a>
     * </h3>
     *
     * <p>Description: A JET Collapsible displays a header that can be expanded to show additional content beneath it.
     * The child element of the oj-c-collapsible in the named <a href="#header">header</a> slot is displayed in the header, while the child element in the <a href="#Default">default</a> slot is displayed as the content.
     *
     * <p>Note for performance reasons, if the collapsible content is expensive to render, you should wrap it in an <code class="prettyprint">oj-defer</code> element to defer the rendering of that content.<br/>
     * See the Collapsible - Deferred Rendering demo for an example.</p>
     *
     * <pre class="prettyprint"><code>
     * &lt;oj-c-collapsible>
     *   &lt;h3 slot='header'>Header 1&lt;/h3>
     *   &lt;p>Content 1&lt;/p>
     * &lt;/oj-c-collapsible>
     * </code></pre>
     *
     * <h3 id="data-attributes-section">
     *   Custom Data Attributes
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#data-attributes-section"></a>
     * </h3>
     *
     * <p>Collapsible supports the following custom data attributes.
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Name</th>
     *       <th>Description</th>
     *       <th>Example</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td><kbd>data-oj-clickthrough</kbd></td>
     *       <td><p>Specify on any element inside the header where you want to control whether Collapsible should toggle disclosure by
     *           an event originating from the element or one of its descendants.</p>
     *           <p>For example, if you specify this attribute with a value of "disabled" on a button inside the header, then Collapsible
     *           will not trigger disclosure when user clicks on the button.</p>
     *       </td>
     *       <td>
     *         <pre class="prettyprint"><code>&lt;oj-c-collapsible>
     *   &lt;div slot="header">
     *     &lt;h3>Header 3&lt;/h3>
     *     &lt;oj-c-button data-oj-clickthrough="disabled">&lt;/oj-c-button
     *   &lt;/div>
     *   &lt;p>Content&lt;/p>
     * &lt;/oj-c-collapsible></code></pre>
     *       </td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojmetadata description 'A collapsible displays a header that can be expanded to show its content.'
     * @ojmetadata displayName 'Collapsible'
     * @ojmetadata help 'oj-c.Collapsible.html'
     * @ojmetadata main 'oj-c/collapsible'
     * @ojmetadata status [
     *   {
     *     type: "candidate",
     *     since: "17.0.0"
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Layout & Nav"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/collapsible"
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-collapsible",
     *     "uxSpecs": [
     *       "collapsible"
     *     ]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "disabled",
     *       "expanded",
     *       "iconPosition",
     *       "variant"
     *     ]
     *   }
     * ]
     * @ojmetadata since "14.0.0"
     */
    ({ id, children, header, disabled = false, expanded = false, iconPosition = 'start', variant = 'basic', ...props }) => {
        const rootRef = (0, hooks_1.useRef)(null);
        const didMountRef = (0, hooks_1.useRef)(false);
        const hasBeenExpanded = (0, hooks_1.useRef)(expanded);
        const resolveBusyState = (0, hooks_1.useRef)();
        const addBusyState = (0, hooks_1.useCallback)((desc) => {
            return Context.getContext(rootRef.current)
                .getBusyContext()
                ?.addBusyState({
                description: `oj-c-collapsible: id='${id}' is ${desc}.`
            });
        }, [id]);
        (0, hooks_1.useEffect)(() => {
            // The busy state is not added on the first render, but on each subsequent toggle
            if (!didMountRef.current) {
                didMountRef.current = true;
                return;
            }
            if (expanded) {
                hasBeenExpanded.current = true;
            }
            // Resolve current busy state is transition is already in progress
            if (resolveBusyState.current) {
                resolveBusyState.current();
            }
            resolveBusyState.current = addBusyState('animating');
        }, [expanded, addBusyState]);
        const toggleHandler = async (event) => {
            let target = event.target;
            for (; target && target !== rootRef?.current; target = target.parentElement) {
                if (target.getAttribute('data-oj-clickthrough') === 'disabled') {
                    return;
                }
            }
            const beforeProp = event.value ? props.onOjBeforeExpand : props.onOjBeforeCollapse;
            try {
                await beforeProp?.(event);
                props.onExpandedChanged?.(event.value);
            }
            catch (_) {
                // The expansion change was canceled so nothing to do here
            }
        };
        const transitionEndHandler = (event) => {
            const expandedProp = event.value ? props.onOjExpand : props.onOjCollapse;
            expandedProp?.(event);
            if (resolveBusyState.current) {
                resolveBusyState.current();
                resolveBusyState.current = undefined;
            }
        };
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: id, ref: rootRef, children: (0, jsx_runtime_1.jsx)(UNSAFE_Collapsible_1.Collapsible, { header: header, iconPosition: iconPosition, variant: variant, isExpanded: expanded, isDisabled: disabled, onToggle: toggleHandler, onTransitionEnd: transitionEndHandler, "aria-label": props['aria-label'], "aria-labelledby": props['aria-labelledby'], children: (expanded || hasBeenExpanded.current) && children }) }));
    }, "Collapsible", { "slots": { "": {}, "header": {} }, "properties": { "disabled": { "type": "boolean" }, "expanded": { "type": "boolean", "writeback": true }, "iconPosition": { "type": "string", "enumValues": ["end", "start"] }, "variant": { "type": "string", "enumValues": ["basic", "horizontal-rule"] } }, "events": { "ojBeforeCollapse": { "cancelable": true }, "ojBeforeExpand": { "cancelable": true }, "ojCollapse": {}, "ojExpand": {} }, "extension": { "_WRITEBACK_PROPS": ["expanded"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-label", "aria-labelledby", "id"] } }, { "disabled": false, "expanded": false, "iconPosition": "start", "variant": "basic" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
});
