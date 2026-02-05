define(["require", "exports", "preact/jsx-runtime", "@oracle/oraclejet-preact/UNSAFE_Toolbar", "oj-c/button", "oj-c/menu-button", "oj-c/split-menu-button", "oj-c/utils/PRIVATE_ItemsMenu/menu-item-icon", "oj-c/buttonset-single", "oj-c/buttonset-multiple", "oj-c/toggle-button", "oj-c/progress-button"], function (require, exports, jsx_runtime_1, UNSAFE_Toolbar_1, button_1, menu_button_1, split_menu_button_1, menu_item_icon_1, buttonset_single_1, buttonset_multiple_1, toggle_button_1, progress_button_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ItemsToolbar = void 0;
    const toMenuItemIcon = (icon) => {
        return icon && (0, jsx_runtime_1.jsx)(menu_item_icon_1.MenuItemIcon, { icon: icon });
    };
    const toIconProps = (item) => {
        return {
            startIcon: toMenuItemIcon(item.startIcon),
            endIcon: toMenuItemIcon(item.endIcon)
        };
    };
    const ItemsToolbar = ({ items = [], size, chroming, toolbarSelection = {}, onToolbarSelectionChanged, onOjToolbarAction, onOjToolbarSelection }) => {
        const setSelectionValue = (selection, value, key, menuButtonSelection = {}) => {
            let updatedSelection = { ...selection };
            if (!key) {
                // special logic for updating selection for menu buttons
                for (const k in menuButtonSelection) {
                    //delete select multiple selections when missing from incoming change value, using menuButtonSelection to determine which key to index
                    if (!(k in value))
                        delete updatedSelection[k];
                }
                //overwrite previous selection group values with new ones
                updatedSelection = { ...updatedSelection, ...value };
            }
            else {
                if (Array.isArray(value) && value.length === 0) {
                    delete updatedSelection[key];
                }
                else {
                    updatedSelection[key] = value;
                }
            }
            return updatedSelection;
        };
        const getItemActionHandler = (key, onAction) => {
            return () => {
                onAction?.();
                onOjToolbarAction?.({ key });
            };
        };
        const getSelectionChanges = (selection, key = '', value) => {
            onOjToolbarSelection?.({ value: value, toolbarSelectionGroupKey: key });
            onToolbarSelectionChanged?.(setSelectionValue(selection, value, key));
        };
        const getMenuButtonSelection = (toolbarSelection, menuItems, menuButtonSelection) => {
            menuItems?.forEach((item) => {
                if (item.type === 'selectsingle' || item.type === 'selectmultiple') {
                    if (item.key in toolbarSelection) {
                        menuButtonSelection[item.key] = toolbarSelection[item.key];
                    }
                }
                else if (item.type === 'submenu') {
                    menuButtonSelection = getMenuButtonSelection(toolbarSelection, item.items, menuButtonSelection);
                }
            });
            return menuButtonSelection;
        };
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: items.map((item) => {
                switch (item.type) {
                    case 'button': {
                        return ((0, jsx_runtime_1.jsx)(button_1.Button, { disabled: item.disabled, display: item.display, label: item.label, tooltip: item.tooltip, chroming: item.chroming || chroming, size: size, "data-oj-private-key": item.key, onOjAction: getItemActionHandler(item.key, item.onAction), ...toIconProps(item) }));
                    }
                    case 'menu-button': {
                        let menuButtonSelection = {};
                        menuButtonSelection = getMenuButtonSelection(toolbarSelection, item.items, menuButtonSelection);
                        return ((0, jsx_runtime_1.jsx)(menu_button_1.MenuButton, { disabled: item.disabled, display: item.display, label: item.label, tooltip: item.tooltip, items: item.items, suffix: item.suffix, chroming: item.chroming || chroming, size: size, "data-oj-private-key": item.key, onOjMenuAction: getItemActionHandler(''), selection: menuButtonSelection, onOjMenuSelection: (value) => {
                                onOjToolbarSelection?.({
                                    value: value,
                                    toolbarSelectionGroupKey: ''
                                });
                            }, onSelectionChanged: (value) => {
                                onToolbarSelectionChanged?.(setSelectionValue(toolbarSelection, value, '', menuButtonSelection));
                            }, ...toIconProps(item) }));
                    }
                    case 'split-menu-button': {
                        return ((0, jsx_runtime_1.jsx)(split_menu_button_1.SplitMenuButton, { size: size, disabled: item.disabled, label: item.label, tooltip: item.tooltip, items: item.items, chroming: item.chroming, "data-oj-private-key": item.key, onOjAction: getItemActionHandler(item.key, item.onAction) }));
                    }
                    case 'buttonset-single': {
                        return ((0, jsx_runtime_1.jsx)(buttonset_single_1.ButtonsetSingle, { disabled: item.disabled, display: item.display, items: item.items, chroming: item.chroming || chroming, size: size, value: toolbarSelection[item.key], "data-oj-private-key": item.key, onValueChanged: (value) => {
                                getSelectionChanges(toolbarSelection, item.key, value);
                            } }));
                    }
                    case 'buttonset-multiple': {
                        return ((0, jsx_runtime_1.jsx)(buttonset_multiple_1.ButtonsetMultiple, { disabled: item.disabled, display: item.display, items: item.items, chroming: item.chroming || chroming, size: size, value: toolbarSelection[item.key], "data-oj-private-key": item.key, onValueChanged: (value) => {
                                getSelectionChanges(toolbarSelection, item.key, value);
                            } }));
                    }
                    case 'toggle-button': {
                        return ((0, jsx_runtime_1.jsx)(toggle_button_1.ToggleButton, { disabled: item.disabled, display: item.display, label: item.label, tooltip: item.tooltip, chroming: item.chroming || chroming, size: size, value: toolbarSelection[item.key], "data-oj-private-key": item.key, onValueChanged: (value) => {
                                getSelectionChanges(toolbarSelection, item.key, value);
                            }, ...toIconProps(item) }));
                    }
                    case 'progress-button': {
                        return ((0, jsx_runtime_1.jsx)(progress_button_1.ProgressButton, { disabled: item.disabled, display: item.display, label: item.label, tooltip: item.tooltip, isLoading: item.isLoading, chroming: item.chroming || chroming, size: size, "data-oj-private-key": item.key, onOjAction: getItemActionHandler(item.key, item.onAction), startIcon: toMenuItemIcon(item.startIcon) }));
                    }
                    case 'separator':
                        return (0, jsx_runtime_1.jsx)(UNSAFE_Toolbar_1.ToolbarSeparator, {});
                    default:
                        return;
                }
            }) }));
    };
    exports.ItemsToolbar = ItemsToolbar;
});
