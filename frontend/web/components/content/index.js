var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "preact/jsx-runtime", "preact/hooks", "wrc/nav-tree/nav-tree", "wrc/resource", "wrc/shared/backend-url", "signals", "ojs/ojcontext", "ojs/ojarraydataprovider", "wrc/branding-area/header", "wrc/integration/DatabusContext", "wrc/integration/databus-accessor", "ojL10n!wrc/shared/resources/nls/frontend", "oj-c/drawer-layout", "ojs/ojmessages"], function (require, exports, jsx_runtime_1, hooks_1, nav_tree_1, resource_1, backend_url_1, signals, Context, ArrayDataProvider, header_1, DatabusContext_1, databus_accessor_1, t) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Content = Content;
    function Content() {
        var _a, _b;
        const [backendPrefix, setBackendPrefix] = (0, hooks_1.useState)("");
        const [rdjUrl, setRdjUrl] = (0, hooks_1.useState)("/api/-current-/group?context=main");
        const [uniqueId] = (0, hooks_1.useState)(String(Date.now()));
        const [messages, setMessages] = (0, hooks_1.useState)([]);
        const messageProvider = (0, hooks_1.useMemo)(() => new ArrayDataProvider(messages), messages);
        const resourceContext = {
            applicationController: {
                resetDisplay: () => window.location.href = '/'
            },
            routerController: {
                navigateToAbsolutePath: (path) => setRdjUrl(path),
                selectRoot: (_root) => { },
            },
            broadcastMessage: (message) => {
                if (!message) {
                    setMessages([]);
                    return {};
                }
                const m = Object.assign({}, message);
                if (m.severity && (m.severity === "confirmation" || m.severity === "info")) {
                    if (typeof m.autoTimeout === "undefined") {
                        m.autoTimeout = 1500;
                    }
                    const value = parseInt(String(m.autoTimeout));
                    if (isNaN(value) || m.autoTimeout < 1000 || m.autoTimeout > 60000) {
                        m.autoTimeout = 1500;
                    }
                }
                setMessages(prev => [...prev, m]);
                return {};
            },
        };
        const [thebus] = (0, hooks_1.useState)(new signals.Signal());
        const lastMessageRef = (0, hooks_1.useRef)(undefined);
        (0, hooks_1.useEffect)(() => {
            const binding = thebus.add((message) => {
                lastMessageRef.current = message;
            });
            return () => {
                binding.detach();
            };
        }, [thebus]);
        (0, hooks_1.useEffect)(() => {
            let mounted = true;
            (() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const base = yield (0, backend_url_1.getBackendBase)();
                    if (mounted)
                        setBackendPrefix(base);
                }
                catch (_a) {
                }
            }))();
            return () => {
                mounted = false;
            };
        }, []);
        const databus = {
            subscribe: (callback) => {
                const binding = thebus.add(callback);
                const msg = lastMessageRef.current;
                if (msg) {
                    callback(msg);
                }
                return binding;
            },
            get: () => {
                return thebus;
            },
        };
        (0, hooks_1.useEffect)(() => { (0, databus_accessor_1.setDatabus)(databus); }, [databus]);
        const messageRenderer = (message) => {
            var _a, _b, _c, _d;
            if ((_b = (_a = message === null || message === void 0 ? void 0 : message.data) === null || _a === void 0 ? void 0 : _a.html) === null || _b === void 0 ? void 0 : _b.string) {
                return ((0, jsx_runtime_1.jsx)("oj-message", { message: message.data, children: (0, jsx_runtime_1.jsx)("div", { slot: "detail", dangerouslySetInnerHTML: { __html: ((_d = (_c = message === null || message === void 0 ? void 0 : message.data) === null || _c === void 0 ? void 0 : _c.html) === null || _d === void 0 ? void 0 : _d.string) || "" } }) }));
            }
            else {
                return ((0, jsx_runtime_1.jsx)("oj-message", { message: message.data }));
            }
        };
        const autoOpenedRef = (0, hooks_1.useRef)(false);
        (0, hooks_1.useEffect)(() => {
            const drawer = document.getElementById('drawer-layout');
            if (!drawer)
                return;
            try {
                const bc = Context.getContext(drawer).getBusyContext();
                bc.whenReady().then(() => {
                    requestAnimationFrame(() => {
                        if (autoOpenedRef.current)
                            return;
                        autoOpenedRef.current = true;
                        const btn = document.getElementById('navtree-toggler-link');
                        if (btn) {
                            btn.click();
                        }
                        else {
                            drawer.startOpened = true;
                        }
                    });
                });
            }
            catch (_e) {
                requestAnimationFrame(() => {
                    if (autoOpenedRef.current)
                        return;
                    autoOpenedRef.current = true;
                    drawer.startOpened = true;
                });
            }
        }, []);
        return ((0, jsx_runtime_1.jsx)(DatabusContext_1.DatabusProvider, { databus: databus, children: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", { id: "globalBody", class: "oj-bg-body", children: [(0, jsx_runtime_1.jsx)("header", { children: (0, jsx_runtime_1.jsx)(header_1.BrandingHeaderImpl, { context: resourceContext }) }), (0, jsx_runtime_1.jsx)("div", { class: "horizontal-green-stripe h-2 oj-flex-item" }), (0, jsx_runtime_1.jsx)("div", { id: "middle-container", class: "oj-bg-body oj-flex oj-sm-flex-items-initial oj-sm-flex-wrap-nowrap", "data-runtime-role": "app", children: (0, jsx_runtime_1.jsxs)("oj-c-drawer-layout", { id: "drawer-layout", "start-display": "reflow", children: [(0, jsx_runtime_1.jsxs)("div", { id: "navtree-container2", slot: "start", children: [(0, jsx_runtime_1.jsx)("nav", { class: "oj-flex-item", "aria-label": (_b = (_a = t["wrc-content"]) === null || _a === void 0 ? void 0 : _a.ariaLabel) === null || _b === void 0 ? void 0 : _b.navigationPanel, children: (0, jsx_runtime_1.jsx)("div", { class: "left_panel oj-bg-neutral-30", children: (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)(nav_tree_1.NavTree, { unique: uniqueId, context: resourceContext, navtreeUrl: "/api/project/navtree", url: "", backendPrefix: backendPrefix }) }) }) }), (0, jsx_runtime_1.jsx)("div", { id: "drawer-start-resizer", role: "separator", "aria-orientation": "vertical", "aria-label": "Resize navigation panel" })] }), (0, jsx_runtime_1.jsxs)("main", { class: "right_panel oj-bg-body", children: [(0, jsx_runtime_1.jsx)("div", { id: "content-area-container", class: "oj-bg-body oj-flex oj-sm-flex-direction-column oj-sm-flex-wrap-nowrap", children: (0, jsx_runtime_1.jsx)("div", { id: "content-area-body", class: "oj-bg-body oj-flex oj-sm-flex-items-initial oj-sm-flex-wrap-nowrap", children: (0, jsx_runtime_1.jsx)("div", { id: "table-form-container", class: "oj-flex-item oj-bg-body", children: (0, jsx_runtime_1.jsx)("div", { class: "oj-flex oj-sm-flex-direction-column wrc-resource-wrapper", children: (0, jsx_runtime_1.jsx)(resource_1.Resource, { rdj: rdjUrl, context: resourceContext, pageContext: "main", backendPrefix: backendPrefix }) }) }) }) }), (0, jsx_runtime_1.jsx)("div", { id: "ancillary-content-area-container", class: "oj-bg-body oj-flex oj-sm-flex-items-initial oj-sm-justify-content-flex-end" })] })] }) }), (0, jsx_runtime_1.jsx)("footer", { class: "oj-applayout-fixed-bottom oj-bg-neutral-170 oj-color-invert", children: (0, jsx_runtime_1.jsx)("div", { id: "footer-container", class: "oj-flex-bar" }) }), (0, jsx_runtime_1.jsx)("div", { id: "message-container", children: (0, jsx_runtime_1.jsx)("oj-messages", { messages: messages, display: "general", position: {}, children: (0, jsx_runtime_1.jsx)("template", { slot: "messageTemplate", "data-oj-as": "message", render: messageRenderer }) }) })] }) }) }));
    }
});
//# sourceMappingURL=index.js.map