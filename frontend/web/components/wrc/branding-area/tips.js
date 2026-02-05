define(["require", "exports", "preact/jsx-runtime", "preact/hooks", "ojs/ojvcomponent", "ojL10n!wrc/shared/resources/nls/frontend", "./tips-manager", "wrc/display/dialog", "ojs/ojcontext", "ojs/ojpopup", "ojs/ojcheckboxset", "ojs/ojoption", "ojs/ojlabel", "oj-c/button", "oj-c/checkboxset"], function (require, exports, jsx_runtime_1, hooks_1, ojvcomponent_1, t, tips_manager_1, dialog_1, Context) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tips = void 0;
    const openExternalUrl = (url) => {
        try {
            const electron = window === null || window === void 0 ? void 0 : window.electron_api;
            if (electron && electron.ipc && typeof electron.ipc.invoke === "function") {
                electron.ipc.invoke("external-url-opening", url);
                return;
            }
        }
        catch (_e) {
        }
        window.open(url, "_blank", "noopener,noreferrer");
    };
    function TipsImpl() {
        const dialogRef = (0, hooks_1.useRef)(null);
        const i18n = (0, hooks_1.useMemo)(() => {
            var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25;
            return ({
                icons: {
                    ancillary: {
                        contentItem: {
                            id: "tips",
                            iconFile: "tips-icon-blk_24x24",
                            tooltip: ((_d = (_c = (_b = (_a = t["wrc-ancillary-content"]) === null || _a === void 0 ? void 0 : _a.tabstrip) === null || _b === void 0 ? void 0 : _b.tabs) === null || _c === void 0 ? void 0 : _c.tips) === null || _d === void 0 ? void 0 : _d.label) ||
                                "User Tips",
                        },
                    },
                    close: {
                        iconFile: "dialog-close-blk_24x24",
                        tooltip: ((_h = (_g = (_f = t["wrc-common"]) === null || _f === void 0 ? void 0 : _f.buttons) === null || _g === void 0 ? void 0 : _g.close) === null || _h === void 0 ? void 0 : _h.label) || "Close",
                    },
                    filter: {
                        iconFile: "oj-ux-ico-filter",
                        tooltip: ((_l = (_k = (_j = t["wrc-common"]) === null || _j === void 0 ? void 0 : _j.tooltips) === null || _k === void 0 ? void 0 : _k.filter) === null || _l === void 0 ? void 0 : _l.value) || "Filter",
                    },
                },
                popups: {
                    tips: {
                        title: ((_p = (_o = (_m = t["wrc-ancillary-content"]) === null || _m === void 0 ? void 0 : _m.popups) === null || _o === void 0 ? void 0 : _o.tips) === null || _p === void 0 ? void 0 : _p.title) ||
                            "Filter Tips",
                        checkboxes: {
                            hideall: ((_t = (_s = (_r = (_q = t["wrc-ancillary-content"]) === null || _q === void 0 ? void 0 : _q.popups) === null || _r === void 0 ? void 0 : _r.tips) === null || _s === void 0 ? void 0 : _s.checkboxes) === null || _t === void 0 ? void 0 : _t.hideall) || "Hide All Tips",
                            productivity: ((_x = (_w = (_v = (_u = t["wrc-ancillary-content"]) === null || _u === void 0 ? void 0 : _u.popups) === null || _v === void 0 ? void 0 : _v.tips) === null || _w === void 0 ? void 0 : _w.checkboxes) === null || _x === void 0 ? void 0 : _x.productivity) || "Show Productivity Tips",
                            personalization: ((_1 = (_0 = (_z = (_y = t["wrc-ancillary-content"]) === null || _y === void 0 ? void 0 : _y.popups) === null || _z === void 0 ? void 0 : _z.tips) === null || _0 === void 0 ? void 0 : _0.checkboxes) === null || _1 === void 0 ? void 0 : _1.personalization) || "Show Personalization Tips",
                            whereis: ((_5 = (_4 = (_3 = (_2 = t["wrc-ancillary-content"]) === null || _2 === void 0 ? void 0 : _2.popups) === null || _3 === void 0 ? void 0 : _3.tips) === null || _4 === void 0 ? void 0 : _4.checkboxes) === null || _5 === void 0 ? void 0 : _5.whereis) || "Show Where Is... Tips",
                            accessibility: ((_9 = (_8 = (_7 = (_6 = t["wrc-ancillary-content"]) === null || _6 === void 0 ? void 0 : _6.popups) === null || _7 === void 0 ? void 0 : _7.tips) === null || _8 === void 0 ? void 0 : _8.checkboxes) === null || _9 === void 0 ? void 0 : _9.accessibility) || "Show Accessibility Tips",
                            connectivity: ((_13 = (_12 = (_11 = (_10 = t["wrc-ancillary-content"]) === null || _10 === void 0 ? void 0 : _10.popups) === null || _11 === void 0 ? void 0 : _11.tips) === null || _12 === void 0 ? void 0 : _12.checkboxes) === null || _13 === void 0 ? void 0 : _13.connectivity) || "Show Connectivity Tips",
                            security: ((_17 = (_16 = (_15 = (_14 = t["wrc-ancillary-content"]) === null || _14 === void 0 ? void 0 : _14.popups) === null || _15 === void 0 ? void 0 : _15.tips) === null || _16 === void 0 ? void 0 : _16.checkboxes) === null || _17 === void 0 ? void 0 : _17.security) || "Show Security Tips",
                            other: ((_21 = (_20 = (_19 = (_18 = t["wrc-ancillary-content"]) === null || _18 === void 0 ? void 0 : _18.popups) === null || _19 === void 0 ? void 0 : _19.tips) === null || _20 === void 0 ? void 0 : _20.checkboxes) === null || _21 === void 0 ? void 0 : _21.other) || "Show Other Tips",
                        },
                    },
                },
                titles: {
                    ancillary: {
                        contentItem: {
                            value: ((_25 = (_24 = (_23 = (_22 = t["wrc-ancillary-content"]) === null || _22 === void 0 ? void 0 : _22.tabstrip) === null || _23 === void 0 ? void 0 : _23.tabs) === null || _24 === void 0 ? void 0 : _24.tips) === null || _25 === void 0 ? void 0 : _25.label) || "User Tips",
                        },
                    },
                },
            });
        }, []);
        const [allCategories, setAllCategories] = (0, hooks_1.useState)([]);
        const [includedCategories, setIncludedCategories] = (0, hooks_1.useState)([]);
        const [cards, setCards] = (0, hooks_1.useState)([]);
        const [filteredCards, setFilteredCards] = (0, hooks_1.useState)([]);
        (0, hooks_1.useEffect)(() => {
            const docsURL = "";
            const visible = tips_manager_1.default.getAllVisible() || [];
            const enriched = visible.map((tip) => {
                var _a, _b, _c, _d, _f, _g, _h, _j, _k, _l, _m, _o;
                const tag = ((_d = (_c = (_b = (_a = t["wrc-ancillary-content"]) === null || _a === void 0 ? void 0 : _a.tips) === null || _b === void 0 ? void 0 : _b.labels) === null || _c === void 0 ? void 0 : _c[tip.category]) === null || _d === void 0 ? void 0 : _d.value) || tip.category;
                const title = ((_j = (_h = (_g = (_f = t["wrc-ancillary-content"]) === null || _f === void 0 ? void 0 : _f.tips) === null || _g === void 0 ? void 0 : _g.cards) === null || _h === void 0 ? void 0 : _h[tip.id]) === null || _j === void 0 ? void 0 : _j.title) ||
                    tip.id;
                let html = ((_o = (_m = (_l = (_k = t["wrc-ancillary-content"]) === null || _k === void 0 ? void 0 : _k.tips) === null || _l === void 0 ? void 0 : _l.cards) === null || _m === void 0 ? void 0 : _m[tip.id]) === null || _o === void 0 ? void 0 : _o.descriptionHTML) || "";
                html = String(html)
                    .replaceAll("@@docsURL@@", docsURL)
                    .replace(/on-click="[^"]*"/g, "");
                return {
                    id: tip.id,
                    category: tip.category,
                    visible: !!tip.visible,
                    tag,
                    title,
                    html,
                };
            });
            setCards(enriched);
            const cats = (tips_manager_1.default.getAllCategories() || []).map((cat) => {
                var _a, _b, _c, _d, _f, _g, _h, _j;
                return ({
                    id: cat.id,
                    label: ((_d = (_c = (_b = (_a = t["wrc-ancillary-content"]) === null || _a === void 0 ? void 0 : _a.tips) === null || _b === void 0 ? void 0 : _b.labels) === null || _c === void 0 ? void 0 : _c[cat.id]) === null || _d === void 0 ? void 0 : _d.value) ||
                        cat.id,
                    option: ((_j = (_h = (_g = (_f = t["wrc-ancillary-content"]) === null || _f === void 0 ? void 0 : _f.popups) === null || _g === void 0 ? void 0 : _g.tips) === null || _h === void 0 ? void 0 : _h.checkboxes) === null || _j === void 0 ? void 0 : _j[cat.id]) || cat.id,
                });
            }) || [];
            setAllCategories(cats);
            let defaults = tips_manager_1.default.getCategories() || [];
            if (!defaults || defaults.length === 0) {
                defaults = cats.map((c) => c.id);
            }
            setIncludedCategories(defaults);
            setFilteredCards(enriched.filter((c) => defaults.includes(c.category)));
        }, []);
        (0, hooks_1.useEffect)(() => {
            if (includedCategories.length === 0)
                setFilteredCards([]);
            else
                setFilteredCards(cards.filter((c) => includedCategories.includes(c.category)));
        }, [includedCategories, cards]);
        (0, hooks_1.useEffect)(() => {
            const onHeaderAction = (evt) => {
                var _a;
                const action = (_a = evt.detail) === null || _a === void 0 ? void 0 : _a.action;
                if (action === "tips") {
                    requestAnimationFrame(() => {
                        const dlg = dialogRef.current;
                        if (!dlg)
                            return;
                        const bc = Context.getContext(dlg).getBusyContext();
                        bc.whenReady().then(() => dlg.open());
                    });
                }
            };
            window.addEventListener("wrc:headerAction", onHeaderAction);
            return () => window.removeEventListener("wrc:headerAction", onHeaderAction);
        }, []);
        const closeDialog = () => {
            var _a, _b;
            try {
                (_b = (_a = dialogRef.current) === null || _a === void 0 ? void 0 : _a.close) === null || _b === void 0 ? void 0 : _b.call(_a);
            }
            catch (_c) { }
        };
        const onDialogFocus = (e) => {
            var _a;
            const id = (_a = e === null || e === void 0 ? void 0 : e.currentTarget) === null || _a === void 0 ? void 0 : _a.id;
            if (!id)
                return;
            const nodeList = document.querySelectorAll(`#${id} .oj-resizable-handle`);
            for (let i = nodeList.length - 1; i >= 0; i--) {
                const classList = nodeList[i].className.split(" ").filter(Boolean);
                const last = classList[classList.length - 1];
                if (!["oj-resizable-w", "oj-resizable-sw", "oj-resizable-s"].includes(last)) {
                    nodeList[i].remove();
                }
            }
        };
        const launchTipsFilterPopup = () => {
            var _a, _b;
            const popup = document.getElementById("tipsFilterPopup");
            if ((_a = popup === null || popup === void 0 ? void 0 : popup.isOpen) === null || _a === void 0 ? void 0 : _a.call(popup))
                popup.close();
            (_b = popup === null || popup === void 0 ? void 0 : popup.open) === null || _b === void 0 ? void 0 : _b.call(popup);
        };
        const onCheckboxValueChanged = (event) => {
            var _a;
            const value = ((_a = event === null || event === void 0 ? void 0 : event.detail) === null || _a === void 0 ? void 0 : _a.value) || [];
            setIncludedCategories(value);
        };
        const onCardContentClick = (e) => {
            const target = e.target;
            if (!target)
                return;
            let el = target;
            while (el && el !== e.currentTarget) {
                const dataUrl = el.getAttribute("data-url");
                if (dataUrl) {
                    const url = dataUrl.replace("@@docsURL@@", "");
                    try {
                        openExternalUrl(url);
                    }
                    catch (_a) {
                        window.open(url, "_blank", "noopener,noreferrer");
                    }
                    e.preventDefault();
                    return;
                }
                el = el.parentElement;
            }
        };
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(dialog_1.Dialog, { id: "tips-dialog", position: { my: { horizontal: 'center', vertical: 'top' }, at: { horizontal: "center", vertical: 'top' } }, resizeBehavior: "resizable", dragAffordance: "title-bar", onojFocus: onDialogFocus, "aria-labelledby": "tips-dialog-title", ref: dialogRef, children: (0, jsx_runtime_1.jsxs)("div", { slot: "body", class: "oj-bg-body", style: { overflow: 'auto' }, children: [(0, jsx_runtime_1.jsx)("div", { class: "oj-flex-bar oj-bg-body", children: (0, jsx_runtime_1.jsxs)("div", { class: "oj-flex-bar-start", children: [(0, jsx_runtime_1.jsx)("span", { class: "oj-ux-ico-lightbulb size-7 oj-sm-align-self-center", "aria-hidden": "true" }), (0, jsx_runtime_1.jsx)("oj-label", { id: "tips-dialog-title", class: "oj-sm-align-self-center", children: i18n.titles.ancillary.contentItem.value })] }) }), (0, jsx_runtime_1.jsx)("div", { class: "oj-flex-bar oj-bg-body", children: (0, jsx_runtime_1.jsx)("div", { class: "oj-flex-bar-start oj-sm-flex-items-initial", children: (0, jsx_runtime_1.jsx)("oj-c-button", { chroming: 'borderless', onojAction: launchTipsFilterPopup, tooltip: "Filter Tips", label: i18n.icons.filter.tooltip, "aria-labelledby": "filter-label", class: 'oj-sm-align-items-center', size: "sm", children: (0, jsx_runtime_1.jsx)("span", { id: "tips-filter-icon", class: i18n.icons.filter.iconFile + ' oj-sm-align-self-center size-3', slot: 'startIcon' }) }) }) }), (0, jsx_runtime_1.jsx)("div", { id: "tips-tab-cards-container", role: "region", "aria-label": i18n.icons.ancillary.contentItem.tooltip, class: "oj-web-applayout-max-width oj-sm-web-padding-horizontal oj-bg-body", tabindex: 0, style: { overflow: 'visible' }, children: (0, jsx_runtime_1.jsx)("div", { class: "oj-flex oj-sm-flex-items-initial", children: filteredCards.map((card) => ((0, jsx_runtime_1.jsx)("div", { class: "tips-panel-card-padding oj-flex oj-flex-item oj-sm-flex-items-1 " +
                                            (filteredCards.length > 1
                                                ? "oj-sm-12 oj-md-4 oj-lg-3"
                                                : "oj-sm-9"), children: (0, jsx_runtime_1.jsxs)("div", { class: "tips-panel-card", tabindex: 0, children: [(0, jsx_runtime_1.jsx)("span", { class: "tips-card-tag", children: card.tag }), (0, jsx_runtime_1.jsx)("span", { class: "cfe-screen-reader-period" }), (0, jsx_runtime_1.jsx)("div", { class: "tips-card-title", children: card.title }), (0, jsx_runtime_1.jsx)("span", { class: "cfe-screen-reader-period" }), (0, jsx_runtime_1.jsx)("div", { class: "tips-card-content", onClick: onCardContentClick, dangerouslySetInnerHTML: { __html: card.html } })] }) }))) }) })] }) }), (0, jsx_runtime_1.jsx)("oj-popup", { id: "tipsFilterPopup", "initial-focus": "firstFocusable", children: (0, jsx_runtime_1.jsx)("oj-c-checkboxset", { "label-hint": i18n.popups.tips.title, "label-edge": "inside", options: allCategories.map(c => { return Object.assign({ value: c.id }, c); }), value: includedCategories, onvalueChanged: onCheckboxValueChanged }) })] }));
    }
    exports.Tips = (0, ojvcomponent_1.registerCustomElement)("wrc-tips", TipsImpl, "Tips");
    exports.default = exports.Tips;
});
//# sourceMappingURL=tips.js.map