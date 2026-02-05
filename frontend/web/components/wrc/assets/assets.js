define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "css!wrc/assets/assets-styles.css"], function (require, exports, jsx_runtime_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Assets = void 0;
    function AssetsImpl({ message = "Hello from  wrc-assets" }) {
        return (0, jsx_runtime_1.jsx)("p", { children: message });
    }
    exports.Assets = (0, ojvcomponent_1.registerCustomElement)("wrc-assets", AssetsImpl, "Assets", { "properties": { "message": { "type": "string" } } }, { "message": "Hello from  wrc-assets" });
});
//# sourceMappingURL=assets.js.map