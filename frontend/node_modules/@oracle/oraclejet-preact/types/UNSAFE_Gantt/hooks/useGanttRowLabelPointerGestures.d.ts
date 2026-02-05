/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { GanttRowLabelHover } from '../gantt.types';
import { GanttRowLayoutObj } from '../utils/dataLayoutUtils';
type UseRowLabelPointerGestureOptions<K1, K2> = {
    rowObjs: GanttRowLayoutObj<K1, K2>[];
    hoverProps: GanttRowLabelHover<K1>;
};
/**
 * Hook that handles row labels pointer gestures.
 */
declare const useGanttRowLabelPointerGestures: <K1, K2>({ rowObjs, hoverProps }: UseRowLabelPointerGestureOptions<K1, K2>) => {
    onPointerMove: (event: PointerEvent) => void;
};
export { useGanttRowLabelPointerGestures };
