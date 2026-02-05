define(["require", "exports", "preact/jsx-runtime", "@oracle/oraclejet-preact/UNSAFE_TabBar", "@oracle/oraclejet-preact/UNSAFE_OverflowTabBar", "./DataTabBarIcon", "@oracle/oraclejet-preact/UNSAFE_ReorderableTabBar"], function (require, exports, jsx_runtime_1, UNSAFE_TabBar_1, UNSAFE_OverflowTabBar_1, DataTabBarIcon_1, UNSAFE_ReorderableTabBar_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TabBarRenderer = TabBarRenderer;
    exports.OverflowTabBarRenderer = OverflowTabBarRenderer;
    //To limit regualar badge to 999+ and Stacked and Only Icon badges to 99+
    const badgeRenderer = (badgeValue, display) => {
        if (badgeValue != null) {
            let modifiedBadge = '';
            if (display === 'stacked' || display === 'icons') {
                modifiedBadge = badgeValue > 99 ? '99+' : badgeValue.toString();
            }
            else {
                modifiedBadge = badgeValue > 999 ? '999+' : badgeValue.toString();
            }
            return modifiedBadge;
        }
        else
            return undefined;
    };
    const tabBarItemRenderer = (tab, display) => {
        return ((0, jsx_runtime_1.jsx)(UNSAFE_TabBar_1.TabBarItem, { icon: tab.icon ? (0, jsx_runtime_1.jsx)(DataTabBarIcon_1.DataTabBarIcon, { icon: tab.icon }) : undefined, badge: badgeRenderer(tab.badge, display), itemKey: tab.itemKey, label: tab.label, metadata: tab.metadata, severity: tab.severity, "aria-controls": tab.tabPanelId, labelMaxWidth: tab.labelMaxWidth }));
    };
    const removableTabBarItemRenderer = (tab, display) => {
        return ((0, jsx_runtime_1.jsx)(UNSAFE_TabBar_1.RemovableTabBarItem, { icon: tab.icon ? (0, jsx_runtime_1.jsx)(DataTabBarIcon_1.DataTabBarIcon, { icon: tab.icon }) : undefined, "aria-controls": tab.tabPanelId, badge: badgeRenderer(tab.badge, display), itemKey: tab.itemKey, label: tab.label, metadata: tab.metadata, severity: tab.severity }));
    };
    const linkTabBarItemRenderer = (tab, display) => {
        return ((0, jsx_runtime_1.jsx)(UNSAFE_TabBar_1.TabBarLinkItem, { icon: tab.icon ? (0, jsx_runtime_1.jsx)(DataTabBarIcon_1.DataTabBarIcon, { icon: tab.icon }) : undefined, "aria-controls": tab.tabPanelId, badge: badgeRenderer(tab.badge, display), itemKey: tab.itemKey, label: tab.label, metadata: tab.metadata, severity: tab.severity, href: tab.href }));
    };
    function TabBarRenderer(props, handleSelect, rootRef) {
        const { data, truncation, ...tabBarProps } = props;
        const display = tabBarProps.display;
        const { maxWidths } = (0, UNSAFE_TabBar_1.useProgressiveTruncation)({
            rootRef,
            isDisabled: !(truncation && truncation === 'progressive')
        });
        const items = truncation === 'progressive'
            ? data.map((item) => ({
                ...item,
                labelMaxWidth: maxWidths?.get(item.itemKey)
            }))
            : data;
        const isLinkType = (item) => {
            return 'href' in item;
        };
        return tabBarProps.reorderable === 'enabled' ? ((0, jsx_runtime_1.jsx)(UNSAFE_ReorderableTabBar_1.ReorderableTabBar, { ...tabBarProps, onSelect: handleSelect, children: items.map((tab) => tab != null &&
                (isLinkType(tab)
                    ? linkTabBarItemRenderer(tab, display)
                    : tab.isRemovable
                        ? removableTabBarItemRenderer(tab, display)
                        : tabBarItemRenderer(tab, display))) })) : ((0, jsx_runtime_1.jsx)(UNSAFE_TabBar_1.TabBar, { onSelect: handleSelect, ref: rootRef, ...tabBarProps, children: items.map((tab) => isLinkType(tab)
                ? linkTabBarItemRenderer(tab, display)
                : tab.isRemovable
                    ? removableTabBarItemRenderer(tab, display)
                    : tabBarItemRenderer(tab, display)) }));
    }
    function OverflowTabBarRenderer(props, handleSelect) {
        const { data, truncation, ...overflowTabBarProps } = props;
        return ((0, jsx_runtime_1.jsx)(UNSAFE_OverflowTabBar_1.OverflowTabBar, { items: data, onSelect: handleSelect, truncation: truncation, ...overflowTabBarProps }));
    }
});
