define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_DrawerPopup", "ojs/ojvcomponent", "preact/hooks", "@oracle/oraclejet-preact/UNSAFE_Layer", "ojs/ojcontext", "css!oj-c/drawer-popup/drawer-popup-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_DrawerPopup_1, ojvcomponent_1, hooks_1, UNSAFE_Layer_1, Context) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DrawerPopup = void 0;
    const LAYER_CONTENT = Symbol.for('__oj_c_layer_content');
    exports.DrawerPopup = (0, ojvcomponent_1.registerCustomElement)('oj-c-drawer-popup', 
    /**
     * @classdesc
     * <h3 id="drawerPopupOverview-section">
     *   JET Drawer Popup
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#drawerPopupOverview-section"></a>
     * </h3>
     * <p>Description: Drawer Popup adds a single slide-in side content alongside some primary content to an application window. It can be placed at 'start', 'end' or 'bottom' edge and it always overlays the page.</p>
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-c-drawer-popup>
     *    Start drawer content
     * &lt;/oj-c-drawer-popup>
     *
     * &lt;oj-c-drawer-popup edge="end" opened="true">
     *    End drawer content
     * &lt;/oj-c-drawer-popup>
     *
     * &lt;oj-c-drawer-popup edge="bottom">
     *    Bottom drawer content
     * &lt;/oj-c-drawer-popup>
     *
     * Main section content
     * </code></pre>
     *
     * <p id="drawer-popup-layout-section">JET Drawer Popup and Drawer Layout look similar, but are intended to be used
     * for different purposes.</p>
     * <p>Use Drawer Popup</p>
     * <ul>
     *   <li>If you need to display ‘overlay’ drawers attached to the edge of the viewport that stretch over the full viewport height or width.</li>
     *   <li>If you need modality.</li>
     * </ul>
     * <p>Use Drawer Layout</p>
     * <ul>
     *   <li>If you need to switch between the ‘reflow’ display mode (big screens) and ‘overlay’ (small screens).</li>
     *   <li>If the drawer should only fill a specific part of the viewport rather than take its full height (start/end) or full width (bottom).</li>
     *   <li>If modality is not required.</li>
     * </ul>
     *
     * <h3 id="keyboard-section">
     *   Keyboard End User Information
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#keyboard-section"></a>
     * </h3>
     * <table class="keyboard-table">
     *  <thead>
     *    <tr>
     *      <th>Target</th>
     *      <th>Key</th>
     *      <th>Action</th>
     *    </tr>
     *  </thead>
     *  <tbody>
     *    <tr>
     *      <td>Drawer element</td>
     *      <td><kbd>Esc</kbd></td>
     *      <td>Close the drawer</td>
     *    </tr>
     *  </tbody>
     * </table>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <h4>role</h4>
     * <p>Drawer Popup always has the 'dialog' role.</p>
     *
     * <p>However, adding <code class="prettyprint">role="dialog"</code> alone is not sufficient to make a drawer accessible.
     * It must be properly labeled. It is developer’s responsibility to define respective aria properties to meet accessibility requirements.</p>
     *
     * <h4>aria-labelledby, aria-label</h4>
     * If a drawer already has a visible title bar, the text inside that bar can be used to label the dialog itself.
     * Set the value of the <code class="prettyprint">aria-labelledby</code> attribute to be the id of the element used to title the drawer.
     * If there isn't appropriate text visible in the DOM that could be referenced with <code class="prettyprint">aria-labelledby</code>
     * use the <code class="prettyprint">aria-label</code> attribute to define the accessible name of an element.
     *
     * <h4>aria-describedby</h4>
     * If the drawer contains additional descriptive text besides the drawer title,
     * this text can be associated with the drawer using the <code class="prettyprint">aria-describedby</code> attribute.
     *
     * <h3 id="rtl-section">
     *   Reading direction
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
     * </h3>
     *
     * <p> Setting the reading direction (LTR or RTL) is supported by setting the <code class="prettyprint">"dir"</code> attribute on the
     * <code class="prettyprint">&lt;html></code> element of the page. As with any JET component, in the unusual case that the reading direction
     * is changed post-init, the page must be reloaded.</p>
     *
     * <h3 id="sizing">
     *   Sizing
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#sizing"></a>
     * </h3>
     *
     * <p>Side drawers always stretch to viewport's height and the bottom one to its width.
     * The other axis dimension is not predefined. This dimension's size is determined by its content.
     * If you want to set a custom size you can use units like px, rem, etc.
     * However because there is no fixed-size parent percentages (%) won’t work,
     * but you can use vw (viewport width) or vh (viewport height) units to achieve a similar effect.</p>
     * <ul>
     *   <li>Note the built-in minimal and maximal width of side drawers.</li>
     *   <li>Note that DrawerPopup animates opening and closing. However, it is app developer's responsibility to add animations for custom runtime changes to a drawer size. See the 'Sizing' cookbook demo for an example.</li>
     * </ul>
     *
     * @ojmetadata description 'A Drawer Popup is a panel that slides into the viewport.'
     * @ojmetadata displayName 'Drawer Popup'
     * @ojmetadata help 'oj-c.DrawerPopup.html'
     * @ojmetadata main 'oj-c/drawer-popup'
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "17.0.0",
     *     "value": ["oj-drawer-popup"]
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Layout & Nav"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/drawer-popup",
     *     "pi": {
     *       "layouts": {
     *         "general": {
     *           "customizers": [
     *             {
     *               "propertyName": "closeGesture",
     *               "type": "enumeration"
     *             },
     *             {
     *               "propertyName": "autoDismiss",
     *               "type": "enumeration"
     *             },
     *             {
     *               "propertyName": "edge",
     *               "type": "enumeration"
     *             },
     *             {
     *               "propertyName": "modality",
     *               "type": "enumeration"
     *             },
     *             {
     *               "propertyName": "opened"
     *             }
     *           ]
     *         }
     *       }
     *     }
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-drawer",
     *     "uxSpecs": [
     *       "drawer"
     *     ]
     *   }
     * }
     * @ojmetadata since "16.0.0"
     */
    ({ id, children, opened = false, edge = 'start', modality = 'modal', autoDismiss = 'focus-loss', closeGesture = 'swipe', onOjBeforeClose, onOjClose, onOpenedChanged, backgroundColor, ...otherProps }) => {
        const rootRef = (0, hooks_1.useRef)(null);
        const resolveBusyState = (0, hooks_1.useRef)();
        const didMountRef = (0, hooks_1.useRef)(false);
        const addBusyState = (0, hooks_1.useCallback)((desc) => {
            return rootRef.current
                ? Context.getContext(rootRef.current)
                    .getBusyContext()
                    .addBusyState({ description: `oj-c-drawer-popup id='${id}' is ${desc}` })
                : () => { }; // if the component is not mounted return Noop
        }, [id]);
        const preactRef = (0, hooks_1.useCallback)((elem) => {
            if (rootRef.current) {
                if (elem) {
                    const layerElem = elem;
                    layerElem[UNSAFE_Layer_1.LOGICAL_PARENT] = rootRef.current;
                    rootRef.current[LAYER_CONTENT] = elem;
                }
                else {
                    if (rootRef.current[LAYER_CONTENT]) {
                        const layerElem = rootRef.current[LAYER_CONTENT];
                        delete layerElem[UNSAFE_Layer_1.LOGICAL_PARENT];
                        delete rootRef.current[LAYER_CONTENT];
                    }
                }
            }
        }, []);
        (0, hooks_1.useEffect)(() => {
            return () => {
                // Resolve current busy state on unmount
                if (resolveBusyState.current) {
                    resolveBusyState.current();
                }
            };
        }, []);
        (0, hooks_1.useEffect)(() => {
            // The busy state is not added on the first render, but on each subsequent toggle
            if (!didMountRef.current) {
                didMountRef.current = true;
                return;
            }
            // Resolve current busy state is transition is already in progress
            if (resolveBusyState.current) {
                resolveBusyState.current();
            }
            resolveBusyState.current = addBusyState('animating');
        }, [opened, addBusyState]);
        const onOjBeforeCloseHandler = async (detail) => {
            if ((detail.reason === 'outsideClick' && autoDismiss === 'focus-loss') ||
                (detail.reason === 'swipe' && closeGesture === 'swipe') ||
                detail.reason === 'escapeKey') {
                // Allow veto by triggering onOjBeforeClose.
                // AutoDismiss controls closing using an outside click.
                // CloseGesture controls closing with a swipe gesture.
                // Closing with ESC key can be vetoed but no property control is available
                // This setting matches legacy Drawer Popup
                try {
                    // Cancelable ojBeforeClose event
                    await onOjBeforeClose?.(detail);
                    onOpenedChanged?.(false);
                }
                catch (_) {
                    // Closing was canceled so short circuit out here
                }
            }
        };
        const transitionEndHandler = async (value) => {
            // PreactDrawer TransitionEndDetail callback is triggered on both
            // when drawer opening ends and when drawer closing ends
            // In Core pack DrawerPopup, for legacy compatability reasons,
            // we trigger ojClose only when drawer closes. In legacy, there's no 'afterOpen' event.
            // Resolve and reset busy state
            if (resolveBusyState.current) {
                resolveBusyState.current();
                resolveBusyState.current = undefined;
            }
            if (value === false) {
                // Trigger onOjClose.
                onOjClose?.();
            }
        };
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, id: id, children: (0, jsx_runtime_1.jsx)(UNSAFE_DrawerPopup_1.DrawerPopup, { ref: preactRef, isOpen: opened, placement: edge, modality: modality, onClose: onOjBeforeCloseHandler, onTransitionEnd: transitionEndHandler, backgroundColor: backgroundColor, "aria-describedby": otherProps['aria-describedby'], "aria-label": otherProps['aria-label'], "aria-labelledby": otherProps['aria-labelledby'], children: children }) }));
    }, "DrawerPopup", { "slots": { "": {} }, "properties": { "opened": { "type": "boolean", "writeback": true }, "modality": { "type": "string", "enumValues": ["modal", "modeless"] }, "edge": { "type": "string", "enumValues": ["end", "start", "bottom"] }, "autoDismiss": { "type": "string", "enumValues": ["none", "focus-loss"] }, "closeGesture": { "type": "string", "enumValues": ["none", "swipe"] }, "backgroundColor": { "type": "string" } }, "events": { "ojBeforeClose": { "cancelable": true }, "ojClose": {} }, "extension": { "_WRITEBACK_PROPS": ["opened"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "aria-label", "aria-labelledby", "id"] } }, { "opened": false, "edge": "start", "modality": "modal", "autoDismiss": "focus-loss", "closeGesture": "swipe" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});
