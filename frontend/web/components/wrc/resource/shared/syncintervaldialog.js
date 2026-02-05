define(["require", "exports", "preact/jsx-runtime", "ojL10n!wrc/shared/resources/nls/frontend", "preact/hooks", "oj-c/button"], function (require, exports, jsx_runtime_1, t, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const SyncIntervalDialog = ({ syncEnabled, onSyncIntervalSet }) => {
        const [syncInterval, setSyncInterval] = (0, hooks_1.useState)(0);
        const dialogRef = (0, hooks_1.useRef)(null);
        const inputRef = (0, hooks_1.useRef)(null);
        const okButtonRef = (0, hooks_1.useRef)(null);
        (0, hooks_1.useEffect)(() => {
            inputRef.current.addEventListener('keyup', handleKeyUp);
            return () => {
                inputRef.current.removeEventListener('keyup', handleKeyUp);
            };
        }, [inputRef, okButtonRef]);
        const handleKeyUp = (event) => {
            event.preventDefault();
            if (event.key == 'Enter')
                okButtonRef.current.click();
        };
        const openDialog = (event) => {
            if (event === null || event === void 0 ? void 0 : event.preventDefault)
                event.preventDefault();
            const dlg = dialogRef.current;
            if (dlg && typeof dlg.open === "function") {
                dlg.open();
            }
        };
        const closeDialog = () => {
            const dlg = dialogRef.current;
            if (dlg && typeof dlg.close === "function") {
                dlg.close();
            }
        };
        const viewSyncInterval = (syncInterval) => {
            return ((syncInterval <= 0) ? "" : `${syncInterval}`);
        };
        const sanityCheckInput = (syncInterval) => {
            if (syncInterval === "")
                return "0";
            const value = parseInt(syncInterval);
            if (isNaN(value))
                return "0";
            return value <= 0 ? "0" : `${value}`;
        };
        const okHandler = (event) => {
            var _a;
            event.preventDefault();
            closeDialog();
            const inputEl = inputRef.current;
            const inputValue = inputEl ? (_a = inputEl.value) !== null && _a !== void 0 ? _a : "" : "";
            const sanitized = sanityCheckInput(`${inputValue}`);
            const newSyncInterval = parseInt(sanitized);
            if (typeof onSyncIntervalSet === "function") {
                setSyncInterval(newSyncInterval);
                onSyncIntervalSet(newSyncInterval);
            }
        };
        const cancelHandler = (event) => {
            event.preventDefault();
            closeDialog();
            const inputEl = inputRef.current;
            if (inputEl)
                inputEl["value"] = viewSyncInterval(syncInterval);
        };
        const syncIntervalTooltip = t["wrc-form-toolbar"].icons.syncInterval.tooltip;
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { id: "sync-interval-toolbar-icon", class: "oj-flex-item", children: (0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "borderless", onojAction: openDialog, disabled: !syncEnabled, tooltip: syncIntervalTooltip, "aria-label": syncIntervalTooltip, "data-testid": "sync-interval", children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-reset" }) }) }), (0, jsx_runtime_1.jsxs)("oj-dialog", { ref: dialogRef, id: "syncIntervalDialog", "dialog-title": t["wrc-sync-interval"].dialogSync.title, "initial-visibility": "hide", "cancel-behavior": "icon", children: [(0, jsx_runtime_1.jsxs)("div", { slot: "body", children: [(0, jsx_runtime_1.jsx)("div", { id: "sync-interval-instructions", "aria-label": t["wrc-sync-interval"].dialogSync.instructions, class: "cfe-dialog-prompt", children: (0, jsx_runtime_1.jsx)("span", { children: t["wrc-sync-interval"].dialogSync.instructions }) }), (0, jsx_runtime_1.jsxs)("oj-form-layout", { "label-edge": "start", "label-width": "72%", children: [(0, jsx_runtime_1.jsx)("oj-label", { slot: "label", for: "interval-field", children: (0, jsx_runtime_1.jsx)("span", { children: t["wrc-sync-interval"].dialogSync.fields.interval.label }) }), (0, jsx_runtime_1.jsx)("oj-input-text", { id: "interval-field", ref: inputRef, value: viewSyncInterval(syncInterval) })] })] }), (0, jsx_runtime_1.jsxs)("div", { slot: "footer", children: [(0, jsx_runtime_1.jsx)("oj-c-button", { ref: okButtonRef, id: "dlgOkBtn1", label: t["wrc-common"].buttons.ok.label, onojAction: okHandler, children: (0, jsx_runtime_1.jsx)("span", { class: "button-label", children: t["wrc-common"].buttons.ok.label }) }), (0, jsx_runtime_1.jsx)("oj-c-button", { id: "dlgCancelBtn1", label: t["wrc-common"].buttons.cancel.label, onojAction: cancelHandler, children: (0, jsx_runtime_1.jsx)("span", { class: "button-label", children: t["wrc-common"].buttons.cancel.label }) })] })] })] }));
    };
    exports.default = SyncIntervalDialog;
});
//# sourceMappingURL=syncintervaldialog.js.map