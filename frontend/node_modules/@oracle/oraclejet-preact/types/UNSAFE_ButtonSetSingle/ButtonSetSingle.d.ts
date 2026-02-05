/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren, Ref } from 'preact';
import { TestIdProps } from '../hooks/UNSAFE_useTestId';
import type { DimensionProps } from '../utils/UNSAFE_interpolations/dimensions';
import { LayoutWidths, type ButtonIntrinsicProps } from '../utils/UNSAFE_buttonUtils';
import { ValueUpdateDetail } from '../utils/UNSAFE_valueUpdateDetail';
type WidthProps = Pick<DimensionProps, 'width'>;
export type ButtonSetSingleProps = ButtonIntrinsicProps & WidthProps & TestIdProps & {
    /**
     * The children are an array of buttonSetItems
     */
    children?: ComponentChildren;
    /**
     * Value of the selected radio option.
     */
    value?: string;
    /**
     * Callback invoked each time the user changes selected option.
     */
    onCommit: (detail: ValueUpdateDetail<string>) => void;
    /**
     * Specifies that the buttonsetsingle element should be disabled.
     */
    isDisabled?: boolean;
    /**
     * Indicates in what states the buttonsetsingle has chrome (background and border).
     *     "borderless"': "Borderless buttonsetsingles are a more prominent variation. Borderless
     * buttonsetsingles are useful for supplemental actions that require minimal emphasis.",
     *     "outlined"': "Outlined buttonsetsingles are salient, but lighter weight than
     * solid buttonsetsingles. Outlined buttonsetsingles are useful for secondary actions.",
     */
    variant?: 'outlined' | 'borderless';
    /**
     * The size indicates how large the buttonsetsingle is rendered.
     */
    size?: 'sm' | 'md' | 'lg';
    /**
     * Display indicates whether only the label, icons, or all elements should be rendered by the buttonsetsingle.
     */
    display?: 'label' | 'all' | 'icons';
    /**
     * aria-label - label for accessibility
     */
    'aria-label'?: string;
    /**
     * aria-controls - specifies what this buttonset control controls.
     */
    'aria-controls'?: string;
    /**
     * The ID of an element (or space separated IDs of multiple elements) that
     * describes the buttonsetsingle.
     */
    'aria-describedby'?: string;
    /**
     * aria-labelledby - label for accessibility
     */
    'aria-labelledby'?: string;
    /**
     * The layoutWidth specifies each buttonSetItem's width.
     * Auto: The width of each Button is automatically determined to fit its contents. (flex auto)
     * Equal:  The width of the Buttonset is equally distributed to all contained Buttons. (flex 1)
     */
    layoutWidth?: LayoutWidths;
};
/**
 * ButtonSet allow users to select the state of one or more related options.
 */
export declare const ButtonSetSingle: import("preact").FunctionalComponent<import("preact/compat").PropsWithoutRef<ButtonSetSingleProps> & {
    ref?: Ref<HTMLSpanElement> | undefined;
}>;
export {};
