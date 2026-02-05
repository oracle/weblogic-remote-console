define(["require", "exports", "preact/jsx-runtime", "preact/hooks", "ojs/ojcollapsible"], function (require, exports, jsx_runtime_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TableIntro = void 0;
    const TableIntro = ({ tableContent }) => {
        const [isDark, setIsDark] = (0, hooks_1.useState)(false);
        (0, hooks_1.useEffect)(() => {
            const target = document.getElementById("globalBody");
            const compute = () => setIsDark(!!target && target.classList.contains("oj-color-invert"));
            compute();
            const observer = new MutationObserver(compute);
            if (target) {
                observer.observe(target, { attributes: true, attributeFilter: ["class"] });
            }
            return () => observer.disconnect();
        }, []);
        const introHTML = (tableContent === null || tableContent === void 0 ? void 0 : tableContent.getIntroductionHTML()) || "";
        return ((0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: introHTML ? ((0, jsx_runtime_1.jsx)("div", { id: "intro", class: `cfe-table-form-instructions ${isDark ? "oj-bg-neutral-180" : "oj-bg-info-20"} wrc-table-intro`, dangerouslySetInnerHTML: { __html: introHTML } })) : null }));
    };
    exports.TableIntro = TableIntro;
});
//# sourceMappingURL=tableintro.js.map