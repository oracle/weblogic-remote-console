define(["require", "exports", "preact/jsx-runtime", '@oracle/oraclejet-preact/translationBundle', "ojs/ojvcomponent", "oj-c/hooks/UNSAFE_useDataProvider/useDataProvider", "ojs/ojcontext", "./DataTabBar", "preact/hooks", "preact/compat", "@oracle/oraclejet-preact/utils/UNSAFE_clientUtils", "../utils/PRIVATE_ItemsMenu/items-menu"], function (require, exports, jsx_runtime_1, translationBundle_1, ojvcomponent_1, useDataProvider_1, Context, DataTabBar_1, hooks_1, compat_1, UNSAFE_clientUtils_1, items_menu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TabBar = void 0;
    // Utility to check if it is a dataProvider
    function isDataProvider(data) {
        return data && 'fetchFirst' in data;
    }
    // Utility that checks and returns true if the data is of type TabData. This is required because isRemovable is not supported in TabLinkItemData which also an allows type for data so throws type mismatch and undefined prop error when checking for isRemovable.
    const hasRemovable = (data) => {
        return 'isRemovable' in data;
    };
    exports.TabBar = (0, ojvcomponent_1.registerCustomElement)('oj-c-tab-bar', (0, compat_1.forwardRef)(
    /**
     * @classdesc
     * <h3 id="tabBarOverview-section">
     *   JET TabBar
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#tabBarOverview-section"></a>
     * </h3>
     *
     * The oj-c-tab-bar enables horizontal navigation.
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
     *       <td>When tabs are displayed inside a conveyor belt, tapping the arrow button will scroll the conveyor belt.</td>
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
     *       <td>Navigate the tab represented as item in the list in the direction of the arrow.</td>
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
     *     <tr>
     *       <td>Reorder</td>
     *       <td><kbd>Command/Ctrl + Shift + LeftArrow (RightArrow in RTL)</kbd></td>
     *       <td>Moves the tab before the previous tab.</td>
     *     </tr>
     *     <tr>
     *       <td>Reorder</td>
     *       <td><kbd>Command/Ctrl + Shift + RightArrow (LeftArrow in RTL)</kbd></td>
     *       <td>Moves the tab after the next tab.</td>
     *     </tr>
     *   </tbody>
     * </table>
     *
     * @ojmetadata description ' A tab bar allows navigation between different content sections.'
     * @ojmetadata displayName 'Tab Bar '
     * @ojmetadata help 'oj-c.TabBar.html'
     * @ojmetadata main 'oj-c/tab-bar'
     * @ojmetadata status [
     *   {
     *     type: "supersedes",
     *     since: "19.0.0",
     *     "value": ["oj-tab-bar"]
     *   }
     * ]
     * @ojmetadata extension {
     *   "catalog": {
     *     "category": "Layout & Nav"
     *   },
     *   "vbdt": {
     *     "module": "oj-c/tab-bar",
     *     "defaultColumns": 12,
     *     "minColumns": 2
     *   }
     * }
     * * @ojmetadata propertyLayout [
     *   {
     *     "propertyGroup": "common",
     *     "items": [
     *       "selection",
     *       "edge",
     *       "display",
     *       "truncation",
     *       "overflow",
     *       "reorderable",
     *       "layout",
     *       "truncation"
     *     ]
     *   },
     *   {
     *     "propertyGroup": "data",
     *     "items": [
     *       "data"
     *     ]
     *   }
     * @ojmetadata since "17.0.0"
     */
    ({ data = [], onOjBeforeSelect, onOjRemove, onOjReorder, onOjSelectionAction, onSelectionChanged, reorderable = 'disabled', overflow = 'hidden', truncation = 'none', selection, contextMenuConfig, display = 'standard', layout = 'stretch', edge = 'top', 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, id }, ref) => {
        const rootRef = (0, hooks_1.useRef)(null);
        // This is to pass to the useDataProvider hook
        const addBusyState = (0, hooks_1.useCallback)((description = 'MessageBanner: busyState') => {
            return rootRef.current
                ? Context.getContext(rootRef.current).getBusyContext().addBusyState({ description })
                : () => { };
        }, []);
        const { data: dataProviderData } = (0, useDataProvider_1.useDataProvider)({
            // Need to check if its not array otherwise we cannot assign it to data key in the hook
            data: !Array.isArray(data) && isDataProvider(data) ? data : undefined,
            addBusyState
        });
        // The array returned by useDataProvider is in the form of {data: D, key: K, metadata: ItemMetadata<K>}, so map is needed to fetch only item.data. Conversion is required only when tabData coming from DataProvider changed, hence the useMemo.
        const dataArr = (0, hooks_1.useMemo)(() => {
            let retDataArr = [];
            if (Array.isArray(data)) {
                retDataArr = data;
            }
            else {
                if (isDataProvider(data)) {
                    retDataArr = dataProviderData.map((item) => {
                        return { ...item.data };
                    });
                }
            }
            return retDataArr;
        }, [data, dataProviderData]);
        const handleRemove = (event) => {
            if (onOjRemove) {
                onOjRemove({ key: event.value });
            }
        };
        const handleReorder = (event) => {
            if (onOjReorder) {
                onOjReorder({ reorderedKeys: event.reorderedKeys });
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
        (0, hooks_1.useImperativeHandle)(ref, () => ({
            _doReorderHelper: (tabBarKeys) => {
                onOjReorder && onOjReorder({ reorderedKeys: tabBarKeys });
                return Promise.resolve();
            }
        }));
        const isMobileDevice = (0, UNSAFE_clientUtils_1.isMobile)();
        const defaultContextMenuConfig = (0, hooks_1.useMemo)(() => {
            return {
                itemsRenderer: (context) => {
                    if (context) {
                        const defaultItems = context.defaultMenuItems;
                        // We need to find if the item has isRemovable set to true
                        const itemData = dataArr.find((item) => {
                            return item.itemKey === context.itemKey;
                        });
                        const isRemovableItem = hasRemovable(itemData) && itemData.isRemovable === true;
                        const isReorderableItem = reorderable === 'enabled';
                        // Only if the item has isRemovable set true or is reorderable and it is a touch device then we render a default context menu
                        if ((isRemovableItem || isReorderableItem) &&
                            isMobileDevice &&
                            defaultItems != null) {
                            return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: defaultItems });
                        }
                    }
                    return null;
                }
            };
        }, []);
        const itemsRenderer = (0, hooks_1.useCallback)((context) => {
            // Create the corepack context menu context contract from the preact context
            const corepackContextMenuContext = {
                itemKey: context.itemKey,
                hasDefaultMenuItems: context.defaultMenuItems != null
            };
            // Get the items from the corepack context menu config and based on the value render the menu items.
            const contextMenuItems = contextMenuConfig?.items(corepackContextMenuContext);
            if (contextMenuItems != null && context != null) {
                const defaultItemsRender = {
                    defaultMenuItems: () => context.defaultMenuItems,
                    remove: () => context.allMenuItems?.['remove'],
                    reorder: () => context.allMenuItems?.['reorder']
                };
                return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)(items_menu_1.ItemsMenu, { items: contextMenuItems, defaultItemsRenderer: defaultItemsRender }) }));
            }
            return;
        }, [contextMenuConfig?.items]);
        const customContextMenuConfig = (0, hooks_1.useMemo)(() => {
            return {
                itemsRenderer,
                accessibleLabel: contextMenuConfig?.accessibleLabel
            };
        }, [contextMenuConfig?.accessibleLabel, itemsRenderer]);
        // If the context-menu-config is defined then we make use of the custom menu or render the default menu if we detect the app is being run on a mobile device.
        const contextMenuConfiguration = contextMenuConfig != null
            ? customContextMenuConfig
            : isMobileDevice
                ? defaultContextMenuConfig
                : undefined;
        return ((0, jsx_runtime_1.jsx)(ojvcomponent_1.Root, { id: id, ref: rootRef, children: (0, jsx_runtime_1.jsx)(DataTabBar_1.DataTabBar, { "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, data: dataArr, onRemove: handleRemove, onReorder: handleReorder, onSelect: handleSelect, reorderable: reorderable, selection: selection, display: display, edge: edge, layout: layout, overflow: overflow, truncation: truncation, contextMenuConfig: contextMenuConfiguration }) }));
    }), "TabBar", { "properties": { "data": { "type": "Array<object>|DataProvider" }, "selection": { "type": "string|number", "writeback": true }, "reorderable": { "type": "string", "enumValues": ["disabled", "enabled"] }, "overflow": { "type": "string", "enumValues": ["hidden", "popup", "conveyor"] }, "display": { "type": "string", "enumValues": ["standard", "icons", "stacked"] }, "layout": { "type": "string", "enumValues": ["stretch", "condense"] }, "edge": { "type": "string", "enumValues": ["top", "bottom"] }, "truncation": { "type": "string", "enumValues": ["none", "progressive"] }, "contextMenuConfig": { "type": "object", "properties": { "items": { "type": "function" }, "accessibleLabel": { "type": "string" } } } }, "events": { "ojBeforeSelect": { "cancelable": true }, "ojRemove": {}, "ojReorder": {}, "ojSelectionAction": {} }, "extension": { "_WRITEBACK_PROPS": ["selection"], "_READ_ONLY_PROPS": [], "_OBSERVED_GLOBAL_PROPS": ["aria-label", "id", "aria-labelledby"] }, "methods": { "_doReorderHelper": {} } }, { "data": [], "reorderable": "disabled", "overflow": "hidden", "truncation": "none", "display": "standard", "layout": "stretch", "edge": "top" }, {
        '@oracle/oraclejet-preact': translationBundle_1.default
    });
});
