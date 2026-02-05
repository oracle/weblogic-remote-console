define(["require", "exports", "preact/jsx-runtime", "./menu-item-icon", "./menu-select-items", "@oracle/oraclejet-preact/UNSAFE_Menu"], function (require, exports, jsx_runtime_1, menu_item_icon_1, menu_select_items_1, UNSAFE_Menu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ItemsMenu = void 0;
    /**
     * @classdesc
     * <h3 id="MenuButtonOverview-section">
     *   JET Items Menu
     *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#buttonOverview-section"></a>
     * </h3>
     *
     * <p>Description: A component that takes an items property containing a description of
     * menu items and converts to a collection of menu items suitable for a menu container,
     * such as a menu button.
     *
     * @ojmetadata description "An items to menu items converter"
     * @ojmetadata displayName "Items Menu"
     * @ojmetadata help "oj-c.ItemsMenu.html"
     * @ojmetadata main "oj-c/items-menu"
     * @ojmetadata since "16.0.0"
     */
    const ItemsMenu = ({ items = [], selection = {}, onSelectionChanged, defaultItemsRenderer, onOjMenuAction, isSplitMenu = false, onOjMenuSelection }) => {
        /*  Return the value to provide to the menu selection groups from this menu buttons selection object. */
        const getSingleGroupSelection = (key) => {
            const item = selection[key];
            return item && typeof item == 'string' ? item : undefined;
        };
        const getMultipleGroupSelection = (key) => {
            const item = selection[key];
            return Array.isArray(item) ? item : [];
        };
        const setSelectionValue = (selection, key, value) => {
            const updatedSelection = { ...selection };
            if (Array.isArray(value) && value.length === 0) {
                delete updatedSelection[key];
            }
            else {
                updatedSelection[key] = value;
            }
            return updatedSelection;
        };
        const getItemActionHandler = (key, onAction) => {
            return () => {
                onAction?.();
                onOjMenuAction?.({ key });
            };
        };
        // selection is exposed to user to permit initial values, and to update to any selected values
        // onSelectionChanged is fired when a menu item is selected
        function getCommit(key, selection, onSelection) {
            return (detail) => {
                onSelection?.({ value: detail.value, menuSelectionGroupKey: key });
                onOjMenuSelection?.({ value: detail.value, menuSelectionGroupKey: key });
                onSelectionChanged?.(setSelectionValue(selection, key, detail.value));
            };
        }
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: items.map((item) => {
                if (typeof item === 'string') {
                    const defaultMenuItem = defaultItemsRenderer?.[item]?.();
                    if (defaultMenuItem != undefined) {
                        return defaultMenuItem;
                    }
                    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
                }
                else {
                    switch (item.type) {
                        // For legacy support of split menu button, keep divider
                        case 'divider':
                        case 'separator':
                            // Menu is changing divider name to separator in 16+
                            // For now, we use future name separator and map to divider
                            // When Menu merges change, it can fix this.
                            return (0, jsx_runtime_1.jsx)(UNSAFE_Menu_1.MenuSeparator, {});
                        case 'submenu':
                            if (item.items && item.label && !isSplitMenu) {
                                return ((0, jsx_runtime_1.jsx)(UNSAFE_Menu_1.Submenu, { label: item.label, itemKey: item.key, children: (0, jsx_runtime_1.jsx)(exports.ItemsMenu, { items: item.items, selection: selection, onSelectionChanged: onSelectionChanged, onOjMenuSelection: onOjMenuSelection, onOjMenuAction: onOjMenuAction, defaultItemsRenderer: defaultItemsRenderer }) }));
                            }
                            return;
                        case 'selectsingle':
                            if (item.items && item.key && !isSplitMenu) {
                                return ((0, jsx_runtime_1.jsx)(UNSAFE_Menu_1.SelectSingleMenuGroup, { groupKey: item.key, value: item.selection || getSingleGroupSelection(item.key), onCommit: getCommit(item.key, selection, item.onSelection), children: (0, jsx_runtime_1.jsx)(menu_select_items_1.MenuSelectItems, { items: item.items }) }));
                            }
                            return;
                        case 'selectmultiple':
                            if (item.items && item.key && !isSplitMenu) {
                                return ((0, jsx_runtime_1.jsx)(UNSAFE_Menu_1.SelectMultipleMenuGroup, { groupKey: item.key, value: item.selection || getMultipleGroupSelection(item.key), onCommit: getCommit(item.key, selection, item.onSelection), children: (0, jsx_runtime_1.jsx)(menu_select_items_1.MenuSelectItems, { items: item.items }) }));
                            }
                            return;
                        case undefined:
                        case 'item':
                            if (item.label) {
                                return ((0, jsx_runtime_1.jsx)(UNSAFE_Menu_1.MenuItem, { itemKey: item.key, label: item.label, isDisabled: item.disabled, variant: !isSplitMenu ? item.variant : undefined, startIcon: !isSplitMenu &&
                                        item.startIcon && (0, jsx_runtime_1.jsx)(menu_item_icon_1.MenuItemIcon, { icon: item.startIcon }), endIcon: !isSplitMenu &&
                                        item.endIcon && (0, jsx_runtime_1.jsx)(menu_item_icon_1.MenuItemIcon, { icon: item.endIcon }), onAction: getItemActionHandler(item.key, item.onAction) }));
                            }
                            return;
                        default:
                            return;
                    }
                }
            }) }));
    };
    exports.ItemsMenu = ItemsMenu;
});
