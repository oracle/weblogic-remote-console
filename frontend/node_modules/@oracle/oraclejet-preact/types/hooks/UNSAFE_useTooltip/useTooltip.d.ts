/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { useTooltipControlled } from './useTooltipControlled';
import { TestIdProps } from '../UNSAFE_useTestId';
type tooltipParameters = Parameters<typeof useTooltipControlled>[0];
type Props = {
    text?: string;
    position?: tooltipParameters['position'];
    isDisabled?: boolean;
    anchor?: tooltipParameters['anchor'];
    offset?: {
        mainAxis?: number;
        crossAxis?: number;
    };
    variant?: tooltipParameters['variant'];
} & TestIdProps;
/**
 * A hook with tooltip implementation.
 * Returns event handlers that can enhance the target element with a tooltip displayed
 * on hover and focus.
 *
 * @param text tooltip text
 * @param position tooltip placement relative to the target element
 * @param isDisabled determines if the tooltip is disabled
 * @param anchor determines if the target is an element or the pointer
 * @param offset offset from the placement
 * @param variant specifies if the rendered popup should have 'tooltip' or 'datatip' look and behavior
 * @returns an object with the 'tooltipContent' and 'tooltipProps' properties.
 */
export declare const useTooltip: ({ text, position, isDisabled, anchor, offset, variant, testId }: Props) => ReturnType<typeof useTooltipControlled>;
export {};
