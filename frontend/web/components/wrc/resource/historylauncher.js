define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "preact/hooks", "ojL10n!wrc/shared/resources/nls/frontend", "wrc/display/dialog", "wrc/resource/resource", "ojs/ojcontext", "oj-c/button"], function (require, exports, jsx_runtime_1, ojvcomponent_1, hooks_1, t, dialog_1, resource_1, Context) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HistoryLauncher = void 0;
    function HistoryLauncherImpl() {
        var _a, _b, _c, _d;
        const ctx = (0, hooks_1.useContext)(resource_1.UserContext);
        const dialogRef = (0, hooks_1.useRef)(null);
        const [rdjUrl, setRdjUrl] = (0, hooks_1.useState)(null);
        const tooltip = (_d = (_c = (_b = (_a = t === null || t === void 0 ? void 0 : t["wrc-common"]) === null || _a === void 0 ? void 0 : _a.tooltips) === null || _b === void 0 ? void 0 : _b.pagesHistory) === null || _c === void 0 ? void 0 : _c.launch) === null || _d === void 0 ? void 0 : _d.value;
        const openDialog = () => {
            setRdjUrl("/api/history");
            requestAnimationFrame(() => {
                const dlg = dialogRef.current;
                if (!dlg)
                    return;
                const bc = Context.getContext(dlg).getBusyContext();
                bc.whenReady().then(() => dlg.open());
            });
        };
        const onClose = (e) => {
            if ((e === null || e === void 0 ? void 0 : e.target) === dialogRef.current) {
                setRdjUrl(null);
            }
        };
        return ((0, jsx_runtime_1.jsxs)("div", { class: "wrc-history-launcher", children: [(0, jsx_runtime_1.jsx)("oj-c-button", { id: "recent-pages-iconbar-icon", class: "size-5", chroming: "ghost", tooltip: tooltip, "aria-label": tooltip, onojAction: openDialog, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-clock-history", "aria-hidden": "true" }) }), (0, jsx_runtime_1.jsx)(dialog_1.Dialog, { id: "provider-info-style-history-dialog", onojClose: onClose, ref: dialogRef, children: (0, jsx_runtime_1.jsx)("div", { slot: "body", class: "oj-bg-body", children: (0, jsx_runtime_1.jsx)(resource_1.Resource, { rdj: rdjUrl || "", context: ctx === null || ctx === void 0 ? void 0 : ctx.context }) }) })] }));
    }
    exports.HistoryLauncher = (0, ojvcomponent_1.registerCustomElement)("wrc-history-launcher", HistoryLauncherImpl, "HistoryLauncher");
    exports.default = exports.HistoryLauncher;
});
//# sourceMappingURL=historylauncher.js.map