/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
type Props = {
    /**
     * The children to put in the grid.
     */
    children: ComponentChildren;
    /**
     * aria-label for this EmptyList
     */
    'aria-label'?: string;
    /**
     * One or more ids (separated by spaces) of elements that label the empty list. This will be used for the aria-labelledby of the DOM element.
     */
    'aria-labelledby'?: string;
};
/**
 * An empty list.
 */
export declare const EmptyList: ({ "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, children }: Props) => import("preact").JSX.Element;
export {};
