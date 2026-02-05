import { ReorderableItemProps } from '../UNSAFE_Collection/Reorderable.types';
export declare const ITEM_SELECTOR = "[role=\"tab\"]";
type ReorderableTabBarItem<K extends string | number> = ReorderableItemProps<K> & {
    layout: 'stretch' | 'condense' | undefined;
};
/**
 * A private item that will be used by ReorderableTabBar, location TBD (could be moved to PRIVATE_TabBar)
 */
export declare function ReorderableTabBarItem<K extends string | number>({ children, dragKey, setDragKey, onReorder, layout, rootRef }: ReorderableTabBarItem<K>): import("preact").JSX.Element;
export {};
