/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentProps } from 'preact';
import { ProgressiveLoader } from './ProgressiveLoader';
import { VisSkeleton } from './VisSkeleton';
type Props = Omit<ComponentProps<typeof ProgressiveLoader>, 'fallback' | 'tabIndex'> & {
    /**
     * The visualization type.
     * This is used to determine the loading indicator to be used.
     */
    type: ComponentProps<typeof VisSkeleton>['type'];
};
/**
 * Displays the specified fallback content during progressive loading of the visualization.
 */
export declare function VisProgressiveLoader({ type, role, children, ...props }: Props): import("preact").JSX.Element;
export {};
