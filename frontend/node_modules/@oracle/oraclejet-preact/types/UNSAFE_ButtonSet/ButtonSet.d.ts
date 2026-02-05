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
type WidthProps = Pick<DimensionProps, 'width'>;
export type ButtonSetProps = WidthProps & TestIdProps & {
    /**
     * The children are an array of buttonsetitems
     */
    children?: ComponentChildren;
    /**
     * aria-label - label for accessibility
     */
    'aria-label'?: string;
    /**
     * aria-labelledby - label for accessibility
     */
    'aria-labelledby'?: string;
    /**
     * aria-controls - specifies what this buttonset control controls.
     */
    'aria-controls'?: string;
    /**
     * The ID of an element (or space separated IDs of multiple elements) that
     * describes the buttonsetsingle.
     */
    'aria-describedby'?: string;
};
/**
 * ButtonSet allow users to select the state of one or more related options.
 */
export declare const ButtonSet: import("preact").FunctionalComponent<import("preact/compat").PropsWithoutRef<ButtonSetProps> & {
    ref?: Ref<HTMLSpanElement> | undefined;
}>;
export {};
