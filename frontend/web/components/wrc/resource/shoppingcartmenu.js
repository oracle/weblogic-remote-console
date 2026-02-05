define(["require", "exports", "preact/jsx-runtime", "ojL10n!wrc/shared/resources/nls/frontend", "ojs/ojvcomponent", "preact/hooks", "wrc/display/dialog", "wrc/resource/resource", "wrc/shared/model/transport", "wrc/shared/refresh", "ojs/ojcontext", "ojs/ojlogger", "oj-c/button", "ojs/ojmenu"], function (require, exports, jsx_runtime_1, t, ojvcomponent_1, hooks_1, dialog_1, resource_1, transport_1, refresh_1, Context, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ShoppingCartMenu = void 0;
    function ShoppingCartMenuImpl() {
        var _a, _b, _c, _d;
        const ctx = (0, hooks_1.useContext)(resource_1.UserContext);
        const dialogRef = (0, hooks_1.useRef)(null);
        const VIEW = "view-changes";
        const DISCARD = "discard";
        const COMMIT = "commit";
        const [shoppingCartVisible, setShoppingCartVisible] = (0, hooks_1.useState)(false);
        const [shoppingCartFull, setShoppingCartFull] = (0, hooks_1.useState)(false);
        const [changeManagerRdj, setChangeManagerRdj] = (0, hooks_1.useState)(undefined);
        (0, hooks_1.useEffect)(() => {
            const databus = ctx === null || ctx === void 0 ? void 0 : ctx.databus;
            if (!databus)
                return;
            const signal = databus.subscribe((event) => {
                const shoppingcart = event === null || event === void 0 ? void 0 : event.shoppingcart;
                setShoppingCartVisible((shoppingcart === null || shoppingcart === void 0 ? void 0 : shoppingcart.state) !== "off");
                setShoppingCartFull((shoppingcart === null || shoppingcart === void 0 ? void 0 : shoppingcart.state) === "full");
            });
            return () => { var _a; return (_a = signal === null || signal === void 0 ? void 0 : signal.detach) === null || _a === void 0 ? void 0 : _a.call(signal); };
        }, [ctx === null || ctx === void 0 ? void 0 : ctx.databus]);
        const openMenu = (event) => {
            var _a, _b;
            (_b = (_a = document.getElementById("shoppingCartMenu")) === null || _a === void 0 ? void 0 : _a.open) === null || _b === void 0 ? void 0 : _b.call(_a, event);
        };
        const onMenuAction = (event) => {
            var _a;
            const value = (_a = event === null || event === void 0 ? void 0 : event.detail) === null || _a === void 0 ? void 0 : _a.selectedValue;
            switch (value) {
                case VIEW: {
                    let rdjUrl;
                    rdjUrl = "/api/-current-/edit/changeManager/changingTable";
                    setChangeManagerRdj(rdjUrl);
                    requestAnimationFrame(() => {
                        const dlg = dialogRef.current;
                        if (!dlg)
                            return;
                        const centeredPos = { at: { horizontal: 'center', vertical: 'center' }, my: { horizontal: 'center', vertical: 'center' }, offset: { x: 0, y: 0 } };
                        const bc = Context.getContext(dlg).getBusyContext();
                        bc.whenReady().then(() => {
                            var _a, _b;
                            (_b = (_a = dlg).setProperty) === null || _b === void 0 ? void 0 : _b.call(_a, "position", centeredPos);
                            dlg.open();
                        });
                    });
                    break;
                }
                case DISCARD:
                    Logger.info("[shoppingcart] discard changes clicked");
                    (0, transport_1._post)("/api/-current-/edit/changeManager/discardChanges", "{}").then(() => {
                        (0, transport_1.getDataComponent)("/api/-current-/edit/changeManager");
                        (0, refresh_1.emitRefresh)({ scope: { content: true, navtree: true } });
                    });
                    break;
                case COMMIT:
                    Logger.info("[shoppingcart] commit changes clicked");
                    (0, transport_1._post)("/api/-current-/edit/changeManager/commitChanges", "{}").then(() => {
                        (0, transport_1.getDataComponent)("/api/-current-/edit/changeManager/");
                    });
                    break;
                default:
                    Logger.warn("[shoppingcart] unknown action", value);
            }
        };
        const iconClass = shoppingCartFull
            ? "oj-ux-ico-cart-full"
            : "oj-ux-ico-cart-alt";
        const tooltip = t["wrc-content-area-header"].icons.shoppingcart.tooltip;
        return ((0, jsx_runtime_1.jsxs)("div", { class: "wrc-shoppingcart-menu", children: [(0, jsx_runtime_1.jsx)("oj-c-button", { id: "shoppingCartMenuLauncher", class: "size-5", chroming: "ghost", tooltip: tooltip, "aria-label": tooltip, onojAction: openMenu, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: iconClass, "aria-hidden": "true" }) }), (0, jsx_runtime_1.jsxs)("oj-menu", { id: "shoppingCartMenu", "aria-labelledby": "shoppingCartMenuLauncher", onojMenuAction: onMenuAction, openOptions: {
                        launcher: "shoppingCartMenuLauncher",
                        initialFocus: "firstItem",
                    }, children: [(0, jsx_runtime_1.jsx)("oj-option", { id: VIEW, value: VIEW, disabled: !shoppingCartVisible, children: t["wrc-content-area-header"].menu.shoppingcart.view.label }), (0, jsx_runtime_1.jsx)("oj-option", { id: "divider" }), (0, jsx_runtime_1.jsxs)("oj-option", { id: DISCARD, value: DISCARD, children: [(0, jsx_runtime_1.jsx)("span", { role: "img", "aria-hidden": "true", id: "discard-changes", class: "oj-ux-ico-cart-abandon cfe-ux-ico-iconfont-24", title: t["wrc-content-area-header"].menu.shoppingcart.discard.label }), (0, jsx_runtime_1.jsx)("span", { children: t["wrc-content-area-header"].menu.shoppingcart.discard.label })] }), (0, jsx_runtime_1.jsxs)("oj-option", { id: COMMIT, value: COMMIT, children: [(0, jsx_runtime_1.jsx)("span", { role: "img", "aria-hidden": "true", id: "commit-changes", class: "oj-ux-ico-cart-add cfe-ux-ico-iconfont-24", title: t["wrc-content-area-header"].menu.shoppingcart.commit.label }), (0, jsx_runtime_1.jsx)("span", { children: t["wrc-content-area-header"].menu.shoppingcart.commit.label })] })] }), (0, jsx_runtime_1.jsx)(dialog_1.Dialog, { id: "shoppingcart-dialog", title: (_d = (_c = (_b = (_a = t['wrc-ancillary-content']) === null || _a === void 0 ? void 0 : _a.tabstrip) === null || _b === void 0 ? void 0 : _b.tabs) === null || _c === void 0 ? void 0 : _c.shoppingcart) === null || _d === void 0 ? void 0 : _d.label, onojClose: (e) => {
                        if ((e === null || e === void 0 ? void 0 : e.target) === dialogRef.current) {
                            setChangeManagerRdj(undefined);
                        }
                    }, position: { at: { horizontal: 'center', vertical: 'center' }, my: { horizontal: 'center', vertical: 'center' }, offset: { x: 0, y: 0 } }, ref: dialogRef, children: (0, jsx_runtime_1.jsx)("div", { slot: "body", class: "oj-bg-body", children: (0, jsx_runtime_1.jsx)(resource_1.Resource, { rdj: changeManagerRdj || "", context: ctx === null || ctx === void 0 ? void 0 : ctx.context, onActionCompleted: (_detail) => {
                                var _a, _b;
                                const dlg = dialogRef.current;
                                try {
                                    (_b = (_a = (dlg)) === null || _a === void 0 ? void 0 : _a.close) === null || _b === void 0 ? void 0 : _b.call(_a);
                                }
                                catch (_e) { }
                                setChangeManagerRdj(undefined);
                                (0, transport_1.getDataComponent)("/api/-current-/edit/changeManager");
                                (0, refresh_1.emitRefresh)({ scope: { content: true, navtree: true } });
                            } }) }) })] }));
    }
    exports.ShoppingCartMenu = (0, ojvcomponent_1.registerCustomElement)("wrc-shoppingcart-menu", ShoppingCartMenuImpl, "ShoppingCartMenu");
    exports.default = exports.ShoppingCartMenu;
});
//# sourceMappingURL=shoppingcartmenu.js.map