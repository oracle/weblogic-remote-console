/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
export type ToggleIcon = {
    type?: 'class';
    class: string;
} | {
    type: 'img';
    src: string;
};
/**
 * @ojmetadata description "ToggleItem "
 * @ojmetadata displayName "ToggleItem"
 * @ojmetadata help "#toggleitem"
 */
export type ToggleItem = {
    /**
     * @ojmetadata description "The toggle item label."
     */
    label: string;
    /**
     * @ojmetadata description "The toggle item value."
     */
    value: string;
    /**
     * @ojmetadata description "Specifies if the toggle item is disabled (enabled by default)."
     */
    disabled?: boolean;
    /**
     * @ojmetadata description "Optional icon to render at the start of the toggle item."
     */
    startIcon?: ToggleIcon;
    /**
     * @ojmetadata description "Optional icon to render at the end of the toggle item."
     */
    endIcon?: ToggleIcon;
};
