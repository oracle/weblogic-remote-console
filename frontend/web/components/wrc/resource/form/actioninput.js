define(["require", "exports", "preact/jsx-runtime", "ojL10n!wrc/shared/resources/nls/frontend", "preact/hooks", "wrc/shared/url", "../resource", "./form", "./formintro", "wrc/shared/controller/notification-utils", "../action-redwood-map", "../shared/help", "wrc/shared/messages", "oj-c/button"], function (require, exports, jsx_runtime_1, t, hooks_1, url_1, resource_1, form_1, formintro_1, notification_utils_1, action_redwood_map_1, help_1, messages_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ActionInputForm = void 0;
    const ActionInputForm = ({ formModel, setModel, callback, completed, action }) => {
        const [showHelp, setShowHelp] = (0, hooks_1.useState)(false);
        const helpImageSrc = !showHelp
            ? (0, url_1.requireAsset)("wrc/assets/images/toggle-help-on-blk_24x24.png")
            : (0, url_1.requireAsset)("wrc/assets/images/toggle-help-off-blk_24x24.png");
        const helpIconClicked = () => {
            setShowHelp(!showHelp);
        };
        const onCancel = () => {
            callback === null || callback === void 0 ? void 0 : callback();
        };
        const ctx = (0, hooks_1.useContext)(resource_1.UserContext);
        const onSave = () => {
            formModel === null || formModel === void 0 ? void 0 : formModel.update().then((response) => response.json()).then((messageResponse) => {
                var _a, _b, _c, _d, _e, _f;
                completed === null || completed === void 0 ? void 0 : completed();
                (0, notification_utils_1.broadcastMessageResponse)(ctx, messageResponse);
                if ((0, messages_1.isSuccessful)(messageResponse)) {
                    const actionObj = action ? action : { name: "actionInput", label: "Action Input" };
                    (_a = ctx === null || ctx === void 0 ? void 0 : ctx.onActionCompleted) === null || _a === void 0 ? void 0 : _a.call(ctx, { action: actionObj, messages: messageResponse.messages });
                }
                if (messageResponse.reinit) {
                    (_c = (_b = ctx === null || ctx === void 0 ? void 0 : ctx.context) === null || _b === void 0 ? void 0 : _b.applicationController) === null || _c === void 0 ? void 0 : _c.resetDisplay();
                }
                if ((_d = messageResponse.resourceData) === null || _d === void 0 ? void 0 : _d.resourceData) {
                    (_f = (_e = ctx === null || ctx === void 0 ? void 0 : ctx.context) === null || _e === void 0 ? void 0 : _e.routerController) === null || _f === void 0 ? void 0 : _f.navigateToAbsolutePath(messageResponse.resourceData.resourceData);
                }
            }).catch((err) => {
                (0, notification_utils_1.broadcastErrorMessage)(ctx, err);
            });
            callback === null || callback === void 0 ? void 0 : callback();
        };
        if (formModel) {
            return ((0, jsx_runtime_1.jsxs)("div", { slot: "body", children: [(0, jsx_runtime_1.jsxs)("div", { id: "overlay-toolbar-container", class: "oj-flex", children: [(0, jsx_runtime_1.jsxs)("div", { id: "overlay-form-toolbar-buttons", class: "oj-flex-bar cfe-overlay-form-dialog-toolbar", children: [(0, jsx_runtime_1.jsx)("div", { id: "overlay-form-toolbar-save-button", children: (0, jsx_runtime_1.jsxs)("oj-c-button", { chroming: "borderless", label: t["wrc-common"].buttons.done.label, onojAction: onSave, children: [(0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: action_redwood_map_1.ActionRedwoodMap["done"] }), (0, jsx_runtime_1.jsx)("span", { class: "button-label", children: t["wrc-common"].buttons.done.label })] }) }), (0, jsx_runtime_1.jsxs)("oj-c-button", { chroming: "borderless", label: t["wrc-common"].buttons.cancel.label, onojAction: onCancel, children: [(0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: action_redwood_map_1.ActionRedwoodMap["cancel"] }), (0, jsx_runtime_1.jsx)("span", { class: "button-label", children: t["wrc-common"].buttons.cancel.label })] })] }), (0, jsx_runtime_1.jsx)("div", { id: "overlay-form-toolbar-icons", class: "oj-flex-item cfe-overlay-form-dialog-toolbar", children: (0, jsx_runtime_1.jsx)("div", { class: "oj-flex oj-sm-flex-items-initial oj-sm-justify-content-flex-end cfe-flex-items-pad", children: (0, jsx_runtime_1.jsx)("div", { id: "overlay-page-help-toolbar-icon", class: "oj-flex-item", children: (0, jsx_runtime_1.jsx)("a", { href: "#", title: t["wrc-form-toolbar"].icons.help.tooltip, tabIndex: -1, onClick: helpIconClicked, children: (0, jsx_runtime_1.jsx)("img", { id: "overlay-page-help-icon", src: helpImageSrc, alt: t["wrc-form-toolbar"].icons.help.tooltip }) }) }) }) })] }), (0, jsx_runtime_1.jsx)("div", { id: "overlay-container", class: "cfe-overlay-container", children: !showHelp ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(formintro_1.FormIntro, { formModel: formModel, setModel: setModel }), (0, jsx_runtime_1.jsx)(form_1.default, { formModel: formModel, setModel: setModel })] })) : ((0, jsx_runtime_1.jsx)(help_1.Help, { model: formModel })) })] }));
        }
        else {
            return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
        }
    };
    exports.ActionInputForm = ActionInputForm;
});
//# sourceMappingURL=actioninput.js.map