import { ItemContext } from 'src/UNSAFE_Collection';
/**
 * Type of a section
 */
export type Section<K> = {
    /**
     * The key of each section
     */
    key: K;
    /**
     * The label of each section
     */
    label?: string;
    /**
     * A property that indicates whether the section
     * is disabled or not. Typically, when Indexer is
     * used with ListView, a disabled section implies
     * that there's no corresponding items in the ListView
     */
    isDisabled?: boolean;
};
/**
 * The others section variable that application could use
 * to compare value
 */
export declare const SECTION_OTHERS: Section<string>;
export declare const ITEM_SELECTOR = "[data-oj-key]";
export type SectionProps<K> = {
    context: ItemContext<Section<K>>;
    currentKey: K;
    selectedKey: K;
    valueNow: number;
    isFocusRingVisible: boolean;
};
export declare const SectionItem: import("preact").FunctionalComponent<import("preact/compat").PropsWithoutRef<SectionProps<string | number>> & {
    ref?: import("preact").Ref<HTMLLIElement> | undefined;
}>;
type LastSectionProps<K> = SectionProps<K> & {
    lastValueNow: number;
};
export declare const LastSectionItem: import("preact").FunctionalComponent<import("preact/compat").PropsWithoutRef<LastSectionProps<string | number>> & {
    ref?: import("preact").Ref<HTMLLIElement> | undefined;
}>;
type SeparatorProps<K> = SectionProps<K> & {
    sectionsPerTruncation: number;
    last: number;
    sections: Section<K>[];
};
export declare const SeparatorItem: import("preact").FunctionalComponent<import("preact/compat").PropsWithoutRef<SeparatorProps<string | number>> & {
    ref?: import("preact").Ref<HTMLLIElement> | undefined;
}>;
export declare function hasSeparator<K>(props: SeparatorProps<K>): boolean;
export {};
