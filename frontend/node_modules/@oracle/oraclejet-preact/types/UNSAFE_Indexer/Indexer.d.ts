import { Section } from './IndexerItems';
import { TestIdProps } from '../hooks/UNSAFE_useTestId';
export type CommitDetail<K> = {
    value: K;
};
type Props<K> = {
    /**
     * An array of sections, the default sections is an
     * array of 26 English alphabets and the # others character
     */
    sections?: Section<K>[];
    /**
     * The currently selected Section
     */
    value?: K;
    /**
     * A function that will be invoked when selection happens,
     * no matter the Section was selected before or not.
     */
    onCommit?: (detail: CommitDetail<K>) => void;
};
/**
 * Pure Preact based component that consumes Collection component
 * and renders an indexer.
 */
export declare function Indexer<K extends string | number>({ sections, value, onCommit, testId }: Props<K> & TestIdProps): import("preact").JSX.Element;
export {};
