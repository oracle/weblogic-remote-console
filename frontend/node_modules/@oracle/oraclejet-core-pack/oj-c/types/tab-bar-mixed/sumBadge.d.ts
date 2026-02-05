interface BadgeItem {
    badge?: unknown;
    itemKey: string | number;
}
/**
 * Returns a numerical total of numerical badge values extracted from
 * a collection of objects.
 *
 * @param tabs
 * @returns
 */
export declare function sumBadge(items: BadgeItem[]): number;
export {};
