define(["require", "exports", "preact/jsx-runtime", "ojL10n!wrc/shared/resources/nls/frontend", "preact/hooks", "./syncintervaldialog", "./navigationtoolbar", "oj-c/button"], function (require, exports, jsx_runtime_1, t, hooks_1, syncintervaldialog_1, navigationtoolbar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ToolbarIcons = ({ showHelp, onHelpClick, syncEnabled, onSyncClick, actionPolling = false, pageContext }) => {
        const [syncInterval, setSyncInterval] = (0, hooks_1.useState)(0);
        const [autoSyncEnabled, setAutoSyncEnabled] = (0, hooks_1.useState)(false);
        const timerId = (0, hooks_1.useRef)(null);
        (0, hooks_1.useEffect)(() => {
            if (!syncEnabled || actionPolling)
                setAutoSyncEnabled(false);
            else if (isSyncTimerEnabled())
                startSyncTimer();
            return () => cancelSyncTimer();
        }, [syncInterval, autoSyncEnabled, syncEnabled, actionPolling]);
        const isSyncTimerEnabled = () => (autoSyncEnabled && syncEnabled);
        const isTimerIndicatorEnabled = () => (isSyncTimerEnabled() || actionPolling);
        const isSyncIntervalEnabled = () => (syncEnabled && !actionPolling);
        const syncTooltip = isTimerIndicatorEnabled()
            ? t["wrc-form-toolbar"].icons.sync.tooltipOn
            : t["wrc-form-toolbar"].icons.sync.tooltip;
        const helpTooltip = t["wrc-form-toolbar"].icons.help.tooltip;
        const startSyncTimer = () => {
            cancelSyncTimer();
            if (syncInterval > 0) {
                onSyncClick();
                timerId.current = window.setInterval(onSyncClick, syncInterval * 1000);
            }
        };
        const cancelSyncTimer = () => {
            if (timerId.current) {
                window.clearInterval(timerId.current);
                timerId.current = null;
            }
        };
        const onSyncIntervalSet = (newSyncInterval) => {
            setSyncInterval(newSyncInterval);
            setAutoSyncEnabled(newSyncInterval > 0);
        };
        const handleSyncAction = (event) => {
            if (event === null || event === void 0 ? void 0 : event.preventDefault)
                event.preventDefault();
            if ((syncInterval > 0) && !actionPolling) {
                setAutoSyncEnabled(!autoSyncEnabled);
                return;
            }
            onSyncClick();
        };
        return ((0, jsx_runtime_1.jsxs)("div", { class: "oj-flex oj-sm-flex-items-initial oj-sm-justify-content-flex-end", children: [(0, jsx_runtime_1.jsx)("div", { id: "navigation-toolbar-icon", class: "oj-flex-item", children: (0, jsx_runtime_1.jsx)(navigationtoolbar_1.default, { pageContext: pageContext }) }), (0, jsx_runtime_1.jsx)("div", { id: "toolbar-separator-vertical", class: "oj-flex-item", children: (0, jsx_runtime_1.jsx)("span", { role: "separator", "aria-orientation": "vertical", class: "oj-toolbar-separator wrc-vertical-bar" }) }), (0, jsx_runtime_1.jsx)("div", { id: "page-help-toolbar-icon", class: "oj-flex-item", children: (0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "borderless", onojAction: onHelpClick, tooltip: helpTooltip, "aria-label": helpTooltip, "data-testid": "help", children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: `${showHelp ? 'oj-ux-ico-help-circle-s' : 'oj-ux-ico-help'}` }) }) }), (0, jsx_runtime_1.jsx)("div", { id: "toolbar-separator-vertical", class: "oj-flex-item", children: (0, jsx_runtime_1.jsx)("span", { role: "separator", "aria-orientation": "vertical", class: "oj-toolbar-separator wrc-vertical-bar" }) }), (0, jsx_runtime_1.jsx)("div", { id: "sync-toolbar-icon", class: `oj-flex-item ${isTimerIndicatorEnabled() ? 'wrc-sync-bounce' : ''}`, children: (0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "borderless", onojAction: handleSyncAction, disabled: !syncEnabled, tooltip: syncTooltip, "aria-label": syncTooltip, "data-testid": "sync", children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-refresh" }) }) }), (0, jsx_runtime_1.jsx)(syncintervaldialog_1.default, { syncEnabled: isSyncIntervalEnabled(), onSyncIntervalSet: onSyncIntervalSet })] }));
    };
    exports.default = ToolbarIcons;
});
//# sourceMappingURL=toolbaricons.js.map