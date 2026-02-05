/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { TemplateSlot } from 'ojs/ojvcomponent';
import ArrayDataProvider = require('ojs/ojarraydataprovider');
export type ChartItemTemplateContext<K, D> = {
    /**
     * @description
     * The data object of the current item.
     */
    data: D;
    /**
     * @description
     * The key of the current item.
     */
    key: K;
    /**
     * @description
     * The zero-based index of the current item.
     */
    index: number;
};
export type ChartSeriesTemplateContext<K, D> = {
    /**
     * @description
     * The array of objects which are chart items that belong to this series. The objects will have the following properties
     */
    items: ChartItemTemplateContext<K, D>[];
    /**
     * @description
     * The series id
     */
    id: string;
    /**
     * @description
     * The series index
     */
    index: number;
};
export type ChartGroupTemplateContext<K, D> = {
    /**
     * @description
     * The array of objects which are chart items that belong to this series. The objects will have the following properties
     */
    items: ChartItemTemplateContext<K, D>[];
    /**
     * @description
     * The key of the current item.
     */
    ids: string[];
    /**
     * @description
     * The group index
     */
    index: number;
    /**
     * @description
     * The depth of the group. The depth of the outermost group under the invisible root is 1.
     */
    depth: number;
};
/**
 * Hook that returns the processed sectional legend data.
 * TODO: JET-59089 replace with proper useTreeDataProvider
 * @returns
 */
export declare function useChartData<K, D>(dataProvider: ArrayDataProvider<K, D>, addBusyState: (description: string) => () => void, itemTemplate?: TemplateSlot<ChartItemTemplateContext<K, D>>, seriesTemplate?: TemplateSlot<ChartSeriesTemplateContext<K, D>>, groupTemplate?: TemplateSlot<ChartGroupTemplateContext<K, D>>, itemElementName?: string, seriesElementName?: string, groupElementName?: string, seriesComparator?: (context1: ChartSeriesTemplateContext<K, D>, context2: ChartSeriesTemplateContext<K, D>) => number, groupComparator?: (context1: ChartGroupTemplateContext<K, D>, context2: ChartGroupTemplateContext<K, D>) => number): {
    series: Record<string, any>[] | {
        lineColor: any;
        areaColor: any;
        accessibleLabel: any;
        drilling: any;
        lineStyle: any;
        lineType: any;
        lineWidth: any;
        markerShape: any;
        markerColor: any;
        markerDisplayed: any;
        markerSize: any;
        id: any;
        name: any;
        items: any;
        associatedYAxis: string;
    }[];
    groups: (Record<string, any> | {
        drilling: any;
        name: any;
        id: any;
        accessibleLabel: any;
    })[];
    getDataItem: (seriesIndex: number, groupIndex: number) => any;
    isLoading: boolean;
    idToDPItemMap: Map<K, D>;
    createGroupContext: (groupSymbol: symbol, groupIds: string[], index: number) => ChartGroupTemplateContext<K, D>;
};
