/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { GanttRowData, GanttTaskData } from './gantt.types';
import type { ViewportLayout } from './utils/dataLayoutUtils';
type Props<K1, K2, D1 extends GanttRowData<K1, D1, D2>, D2 extends GanttTaskData<K2>> = {
    width: number;
    height: number;
    layoutObjs: ViewportLayout<K1, K2, D1, D2>['rowObjs'];
};
export declare function GanttRowBackgroundsLayer<K1, K2, D1 extends GanttRowData<K1, D1, D2>, D2 extends GanttTaskData<K2>>({ width, height, layoutObjs }: Props<K1, K2, D1, D2>): import("preact").JSX.Element | null;
export {};
