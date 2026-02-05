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
    exports.LEGENDMAXSIZE = exports.LegendDefaults = void 0;
    exports.getLegendData = getLegendData;
    exports.getBLACCategoriesItems = getBLACCategoriesItems;
    exports.shouldRenderLegend = shouldRenderLegend;
    exports.getLegendPosition = getLegendPosition;
    exports.getLegendGap = getLegendGap;
    exports.getPreactChartDimensions = getPreactChartDimensions;
    exports.LegendDefaults = {
        rendered: 'off',
        position: 'auto'
    };
    exports.LEGENDMAXSIZE = 0.3; // 30% of the chart width or height
    /**
     * Returns the legend data for the chart.
     */
    function getLegendData(series) {
        return series.map((chartSeries) => {
            return {
                markerColor: chartSeries.color || chartSeries.areaColor,
                markerShape: chartSeries.markerShape != 'auto' ? chartSeries.markerShape : 'square',
                text: chartSeries.name || chartSeries.id,
                id: chartSeries.id
            };
        });
    }
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
    function getBLACCategoriesItems(series, groups, getDataItem, hoverBehavior, hideAndShowBehavior) {
        const categoriesItem = [];
        if (hoverBehavior === 'none' && hideAndShowBehavior === 'none') {
            return categoriesItem;
        }
        series.forEach((serie, seriesIndex) => {
            groups.forEach((_, groupIndex) => {
                const data = getDataItem(seriesIndex, groupIndex);
                categoriesItem.push({
                    id: data.id,
                    categories: data.categories || serie['categories'] || [serie['id']]
                });
            });
            categoriesItem.push({
                id: serie['id'],
                categories: serie['categories'] || [serie['id']]
            });
        });
        return categoriesItem;
    }
    function shouldRenderLegend(numSeries, rendered) {
        if (rendered === 'on') {
            return true;
        }
        else if (rendered === 'off' || numSeries === 0) {
            return false;
        }
        else {
            // auto
            return numSeries < 100;
        }
    }
    function getLegendPosition(legendPos, chartWidth, chartHeight) {
        return legendPos !== 'auto' ? legendPos : chartWidth > chartHeight ? 'end' : 'bottom';
    }
    function getLegendGap(_width, _height) {
        // legacy legend gap values
        // These values are used to calculate the legend gap based on the chart width and height.
        const legendGapHeight = 10;
        const legendGapWidth = 15;
        const width = Math.ceil(legendGapWidth * Math.min(_width / 400, 1));
        const height = Math.ceil(legendGapHeight * Math.min(_height / 300, 1));
        return {
            width,
            height
        };
    }
    function getPreactChartDimensions(_width, _height, legendPosition, legendPreferredSize) {
        const legendGap = getLegendGap(_width, _height);
        const width = legendPreferredSize
            ? legendPosition === 'start' || legendPosition === 'end'
                ? `${_width - legendPreferredSize.width - legendGap.width}px`
                : `${_width}px`
            : undefined;
        const height = legendPreferredSize
            ? legendPosition === 'top' || legendPosition === 'bottom'
                ? `${_height - legendPreferredSize.height - legendGap.height}px`
                : `${_height}px`
            : undefined;
        return { width: width, height: height };
    }
});
