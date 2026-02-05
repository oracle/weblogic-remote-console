define(["require", "exports", "preact/jsx-runtime", "preact", "../../shared/model/contentmodelfactory", "preact", "oj-c/tab-bar", "oj-c/conveyor-belt"], function (require, exports, jsx_runtime_1, preact_1, contentmodelfactory_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Tabs = ({ children, model, setModel, setLoading, pageContext }) => {
        const slices = model.getSlices();
        const getActiveSlicePath = () => {
            try {
                const u = new URL(model.rdjUrl, 'http://localhost');
                return u.searchParams.get('slice') || '';
            }
            catch (_a) {
                return '';
            }
        };
        const activeSlicePath = getActiveSlicePath();
        const getTabBar = (slices, navigationPath = '') => {
            const data = slices.map(slice => { return { label: slice.label, itemKey: slice.name }; });
            const handleSelectionAction = (event) => {
                setLoading(true);
                const newItemKey = `${event.detail.value}`;
                const fullyQualifiedNewSlice = navigationPath + newItemKey;
                const modelFactory = new contentmodelfactory_1.ContentModelFactory(model.rdjUrl);
                modelFactory.build(fullyQualifiedNewSlice, pageContext).then((contentModel) => {
                    if (contentModel) {
                        setModel(contentModel);
                        setLoading(false);
                    }
                });
            };
            const getSelectedSegmentForLevel = (navPath, allSlices) => {
                var _a;
                if (activeSlicePath && activeSlicePath.startsWith(navPath)) {
                    const remaining = activeSlicePath.substring(navPath.length);
                    const segment = remaining.split('.')[0];
                    if (segment && allSlices.some((s) => s.name === segment))
                        return segment;
                }
                return (_a = allSlices[0]) === null || _a === void 0 ? void 0 : _a.name;
            };
            const currentlySelectedTab = getSelectedSegmentForLevel(navigationPath, slices);
            const selectedSlice = slices.find((s) => s.name === currentlySelectedTab);
            return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("oj-c-conveyor-belt", { arrowVisibility: "auto", class: "oj-sm-12", children: (0, jsx_runtime_1.jsx)("oj-c-tab-bar", { selection: currentlySelectedTab, onselectionChanged: handleSelectionAction, accesskey: "]", edge: "top", layout: "condense", data: data }) }), (selectedSlice === null || selectedSlice === void 0 ? void 0 : selectedSlice.slices) ? getTabBar(selectedSlice.slices, `${navigationPath}${currentlySelectedTab}.`) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {})] }));
        };
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("div", { id: "form-tabstrip-container", class: "oj-flex", children: (0, jsx_runtime_1.jsx)("div", { class: "oj-flex-item oj-sm-12 tabbar-container oj-sm-padding-2x-horizontal", role: "application", children: slices ? getTabBar(slices) : (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {}) }) }), children] }));
    };
    const UNUSED = preact_1.h;
    exports.default = Tabs;
});
//# sourceMappingURL=tabs.js.map