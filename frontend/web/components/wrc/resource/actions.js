define(["require", "exports", "preact/jsx-runtime", "wrc/display/dialog", "preact/hooks", "wrc/shared/url", "../shared/model/contentmodelfactory", "../shared/model/formcontentmodel", "./form/actioninput", "./resource", "./action-redwood-map", "ojs/ojcontext", "oj-c/button"], function (require, exports, jsx_runtime_1, dialog_1, hooks_1, url_1, contentmodelfactory_1, formcontentmodel_1, actioninput_1, resource_1, action_redwood_map_1, Context) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Actions = void 0;
    const Actions = ({ model, enabledActions, selectedKeys, onActionSelected, onActionPolling }) => {
        const actions = model.getActions();
        const enabledActionsMap = enabledActions === null || enabledActions === void 0 ? void 0 : enabledActions.reduce((map, obj) => {
            map[obj] = true;
            return map;
        }, {});
        const [actionInputRDJ, setActionInputRDJ] = (0, hooks_1.useState)("");
        const ctx = (0, hooks_1.useContext)(resource_1.UserContext);
        const [actionInputModel, setActionInputModel] = (0, hooks_1.useState)();
        const [actionInputTitle, setActionInputTitle] = (0, hooks_1.useState)();
        const [selectedAction, setSelectedAction] = (0, hooks_1.useState)();
        const completedAction = () => {
            if (selectedAction === null || selectedAction === void 0 ? void 0 : selectedAction.polling)
                onActionPolling(selectedAction.polling);
        };
        const getOverlayDialog = () => {
            const disposeOverlayDialog = () => { var _a; return (_a = document.getElementById("overlayFormDialog")) === null || _a === void 0 ? void 0 : _a.close(); };
            return ((0, jsx_runtime_1.jsx)(dialog_1.Dialog, { id: "overlayFormDialog", title: actionInputTitle, children: (0, jsx_runtime_1.jsx)("div", { slot: "body", class: "oj-bg-body", children: (0, jsx_runtime_1.jsx)(actioninput_1.ActionInputForm, { formModel: actionInputModel, setModel: setActionInputModel, callback: disposeOverlayDialog, completed: completedAction, action: selectedAction }) }) }));
        };
        const _onActionSelected = (action) => {
            if (model.getActionFormInput(action)) {
                const references = [...(selectedKeys === null || selectedKeys === void 0 ? void 0 : selectedKeys.values()) || []];
                model
                    .invokeAction(action, references)
                    .then((response) => response.json())
                    .then((rdj) => {
                    if (rdj.fileSaver) {
                        const blob = new Blob([JSON.stringify(rdj.fileSaver.contents)], { type: rdj.fileSaver.mimeType });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = rdj.fileSaver.filename || 'project';
                        a.click();
                        URL.revokeObjectURL(url);
                        return;
                    }
                    const cmf = new contentmodelfactory_1.ContentModelFactory();
                    cmf.rdjData = rdj;
                    cmf
                        .build(undefined)
                        .then((model) => {
                        if (!(model instanceof formcontentmodel_1.FormContentModel)) {
                            throw new Error("Action input must be a form");
                        }
                        model.rowsSelectedForActionInput = references;
                        setActionInputTitle(action.label);
                        setActionInputModel(model);
                        setSelectedAction(action);
                        requestAnimationFrame(() => {
                            const dlg = document.getElementById("overlayFormDialog");
                            if (!dlg)
                                return;
                            const centeredPos = { my: "center", at: "center", of: window };
                            const bc = Context.getContext(dlg).getBusyContext();
                            bc.whenReady().then(() => {
                                var _a, _b;
                                try {
                                    (_b = (_a = dlg).setProperty) === null || _b === void 0 ? void 0 : _b.call(_a, "position", centeredPos);
                                }
                                catch (_e) {
                                    try {
                                        dlg.position = centeredPos;
                                    }
                                    catch (_e2) {
                                    }
                                }
                                dlg.open();
                            });
                        });
                    });
                });
            }
            else {
                onActionSelected(action);
            }
        };
        const getAction = (action) => {
            const getImage = (action) => action_redwood_map_1.ActionRedwoodMap[action.name] ? ((0, jsx_runtime_1.jsx)("span", { slot: 'startIcon', class: action_redwood_map_1.ActionRedwoodMap[action.name] }))
                :
                    ((0, jsx_runtime_1.jsx)("img", { slot: "startIcon", alt: action.label, src: (0, url_1.requireAsset)(`wrc/assets/images/action-${action.name.toLowerCase()}-icon-blk_24x24.png`) }));
            const getLabelText = (action) => {
                let label;
                if (action.saveFirstLabel && model instanceof formcontentmodel_1.FormContentModel) {
                    const formModel = model;
                    if (model.hasChanges())
                        label = action.saveFirstLabel;
                }
                return label || action.label;
            };
            const getLabel = (action) => {
                const label = getLabelText(action);
                return ((0, jsx_runtime_1.jsx)("span", { class: "oj-navigationlist-item-label", style: { alignContent: "center" }, children: label }));
            };
            if (action.actions) {
                const actionMenuName = action.name + "Menu";
                const actionMenuRef = (0, hooks_1.useRef)(null);
                return ((0, jsx_runtime_1.jsxs)("span", { class: "wrc-action", children: [(0, jsx_runtime_1.jsxs)("oj-c-button", { id: action.name, "data-testid": action.name, disabled: !(enabledActionsMap === null || enabledActionsMap === void 0 ? void 0 : enabledActionsMap[action.name]), chroming: "solid", label: getLabelText(action), onojAction: () => actionMenuRef.current.open(), children: [getImage(action), getLabel(action)] }), (0, jsx_runtime_1.jsx)("oj-menu", { ref: actionMenuRef, id: actionMenuName, "aria-labelledby": action.name, openOptions: { launcher: action.name }, slot: "menu", onojMenuAction: (event) => {
                                var _a;
                                const actionToInvoke = (_a = action.actions) === null || _a === void 0 ? void 0 : _a.find((subaction) => subaction.name === event.detail.selectedValue);
                                if (actionToInvoke)
                                    _onActionSelected(actionToInvoke);
                            }, children: (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: action.actions.map((subaction) => ((0, jsx_runtime_1.jsx)("oj-option", { disabled: !(enabledActionsMap === null || enabledActionsMap === void 0 ? void 0 : enabledActionsMap[subaction.name]), id: subaction.name, value: subaction.name, children: subaction.label }))) }) })] }));
            }
            return ((0, jsx_runtime_1.jsx)("span", { class: "wrc-action", children: (0, jsx_runtime_1.jsxs)("oj-c-button", { "data-testid": action.name, disabled: !(enabledActionsMap === null || enabledActionsMap === void 0 ? void 0 : enabledActionsMap[action.name]), chroming: "solid", label: getLabelText(action), onojAction: (event) => {
                        _onActionSelected(action);
                        return true;
                    }, children: [getImage(action), getLabel(action)] }) }));
        };
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [getOverlayDialog(), (0, jsx_runtime_1.jsx)("div", { class: "wrc-actions-bar oj-flex oj-sm-align-items-center", children: actions === null || actions === void 0 ? void 0 : actions.map((action) => getAction(action)) })] }));
    };
    exports.Actions = Actions;
});
//# sourceMappingURL=actions.js.map