define(["require", "exports", "preact/jsx-runtime", "preact/hooks", "../../shared/controller/builder", "../resource", "wrc/nav-tree/nav-tree", "../breadcrumbs", "../shared/navigationtoolbar", "oj-c/card-view", "oj-c/action-card", "ojs/ojdefer"], function (require, exports, jsx_runtime_1, hooks_1, builder_1, resource_1, nav_tree_1, breadcrumbs_1, navigationtoolbar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ListBuilder = void 0;
    class ListBuilder extends builder_1.Builder {
        constructor(listContent, pageContext) {
            super();
            this.type = "list";
            this.listContent = listContent;
            this.pageContext = pageContext;
        }
        getPageTitle() {
            var _a, _b;
            return (_b = (_a = this.listContent) === null || _a === void 0 ? void 0 : _a.getPageTitle) === null || _b === void 0 ? void 0 : _b.call(_a);
        }
        getHTML() {
            return (0, jsx_runtime_1.jsx)(List, { listContent: this.listContent, pageContext: this.pageContext });
        }
    }
    exports.ListBuilder = ListBuilder;
    const LIST_ICONS = {
        'edit-tree': nav_tree_1.ICONS.edit,
        'serverConfig-tree': nav_tree_1.ICONS.serverConfig,
        'domainRuntime-tree': nav_tree_1.ICONS.domainRuntime,
        'securityData-tree': nav_tree_1.ICONS.securityData,
        COLLECTION: 'oj-ux-ico-collection-alt',
        GROUP: 'oj-ux-ico-bag',
        SINGLETON: 'oj-ux-ico-content-item',
        ROOT: 'oj-ux-ico-domain'
    };
    const List = ({ listContent, pageContext }) => {
        const ctx = (0, hooks_1.useContext)(resource_1.UserContext);
        const items = (listContent === null || listContent === void 0 ? void 0 : listContent.getItems()) || [];
        const navigate = (ref) => {
            var _a, _b;
            if (ref === null || ref === void 0 ? void 0 : ref.resourceData) {
                (_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.context) === null || _a === void 0 ? void 0 : _a.routerController) === null || _b === void 0 ? void 0 : _b.navigateToAbsolutePath(ref.resourceData);
            }
        };
        return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(breadcrumbs_1.default, { model: listContent }), (0, jsx_runtime_1.jsx)(navigationtoolbar_1.default, { pageContext: pageContext }), (0, jsx_runtime_1.jsx)("div", { class: "cfe-list-content", style: {
                        margin: "15px",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                        gap: "1rem"
                    }, children: items.map((datum) => ((0, jsx_runtime_1.jsx)("oj-c-action-card", { class: "cfe-list-card oj-bg-neutral-30", style: { height: "100%", width: "100%" }, onojAction: () => navigate(datum === null || datum === void 0 ? void 0 : datum.resourceData), "aria-label": datum === null || datum === void 0 ? void 0 : datum.name, children: (0, jsx_runtime_1.jsxs)("div", { class: "cfe-list-card-inner", style: { width: '100vw', display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }, children: [(0, jsx_runtime_1.jsx)("span", { class: (LIST_ICONS[(datum === null || datum === void 0 ? void 0 : datum.type) || ''] || 'oj-ux-ico-file-unknown') + ' cfe-list-card-icon' }), (0, jsx_runtime_1.jsx)("div", { class: "cfe-list-card-title", children: datum === null || datum === void 0 ? void 0 : datum.resourceData.label }), (0, jsx_runtime_1.jsx)("div", { class: "cfe-list-card-description", children: datum === null || datum === void 0 ? void 0 : datum.description })] }) }))) })] }));
    };
});
//# sourceMappingURL=listbuilder.js.map