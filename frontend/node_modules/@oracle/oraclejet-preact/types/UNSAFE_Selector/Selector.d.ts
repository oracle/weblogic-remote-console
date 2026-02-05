import { Keys } from '../utils/UNSAFE_keys';
import { SelectionDetail } from '../UNSAFE_Collection';
import { TestIdProps } from '../hooks/UNSAFE_useTestId';
/**
 * Props for the Selector Component
 */
export type Props<K> = {
    /**
     * The key associated with the Selector.
     */
    rowKey: K;
    /**
     * The selected keys.
     */
    selectedKeys: Keys<K>;
    /**
     * aria-label for this selector
     */
    'aria-label'?: string;
    /**
     * Determine whether to show the visual partial icon when selector is checked. If the
     * selector is checked and isPartial is set to true, the selector would show a partially
     * checked icon.
     */
    isPartial?: boolean;
    /**
     * Specifies the selection mode. For selection mode 'all', please refer to SelectorAll component.
     */
    selectionMode?: 'multiple' | 'single';
    /**
     * Callback function to invoke when the selected keys has changed when
     * the checkbox is toggled.
     */
    onChange?: (detail: SelectionDetail<K>) => void;
    /**
     * One or more ids (separated by spaces) of elements that label the selected item. This will be used for the aria-labelledby of the DOM element.
     */
    'aria-labelledby'?: string;
};
/**
 * The Selector component renders checkboxes in collections to support selection.
 */
export declare function Selector<K>({ 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, rowKey, selectedKeys, isPartial, selectionMode, onChange, testId }: Props<K> & TestIdProps): import("preact").JSX.Element;
