define(["require", "exports", "preact/jsx-runtime", "preact/hooks", "ojL10n!wrc/shared/resources/nls/frontend", "ojs/ojswitch"], function (require, exports, jsx_runtime_1, hooks_1, t) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Footer = Footer;
    const _DEFAULT_LINKS = [
        {
            name: "About Oracle",
            linkId: "aboutOracle",
            linkTarget: "http://www.oracle.com/us/corporate/index.html#menu-about"
        },
        {
            name: "Contact Us",
            linkId: "contactUs",
            linkTarget: "http://www.oracle.com/us/corporate/contact/index.html"
        },
        {
            name: "Legal Notices",
            linkId: "legalNotices",
            linkTarget: "http://www.oracle.com/us/legal/index.html"
        },
        {
            name: "Terms Of Use",
            linkId: "termsOfUse",
            linkTarget: "http://www.oracle.com/us/legal/terms/index.html"
        },
        {
            name: "Your Privacy Rights",
            linkId: "yourPrivacyRights",
            linkTarget: "http://www.oracle.com/us/legal/privacy/index.html"
        }
    ];
    function Footer({ links = _DEFAULT_LINKS }) {
        const darkModeLabel = t["wrc"].prefs.darkmode;
        const [darkEnabled, setDarkEnabled] = (0, hooks_1.useState)(false);
        const KEY = 'wrc:darkMode';
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
            try {
                setDarkEnabled(localStorage.getItem(KEY) === 'on');
            }
            catch (_a) {
            }
        }, []);
        (0, hooks_1.useEffect)(() => {
            applyDarkMode(darkEnabled);
            try {
                localStorage.setItem(KEY, darkEnabled ? 'on' : 'off');
            }
            catch (_a) {
            }
        }, [darkEnabled]);
        (0, hooks_1.useEffect)(() => {
            const onExternalToggle = (e) => {
                const detail = e.detail;
                if (typeof (detail === null || detail === void 0 ? void 0 : detail.enabled) === 'boolean') {
                    setDarkEnabled(!!detail.enabled);
                }
            };
            window.addEventListener('wrc:darkMode', onExternalToggle);
            return () => window.removeEventListener('wrc:darkMode', onExternalToggle);
        }, []);
        const onToggle = (e) => {
            var _a;
            if (((_a = e === null || e === void 0 ? void 0 : e.detail) === null || _a === void 0 ? void 0 : _a.updatedFrom) === 'internal') {
                const enabled = !!e.detail.value;
                setDarkEnabled(enabled);
                window.dispatchEvent(new CustomEvent('wrc:darkMode', { detail: { enabled } }));
            }
        };
        return ((0, jsx_runtime_1.jsxs)("div", { class: "oj-web-applayout-footer-item oj-web-applayout-max-width oj-text-color-secondary oj-typography-body-sm oj-flex oj-sm-justify-content-flex-end oj-sm-align-items-center", role: "contentinfo", children: [(0, jsx_runtime_1.jsx)("span", { class: "oj-typography-body-sm oj-sm-margin-2x-end", children: darkModeLabel }), (0, jsx_runtime_1.jsx)("oj-switch", { id: "dark-mode-switch-preact", value: darkEnabled, onvalueChanged: onToggle, "aria-label": darkModeLabel })] }));
    }
});
//# sourceMappingURL=footer.js.map