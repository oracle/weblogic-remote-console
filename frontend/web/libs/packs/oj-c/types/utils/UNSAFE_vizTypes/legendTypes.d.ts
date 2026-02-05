/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Size } from '@oracle/oraclejet-preact/utils/UNSAFE_size';
/**
 * The chart legend type.
 */
export type ChartLegend = {
    /**
     * The position of the legend within the chart. By default, the legend will be placed on the side or bottom
     * of the chart.
     */
    position: 'start' | 'end' | 'bottom' | 'top' | 'auto';
    /**
     * Defines whether the legend is rendered. If set to auto, the legend will be hidden for charts with a large bunber of series.
     */
    rendered: 'on' | 'off' | 'auto';
    /**
     * The max size of the legend in pixels or in percentage.
     */
    maxSize?: Size;
    /**
     * Defines the size of legend in pixel or percent.
     */
    size?: Size;
    /**
     * The height of the legend symbol (line or marker) in pixels.
     */
    symbolHeight?: number;
    /**
     * The width of the legend symbol (line or marker) in pixels.
     */
    symbolWidth?: number;
};
