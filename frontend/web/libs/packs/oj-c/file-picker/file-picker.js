define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_FilePicker", "preact/hooks", "preact/compat", "ojs/ojvcomponent", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "../utils/UNSAFE_focusTabUtils/focusUtils", "css!oj-c/file-picker/file-picker-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_FilePicker_1, hooks_1, compat_1, ojvcomponent_1, UNSAFE_useTabbableMode_1, focusUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FilePicker = void 0;
    const getPrimaryText = (primaryText) => {
        if (typeof primaryText === 'function') {
            return primaryText();
        }
        return primaryText;
    };
    const getSecondaryText = (secondaryText, selectionMode) => {
        if (typeof secondaryText === 'function') {
            return secondaryText({ selectionMode: selectionMode });
        }
        return secondaryText;
    };
    exports.FilePicker = (0, ojvcomponent_1.registerCustomElement)('oj-c-file-picker', (0, compat_1.forwardRef)(
    /**
     * @classdesc
     * <h3 id="filePickerOverview-section">
     *   JET File Picker
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#filePickerOverview-section"></a>
     * </h3>
     * <p>Description:</p>
     * <p>By default the file picker shows a clickable dropzone for selecting files for upload. However, it can be replaced with any clickable element like a button. After the files are selected, the FilePicker fires a "select" event with the selected files. Application has to specify the listener in order to do the actual upload.  The types of files accepted are controlled by the accept attribute.  Additional custom validation can be done through the ojBeforeSelect event.</p>
     *
     * <pre class="prettyprint"><code>&lt;oj-c-file-picker >&lt;/oj-c-file-picker></code></pre>
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     * <p>
     * {@include accessibility_doc.ts#a11y-section-disabled-content}
     * </p>
     *
     * <h3 id="touch-section">
     * Touch End User Information
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
     * </h3>
     *
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *      <th>Target</th>
     *       <th>Gesture</th>
     *       <th>Action</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td>Clickable element</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Launch the browser's file picker.</td>
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
     *       <td>Clickable element</td>
     *       <td><kbd>Enter</kbd></td>
     *       <td>Launch the browser's file picker.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     *
     *
     * @ojmetadata description "A file picker displays a clickable dropzone for selecting files from the device storage."
     * @ojmetadata displayName "File Picker"
     * @ojmetadata help "oj-c.FilePicker.html"
     * @ojmetadata main "oj-c/file-picker"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "15.0.0",
     *     "value": ["oj-file-picker"]
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Controls"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/file-picker"
     *   },
     *   "oracle": {
     *    "icon": "oj-ux-ico-file-image",
     *     "uxSpecs": [
     *       "file-picker"
     *     ]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "accept",
     *       "selectionMode",
     *       "disabled",
     *       "primaryText",
     *       "secondaryText"
     *     ]
     *   }
     * ]
     * @ojmetadata since "14.0.0"
     */
    ({ capture = 'none', disabled = false, selectionMode = 'multiple', trigger, accept, primaryText, secondaryText, onOjBeforeSelect, onOjSelect, onOjInvalidSelect, ...otherProps }, ref) => {
        // this promise is used by the doSelectHelper to tell the webelement test file has been selected/rejected
        const elementPromiseResolverRef = (0, hooks_1.useRef)(null);
        const resolveTestPromise = (0, hooks_1.useCallback)(() => {
            if (elementPromiseResolverRef.current) {
                elementPromiseResolverRef.current();
                elementPromiseResolverRef.current = null;
            }
        }, []);
        const onCommit = (0, hooks_1.useCallback)((event) => {
            onOjBeforeSelect?.({ files: event.files }).then(() => {
                resolveTestPromise();
                onOjSelect?.({ files: event.files });
            }, (messages) => {
                resolveTestPromise();
                onOjInvalidSelect?.({ messages: messages, until: null });
            });
        }, [onOjBeforeSelect, onOjSelect, onOjInvalidSelect, resolveTestPromise]);
        const onReject = (0, hooks_1.useCallback)((event) => {
            resolveTestPromise();
            onOjInvalidSelect?.(event);
        }, [onOjInvalidSelect, resolveTestPromise]);
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            focus: () => (0, focusUtils_1.focusFirstTabStop)(rootRef.current),
            blur: () => {
                const focusElement = document.activeElement;
                if (rootRef.current?.contains(focusElement)) {
                    focusElement.blur();
                }
            }
        }));
        const rootRef = (0, hooks_1.useRef)(null);
        const preactRef = (0, hooks_1.useRef)(null);
        const BaseFilePicker = UNSAFE_FilePicker_1.FilePicker;
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, class: trigger ? 'oj-c-file-picker-with-trigger' : undefined, children: (0, jsx_runtime_1.jsx)(BaseFilePicker, { __testHandlerSymbol: preactRef, capture: capture === null ? undefined : capture, isDisabled: disabled, selectionMode: selectionMode, onCommit: onCommit, onReject: onReject, accept: accept === null ? undefined : accept, primaryText: getPrimaryText(primaryText), secondaryText: getSecondaryText(secondaryText, selectionMode), "aria-label": otherProps['aria-label'], width: "100%", children: trigger }) }));
    }), "FilePicker", { "properties": { "accept": { "type": "Array<string>|null" }, "capture": { "type": "string|null", "enumValues": ["none", "environment", "user", "implementation"] }, "disabled": { "type": "boolean" }, "primaryText": { "type": "string|function" }, "secondaryText": { "type": "string|function" }, "selectionMode": { "type": "string", "enumValues": ["multiple", "single"] } }, "slots": { "trigger": {} }, "events": { "ojBeforeSelect": { "cancelable": true }, "ojInvalidSelect": {}, "ojSelect": {} }, "extension": { "_OBSERVED_GLOBAL_PROPS": ["aria-label"] }, "methods": { "focus": {}, "blur": {} } }, { "capture": "none", "disabled": false, "selectionMode": "multiple" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
});
