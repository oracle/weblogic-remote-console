/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { ComponentChildren } from 'preact';
import type { GanttProps, GanttRowData, GanttTaskData } from './gantt.types';
import { GanttRowLayoutObj } from './utils/dataLayoutUtils';
type Props<K1, K2, D1 extends GanttRowData<K1, D1, D2>, D2 extends GanttTaskData<K2>> = {
    rowObj: GanttRowLayoutObj<K1, K2>;
    rowData: GanttProps<K2, D1, D2>['rows'];
    isRowSelected: boolean;
    isFocused: boolean;
    isHorizontalGridlinesVisible: boolean;
    ariaActive?: {
        dataId: K1;
        ariaId: string;
        type: 'rowLabel';
    };
    children: ComponentChildren;
};
export declare function GanttRowLabelContainer<K1, K2, D1 extends GanttRowData<K1, D1, D2>, D2 extends GanttTaskData<K2>>({ rowObj, rowData, isRowSelected, isFocused, isHorizontalGridlinesVisible, ariaActive, children }: Props<K1, K2, D1, D2>): import("preact").JSX.Element;
export {};
