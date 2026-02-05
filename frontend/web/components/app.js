define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "preact/hooks", "ojs/ojcontext", "./content/index"], function (require, exports, jsx_runtime_1, ojvcomponent_1, hooks_1, Context, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.App = void 0;
    exports.App = (0, ojvcomponent_1.registerCustomElement)("app-root", ({ appName = "App Name", userLogin = "john.hancock@oracle.com" }) => {
        (0, hooks_1.useEffect)(() => {
            Context.getPageContext().getBusyContext().applicationBootstrapComplete();
        }, []);
        return ((0, jsx_runtime_1.jsx)(index_1.Content, {}));
    }, "App", { "properties": { "appName": { "type": "string" }, "userLogin": { "type": "string" } } }, { "appName": "App Name", "userLogin": "john.hancock@oracle.com" });
});
//# sourceMappingURL=app.js.map