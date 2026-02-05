define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "preact/hooks", "ojL10n!wrc/shared/resources/nls/frontend", "wrc/display/dialog", "wrc/resource/resource", "wrc/shared/model/transport", "ojs/ojmutablearraydataprovider", "ojs/ojcontext", "oj-c/button", "oj-c/message-toast"], function (require, exports, jsx_runtime_1, ojvcomponent_1, hooks_1, t, dialog_1, resource_1, transport_1, MutableArrayDataProvider, Context) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PagesBookmarkLauncher = void 0;
    function PagesBookmarkLauncherImpl() {
        var _a, _b, _c, _d;
        const ctx = (0, hooks_1.useContext)(resource_1.UserContext);
        const dialogRef = (0, hooks_1.useRef)(null);
        const [rdjUrl, setRdjUrl] = (0, hooks_1.useState)(null);
        const [toastDP, setToastDP] = (0, hooks_1.useState)(new MutableArrayDataProvider([], { keyAttributes: 'key' }));
        const tooltip = (_d = (_c = (_b = (_a = t === null || t === void 0 ? void 0 : t["wrc-common"]) === null || _a === void 0 ? void 0 : _a.tooltips) === null || _b === void 0 ? void 0 : _b.pagesHistory) === null || _c === void 0 ? void 0 : _c.star) === null || _d === void 0 ? void 0 : _d.value;
        const openDialog = () => {
            setRdjUrl("/api/bookmarks");
            requestAnimationFrame(() => {
                const dlg = dialogRef.current;
                if (!dlg)
                    return;
                const bc = Context.getContext(dlg).getBusyContext();
                bc.whenReady().then(() => {
                    dlg.open();
                });
            });
        };
        const onClose = (e) => {
            if ((e === null || e === void 0 ? void 0 : e.target) === dialogRef.current) {
                setRdjUrl(null);
            }
        };
        const beforeNavigateHandler = (evt) => {
            evt.preventDefault();
            const path = evt.path;
            (0, transport_1.getData)(path, undefined)
                .then(() => {
                var _a, _b, _c;
                (_c = (_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.context) === null || _a === void 0 ? void 0 : _a.routerController) === null || _b === void 0 ? void 0 : _b.navigateToAbsolutePath) === null || _c === void 0 ? void 0 : _c.call(_b, path, { __skipBeforeNavigate: true });
            })
                .catch((_e) => {
                var _a, _b, _c, _d, _f, _g, _h, _j, _k;
                const summary = ((_c = (_b = (_a = t['wrc-common']) === null || _a === void 0 ? void 0 : _a.labels) === null || _b === void 0 ? void 0 : _b.error) === null || _c === void 0 ? void 0 : _c.value) || 'Error';
                const detail = ((_h = (_g = (_f = (_d = t['wrc-common']) === null || _d === void 0 ? void 0 : _d.labels) === null || _f === void 0 ? void 0 : _f.pagesBookmark) === null || _g === void 0 ? void 0 : _g.notreachable) === null || _h === void 0 ? void 0 : _h.value) || '';
                const items = [{ key: 'page-not-reachable', severity: 'error', summary, detail }];
                try {
                    const current = ((_k = (_j = toastDP === null || toastDP === void 0 ? void 0 : toastDP.data) === null || _j === void 0 ? void 0 : _j.slice) === null || _k === void 0 ? void 0 : _k.call(_j)) || [];
                    toastDP.data = current.concat(items);
                    setToastDP(toastDP);
                }
                catch (_ignored) {
                    setToastDP(new MutableArrayDataProvider(items, { keyAttributes: 'key' }));
                }
            });
        };
        const closeMessage = (event) => {
            if (toastDP) {
                let data = toastDP.data.slice();
                const closeMessageKey = event.detail.key;
                data = data.filter((message) => message.key !== closeMessageKey);
                toastDP.data = data;
                setToastDP(toastDP);
            }
        };
        return ((0, jsx_runtime_1.jsxs)("div", { class: "wrc-pages-bookmark-launcher", children: [(0, jsx_runtime_1.jsx)("oj-c-button", { id: "pagesBookmarkIconbarIcon", class: "size-5", chroming: "ghost", tooltip: tooltip, "aria-label": tooltip, onojAction: openDialog, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-bookmark-favorite", "aria-hidden": "true" }) }), (0, jsx_runtime_1.jsx)(dialog_1.Dialog, { id: "provider-info-style-bookmark-dialog", position: { my: { horizontal: 'center', vertical: 'top' }, at: { horizontal: "center", vertical: 'top' } }, onojClose: onClose, ref: dialogRef, children: (0, jsx_runtime_1.jsx)("div", { slot: "body", class: "oj-bg-body", children: (0, jsx_runtime_1.jsx)(resource_1.Resource, { rdj: rdjUrl || "", context: ctx === null || ctx === void 0 ? void 0 : ctx.context, onBeforeNavigate: beforeNavigateHandler }) }) }), (0, jsx_runtime_1.jsx)("oj-c-message-toast", { data: toastDP, position: "top", onojClose: closeMessage })] }));
    }
    exports.PagesBookmarkLauncher = (0, ojvcomponent_1.registerCustomElement)("wrc-pages-bookmark-launcher", PagesBookmarkLauncherImpl, "PagesBookmarkLauncher");
    exports.default = exports.PagesBookmarkLauncher;
});
//# sourceMappingURL=pagesbookmarklauncher.js.map