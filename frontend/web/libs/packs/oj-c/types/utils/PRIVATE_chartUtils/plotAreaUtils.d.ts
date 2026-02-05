/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import type { MajorTick as PreactMajorTick, MinorTick as PreactMinorTick, ChartPlotArea as PreactChartPlotArea } from '@oracle/oraclejet-preact/utils/UNSAFE_visTypes/chart';
import { PlotArea } from '../UNSAFE_vizTypes/chartTypes';
type MajorTick = Omit<PreactMajorTick, 'isRendered'> & {
    rendered?: 'on' | 'off' | 'auto';
};
type MinorTick = Omit<PreactMinorTick, 'isRendered'> & {
    rendered?: 'on' | 'off' | 'auto';
};
export declare function getPlotArea(plotArea?: PlotArea, yMajorTick?: MajorTick, yMinorTick?: MinorTick, xMajorTick?: MajorTick, y2MajorTick?: MajorTick, y2MinorTick?: MinorTick): PreactChartPlotArea;
export {};
