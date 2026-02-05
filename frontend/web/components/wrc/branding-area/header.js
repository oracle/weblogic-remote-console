var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "preact/jsx-runtime", "ojs/ojvcomponent", "ojL10n!wrc/shared/resources/nls/frontend", "./simple-search", "./tips", "wrc/shared/model/transport", "preact/hooks", "wrc/shared/url", "./message-line", "ojs/ojlogger", "ojs/ojinputsearch", "oj-c/button"], function (require, exports, jsx_runtime_1, ojvcomponent_1, t, simple_search_1, tips_1, transport_1, hooks_1, url_1, message_line_1, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BrandingHeader = exports.BrandingArea = exports.openExternalUrl = void 0;
    exports.BrandingHeaderImpl = BrandingHeaderImpl;
    function BrandingHeaderImpl({ context }) {
        var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
        const ariaLabel = (_c = (_b = (_a = t["wrc-header"]) === null || _a === void 0 ? void 0 : _a.region) === null || _b === void 0 ? void 0 : _b.ariaLabel) === null || _c === void 0 ? void 0 : _c.value;
        const appName = (_f = (_d = t["wrc-header"]) === null || _d === void 0 ? void 0 : _d.text) === null || _f === void 0 ? void 0 : _f.appName;
        const version = '3.0';
        const [darkEnabled, setDarkEnabled] = (0, hooks_1.useState)(false);
        const darkModeLabel = t["wrc"].prefs.darkmode;
        const DARK_MODE_KEY = 'wrc:darkMode';
        const darkClasses = ['oj-bg-neutral-170', 'oj-color-invert', 'oj-c-colorscheme-dependent'];
        const getRootEl = () => (document.getElementById('globalBody') ||
            document.getElementById('appContainer') ||
            document.body);
        const applyDarkMode = (enabled) => {
            const root = getRootEl();
            if (!root)
                return;
            if (enabled) {
                darkClasses.forEach(c => root.classList.add(c));
            }
            else {
                darkClasses.forEach(c => root.classList.remove(c));
            }
        };
        (0, hooks_1.useEffect)(() => {
            var _a, _b;
            try {
                const stored = localStorage.getItem(DARK_MODE_KEY);
                if (stored === 'on' || stored === 'off') {
                    setDarkEnabled(stored === 'on');
                }
                else {
                    const root = getRootEl();
                    setDarkEnabled(((_a = root === null || root === void 0 ? void 0 : root.classList) === null || _a === void 0 ? void 0 : _a.contains('oj-color-invert')) || false);
                }
            }
            catch (_c) {
                const root = getRootEl();
                setDarkEnabled(((_b = root === null || root === void 0 ? void 0 : root.classList) === null || _b === void 0 ? void 0 : _b.contains('oj-color-invert')) || false);
            }
        }, []);
        (0, hooks_1.useEffect)(() => {
            applyDarkMode(darkEnabled);
            try {
                localStorage.setItem(DARK_MODE_KEY, darkEnabled ? 'on' : 'off');
            }
            catch (_a) {
            }
            window.dispatchEvent(new CustomEvent('wrc:darkMode', { detail: { enabled: darkEnabled } }));
        }, [darkEnabled]);
        const toggleDarkMode = () => setDarkEnabled(prev => !prev);
        const navtreeToggleClick = () => {
            try {
                adjustDrawerLayoutHeight();
                const drawer = document.getElementById('drawer-layout');
                if (!drawer)
                    return;
                const current = !!drawer.startOpened;
                drawer.startOpened = !current;
                if (drawer.startOpened) {
                    requestAnimationFrame(() => {
                        getStoredWidth().then((w) => initDrawerResizer(w));
                    });
                }
            }
            catch (_e) {
            }
        };
        const adjustDrawerLayoutHeight = () => {
            const header = document.querySelector('header');
            const drawer = document.getElementById('drawer-layout');
            const nav = document.getElementById('navtree-container2');
            const rightPanel = document.querySelector('#drawer-layout > main.right_panel');
            const vh = window.innerHeight || document.documentElement.clientHeight || 0;
            const headerH = header ? header.getBoundingClientRect().height : 0;
            const height = Math.max(0, Math.floor(vh - headerH));
            if (drawer)
                drawer.style.height = `${height}px`;
            if (nav)
                nav.style.height = `${height}px`;
            if (rightPanel) {
                rightPanel.style.minHeight = `${height}px`;
                rightPanel.style.height = `${height}px`;
            }
        };
        const getStoredWidth = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const electron = window === null || window === void 0 ? void 0 : window.electron_api;
                if (electron && electron.ipc && typeof electron.ipc.invoke === "function") {
                    return yield electron.ipc.invoke("get-property", "resizer_width");
                }
            }
            catch (_e) {
            }
            return undefined;
        });
        const initDrawerResizer = (storedWidth) => {
            const pane = document.getElementById('navtree-container2');
            const drawerLayout = document.getElementById('drawer-layout');
            const resizer = document.getElementById('drawer-start-resizer');
            const startWrapper = document.querySelector('.oj-drawer-layout-surrogate .oj-drawer-start');
            if (!pane || !drawerLayout)
                return;
            const DRAWER_MIN_WIDTH = 220;
            const DRAWER_MAX_WIDTH = window.innerWidth - 20;
            const DRAWER_WIDTH_KEY = 'wrc.drawer.start.width';
            const EDGE_PX = 16;
            const DRAWER_DEFAULT = Math.round(window.innerWidth / 4);
            if (!storedWidth) {
                storedWidth = localStorage.getItem(DRAWER_WIDTH_KEY) || DRAWER_DEFAULT;
            }
            const saved = parseInt(String(storedWidth));
            if (!isNaN(saved)) {
                const w = Math.max(DRAWER_MIN_WIDTH, Math.min(DRAWER_MAX_WIDTH, saved));
                pane.style.width = `${w}px`;
                document.documentElement.style.setProperty('--wrc-start-width', `${w}px`);
                if (startWrapper) {
                    startWrapper.style.width = `${w}px`;
                    startWrapper.style.flex = `0 0 ${w}px`;
                }
            }
            let dragging = false;
            let downX = 0;
            let baseWidth = 0;
            const setWidth = (w) => {
                const clamped = Math.max(DRAWER_MIN_WIDTH, Math.min(DRAWER_MAX_WIDTH, Math.floor(w)));
                pane.style.width = `${clamped}px`;
                document.documentElement.style.setProperty('--wrc-start-width', `${clamped}px`);
                if (startWrapper) {
                    startWrapper.style.width = `${clamped}px`;
                    startWrapper.style.flex = `0 0 ${clamped}px`;
                }
            };
            const nearRightEdge = (clientX) => {
                const rect = pane.getBoundingClientRect();
                if (resizer) {
                    const rr = resizer.getBoundingClientRect();
                    return clientX >= rr.left && clientX <= rr.right;
                }
                return clientX >= rect.left && (rect.right - clientX) <= EDGE_PX;
            };
            const onMouseMovePane = (e) => {
                if (dragging)
                    return;
                pane.style.cursor = nearRightEdge(e.clientX) ? 'col-resize' : '';
            };
            const dragMove = (clientX) => {
                const dx = clientX - downX;
                setWidth(baseWidth + dx);
            };
            const onMouseDown = (e) => {
                if (!nearRightEdge(e.clientX))
                    return;
                const rect = pane.getBoundingClientRect();
                dragging = true;
                downX = e.clientX;
                baseWidth = rect.width;
                document.body.style.cursor = 'col-resize';
                document.addEventListener('mousemove', onMouseMoveDoc);
                document.addEventListener('mouseup', onMouseUpDoc);
                e.preventDefault();
            };
            const onMouseMoveDoc = (e) => {
                if (!dragging)
                    return;
                dragMove(e.clientX);
            };
            const onMouseUpDoc = () => {
                if (!dragging)
                    return;
                dragging = false;
                document.body.style.cursor = '';
                document.removeEventListener('mousemove', onMouseMoveDoc);
                document.removeEventListener('mouseup', onMouseUpDoc);
                const width = Math.floor(pane.getBoundingClientRect().width);
                try {
                    const electron = window === null || window === void 0 ? void 0 : window.electron_api;
                    if (electron && electron.ipc && typeof electron.ipc.invoke === "function") {
                        electron.ipc.invoke("set-property", { resizer_width: String(width) });
                    }
                    else {
                        localStorage.setItem(DRAWER_WIDTH_KEY, String(width));
                    }
                }
                catch (_ignored) {
                }
            };
            pane.addEventListener('mousemove', onMouseMovePane, { capture: true });
            pane.addEventListener('mousedown', onMouseDown, { capture: true });
            if (resizer) {
                resizer.style.cursor = 'col-resize';
                resizer.style.touchAction = 'none';
                resizer.addEventListener('mousemove', onMouseMovePane, { capture: true });
                resizer.addEventListener('mousedown', onMouseDown, { capture: true });
            }
            pane.addEventListener('touchstart', (e) => {
                const t = e.touches && e.touches[0];
                if (!t)
                    return;
                if (!nearRightEdge(t.clientX))
                    return;
                const rect = pane.getBoundingClientRect();
                dragging = true;
                downX = t.clientX;
                baseWidth = rect.width;
                document.body.style.cursor = 'col-resize';
                e.preventDefault();
            }, { passive: false, capture: true });
            document.addEventListener('touchmove', (e) => {
                if (!dragging)
                    return;
                const t = e.touches && e.touches[0];
                if (!t)
                    return;
                dragMove(t.clientX);
            }, { passive: false });
            document.addEventListener('touchend', onMouseUpDoc);
        };
        const tooltips = {
            whatsNew: (_j = (_h = (_g = t["wrc-header"]) === null || _g === void 0 ? void 0 : _g.icons) === null || _h === void 0 ? void 0 : _h.whatsNew) === null || _j === void 0 ? void 0 : _j.tooltip,
            tips: (_m = (_l = (_k = t["wrc-header"]) === null || _k === void 0 ? void 0 : _k.icons) === null || _l === void 0 ? void 0 : _l.tips) === null || _m === void 0 ? void 0 : _m.tooltip,
            help: (_q = (_p = (_o = t["wrc-header"]) === null || _o === void 0 ? void 0 : _o.icons) === null || _p === void 0 ? void 0 : _p.help) === null || _q === void 0 ? void 0 : _q.tooltip,
            logout: (_u = (_t = (_s = (_r = t["wrc-header"]) === null || _r === void 0 ? void 0 : _r.buttons) === null || _s === void 0 ? void 0 : _s.hosted) === null || _t === void 0 ? void 0 : _t.logout) === null || _u === void 0 ? void 0 : _u.label,
            navtreeToggler: (_y = (_x = (_w = (_v = t["wrc-header"]) === null || _v === void 0 ? void 0 : _v.icons) === null || _w === void 0 ? void 0 : _w.navtree) === null || _x === void 0 ? void 0 : _x.toggler) === null || _y === void 0 ? void 0 : _y.tooltip
        };
        const dispatchHeaderAction = (action) => {
            var _a;
            let externalUrl;
            switch (action) {
                case "whatsNew":
                    externalUrl = 'https://github.com/oracle/weblogic-remote-console/releases';
                    break;
                case "tips":
                    (_a = document.getElementById("tips-dialog")) === null || _a === void 0 ? void 0 : _a.open();
                    break;
                case "help":
                    externalUrl = 'https://oracle.github.io/weblogic-remote-console/';
                    break;
            }
            if (externalUrl)
                (0, exports.openExternalUrl)(externalUrl);
        };
        const logoutClickHandler = () => {
            (0, transport_1.getDataComponent)("/api/logout").then((response) => {
                const redirectUrl = undefined;
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                }
                else {
                    window.location.reload();
                }
            });
        };
        const [logoutEnabled, setLogoutEnabled] = (0, hooks_1.useState)(false);
        (0, transport_1.getDataComponent)("/api/about").then((response) => {
            var _a;
            Logger.info(response);
            const caps = (_a = response === null || response === void 0 ? void 0 : response.about) === null || _a === void 0 ? void 0 : _a.capabilities;
            if (caps) {
                const enabled = typeof caps.find((c) => c === "Logout") !== "undefined";
                setLogoutEnabled(enabled);
            }
        });
        const resetApp = () => { var _a; return (_a = context === null || context === void 0 ? void 0 : context.applicationController) === null || _a === void 0 ? void 0 : _a.resetDisplay(); };
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { class: "oj-bg-neutral-170 oj-color-invert oj-flex oj-sm-align-items-center", id: "header-container", role: "region", "aria-label": ariaLabel, children: (0, jsx_runtime_1.jsxs)("div", { class: "oj-flex-bar oj-sm-align-items-center oj-sm-flex-wrap-nowrap", style: { height: "100%" }, children: [(0, jsx_runtime_1.jsxs)("div", { class: "oj-flex-bar-start oj-sm-align-items-center oj-sm-flex-1", children: [(0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "ghost", id: "navtree-toggler-link", "aria-label": tooltips.navtreeToggler, onojAction: navtreeToggleClick, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-menu", "aria-hidden": "true" }) }), (0, jsx_runtime_1.jsxs)("span", { class: "branding-area-title-md oj-flex oj-sm-align-items-center oj-sm-align-self-center oj-sm-flex-1 oj-text-nowrap", title: appName, style: { whiteSpace: "nowrap", minWidth: "0" }, children: [(0, jsx_runtime_1.jsx)("a", { href: "#", id: "resetAppLink", onClick: resetApp, "aria-labelledby": 'brand', children: (0, jsx_runtime_1.jsx)("img", { class: "branding-icon", alt: "", "aria-hidden": "true", src: (0, url_1.requireAsset)("wrc/assets/images/wrc-app-icon-color_88x78.png") }) }), (0, jsx_runtime_1.jsx)("span", { id: 'brand', class: "oj-sm-align-self-center oj-sm-flex-1", "aria-hidden": "true", style: { overflow: "hidden", textOverflow: "ellipsis", minWidth: "0" }, children: `${appName} ${version}` })] })] }), (0, jsx_runtime_1.jsx)("div", { class: "oj-flex-bar-start oj-sm-only-hide oj-md-only-hide oj-lg-1", children: " " }), (0, jsx_runtime_1.jsx)("div", { id: "header-simple-search", class: "oj-flex-bar-middle oj-sm-only-hide oj-md-only-hide oj-lg-flex-1 oj-sm-align-items-center oj-md-margin-6x-start oj-md-margin-6x-end", children: (0, jsx_runtime_1.jsx)(simple_search_1.default, { context: context }) }), (0, jsx_runtime_1.jsxs)("div", { id: "branding-area-header-iconbar", class: "oj-flex-bar-end oj-sm-only-hide oj-sm-align-items-center oj-sm-flex-initial oj-sm-margin-6x-start", children: [logoutEnabled ? ((0, jsx_runtime_1.jsx)("oj-c-button", { onojAction: logoutClickHandler, label: t["wrc-header"].buttons.logout.label, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", "aria-hidden": "true" }) })) : ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})), (0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "borderless", id: "whatsNew", title: tooltips.whatsNew, "aria-label": tooltips.whatsNew, onojAction: () => dispatchHeaderAction("whatsNew"), children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-github", "aria-hidden": "true" }) }), (0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "borderless", id: "tips", title: tooltips.tips, "aria-label": tooltips.tips, onojAction: () => dispatchHeaderAction("tips"), children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-lightbulb", "aria-hidden": "true" }) }), (0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "borderless", id: "darkMode", title: darkModeLabel, "aria-label": darkModeLabel, onojAction: toggleDarkMode, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: darkEnabled
                                                ? "oj-ux-ico-weather-moon"
                                                : "oj-ux-ico-weather-sun", "aria-hidden": "true" }) }), (0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "borderless", id: "help", title: tooltips.help, "aria-label": tooltips.help, onojAction: () => dispatchHeaderAction("help"), children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-ux-ico-help-circle-s", "aria-hidden": "true" }) })] })] }) }), (0, jsx_runtime_1.jsx)(tips_1.default, {}), (0, jsx_runtime_1.jsx)(message_line_1.default, { context: context })] }));
    }
    const openExternalUrl = (url) => {
        const electron = window === null || window === void 0 ? void 0 : window.electron_api;
        if (electron && electron.ipc && typeof electron.ipc.invoke === "function") {
            electron.ipc.invoke("external-url-opening", url);
        }
        else {
            window.open(url, "_blank", "noopener noreferrer");
        }
    };
    exports.openExternalUrl = openExternalUrl;
    exports.BrandingArea = (0, ojvcomponent_1.registerCustomElement)("wrc-branding-area", BrandingHeaderImpl, "BrandingArea", { "properties": { "context": { "type": "object", "properties": { "canExitCallBack": { "type": "function" }, "routerController": { "type": "object" }, "applicationController": { "type": "object" }, "broadcastMessage": { "type": "function" }, "startActionPolling": { "type": "function" }, "updateShoppingCart": { "type": "function" } } } } });
    exports.BrandingHeader = (0, ojvcomponent_1.registerCustomElement)("wrc-branding-header", BrandingHeaderImpl, "BrandingHeader", { "properties": { "context": { "type": "object", "properties": { "canExitCallBack": { "type": "function" }, "routerController": { "type": "object" }, "applicationController": { "type": "object" }, "broadcastMessage": { "type": "function" }, "startActionPolling": { "type": "function" }, "updateShoppingCart": { "type": "function" } } } } });
    exports.default = exports.BrandingHeader;
});
//# sourceMappingURL=header.js.map