/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { GanttViewportTaskLayoutObj } from './utils/dataLayoutUtils';
type Props<K2> = {
    width: number;
    height: number;
    layoutObjs: GanttViewportTaskLayoutObj<K2>[];
};
export declare function GanttTaskSelectionEffectsLayer<K2>({ width, height, layoutObjs }: Props<K2>): import("preact").JSX.Element;
export {};
