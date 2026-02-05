define(["require", "exports", "preact/jsx-runtime", "./menu-item-icon", "@oracle/oraclejet-preact/UNSAFE_Menu"], function (require, exports, jsx_runtime_1, menu_item_icon_1, UNSAFE_Menu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MenuSelectItems = MenuSelectItems;
    function MenuSelectItems(props) {
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: props.items.map((item) => {
                return (item && ((0, jsx_runtime_1.jsx)(UNSAFE_Menu_1.SelectMenuItem, { label: item.label, isDisabled: item.disabled, endIcon: item.endIcon ? (0, jsx_runtime_1.jsx)(menu_item_icon_1.MenuItemIcon, { icon: item.endIcon }) : undefined, value: item.value })));
            }) }));
    }
});
