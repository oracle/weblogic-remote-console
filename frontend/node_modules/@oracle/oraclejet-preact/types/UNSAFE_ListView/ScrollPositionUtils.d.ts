/**
 * Type for scroll position in ListView
 */
export type ListViewScrollPosition<K> = {
    offsetY?: number;
    key?: K;
    y?: number;
};
export declare function getScrollPosition<K>(root: HTMLDivElement, newScrollTop?: number): ListViewScrollPosition<K>;
/**
 * Helper to set the scroll position on the ListView.
 */
export declare function setScrollPosition<K>(root: HTMLDivElement, scrollPosition?: ListViewScrollPosition<K>): void;
