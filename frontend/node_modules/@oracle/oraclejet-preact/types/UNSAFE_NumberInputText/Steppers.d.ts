/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
export type Props = {
    /**
     *The children are StepButtons.
     */
    children: ComponentChildren;
};
export declare function Steppers({ children }: Props): import("preact").JSX.Element;
