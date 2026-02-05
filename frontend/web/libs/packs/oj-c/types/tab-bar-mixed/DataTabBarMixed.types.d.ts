import { TabBarMixed, TabBarMixedSeparator } from '@oracle/oraclejet-preact/UNSAFE_TabBarMixed';
import type { ComponentProps } from 'preact';
import type { DataTabBarMixedIconProps } from './DataTabBarMixedIcon';
type TabBarMixedProps = ComponentProps<typeof TabBarMixed>;
type TabBarMixedSeparatorProps = ComponentProps<typeof TabBarMixedSeparator>;
export type TabData<K extends string | number> = {
    badge?: number;
    icon?: DataTabBarMixedIconProps['icon'];
    itemKey: K;
    label: string;
    /**
     * Accepts the tabpanel element's ID associated with the tab item
     **/
    tabPanelId?: string;
};
export type DataTabBarMixedProps<K extends string | number> = {
    dynamicTabs?: TabData<K>[];
    dynamicTabsOverflowIcon?: DataTabBarMixedIconProps['icon'];
    dynamicTabsOverflow: 'conveyor' | 'popup';
    onRemove: TabBarMixedProps['onRemove'];
    onSelect: TabBarMixedProps['onSelect'];
    selection: TabBarMixedProps['selection'];
    separatorPadding?: TabBarMixedSeparatorProps['padding'];
    size: TabBarMixedProps['size'];
    staticTabs: TabData<K>[];
    staticTabsDisplay: 'standard' | 'icons';
    'aria-label'?: TabBarMixedProps['aria-label'];
    'aria-labelledby'?: TabBarMixedProps['aria-labelledby'];
};
export {};
