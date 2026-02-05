/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { PictoChartItemData, PictoChartProps } from './pictoChart.type';
/**
 * A picto chart displays information using icons to visualize an absolute number or the relative sizes of the different parts of a population.
 */
export declare function PictoChart<K extends string | number, D extends PictoChartItemData<K> = PictoChartItemData<K>>({ width, height, ...props }: PictoChartProps<K, D>): import("preact").JSX.Element;
