define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "preact/hooks", "../resource", "ojL10n!wrc/shared/resources/nls/frontend", "wrc/resource", "../../integration/resource-context", "wrc/shared/url", "wrc/display/dialog", "ojs/ojlogger", "ojs/ojoption", "ojs/ojdialog", "oj-c/menu-button"], function (require, exports, jsx_runtime_1, ojvcomponent_1, hooks_1, resource_1, t, resource_2, resource_context_1, url_1, dialog_1, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.KebabMenu = void 0;
    let kebabId = 0;
    function KebabMenuImpl({ id, menuItems, selected }) {
        const ctx = (0, hooks_1.useContext)(resource_1.UserContext);
        const menuItemRenderer = (menuId, menuItem) => {
            const e = {
                menuItem,
                menuId
            };
            return ((0, jsx_runtime_1.jsx)("oj-option", { id: menuItem.id, value: e, children: menuItem.value }));
        };
        const dialogRef = (0, hooks_1.useRef)(null);
        const [createRDJForCreate, setRDJForCreate] = (0, hooks_1.useState)('');
        const handleMenuItemAction = (event) => {
            try {
                Logger.info(JSON.stringify(event.detail));
            }
            catch (_a) {
                Logger.info(String(event.detail));
            }
            if (event.detail.selectedValue.menuItem.id === 'create') {
                const path = event.detail.selectedValue.menuItem.path;
                const u = new URL(path, 'http://localhost');
                u.searchParams.set('view', 'createForm');
                const updatedUrl = `${u.pathname}${u.search}${u.hash}`;
                setRDJForCreate(updatedUrl);
                dialogRef.current.open();
            }
            else {
                selected === null || selected === void 0 ? void 0 : selected(event.detail.selectedValue);
            }
        };
        const attrs = {
            src: (0, url_1.requireAsset)("wrc/assets/images/more-vertical-brn-8x24.png"),
            style: { visibility: 'visible;' },
            title: t["wrc-common"].tooltips.more.value
        };
        const menuRef = (0, hooks_1.useRef)(null);
        const openMenu = (e) => {
            const anchor = e.currentTarget;
            menuRef === null || menuRef === void 0 ? void 0 : menuRef.current.open(e);
        };
        const resourceContext = new resource_context_1.ModalDialogResourceContext(dialogRef);
        const launcherId = `launcher_${kebabId++}`;
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("oj-menu", { ref: menuRef, onojMenuAction: handleMenuItemAction, openOptions: { launcher: launcherId }, children: menuItems === null || menuItems === void 0 ? void 0 : menuItems.map((menuItem) => menuItemRenderer(id, menuItem)) }), (0, jsx_runtime_1.jsx)("a", { id: launcherId, href: '#', onClick: openMenu, children: (0, jsx_runtime_1.jsx)("img", { class: 'more-vertical-icon', src: attrs.src, title: attrs.title }) }), (0, jsx_runtime_1.jsx)(dialog_1.Dialog, { cancelBehavior: 'icon', ref: dialogRef, children: (0, jsx_runtime_1.jsx)("div", { slot: "body", children: (0, jsx_runtime_1.jsx)(resource_2.Resource, { rdj: createRDJForCreate, unique: ctx === null || ctx === void 0 ? void 0 : ctx.unique, context: resourceContext }) }) })] }));
    }
    exports.KebabMenu = (0, ojvcomponent_1.registerCustomElement)("wrc-kebab-menu", KebabMenuImpl, "KebabMenu", { "properties": { "id": { "type": "string" }, "tooltip": { "type": "string" }, "menuItems": { "type": "Array<object>" }, "selected": { "type": "function" } } });
});
//# sourceMappingURL=kebab-menu.js.map