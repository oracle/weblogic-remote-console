define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent", "./DataTabBarMixed"], function (require, exports, jsx_runtime_1, translationBundle_1, ojvcomponent_1, DataTabBarMixed_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TabBarMixed = void 0;
    exports.TabBarMixed = (0, ojvcomponent_1.registerCustomElement)('oj-c-tab-bar-mixed', 
    /**
     * @classdesc
     * <h3 id="tabBarMixedOverview-section">
     *   JET TabBarMixed
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#tabBarMixedOverview-section"></a>
     * </h3>
     *
     * The oj-c-tab-bar-mixed enables horizontal navigation between distinct content with a mixture of static and dynamic tabs.
     *
     * <h3 id="touch-section">
     *   Touch End User Information
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#touch-section"></a>
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
     *     <tr>
     *       <td>Tab</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Selects the tab.</td>
     *     </tr>
     *     <tr>
     *       <td>Remove button</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>Removes the tab.</td>
     *     </tr>
     *     <tr>
     *       <td>Arrow button</td>
     *       <td><kbd>Tap</kbd></td>
     *       <td>When dynamic tabs are displayed inside a conveyor belt, tapping the arrow button will scroll the conveyor belt.</td>
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
     *       <td>Tab</td>
     *       <td><kbd>Enter or Space</kbd></td>
     *       <td>Select the current tab.</td>
     *     </tr>
     *     <tr>
     *       <td>Tab</td>
     *       <td><kbd>LeftArrow or RightArrow</kbd></td>
     *       <td>Navigate to the previous or next tab.</td>
     *     </tr>
     *     <tr>
     *       <td>Tab</td>
     *       <td><kbd>Delete</kbd></td>
     *       <td>Remove the current tab.</td>
     *     </tr>
     *     <tr>
     *       <td>Tab</td>
     *       <td><kbd>Esc</kbd></td>
     *       <td>Hide the tooltip if tooltip is shown.</td>
     *     </tr>
     *     <tr>
     *       <td>Dropdown</td>
     *       <td><kbd>UpArrow or DownArrow</kbd></td>
     *       <td>Navigate the dynamic tab represented as item in the list in the direction of the arrow.</td>
     *     </tr>
     *     <tr>
     *       <td>Dropdown</td>
     *       <td><kbd>Enter or Space</kbd></td>
     *       <td>Select the highlighted choice from the dropdown and close the dropdown.</td>
     *     </tr>
     *     <tr>
     *       <td>Dropdown</td>
     *       <td><kbd>Esc</kbd></td>
     *       <td>Close the dropdown.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojmetadata description 'A navigation component that enables horizontal navigation between distinct content with a mixture of static and dynamic tabs.'
     * @ojmetadata displayName 'Tab Bar Mixed'
     * @ojmetadata help 'oj-c.TabBarMixed.html'
     * @ojmetadata main 'oj-c/tab-bar-mixed'
     * @ojmetadata status [
     *   {
     *     type: "production",
     *     since: "17.0.0"
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Layout & Nav"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/tab-bar-mixed"
     *   }
     * }
     * @ojmetadata since "16.1.0"
     */
    (props) => {
        const { dynamicTabs = [], dynamicTabsOverflow = 'conveyor', dynamicTabsOverflowIcon = { type: 'class', class: 'oj-ux-ico-collection' }, onOjBeforeSelect, onOjRemove, onOjSelectionAction, onSelectionChanged, selection, separatorPadding = '3rem', size, staticTabs = [], staticTabsDisplay = 'standard', 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, id } = props;
        const handleRemove = (event) => {
            if (onOjRemove) {
                onOjRemove({ key: event.value });
            }
        };
        const handleSelect = (event) => {
            (async () => {
                handleOnSelectionChanged: {
                    // If 'onOjBeforeSelect' is provided, handle the result before calling 'onSelectionChanged'
                    if (onOjBeforeSelect) {
                        try {
                            await onOjBeforeSelect({ key: event.value });
                        }
                        catch {
                            // If 'onOjBeforeSelect' rejects, break out of the 'handleOnSelectionChanged'
                            // labeled block (preventing 'onSelectionChanged' from firing)
                            break handleOnSelectionChanged;
                        }
                    }
                    if (onOjSelectionAction) {
                        onOjSelectionAction({ previousValue: selection || '', value: event.value });
                    }
                    if (selection === event.value) {
                        return;
                    }
                    if (onSelectionChanged) {
                        onSelectionChanged(event.value);
                    }
                }
            })();
        };
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: id, children: (0, jsx_runtime_1.jsx)(DataTabBarMixed_1.DataTabBarMixed, { "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, dynamicTabs: dynamicTabs, dynamicTabsOverflow: dynamicTabsOverflow, dynamicTabsOverflowIcon: dynamicTabsOverflowIcon, onRemove: handleRemove, onSelect: handleSelect, selection: selection, separatorPadding: separatorPadding, size: size, staticTabs: staticTabs, staticTabsDisplay: staticTabsDisplay }) }));
    }, "TabBarMixed", { "properties": { "dynamicTabs": { "type": "Array<object>" }, "dynamicTabsOverflow": { "type": "string", "enumValues": ["popup", "conveyor"] }, "dynamicTabsOverflowIcon": { "type": "object" }, "size": { "type": "string", "enumValues": ["md", "lg"] }, "selection": { "type": "string|number", "writeback": true }, "separatorPadding": { "type": "string" }, "staticTabs": { "type": "Array<object>" }, "staticTabsDisplay": { "type": "string", "enumValues": ["standard", "icons"] } }, "events": { "ojBeforeSelect": { "cancelable": true }, "ojRemove": {}, "ojSelectionAction": {} }, "extension": { "_WRITEBACK_PROPS": ["selection"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-label", "id", "aria-labelledby"] } }, undefined, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});
