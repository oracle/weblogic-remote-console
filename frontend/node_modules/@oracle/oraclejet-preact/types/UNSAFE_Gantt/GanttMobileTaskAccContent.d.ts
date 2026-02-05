import type { ViewportLayout } from './utils/dataLayoutUtils';
import type { GanttRowData, GanttTaskData } from './gantt.types';
type Props<K1, K2, D1 extends GanttRowData<K1, D1, D2>, D2 extends GanttTaskData<K2>> = {
    width: number;
    height: number;
    rowData: ViewportLayout<K1, K2, D1, D2>['rowData'];
    dateFormatter: (date: string) => string;
    layoutObjs: ViewportLayout<K1, K2, D1, D2>['rowObjs'];
};
export declare function GanttMobileTaskAccContent<K1, K2, D1 extends GanttRowData<K1, D1, D2>, D2 extends GanttTaskData<K2>>({ width, height, rowData, dateFormatter, layoutObjs }: Props<K1, K2, D1, D2>): import("preact").JSX.Element;
export {};
