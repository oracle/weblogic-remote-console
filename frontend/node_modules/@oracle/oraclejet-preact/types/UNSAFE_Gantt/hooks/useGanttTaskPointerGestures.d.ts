import type { GanttCurrentTask, GanttRowData, GanttSelection as GanttSelectionProps, GanttTaskData, GanttTaskHover } from '../gantt.types';
import { type ViewportLayout } from '../utils/dataLayoutUtils';
type UseTaskPointerGestureOptions<K1, K2, D1 extends GanttRowData<K1, D1, D2>, D2 extends GanttTaskData<K2>> = {
    viewportLayout: ViewportLayout<K1, K2, D1, D2>;
    viewportYOffset: number;
    dataBodyRegion: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    viewportStartTime: number;
    viewportEndTime: number;
    width: number;
    isRTL: boolean;
    selectionProps: GanttSelectionProps<K2, D2>;
    hoverProps: GanttTaskHover<K2>;
    currentProps: GanttCurrentTask<K2>;
    onCursorChange?: (detail: {
        cursor: 'pointer' | 'pointerUnset';
    }) => void;
};
/**
 * Hook that handles task pointer gestures.
 */
declare const useGanttTaskPointerGestures: <K1, K2, D1 extends GanttRowData<K1, D1, D2>, D2 extends GanttTaskData<K2>>({ viewportLayout, viewportYOffset, dataBodyRegion, viewportStartTime, viewportEndTime, width, isRTL, selectionProps, hoverProps, currentProps, onCursorChange }: UseTaskPointerGestureOptions<K1, K2, D1, D2>) => {
    gestureProps: {};
    selectionContent: import("preact").JSX.Element | null;
};
export { useGanttTaskPointerGestures };
