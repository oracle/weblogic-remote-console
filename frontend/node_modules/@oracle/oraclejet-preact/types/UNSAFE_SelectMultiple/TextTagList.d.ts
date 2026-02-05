/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Ref } from 'preact';
import { DimensionProps } from '../utils/UNSAFE_interpolations/dimensions';
/**
 * Data structure of the text tag item
 */
type TextTagItem<V> = {
    label: string;
    value: V;
};
/**
 * Type of the ref handle of the component
 */
type TextTagListHandle = {
    /**
     * Focuses the text tag container
     */
    focus: () => void;
    /**
     * Blurs the text tag container
     */
    blur: () => void;
};
/**
 * Supported style props
 */
declare const supportedDimensions: readonly ["maxWidth"];
type SupportedDimensions = (typeof supportedDimensions)[number];
type StyleProps = Pick<DimensionProps, SupportedDimensions>;
/**
 * Props for the TextTag component
 */
type Props<V> = StyleProps & {
    /**
     * Specifies accessible screen reader text.
     */
    'aria-label'?: string;
    /**
     * An array of objects which is used to stamp out the TextTag components
     */
    data: TextTagItem<V>[];
    /**
     * Flag to indicate if the label is inside the container
     * TODO: Handle this in a more generic way if/when we make this component generic
     */
    hasInsideLabel?: boolean;
    /**
     * Specifies whether to show the remove icon in the TextTag components
     */
    removeIcon?: 'always' | 'never';
    /**
     * A callback function to be invoked when the component wants to exit the navigation.
     * This happens when one presses Right arrow after reaching the end of the list (or Left
     * arrow in RTL mode).
     */
    onExitNavigation?: () => void;
    /**
     * A callback function to be invoked when one or more text tags are removed
     */
    onRemove?: (items: V[]) => void;
};
export declare const TextTagList: import("preact").FunctionalComponent<import("preact/compat").PropsWithoutRef<Props<any>> & {
    ref?: Ref<TextTagListHandle> | undefined;
}>;
export {};
