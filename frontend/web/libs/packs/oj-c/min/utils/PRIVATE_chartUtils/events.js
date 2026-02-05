/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getChartEventsHandler = void 0;
    exports.getIdFromDetail = getIdFromDetail;
    const getItemDrillDetail = (series, groups, detail) => {
        const data = series[detail.seriesIndex];
        const group = [];
        const groupData = [];
        const isHierarchical = groups.some((g) => g.groups && g.groups.length > 0);
        let currentGroup;
        detail.groupPath.forEach((value) => {
            currentGroup = groups[value];
            group.push(currentGroup.id);
            groupData.push(currentGroup);
        });
        const itemData = series[detail.seriesIndex]['items'];
        const seriesId = series[detail.seriesIndex]['id'];
        const seriesData = series[detail.seriesIndex];
        const itemObj = {
            data,
            group: isHierarchical ? group : group[0],
            groupData,
            id: detail.id,
            itemData,
            seriesId,
            seriesData
        };
        return itemObj;
    };
    const getGroupDrillDetail = (groups, detail, createGroupContext) => {
        const group = [];
        const groupData = [];
        const isHierarchical = groups.some((g) => g.groups && g.groups.length > 0);
        let currentGroup;
        detail.groupPath.forEach((value) => {
            currentGroup = groups[value];
            group.push(currentGroup.id);
            groupData.push(currentGroup);
        });
        // @ts-ignore
        const items = createGroupContext?.(detail.group.symbol, group, detail.groupIndex).items;
        const groupObj = { group: isHierarchical ? group : group[0], groupData, id: detail.id, items };
        return groupObj;
    };
    const getSeriesDrillDetail = (series, detail) => {
        const { itemIndex } = detail;
        return {
            id: series[itemIndex]['id'],
            items: series[itemIndex]['items'],
            series: series[itemIndex]['id'],
            seriesData: series
        };
    };
    /**
     * Returns the id fo the item from events detail
     * @param detail
     * @param getDataItem
     * @returns
     */
    function getIdFromDetail(detail, series, getDataItem) {
        const { seriesIndex, groupIndex } = detail;
        if (seriesIndex === undefined) {
            return;
        }
        if (groupIndex === undefined) {
            return series[seriesIndex]['id'];
        }
        return getDataItem(seriesIndex, groupIndex).id;
    }
    const getChartEventsHandler = (series, groups, drilling, onOjItemDrill, onOjGroupDrill, onOjSeriesDrill, createGroupContext) => {
        const itemDrillHandler = (detail) => {
            if (drilling === 'on') {
                onOjItemDrill?.(getItemDrillDetail(series, groups, detail));
            }
        };
        const groupDrillHandler = (detail) => {
            if (drilling === 'on' || drilling === 'groupsOnly') {
                onOjGroupDrill?.(getGroupDrillDetail(groups, detail, createGroupContext));
            }
        };
        const seriesDrillHandler = (detail) => {
            if (drilling === 'seriesOnly' || drilling === 'on') {
                onOjSeriesDrill?.(getSeriesDrillDetail(series, detail));
            }
        };
        return {
            itemDrillHandler,
            groupDrillHandler,
            seriesDrillHandler
        };
    };
    exports.getChartEventsHandler = getChartEventsHandler;
});
