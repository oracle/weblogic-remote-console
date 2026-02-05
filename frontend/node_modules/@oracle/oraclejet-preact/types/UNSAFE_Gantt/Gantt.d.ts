import type { GanttProps, GanttRowData, GanttTaskData } from './gantt.types';
/**
 * A gantt displays scheduling information graphically, making it easier to plan, coordinate, and track various tasks and resources.
 */
export declare function Gantt<K1 extends string | number, D1 extends GanttRowData<K1, D1, D2>, K2 extends string | number, D2 extends GanttTaskData<K2>>({ width, height, testId, ...props }: GanttProps<K2, D1, D2>): import("preact").JSX.Element;
