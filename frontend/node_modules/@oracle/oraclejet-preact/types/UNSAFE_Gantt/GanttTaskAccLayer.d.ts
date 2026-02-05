import type { GanttRowData, GanttTaskData } from './gantt.types';
import type { GanttViewportTaskLayoutObj, ViewportLayout } from './utils/dataLayoutUtils';
type Props<K1, K2, D1 extends GanttRowData<K1, D1, D2>, D2 extends GanttTaskData<K2>> = {
    width: number;
    height: number;
    rowData: ViewportLayout<K1, K2, D1, D2>['rowData'];
    dateFormatter: (date: string) => string;
    ariaActiveId?: string;
    ariaActiveTaskObj?: GanttViewportTaskLayoutObj<K2>;
    layoutObjs: ViewportLayout<K1, K2, D1, D2>['rowObjs'];
};
export declare function GanttTaskAccLayer<K1, K2, D1 extends GanttRowData<K1, D1, D2>, D2 extends GanttTaskData<K2>>({ width, height, rowData, dateFormatter, ariaActiveId, ariaActiveTaskObj, layoutObjs }: Props<K1, K2, D1, D2>): import("preact").JSX.Element;
export {};
