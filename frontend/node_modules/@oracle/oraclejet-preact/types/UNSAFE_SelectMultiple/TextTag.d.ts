/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Props for the TextTag component
 */
type Props<V> = {
    /**
     * The label for the text tag
     */
    children: string;
    /**
     * Specifies whether to show the remove icon
     */
    removeIcon?: 'always' | 'never';
    /**
     * Indicates whether the component is focused
     */
    isFocused?: boolean;
    /**
     * Specifies if the TextTag component is selected
     */
    isSelected?: boolean;
    /**
     * Callback to be invoked when Delete/Backspace is pressed
     */
    onRemoveAction?: (value: V) => void;
    /**
     * Callback to be invoked when clicking on the text tag
     */
    onSelect?: (value: V) => void;
    /**
     * Callback to be invoked when the remove icon is clicked
     */
    onRemoveIconClick?: (value: V) => void;
    /**
     * The value of the text tag
     */
    value: V;
};
/**
 * The component for rendering selectable/removable TextTag
 *
 * @param param0 The props for the TextTag component
 */
export declare function TextTag<V>({ children, removeIcon, isSelected, onRemoveAction, onSelect, onRemoveIconClick, isFocused, value }: Props<V>): import("preact").JSX.Element;
export {};
