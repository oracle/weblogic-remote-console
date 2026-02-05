define(["require", "exports", "preact/jsx-runtime", "preact/hooks", "../resource", "ojL10n!wrc/shared/resources/nls/frontend", "oj-c/button"], function (require, exports, jsx_runtime_1, hooks_1, resource_1, t) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = NavigationToolbar;
    function NavigationToolbar({ pageContext }) {
        const ctx = (0, hooks_1.useContext)(resource_1.UserContext);
        const [targets, setTargets] = (0, hooks_1.useState)({});
        const showButtons = pageContext === 'main';
        (0, hooks_1.useEffect)(() => {
            const databus = ctx === null || ctx === void 0 ? void 0 : ctx.databus;
            if (databus) {
                const signal = databus.subscribe((event) => {
                    var _a;
                    const main = ((_a = event === null || event === void 0 ? void 0 : event.contexts) === null || _a === void 0 ? void 0 : _a.main) || {};
                    const back = main["back-resource-data"];
                    const forward = main["forward-resource-data"];
                    setTargets((prev) => ({
                        back: back !== null && back !== void 0 ? back : prev.back,
                        forward: forward !== null && forward !== void 0 ? forward : prev.forward,
                    }));
                });
                return () => signal.detach();
            }
        }, []);
        const go = (path) => {
            var _a, _b, _c;
            if (!path)
                return;
            (_c = (_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.context) === null || _a === void 0 ? void 0 : _a.routerController) === null || _b === void 0 ? void 0 : _b.navigateToAbsolutePath) === null || _c === void 0 ? void 0 : _c.call(_b, path);
        };
        return ((0, jsx_runtime_1.jsx)("div", { class: "wrc-navigation-toolbar", children: showButtons && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("oj-c-button", { id: "back-button", chroming: "borderless", onojAction: () => go(targets.back), disabled: !targets.back, tooltip: t["wrc-form-toolbar"].buttons.back.label, "aria-label": t["wrc-form-toolbar"].buttons.back.label, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-arrow-left" }) }), (0, jsx_runtime_1.jsx)("oj-c-button", { id: "forward-button", chroming: "borderless", onojAction: () => go(targets.forward), disabled: !targets.forward, tooltip: t["wrc-form-toolbar"].buttons.forward.label, "aria-label": t["wrc-form-toolbar"].buttons.forward.label, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-arrow-right" }) })] })) }));
    }
});
//# sourceMappingURL=navigationtoolbar.js.map