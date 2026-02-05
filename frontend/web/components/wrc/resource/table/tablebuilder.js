define(["require", "exports", "preact/jsx-runtime", "ojs/ojarraydataprovider", "ojL10n!wrc/shared/resources/nls/frontend", "ojs/ojkeyset", "ojs/ojtranslation", "../../shared/controller/builder", "../../shared/model/tablecontentmodel", "preact/hooks", "../shared/help", "./tableintro", "../resource", "../breadcrumbs", "./table-toolbar", "../actions", "wrc/shared/controller/notification-utils", "wrc/shared/refresh", "wrc/shared/messages", "ojs/ojtable", "ojs/ojmenu", "ojs/ojnavigationlist", "ojs/ojselector"], function (require, exports, jsx_runtime_1, ArrayDataProvider, t, ojkeyset_1, Translations, builder_1, tablecontentmodel_1, hooks_1, help_1, tableintro_1, resource_1, breadcrumbs_1, table_toolbar_1, actions_1, notification_utils_1, refresh_1, messages_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TableBuilder = void 0;
    class TableBuilder extends builder_1.Builder {
        getHTML() {
            return (0, jsx_runtime_1.jsx)(Table, { tableContent: this.tableContent, pageContext: this.pageContext, bare: this.bare, onSelectionChanged: this.onSelectionChanged });
        }
        constructor(tableContent, pageContext, bare, onSelectionChanged) {
            super();
            this.type = "table";
            this.tableContent = tableContent;
            this.pageContext = pageContext;
            this.bare = bare;
            this.onSelectionChanged = onSelectionChanged;
        }
        getPageTitle() {
            var _a, _b;
            return (_b = (_a = this.tableContent) === null || _a === void 0 ? void 0 : _a.getPageTitle) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
    }
    exports.TableBuilder = TableBuilder;
    const Table = ({ tableContent, pageContext, bare, onSelectionChanged }) => {
        var _a, _b;
        let displayColumns;
        const actions = tableContent === null || tableContent === void 0 ? void 0 : tableContent.getActions();
        const [_1, setRefresh] = (0, hooks_1.useState)(false);
        const [_2, setModel] = (0, hooks_1.useState)(tableContent);
        const [showHelp, setShowHelp] = (0, hooks_1.useState)(false);
        const [enabledActions, setEnabledActions] = (0, hooks_1.useState)([]);
        const [selectedItems, setSelectedItems] = (0, hooks_1.useState)({
            row: new ojkeyset_1.KeySetImpl(),
            column: new ojkeyset_1.KeySetImpl(),
        });
        const [drawerOpen, setDrawerOpen] = (0, hooks_1.useState)(false);
        const [drawerWidth, setDrawerWidth] = (0, hooks_1.useState)(0);
        const serverSorted = !!((_a = tableContent === null || tableContent === void 0 ? void 0 : tableContent.isServerSorted) === null || _a === void 0 ? void 0 : _a.call(tableContent));
        (0, hooks_1.useEffect)(() => { return () => tableContent === null || tableContent === void 0 ? void 0 : tableContent.stopPolling(); }, []);
        (0, hooks_1.useEffect)(() => {
            const unsubscribe = (0, refresh_1.subscribeToRefresh)((detail) => {
                var _a;
                if ((_a = detail === null || detail === void 0 ? void 0 : detail.scope) === null || _a === void 0 ? void 0 : _a.content) {
                    try {
                        if (tableContent) {
                            Promise
                                .resolve(tableContent.refresh())
                                .finally(() => {
                                setRefresh((prev) => !prev);
                                updateActionsDisabled();
                            });
                        }
                        else {
                            setRefresh((prev) => !prev);
                            updateActionsDisabled();
                        }
                    }
                    catch (_e) {
                        setRefresh((prev) => !prev);
                        updateActionsDisabled();
                    }
                }
            });
            return unsubscribe;
        }, [tableContent]);
        let rowDataProvider;
        const selectedChangedListener = (event) => {
            const row = event.detail.value.row;
            const column = event.detail.value.column;
            if (row.isAddAll()) {
                selectedItems.row = new ojkeyset_1.KeySetImpl(allAvailableKeys);
            }
            else {
                selectedItems.row = row;
            }
            selectedItems.column = column;
            setSelectedItems(selectedItems);
            onSelectionChanged === null || onSelectionChanged === void 0 ? void 0 : onSelectionChanged(selectedItems.row);
            updateActionsDisabled();
        };
        const getSelectionCount = (keys) => { var _a; return Array.from(((_a = keys === null || keys === void 0 ? void 0 : keys.values) === null || _a === void 0 ? void 0 : _a.call(keys)) || []).length; };
        const updateActionsDisabled = () => {
            const newEnabledActions = [];
            const updateActionDisabled = (action) => {
                const count = getSelectionCount(selectedItems.row);
                let isEnabled;
                switch (action.rows) {
                    case "multiple":
                        isEnabled = count > 0;
                        break;
                    case "one":
                        isEnabled = count === 1;
                        break;
                    case "none":
                    default:
                        isEnabled = true;
                }
                if (isEnabled)
                    newEnabledActions.push(action.name);
                return isEnabled;
            };
            actions === null || actions === void 0 ? void 0 : actions.forEach((action) => {
                if (action.actions) {
                    let isMenuButtonEnabled = true;
                    action.actions.forEach((subaction) => {
                        isMenuButtonEnabled =
                            updateActionDisabled(subaction) && isMenuButtonEnabled;
                    });
                    if (isMenuButtonEnabled)
                        newEnabledActions.push(action.name);
                }
                else {
                    updateActionDisabled(action);
                }
            });
            setEnabledActions(newEnabledActions);
        };
        (0, hooks_1.useEffect)(() => { updateActionsDisabled(); }, []);
        (0, hooks_1.useEffect)(() => {
            const checkDrawerState = () => {
                const drawer = document.getElementById('drawer-layout');
                if (drawer) {
                    const isOpen = !!drawer.startOpened;
                    setDrawerOpen(isOpen);
                    if (isOpen) {
                        const width = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--wrc-start-width')) || 0;
                        setDrawerWidth(width);
                        document.documentElement.style.setProperty('--table-container-width', `calc(100vw - ${width}px)`);
                    }
                    else {
                        document.documentElement.style.setProperty('--table-container-width', '100vw');
                    }
                }
            };
            checkDrawerState();
            const interval = setInterval(checkDrawerState, 100);
            return () => clearInterval(interval);
        }, []);
        const setupData = () => {
            setupColumns();
            setupRowDataProvider();
        };
        const cleanupSelected = (rowArray) => {
            var _a;
            let changedSelectedItems = false;
            [...(_a = selectedItems === null || selectedItems === void 0 ? void 0 : selectedItems.row) === null || _a === void 0 ? void 0 : _a.values()].forEach((row) => {
                const ix = rowArray.findIndex(r => r['_rowSelector'] === row);
                if (ix === -1) {
                    selectedItems.row = selectedItems.row.delete([row]);
                    changedSelectedItems = true;
                }
            });
            if (changedSelectedItems) {
                setSelectedItems(Object.assign({}, selectedItems));
                updateActionsDisabled();
            }
        };
        let allAvailableKeys;
        const setupRowDataProvider = () => {
            const rowArray = [];
            const rows = tableContent === null || tableContent === void 0 ? void 0 : tableContent.getRows();
            const preSelectedRows = tableContent === null || tableContent === void 0 ? void 0 : tableContent.getPreSelectedRows();
            const preSelectedRowKeys = [];
            rows === null || rows === void 0 ? void 0 : rows.forEach((row) => {
                var _a, _b, _c, _d;
                const cell = {};
                displayColumns === null || displayColumns === void 0 ? void 0 : displayColumns.forEach((column) => {
                    var _a;
                    const columnId = column["id"];
                    if (columnId) {
                        if (!row[columnId]) {
                            cell[columnId] = "";
                        }
                        else if (!Array.isArray(row[columnId].value)) {
                            if (typeof row[columnId].value != "object") {
                                const rawVal = row[columnId].value;
                                cell[columnId] = typeof rawVal === "boolean" ? String(rawVal) : rawVal;
                            }
                            else {
                                cell[columnId] = ((_a = row[columnId].value) === null || _a === void 0 ? void 0 : _a.label) || "";
                            }
                        }
                        else {
                            cell[columnId] = row[columnId].value.map((v) => v.value.label).join(", ");
                        }
                    }
                });
                cell["identity"] = JSON.stringify((_a = row["identity"]) === null || _a === void 0 ? void 0 : _a.value);
                cell["identifier"] = typeof ((_b = row["identifier"]) === null || _b === void 0 ? void 0 : _b.value) !== 'string' ? JSON.stringify((_c = row["identifier"]) === null || _c === void 0 ? void 0 : _c.value) : (_d = row["identifier"]) === null || _d === void 0 ? void 0 : _d.value;
                const rowSelectionProperty = tableContent === null || tableContent === void 0 ? void 0 : tableContent.getRowSelectionProperty();
                if (!rowSelectionProperty || rowSelectionProperty === 'none') {
                    cell["_rowSelector"] = cell["identity"];
                }
                else {
                    cell["_rowSelector"] = cell[rowSelectionProperty];
                }
                rowArray.push(cell);
                if (preSelectedRowKeys && preSelectedRowKeys.length > 0) {
                    const rowSelector = cell["_rowSelector"];
                    const resourceToMatch = JSON.parse(rowSelector);
                    if ((preSelectedRows === null || preSelectedRows === void 0 ? void 0 : preSelectedRows.find((r) => r === resourceToMatch.resourceData)) ||
                        (preSelectedRows === null || preSelectedRows === void 0 ? void 0 : preSelectedRows.find((r) => r === resourceToMatch))) {
                        preSelectedRowKeys.push(rowSelector);
                    }
                }
            });
            if (preSelectedRowKeys.length > 0) {
                setSelectedItems({ row: new ojkeyset_1.KeySetImpl(preSelectedRowKeys), column: new ojkeyset_1.KeySetImpl() });
            }
            const comparators = new Map(displayColumns === null || displayColumns === void 0 ? void 0 : displayColumns.map(i => [i.id, tablecontentmodel_1.cellCompare]));
            cleanupSelected(rowArray);
            allAvailableKeys = rowArray.map(r => r['_rowSelector']);
            const providerOptions = { keyAttributes: "_rowSelector" };
            if (!serverSorted) {
                providerOptions.sortComparators = { comparators };
                providerOptions.implicitSort = [
                    {
                        attribute: (tableContent === null || tableContent === void 0 ? void 0 : tableContent.sortProperty) || "",
                        direction: (tableContent === null || tableContent === void 0 ? void 0 : tableContent.sortOrder) || tablecontentmodel_1.SORT_ORDER.ASCENDING,
                    },
                ];
            }
            rowDataProvider = new ArrayDataProvider(rowArray, providerOptions);
        };
        const setupColumns = () => {
            const rawColumns = tableContent === null || tableContent === void 0 ? void 0 : tableContent.getColumnsCustomizedForDisplay().displayed;
            displayColumns = rawColumns === null || rawColumns === void 0 ? void 0 : rawColumns.map((column) => {
                return {
                    id: column.name || null,
                    field: column.name || null,
                    headerText: column.label,
                };
            });
            return displayColumns;
        };
        const beginPolling = (polling) => {
            tableContent === null || tableContent === void 0 ? void 0 : tableContent.startPolling(polling, () => setRefresh(prev => !prev));
            setRefresh(prev => !prev);
        };
        const actionHandler = (action) => {
            const references = [...selectedItems.row.values()].map((r) => {
                try {
                    return JSON.parse(r);
                }
                catch (error) {
                    return r;
                }
            });
            tableContent === null || tableContent === void 0 ? void 0 : tableContent.invokeAction(action, references).then((response) => response.json()).then((messageResponse) => {
                var _a, _b, _c, _d, _f;
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
                if (messageResponse.resourceData) {
                    (_f = (_d = ctx === null || ctx === void 0 ? void 0 : ctx.context) === null || _d === void 0 ? void 0 : _d.routerController) === null || _f === void 0 ? void 0 : _f.navigateToAbsolutePath(messageResponse.resourceData.resourceData || '');
                }
            });
        };
        const ctx = (0, hooks_1.useContext)(resource_1.UserContext);
        setupData();
        const totalRowString = Translations.applyParameters(t["wrc-table"].labels.totalRows.value, [((_b = tableContent === null || tableContent === void 0 ? void 0 : tableContent.getRows()) === null || _b === void 0 ? void 0 : _b.length) || 0]);
        const isMainWindow = pageContext === 'main';
        const isBare = !!bare;
        const hasSelectionActions = (() => {
            const requires = (act) => {
                if (act.actions && act.actions.length)
                    return act.actions.some(requires);
                return act.rows === 'one' || act.rows === 'multiple';
            };
            return (actions === null || actions === void 0 ? void 0 : actions.some(requires)) || false;
        })();
        const cellClickHandler = (event) => {
            var _a, _b, _c, _d, _f;
            const key = (_b = (_a = event === null || event === void 0 ? void 0 : event.currentTarget) === null || _a === void 0 ? void 0 : _a.currentRow) === null || _b === void 0 ? void 0 : _b.rowKey;
            if (key) {
                const target = event === null || event === void 0 ? void 0 : event.target;
                let cellIndex = (_c = target.offsetParent) === null || _c === void 0 ? void 0 : _c.cellIndex;
                if (!cellIndex) {
                    cellIndex = target.cellIndex;
                }
                if (cellIndex || !hasSelectionActions) {
                    event.stopImmediatePropagation();
                    const reference = JSON.parse(key);
                    (_f = (_d = ctx === null || ctx === void 0 ? void 0 : ctx.context) === null || _d === void 0 ? void 0 : _d.routerController) === null || _f === void 0 ? void 0 : _f.navigateToAbsolutePath(reference.resourceData || '');
                }
            }
        };
        const cellRenderer = (cell) => {
            return ((0, jsx_runtime_1.jsx)("span", { children: cell.data }));
        };
        const selectorCellRenderer = (cell) => {
            var _a, _b, _c;
            const key = (_b = ((_a = cell === null || cell === void 0 ? void 0 : cell.row) === null || _a === void 0 ? void 0 : _a._rowSelector)) !== null && _b !== void 0 ? _b : ((_c = cell === null || cell === void 0 ? void 0 : cell.data) === null || _c === void 0 ? void 0 : _c._rowSelector);
            const onSelectorKeysChanged = (e) => {
                var _a;
                const newKeys = (_a = e === null || e === void 0 ? void 0 : e.detail) === null || _a === void 0 ? void 0 : _a.value;
                if (newKeys) {
                    setSelectedItems(Object.assign(Object.assign({}, selectedItems), { row: newKeys }));
                    onSelectionChanged === null || onSelectionChanged === void 0 ? void 0 : onSelectionChanged(newKeys);
                    updateActionsDisabled();
                }
            };
            return ((0, jsx_runtime_1.jsx)("oj-selector", { "selection-mode": "multiple", "row-key": key, selectedKeys: selectedItems.row, onselectedKeysChanged: onSelectorKeysChanged, "data-oj-clickthrough": "disabled", "aria-label": "checkbox" }));
        };
        return ((0, jsx_runtime_1.jsxs)("div", { id: "table-container", class: "oj-flex-item cfe-table-content", children: [(isMainWindow && !isBare) ? (0, jsx_runtime_1.jsx)(breadcrumbs_1.default, { model: tableContent }) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}), !isBare ? ((0, jsx_runtime_1.jsx)(table_toolbar_1.default, { tableContent: tableContent, setTableContent: setModel, showHelp: showHelp, onHelpClick: () => setShowHelp(!showHelp), pageContext: pageContext, onPageRefresh: () => setRefresh(prev => !prev) })) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}), (!showHelp && !isBare) ? (0, jsx_runtime_1.jsx)(tableintro_1.TableIntro, { tableContent: tableContent }) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}), showHelp ? ((0, jsx_runtime_1.jsx)(help_1.Help, { model: tableContent })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [!isBare ? ((0, jsx_runtime_1.jsx)("div", { id: "table-actions-strip-container", class: "cfe-actions-strip-container", children: (0, jsx_runtime_1.jsx)(actions_1.Actions, { model: tableContent, onActionSelected: actionHandler, onActionPolling: beginPolling, enabledActions: enabledActions, selectedKeys: selectedItems.row }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), (0, jsx_runtime_1.jsx)("div", { className: "cfe-table-container-scrollable", children: (0, jsx_runtime_1.jsxs)("oj-table", { id: "table", "aria-labelledby": "intro", class: "wlstable", display: "grid", "scroll-policy": "loadMoreOnScroll", "scroll-policy-options": '{"fetchSize": 10000}', selected: selectedItems, selectionMode: { row: hasSelectionActions ? "multiple" : "single", column: "none", }, onselectedChanged: selectedChangedListener, columns: displayColumns, data: rowDataProvider, onClick: cellClickHandler, columnsDefault: serverSorted ? { sortable: 'disabled' } : {}, children: [hasSelectionActions ? (0, jsx_runtime_1.jsx)("template", { slot: "selectorCellTemplate", render: selectorCellRenderer }) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}), (0, jsx_runtime_1.jsx)("template", { slot: "cellTemplate", render: cellRenderer })] }) }), (isMainWindow && !isBare) ? ((0, jsx_runtime_1.jsx)("div", { id: "totalRows", children: (0, jsx_runtime_1.jsx)("span", { children: totalRowString }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}))] }))] }));
    };
});
//# sourceMappingURL=tablebuilder.js.map