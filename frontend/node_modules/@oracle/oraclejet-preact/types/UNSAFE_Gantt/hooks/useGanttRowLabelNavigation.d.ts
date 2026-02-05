import type { GanttCurrentRowLabel, GanttRowData, GanttTaskData } from '../gantt.types';
import type { getRowDataLayout } from '../utils/dataLayoutUtils';
type UseGanttRowLabelNavigationOptions<K1, K2, D1 extends GanttRowData<K1, D1, D2>, D2 extends GanttTaskData<K2>> = {
    rowDataLayout: ReturnType<typeof getRowDataLayout<K1, K2, D1, D2>>;
    currentRowLabel: GanttCurrentRowLabel<K1>['currentRowLabel'];
    onCurrentRowLabelChange: GanttCurrentRowLabel<K1>['onCurrentRowLabelChange'];
    isDisabled?: boolean;
};
/**
 * Hook that handles row labels keyboard navigation.
 */
declare const useGanttRowLabelNavigation: <K1, K2, D1 extends GanttRowData<K1, D1, D2>, D2 extends GanttTaskData<K2>>({ rowDataLayout, currentRowLabel, onCurrentRowLabelChange, isDisabled }: UseGanttRowLabelNavigationOptions<K1, K2, D1, D2>) => {
    onKeyDown?: undefined;
} | {
    onKeyDown: (event: KeyboardEvent) => void;
};
export { useGanttRowLabelNavigation };
