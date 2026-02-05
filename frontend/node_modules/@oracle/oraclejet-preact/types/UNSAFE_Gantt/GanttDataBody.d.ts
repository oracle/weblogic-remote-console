import type { getEffectTaskObjs, ViewportLayout } from './utils/dataLayoutUtils';
import type { GanttRowData, GanttTaskData } from './gantt.types';
type Props<K1, K2, D1 extends GanttRowData<K1, D1, D2>, D2 extends GanttTaskData<K2>> = {
    width: number;
    height: number;
    minorAxisLayout: {
        minorGridTicksPos: number[];
        majorGridTicksPos?: number[];
    };
    viewportLayout: ViewportLayout<K1, K2, D1, D2>;
    effectsLayout: ReturnType<typeof getEffectTaskObjs<K2, D2>>;
    dateFormatter: (date: string) => string;
    ariaActiveTask?: {
        dataId: K2;
        ariaId: string;
    };
};
export declare function GanttDataBody<K1, K2, D1 extends GanttRowData<K1, D1, D2>, D2 extends GanttTaskData<K2>>({ width, height, minorAxisLayout: { minorGridTicksPos, majorGridTicksPos }, viewportLayout: { gridlines, rowData, rowObjs, taskLabelObjs, horizontalGridlinesPos, idTaskObjMap }, effectsLayout, dateFormatter, ariaActiveTask }: Props<K1, K2, D1, D2>): import("preact").JSX.Element;
export {};
