var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
define(["require", "exports", "preact/jsx-runtime", "preact/compat", "preact/hooks", "css!./dialog.css"], function (require, exports, jsx_runtime_1, compat_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Dialog = void 0;
    exports.Dialog = (0, compat_1.forwardRef)((dialogProps, ref) => {
        var _a, _b;
        const { position: incomingPosition } = dialogProps, restProps = __rest(dialogProps, ["position"]);
        const newDialogProps = Object.assign({ class: ["cfe-generic-dialog"].filter(Boolean).join(" "), modality: "modal", cancelBehavior: "icon", dragAffordance: "title-bar", resizeBehavior: "resizable" }, restProps);
        try {
            const incomingClass = restProps === null || restProps === void 0 ? void 0 : restProps.class;
            const classes = [incomingClass, "cfe-generic-dialog"];
            const root = typeof document !== "undefined"
                ? (document.getElementById("globalBody") ||
                    document.getElementById("appContainer") ||
                    document.body)
                : null;
            const dark = !!((_b = (_a = root === null || root === void 0 ? void 0 : root.classList) === null || _a === void 0 ? void 0 : _a.contains) === null || _b === void 0 ? void 0 : _b.call(_a, "oj-color-invert"));
            if (dark) {
                classes.push("oj-color-invert", "oj-c-colorscheme-dependent");
            }
            newDialogProps.class = classes.filter(Boolean).join(" ");
        }
        catch (e) {
        }
        newDialogProps["header-decoration"] = "off";
        const localRef = (0, hooks_1.useRef)(null);
        (0, hooks_1.useEffect)(() => {
            var _a, _b;
            if (!localRef.current || !incomingPosition)
                return;
            const pos = Object.assign({}, incomingPosition);
            if ((pos === null || pos === void 0 ? void 0 : pos.of) === "window") {
                pos.of = window;
            }
            try {
                (_b = (_a = (localRef.current)).setProperty) === null || _b === void 0 ? void 0 : _b.call(_a, "position", pos);
            }
            catch (_e) {
                try {
                    (localRef.current).position = pos;
                }
                catch (_e2) {
                }
            }
        }, [incomingPosition]);
        (0, hooks_1.useEffect)(() => {
            const el = localRef.current;
            if (!el || typeof document === "undefined")
                return;
            const root = (document.getElementById("globalBody") ||
                document.getElementById("appContainer") ||
                document.body);
            const apply = () => {
                var _a, _b;
                const dark = !!((_b = (_a = root === null || root === void 0 ? void 0 : root.classList) === null || _a === void 0 ? void 0 : _a.contains) === null || _b === void 0 ? void 0 : _b.call(_a, "oj-color-invert"));
                try {
                    el.classList.toggle("oj-color-invert", dark);
                    el.classList.toggle("oj-c-colorscheme-dependent", dark);
                }
                catch (_c) {
                }
            };
            apply();
            const mo = new MutationObserver((muts) => {
                for (const m of muts) {
                    if (m.type === "attributes" && (m.attributeName === "class")) {
                        apply();
                    }
                }
            });
            if (root)
                mo.observe(root, { attributes: true, attributeFilter: ["class"] });
            return () => mo.disconnect();
        }, []);
        const attachRef = (el) => {
            localRef.current = el;
            if (typeof ref === "function") {
                ref(el);
            }
            else if (ref) {
                ref.current = el;
            }
        };
        return (0, jsx_runtime_1.jsx)("oj-dialog", Object.assign({ ref: attachRef }, newDialogProps, { children: dialogProps.children }));
    });
});
//# sourceMappingURL=dialog.js.map