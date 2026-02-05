define(["require", "exports", "preact/jsx-runtime", "preact/hooks", "./resource", "./bookmarktoggler", "./pagesbookmarklauncher", "./historylauncher", "./shoppingcartmenu", "wrc/project-menu", "ojs/ojmenu", "ojs/ojoption", "oj-c/conveyor-belt"], function (require, exports, jsx_runtime_1, hooks_1, resource_1, bookmarktoggler_1, pagesbookmarklauncher_1, historylauncher_1, shoppingcartmenu_1, project_menu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Breadcrumbs;
    function Breadcrumbs({ model }) {
        const ctx = (0, hooks_1.useContext)(resource_1.UserContext);
        const [isInsecure, setIsInsecure] = (0, hooks_1.useState)(false);
        (0, hooks_1.useEffect)(() => {
            const databus = ctx === null || ctx === void 0 ? void 0 : ctx.databus;
            const signal = databus === null || databus === void 0 ? void 0 : databus.subscribe((e) => {
                var _a;
                setIsInsecure(((_a = e.providers.current) === null || _a === void 0 ? void 0 : _a.insecure) || false);
            });
            return () => signal === null || signal === void 0 ? void 0 : signal.detach();
        }, []);
        const { crumbs, links } = (0, hooks_1.useMemo)(() => {
            var _a, _b;
            const crumbs = ((_a = model === null || model === void 0 ? void 0 : model.getBreadcrumbs) === null || _a === void 0 ? void 0 : _a.call(model)) || [];
            const links = ((_b = model === null || model === void 0 ? void 0 : model.getLinks) === null || _b === void 0 ? void 0 : _b.call(model)) || [];
            return { crumbs, links };
        }, [model]);
        const navigateTo = (ref) => {
            var _a, _b, _c;
            const path = (ref === null || ref === void 0 ? void 0 : ref.resourceData) || (ref === null || ref === void 0 ? void 0 : ref.unresolvedReference) || "";
            if (path) {
                (_c = (_b = (_a = ctx === null || ctx === void 0 ? void 0 : ctx.context) === null || _a === void 0 ? void 0 : _a.routerController) === null || _b === void 0 ? void 0 : _b.navigateToAbsolutePath) === null || _c === void 0 ? void 0 : _c.call(_b, path);
            }
        };
        const onMenuAction = (e) => {
            var _a;
            const v = (_a = e === null || e === void 0 ? void 0 : e.detail) === null || _a === void 0 ? void 0 : _a.selectedValue;
            const index = Number(v);
            if (!Number.isNaN(index)) {
                navigateTo(links[index]);
            }
        };
        const clazz = links && links.length > 0 ? "breadcrumb-crosslink" : "breadcrumb-link";
        const pageTitle = crumbs.map(m => m.label).join('/');
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsxs)("div", { class: "wrc-breadcrumbs-row oj-flex oj-sm-flex-wrap-nowrap", children: [(0, jsx_runtime_1.jsx)(project_menu_1.ProjectMenu, {}), isInsecure && ((0, jsx_runtime_1.jsx)("span", { class: "oj-ux-ico-warning wrc-insecure-warning-icon" })), (0, jsx_runtime_1.jsx)("nav", { id: "breadcrumbs-container", class: "oj-flex-item oj-sm-flex-1", children: (0, jsx_runtime_1.jsx)("oj-c-conveyor-belt", { class: "oj-sm-11", arrowVisibility: "auto", children: (0, jsx_runtime_1.jsxs)("ul", { class: clazz, children: [crumbs.map((c, idx) => {
                                        const isLast = idx === crumbs.length - 1;
                                        return !isLast ? ((0, jsx_runtime_1.jsx)("li", { class: "oj-sm-margin-1x oj-flex-item", children: (0, jsx_runtime_1.jsx)("a", { href: "#", onClick: (e) => {
                                                    e.preventDefault();
                                                    navigateTo(c);
                                                }, children: c.label || c.resourceData }) }, (c.label || c.resourceData || String(idx)) + "_" + idx)) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}));
                                    }), links && links.length > 0 ? ((0, jsx_runtime_1.jsx)("li", { children: (0, jsx_runtime_1.jsxs)("oj-menu-button", { chroming: "borderless", children: [crumbs[crumbs.length - 1].label, (0, jsx_runtime_1.jsx)("oj-menu", { slot: "menu", onojMenuAction: onMenuAction, children: links.map((l, i) => ((0, jsx_runtime_1.jsx)("oj-option", { id: (l.resourceData ||
                                                            l.unresolvedReference ||
                                                            ""), value: String(i), children: l.label || l.resourceData || "" }))) })] }) })) : ((0, jsx_runtime_1.jsx)("li", { children: crumbs[crumbs.length - 1].label }))] }) }) }), (0, jsx_runtime_1.jsx)(bookmarktoggler_1.default, { id: "breadcrumbs-bookmark-toggler", pageTitle: pageTitle, model: model }), (0, jsx_runtime_1.jsx)(pagesbookmarklauncher_1.default, {}), (0, jsx_runtime_1.jsx)(shoppingcartmenu_1.default, {}), (0, jsx_runtime_1.jsx)(historylauncher_1.default, {})] }) }));
    }
});
//# sourceMappingURL=breadcrumbs.js.map