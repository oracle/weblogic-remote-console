/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { Group, GroupDetail } from '@oracle/oraclejet-preact/utils/UNSAFE_visTypes/chart';
import { ChartGroupTemplateContext } from 'oj-c/hooks/UNSAFE_useChartData/useChartData';
/**
 * Returns the id fo the item from events detail
 * @param detail
 * @param getDataItem
 * @returns
 */
export declare function getIdFromDetail(detail: {
    seriesIndex?: number;
    groupIndex?: number;
}, series: Record<string, any>[], getDataItem: (seriesIndex: number, groupIndex: number) => any): any;
export declare const getChartEventsHandler: <K, D>(series: Record<string, any>[], groups: Group[], drilling: "on" | "groupsOnly" | "seriesOnly" | "off", onOjItemDrill?: (detail: any) => void, onOjGroupDrill?: (detail: any) => void, onOjSeriesDrill?: (detail: any) => void, createGroupContext?: (groupSymbol: symbol, groupIds: string[], index: number) => ChartGroupTemplateContext<K, D>) => {
    itemDrillHandler: (detail: any) => void;
    groupDrillHandler: (detail: GroupDetail) => void;
    seriesDrillHandler: (detail: any) => void;
};
