define(["require", "exports", "./dataUtil", "../PRIVATE_useVisData/useVisData", "preact/hooks"], function (require, exports, dataUtil_1, useVisData_1, hooks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useChartData = useChartData;
    /**
     * Hook that returns the processed sectional legend data.
     * TODO: JET-59089 replace with proper useTreeDataProvider
     * @returns
     */
    function useChartData(dataProvider, addBusyState, itemTemplate, seriesTemplate, groupTemplate, itemElementName, seriesElementName, groupElementName, seriesComparator, groupComparator) {
        const { data, isLoading } = (0, useVisData_1.useVisData)({
            dataProvider,
            addBusyState
        });
        const { series, groups, createGroupContext } = (0, hooks_1.useMemo)(() => (0, dataUtil_1.createGroupsAndSeries)(data, itemTemplate, seriesTemplate, groupTemplate, itemElementName, seriesElementName, groupElementName, seriesComparator, groupComparator), [
            data,
            itemTemplate,
            seriesTemplate,
            groupTemplate,
            itemElementName,
            seriesElementName,
            groupElementName,
            seriesComparator,
            groupComparator
        ]);
        const idToDPItemMap = new Map(data.map((item) => [item.key, item.data]));
        const getDataItem = (seriesIndex, groupIndex) => {
            const seriesItems = series[seriesIndex]['items'];
            return seriesItems[groupIndex];
        };
        return { series, groups, getDataItem, isLoading, idToDPItemMap, createGroupContext };
    }
});
