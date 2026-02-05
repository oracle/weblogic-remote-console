define(["require", "exports", "preact/jsx-runtime"], function (require, exports, jsx_runtime_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MenuItemIcon = MenuItemIcon;
    function MenuItemIcon(props) {
        if (props.icon.type === 'img') {
            return (0, jsx_runtime_1.jsx)("img", { src: props.icon.src });
        }
        else {
            return (0, jsx_runtime_1.jsx)("span", { class: props.icon.class });
        }
    }
});
