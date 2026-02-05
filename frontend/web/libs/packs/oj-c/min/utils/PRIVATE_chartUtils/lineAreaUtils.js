/**
 * @license
 * Copyright (c) %FIRST_YEAR% %CURRENT_YEAR%, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["require", "exports", "@oracle/oraclejet-preact/utils/UNSAFE_visUtils"], function (require, exports, UNSAFE_visUtils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.transformItem = transformItem;
    exports.transformSeries = transformSeries;
    exports.transformGroup = transformGroup;
    exports.transformValueFormats = transformValueFormats;
    const colorRamp = (0, UNSAFE_visUtils_1.getColorRamp)();
    /**
     * Transforms the corepack area-chart item to preact area-chart item.
     */
    function transformItem(item, series) {
        return {
            markerColor: item.color || series.markerColor,
            accessibleLabel: item.shortDesc,
            value: item.value,
            label: item.label,
            id: item.id,
            drilling: item.drilling || series.drilling,
            isMarkerDisplayed: (item.markerDisplayed && item.markerDisplayed !== 'off') ||
                (series.markerDisplayed && series.markerDisplayed !== 'off'),
            markerType: (item.markerShape !== 'auto' && item.markerShape) ||
                (series.markerShape !== 'auto' && series.markerShape),
            markerSize: (item.markerSize !== undefined && item.markerSize) || series.markerSize
        };
    }
    function transformSeries(series, seriesIndex) {
        return {
            lineColor: series.color || colorRamp[seriesIndex % colorRamp.length],
            areaColor: series.areaColor || series.color || colorRamp[seriesIndex % colorRamp.length], // TODO: this will need to consider chart type
            accessibleLabel: series.shortDesc,
            drilling: series.drilling,
            lineStyle: series.lineStyle,
            lineType: series.lineType,
            lineWidth: series.lineWidth,
            markerShape: series.markerShape,
            markerColor: series.markerColor || colorRamp[seriesIndex % colorRamp.length],
            markerDisplayed: series.markerDisplayed,
            markerSize: series.markerSize,
            id: series.id,
            name: series.name,
            items: series.items,
            associatedYAxis: series.assignedToY2 === 'on' ? 'y2' : 'y'
        };
    }
    function transformGroup(group) {
        return {
            drilling: group.drilling,
            name: group.name,
            id: group.id,
            accessibleLabel: group.shortDesc
        };
    }
    /**
     * Transforms the corepack area-chart item to preact area-chart item.
     */
    function transformValueFormats(valueFormats) {
        if (!valueFormats)
            return;
        const formats = {};
        if (valueFormats.value) {
            formats.value = {
                isDisplayed: valueFormats.value?.tooltipDisplay !== 'off',
                label: valueFormats.value?.tooltipLabel,
                format: valueFormats.value?.converter?.format
            };
        }
        if (valueFormats.series) {
            formats.series = {
                isDisplayed: valueFormats.series?.tooltipDisplay !== 'off',
                label: valueFormats.series?.tooltipLabel
            };
        }
        if (valueFormats.group) {
            formats.group = {
                isDisplayed: valueFormats.group?.tooltipDisplay !== 'off',
                label: valueFormats.group?.tooltipLabel
            };
        }
        return formats;
    }
});
