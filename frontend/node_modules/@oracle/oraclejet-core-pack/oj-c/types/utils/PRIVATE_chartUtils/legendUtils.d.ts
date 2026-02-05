/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
export type CategoriesItem = {
    id: string | number;
    categories: string[];
};
export declare const LegendDefaults: {
    rendered: "off";
    position: "auto";
};
export declare const LEGENDMAXSIZE = 0.3;
/**
 * Returns the legend data for the chart.
 */
export declare function getLegendData(series: any): any;
/**
 * Returns the categories data to use by the useVisCategories hook. Hover categories data
 * and
 * @param series
 * @param groups
 * @param getDataItem
 * @param hoverBehavior
 * @param hideAndShowBehavior
 * @returns
 */
export declare function getBLACCategoriesItems(series: any, groups: any, getDataItem: (seriesIndex: number, groupIndex: number) => any, hoverBehavior: 'dim' | 'none', hideAndShowBehavior: 'withRescale' | 'withoutRescale' | 'none'): CategoriesItem[];
export declare function shouldRenderLegend(numSeries: number, rendered: 'on' | 'off' | 'auto'): boolean;
export declare function getLegendPosition(legendPos: 'auto' | 'end' | 'bottom' | 'start' | 'top', chartWidth: number, chartHeight: number): "end" | "start" | "top" | "bottom";
export declare function getLegendGap(_width: number, _height: number): {
    width: number;
    height: number;
};
export declare function getPreactChartDimensions(_width: number, _height: number, legendPosition: 'start' | 'end' | 'top' | 'bottom', legendPreferredSize?: {
    width: number;
    height: number;
}): {
    width?: `${number}px`;
    height?: `${number}px`;
};
