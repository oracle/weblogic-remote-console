/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
import { TestIdProps } from '../hooks/UNSAFE_useTestId';
export type ButtonSetItemProps = TestIdProps & {
    /**
     * Value of the selected buttonSetItem option.
     */
    value: string;
    /**
     * label - label
     */
    label?: string;
    /**
     * The startIcon is the button's start icon.
     */
    startIcon?: ComponentChildren;
    /**
     * The endIcon is the button's end icon.
     */
    endIcon?: ComponentChildren;
    /**
     * Specifies that the ButtonSetSingle element should be disabled.
     */
    isDisabled?: boolean;
};
/**
 * A ButtonSetItem specifies buttons for a buttonset.
 */
export declare const ButtonSetItem: {
    ({ isDisabled: isPropsDisabled, ...props }: ButtonSetItemProps): import("preact").JSX.Element;
    displayName: string;
};
