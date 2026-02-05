define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "css!wrc/shared/shared-styles.css"], function (require, exports, jsx_runtime_1, ojvcomponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Shared = void 0;
    function SharedImpl({ message = "Hello from  wrc-shared" }) {
        return (0, jsx_runtime_1.jsx)("p", { children: message });
    }
    exports.Shared = (0, ojvcomponent_1.registerCustomElement)("wrc-shared", SharedImpl, "Shared", { "properties": { "message": { "type": "string" } } }, { "message": "Hello from  wrc-shared" });
});
//# sourceMappingURL=shared.js.map