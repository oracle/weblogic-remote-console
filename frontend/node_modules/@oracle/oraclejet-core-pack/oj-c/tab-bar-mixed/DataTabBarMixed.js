define(["require", "exports", "preact/jsx-runtime", "preact/hooks", "@oracle/oraclejet-preact/UNSAFE_ConveyorBelt", "@oracle/oraclejet-preact/UNSAFE_TabBarMixed", "./DataTabBarMixedIcon", "./sumBadge", "preact"], function (require, exports, jsx_runtime_1, hooks_1, UNSAFE_ConveyorBelt_1, UNSAFE_TabBarMixed_1, DataTabBarMixedIcon_1, sumBadge_1, preact_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataTabBarMixed = DataTabBarMixed;
    function DataTabBarMixed(props) {
        const { dynamicTabs = [], dynamicTabsOverflowIcon, dynamicTabsOverflow, onRemove, onSelect, selection, separatorPadding, size = 'lg', staticTabs = [], staticTabsDisplay, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby } = props;
        const [isOverflowMenuOpen, setIsOverflowMenuOpen] = (0, hooks_1.useState)(false);
        const tabBarMixedRef = (0, preact_1.createRef)();
        const isOutsideMouseDown = (0, hooks_1.useRef)(false);
        const handleClose = (e) => {
            if (tabBarMixedRef.current && ['itemAction', 'dismissed'].includes(e.reason)) {
                tabBarMixedRef?.current?.focus();
            }
            if (e.reason === 'outsideMousedown') {
                isOutsideMouseDown.current = true;
            }
            setIsOverflowMenuOpen(false);
        };
        const handleSelect = (event) => {
            if (event.value && event.value === 'overflow') {
                //If overflow item is clicked after dropdown is open, the reason is outsideMouseDown and it needs to be closed
                if (isOutsideMouseDown.current) {
                    setIsOverflowMenuOpen(false);
                }
                else {
                    setIsOverflowMenuOpen(true);
                }
            }
            else if (onSelect) {
                onSelect(event);
            }
            isOutsideMouseDown.current = false;
        };
        const badgeTotal = (0, sumBadge_1.sumBadge)(dynamicTabs);
        const isDividerVisible = staticTabs.length > 0 && dynamicTabs.length > 0;
        return ((0, jsx_runtime_1.jsxs)(UNSAFE_TabBarMixed_1.TabBarMixed, { onRemove: onRemove, onSelect: handleSelect, selection: selection, size: size, ref: tabBarMixedRef, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, children: [(0, jsx_runtime_1.jsxs)(UNSAFE_TabBarMixed_1.TabBarLayout, { layout: "stretch", display: staticTabsDisplay, children: [staticTabs.map((tab) => ((0, jsx_runtime_1.jsx)(UNSAFE_TabBarMixed_1.TabBarItem, { icon: tab.icon ? ((0, jsx_runtime_1.jsx)(DataTabBarMixedIcon_1.DataTabBarMixedIcon, { label: staticTabsDisplay === 'icons' ? tab.label : undefined, icon: tab.icon })) : undefined, itemKey: tab.itemKey, label: tab.label, badge: tab.badge ? tab.badge.toString() : undefined, "aria-controls": tab.tabPanelId }))), dynamicTabsOverflow === 'popup' && ((0, jsx_runtime_1.jsx)(UNSAFE_TabBarMixed_1.OverflowTabBarItem, { badge: badgeTotal > 0 ? badgeTotal.toString() : undefined, icon: (0, jsx_runtime_1.jsx)(DataTabBarMixedIcon_1.DataTabBarMixedIcon, { icon: dynamicTabsOverflowIcon }), isOpen: isOverflowMenuOpen, onClose: handleClose, overflowItemKey: "overflow", overflowItems: dynamicTabs.map((tab) => ({
                                itemKey: tab.itemKey,
                                badge: tab.badge ? tab.badge.toString() : undefined,
                                label: tab.label,
                                isRemovable: true
                            })) }))] }), dynamicTabsOverflow === 'conveyor' && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [isDividerVisible && (0, jsx_runtime_1.jsx)(UNSAFE_TabBarMixed_1.TabBarMixedSeparator, { padding: separatorPadding }), (0, jsx_runtime_1.jsx)(UNSAFE_ConveyorBelt_1.ConveyorBelt, { children: (0, jsx_runtime_1.jsx)(UNSAFE_TabBarMixed_1.TabBarLayout, { display: "standard", layout: "condense", children: dynamicTabs.map((tab) => ((0, jsx_runtime_1.jsx)(UNSAFE_TabBarMixed_1.RemovableTabBarItem, { "aria-controls": tab.tabPanelId, badge: tab.badge ? tab.badge.toString() : undefined, itemKey: tab.itemKey, label: tab.label }))) }) })] }))] }));
    }
});
