/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
type InsetProps = {
    children: ComponentChildren;
    /**
     * Inset variants for each existing use case.
     */
    variant?: 'listview' | 'toolbar';
};
export declare function Inset({ children, variant }: InsetProps): import("preact").JSX.Element;
export {};
