import type { getEffectTaskObjs } from './utils/dataLayoutUtils';
type Props<K2, D2> = {
    width: number;
    height: number;
    layoutObjs: ReturnType<typeof getEffectTaskObjs<K2, D2>>;
};
export declare function GanttTaskEffectsLayer<K2, D2>({ width, height, layoutObjs: { selectedTaskObjs, hoveredTaskObj, focusedTaskObj } }: Props<K2, D2>): import("preact").JSX.Element;
export {};
