define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "preact", "preact/hooks", "wrc/error-boundary", "wrc/integration/DatabusContext", "wrc/shared/controller/notification-utils", "ojs/ojhtmlutils", "ojs/ojtranslation", "../shared/controller/builderfactory", "../shared/global", "ojL10n!wrc/shared/resources/nls/frontend", "css!./wrc-form-styles.css"], function (require, exports, jsx_runtime_1, ojvcomponent_1, preact_1, hooks_1, error_boundary_1, DatabusContext_1, notification_utils_1, HtmlUtils, Translations, builderfactory_1, global_1, t) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Resource = exports.UserContext = void 0;
    exports.UserContext = (0, preact_1.createContext)(null);
    function ResourceImpl({ rdj, pdj, unique, context, pageContext, showHelp = false, backendPrefix, onBeforeNavigate, onActionCompleted }) {
        (0, hooks_1.useEffect)(() => {
            if (unique && !global_1.Global.global.unique) {
                global_1.Global.global.unique = unique || "";
            }
        }, [unique]);
        (0, hooks_1.useEffect)(() => {
            if (backendPrefix) {
                global_1.Global.global.backendPrefix = backendPrefix;
            }
        }, [backendPrefix, rdj]);
        const [isLoading, setIsLoading] = (0, hooks_1.useState)(true);
        const databusFromContext = (0, hooks_1.useContext)(DatabusContext_1.DatabusContext);
        const databus = databusFromContext || undefined;
        const [builder, setBuilder] = (0, hooks_1.useState)();
        const [showSpinner, setShowSpinner] = (0, hooks_1.useState)(false);
        (0, hooks_1.useEffect)(() => {
            var _a, _b, _c;
            const title = (_a = builder === null || builder === void 0 ? void 0 : builder.getPageTitle) === null || _a === void 0 ? void 0 : _a.call(builder);
            if (title) {
                const appName = ((_c = (_b = t["wrc-header"]) === null || _b === void 0 ? void 0 : _b.text) === null || _c === void 0 ? void 0 : _c.appName) || "WebLogic Remote Console";
                document.title = `${appName} - ${title}`;
            }
        }, [builder]);
        const resolvedContext = context;
        const effectiveContext = (0, hooks_1.useMemo)(() => {
            if (!resolvedContext)
                return resolvedContext;
            const rc = resolvedContext.routerController;
            if (!rc || typeof rc.navigateToAbsolutePath !== "function")
                return resolvedContext;
            const originalNavigate = rc.navigateToAbsolutePath.bind(rc);
            const wrapped = Object.assign(Object.assign({}, resolvedContext), { routerController: Object.assign(Object.assign({}, rc), { navigateToAbsolutePath: (...args) => {
                        const path = args[0];
                        const opts = args[1];
                        if ((opts === null || opts === void 0 ? void 0 : opts.__skipBeforeNavigate) === true) {
                            return originalNavigate(...args);
                        }
                        let defaultPrevented = false;
                        const ev = {
                            path,
                            preventDefault: () => {
                                defaultPrevented = true;
                            },
                            get defaultPrevented() {
                                return defaultPrevented;
                            }
                        };
                        try {
                            onBeforeNavigate === null || onBeforeNavigate === void 0 ? void 0 : onBeforeNavigate(ev);
                        }
                        catch (_e) {
                        }
                        if (defaultPrevented)
                            return;
                        return originalNavigate(...args);
                    } }) });
            return wrapped;
        }, [resolvedContext, onBeforeNavigate]);
        (0, hooks_1.useEffect)(() => {
            let timer;
            if (isLoading) {
                setShowSpinner(false);
                timer = setTimeout(() => setShowSpinner(true), 1500);
            }
            else {
                setShowSpinner(false);
            }
            return () => {
                if (timer)
                    clearTimeout(timer);
            };
        }, [isLoading, rdj]);
        const parentCtx = (0, hooks_1.useContext)(exports.UserContext);
        (0, hooks_1.useEffect)(() => {
            let cancelled = false;
            setIsLoading(true);
            setBuilder(undefined);
            if (!rdj) {
                return () => {
                    cancelled = true;
                };
            }
            let startId = window.setTimeout(() => {
                new builderfactory_1.BuilderFactory(rdj, pdj, resolvedContext, pageContext)
                    .build()
                    .then((builder) => {
                    if (cancelled)
                        return;
                    setBuilder(builder);
                    setIsLoading(false);
                })
                    .catch((err) => {
                    var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _o, _p;
                    if (cancelled)
                        return;
                    setIsLoading(false);
                    const ctx = { rdj, unique, context: resolvedContext, databus, showHelp };
                    try {
                        const status = err === null || err === void 0 ? void 0 : err.status;
                        const msg = (err === null || err === void 0 ? void 0 : err.message) || "";
                        const isNotFound = status === 404;
                        if (isNotFound && (resolvedContext === null || resolvedContext === void 0 ? void 0 : resolvedContext.broadcastMessage)) {
                            const summary = (_c = (_b = (_a = t["wrc-recently-visited"]) === null || _a === void 0 ? void 0 : _a.messages) === null || _b === void 0 ? void 0 : _b.pageNoLongerExists) === null || _c === void 0 ? void 0 : _c.summary;
                            const d1 = Translations.applyParameters((_h = (_g = (_f = (_d = t["wrc-recently-visited"]) === null || _d === void 0 ? void 0 : _d.messages) === null || _f === void 0 ? void 0 : _f.pageNoLongerExists) === null || _g === void 0 ? void 0 : _g.detail1) !== null && _h !== void 0 ? _h : "", [rdj]);
                            const d2 = Translations.applyParameters((_m = (_l = (_k = (_j = t["wrc-recently-visited"]) === null || _j === void 0 ? void 0 : _j.messages) === null || _k === void 0 ? void 0 : _k.pageNoLongerExists) === null || _l === void 0 ? void 0 : _l.detail2) !== null && _m !== void 0 ? _m : "", [rdj]);
                            const html = `<div>${d1}<br/>${d2}</div>`;
                            const untypedBroadcastMessageFunc = resolvedContext.broadcastMessage;
                            untypedBroadcastMessageFunc({
                                summary,
                                html: { view: HtmlUtils.stringToNodeArray(html), string: html },
                                severity: "info",
                                autoTimeout: -1
                            });
                        }
                        else {
                            (0, notification_utils_1.broadcastErrorMessage)(ctx, err instanceof Error ? err : new Error(String(err)));
                        }
                    }
                    catch (_e) {
                    }
                    try {
                        const safePath = "/api/-current-/group";
                        const status = err === null || err === void 0 ? void 0 : err.status;
                        const msg = (err === null || err === void 0 ? void 0 : err.message) || "";
                        const shouldNavigate = (typeof status === "number" && status >= 400 && status < 500);
                        if (shouldNavigate) {
                            (_p = (_o = effectiveContext === null || effectiveContext === void 0 ? void 0 : effectiveContext.routerController) === null || _o === void 0 ? void 0 : _o.navigateToAbsolutePath) === null || _p === void 0 ? void 0 : _p.call(_o, safePath);
                        }
                    }
                    catch (_e) {
                    }
                });
            }, 0);
            return () => {
                cancelled = true;
                if (startId) {
                    clearTimeout(startId);
                }
            };
        }, [rdj]);
        if (isLoading) {
            if (!showSpinner)
                return null;
            return ((0, jsx_runtime_1.jsx)("div", { class: "wrc-resource-spinner", role: "status", "aria-live": "polite", "aria-busy": "true", children: (0, jsx_runtime_1.jsx)("span", { class: "oj-ux-ico-refresher oj-text-color-disabled wrc-spinner-icon", "aria-hidden": "true" }) }));
        }
        const content = (0, hooks_1.useMemo)(() => builder === null || builder === void 0 ? void 0 : builder.getHTML(), [builder]);
        const providerValue = (0, hooks_1.useMemo)(() => ({ rdj: rdj, unique, context: effectiveContext, databus, showHelp, onActionCompleted, onBeforeNavigate }), [rdj, unique, effectiveContext, databus, showHelp, onActionCompleted, onBeforeNavigate]);
        return ((0, jsx_runtime_1.jsx)(exports.UserContext.Provider, { value: providerValue, children: (0, jsx_runtime_1.jsx)(error_boundary_1.ErrorBoundary, { children: content }) }));
    }
    exports.Resource = (0, ojvcomponent_1.registerCustomElement)("wrc-resource", ResourceImpl, "Resource", { "properties": { "rdj": { "type": "string" }, "pdj": { "type": "string" }, "showHelp": { "type": "boolean" }, "unique": { "type": "string" }, "context": { "type": "object", "properties": { "canExitCallBack": { "type": "function" }, "routerController": { "type": "object" }, "applicationController": { "type": "object" }, "broadcastMessage": { "type": "function" }, "startActionPolling": { "type": "function" }, "updateShoppingCart": { "type": "function" } } }, "pageContext": { "type": "string" }, "backendPrefix": { "type": "string" } }, "events": { "beforeNavigate": {}, "actionCompleted": {} } }, { "showHelp": false });
});
//# sourceMappingURL=resource.js.map