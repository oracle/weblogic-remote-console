define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "preact/hooks", "wrc/resource/resource", "wrc/display/dialog", "wrc/shared/model/transport", "wrc/shared/controller/notification-utils", "ojs/ojlogger", "css!wrc/project-menu/project-menu-styles.css", "oj-c/button", "oj-c/menu-button", "ojs/ojpopup"], function (require, exports, jsx_runtime_1, ojvcomponent_1, hooks_1, resource_1, dialog_1, transport_1, notification_utils_1, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProjectMenu = void 0;
    function ProjectMenuImpl() {
        const ctx = (0, hooks_1.useContext)(resource_1.UserContext);
        const [providers, setProviders] = (0, hooks_1.useState)();
        (0, hooks_1.useEffect)(() => {
            const databus = ctx === null || ctx === void 0 ? void 0 : ctx.databus;
            const signal = databus === null || databus === void 0 ? void 0 : databus.subscribe((e) => {
                setProviders(e.providers.providers);
            });
            return () => signal === null || signal === void 0 ? void 0 : signal.detach();
        }, []);
        const navigate = (ref) => {
            var _a, _b;
            if (ref === null || ref === void 0 ? void 0 : ref.resourceData) {
                (_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.context) === null || _a === void 0 ? void 0 : _a.routerController) === null || _b === void 0 ? void 0 : _b.navigateToAbsolutePath(ref.resourceData);
            }
        };
        const menuItemAction = (event) => {
            const value = event.detail.selectedValue;
            Logger.info(`Selected menu item: ${value}`);
            if (value === PROVIDER_INFO_RDJ) {
                setProviderInfoRdj(value);
                requestAnimationFrame(() => document.getElementById("providerInfoDialog").open());
            }
            else if (value === PROVIDER_TABLE_RDJ) {
                navigate({ resourceData: value });
            }
            else {
                (0, transport_1.doAction)(value, undefined).then((response) => response.json())
                    .then((messageResponse) => {
                    var _a, _b, _c, _d, _e, _f, _g;
                    (0, notification_utils_1.broadcastMessageResponse)(ctx, messageResponse);
                    if (messageResponse.reinit) {
                        (_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.context) === null || _a === void 0 ? void 0 : _a.applicationController) === null || _b === void 0 ? void 0 : _b.resetDisplay();
                    }
                    if ((_c = messageResponse.resourceData) === null || _c === void 0 ? void 0 : _c.resourceData) {
                        Logger.info('navigating to ');
                        Logger.info((_d = messageResponse.resourceData) === null || _d === void 0 ? void 0 : _d.resourceData);
                        Logger.info(messageResponse.resourceData);
                        (_f = (_e = ctx === null || ctx === void 0 ? void 0 : ctx.context) === null || _e === void 0 ? void 0 : _e.routerController) === null || _f === void 0 ? void 0 : _f.navigateToAbsolutePath((_g = messageResponse.resourceData) === null || _g === void 0 ? void 0 : _g.resourceData);
                    }
                })
                    .catch((err) => {
                    Logger.error(err.message);
                    (0, notification_utils_1.broadcastErrorMessage)(ctx, err);
                });
            }
        };
        const openListener = () => {
            document.getElementById("project-menu-dialog").open();
        };
        const PROVIDER_INFO_RDJ = "/api/-current-/status/form";
        const PROVIDER_TABLE_RDJ = "/api/-project-/group";
        const [providerInfoRdj, setProviderInfoRdj] = (0, hooks_1.useState)();
        const dialogRef = (0, hooks_1.useRef)(null);
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("oj-c-button", { id: "projectMenuButton", class: "oj-sm-margin-0 oj-sm-padding-0", chroming: "ghost", "aria-label": "Project Menu", onojAction: openListener, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-overflow-v" }) }), (0, jsx_runtime_1.jsxs)("oj-menu", { id: "project-menu-dialog", slot: "menu", onojMenuAction: menuItemAction, openOptions: { launcher: "projectMenuButton" }, children: [(0, jsx_runtime_1.jsxs)("oj-option", { value: PROVIDER_INFO_RDJ, children: ["Provider Information\u00A0\u00A0", (0, jsx_runtime_1.jsx)("span", { class: "oj-ux-ico-external-link" })] }), (0, jsx_runtime_1.jsx)("oj-option", { value: PROVIDER_TABLE_RDJ, children: "Go To Project/Provider Table" }), (0, jsx_runtime_1.jsx)("oj-option", { id: "divider" }), providers === null || providers === void 0 ? void 0 : providers.map((provider) => ((0, jsx_runtime_1.jsx)("oj-option", { value: provider.resourceData, children: provider.label })))] }), (0, jsx_runtime_1.jsx)(dialog_1.Dialog, { id: "providerInfoDialog", onojClose: (e) => {
                        if ((e === null || e === void 0 ? void 0 : e.target) === dialogRef.current) {
                            setProviderInfoRdj(undefined);
                        }
                    }, ref: dialogRef, position: {
                        my: { horizontal: "center", vertical: "center" },
                        at: { horizontal: "center", vertical: "center" },
                    }, children: (0, jsx_runtime_1.jsxs)("div", { slot: "body", class: "oj-bg-body", children: [(0, jsx_runtime_1.jsx)(resource_1.Resource, { rdj: providerInfoRdj || "" }), " "] }) })] }));
    }
    exports.ProjectMenu = (0, ojvcomponent_1.registerCustomElement)("wrc-project-menu", ProjectMenuImpl, "ProjectMenu");
});
//# sourceMappingURL=project-menu.js.map