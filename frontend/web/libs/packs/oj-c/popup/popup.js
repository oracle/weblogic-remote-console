define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent", "preact/hooks", "@oracle/oraclejet-preact/UNSAFE_Popup", "@oracle/oraclejet-preact/UNSAFE_Layer", "ojs/ojcontext", "css!oj-c/popup/popup-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, ojvcomponent_1, hooks_1, UNSAFE_Popup_1, UNSAFE_Layer_1, Context) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Popup = void 0;
    const LAYER_CONTENT = Symbol.for('__oj_c_layer_content');
    exports.Popup = (0, ojvcomponent_1.registerCustomElement)('oj-c-popup', 
    /**
     * @classdesc
     * <h3 id="popupOverview-section">
     *   JET Popup
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#popupOverview-section"></a>
     * </h3>
     * <p>Description: A popup temporarily 'pops up' content in the foreground.</p>
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-c-popup>
     *    Popup content
     * &lt;/oj-c-popup>
     *
     * &lt;oj-c-popup opened="true">
     *    Opened Popup
     * &lt;/oj-c-popup>
     *
     * &lt;oj-c-popup placement="bottom">
     *    Popup positioned at the bottom of the anchor
     * &lt;/oj-c-popup>
     *
     * Main section content
     * </code></pre>
     *
     * <p id="popup-section">A popup temporarily 'pops up' content in the foreground.</p>
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
     *       <td rowspan = "3">Focus within Popup</td>
     *       <td><kbd>Tab</kbd> or <kbd>Shift + Tab</kbd></td>
     *       <td>Navigate the content of the popup.</td>
     *    </tr>
     *    <tr>
     *      <td><kbd>F6</kbd></td>
     *      <td>Move focus to the launcher for a popup with modeless modality.</td>
     *    </tr>
     *    <tr>
     *      <td><kbd>Esc</kbd></td>
     *      <td>Close the open popup.</td>
     *    </tr>
     *    <tr>
     *      <td rowspan = "1">Popup Launcher</td>
     *      <td><kbd>F6</kbd></td>
     *      <td>Move focus to the first tab stop within the open popup. If there is not a tab stop
     *          within the content, focus is established on the popup.</td>
     *     </tr>
     *  </tbody>
     * </table>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>For WAI-ARIA compliance, JET automatically adds
     * <code class="prettyprint">role="dialog"</code> to the popup root dom element, if not
     * already specificed. This is not a component property but rather the standard html
     * <a href="https://www.w3.org/WAI/PF/aria/roles">role</a> attribute. Depending on how the
     * popup is used in the page, the page developer should choose from the following:
     * <ul>
     *   <li>"tooltip" defines contextual popup that displays a description for an element.
     *       It should only be used for popups that include simple textual content and no interactive
     *       elements. The "tooltip" role should never be used with modal popups.</li>
     *   <li>"dialog" defines an application window that is designed to interrupt the current
     *       processing of an application in order to prompt the user to enter information or
     *       require a response. It is the default role for popups.</li>
     *   <li>"alertdialog" defines type of popup that contains an alert message, where initial focus
     *       goes to an element within the popup.</li>
     * </ul>
     * </p>
     * <p>
     *  The page developer should consider adding the aria-haspopup="dialog" to the launcher element.
     * </p>
     * <p>
     * Depending on the aria role and popup content, the page developer may also need to
     * set the <code class="prettyprint">aria-labelledby</code> and (optionally)
     * <code class="prettyprint">aria-describedby</code> attributes on the oj-popup
     * element in order to make the popup and its content accessible.
     * </p>
     *
     * <p>One point often overlooked is making the gestures that launch a popup accessible.
     *   There are no constraints to what events a page developer might choose to trigger opening a
     *   popup.  The choice should be accessible for screen reader users.  Page
     *   developers should take care when using mouse events to trigger opening of a popup.
     *   This is especially important if the content of the popup can't be derived from other
     *   visible areas on the page. In cases that mouseover, mouseout, mouseenter, mouseleave and
     *   hover events are used to launch popups, there needs to be a keyboard functional equivalency.
     * </p>
     *
     * <h3 id="reparenting-section">
     *   Reparenting
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#reparenting-section"></a>
     * </h3>
     * <p id="reparenting-strategy">
     *    When popups are open, they will be reparented in the document and reparented back when
     *    closed. When open, the location of the popup within the document will be in context of
     *    how it's used. Popups open from other popups will be relocated in the document into the
     *    nearest parent popup's layer. The popups layer defines its z-index weight "stacking
     *    context".  The ojPopup's layer is marked with the "oj-popup-layer" style.
     *    The context of opening is defined by the launcher argument passed to the open method.  If
     *    not open from another popup, the popup will be reparented to a container in the document
     *    body. Popups of the same type are assigned the same z-index values.  The layering between
     *    peer popups reflect the opening order.
     * </p>
     * <p>
     *     There are known caveats with this design. However, these scenarios are considered "bad use"
     *     based on our JET popup strategy.
     *  </p>
     *  <ol>
     *    <li>Events raised within the popup will not bubble up to the popup's original ancestors.
     *        Instead, listeners for popup events should be applied to either the popup's root
     *        element, or the document.</li>
     *    <li>Likewise, developers should not use CSS descendant selectors, or similar logic, that
     *        assumes that the popup will remain a child of its original parent.</li>
     *    <li>Popups containing iframes are problematic.  The iframe elements "may" fire a HTTP GET
     *        request for its src attribute each time the iframe is reparented in the document.</li>
     *    <li>If an iframe is added to the popup's content, it must not be the first or last tab stop
     *        within the popup or keyboard and VoiceOver navigation will not remain within the popup.</li>
     *    <li>In some browsers, reparenting a popup that contains elements having overflow, will cause
     *        these overflow elements to reset their scrollTop.</li>
     *  </ol>
     *
     * <h3 id="eventHandling-section">
     *   Event Handling
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#eventHandling-section"></a>
     * </h3>
     * <ul>
     *  <li>ojBeforeClose(event) - Triggered before a popup closes. Event can prevent closing the
     *      popup; However, there are cases the framework must veto, such as when the popup is
     *      destroyed.</li>
     *  <li>ojClose(event) - Triggered after the popup has closed.</li>
     *  <li>ojFocus(event) - Triggered when initial focus is established on opening, depending on
     *      the value of the initalFocus property, or <kbd>F6</kbd> focus toggle from the associated
     *      launcher.</li>
     *  <li>ojOpen(event) - Triggered after the popup has been made visible.</li>
     * </ul>
     *
     * <h3 id="rtl-section">
     *   Reading direction
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
     * </h3>
     *
     * <p> Setting the reading direction (LTR or RTL) is supported by setting the <code class="prettyprint">"dir"</code> attribute on the
     * <code class="prettyprint">&lt;html></code> element of the page. As with any JET component, in the unusual case that the reading direction
     * is changed post-init, the page must be reloaded.
     *
     * @ojmetadata description 'A popup temporarily 'pops up' content in the foreground.'
     * @ojmetadata displayName 'Popup'
     * @ojmetadata help 'oj-c.Popup.html'
     * @ojmetadata main 'oj-c/popup'
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "19.0.0",
     *     "value": ["oj-popup"]
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Layout & Nav"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/popup"
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-popup",
     *     "uxSpecs": [
     *       "popup"
     *     ]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "opened",
     *       "anchor",
     *       "launcher",
     *       "placement",
     *       "collision",
     *       "modality",
     *       "offset",
     *       "initialFocus",
     *       "autoDismiss",
     *       "tail",
     *       "onOpenedChanged",
     *       "onOjOpen",
     *       "onOjBeforeClose",
     *       "onOjClose",
     *       "onOjFocus",
     *       "width",
     *       "minWidth",
     *       "maxWidth",
     *       "height",
     *       "minHeight",
     *       "maxHeight"
     *     ]
     *   }
     * ]
     * @ojmetadata since "17.0.0"
     */
    ({ id, opened = false, children, anchor, launcher, placement, collision = 'fit', modality = 'modeless', offset, initialFocus = 'auto', autoDismiss = 'focusLoss', tail = 'none', variant = 'standard', onOpenedChanged, onOjOpen, onOjBeforeClose, onOjClose, onOjFocus, width, minWidth, maxWidth = 'calc(100vw - 3rem)', height, minHeight, maxHeight = 'calc(100vh - 3rem)', ...otherProps }) => {
        const rootRef = (0, hooks_1.useRef)(null);
        let defaultPlacement = placement;
        const anchorRef = (0, hooks_1.useRef)(null);
        const launcherRef = (0, hooks_1.useRef)(null);
        const resolveBusyState = (0, hooks_1.useRef)();
        const didMountRef = (0, hooks_1.useRef)(false);
        const addBusyState = (0, hooks_1.useCallback)((desc) => {
            return rootRef.current
                ? Context.getContext(rootRef.current)
                    .getBusyContext()
                    .addBusyState({ description: `oj-c-popup id='${id}' is ${desc}` })
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
        // Resolve launcher to pass launcherRef to Preact Popup.
        // As anchor defaults to launcher in some cases, we resolve launcher first.
        // In legacy, there's no launcher attribute. There's open() method that supports
        // launcher parameter, which can be of type 'string | Element'.
        // Hence, the launcher attribute is designed similarly
        // In theory, launcher can remain undefined (launcherRef.current === undefined).
        // This corner case is handled in Preact Popup.
        let localLauncher;
        if (typeof launcher === 'string') {
            const launcherEl = document.querySelector(launcher);
            if (launcherEl) {
                localLauncher = launcherEl;
            }
        }
        else if (launcher instanceof HTMLElement) {
            if (document.body.contains(launcher)) {
                localLauncher = launcher;
            }
        }
        else {
            localLauncher = document.activeElement;
        }
        const isObject = (value) => {
            return typeof value === 'object' && !Array.isArray(value) && value !== null;
        };
        // Resolve anchor to pass anchorRef to Preact Popup.
        // Similarly to launcher (see above) we allow 'string | Element' for anchor here.
        // In theory, anchor can remain undefined (anchorRef.current === undefined). This corner
        // case should be handled in Preact Popup.
        //
        // Note:
        // Core Popup: if anchor is not defined, we default to launcher to match legacy popup
        // Preact Popup: if anchorRef || anchorRef.current is not defined, it defaults to 'window'
        let localAnchor;
        if (!anchor) {
            localAnchor = localLauncher;
        }
        else if (anchor instanceof Window || anchor === 'window') {
            localAnchor = 'window';
        }
        else if (typeof anchor === 'string') {
            // 2a. Custom anchor (string)
            const queriedAnchor = document.querySelector(anchor);
            localAnchor = queriedAnchor || localLauncher;
        }
        else if (anchor instanceof Element) {
            // 2b. Custom anchor (Element) or default to 'launcher'
            localAnchor = document.body.contains(anchor) ? anchor : localLauncher;
        }
        else if (isObject(anchor)) {
            if (typeof anchor.x === 'number' && typeof anchor.y === 'number') {
                // Coord type, (unlike Offset, x and y are mandatory in Coord)
                localAnchor = anchor;
            }
            else {
                localAnchor = localLauncher;
            }
        }
        if (!placement) {
            if (localAnchor === 'window') {
                defaultPlacement = 'center';
            }
            else {
                defaultPlacement = 'bottom-start';
            }
        }
        // To allow collision handling
        const flipOptions = { mainAxis: true, crossAxis: true };
        const shiftOptions = { mainAxis: false, crossAxis: false };
        switch (collision) {
            case 'none': {
                flipOptions.mainAxis = false;
                flipOptions.crossAxis = false;
                break;
            }
            case 'fit': {
                flipOptions.mainAxis = false;
                flipOptions.crossAxis = false;
                shiftOptions.mainAxis = true;
                shiftOptions.crossAxis = true;
                break;
            }
            case 'flipcenter':
            case 'flipfit': {
                shiftOptions.mainAxis = true;
                shiftOptions.crossAxis = true;
                break;
            }
            // Flip is collision default
            default:
            case 'flip': {
                break;
            }
        }
        const isMainAxisVertical = (placement) => {
            return ['top', 'bottom'].indexOf(placement.split('-')[0]) > -1;
        };
        const verticalMainAxis = placement ? isMainAxisVertical(placement) : true;
        const preactOffset = {};
        if (offset) {
            if (verticalMainAxis) {
                if (offset.y) {
                    preactOffset.mainAxis = offset.y;
                }
                if (offset.x) {
                    preactOffset.crossAxis = offset.x;
                }
            }
            else {
                if (offset.x) {
                    preactOffset.mainAxis = offset.x;
                }
                if (offset.y) {
                    preactOffset.crossAxis = offset.y;
                }
            }
        }
        const handleOnClickOutside = async () => {
            // Closing with outside click
            if (autoDismiss === 'focusLoss') {
                return dispatchBeforeClose({ reason: 'outsideClick' });
            }
        };
        const handleOnClose = async (detail) => {
            // Closing with ESC
            if (detail.reason === 'escapeKey') {
                return dispatchBeforeClose(detail);
            }
            // Closing with Close SkipLink
            if (detail.reason === 'closeSkipLink') {
                onOpenedChanged?.(false);
            }
        };
        const dispatchBeforeClose = async (detail) => {
            // Allow veto by triggering onOjBeforeClose.
            // AutoDismiss controls closing using an outside click.
            // Closing with ESC key can be vetoed but no property control is available
            // This setting matches legacy Popup
            try {
                // Cancelable ojBeforeClose event
                await onOjBeforeClose?.(detail);
                onOpenedChanged?.(false);
            }
            catch (_) {
                // Closing was canceled so short circuit out here
            }
        };
        const handleOnTransitionEnd = async (value) => {
            // Resolve and reset busy state
            if (resolveBusyState.current) {
                resolveBusyState.current();
                resolveBusyState.current = undefined;
            }
            if (value) {
                // Popup's opening gets finished
                onOjOpen?.();
            }
            else {
                // Popup's closing gets finished
                onOjClose?.();
            }
        };
        const handleOnFocus = () => {
            onOjFocus?.();
        };
        // Set refs for Pract API
        anchorRef.current = localAnchor;
        launcherRef.current = localLauncher;
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, id: id, children: (0, jsx_runtime_1.jsx)(UNSAFE_Popup_1.Popup, { ref: preactRef, isOpen: opened, anchorRef: anchorRef.current === 'window' ? undefined : anchorRef, launcherRef: launcherRef, placement: placement ?? defaultPlacement, offset: offset ? preactOffset : undefined, flipOptions: flipOptions, shiftOptions: shiftOptions, modality: modality, initialFocus: initialFocus, tail: tail, variant: variant, onClose: handleOnClose, onClickOutside: handleOnClickOutside, onTransitionEnd: handleOnTransitionEnd, onFocusSet: handleOnFocus, width: width, minWidth: minWidth, maxWidth: maxWidth, height: height, minHeight: minHeight, maxHeight: maxHeight, role: otherProps['role'], backgroundColor: otherProps.backgroundColor, "aria-describedby": otherProps['aria-describedby'], "aria-label": otherProps['aria-label'], "aria-labelledby": otherProps['aria-labelledby'], children: children }) }));
    }, "Popup", { "slots": { "": {} }, "properties": { "opened": { "type": "boolean", "writeback": true }, "launcher": { "type": "string|Element" }, "anchor": { "type": "string|Element|object" }, "placement": { "type": "string", "enumValues": ["center", "end", "start", "top", "bottom", "top-start", "top-end", "top-start-corner", "top-end-corner", "start-top", "start-bottom", "start-top-corner", "start-bottom-corner", "bottom-start", "bottom-end", "bottom-start-corner", "bottom-end-corner", "end-top", "end-bottom", "end-top-corner", "end-bottom-corner"] }, "modality": { "type": "string", "enumValues": ["modal", "modeless"] }, "autoDismiss": { "type": "string", "enumValues": ["none", "focusLoss"] }, "tail": { "type": "string", "enumValues": ["none", "simple"] }, "variant": { "type": "string", "enumValues": ["standard", "unstyled"] }, "initialFocus": { "type": "string", "enumValues": ["auto", "none", "popup", "firstFocusable"] }, "offset": { "type": "object", "properties": { "x": { "type": "number" }, "y": { "type": "number" } } }, "collision": { "type": "string", "enumValues": ["none", "flip", "fit", "flipfit", "flipcenter"] }, "width": { "type": "number|string" }, "minWidth": { "type": "number|string" }, "maxWidth": { "type": "number|string" }, "height": { "type": "number|string" }, "minHeight": { "type": "number|string" }, "maxHeight": { "type": "number|string" }, "backgroundColor": { "type": "string" } }, "events": { "ojOpen": {}, "ojBeforeClose": { "cancelable": true }, "ojClose": {}, "ojFocus": {} }, "extension": { "_WRITEBACK_PROPS": ["opened"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "aria-label", "aria-labelledby", "id", "role"] } }, { "opened": false, "collision": "fit", "modality": "modeless", "initialFocus": "auto", "autoDismiss": "focusLoss", "tail": "none", "variant": "standard", "maxWidth": "calc(100vw - 3rem)", "maxHeight": "calc(100vh - 3rem)" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});
