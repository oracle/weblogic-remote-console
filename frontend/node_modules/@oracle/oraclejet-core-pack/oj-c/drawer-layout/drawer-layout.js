define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "@oracle/oraclejet-preact/UNSAFE_DrawerLayout", "ojs/ojvcomponent", "css!oj-c/drawer-layout/drawer-layout-styles.css"], function (require, exports, jsx_runtime_1, translationBundle_1, UNSAFE_DrawerLayout_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DrawerLayout = void 0;
    exports.DrawerLayout = (0, ojvcomponent_1.registerCustomElement)('oj-c-drawer-layout', 
    /**
     * @classdesc
     * <h3 id="drawerLayoutOverview-section">
     *   JET Drawer Layout
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#drawerLayoutOverview-section"></a>
     * </h3>
     * <p>Description: A Drawer Layout adds expandable side contents (drawers) alongside some primary content.
     * These drawers automatically swap 'reflow' and 'overlay' display mode based on width of the page and can be placed at the 'start', 'end' or 'bottom' edge.
     * </p>
     * <pre class="prettyprint">
     * <code>
     * &lt;oj-drawer-layout end-opened="true">
     *
     *    &lt;div slot="start">Start drawer content &lt;/div>
     *    &lt;div slot="end">End drawer content &lt;/div>
     *
     *    Main section content
     *
     * &lt;/oj-drawer-layout>
     * </code></pre>
     *
     * <p id="drawer-layout-popup-section">JET Drawer Popup and Drawer Layout look similar, but are intended to be used
     * for different purposes.</p>
     * <p>Use Drawer Layout</p>
     * <ul>
     *   <li>If you need to switch between the ‘reflow’ display mode (big screens) and ‘overlay’ (small screens).</li>
     *   <li>If the drawer should only fill a specific part of the viewport rather than take its full height (start/end) or full width (bottom).</li>
     *   <li>If modality is not required.</li>
     * </ul>
     * <p>Use Drawer Popup</p>
     * <ul>
     *   <li>If you need to display ‘overlay’ drawers attached to the edge of the viewport that stretch over the full viewport height or width.</li>
     *   <li>If you need modality.</li>
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
     *  Accessibility
     *  <a class="bookmarkable-link" title="Bookmarkable Link" href="#a11y-section"></a>
     * </h3>
     * It is developer’s responsibility to define respective aria properties to meet accessibility requirements.
     * Use <code class="prettyprint">aria-labelledby</code>, <code class="prettyprint">aria-describedby</code> or <code class="prettyprint">aria-label</code> attributes
     * on drawer elements (slots of the Drawer Layout) to make them accessible.
     *
     * <h4>aria-labelledby </h4>
     * If a drawer already has a visible title bar, the text inside that bar can be used to label the dialog itself.
     * Set the value of the <code class="prettyprint">aria-labelledby</code> attribute to be the id of the element used to title the drawer.
     * If there isn't appropriate text visible in the DOM that could be referenced with <code class="prettyprint">aria-labelledby</code>
     * use the <code class="prettyprint">aria-label</code> attribute to define the accessible name of an element.
     *
     * <h4> aria-describedby </h4>
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
     * <p>On mobile resolution side drawers stretch full-height. On non-mobile resolution side drawers stretch
     * to Drawer Layout container's height. The bottom drawer always stretch to Drawer Layout container's width.
     * The other axis dimension is not predefined. This dimension's size is determined by its content.
     * If you want to set a custom size you can use units like px, rem, etc.
     * However because there is no fixed-size parent percentages (%) won’t work,
     * but you can use vw (viewport width) or vh (viewport height) units to achieve a similar effect.</p>
     * <ul>
     *   <li>Note the side drawer's built-in minimal width limit in the 'Overlay' mode.</li>
     *   <li>Note that DrawerLayout animates opening and closing. However, it is app developer's responsibility to add animations for custom runtime changes to a drawer size. See the 'Sizing' cookbook demo for an example.</li>
     * </ul>
     *
     * @ojmetadata description "A Drawer Layout adds expandable side contents (drawers) alongside some primary content."
     * @ojmetadata displayName 'Drawer Layout'
     * @ojmetadata help 'oj-c.DrawerLayout.html'
     * @ojmetadata main 'oj-c/drawer-layout'
     * @ojmetadata status [
     *   {
     *     "type": "supersedes",
     *     "since": "17.0.0",
     *     "value": ["oj-drawer-layout"]
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Layout & Nav"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/drawer-layout"
     *   },
     *   "oracle": {
     *     "icon": "oj-ux-ico-drawer",
     *     "uxSpecs": [
     *       "drawer"
     *     ]
     *   }
     * }
     * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "startOpened",
     *       "endOpened",
     *       "bottomOpened",
     *       "startDisplay",
     *       "endDisplay",
     *       "bottomDisplay"
     *     ]
     *   }
     * ]
     * @ojmetadata since "17.0.0"
     */
    ({ children, start, end, bottom, startOpened = false, endOpened = false, bottomOpened = false, startDisplay = 'auto', endDisplay = 'auto', bottomDisplay = 'auto', onOjBeforeClose, onOjClose, onStartOpenedChanged, onEndOpenedChanged, onBottomOpenedChanged }) => {
        const onOjBeforeCloseHandler = async (detail) => {
            // Allow veto by triggering onOjBeforeClose.
            try {
                // Cancelable ojBeforeClose event
                await onOjBeforeClose?.({
                    edge: detail.placement,
                    reason: 'escapeKey'
                });
                // Trigger writeback event.
                switch (detail.placement) {
                    case 'start':
                        onStartOpenedChanged?.(false);
                        break;
                    case 'end':
                        onEndOpenedChanged?.(false);
                        break;
                    case 'bottom':
                        onBottomOpenedChanged?.(false);
                        break;
                }
            }
            catch (_) {
                // Closing was canceled so short circuit out here
            }
        };
        const onOjCloseHandler = async (detail) => {
            // PreactDrawer TransitionEndDetail callback is triggered on both
            // when drawer opening ends and when drawer closing ends
            // In Core pack DrawerLayout, for legacy compatability reasons,
            // we trigger ojClose only when drawer closes. In legacy, there's no 'afterOpen' event.
            if (detail.value === false) {
                // Trigger onOjClose.
                onOjClose?.({
                    edge: detail.placement,
                    value: detail.value
                });
            }
        };
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { children: (0, jsx_runtime_1.jsx)(UNSAFE_DrawerLayout_1.DrawerLayout, { startDrawer: start, endDrawer: end, bottomDrawer: bottom, isStartOpen: startOpened, isEndOpen: endOpened, isBottomOpen: bottomOpened, startDisplay: startDisplay === 'auto' ? undefined : startDisplay, endDisplay: endDisplay === 'auto' ? undefined : endDisplay, bottomDisplay: bottomDisplay === 'auto' ? undefined : bottomDisplay, onClose: onOjBeforeCloseHandler, onTransitionEnd: onOjCloseHandler, children: children }) }));
    }, "DrawerLayout", { "slots": { "": {}, "start": {}, "end": {}, "bottom": {} }, "properties": { "startOpened": { "type": "boolean", "writeback": true }, "endOpened": { "type": "boolean", "writeback": true }, "bottomOpened": { "type": "boolean", "writeback": true }, "startDisplay": { "type": "string", "enumValues": ["auto", "overlay", "reflow"] }, "endDisplay": { "type": "string", "enumValues": ["auto", "overlay", "reflow"] }, "bottomDisplay": { "type": "string", "enumValues": ["auto", "overlay", "reflow"] } }, "events": { "ojBeforeClose": { "cancelable": true }, "ojClose": {} }, "extension": { "_WRITEBACK_PROPS": ["startOpened", "endOpened", "bottomOpened"], "_READ_ONLY_PROPS": [] } }, { "startOpened": false, "endOpened": false, "bottomOpened": false, "startDisplay": "auto", "endDisplay": "auto", "bottomDisplay": "auto" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});
