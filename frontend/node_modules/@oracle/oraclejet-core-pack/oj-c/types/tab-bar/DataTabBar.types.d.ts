import type { ComponentProps } from 'preact';
import { TabBar } from '@oracle/oraclejet-preact/UNSAFE_TabBar';
import { ReorderableTabBar } from '@oracle/oraclejet-preact/UNSAFE_ReorderableTabBar';
import type { TabIconData } from './DataTabBarIcon';
type TabBarProps = ComponentProps<typeof TabBar>;
type ReorderableTabBarProps = ComponentProps<typeof ReorderableTabBar>;
type Severity = 'warning' | 'info' | 'none' | 'error' | 'confirmation';
/** The data item object that represents a tab. */
export type TabData<K extends string | number> = {
    /**
     * Key of the TabBarItem
     */
    itemKey: K;
    /**
     * Label of the TabBarItem. For icon only display this label is the content
     * for aria-label and tooltip text of the Tab.
     */
    label: string;
    /**
     * The icon before the label in non-stack case, icon above the label in
     * stacked case or the stand alone icon when no label is specified.
     */
    icon?: TabIconData;
    /**
     * The content to be rendered inside the Badge component.
     */
    badge?: number;
    /**
     * The content to be rendered inside the Text component as a metadata,
     * that appears after the label in non stack case only.
     */
    metadata?: string;
    /**
     * The status icon to be rendered after the label in non stack case only.
     */
    severity?: Severity;
    /**
     * Accepts the tabpanel element's ID associated with the tab item
     */
    tabPanelId?: string;
    /**
     * Renders a remove icon allowing the tabs to be removed.
     */
    isRemovable?: boolean;
};
/** The data item object that represents a tab with link.*/
export type TabLinkItemData<K extends string | number> = {
    /**
     * Key of the TabBarItem
     */
    itemKey: K;
    /**
     * Label of the TabBarItem. For icon only display this label is the content
     * for aria-label and tooltip text of the Tab.
     */
    label: string;
    /**
     * The icon before the label in non-stack case, icon above the label in
     * stacked case or the stand alone icon when no label is specified.
     */
    icon?: TabIconData;
    /**
     * The content to be rendered inside the Badge component.
     */
    badge?: number;
    /**
     * The content to be rendered inside the Text component as a metadata,
     * that appears after the label in non stack case only.
     */
    metadata?: string;
    /**
     * The status icon to be rendered after the label in non stack case only.
     */
    severity?: Severity;
    /**
     * Accepts the tabpanel element's ID associated with the tab item
     */
    tabPanelId?: string;
    /**
     * Sets the URL that the hyperlink points to. If there is no valid URL use "#" for href value to navigate to the top of the page.
     */
    href: string;
};
export type DataTabBarProps<K extends string | number> = {
    data: (TabData<K> | TabLinkItemData<K>)[];
    onRemove: TabBarProps['onRemove'];
    onSelect: TabBarProps['onSelect'];
    selection: TabBarProps['selection'];
    display: TabBarProps['display'];
    layout: TabBarProps['layout'];
    edge: TabBarProps['edge'];
    overflow?: 'conveyor' | 'popup' | 'hidden';
    onReorder?: ReorderableTabBarProps['onReorder'];
    reorderable?: 'enabled' | 'disabled';
    truncation?: 'none' | 'progressive';
    'aria-label'?: TabBarProps['aria-label'];
    'aria-labelledby'?: TabBarProps['aria-labelledby'];
    contextMenuConfig?: TabBarProps['contextMenuConfig'];
};
export {};
