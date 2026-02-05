define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_MessageToast", "@oracle/oraclejet-preact/hooks/UNSAFE_useMessagesContext", "oj-c/hooks/UNSAFE_useDataProvider/useDataProvider", "ojs/ojvcomponent", "preact/hooks", "ojs/ojcontext", "css!oj-c/message-toast/message-toast-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_MessageToast_1, UNSAFE_useMessagesContext_1, useDataProvider_1, ojvcomponent_1, hooks_1, Context) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MessageToast = void 0;
    /**
     * @classdesc
     * <h3 id="toastOverview-section">
     *   JET Message Toast
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#toastOverview-section"></a>
     * </h3>
     * <p>Description:</p>
     * <p>Message toasts are short, non-critical, auto-dismissible messages that communicate non-disruptive contextual messages.</p>
     * <p>
     *   Toast messages are used to:
     *   <ul>
     *    <li>Communicate messages that are relevant in the moment like the acknowledgement of an action.</li>
     *    <li>Allow user to take actions related to an event or process, such as: retry, undo, view.</li>
     *   </ul>
     * </p>
     *
     * <h4 id="messages-syntax-section">
     *  Syntax
     *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#messages-syntax-section"></a>
     * </h4>
     * Message Toast can be created with the following markup.</p>
     *
     * <pre class="prettyprint"><code>
     * &lt;oj-c-message-toast data="[[messages]]">
     * &lt;/oj-c-message-toast>
     * </code></pre>
     *
     * <p>The Message Toast component will show messages based on the data provided keeping it as a single
     * source of truth. Applications should register a listener for the ojClose event to be notified
     * when one performs an action that requires a message to be closed. The application then should use the
     * event payload to identify and remove the corresponding row from the data which would then close the
     * message.</p>
     *
     * <pre class="prettyprint"><code>
     * &lt;oj-c-message-toast data="[[messages]]" on-oj-close="[[handleClose]]">
     * &lt;/oj-c-message-toast>
     * </code></pre>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>The <code class="prettyprint">MessageToastItem["sound"]</code> property is an accessibility
     * feature for playing a sound when a message is opened. This property defaults to "none", and can
     * be enabled by setting it to "default" or by providing a URL to an audio file of a format that the
     * browser supports. An accessible application must provide a way for users to enable sound on a
     * settings or preferences page. Some browsers will have auto-play disabled by default, enabling
     * it may require adjusting the browser settings.</p>
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
     *       <td rowspan = "4">Focus within Messages</td>
     *       <td><kbd>Tab</kbd> or <kbd>Shift + Tab</kbd></td>
     *       <td>Navigate the content of the messages region.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>F6</kbd></td>
     *       <td>Cycles the focus through all the messages sections on the page starting from the most recent one.
     *           Then finally, moves the focus back to the last focused element outside the messages region.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Esc</kbd></td>
     *       <td>Moves focus back to the last focused element outside the messages region and closes the current message if it is closable.</td>
     *     </tr>
     *     <tr>
     *       <td><kbd>Enter</kbd> or <kbd>Space</kbd></td>
     *       <td>Activates the currently focused element in the message.</td>
     *     </tr>
     *     <tr>
     *       <td rowspan = "1">Focus outside Messages</td>
     *       <td><kbd>F6</kbd></td>
     *       <td>Move focus to the first message within the more recently disclosed messages region.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * <h3 id="data-attributes-section">
     *   Custom Data Attributes
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#data-attributes-section"></a>
     * </h3>
     *
     * <p>MessageToast supports the following custom data attributes.
     * <table class="keyboard-table">
     *   <thead>
     *     <tr>
     *       <th>Name</th>
     *       <th>Description</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *     <tr>
     *       <td><kbd>data-oj-as</kbd></td>
     *       <td><p>Provides an alias for a specific template instance and has the same subproperties as the $current variable.</p>
     *         <pre class="prettyprint"><code>&lt;oj-c-message-toast
     *   data="[[messages]]"
     *   detail-template-value="detailText">
     *   &lt;!-- Template for rendering custom detail text -->
     *   &lt;template slot="detailText" data-oj-as="message">
     *     &lt;!-- The detail text -->
     *     &lt;div>
     *       &lt;span>&lt;oj-bind-text value="[[message.data.detail]]">&lt;/oj-bind-text>&lt;/span>
     *     &lt;/div>
     *   &lt;/template>
     * &lt;/oj-c-message-toast></code></pre>
     *       </td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @typeparam K Type of key of the dataprovider. It can either be a string or a number.
     * @typeparam D Type of the data from the dataprovider. It must extend the MessageToastItem type.
     * @ojmetadata displayName "MessageToast"
     * @ojmetadata description "Toast messages are short, noncritical, auto-dismissible messages that communicate non-disruptive contextual messages."
     * @ojmetadata help "oj-c.MessageToast.html"
     * @ojmetadata main "oj-c/message-toast"
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Controls"
     *   },
     *   "vbdt": {
     *     "defaultColumns": 2,
     *     "minColumns": 1,
     *     "module": "oj-c/message-toast"
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-messages",
     *     "uxSpecs": ["messages-toast-jet"]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "data",
     *     "items": [
     *       "data"
     *     ]
     *   }
     * ]
     * @ojmetadata since "14.0.0"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "15.0.0",
     *     "value": ["oj-messages"]
     *   }
     * ]
     */
    function MessageToastImpl({ data, detailTemplateValue, iconTemplateValue, messageTemplates, offset = 0, position = 'bottom', onOjClose }) {
        const uniqueId = (0, hooks_1.useRef)((0, ojvcomponent_1.getUniqueId)());
        const rootRef = (0, hooks_1.useRef)();
        const [prevData, setPrevData] = (0, hooks_1.useState)(data);
        const [dpKey, setDpKey] = (0, hooks_1.useState)(0);
        const addBusyState = (0, hooks_1.useCallback)((description = 'MessageToast: busyState') => {
            // if the component is not mounted, return a noop
            return rootRef.current
                ? Context.getContext(rootRef.current).getBusyContext().addBusyState({ description })
                : () => { };
        }, []);
        if (data != prevData) {
            setPrevData(data);
            setDpKey((dpKey) => dpKey + 1);
        }
        const { data: dataArr } = (0, useDataProvider_1.useDataProvider)({
            data,
            addBusyState
        });
        const UNSAFE_messagesLayerId = `messageToastLayer_${uniqueId.current}`;
        const messagesContext = (0, hooks_1.useMemo)(() => ({ addBusyState, UNSAFE_messagesLayerId }), [addBusyState, UNSAFE_messagesLayerId]);
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, "data-oj-messages-layer-id": UNSAFE_messagesLayerId, children: (0, jsx_runtime_1.jsx)(UNSAFE_useMessagesContext_1.MessagesContext.Provider, { value: messagesContext, children: (0, jsx_runtime_1.jsx)(UNSAFE_MessageToast_1.MessageToast
                // we need to completely rerender the component when the DP is changed
                // as that they message keys in the data array will not hold the same meaning.
                , { data: dataArr, detailRendererKey: detailTemplateValue, iconRendererKey: iconTemplateValue, offset: offset, onClose: onOjClose, position: position, renderers: messageTemplates }, dpKey) }) }));
    }
    // This custom element supports generic parameters, but was introduced before the pattern for exposing
    // generic parameters on the functional value-based element was established.  In order to introduce the generics in
    // a backwards-compatible way, they must be defaulted, but we don't want the defaults to be added to the existing
    // types which had generics from the start.  The solution is to use two consts:
    //   * the first is not exported, but is used as the basis for the custom element types and does not default its generics
    //   * the second is the exported functional value-based element and defaults the generics for backwards compatibility
    const MessageToastWithoutDefaultedGenerics = (0, ojvcomponent_1.registerCustomElement)('oj-c-message-toast', MessageToastImpl, "MessageToast", { "properties": { "data": { "type": "DataProvider" }, "detailTemplateValue": { "type": "string|function" }, "iconTemplateValue": { "type": "string|function" }, "offset": { "type": "number|object" }, "position": { "type": "string", "enumValues": ["top", "bottom", "top-start", "top-end", "bottom-start", "bottom-end", "top-left", "top-right", "bottom-left", "bottom-right"] } }, "extension": { "_DYNAMIC_SLOT": { "prop": "messageTemplates", "isTemplate": 1 } }, "events": { "ojClose": {} } }, { "offset": 0, "position": "bottom" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
    exports.MessageToast = MessageToastWithoutDefaultedGenerics;
});
