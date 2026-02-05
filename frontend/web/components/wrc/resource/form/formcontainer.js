var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "preact/jsx-runtime", "preact/hooks", "wrc/shared/controller/notification-utils", "../../shared/model/formcontentmodel", "../../shared/model/tablecontentmodel", "../actions", "../resource", "./form", "./formintro", "../table/tableintro", "./formtoolbar", "../table/table-toolbar", "./field-settings-dialog", "./slicetable", "./tabs", "../breadcrumbs", "../shared/help", "ojs/ojkeyset", "wrc/shared/refresh", "wrc/shared/messages", "ojs/ojlogger", "ojL10n!wrc/shared/resources/nls/frontend"], function (require, exports, jsx_runtime_1, hooks_1, notification_utils_1, formcontentmodel_1, tablecontentmodel_1, actions_1, resource_1, form_1, formintro_1, tableintro_1, formtoolbar_1, table_toolbar_1, field_settings_dialog_1, slicetable_1, tabs_1, breadcrumbs_1, help_1, ojkeyset_1, refresh_1, messages_1, Logger, t) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FormContainer = void 0;
    const FormContainer = ({ model, pageContext }) => {
        var _a;
        const [loading, setLoading] = (0, hooks_1.useState)(false);
        const [_1, setRefresh] = (0, hooks_1.useState)(false);
        const [contentModel, setModel] = (0, hooks_1.useState)(model);
        const [fieldSettingsOpen, setFieldSettingsOpen] = (0, hooks_1.useState)(false);
        const [fieldSettingsField, setFieldSettingsField] = (0, hooks_1.useState)(undefined);
        const [showHelp, setShowHelp] = (0, hooks_1.useState)(false);
        const [selectedKeys, setSelectedKeys] = (0, hooks_1.useState)(new ojkeyset_1.KeySetImpl());
        const [enabledActions, setEnabledActions] = (0, hooks_1.useState)([]);
        (0, hooks_1.useEffect)(() => { setModel(model); }, [model]);
        (0, hooks_1.useEffect)(() => {
            var _a, _b, _c;
            const title = (_a = contentModel === null || contentModel === void 0 ? void 0 : contentModel.getPageTitle) === null || _a === void 0 ? void 0 : _a.call(contentModel);
            if (title) {
                const appName = ((_c = (_b = t["wrc-header"]) === null || _b === void 0 ? void 0 : _b.text) === null || _c === void 0 ? void 0 : _c.appName) || "WebLogic Remote Console";
                document.title = `${appName} - ${title}`;
            }
        }, [contentModel]);
        (0, hooks_1.useEffect)(() => { return () => contentModel.stopPolling(); }, []);
        (0, hooks_1.useEffect)(() => {
            const unsubscribe = (0, refresh_1.subscribeToRefresh)((detail) => {
                const scope = (detail === null || detail === void 0 ? void 0 : detail.scope) || {};
                if (scope.content) {
                    try {
                        if (contentModel) {
                            Promise.resolve(contentModel.refresh())
                                .catch((err) => {
                                var _a, _b;
                                if (err && err.status === 404) {
                                    let pathToForwardTo;
                                    const breadcrumbs = model.getBreadcrumbs();
                                    if (breadcrumbs && breadcrumbs.length > 1) {
                                        const breadcrumb = breadcrumbs[breadcrumbs.length - 2];
                                        pathToForwardTo = breadcrumb.resourceData;
                                    }
                                    (_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.context) === null || _a === void 0 ? void 0 : _a.routerController) === null || _b === void 0 ? void 0 : _b.navigateToAbsolutePath(pathToForwardTo || "/api/-current-/group/");
                                    return;
                                }
                                throw err;
                            })
                                .finally(() => {
                                setRefresh((prev) => !prev);
                            });
                        }
                        else {
                            setRefresh((prev) => !prev);
                        }
                    }
                    catch (_e) {
                        setRefresh((prev) => !prev);
                    }
                }
            });
            return unsubscribe;
        }, [contentModel]);
        (0, hooks_1.useEffect)(() => {
            const handler = (e) => {
                const detail = e.detail;
                if (detail === null || detail === void 0 ? void 0 : detail.fieldDescription) {
                    setFieldSettingsField(detail.fieldDescription);
                    setFieldSettingsOpen(true);
                }
            };
            document.addEventListener("open-field-settings", handler);
            return () => {
                document.removeEventListener("open-field-settings", handler);
            };
        }, []);
        const getToolbarArea = () => {
            if (contentModel instanceof formcontentmodel_1.FormContentModel) {
                return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(formtoolbar_1.default, { formModel: contentModel, setModel: setModel, showHelp: showHelp, onHelpClick: () => setShowHelp(!showHelp), pageContext: pageContext, pageLoading: loading, onPageRefresh: () => setRefresh(prev => !prev) }), !showHelp ? (0, jsx_runtime_1.jsx)(formintro_1.FormIntro, { formModel: contentModel, setModel: setModel }) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})] }));
            }
            else if (contentModel instanceof tablecontentmodel_1.TableContentModel) {
                return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(table_toolbar_1.default, { tableContent: contentModel, setTableContent: setModel, showHelp: showHelp, onHelpClick: () => setShowHelp(!showHelp), pageContext: pageContext, pageLoading: loading, onPageRefresh: () => setRefresh(prev => !prev) }), !showHelp ? (0, jsx_runtime_1.jsx)(tableintro_1.TableIntro, { tableContent: contentModel }) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})] }));
            }
            else {
                return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
            }
        };
        const getTabContentArea = () => {
            if (contentModel instanceof tablecontentmodel_1.TableContentModel) {
                return (0, jsx_runtime_1.jsx)(slicetable_1.default, { tableModel: contentModel, pageContext: pageContext, onSelectionChanged: (keys) => setSelectedKeys(keys) });
            }
            else if (contentModel instanceof formcontentmodel_1.FormContentModel) {
                return (0, jsx_runtime_1.jsx)(form_1.default, { formModel: contentModel, setModel: setModel });
            }
            else {
                return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
            }
        };
        const ctx = (0, hooks_1.useContext)(resource_1.UserContext);
        const beginPolling = (polling) => {
            contentModel.startPolling(polling, () => setRefresh(prev => !prev));
            setRefresh(prev => !prev);
        };
        const getSelectionCount = (keys) => { var _a; return Array.from(((_a = keys === null || keys === void 0 ? void 0 : keys.values) === null || _a === void 0 ? void 0 : _a.call(keys)) || []).length; };
        const computeEnabledActions = () => {
            var _a;
            const actions = ((_a = contentModel.getActions) === null || _a === void 0 ? void 0 : _a.call(contentModel)) || [];
            if (!(contentModel instanceof tablecontentmodel_1.TableContentModel)) {
                const all = [];
                actions.forEach((a) => {
                    all.push(a.name);
                    if (a.actions)
                        a.actions.forEach(sub => all.push(sub.name));
                });
                setEnabledActions(all);
                return;
            }
            const newEnabled = [];
            const selectedCount = getSelectionCount(selectedKeys);
            const isEnabledFor = (a) => {
                switch (a.rows) {
                    case "multiple":
                        return selectedCount > 0;
                    case "one":
                        return selectedCount === 1;
                    case "none":
                    default:
                        return true;
                }
            };
            actions.forEach((a) => {
                if (a.actions) {
                    let anyEnabled = false;
                    a.actions.forEach((sub) => {
                        const enabled = isEnabledFor(sub);
                        if (enabled)
                            newEnabled.push(sub.name);
                        anyEnabled = anyEnabled || enabled;
                    });
                    if (anyEnabled)
                        newEnabled.push(a.name);
                }
                else {
                    if (isEnabledFor(a))
                        newEnabled.push(a.name);
                }
            });
            setEnabledActions(newEnabled);
        };
        (0, hooks_1.useEffect)(() => {
            computeEnabledActions();
        }, [selectedKeys, contentModel]);
        const actionSelected = (action) => __awaiter(void 0, void 0, void 0, function* () {
            const formModel = model;
            if (action.saveFirstLabel && formModel.hasChanges()) {
                try {
                    const response = yield formModel.update();
                    const messageResponse = yield response.json();
                    const actionFailed = !(0, messages_1.isSuccessful)(messageResponse);
                    (0, notification_utils_1.broadcastMessageResponse)(ctx, messageResponse);
                    if (actionFailed) {
                        return;
                    }
                    if (!actionFailed) {
                        formModel.clearChanges();
                        yield formModel.refresh();
                    }
                }
                catch (err) {
                    (0, notification_utils_1.broadcastErrorMessage)(ctx, err);
                }
            }
            const references = (contentModel instanceof tablecontentmodel_1.TableContentModel)
                ? ([...selectedKeys.values()].map((r) => JSON.parse(r)))
                : undefined;
            contentModel
                .invokeAction(action, references)
                .then((response) => response.json())
                .then((messageResponse) => {
                var _a, _b, _c, _d, _f, _g, _h;
                if (action.polling) {
                    beginPolling(action.polling);
                }
                (0, notification_utils_1.broadcastMessageResponse)(ctx, messageResponse);
                if ((0, messages_1.isSuccessful)(messageResponse)) {
                    (_a = ctx === null || ctx === void 0 ? void 0 : ctx.onActionCompleted) === null || _a === void 0 ? void 0 : _a.call(ctx, { action, messages: messageResponse.messages });
                }
                if (messageResponse.reinit) {
                    (_c = (_b = ctx === null || ctx === void 0 ? void 0 : ctx.context) === null || _b === void 0 ? void 0 : _b.applicationController) === null || _c === void 0 ? void 0 : _c.resetDisplay();
                }
                if ((_d = messageResponse.resourceData) === null || _d === void 0 ? void 0 : _d.resourceData) {
                    (_g = (_f = ctx === null || ctx === void 0 ? void 0 : ctx.context) === null || _f === void 0 ? void 0 : _f.routerController) === null || _g === void 0 ? void 0 : _g.navigateToAbsolutePath((_h = messageResponse.resourceData) === null || _h === void 0 ? void 0 : _h.resourceData);
                }
            })
                .catch((err) => {
                Logger.error(err.message);
                (0, notification_utils_1.broadcastErrorMessage)(ctx, err);
            });
        });
        const hasChangesFlag = (_a = contentModel === null || contentModel === void 0 ? void 0 : contentModel.hasChanges) === null || _a === void 0 ? void 0 : _a.call(contentModel);
        const isMainWindow = pageContext === 'main';
        return ((0, jsx_runtime_1.jsxs)("div", { children: [isMainWindow ? (0, jsx_runtime_1.jsx)(breadcrumbs_1.default, { model: contentModel }) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}), contentModel instanceof formcontentmodel_1.FormContentModel ? ((0, jsx_runtime_1.jsx)(field_settings_dialog_1.default, { open: fieldSettingsOpen, formModel: contentModel, fieldDescription: fieldSettingsField, onClose: () => {
                        setFieldSettingsOpen(false);
                        setFieldSettingsField(undefined);
                    }, onApply: () => setModel(contentModel.clone()) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), getToolbarArea(), (0, jsx_runtime_1.jsx)("div", { id: "cfe-form", "data-has-changes": hasChangesFlag, children: showHelp ? ((contentModel instanceof formcontentmodel_1.FormContentModel || contentModel instanceof tablecontentmodel_1.TableContentModel) ? ((0, jsx_runtime_1.jsx)(help_1.Help, { model: contentModel })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))) : ((0, jsx_runtime_1.jsx)(tabs_1.default, { model: contentModel, setModel: setModel, setLoading: setLoading, pageContext: pageContext, children: loading ? ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { id: "form-actions-strip-container", class: "cfe-actions-strip-container", children: (0, jsx_runtime_1.jsx)(actions_1.Actions, { model: contentModel, enabledActions: enabledActions, selectedKeys: selectedKeys, onActionSelected: actionSelected, onActionPolling: beginPolling }) }), getTabContentArea()] })) })) })] }));
    };
    exports.FormContainer = FormContainer;
});
//# sourceMappingURL=formcontainer.js.map