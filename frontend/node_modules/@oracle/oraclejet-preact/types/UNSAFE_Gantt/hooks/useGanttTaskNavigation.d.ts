import type { GanttCurrentTask, GanttRowData, GanttTaskData } from '../gantt.types';
import type { getRowDataLayout } from '../utils/dataLayoutUtils';
type UseGanttTaskNavigationOptions<K1, K2, D1 extends GanttRowData<K1, D1, D2>, D2 extends GanttTaskData<K2>> = {
    rowDataLayout: ReturnType<typeof getRowDataLayout<K1, K2, D1, D2>>;
    currentTask: GanttCurrentTask<K2>['currentTask'];
    onCurrentTaskChange: GanttCurrentTask<K2>['onCurrentTaskChange'];
    isRTL: boolean;
    isDisabled?: boolean;
};
/**
 * Hook that handles row labels keyboard navigation.
 */
declare const useGanttTaskNavigation: <K1, K2, D1 extends GanttRowData<K1, D1, D2>, D2 extends GanttTaskData<K2>>({ rowDataLayout, currentTask, onCurrentTaskChange, isRTL, isDisabled }: UseGanttTaskNavigationOptions<K1, K2, D1, D2>) => {
    onKeyDown?: undefined;
} | {
    onKeyDown: (event: KeyboardEvent) => void;
};
export { useGanttTaskNavigation };
