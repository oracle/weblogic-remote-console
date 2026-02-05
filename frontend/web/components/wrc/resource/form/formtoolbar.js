var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "preact/jsx-runtime", "ojL10n!wrc/shared/resources/nls/frontend", "preact/hooks", "../resource", "wrc/shared/controller/notification-utils", "wrc/shared/weighted-sort", "../action-redwood-map", "../shared/toolbar-render", "../shared/toolbaricons", "wrc/shared/model/transport", "wrc/shared/messages", "ojs/ojlogger"], function (require, exports, jsx_runtime_1, t, hooks_1, resource_1, notification_utils_1, weighted_sort_1, action_redwood_map_1, toolbar_render_1, toolbaricons_1, transport_1, messages_1, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BUTTONS = void 0;
    var BUTTONS;
    (function (BUTTONS) {
        BUTTONS["Cancel"] = "cancel";
        BUTTONS["New"] = "new";
        BUTTONS["Save"] = "save";
        BUTTONS["__DELETE"] = "__DELETE";
        BUTTONS["Write"] = "write";
        BUTTONS["SaveNow"] = "savenow";
        BUTTONS["Dashboard"] = "dashboard";
    })(BUTTONS || (exports.BUTTONS = BUTTONS = {}));
    const FormToolbar = ({ formModel, setModel, showHelp, onHelpClick, pageContext, pageLoading = false, onPageRefresh }) => {
        var _a;
        {
            const ctx = (0, hooks_1.useContext)(resource_1.UserContext);
            const [refresh, setRefresh] = (0, hooks_1.useState)(false);
            const persistChanges = () => {
                formModel
                    .update()
                    .then((response) => response.json())
                    .then((messageResponse) => {
                    const actionFailed = !(0, messages_1.isSuccessful)(messageResponse);
                    (0, notification_utils_1.broadcastMessageResponse)(ctx, messageResponse);
                    if (!actionFailed) {
                        formModel.clearChanges();
                        formModel.refresh().then(() => {
                            var _a, _b;
                            setModel(formModel.clone());
                            if (messageResponse.resourceData) {
                                (_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.context) === null || _a === void 0 ? void 0 : _a.routerController) === null || _b === void 0 ? void 0 : _b.navigateToAbsolutePath(messageResponse.resourceData.resourceData || "");
                            }
                        });
                    }
                })
                    .then(() => {
                    formModel.refresh().then(() => {
                        setModel(formModel.clone());
                        setRefresh(!refresh);
                    });
                })
                    .catch((err) => {
                    (0, notification_utils_1.broadcastErrorMessage)(ctx, err);
                });
            };
            const shouldShowCreateCTA = formModel.isCreatableOptionalSingleton() && formModel.isDataMissing();
            const buttons = {
                [BUTTONS.Cancel]: {
                    accesskey: undefined,
                    isEnabled: () => formModel.hasChanges(),
                    action: (event) => {
                        formModel.clear();
                        setModel(formModel.clone());
                        setRefresh(!refresh);
                    },
                    isVisible: () => formModel.hasChanges(),
                    weight: 9,
                },
                [BUTTONS.New]: {
                    accesskey: "S",
                    isEnabled: () => shouldShowCreateCTA ? true : formModel.hasChanges(),
                    action: (_event) => __awaiter(void 0, void 0, void 0, function* () {
                        var _a, _b, _c, _d;
                        if (shouldShowCreateCTA) {
                            const createForm = formModel.getCreateForm();
                            const createFormRef = createForm === null || createForm === void 0 ? void 0 : createForm.resourceData;
                            if (createFormRef) {
                                const urlObj = new URL(createFormRef, window.location.href);
                                const params = new URLSearchParams(urlObj.search);
                                params.set("action", "create");
                                urlObj.search = params.toString();
                                try {
                                    const res = yield (0, transport_1.doAction)(urlObj.pathname + urlObj.search + urlObj.hash, undefined, [], { data: {} });
                                    const messageResponse = yield res.json().catch(() => undefined);
                                    if (messageResponse) {
                                        (0, notification_utils_1.broadcastMessageResponse)(ctx, messageResponse);
                                        if ((0, messages_1.isSuccessful)(messageResponse)) {
                                            (_a = ctx === null || ctx === void 0 ? void 0 : ctx.onActionCompleted) === null || _a === void 0 ? void 0 : _a.call(ctx, {
                                                action: { name: "create", label: t["wrc-form-toolbar"].buttons.new.label },
                                                messages: messageResponse.messages
                                            });
                                        }
                                        const navTo = (_b = messageResponse === null || messageResponse === void 0 ? void 0 : messageResponse.resourceData) === null || _b === void 0 ? void 0 : _b.resourceData;
                                        if (navTo) {
                                            (_d = (_c = ctx === null || ctx === void 0 ? void 0 : ctx.context) === null || _c === void 0 ? void 0 : _c.routerController) === null || _d === void 0 ? void 0 : _d.navigateToAbsolutePath(navTo);
                                        }
                                    }
                                }
                                catch (err) {
                                    (0, notification_utils_1.broadcastErrorMessage)(ctx, err);
                                }
                            }
                        }
                        else {
                            persistChanges();
                        }
                    }),
                    isVisible: () => formModel.isCreate() || shouldShowCreateCTA,
                    weight: -1,
                },
                [BUTTONS.Save]: {
                    accesskey: "S",
                    isEnabled: () => formModel.hasChanges(),
                    action: (event) => persistChanges(),
                    isVisible: () => formModel.canSaveToCart &&
                        !formModel.isFormReadOnly() &&
                        !formModel.isCreate() &&
                        !formModel.isActionInput() &&
                        !shouldShowCreateCTA,
                    weight: -1,
                },
                [BUTTONS.__DELETE]: {
                    accesskey: undefined,
                    label: t["wrc-form-toolbar"].buttons.delete.label,
                    isEnabled: () => true,
                    action: (_event) => __awaiter(void 0, void 0, void 0, function* () {
                        var _a;
                        const selfRef = formModel.getSelfResourceData();
                        if (!selfRef)
                            return;
                        try {
                            const res = yield (0, transport_1.doAction)(selfRef, { name: "__DELETE" }, [{ resourceData: selfRef }]);
                            const messageResponse = yield res.json().catch(() => undefined);
                            if (messageResponse) {
                                (0, notification_utils_1.broadcastMessageResponse)(ctx, messageResponse);
                                if ((0, messages_1.isSuccessful)(messageResponse)) {
                                    (_a = ctx === null || ctx === void 0 ? void 0 : ctx.onActionCompleted) === null || _a === void 0 ? void 0 : _a.call(ctx, {
                                        action: { name: "__DELETE", label: t["wrc-form-toolbar"].buttons.delete.label },
                                        messages: messageResponse.messages
                                    });
                                }
                            }
                            yield formModel.refresh();
                            setModel(formModel.clone());
                        }
                        catch (err) {
                            (0, notification_utils_1.broadcastErrorMessage)(ctx, err);
                        }
                    }),
                    isVisible: () => formModel.isCreatableOptionalSingleton() &&
                        !formModel.isDataMissing() &&
                        !formModel.isFormReadOnly() &&
                        !formModel.isActionInput(),
                    weight: -1,
                },
                [BUTTONS.Write]: {
                    accesskey: "S",
                    isEnabled: () => true,
                    action: (event) => Logger.info("download"),
                    isVisible: () => formModel.canDownload,
                },
                [BUTTONS.SaveNow]: {
                    accesskey: "S",
                    isEnabled: () => formModel.hasChanges(),
                    action: (event) => persistChanges(),
                    isVisible: () => formModel.canSaveNow && !formModel.isCreate(),
                    weight: -1,
                },
                [BUTTONS.Dashboard]: {
                    accesskey: undefined,
                    isEnabled: () => formModel.canCreateDashboard(),
                    action: (event) => {
                        var _a, _b;
                        const form = formModel.getDashboardCreateForm();
                        if (form === null || form === void 0 ? void 0 : form.resourceData) {
                            (_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.context) === null || _a === void 0 ? void 0 : _a.routerController) === null || _b === void 0 ? void 0 : _b.navigateToAbsolutePath(form.resourceData);
                        }
                    },
                    isVisible: () => formModel.canCreateDashboard(),
                    label: ((_a = formModel.getDashboardCreateForm()) === null || _a === void 0 ? void 0 : _a.label) || "Dashboard",
                    weight: 99,
                },
            };
            const augmentButtons = () => {
                Object.keys(buttons).forEach((k) => {
                    var _a;
                    if (!buttons[k].label)
                        buttons[k].label = ((_a = t["wrc-form-toolbar"].buttons[k]) === null || _a === void 0 ? void 0 : _a.label) || "";
                    buttons[k].iconClass = action_redwood_map_1.ActionRedwoodMap[k];
                    buttons[k].iconFile = `${k}-icon-blk_24x24`;
                });
            };
            augmentButtons();
            const syncAction = () => {
                if (pageLoading)
                    return;
                if (formModel.isPolling()) {
                    formModel.stopPolling();
                    onPageRefresh === null || onPageRefresh === void 0 ? void 0 : onPageRefresh();
                }
                else {
                    formModel.refresh().then(() => {
                        onPageRefresh === null || onPageRefresh === void 0 ? void 0 : onPageRefresh();
                    });
                }
            };
            const isMainWindow = pageContext === 'main';
            return ((0, jsx_runtime_1.jsxs)("div", { id: "form-toolbar-container", class: "oj-flex", style: "max-width: 75rem;", children: [(0, jsx_runtime_1.jsx)("div", { id: "form-toolbar-buttons", class: "oj-flex-bar", children: (0, jsx_runtime_1.jsx)("div", { class: "oj-flex-bar-start", children: !showHelp ? ((0, jsx_runtime_1.jsx)(weighted_sort_1.WeightedSort, { children: (0, toolbar_render_1.buildToolbarButtons)(buttons) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})) }) }), (0, jsx_runtime_1.jsx)("div", { id: "form-toolbar-icons", class: "oj-flex-item", children: isMainWindow ? ((0, jsx_runtime_1.jsx)(toolbaricons_1.default, { showHelp: showHelp, onHelpClick: onHelpClick, syncEnabled: !formModel.hasChanges(), onSyncClick: syncAction, actionPolling: formModel.isPolling() || pageLoading, pageContext: pageContext })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})) })] }));
        }
    };
    exports.default = FormToolbar;
});
//# sourceMappingURL=formtoolbar.js.map