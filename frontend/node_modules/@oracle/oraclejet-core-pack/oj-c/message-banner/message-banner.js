define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_MessageBanner", "@oracle/oraclejet-preact/hooks/UNSAFE_useMessagesContext", "ojs/ojvcomponent", "preact/hooks", "../hooks/UNSAFE_useDataProvider/useDataProvider", "ojs/ojcontext", "css!oj-c/message-banner/message-banner-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_MessageBanner_1, UNSAFE_useMessagesContext_1, ojvcomponent_1, hooks_1, useDataProvider_1, Context) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MessageBanner = void 0;
    const severityOrder = {
        error: 0,
        warning: 1,
        info: 2,
        confirmation: 3,
        none: 4
    };
    const severityLevels = Object.keys(severityOrder).length;
    /**
     * Compares two message items and sort them based on the following order:
     * 1. Descending order of severity - error > warning > info > confirmation > none
     * 2. Then reverse chronological order based on timestamp property
     * 3. For same severity and same or missing timestamp, both items are treated as equal and the
     *    order will be determined by the order they appear in the original data.
     * @param param0 First message item to compare
     * @param param1 Second message item to compare
     * @returns The comparison result
     */
    const severitySort = ({ data: dataA }, { data: dataB }) => {
        // If severity is undefined, set to the highest value
        const severityA = dataA.severity ? severityOrder[dataA.severity] : severityLevels;
        const severityB = dataB.severity ? severityOrder[dataB.severity] : severityLevels;
        if (severityA !== severityB) {
            return severityA - severityB;
        }
        // If severity is the same, compare timestamp
        if (dataA.timestamp && dataB.timestamp) {
            const valueA = new Date(dataA.timestamp).valueOf();
            const valueB = new Date(dataB.timestamp).valueOf();
            return valueB - valueA;
        }
        // return 0 if severity is the same and timestamp(s) are missing
        return 0;
    };
    /**
     * @classdesc
     * <h3 id="bannerOverview-section">
     *   JET Message Banner
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#bannerOverview-section"></a>
     * </h3>
     * <p>Description:</p>
     * <p>Message banners are brief, moderately disruptive, semi-permanent messages that help communicate
     * relevant and useful information in the context of the current page or actions in progress,
     * without blocking the interaction on that page.</p>
     *
     * <h4 id="messages-syntax-section">
     *  Syntax
     *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#messages-syntax-section"></a>
     * </h4>
     * Message Banner can be created with the following markup.</p>
     *
     * <pre class="prettyprint"><code>
     * &lt;oj-c-message-banner data="[[messages]]" type="page">
     * &lt;/oj-c-message-banner>
     * </code></pre>
     *
     * <p>The Message Banner component will show messages based on the data provided keeping it as a single
     * source of truth. Applications should register a listener for the ojClose event to be notified
     * when one performs an action that requires a message to be closed. The application then should use the
     * event payload to identify and remove the corresponding row from the data which would then close the
     * message.</p>
     *
     * <pre class="prettyprint"><code>
     * &lt;oj-c-message-banner data="[[messages]]" type="page" on-oj-close="[[handleClose]]">
     * &lt;/oj-c-message-banner>
     * </code></pre>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>The <code class="prettyprint">MessageBannerItem["sound"]</code> property is an accessibility
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
     *       <td rowspan="4">Focus within Messages</td>
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
     * <p>MessageBanner supports the following custom data attributes.
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
     *         <pre class="prettyprint"><code>&lt;oj-c-message-banner
     *   data="[[messages]]"
     *   type="page"
     *   detail-template-value="detailText">
     *   &lt;!-- Template for rendering custom detail text -->
     *   &lt;template slot="detailText" data-oj-as="message">
     *     &lt;!-- The detail text -->
     *     &lt;div>
     *       &lt;span>&lt;oj-bind-text value="[[message.data.detail]]">&lt;/oj-bind-text>&lt;/span>
     *     &lt;/div>
     *   &lt;/template>
     * &lt;/oj-c-message-banner></code></pre>
     *       </td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @typeparam K Type of key of the dataprovider. It can either be a string or a number.
     * @typeparam D Type of the data from the dataprovider. It must extend the MessageBannerItem type.
     * @ojmetadata description "Message Banners are brief, moderately disruptive, semi-permanent messages that help communicate relevant and useful information."
     * @ojmetadata displayName "Message Banner"
     * @ojmetadata main "oj-c/message-banner"
     * @ojmetadata help "oj-c.MessageBanner.html"
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Controls"
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-message-banner",
     *     "uxSpecs": ["bannerMessages"]
     *   },
     *   "vbdt": {
     *     "defaultColumns": 2,
     *     "minColumns": 1,
     *     "module": "oj-c/message-banner"
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "type"
     *     ]
     *   },
     *   {
     *     "propertyGroup": "data",
     *     "items": [
     *       "data"
     *     ]
     *   }
     * ]
     * @ojmetadata since "16.0.0"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "16.0.0",
     *     "value": ["oj-messages", "oj-message-banner"]
     *   }
     * ]
     */
    function MessageBannerImpl({ data, detailTemplateValue, messageTemplates, type = 'section', sorting = 'severity', onOjClose }) {
        const prevData = (0, hooks_1.useRef)(data);
        const rootRef = (0, hooks_1.useRef)();
        const [dpKey, setDpKey] = (0, hooks_1.useState)(0);
        const addBusyState = (0, hooks_1.useCallback)((description = 'MessageBanner: busyState') => {
            // if the component is not mounted, return a noop
            return rootRef.current
                ? Context.getContext(rootRef.current).getBusyContext().addBusyState({ description })
                : () => { };
        }, []);
        const messagesContext = (0, hooks_1.useMemo)(() => ({ addBusyState }), [addBusyState]);
        if (data != prevData.current) {
            setDpKey((dpKey) => dpKey + 1);
            prevData.current = data;
        }
        const { data: dataArr } = (0, useDataProvider_1.useDataProvider)({
            data,
            addBusyState
        });
        // Sort the data based on the 'sorting' property
        const sortedData = (0, hooks_1.useMemo)(() => {
            // if sorting is off, return the original array
            if (sorting === 'off')
                return dataArr;
            const dataCopy = [...dataArr];
            // sort based on severity as this is the only other supported value
            return dataCopy.sort(severitySort);
        }, [dataArr, sorting]);
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { ref: rootRef, children: (0, jsx_runtime_1.jsx)(UNSAFE_useMessagesContext_1.MessagesContext.Provider, { value: messagesContext, children: (0, jsx_runtime_1.jsx)(UNSAFE_MessageBanner_1.MessageBanner
                // we need to completely rerender the component when the DP is changed
                // as that they message keys in the data array will not hold the same meaning.
                , { data: sortedData, detailRendererKey: detailTemplateValue, renderers: messageTemplates, variant: type, onClose: onOjClose }, `dp-${dpKey}`) }) }));
    }
    // This custom element supports generic parameters, but was introduced before the pattern for exposing
    // generic parameters on the functional value-based element was established.  In order to introduce the generics in
    // a backwards-compatible way, they must be defaulted, but we don't want the defaults to be added to the existing
    // types which had generics from the start.  The solution is to use two consts:
    //   * the first is not exported, but is used as the basis for the custom element types and does not default its generics
    //   * the second is the exported functional value-based element and defaults the generics for backwards compatibility
    const MessageBannerWithoutDefaultedGenerics = (0, ojvcomponent_1.registerCustomElement)('oj-c-message-banner', MessageBannerImpl, "MessageBanner", { "properties": { "data": { "type": "DataProvider" }, "type": { "type": "string", "enumValues": ["page", "section"] }, "detailTemplateValue": { "type": "string|function" }, "sorting": { "type": "string", "enumValues": ["off", "severity"] } }, "extension": { "_DYNAMIC_SLOT": { "prop": "messageTemplates", "isTemplate": 1 } }, "events": { "ojClose": {} } }, { "type": "section", "sorting": "severity" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
    exports.MessageBanner = MessageBannerWithoutDefaultedGenerics;
});
