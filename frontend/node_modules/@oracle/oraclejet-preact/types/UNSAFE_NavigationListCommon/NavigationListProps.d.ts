import { ComponentChildren } from 'preact';
/**
 * type for payload of selection change event handler
 */
type SelectionDetail<K> = {
    value: K;
    reason: 'pointer' | 'keyboard';
};
/**
 * type for payload of remove event handler
 */
type RemoveDetail<K> = {
    value: K;
};
export type NavigationListProps<K extends string | number> = {
    /**
     * A set of NavigationListItem(s) that NavigationList will hold
     */
    children: ComponentChildren;
    /**
     * Key of the selected item.
     */
    selection?: K;
    /**
     * Callback function to handle when selection has changed
     */
    onSelectionChange?: <K extends string | number>(detail: SelectionDetail<K>) => void;
    /**
     * Callback function to handle remove
     */
    onRemove?: <K extends string | number>(detail: RemoveDetail<K>) => void;
    /**
     * Specifies some screen reader text. Set it to create an accesible navigationList.
     */
    'aria-label'?: string;
    /**
     * Specifies some a relation between navigationList and other element. Based on this specifies some
     * screen reader text. Set it to create an accesible navigationList.
     */
    'aria-labelledby'?: string;
};
export {};
