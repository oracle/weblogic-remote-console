define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_Toolbar", "@oracle/oraclejet-preact/hooks/UNSAFE_useTabbableMode", "ojs/ojvcomponent", "./items-toolbar"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_Toolbar_1, UNSAFE_useTabbableMode_1, ojvcomponent_1, items_toolbar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Toolbar = void 0;
    exports.Toolbar = (0, ojvcomponent_1.registerCustomElement)('oj-c-toolbar', 
    /**
     * @classdesc
     * <h3 id="toolbarOverview-section">
     *   JET Toolbar
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#toolbarOverview-section"></a>
     * </h3>
     * <p>Description: A toolbar displays a strip of control elements such as buttons and menu buttons, often grouped by separators.</p>
     *
     * <pre class="prettyprint"><code>&lt;oj-c-toolbar items="[[toolbarItems]]">
     * &lt;/oj-c-toolbar>
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
     *       <th>Gesture</th>
     *       <th>Action</th>
     *     </tr>
     *   </thead>
     *   <tbody>
     *  <tr>
     *     <td>Navigate right</td>
     *     <td>
     *       <kbd>Right Arrow Key</kbd> or <kbd>Left Arrow Key(RTL)</kbd>
     *     </td>
     *     <td>Change focus to next item on the right</td>
     *   </tr>
     *   <tr>
     *     <td>Navigate left</td>
     *     <td>
     *       <kbd>Left Arrow Key</kbd> or <kbd>Right Arrow Key(RTL)</kbd>
     *     </td>
     *     <td>Change focus to next item on the left</td>
     *   </tr>
     *  </tbody>
     * </table>
     *
     * <h3 id="a11y-section">
     *   Accessibility
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     *
     * <p>JET Toolbar takes care of focus management, as noted above.
     *
     * <p>The application is responsible for applying <code class="prettyprint">aria-label</code> and/or
     * <code class="prettyprint">aria-controls</code> attributes to the toolbar element, if applicable per the instructions that follow:
     *
     * <p>If this toolbar is (or might be) placed in context with other toolbars, then the application should apply an
     * <code class="prettyprint">aria-label</code> to the toolbar element to distinguish it, e.g. an "Edit" toolbar.  The
     * <code class="prettyprint">aria-label</code> is optional when there is only one toolbar.
     *
     * <p>If the toolbar is controlling something else on the page, e.g. bold / italic / underline buttons controlling a rich
     * text editor, then the application should apply an <code class="prettyprint">aria-controls</code> attribute to the toolbar element,
     * e.g. <code class="prettyprint">aria-controls="myTextEditor"</code>.
     *
     * {@include accessibility_doc.ts#a11y-section-disabled-content}
     *
     * @ojmetadata description "A toolbar displays a strip of control elements such as buttons and menu buttons, often grouped by separators."
     * @ojmetadata displayName "Toolbar"
     * @ojmetadata help "oj-c.Toolbar.html"
     * @ojmetadata main "oj-c/toolbar"
     * @ojmetadata since "18.0.0"
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "18.0.0",
     *     "value": ["oj-toolbar"]
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Controls"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/toolbar"
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-toolbar",
     *     "uxSpecs": [
     *       "toolbar"
     *     ]
     *   }
     * }
     */
    ({ 'aria-controls': ariaControls, 'aria-label': ariaLabel, spacing, size, chroming, items = [], toolbarSelection = {}, onToolbarSelectionChanged, onOjToolbarAction, onOjToolbarSelection }) => {
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_Toolbar_1.Toolbar, { "aria-controls": ariaControls, "aria-label": ariaLabel, spacing: spacing, children: (0, jsx_runtime_1.jsx)(items_toolbar_1.ItemsToolbar, { items: items, size: size, chroming: chroming, toolbarSelection: toolbarSelection, onToolbarSelectionChanged: onToolbarSelectionChanged, onOjToolbarAction: onOjToolbarAction, onOjToolbarSelection: onOjToolbarSelection }) }) }));
    }, "Toolbar", { "properties": { "spacing": { "type": "string", "enumValues": ["sm", "lg"] }, "chroming": { "type": "string", "enumValues": ["borderless", "outlined"] }, "size": { "type": "string", "enumValues": ["sm", "md", "lg"] }, "items": { "type": "Array<object>" }, "toolbarSelection": { "type": "object", "writeback": true } }, "events": { "ojToolbarAction": { "bubbles": true }, "ojToolbarSelection": { "bubbles": true } }, "extension": { "_WRITEBACK_PROPS": ["toolbarSelection"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-controls", "aria-label"] } }, { "items": [], "toolbarSelection": {} }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    }, { consume: [UNSAFE_useTabbableMode_1.TabbableModeContext] });
});
