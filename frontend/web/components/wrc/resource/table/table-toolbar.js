define(["require", "exports", "preact/jsx-runtime", "ojL10n!wrc/shared/resources/nls/frontend", "preact/hooks", "wrc/multiselect", "wrc/shared/url", "wrc/shared/weighted-sort", "../shared/toolbar-render", "../action-redwood-map", "../resource", "../shared/toolbaricons", "ojs/ojlogger", "oj-c/button"], function (require, exports, jsx_runtime_1, t, hooks_1, multiselect_1, url_1, weighted_sort_1, toolbar_render_1, action_redwood_map_1, resource_1, toolbaricons_1, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BUTTONS = void 0;
    var BUTTONS;
    (function (BUTTONS) {
        BUTTONS["New"] = "new";
        BUTTONS["Write"] = "write";
        BUTTONS["Dashboard"] = "dashboard";
    })(BUTTONS || (exports.BUTTONS = BUTTONS = {}));
    const TableToolbar = ({ tableContent, setTableContent, showHelp, onHelpClick, pageContext, pageLoading = false, onPageRefresh }) => {
        var _a;
        const ctx = (0, hooks_1.useContext)(resource_1.UserContext);
        const buttons = {
            [BUTTONS.New]: {
                accesskey: undefined,
                isEnabled: () => true,
                action: (event) => {
                    var _a, _b;
                    const createForm = tableContent === null || tableContent === void 0 ? void 0 : tableContent.getCreateForm();
                    if (createForm) {
                        (_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.context) === null || _a === void 0 ? void 0 : _a.routerController) === null || _b === void 0 ? void 0 : _b.navigateToAbsolutePath(createForm.resourceData || "");
                    }
                },
                isVisible: () => !!(tableContent === null || tableContent === void 0 ? void 0 : tableContent.canCreate()),
                label: t["wrc-table-toolbar"].buttons.new.label,
                iconClass: action_redwood_map_1.ActionRedwoodMap[BUTTONS.New],
                iconFile: "new-icon-blk_24x24",
            },
            [BUTTONS.Write]: {
                accesskey: undefined,
                isEnabled: () => true,
                action: (event) => {
                    Logger.info("write");
                },
                isVisible: () => false,
                label: t["wrc-common"].buttons.write.label,
                iconClass: action_redwood_map_1.ActionRedwoodMap[BUTTONS.Write],
                iconFile: "write-wdt-model-blk_24x24",
            },
            [BUTTONS.Dashboard]: {
                accesskey: undefined,
                isEnabled: () => true,
                action: (event) => {
                    var _a, _b;
                    const form = tableContent === null || tableContent === void 0 ? void 0 : tableContent.getDashboardCreateForm();
                    if (form === null || form === void 0 ? void 0 : form.resourceData) {
                        (_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.context) === null || _a === void 0 ? void 0 : _a.routerController) === null || _b === void 0 ? void 0 : _b.navigateToAbsolutePath(form.resourceData);
                    }
                },
                isVisible: () => !!(tableContent === null || tableContent === void 0 ? void 0 : tableContent.canCreateDashboard()),
                label: ((_a = tableContent === null || tableContent === void 0 ? void 0 : tableContent.getDashboardCreateForm()) === null || _a === void 0 ? void 0 : _a.label) || "",
                iconClass: action_redwood_map_1.ActionRedwoodMap[BUTTONS.Dashboard],
                weight: 99,
            },
        };
        const columnToSelectOptionMapper = (column) => {
            return { key: column.name, label: column.label };
        };
        const columns = tableContent === null || tableContent === void 0 ? void 0 : tableContent.getColumnsCustomizedForDisplay();
        const modelDisplayColumns = [...((columns === null || columns === void 0 ? void 0 : columns.displayed) || [])].map(columnToSelectOptionMapper);
        const modelHiddenColumns = [...((columns === null || columns === void 0 ? void 0 : columns.hidden) || [])].map(columnToSelectOptionMapper);
        const [currentColumns, setCurrentColumns] = (0, hooks_1.useState)({
            available: modelHiddenColumns,
            display: modelDisplayColumns,
        });
        const [pendingColumns, setPendingColumns] = (0, hooks_1.useState)({
            available: modelHiddenColumns,
            display: modelDisplayColumns,
        });
        const [hasCustomizerChanges, setHasCustomizerChanges] = (0, hooks_1.useState)(false);
        (0, hooks_1.useEffect)(() => {
            var _a, _b;
            const newKeys = pendingColumns.display.map((c) => c.key);
            const existingKeys = (_b = (_a = tableContent === null || tableContent === void 0 ? void 0 : tableContent.getColumnsCustomizedForDisplay()) === null || _a === void 0 ? void 0 : _a.displayed) === null || _b === void 0 ? void 0 : _b.map(columnToSelectOptionMapper).map((c) => c.key);
            setHasCustomizerChanges(JSON.stringify(newKeys) !== JSON.stringify(existingKeys));
        }, [pendingColumns.display]);
        const [customizerDisplayState, setCustomizerDisplayState] = (0, hooks_1.useState)(false);
        const toggleCustomizeDisplayAction = () => {
            setCustomizerDisplayState(!customizerDisplayState);
        };
        const syncMultiSelectWithModel = () => {
            const columns = tableContent === null || tableContent === void 0 ? void 0 : tableContent.getColumnsCustomizedForDisplay();
            const modelDisplayColumns = JSON.parse(JSON.stringify([...((columns === null || columns === void 0 ? void 0 : columns.displayed) || [])].map(columnToSelectOptionMapper)));
            const modelHiddenColumns = JSON.parse(JSON.stringify([...((columns === null || columns === void 0 ? void 0 : columns.hidden) || [])].map(columnToSelectOptionMapper)));
            setCurrentColumns({
                available: modelHiddenColumns,
                display: modelDisplayColumns,
            });
            setPendingColumns({
                available: modelHiddenColumns,
                display: modelDisplayColumns,
            });
        };
        function refreshTable() {
            if (setTableContent && tableContent)
                setTableContent(tableContent.clone());
        }
        const customizeResetButtonAction = (event) => {
            tableContent === null || tableContent === void 0 ? void 0 : tableContent.resetColumnsForDisplay();
            syncMultiSelectWithModel();
            refreshTable();
        };
        const customizeCancelButtonAction = (event) => {
            syncMultiSelectWithModel();
        };
        const customizeApplyButtonAction = (event) => {
            const newDisplayColumns = [];
            const allColumns = [
                ...((tableContent === null || tableContent === void 0 ? void 0 : tableContent.getDisplayedColumns()) || []),
                ...((tableContent === null || tableContent === void 0 ? void 0 : tableContent.getHiddenColumns()) || []),
            ];
            pendingColumns.display.forEach((column) => {
                const columnElement = allColumns.find((c) => c.name === column.key);
                if (columnElement) {
                    newDisplayColumns.push(columnElement);
                }
            });
            tableContent === null || tableContent === void 0 ? void 0 : tableContent.selectColumnsForDisplay(newDisplayColumns);
            syncMultiSelectWithModel();
            refreshTable();
        };
        const columnChangeHandler = (event) => {
            setPendingColumns({ available: event.available, display: event.chosen });
        };
        const renderCustomizer = () => {
            if (customizerDisplayState) {
                return ((0, jsx_runtime_1.jsxs)("div", { class: "oj-flex oj-sm-align-items-center", style: { display: "inline-flex" }, children: [(0, jsx_runtime_1.jsx)(multiselect_1.default, { chosen: currentColumns.display, available: currentColumns.available, changeHandler: columnChangeHandler }), (0, jsx_runtime_1.jsxs)("div", { class: "oj-flex oj-sm-flex-direction-column oj-sm-align-self-center", children: [(0, jsx_runtime_1.jsx)("oj-c-button", { "data-testid": 'customizer-reset', "aria-label": t["wrc-common"].buttons.reset.label, label: t["wrc-common"].buttons.reset.label, class: "table-customizer-button", chroming: "outlined", onojAction: customizeResetButtonAction, disabled: !(tableContent === null || tableContent === void 0 ? void 0 : tableContent.hasColumnDisplayCustomizations()) }), (0, jsx_runtime_1.jsx)("oj-c-button", { "data-testid": 'customizer-apply', "aria-label": t["wrc-common"].buttons.apply.label, label: t["wrc-common"].buttons.apply.label, class: "table-customizer-button", chroming: "outlined", onojAction: customizeApplyButtonAction, disabled: !hasCustomizerChanges }), (0, jsx_runtime_1.jsx)("oj-c-button", { "data-testid": 'customizer-cancel', "aria-label": t["wrc-common"].buttons.cancel.label, label: t["wrc-common"].buttons.cancel.label, class: "table-customizer-button", chroming: "outlined", onojAction: customizeCancelButtonAction, disabled: !hasCustomizerChanges })] })] }));
            }
            else {
                return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
            }
        };
        const customizerImageSrc = (0, url_1.requireAsset)("wrc/assets/images/table-customizer-icon-blk_24x24.png");
        const customizerLabel = t["wrc-table-toolbar"].buttons.customize.label;
        const expanderIconClassList = customizerDisplayState
            ? "oj-fwk-icon oj-fwk-icon-caret03-n"
            : "oj-fwk-icon oj-fwk-icon-caret03-s";
        const syncAction = () => {
            if (pageLoading)
                return;
            if (tableContent.isPolling()) {
                tableContent.stopPolling();
                onPageRefresh === null || onPageRefresh === void 0 ? void 0 : onPageRefresh();
            }
            else {
                tableContent.refresh().then(() => {
                    onPageRefresh === null || onPageRefresh === void 0 ? void 0 : onPageRefresh();
                });
            }
        };
        const isMainWindow = pageContext === 'main';
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { id: "table-toolbar-container", class: "oj-flex", style: "max-width: 75rem;", children: [(0, jsx_runtime_1.jsx)("div", { id: "table-toolbar-buttons", class: "oj-flex-bar", children: (0, jsx_runtime_1.jsx)("div", { class: "oj-flex-bar-start", children: !showHelp ? ((0, jsx_runtime_1.jsxs)(weighted_sort_1.WeightedSort, { children: [(0, toolbar_render_1.buildToolbarButtons)(buttons), isMainWindow ? ((0, jsx_runtime_1.jsx)("div", { "data-weight": "0", class: "cfe-table-customizer", children: (0, jsx_runtime_1.jsxs)("a", { accesskey: ".", class: "table-customizer-expander", "data-state": "collapsed", href: "#", onClick: toggleCustomizeDisplayAction, children: [(0, jsx_runtime_1.jsx)("img", { class: "button-icon", src: customizerImageSrc, alt: customizerLabel }), (0, jsx_runtime_1.jsx)("span", { "aria-hidden": "true", class: "button-label", children: customizerLabel }), (0, jsx_runtime_1.jsx)("span", { class: expanderIconClassList })] }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})) }) }), (0, jsx_runtime_1.jsx)("div", { id: "table-toolbar-icons", class: "oj-flex-item", children: isMainWindow ? ((0, jsx_runtime_1.jsx)(toolbaricons_1.default, { showHelp: showHelp, onHelpClick: onHelpClick, syncEnabled: true, onSyncClick: syncAction, actionPolling: tableContent.isPolling() || pageLoading, pageContext: pageContext })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})) })] }), renderCustomizer()] }));
    };
    exports.default = TableToolbar;
});
//# sourceMappingURL=table-toolbar.js.map