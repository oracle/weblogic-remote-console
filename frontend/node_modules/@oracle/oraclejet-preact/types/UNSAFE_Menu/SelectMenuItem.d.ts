/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
type SelectMenuItemProps = {
    value: string;
    label: string;
    isDisabled?: boolean;
    endIcon?: ComponentChildren;
};
export declare function SelectMenuItem({ value, label, isDisabled, endIcon }: SelectMenuItemProps): import("preact").JSX.Element;
export {};
