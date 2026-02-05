define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent", "@oracle/oraclejet-preact/UNSAFE_Layer", "@oracle/oraclejet-preact/UNSAFE_Dialog", "preact/hooks", "ojs/ojcontext", "css!oj-c/dialog/dialog-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, ojvcomponent_1, UNSAFE_Layer_1, UNSAFE_Dialog_1, hooks_1, Context) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Dialog = void 0;
    const LAYER_CONTENT = Symbol.for('__oj_c_layer_content');
    exports.Dialog = (0, ojvcomponent_1.registerCustomElement)('oj-c-dialog', 
    /**
     * @classdesc
     * <h3 id="dialogOverview-section">
     *   JET Dialog
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#dialogOverview-section"></a>
     * </h3>
     * <p>
     *   Description: A Dialog is a floating window that typically contains a header, content and footer area.
     *   A Dialog is typically modal and centered in viewport. The dialog window can be moved by dragging on the title area,
     *   and closed with the 'x' icon (by default). Dialogs can also be resized by dragging on edges or corners of the dialog component.
     * </p>
     * <p>
     *   If the content length exceeds the maximum height, a scrollbar will automatically appear.
     * </p>
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-c-dialog opened="true">
     *    &lt;div slot="header">Dialog Header&lt;/div>
     *    &lt;div slot="body">Dialog Body&lt;/div>
     *    &lt;div slot="footer">Dialog Footer&lt;/div>
     * &lt;/oj-c-dialog>
     *
     * Main section content
     * </code></pre>
     *
     * <h3 id="focus-section">
     *   Focus
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#focus-section"></a>
     * </h3>
     *
     * <p>Upon opening a dialog, focus is automatically moved to the first item that matches the following:</p>
     * <ol>
     *  <li>The first <code>:tabbable</code> element within the dialog body</li>
     *  <li>The first <code>:tabbable</code> element within the dialog footer</li>
     *  <li>The dialog's close button</li>
     *  <li>The dialog itself</li>
     * </ol>
     * <p>The use of the HTML <code>autofocus</code> global attribute is discouraged.
     * If specified, the dialog will try to honor it but it may have undesirable implications for accessibility.
     * For more details, see the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/autofocus#accessibility_concerns">Accessibility concerns section</a>.</p>
     *
     * <p>While open, the dialog widget ensures that tabbing cycles focus between elements within the dialog itself, not elements outside of it. Modal dialogs additionally prevent mouse users from clicking on elements outside of the dialog.</p>
     *
     * <p>Upon closing a dialog, focus is automatically returned to the element that had focus when the dialog was opened.</p>
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
     *       <td rowspan = "3">Dialog</td>
     *       <td><kbd>Tab</kbd> or <kbd>Shift + Tab</kbd></td>
     *       <td>Navigate the content of the Dialog.</td>
     *    </tr>
     *    <tr>
     *      <td><kbd>F6</kbd></td>
     *      <td>Move focus to the launcher for a Dialog with modeless modality.</td>
     *    </tr>
     *    <tr>
     *      <td><kbd>Esc</kbd></td>
     *      <td>Close the Dialog.</td>
     *    </tr>
     *    <tr>
     *       <td>Dialog Close Icon</td>
     *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
     *       <td>Close the Dialog.</td>
     *     </tr>
     *    <tr>
     *      <td rowspan = "1">Dialog Launcher</td>
     *      <td><kbd>F6</kbd></td>
     *      <td>Move focus to the first tab stop within the open Dialog. If there is not a tab stop
     *          within the content, focus is established on the Dialog.</td>
     *     </tr>
     *  </tbody>
     * </table>
     *
     * <h3 id="touch-section">
     *   Touch End User Information
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
     * </h3>
     *
     * <table class="keyboard-table">
     *  <thead>
     *    <tr>
     *      <th>Target</th>
     *      <th>Gesture</th>
     *      <th>Action</th>
     *    </tr>
     *  </thead>
     *  <tbody>
     *    <tr>
     *       <td rowspan = "3">Dialog Close Icon</td>
     *       <td>Tap</td>
     *       <td>Close the Dialog</td>
     *    </tr>
     *  </tbody>
     * </table>
     *
     * <h3>
     *   Sizing
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#sizing"></a>
     * </h3>
     *
     * <p> Dialog dimensions, including <code class="prettyprint"> height, width, min-width, max-width, min-height</code> and <code class="prettyprint">max-height</code> are defined with attriutes. The default dialog dimensions are the following:
     *
     * <ul>
     *  <li> <code class="prettyprint">height: auto</code> </li>
     *  <li> <code class="prettyprint">width: 600px</code> </li>
     *  <li> <code class="prettyprint">min-width: 200px</code> </li>
     *  <li> <code class="prettyprint">max-width: min(600px, 90vw)</code> </li>
     *  <li> <code class="prettyprint">max-height: min(600px, 90vh)</code> </li>
     * </ul>
     *
     * In most cases, you will want to use the default <code class="prettyprint">height:auto</code>, since this will automatically adjust the height based on the content.
     * Users can change the dialog dimensions using style attributes:
     *
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-c-dialog id="wideDialog" title="Wide Dialog" width="400px" min-width="100px" max-width="500px"&gt;
     *    &lt;div slot="body"&gt;
     *       &lt;p&gt; Dialog Text
     *    &lt;/div&gt;
     * &lt;/oj-c-dialog&gt;
     * </code></pre>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     * <h4> role </h4>
     * By default, the role will be set to dialog.
     * This can be observed by inspecting the DOM:
     *
     * <pre class="prettyprint">
     * <code>
     *  &lt;div class="ojdialog ..." role="dialog"&gt;
     * </code></pre>
     *
     * This can be changed using the role attribute. WAI-ARIA recommends that role="dialog" be used if the dialog expects input (such as text input),
     * otherwise, use the role attribute to assign role="alertdialog".
     *
     * <h4> aria-labelledby </h4>
     *
     * For simple dialog headers specified using the dialog-title attribute, the dialog component takes care of the
     * <code class="prettyprint">aria-labelledby</code> attribute and sets it automatically unless explicitly specified by the user.
     * For custom dialog headers specified using the header slot, the user is responsible for setting the
     * <code class="prettyprint">aria-labelledby</code> attribute and its association with the custom header content.
     *
     * <h4> aria-describedby </h4>
     *
     * If the dialog contains additional descriptive text besides the dialog title, this text can be associated
     * with the dialog using the <code class="prettyprint">aria-describedby</code> attribute. Unlike the
     * <code class="prettyprint">aria-labelledby</code> association,
     * the <code class="prettyprint">aria-describedby</code> attribute is never generated and set automatically.
     * It is up to the user to specify the attribute
     * on <code class="prettyprint">oj-dialog</code> and link it to the element containing the additional description:
     *
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-c-dialog id="dialog" title="Accessible Title" aria-describedby="desc"&gt;
     *    &lt;div slot="body"&gt;
     *       &lt;p id="desc"&gt; This is a dialog with accessible description.
     *    &lt;/div&gt;
     * &lt;/oj-c-dialog&gt;
     * </code></pre>
     *
     * <h3 id="reparenting-section">
     *   Reparenting
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#reparenting-section"></a>
     * </h3>
     * <p id="reparenting-strategy">
     *    When dialogs are open, they will be reparented in the document and reparented back when
     *    closed. When open, the location of the dialog within the document will be in context of
     *    how it's used. Dialogs open from other dialogs will be relocated in the document into the
     *    nearest parent dialog's layer. The dialogs layer defines its z-index weight "stacking
     *    context".
     *    The context of opening is defined by the launcher argument passed to the open method.  If
     *    not open from another dialog, the dialog will be reparented to a container in the document
     *    body. Dialogs of the same type are assigned the same z-index values.  The layering between
     *    peer popups reflect the opening order.
     * </p>
     * <p>
     *     There are known caveats with this design. However, these scenarios are considered "bad use"
     *     based on our JET popup strategy.
     *  </p>
     *  <ol>
     *    <li>Events raised within the dialog will not bubble up to the dialog's original ancestors.
     *        Instead, listeners for dialog events should be applied to either the dialog's root
     *        element, or the document.</li>
     *    <li>Likewise, developers should not use CSS descendant selectors, or similar logic, that
     *        assumes that the popup will remain a child of its original parent.</li>
     *    <li>Dialogs containing iframes are problematic.  The iframe elements "may" fire a HTTP GET
     *        request for its src attribute each time the iframe is reparented in the document.</li>
     *    <li>If an iframe is added to the dialog's content, it must not be the first or last tab stop
     *        within the popup or keyboard and VoiceOver navigation will not remain within the dialog.</li>
     *    <li>In some browsers, reparenting a dialog that contains elements having overflow, will cause
     *        these overflow elements to reset their scrollTop.</li>
     *  </ol>
     *
     * <h3 id="rtl-section">
     *   Reading direction
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#rtl-section"></a>
     * </h3>
     *
     * <p> Setting the reading direction (LTR or RTL) is supported by setting the <code class="prettyprint">"dir"</code> attribute on the
     * <code class="prettyprint">&lt;html></code> element of the page.  As with any JET component, in the unusual case that the reading direction
     * is changed post-init, the dialog must be <code class="prettyprint">refresh()</code>ed, or the page must be reloaded.
     *
     *<h3>Additional Examples</h3>
     *
     * <p> The following defines a basic dialog, with an ok button in the footer:
     *
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-c-dialog id="dialogWithFooter" dialog-title="Dialog with Footer" width=400px" min-width="100px" max-widt="500px"&gt;
     *    &lt;div slot="body"&gt;
     *       &lt;p&gt; Dialog Text
     *    &lt;/div&gt;
     *    &lt;div slot="footer"&gt;
     *       &lt;oj-button id="okButton"&gt; OK &lt;/oj-button&gt;
     *    &lt;/div&gt;
     * &lt;/oj-c-dialog&gt;
     *
     * </code></pre>
     *
     * Note that you will need to define your own event handlers for the ok and close buttons (see the demos for examples of this).
     *
     * <p> A dialog with user-defined header is shown next. Arbitrary header content can be defined using a user-defined header.
     *
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-c-dialog id="dialog" dialog-title="Dialog Title"&gt;
     *    &lt;div slot="header"&gt;
     *       &lt;span id="dialog-title-id" class="dialog-title"&gt; User Defined Header&lt;/span&gt;
     *    &lt;/div&gt;
     *    &lt;div slot="body"&gt;
     *       &lt;p&gt; Dialog Text
     *    &lt;/div&gt;
     * &lt;/oj-dialog&gt;
     * </code></pre>
     *
     *
     * @ojmetadata description 'A Dialog is a floating window that typically contains a header, content and footer area.
     * A Dialog is typically modal and centered in viewport.'
     * @ojmetadata displayName 'Dialog'
     * @ojmetadata help 'oj-c.Dialog.html'
     * @ojmetadata main 'oj-c/dialog'
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "19.0.0",
     *     "value": ["oj-dialog"]
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Layout & Nav"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/dialog"
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-dialog",
     *     "uxSpecs": [
     *       "dialog"
     *     ]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *      "header",
     *      "body",
     *      "footer",
     *      "cancelBehavior",
     *      "dialogTitle",
     *      "dragAffordance",
     *      "headerDecoration",
     *      "launcher,
     *      "modality"
     *      "opened"
     *      "resizeBehavior",
     *      "role",
     *      "anchor",
     *      "placement",
     *      "offset",
     *      "collision",
     *      "onOpenedChanged",
     *      "onOjOpen",
     *      "onOjBeforeClose",
     *      "onOjClose",
     *      "onOjFocus",
     *      // Sizing interpolations
     *      "width",
     *      "minWidth",
     *      "maxWidth",
     *      "height",
     *      "minHeight",
     *      "maxHeight",
     *     ]
     *   }
     * ]
     * @ojmetadata since "18.0.0"
     */
    ({ id, header, body, footer, cancelBehavior = 'none', dialogTitle, dragAffordance = 'none', headerDecoration = 'on', launcher, modality = 'modal', opened = false, resizeBehavior = 'none', anchor, placement, offset, onOjOpen, onOjBeforeClose, onOjClose, onOjFocus, 
    // Drag&Resize
    onOjDragStart, onOjDragMove, onOjDragEnd, onOjResizeStart, onOjResize, onOjResizeEnd, onOpenedChanged, 
    // role = "dialog",
    // Sizing interpolations
    width, minWidth, maxWidth, height, minHeight, maxHeight, ...otherProps }) => {
        const rootRef = (0, hooks_1.useRef)(null);
        const anchorRef = (0, hooks_1.useRef)(null);
        const launcherRef = (0, hooks_1.useRef)(null);
        const resolveBusyState = (0, hooks_1.useRef)();
        const didMountRef = (0, hooks_1.useRef)(false);
        const addBusyState = (0, hooks_1.useCallback)((desc) => {
            return rootRef.current
                ? Context.getContext(rootRef.current)
                    .getBusyContext()
                    .addBusyState({ description: `oj-c-dialog id='${id}' is ${desc}` })
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
        let defaultPlacement = placement;
        const isObject = (value) => {
            return typeof value === 'object' && !Array.isArray(value) && value !== null;
        };
        // Resolve launcher to pass launcherRef to Preact Dialog.
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
        if (!placement) {
            if (!anchor || anchor instanceof Window || anchor === 'window') {
                defaultPlacement = 'center';
            }
            else {
                defaultPlacement = 'bottom-start';
            }
        }
        // Resolve anchor to pass anchorRef to Preact Popup.
        // Similarly to launcher (see above) we allow 'string | Element' for anchor here.
        // Anchor can remain undefinyarn ed (anchorRef.current === undefined) to default to Window.
        let localAnchor;
        if (anchor instanceof Window || anchor === 'window') {
            localAnchor = undefined;
        }
        else if (typeof anchor === 'string') {
            // 2a. Custom anchor (string)
            const queriedAnchor = document.querySelector(anchor);
            localAnchor = queriedAnchor;
        }
        else if (anchor instanceof Element) {
            // 2b. Custom anchor (Element) or default to 'launcher'
            localAnchor = document.body.contains(anchor) ? anchor : undefined;
        }
        else if (isObject(anchor)) {
            if (typeof anchor?.x === 'number' && typeof anchor?.y === 'number') {
                // Coord type, (unlike Offset, x and y are mandatory in Coord)
                localAnchor = anchor;
            }
        }
        const handleOnClose = async (detail) => {
            if (cancelBehavior != 'none') {
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
            }
        };
        const handleOnTransitionEnd = async (value) => {
            // Resolve and reset busy state
            if (resolveBusyState.current) {
                resolveBusyState.current();
                resolveBusyState.current = undefined;
            }
            if (value) {
                // Dialog's opening gets finished
                onOjOpen?.();
            }
            else {
                // Dialog's closing gets finished
                onOjClose?.();
            }
        };
        const handleOnFocus = () => {
            onOjFocus?.();
        };
        const convertDragMovePayload = (detail) => {
            const originalPosition = {
                x: detail.originalPosition.x,
                y: detail.originalPosition.y
            };
            const position = { x: detail.position.x, y: detail.position.y };
            return { originalPosition, position };
        };
        const convertResizePayload = (detail) => {
            const originalPosition = {
                x: detail.originalPosition.x,
                y: detail.originalPosition.y
            };
            const position = { x: detail.position.x, y: detail.position.y };
            const originalSize = {
                width: detail.originalSize.width,
                height: detail.originalSize.height
            };
            const size = { width: detail.size.width, height: detail.size.height };
            return { originalPosition, position, originalSize, size };
        };
        const handleOnDragStart = (detail) => {
            onOjDragStart?.(convertDragMovePayload(detail));
        };
        const handleOnDragMove = (detail) => {
            onOjDragMove?.(convertDragMovePayload(detail));
        };
        const handleOnDragEnd = (detail) => {
            onOjDragEnd?.(convertDragMovePayload(detail));
        };
        const handleOnResizeStart = (detail) => {
            onOjResizeStart?.(convertResizePayload(detail));
        };
        const handleOnResize = (detail) => {
            onOjResize?.(convertResizePayload(detail));
        };
        const handleOnResizeEnd = (detail) => {
            onOjResizeEnd?.(convertResizePayload(detail));
        };
        const { width: flexibleCompWidth, height: flexibleCompHeight, anchorRef: flexibleCompAnchorRef, ...flexibleCompProps } = (0, UNSAFE_Dialog_1.useFlexibleComponent)({
            isDraggable: dragAffordance === 'header',
            isResizable: resizeBehavior === 'resizable',
            onDragStart: handleOnDragStart,
            onDragMove: handleOnDragMove,
            onDragEnd: handleOnDragEnd,
            onResizeStart: handleOnResizeStart,
            onResize: handleOnResize,
            onResizeEnd: handleOnResizeEnd
        });
        // Set refs for Pract API
        anchorRef.current = localAnchor;
        launcherRef.current = localLauncher;
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, id: id, children: (0, jsx_runtime_1.jsx)(UNSAFE_Dialog_1.Dialog, { ref: preactRef, header: header || dialogTitle, launcherRef: launcherRef, footer: footer, modality: modality, isOpen: opened, cancelBehavior: cancelBehavior, resizeBehavior: resizeBehavior, 
                // Draggable, Resizable
                dragAffordance: dragAffordance, headerDecoration: headerDecoration, ...flexibleCompProps, 
                // Position
                anchorRef: flexibleCompAnchorRef || anchorRef, placement: flexibleCompAnchorRef ? defaultPlacement : placement, offset: flexibleCompAnchorRef ? 0 : offset, onClose: handleOnClose, onTransitionEnd: handleOnTransitionEnd, onFocusSet: handleOnFocus, width: flexibleCompWidth || width, minWidth: minWidth, maxWidth: maxWidth, height: flexibleCompHeight || height, minHeight: minHeight, maxHeight: maxHeight, role: otherProps['role'], "aria-describedby": otherProps['aria-describedby'], "aria-label": otherProps['aria-label'], "aria-labelledby": otherProps['aria-labelledby'], children: body }) }));
    }, "Dialog", { "slots": { "header": {}, "body": {}, "footer": {} }, "properties": { "cancelBehavior": { "type": "string", "enumValues": ["none", "icon", "escape"] }, "dialogTitle": { "type": "string" }, "dragAffordance": { "type": "string", "enumValues": ["none", "header"] }, "headerDecoration": { "type": "string", "enumValues": ["off", "on"] }, "launcher": { "type": "string|Element" }, "modality": { "type": "string", "enumValues": ["modal", "modeless"] }, "opened": { "type": "boolean", "writeback": true }, "resizeBehavior": { "type": "string", "enumValues": ["none", "resizable"] }, "anchor": { "type": "string|Element|object" }, "placement": { "type": "string", "enumValues": ["center", "end", "start", "top", "bottom", "top-start", "top-end", "start-top", "start-bottom", "bottom-start", "bottom-end", "end-top", "end-bottom"] }, "offset": { "type": "number|object" }, "width": { "type": "number|string" }, "minWidth": { "type": "number|string" }, "maxWidth": { "type": "number|string" }, "height": { "type": "number|string" }, "minHeight": { "type": "number|string" }, "maxHeight": { "type": "number|string" } }, "events": { "ojOpen": {}, "ojBeforeClose": { "cancelable": true }, "ojClose": {}, "ojFocus": {}, "ojDragStart": {}, "ojDragMove": {}, "ojDragEnd": {}, "ojResizeStart": {}, "ojResize": {}, "ojResizeEnd": {} }, "extension": { "_WRITEBACK_PROPS": ["opened"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-describedby", "aria-label", "aria-labelledby", "role", "id"] } }, { "cancelBehavior": "none", "dragAffordance": "none", "headerDecoration": "on", "modality": "modal", "opened": false, "resizeBehavior": "none" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});
