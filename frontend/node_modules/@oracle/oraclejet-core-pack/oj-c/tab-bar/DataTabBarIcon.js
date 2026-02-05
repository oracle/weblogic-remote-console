define(["require", "exports", "preact/jsx-runtime"], function (require, exports, jsx_runtime_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataTabBarIcon = DataTabBarIcon;
    function DataTabBarIcon(props) {
        const { icon } = props;
        if (!icon) {
            return null;
        }
        if (icon.type === 'class') {
            return (0, jsx_runtime_1.jsx)("span", { class: icon.class });
        }
        return null;
    }
});
