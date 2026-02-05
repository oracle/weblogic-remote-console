import { SelectionDetail } from '../UNSAFE_Collection';
import { TestIdProps } from '../hooks/UNSAFE_useTestId';
/**
 * Props for the SelectorAll Component
 */
export type Props<K> = {
    /**
     * The selected state of the select all selector
     */
    selected: 'none' | 'all' | 'partial' | 'partial-all';
    /**
     * Callback function to invoke when the selected keys has changed when
     * the checkbox is toggled.
     */
    onChange?: (detail: SelectionDetail<K>) => void;
    /**
     * aria-label for this selectorAll
     */
    'aria-label'?: string;
    /**
     * One or more ids (separated by spaces) of elements that label the selected item. This will be used for the aria-labelledby of the DOM element.
     */
    'aria-labelledby'?: string;
    /**
     * Specifies whether tooltip should be shown on the SelectorAll checkbox
     */
    showTooltip?: 'enabled' | 'disabled';
};
/**
 * The SelectorAll component renders checkboxes for select all case.
 */
export declare function SelectorAll<K>({ 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, selected, onChange, showTooltip, testId }: Props<K> & TestIdProps): import("preact").JSX.Element;
