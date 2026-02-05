/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
type ButtonSetItemsProps = {
    /**
     * The children are an array of buttonsetitems
     */
    children: ComponentChildren;
};
/**
 * ButtonSetItems renders the ButtonSet children
 */
export declare function ButtonSetItems({ children }: ButtonSetItemsProps): import("preact").JSX.Element;
export declare namespace ButtonSetItems {
    var displayName: string;
}
export {};
