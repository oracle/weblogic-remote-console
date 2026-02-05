/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { BarChartProps, BarItemData } from './barChart.types';
/**
 * A Bar chart displays information graphically using rectangular bars with heights or lengths proportional to the values that they represent,
 * making relationships among the data easier to understand.
 */
export declare function BarChart<K extends string | number, D extends BarItemData<K>>({ width, height, selectedIds, hiddenIds, highlightedIds, hideAndShowBehavior, orientation, yAxis, series, groups, isStacked, getDataItem, selectionMode, drilling, dataItemGaps, ...props }: BarChartProps<K, D>): import("preact").JSX.Element;
