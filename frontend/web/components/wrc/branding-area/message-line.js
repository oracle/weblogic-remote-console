define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "preact/hooks", "ojL10n!wrc/shared/resources/nls/frontend", "./header", "wrc/integration/DatabusContext"], function (require, exports, jsx_runtime_1, ojvcomponent_1, hooks_1, t, header_1, DatabusContext_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MessageLine = void 0;
    function MessageLineImpl({ context }) {
        var _a, _b, _c, _d, _e;
        const [messagesArr, setMessagesArr] = (0, hooks_1.useState)([]);
        const containerRef = (0, hooks_1.useRef)(null);
        const ariaLabel = (_c = (_b = (_a = t["wrc-message-line"]) === null || _a === void 0 ? void 0 : _a.ariaLabel) === null || _b === void 0 ? void 0 : _b.region) === null || _c === void 0 ? void 0 : _c.value;
        const databus = (0, hooks_1.useContext)(DatabusContext_1.DatabusContext);
        (0, hooks_1.useEffect)(() => {
            const bus = databus;
            if (!bus)
                return;
            const binding = bus.subscribe((status) => {
                const current = status.providers.current;
                const msgs = Array.isArray(current.messages) ? current.messages : [];
                setMessagesArr(msgs);
            });
            return () => {
                binding.detach();
            };
        }, []);
        const handleLinkClick = (msg) => (ev) => {
            var _a, _b;
            const link = msg === null || msg === void 0 ? void 0 : msg.link;
            if (!link)
                return;
            if (link.externalLink) {
                (0, header_1.openExternalUrl)(link.externalLink);
                return;
            }
            if (link.resourceData) {
                (_b = (_a = context === null || context === void 0 ? void 0 : context.routerController) === null || _a === void 0 ? void 0 : _a.navigateToAbsolutePath) === null || _b === void 0 ? void 0 : _b.call(_a, link.resourceData);
                return;
            }
        };
        (0, hooks_1.useEffect)(() => {
            const root = document === null || document === void 0 ? void 0 : document.documentElement;
            if (!root)
                return;
            if (messagesArr.length === 0) {
                root.style.setProperty("--wrc-message-line-visible", "0px");
                return () => { root.style.setProperty("--wrc-message-line-visible", "0px"); };
            }
            const el = containerRef.current;
            const measured = el && el.offsetHeight ? `${el.offsetHeight}px` : "var(--message-line-container-height)";
            root.style.setProperty("--wrc-message-line-visible", measured);
            return () => {
                root.style.setProperty("--wrc-message-line-visible", "0px");
            };
        }, [messagesArr.length]);
        if (messagesArr.length === 0)
            return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
        const isDark = (((_d = document === null || document === void 0 ? void 0 : document.getElementById("globalBody")) === null || _d === void 0 ? void 0 : _d.classList.contains("oj-color-invert")) || ((_e = document === null || document === void 0 ? void 0 : document.body) === null || _e === void 0 ? void 0 : _e.classList.contains("oj-color-invert")));
        const containerClass = `oj-flex oj-sm-flex-items-initial ${isDark ? "oj-bg-neutral-180" : "oj-bg-neutral-30"}`;
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { id: "message-line-container", ref: containerRef, role: "region", "aria-label": ariaLabel, class: containerClass, children: (0, jsx_runtime_1.jsx)("div", { class: "oj-flex-item", style: "width: 100%;", children: messagesArr.map((msg) => {
                        var _a;
                        const { severity } = msg;
                        const iconClass = severity === "warning"
                            ? "oj-ux-ico-warning"
                            : severity === "info"
                                ? "oj-ux-ico-information"
                                : "oj-ux-ico-error";
                        const linkObj = msg === null || msg === void 0 ? void 0 : msg.link;
                        const linkLabel = (linkObj === null || linkObj === void 0 ? void 0 : linkObj.label) || "Open Link";
                        const hasLink = !!(linkObj && (linkLabel || (linkObj === null || linkObj === void 0 ? void 0 : linkObj.externalLink) || (linkObj === null || linkObj === void 0 ? void 0 : linkObj.resourceData)));
                        const summaryHTML = (_a = msg === null || msg === void 0 ? void 0 : msg.messageSummary) !== null && _a !== void 0 ? _a : "";
                        const linkAria = `${summaryHTML !== null && summaryHTML !== void 0 ? summaryHTML : ""} ${linkLabel}`.trim();
                        return ((0, jsx_runtime_1.jsxs)("div", { class: "oj-flex oj-sm-align-items-center oj-text-color-primary", role: "group", children: [iconClass ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("span", { class: `${iconClass} cfe-message-line-icon ${severity === "info" ? "cfe-message-line-icon--info" : ""} ${severity === "warning" ? "oj-text-color-warning" : severity === "error" ? "oj-text-color-danger" : ""}`, "aria-hidden": "true" }), "\u00A0"] })) : null, (0, jsx_runtime_1.jsx)("span", { class: `cfe-message-line-text oj-text-color-primary ${severity === "info" ? "oj-sm-margin-start-3x" : "oj-sm-margin-start-2x"}`, dangerouslySetInnerHTML: { __html: summaryHTML } }), hasLink ? ((0, jsx_runtime_1.jsx)("span", { class: "oj-helper-margin-start-auto cfe-message-line-link-button", children: (0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "outlined", size: "xs", label: linkLabel, onojAction: handleLinkClick(msg), "aria-label": linkAria }) })) : null] }));
                    }) }) }) }));
    }
    exports.MessageLine = (0, ojvcomponent_1.registerCustomElement)("wrc-message-line", MessageLineImpl, "MessageLine", { "properties": { "context": { "type": "object", "properties": { "canExitCallBack": { "type": "function" }, "routerController": { "type": "object" }, "applicationController": { "type": "object" }, "broadcastMessage": { "type": "function" }, "startActionPolling": { "type": "function" }, "updateShoppingCart": { "type": "function" } } } } });
    exports.default = exports.MessageLine;
});
//# sourceMappingURL=message-line.js.map