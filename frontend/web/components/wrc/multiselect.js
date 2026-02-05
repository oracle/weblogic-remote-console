define(["require", "exports", "preact/jsx-runtime", "ojL10n!wrc/shared/resources/nls/frontend", "preact/hooks", "oj-c/button", "ojs/ojcheckboxset", "oj-c/checkboxset", "css!wrc/multiselect.css"], function (require, exports, jsx_runtime_1, t, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CHECKBOXSET_TYPE;
    (function (CHECKBOXSET_TYPE) {
        CHECKBOXSET_TYPE["Available"] = "available";
        CHECKBOXSET_TYPE["Chosen"] = "chosen";
    })(CHECKBOXSET_TYPE || (CHECKBOXSET_TYPE = {}));
    ;
    const MultiSelect = ({ available, chosen, changeHandler, readonly = false }) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
        function stringifyKey(a) {
            var _a;
            if (typeof a.key === 'string') {
                return a.key;
            }
            else {
                return ((_a = a.key) === null || _a === void 0 ? void 0 : _a.resourceData) || '';
            }
        }
        const [checkboxState, setCheckboxState] = (0, hooks_1.useState)((() => {
            return {
                [CHECKBOXSET_TYPE.Available]: {
                    options: available.map(a => { return Object.assign(Object.assign({}, a), { value: stringifyKey(a) }); }),
                    checked: []
                },
                [CHECKBOXSET_TYPE.Chosen]: {
                    options: chosen.map(a => { return Object.assign(Object.assign({}, a), { value: stringifyKey(a) }); }),
                    checked: []
                }
            };
        })());
        (0, hooks_1.useEffect)(() => {
            checkboxState[CHECKBOXSET_TYPE.Available].options = (available.map(a => { return Object.assign(Object.assign({}, a), { value: stringifyKey(a) }); }));
            checkboxState[CHECKBOXSET_TYPE.Chosen].options = (chosen.map(a => { return Object.assign(Object.assign({}, a), { value: stringifyKey(a) }); }));
            setCheckboxState(Object.assign({}, checkboxState));
        }, [available, chosen]);
        (0, hooks_1.useEffect)(() => {
            const newChosen = asSelectOptions(checkboxState[CHECKBOXSET_TYPE.Chosen].options);
            const newAvailable = asSelectOptions(checkboxState[CHECKBOXSET_TYPE.Available].options);
            changeHandler({ chosen: newChosen, available: newAvailable });
        }, [checkboxState]);
        const asSelectOptions = (options) => {
            return options.map(o => { return { key: o.value, label: o.label }; });
        };
        const _deepCopyCheckboxState = (checkboxState) => {
            const clonedState = Object.create(Object.getPrototypeOf(checkboxState));
            Object.assign(clonedState, checkboxState);
            return clonedState;
        };
        const handleChecked = (event) => {
            var _a;
            const target = event.target;
            const checkboxType = target.getAttribute('data-type');
            if (checkboxType) {
                const newChecked = [];
                (_a = event.detail.value) === null || _a === void 0 ? void 0 : _a.forEach(element => {
                    const selection = checkboxState[checkboxType].options.find(a => a.value === element);
                    if (selection) {
                        newChecked.push(selection);
                    }
                });
                checkboxState[checkboxType].checked = newChecked;
                setCheckboxState(_deepCopyCheckboxState(checkboxState));
            }
        };
        const handleMoveButton = (e) => {
            const target = e.target;
            const source = target.getAttribute('data-source');
            const destination = target.getAttribute('data-destination');
            checkboxState[source].checked.forEach(checked => {
                const idx = checkboxState[source].options.findIndex(c => c.key === checked.key);
                if (idx > -1) {
                    const item = checkboxState[source].options.splice(idx, 1);
                    checkboxState[destination].options.push(item[0]);
                    checkboxState[destination].checked.push(item[0]);
                }
            });
            checkboxState[source].checked = [];
            setCheckboxState(Object.assign({}, checkboxState));
            const asSelectOptions = (options) => {
                return options.map(o => { return { key: o.value, label: o.label }; });
            };
        };
        const handleMoveAllButton = (e) => {
            const target = e.target;
            const source = target.getAttribute('data-source');
            const destination = target.getAttribute('data-destination');
            checkboxState[destination].checked.push(...checkboxState[source].options);
            checkboxState[destination].options.push(...checkboxState[source].options);
            checkboxState[source].options = [];
            checkboxState[source].checked = [];
            setCheckboxState(Object.assign({}, checkboxState));
        };
        if (readonly) {
            return ((0, jsx_runtime_1.jsxs)("div", { class: 'wrc-multiselect-readonly', children: [(0, jsx_runtime_1.jsx)("oj-label", { children: (_b = (_a = t["wrc-pdj-fields"]) === null || _a === void 0 ? void 0 : _a["cfe-multi-select"]) === null || _b === void 0 ? void 0 : _b.labels.chosen }), (0, jsx_runtime_1.jsx)("ul", { children: chosen.map(item => (0, jsx_runtime_1.jsx)("li", { children: item.label }, stringifyKey(item))) })] }));
        }
        return ((0, jsx_runtime_1.jsxs)("div", { id: 'available-chosen-container', class: 'wrc-multiselect', children: [(0, jsx_runtime_1.jsxs)("div", { id: 'available-container', children: [(0, jsx_runtime_1.jsx)("oj-label", { children: (_d = (_c = t["wrc-pdj-fields"]) === null || _c === void 0 ? void 0 : _c["cfe-multi-select"]) === null || _d === void 0 ? void 0 : _d.labels.available }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("oj-c-checkboxset", { "data-testid": 'available', "data-type": CHECKBOXSET_TYPE.Available, onvalueChanged: handleChecked, options: checkboxState[CHECKBOXSET_TYPE.Available].options, value: (_e = checkboxState[CHECKBOXSET_TYPE.Available].checked) === null || _e === void 0 ? void 0 : _e.map(s => s.value) }) })] }), (0, jsx_runtime_1.jsxs)("div", { id: 'available-chosen-buttonset', children: [(0, jsx_runtime_1.jsx)("div", { class: "oj-flex oj-sm-justify-content-center oj-sm-margin-2x", children: (0, jsx_runtime_1.jsx)("oj-c-button", { "data-testid": 'add button', "data-source": CHECKBOXSET_TYPE.Available, "data-destination": CHECKBOXSET_TYPE.Chosen, disabled: checkboxState[CHECKBOXSET_TYPE.Available].checked.length === 0, class: "oj-button-outlined-chrome oj-button-icon-only oj-sm-margin-2x", onojAction: handleMoveButton, "aria-label": (_j = (_h = (_g = (_f = t["wrc-pdj-fields"]) === null || _f === void 0 ? void 0 : _f["cfe-multi-select"]) === null || _g === void 0 ? void 0 : _g.buttons) === null || _h === void 0 ? void 0 : _h.add) === null || _j === void 0 ? void 0 : _j.tooltip, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-fwk-icon oj-fwk-icon-caret-e" }) }) }), (0, jsx_runtime_1.jsx)("div", { class: "oj-flex oj-sm-justify-content-center oj-sm-margin-2x", children: (0, jsx_runtime_1.jsx)("oj-c-button", { "data-testid": 'add all button', "data-source": CHECKBOXSET_TYPE.Available, "data-destination": CHECKBOXSET_TYPE.Chosen, disabled: checkboxState[CHECKBOXSET_TYPE.Available].options.length === 0, class: "oj-button-outlined-chrome oj-button-icon-only oj-sm-margin-2x", onojAction: handleMoveAllButton, "aria-label": (_o = (_m = (_l = (_k = t["wrc-pdj-fields"]) === null || _k === void 0 ? void 0 : _k["cfe-multi-select"]) === null || _l === void 0 ? void 0 : _l.buttons) === null || _m === void 0 ? void 0 : _m.addAll) === null || _o === void 0 ? void 0 : _o.tooltip, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-fwk-icon oj-fwk-icon-caret02end-e" }) }) }), (0, jsx_runtime_1.jsx)("div", { class: "oj-flex oj-sm-justify-content-center oj-sm-margin-2x", children: (0, jsx_runtime_1.jsx)("oj-c-button", { "data-testid": 'remove button', "data-source": CHECKBOXSET_TYPE.Chosen, "data-destination": CHECKBOXSET_TYPE.Available, disabled: checkboxState[CHECKBOXSET_TYPE.Chosen].checked.length === 0, class: "oj-button-outlined-chrome oj-button-icon-only oj-sm-margin-2x", onojAction: handleMoveButton, "aria-label": (_s = (_r = (_q = (_p = t["wrc-pdj-fields"]) === null || _p === void 0 ? void 0 : _p["cfe-multi-select"]) === null || _q === void 0 ? void 0 : _q.buttons) === null || _r === void 0 ? void 0 : _r.remove) === null || _s === void 0 ? void 0 : _s.tooltip, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-fwk-icon oj-fwk-icon-caret-w" }) }) }), (0, jsx_runtime_1.jsx)("div", { class: "oj-flex oj-sm-justify-content-center oj-sm-margin-2x", children: (0, jsx_runtime_1.jsx)("oj-c-button", { "data-testid": 'remove all button', "data-source": CHECKBOXSET_TYPE.Chosen, "data-destination": CHECKBOXSET_TYPE.Available, disabled: checkboxState[CHECKBOXSET_TYPE.Chosen].options.length === 0, class: "oj-button-outlined-chrome oj-button-icon-only oj-sm-margin-2x", onojAction: handleMoveAllButton, "aria-label": (_w = (_v = (_u = (_t = t["wrc-pdj-fields"]) === null || _t === void 0 ? void 0 : _t["cfe-multi-select"]) === null || _u === void 0 ? void 0 : _u.buttons) === null || _v === void 0 ? void 0 : _v.removeAll) === null || _w === void 0 ? void 0 : _w.tooltip, children: (0, jsx_runtime_1.jsx)("span", { slot: "startIcon", class: "oj-fwk-icon oj-fwk-icon-caret02end-w" }) }) })] }), (0, jsx_runtime_1.jsxs)("div", { id: 'chosen-container', class: 'wrc-chosen-container', children: [(0, jsx_runtime_1.jsx)("oj-label", { children: (_y = (_x = t["wrc-pdj-fields"]) === null || _x === void 0 ? void 0 : _x["cfe-multi-select"]) === null || _y === void 0 ? void 0 : _y.labels.chosen }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("oj-c-checkboxset", { "data-testid": 'chosen', "data-type": CHECKBOXSET_TYPE.Chosen, onvalueChanged: handleChecked, options: checkboxState[CHECKBOXSET_TYPE.Chosen].options, value: (_z = checkboxState[CHECKBOXSET_TYPE.Chosen].checked) === null || _z === void 0 ? void 0 : _z.map(s => s.value) }) })] })] }));
    };
    exports.default = MultiSelect;
});
//# sourceMappingURL=multiselect.js.map