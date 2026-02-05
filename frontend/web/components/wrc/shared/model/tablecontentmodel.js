var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "./model-utils", "./transport", "./common"], function (require, exports, model_utils_1, transport_1, common_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TableContentModel = exports.SORT_ORDER = void 0;
    exports.cellCompare = cellCompare;
    const DELETE_ACTION = {
        name: "__DELETE",
        label: "Delete",
        rows: "multiple",
        polling: {
            reloadSeconds: 1,
            maxAttempts: 1,
        },
    };
    var SORT_ORDER;
    (function (SORT_ORDER) {
        SORT_ORDER["ASCENDING"] = "ascending";
        SORT_ORDER["DESCENDING"] = "descending";
    })(SORT_ORDER || (exports.SORT_ORDER = SORT_ORDER = {}));
    ;
    class TableContentModel extends common_1.Model {
        constructor() {
            var _a;
            super(...arguments);
            this.sortOrder = SORT_ORDER.ASCENDING;
            this.sortProperty = (_a = this.pdj.table) === null || _a === void 0 ? void 0 : _a.defaultSortProperty;
            this.showAdvanced = false;
        }
        canCreate() {
            return this.getCreateForm() !== undefined;
        }
        getCreateForm() {
            return this.rdj.createForm;
        }
        canCreateDashboard() {
            return this.getDashboardCreateForm() !== undefined;
        }
        getDashboardCreateForm() {
            return this.rdj.dashboardCreateForm;
        }
        isServerSorted() {
            var _a;
            return !!((_a = this.pdj.table) === null || _a === void 0 ? void 0 : _a.ordered);
        }
        getRows() {
            let rows = TableContentModel._clone(this.rdj.data);
            if (this.sortProperty && !this.isServerSorted()) {
                rows.sort((a, b) => {
                    return cellCompare(a[this.sortProperty].value || a[this.sortProperty].modelToken || "", b[this.sortProperty].value || a[this.sortProperty].modelToken || "");
                });
            }
            return rows;
        }
        getDisplayedColumns() {
            var _a, _b;
            const columns = ((_a = this.pdj.table) === null || _a === void 0 ? void 0 : _a.displayedColumns) || ((_b = this.pdj.sliceTable) === null || _b === void 0 ? void 0 : _b.displayedColumns);
            return columns;
        }
        getHiddenColumns() {
            var _a;
            return (_a = this.pdj.table) === null || _a === void 0 ? void 0 : _a.hiddenColumns;
        }
        selectColumnsForDisplay(columns) {
            this.selectedColumnsForDisplay = columns;
        }
        resetColumnsForDisplay() {
            delete this.selectedColumnsForDisplay;
        }
        hasColumnDisplayCustomizations() {
            return this.selectedColumnsForDisplay !== undefined;
        }
        getColumnsCustomizedForDisplay() {
            if (this.selectedColumnsForDisplay) {
                const allColumns = [
                    ...(this.getDisplayedColumns() || []),
                    ...(this.getHiddenColumns() || []),
                ];
                const displayed = allColumns.filter((c) => { var _a; return (_a = this.selectedColumnsForDisplay) === null || _a === void 0 ? void 0 : _a.find((s) => s.name === c.name); });
                const hidden = allColumns.filter((c) => { var _a; return !((_a = this.selectedColumnsForDisplay) === null || _a === void 0 ? void 0 : _a.find((s) => s.name === c.name)); });
                return { displayed, hidden };
            }
            else {
                return {
                    displayed: this.getDisplayedColumns(),
                    hidden: this.getHiddenColumns(),
                };
            }
        }
        getSlices() {
            var _a;
            return (_a = this.pdj.sliceTable) === null || _a === void 0 ? void 0 : _a.slices;
        }
        static _clone(object) {
            return object ? JSON.parse(JSON.stringify(object)) : object;
        }
        getActions() {
            var _a, _b;
            let actions = [];
            if (this.rdj.deletable) {
                actions.push(DELETE_ACTION);
            }
            const definedActions = ((_a = this.pdj.table) === null || _a === void 0 ? void 0 : _a.actions) || ((_b = this.pdj.sliceTable) === null || _b === void 0 ? void 0 : _b.actions);
            if (definedActions) {
                actions.push(...definedActions);
            }
            return actions;
        }
        getHelpTopics() {
            return this.pdj.helpTopics;
        }
        getDetailedHelp() {
            const everyColumn = [
                ...(this.getDisplayedColumns() || []),
                ...(this.getHiddenColumns() || []),
            ];
            return (0, model_utils_1.extractHelpData)(everyColumn);
        }
        getIntroductionHTML() {
            return this.rdj.introductionHTML || this.pdj.introductionHTML;
        }
        getRowSelectionProperty() {
            var _a, _b;
            return (((_a = this.pdj.table) === null || _a === void 0 ? void 0 : _a.rowSelectionProperty) ||
                ((_b = this.pdj.sliceTable) === null || _b === void 0 ? void 0 : _b.rowSelectionProperty));
        }
        getPreSelectedRows() {
            return this.rdj.selected;
        }
        refresh() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.rdjUrl) {
                    let reloadRdjUrl = new URL(this.rdjUrl, window.origin);
                    reloadRdjUrl.searchParams.set("reload", "true");
                    return (0, transport_1.getData)(reloadRdjUrl.pathname + reloadRdjUrl.search + reloadRdjUrl.hash, undefined).then(([rdj, pdj]) => {
                        this.rdj = rdj;
                        if (pdj) {
                            this.pdj = pdj;
                        }
                    });
                }
            });
        }
        clone() {
            const clonedModel = Object.create(Object.getPrototypeOf(this));
            Object.assign(clonedModel, this);
            return clonedModel;
        }
    }
    exports.TableContentModel = TableContentModel;
    function cellCompare(value1, value2) {
        var _a;
        let result = 0;
        if (typeof value1 === typeof value1 && value1 !== null && value2 !== null) {
            if (typeof value1 === 'string') {
                result = value1.localeCompare(value2);
            }
            else if (typeof value1 === 'boolean') {
                result = (value1 === value2) ? 0 : value1 ? -1 : 1;
            }
            else if (typeof value1 === 'number') {
                result = value1 - value2;
            }
            else if (typeof value1 === 'object' && typeof value2 === 'object') {
                if ('label' in value1 && 'label' in value2) {
                    result = ((_a = value1['label']) === null || _a === void 0 ? void 0 : _a.localeCompare(value2['label'] || '')) || 0;
                }
            }
        }
        return result;
    }
});
//# sourceMappingURL=tablecontentmodel.js.map