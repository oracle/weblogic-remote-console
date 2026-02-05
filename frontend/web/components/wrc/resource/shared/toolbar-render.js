define(["require", "exports", "preact/jsx-runtime", "wrc/shared/url", "oj-c/button"], function (require, exports, jsx_runtime_1, url_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.buildToolbarButtons = buildToolbarButtons;
    function buildToolbarButtons(buttons) {
        const elements = [];
        Object.keys(buttons).forEach((key) => {
            var _a;
            const cfg = buttons[key];
            if (!cfg.isVisible()) {
                return;
            }
            const label = (_a = cfg.label) !== null && _a !== void 0 ? _a : "";
            const disabled = !cfg.isEnabled();
            const handleAction = (event) => {
                event.preventDefault();
                cfg.action(event);
            };
            const startIcon = cfg.iconClass ? ((0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: cfg.iconClass })) : cfg.iconFile ? ((0, jsx_runtime_1.jsx)("img", { class: "button-icon", slot: "startIcon", src: (0, url_1.requireAsset)(`wrc/assets/images/${cfg.iconFile}.png`), alt: label })) : null;
            elements.push((0, jsx_runtime_1.jsx)("oj-c-button", { chroming: "borderless", onojAction: handleAction, accessKey: cfg.accesskey, disabled: disabled, label: label, "data-weight": cfg.weight, "data-testid": key, children: startIcon }));
        });
        return elements;
    }
});
//# sourceMappingURL=toolbar-render.js.map