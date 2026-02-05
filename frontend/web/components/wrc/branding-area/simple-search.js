var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "preact/jsx-runtime", "ojL10n!wrc/shared/resources/nls/frontend", "ojs/ojvcomponent", "preact/hooks", "../shared/model/transport", "wrc/integration/DatabusContext", "ojs/ojlogger", "ojs/ojinputsearch"], function (require, exports, jsx_runtime_1, t, ojvcomponent_1, hooks_1, transport_1, DatabusContext_1, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SimpleSearch = void 0;
    function SimpleSearchImpl({ context }) {
        var _a, _b, _c;
        const databus = (0, hooks_1.useContext)(DatabusContext_1.DatabusContext);
        const [enabled, setEnabled] = (0, hooks_1.useState)(false);
        const [endpoint, setEndpoint] = (0, hooks_1.useState)(undefined);
        const [value, setValue] = (0, hooks_1.useState)("");
        (0, hooks_1.useEffect)(() => {
            if (!databus) {
                return;
            }
            const signal = databus.subscribe((statusData) => {
                var _a, _b;
                try {
                    const current = (_a = statusData === null || statusData === void 0 ? void 0 : statusData.providers) === null || _a === void 0 ? void 0 : _a.current;
                    const lastRootUsed = current === null || current === void 0 ? void 0 : current.lastRootUsed;
                    const currentRoot = (_b = current === null || current === void 0 ? void 0 : current.roots) === null || _b === void 0 ? void 0 : _b.find((r) => (r === null || r === void 0 ? void 0 : r.name) === lastRootUsed);
                    const simpleSearch = currentRoot === null || currentRoot === void 0 ? void 0 : currentRoot.simpleSearch;
                    if (simpleSearch) {
                        setEnabled(true);
                        setEndpoint(simpleSearch);
                    }
                    else {
                        setEnabled(false);
                        setEndpoint(undefined);
                        setValue("");
                    }
                }
                catch (e) {
                    if (e instanceof Error) {
                        Logger.error(e.message);
                    }
                    else {
                        Logger.error(String(e));
                    }
                    setEnabled(false);
                    setEndpoint(undefined);
                }
            });
            return () => signal === null || signal === void 0 ? void 0 : signal.detach();
        }, []);
        const placeholder = ((_c = (_b = (_a = t["wrc-common"]) === null || _a === void 0 ? void 0 : _a.placeholders) === null || _b === void 0 ? void 0 : _b.search) === null || _c === void 0 ? void 0 : _c.value) || '';
        const doSearch = (searchValue) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!enabled || !endpoint || !searchValue || searchValue.length === 0)
                return;
            const res = yield (0, transport_1._post)(endpoint, JSON.stringify({ contains: searchValue }));
            const body = (yield res.json());
            const resourcePath = ((_a = body === null || body === void 0 ? void 0 : body.resourceData) === null || _a === void 0 ? void 0 : _a.resourceData) ||
                (body === null || body === void 0 ? void 0 : body.resourceData) ||
                undefined;
            if (resourcePath) {
                (_b = context === null || context === void 0 ? void 0 : context.routerController) === null || _b === void 0 ? void 0 : _b.navigateToAbsolutePath(resourcePath);
            }
        });
        (0, hooks_1.useEffect)(() => {
            const host = document.getElementById("cfe-simple-search");
            const input = host === null || host === void 0 ? void 0 : host.querySelector("input[type='text']");
            if (host) {
                host.classList.toggle("oj-disabled", !enabled);
            }
            if (input) {
                input.disabled = !enabled;
            }
        }, [enabled]);
        Logger.info('enabled: ' + enabled);
        return ((0, jsx_runtime_1.jsx)("div", { class: "branding-area-simple-search oj-sm-align-self-center oj-flex-item", children: (0, jsx_runtime_1.jsx)("oj-input-search", Object.assign({ id: "cfe-simple-search", class: "oj-form-control-max-width-md oj-bg-neutral-170 oj-flex-item" }, { disabled: !enabled }, { value: value, placeholder: placeholder, onvalueChanged: (e) => { var _a; return setValue(((_a = e === null || e === void 0 ? void 0 : e.detail) === null || _a === void 0 ? void 0 : _a.value) || ""); }, onojValueAction: (e) => {
                    var _a;
                    const v = ((_a = e === null || e === void 0 ? void 0 : e.detail) === null || _a === void 0 ? void 0 : _a.value) || value;
                    doSearch(v);
                } })) }));
    }
    exports.SimpleSearch = (0, ojvcomponent_1.registerCustomElement)("wrc-simple-search", SimpleSearchImpl, "SimpleSearch", { "properties": { "context": { "type": "object", "properties": { "canExitCallBack": { "type": "function" }, "routerController": { "type": "object" }, "applicationController": { "type": "object" }, "broadcastMessage": { "type": "function" }, "startActionPolling": { "type": "function" }, "updateShoppingCart": { "type": "function" } } } } });
    exports.default = exports.SimpleSearch;
});
//# sourceMappingURL=simple-search.js.map