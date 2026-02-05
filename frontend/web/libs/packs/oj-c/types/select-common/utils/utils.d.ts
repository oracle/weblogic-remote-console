import { DataProvider, TextFilter } from 'ojs/ojdataprovider';
export type Optional<T> = T | null | undefined;
export type MaybeMap<K, T> = Optional<T> | Map<K, T>;
export type MaybeSet<T> = Optional<T> | Set<T>;
type MaybeArray<T> = Optional<T | T[]>;
export declare const DEFAULT_ITEM_CONTEXT: null;
export declare const DEFAULT_VALUE: null;
export declare const DEFAULT_VALUE_ITEM: null;
export declare const DEFAULT_VALUE_ITEMS: null;
/**
 * Checks if the provided value is empty
 *
 * @param value A single value or an array containing values
 * @returns result of the empty check
 */
export declare function isEmpty<K, T>(value: MaybeArray<K> | MaybeMap<K, T> | MaybeSet<K>): boolean;
/**
 * Checks whether the content of two sets are the same.
 *
 * @param a First Set
 * @param b Second Set
 * @returns Equality result
 */
export declare function isSetEqual<K>(a: Set<K>, b: Set<K>): boolean;
/**
 * Get the filter criterion to use for fetching data.
 * @param dataProvider The DataProvider to fetch data from
 * @param searchText User-typed search text
 * @param paramMatchBy Array of preferred strategies for matching the search text
 * @returns Filter criterion to use for fetching data
 */
export declare function getFilterCriterion<K, D>(dataProvider?: DataProvider<K, D> | null, searchText?: string, paramMatchBy?: Array<TextFilter<D>['matchBy']> | null): import("ojs/ojdataprovider").AttributeFilter<any> | import("ojs/ojdataprovider").AttributeExprFilter<any> | import("ojs/ojdataprovider").ExtendedCompoundFilter<any> | import("ojs/ojdataprovider").NestedFilter<any> | TextFilter<any> | undefined;
export {};
